const {ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    getProfileButton(uuid) {
        return new ButtonBuilder()
            .setLabel("Mojang Profil")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    },

    getLabyButton(uuid) {
        return new ButtonBuilder()
            .setLabel("Laby.net")
            .setStyle(ButtonStyle.Link)
            .setURL(`https://laby.net/@${uuid}`);
    },

    getAssignButton() {
        return new ButtonBuilder()
            .setLabel("Zuweisen")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("assignRegistrationButton");
    },

    formatUUID(uuid) {
        return uuid.substring(0, 8) + "-" + uuid.substring(8, 12) + "-" + uuid.substring(12, 16) + "-" + uuid.substring(16, 20) + "-" + uuid.substring(20);
    },
};