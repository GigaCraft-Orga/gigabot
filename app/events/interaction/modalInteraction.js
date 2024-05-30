const {Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const Whitelist = require("../../database/models/Whitelist");
const {formatUUID} = require("../../registration/register-utils");
require('dotenv').config();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
        const outputChannel = await guild.channels.cache.get(process.env.APPLICATION_OUTPUT_CHANNEL);

        switch (interaction.customId) {
            case "newRegisterModal":
                await interaction.reply({content: "`✅` Deine Registrierung war erfolgreich. Du wirst von mir informiert, sobald du freigeschaltet wurdest."});
                await sendRegistration(interaction, outputChannel, true);
                break;
            case "establishedRegisterModal":
                await interaction.reply({content: "`✅` Deine Registrierung war erfolgreich. Du wirst von mir informiert, sobald du freigeschaltet wurdest."});
                await sendRegistration(interaction, outputChannel, false);
                break;
            case "rejectRegistrationReply":
                break;
        }
    }
}

async function sendRegistration(interaction, outputChannel, isNewPlayer) {

    const embed = new EmbedBuilder()
        .setColor("#764cdc")
        .addFields({name: "`🐌` Discord", value: "↳ `" + interaction.user.id + "`/<@" + interaction.user.id + ">"})
        .addFields({name: "`🐳` Minecraft Name", value: "↳ `" + interaction.fields.getTextInputValue('usernameInput') + "`"})
        .setTimestamp();

    if (isNewPlayer) {
        embed.setTitle("Registrierung eines neuen Spielers");
        embed.addFields({
            name: "`🔗` Eingeladen von",
            value: "↳ `" + interaction.fields.getTextInputValue('invitorInput') + "`"});
    } else {
        embed.setTitle("Registrierung eines bestehenden Spielers");
        const joinInput = interaction.fields.getTextInputValue('joinInput') || "Nicht angegeben";
        embed.addFields({
            name: "`🚪` Beigetreten",
            value: "↳ `" + joinInput + "`"});
    }

    const url = "https://api.mojang.com/users/profiles/minecraft/" + interaction.fields.getTextInputValue('usernameInput') ;

    try {
        console.log("Fetching UUID from " + interaction.fields.getTextInputValue('usernameInput'));
        const response = await fetch(url);
        const data = await response.json();
        const uuid = data.id;
        const formattedUuid = formatUUID(uuid);
        console.log(uuid + " belongs to " + data.name);

        const databaseUuid = await Whitelist.findOne({where: {user_uuid: formattedUuid}});
        if (databaseUuid !== null) return await interaction.editReply({ content: "`❌` Der Spielername ist bereits registriert.", ephemeral: true});

        embed.addFields({name: "`🔗` UUID", value: "↳ `" + formattedUuid + "`"});

        const assignButton = new ButtonBuilder()
            .setLabel("Zuweisen")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("assignRegistrationButton");

        const profileButton = new ButtonBuilder()
            .setLabel("Mojang Profil")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://sessionserver.mojang.com/session/minecraft/profile/${formattedUuid}`);

        const labyButton = new ButtonBuilder()
            .setLabel("Laby.net")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://laby.net/@${uuid}`);

        const buttonRow = new ActionRowBuilder()
            .addComponents(assignButton, profileButton, labyButton);

        const message = await outputChannel.send({embeds: [embed], components: [buttonRow]});

        await Whitelist.create({
            action_id: message.id,
            user_id: interaction.user.id,
            user_uuid: formattedUuid,
            assignee_id: null,
            allow_to_join: false
        }).then(() => console.log("Registration of " + formattedUuid + " was successful."));


    } catch (e) {
        await interaction.editReply({
            content: `\`❌\` Der [angegebene Spieler](https://api.mojang.com/users/profiles/minecraft/${interaction.fields.getTextInputValue('usernameInput')}) konnte nicht gefunden werden. ` +
                "Bleibt der Fehler bestehen, melde dich bei Grafjojo.",
        });
        console.error(e);
    }
}