import { SlashCommandBuilder } from "@discordjs/builders";
const { MessageEmbed } = require('discord.js');

export = {
     data: new SlashCommandBuilder()
        .setName("quest")
        .setDescription("Retrieve list of on-going quest on crew3"),
    async execute(message: any) {
        const listEmbed = new MessageEmbed()
            .setTitle(`CREW3 $ROCKS Rewards`)
            .setDescription('We are using Crew3 platform for community rewards')
            .addField('Fellow Grugs can check ongoing quest using the link below:','https://grugslair.crew3.xyz/questboard',false)
            .addField('To check XP leaderboard:','https://grugslair.crew3.xyz/leaderboard',false)
            .setFooter({text: 'Thank you for your support', iconURL: 'https://cdn.discordapp.com/emojis/934843136482611260.webp?size=44&quality=lossless'})
            message.channel.send({ embeds: [listEmbed] });
    }
}