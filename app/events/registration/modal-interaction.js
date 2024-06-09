const {Events, EmbedBuilder, ActionRowBuilder} = require("discord.js");
const Whitelist = require("../../database/models/Registration");
const {formatUUID, getLabyButton, getProfileButton, getAssignButton} = require("../../registration/register-utils");
require('dotenv').config();

/**
 * The registration process for players.
 */
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
        const outputChannel = await guild.channels.cache.get(process.env.APPLICATION_OUTPUT_CHANNEL);

        switch (interaction.customId) {
            case "newRegisterModal":
                await interaction.reply({content: "`✅` Deine Antrag ist eingegangen, bitte warte auf die Freischaltung.", ephemeral: true});
                await sendRegistration(interaction, outputChannel, true);
                break;
            case "establishedRegisterModal":
                await interaction.reply({content: "`✅` Deine Antrag ist eingegangen, bitte warte auf die Freischaltung.", ephemeral: true});
                await sendRegistration(interaction, outputChannel, false);
                break;
        }
    }
}

/**
 * Sends the registration form to the output channel.
 */
async function sendRegistration(interaction, outputChannel, isNewPlayer) {

    const username = interaction.fields.getTextInputValue('usernameInput');

    const embed = new EmbedBuilder()
        .setColor("#764cdc")
        .setTitle(isNewPlayer ? "Registrierung eines neuen Spielers" : "Registrierung eines bestehenden Spielers")
        .addFields({name: "`🐌` Discord", value: "↳ `" + interaction.user.id + "`/<@" + interaction.user.id + ">"})
        .addFields({name: "`🐳` Minecraft Name", value: "↳ `" + username + "`"})
        .setTimestamp();

    if (isNewPlayer) {
        embed.addFields({
            name: "`🔗` Eingeladen von",
            value: "↳ `" + interaction.fields.getTextInputValue('invitorInput') + "`"
        });
    } else {
        embed.addFields({
            name: "`🚪` Beigetreten",
            value: "↳ `" + interaction.fields.getTextInputValue('joinInput') || "Nicht angegeben" + "`"
        });
    }

    // Fetch the UUID from the Mojang API.
    await getMinecraftProfile(username).then(async (uuid) => {
        const formattedUuid = formatUUID(uuid);

        embed.addFields({name: "`🔗` UUID", value: "↳ `" + formattedUuid + "`"});

        const message = await outputChannel.send({
            embeds: [embed], components: [
                new ActionRowBuilder().addComponents(getAssignButton(), getProfileButton(formattedUuid), getLabyButton(uuid))
            ]});

        await Whitelist.create({
            action_id: message.id,
            user_id: interaction.user.id,
            user_uuid: formattedUuid,
            assignee_id: null
        });

    }).catch((err) => {
        console.error(err);
        return interaction.editReply({
            content: "`❌` Ein Fehler ist aufgetreten. Bitte prüfe deine Angaben und versuche es erneut.",
            ephemeral: true
        });
    });
}

    /*

    const databaseUuid = await Whitelist.findOne({where: {user_uuid: formattedUuid}});
    if (databaseUuid !== null) return await interaction.editReply({
        content: "`❌` Der Spielername ist bereits registriert.",
        ephemeral: true
    });

    */


/**
 * Fetches the UUID from the Mojang API.
 * @param username The minecraft name
 * @returns uuid of the player
 */
async function getMinecraftProfile(username) {
    const URL = "https://api.mojang.com/users/profiles/minecraft/" + username;
    const response = await fetch(URL);
    const data = await response.json();
    return data.id;
}