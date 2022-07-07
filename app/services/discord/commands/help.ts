import { SlashCommandBuilder } from "@discordjs/builders";
const { Client } = require('@notionhq/client');
const { MessageEmbed } = require('discord.js');

const notion = new Client({ 
    auth: process.env.NOTION_TOKEN 
});

interface Commands {
    command: string
    description: string
  }[]

const fetchCommands = async () => {
  
    const databaseId = '02dc444cb8214ac9b8bfe7aafd07b495';
    const arr : Commands[] = [];
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    for (let i = 0; i < response.results.length; i++) {
      
      const command = response.results[i].properties.Command.title[0]?.plain_text || 'N/A'
      const description = response.results[i].properties.Description.rich_text[0]?.plain_text || 'N/A'

      arr.push({
        command,
        description,
      });
    }

    // Sort asscending list of commands
    arr.sort((a, b) => {
        return a.command.localeCompare(b.command, 'en', { sensitivity: 'base' });
      });
      console.log(arr)
    return arr;
  }
  
  export = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Retrieve all list of available Grug Bot command"),
        
    async execute(message: any) {
        fetchCommands()
            .then((list: Commands[]) => {
  
              const listEmbed = new MessageEmbed()
                  .setTitle(`List of Grug Bot commands`)
                  .addFields(
                    {
                        name: "Command",
                        value: list.map(a => {
                            return a.command
                        }).join(`\n`),
                        inline: true
                    },
                    {
                      name: "Description",
                      value: list.map(a => {
                          return a.description
                      }).join(`\n`),
                      inline: true
                    }
                  )
                  message.channel.send({ embeds: [listEmbed] });
            })
            .catch((error: any) => message.channel.send(error.message));
    },
  };