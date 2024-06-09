const { Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder} = require("discord.js");
const Whitelist = require("../../database/models/Registration");

const ALLOWED_IDS = ["newButton", "establishedButton"];

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!ALLOWED_IDS.includes(interaction.customId)) return;

        const registration = await Whitelist.findOne({where: {user_id: interaction.user.id}});
        if (registration !== null) return await interaction.reply({
            content: "`❌` Du bist bereits registriert.",
            ephemeral: true
        });

        const usernameInput = new TextInputBuilder()
            .setCustomId("usernameInput")
            .setMaxLength(16)
            .setMinLength(4)
            .setLabel("Minecraft Name")
            .setPlaceholder("Dein Minecraft Name")
            .setRequired(true)
            .setStyle(TextInputStyle.Short)

        switch (interaction.customId) {
            case "newButton":
                const newModal = new ModalBuilder()
                    .setTitle("Registrierung")
                    .setCustomId("newRegisterModal");

                const invitorInput = new TextInputBuilder()
                    .setCustomId("invitorInput")
                    .setPlaceholder("z.B. Discord: grafjojo oder Ingame: Grafjojo")
                    .setLabel("Wer hat dich eingeladen?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const usernameRow = new ActionRowBuilder().addComponents(usernameInput);
                const invitorRow = new ActionRowBuilder().addComponents(invitorInput);

                newModal.addComponents(usernameRow, invitorRow);

                await interaction.showModal(newModal);
                break;

            case "establishedButton":
                const establishedModal = new ModalBuilder()
                    .setTitle("Registrierung")
                    .setCustomId("establishedRegisterModal");

                const joinInput = new TextInputBuilder()
                    .setCustomId("joinInput")
                    .setPlaceholder("z.B. GigaCraft 3")
                    .setLabel("In welcher Season bist du beigetreten?")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                establishedModal.addComponents(
                    new ActionRowBuilder().addComponents(usernameInput),
                    new ActionRowBuilder().addComponents(joinInput),
                );

                await interaction.showModal(establishedModal);
                break;
        }
    }
}
