import { Client, Intents, Collection } from "discord.js";
import fs from "fs";
import { discordConfig } from "../../config";
import cron from 'node-cron'
import listings from "./cron/listings";
import sales from "./cron/sales";
import { getPrice } from "./status/price"

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});


client.commands = new Collection();

const commandFiles = fs
    .readdirSync("app/services/discord/commands")
    .filter((file) => file.endsWith(".ts"));

client.once("ready", () => {
    for (const file of commandFiles) {
        let name = file.replace(".ts", ".js");
        const command = require(`./commands/${name}`);
        client.commands.set(command.data.name, command);
    }
    cron.schedule('*/2 * * * *', () => {
        sales.execute(client)
    });
    cron.schedule('*/2 * * * *', () => {
        listings.execute(client)
    });
    cron.schedule('*/2 * * * *', async () => {
        client.user?.setActivity(await getPrice(), { type: "WATCHING" })
    });

});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
        await interaction.reply({
            content: "wait...",
            ephemeral: true,
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
});


client.on('messageCreate', msg => {
    if (!msg.content.startsWith(discordConfig.prefix) || msg.author.bot) return;

    const args: any = msg.content.slice(discordConfig.prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
})

client.login(discordConfig.token);

export default client;
