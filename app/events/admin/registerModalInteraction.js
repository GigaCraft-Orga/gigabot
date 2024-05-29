const {Events} = require("discord.js");
const Register = require("../../database/models/Register");
const {getMarkdownContent} = require("../../manager/markdown-handler");

const allowedId = ["reasonModal"];

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (!interaction.inGuild()) return;
        if (!allowedId.includes(interaction.customId)) return;

        const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
        const registration = await Register.findOne({where: {action_id: interaction.message.id}});

        if (!registration)
            return await interaction.reply({
                content: "Diese Registrierung konnte nicht gefunden werden.",
                ephemeral: true
            });

        // The stored message id is called action_id in the database therefore actionMessage.
        const actionMessage = await interaction.channel.messages.cache.get(interaction.message.id);

        const user = await guild.members.cache.get(registration.user_id);

        // The uuid is stored with hyphens by default.
        const formattedUuid = registration.user_id;

        const mod = await guild.members.cache.get(interaction.user.id);
        const modChannel = await guild.channels.cache.get(process.env.APPLICATION_OUTPUT_CHANNEL);

        switch (interaction.customId) {
            case "reasonModal":

                await interaction.reply({
                    content: "Du hast die Registrierung abgelehnt. <@" + user.id + "> wurde Informiert.",
                    ephemeral: true
                });

                await user.send(await getMarkdownContent("registration-declined.md", {
                    userId: user.id,
                    modDisplayname: mod.displayName,
                    message: interaction.fields.getTextInputValue("reasonInput")
                }));

                await actionMessage.delete();

                Register.destroy({where: {action_id: interaction.message.id}});

                break;
        }
    }
}