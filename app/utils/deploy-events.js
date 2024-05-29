const path = require("node:path");
const fs = require("node:fs");

function deployEvents(client, parentFolder) {
    const eventsFolder = fs.readdirSync(parentFolder);

    for (const folder of eventsFolder) {
        const folderPath = path.join(parentFolder, folder);
        const eventFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const filePath = path.join(folderPath, file);
            deployEvent(filePath, client);
        }
    }
}

function deployEvent(filePath, client) {
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

module.exports = { deployEvents };
