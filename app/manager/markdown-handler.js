const fs = require("node:fs");
const path = require("node:path");

async function getMarkdownContent(fileName, args) {
    const files = fs.readdirSync("messages");

    for (const file of files) {
        if (file === fileName) {
            try {
                let data = fs.readFileSync(path.join("messages", fileName), "utf8");
                for (const key in args) {
                    const pattern = `{${key}}`;
                    const placeholder = new RegExp(pattern, "g");
                    data = data.replace(placeholder, args[key]);
                }
                return data;
            } catch (err) {
                return console.error("Cannot read " + fileName + " in " + path + " due to " + err + ".");
            }
        }
    }
}

module.exports = { getMarkdownContent };