const { Events, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } = require("discord.js");
const Whitelist = require("../../database/models/Whitelist");
const registerUtils = require("../../registration/register-utils");
const {getMarkdownContent} = require("../../manager/markdown-handler");

const allowedId = ["assignRegistrationButton", "acceptRegistrationButton", "rejectRegistrationButton"];

/**
 * The admin-side for the registration process.
 */
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.inGuild()) return;
        if (!allowedId.includes(interaction.customId)) return;

        const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
        const registration = await Whitelist.findOne({where: {action_id:interaction.message.id}});

        if (!registration)
            return await interaction.reply({content: "Diese Registrierung konnte nicht gefunden werden.", ephemeral: true});

        // The stored message id is called action_id in the database therefore actionMessage.
        const actionMessage = await interaction.channel.messages.cache.get(interaction.message.id);

        const user = await guild.members.cache.get(registration.user_id);

        // The uuid is stored with hyphens by default.
        const formattedUuid = registration.user_id;

        const mod = await guild.members.cache.get(interaction.user.id);

        switch (interaction.customId) {
            case "assignRegistrationButton":

                registration.assignee_id = interaction.user.id;
                await registration.save();

                const buttonRow = new ActionRowBuilder()
                    .addComponents(
                        getAcceptButton(),
                        getRejectButton(),
                        registerUtils.getLabyButton(formattedUuid),
                        registerUtils.getProfileButton(formattedUuid)
                    );

                await actionMessage.edit({
                    content: "Die Registrierung wurde von <@" + mod.id + "> übernommen.",
                    components: [buttonRow]});

                await interaction.reply({content: "Du hast die Registrierung übernommen.", ephemeral: true});
                break;

            case "acceptRegistrationButton":

                if (mod.id !== interaction.user.id)
                    return interaction.reply({content: "Diese Registrierung wird von <@" + mod.id + "> bearbeitet.", ephemeral: true});

                registration.allow_to_join = true;
                await registration.save();

                await user.send(await getMarkdownContent("registration-accepted.md", {
                    userId: user.id,
                    modDisplayname: mod.displayName
                }));

                const newButtonRow = new ActionRowBuilder()
                    .addComponents(registerUtils.getLabyButton(formattedUuid), registerUtils.getProfileButton(formattedUuid));

                await actionMessage.edit({
                    content: "Die Registrierung von <@" + user.id + "> wurde von <@" + mod.id + "> akzeptiert.",
                    components: [newButtonRow]
                });
                await interaction.reply({content: "Du hast die Registrierung akzeptiert. <@" + user.id + "> wurde Informiert.", ephemeral: true});
                break;

            case "rejectRegistrationButton":

                const reasonModal = new ModalBuilder()
                    .setTitle("Registrierung ablehnen")
                    .setCustomId("reasonModal");

                const reasonInput = new TextInputBuilder()
                    .setCustomId("reasonInput")
                    .setStyle(TextInputStyle.Paragraph)
                    .setLabel("Grund")
                    .setPlaceholder("z.B. Unangebrachter Skin...")

                await interaction.showModal(reasonModal.addComponents(new ActionRowBuilder().addComponents(reasonInput)));
                break;
        }
    }
}

function getAcceptButton() {
    return new ButtonBuilder()
        .setCustomId("acceptRegistrationButton")
        .setLabel("Akzeptieren")
        .setStyle(ButtonStyle.Success);
}

function getRejectButton() {
    return new ButtonBuilder()
        .setCustomId("rejectRegistrationButton")
        .setLabel("Ablehnen")
        .setStyle(ButtonStyle.Danger);
}