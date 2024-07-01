const {SlashCommandBuilder, ButtonStyle, EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Melde dich für GigaCraft an.'),
    async execute(interaction) {

        const agreeButton = new ButtonBuilder()
            .setCustomId("newButton")
            .setLabel("Ja, ich bin neu")
            .setStyle(ButtonStyle.Success);

        const declineButton = new ButtonBuilder()
            .setCustomId("establishedButton")
            .setLabel("Nein, ich habe bereits mitgespielt")
            .setStyle(ButtonStyle.Danger);

        const buttonRow = new ActionRowBuilder()
            .addComponents(agreeButton, declineButton);

        const embed = new EmbedBuilder()
            .setTitle("Neu bei GigaCraft?")
            .setFields(
                { name: "`⌚` Wartezeit", value: "Es wird versucht die Wartezeiten so gering wie möglich zu halten. " +
                        "Die Wartezeit für neue Spieler ist in der Regel länger als für Spieler die bereits auf GigaCraft gespielt haben. " +
                        "Nach maximal 24 Stunden erhältst du eine Antwort." },
                { name: "`✅` Angenommen", value: "Wurdest du angenommen, kannst du nach wenigen Sekunden den Server betreten. " +
                        "Ist das nicht der fall melde dich bei deinem Ansprechpartner." },
                { name: "`❌` Abgelehnt", value: "Wurde deine Bewerbung abgelehnt, erhältst du eine Nachricht weshalb. " +
                        "Eine negative Antwort bedeutet nicht das du Unerwünscht bist, wenn du es bist wird es dir gesagt." }
            )
            .setColor("#764cdc");

        await interaction.reply({ embeds: [embed] , components: [buttonRow], ephemeral: true });
    }
}
