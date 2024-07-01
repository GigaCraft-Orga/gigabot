const {Events} = require("discord.js");
const Whitelist = require("../../database/models/Registration");
const {getMarkdownContent} = require("../../manager/markdown-handler");

const allowedId = ["reasonModal"];

/**
 * The admin-side for the registration process.
 */
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (!allowedId.includes(interaction.customId)) return;

        const guild = await interaction.client.guilds.cache.get(process.env.GUILD_ID);
        const registration = await Whitelist.findOne({where: {action_id: interaction.message.id}});

        if (!registration)
            return await interaction.reply({
                content: "Diese Registrierung konnte nicht gefunden werden.",
                ephemeral: true
            });

        // The stored message id is called action_id in the database therefore actionMessage.
        const actionMessage = await interaction.channel.messages.cache.get(interaction.message.id);
        const user = await guild.members.cache.get(registration.user_id);
        const mod = await guild.members.cache.get(interaction.user.id);

        switch (interaction.customId) {
            case "reasonModal":

                await interaction.reply({
                    content: "Du hast die Registrierung abgelehnt. <@" + user.id + "> wurde Informiert.",
                    ephemeral: true
                });

                await user.send(await getMarkdownContent("registration-declined.md", {
                    user_id: user.id,
                    mod_id: mod.id,
                    response: interaction.fields.getTextInputValue("reasonInput")
                }));

                await actionMessage.delete();

                Whitelist.destroy({where: {action_id: interaction.message.id}});

                break;
        }
    }
}