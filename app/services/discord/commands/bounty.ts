require('dotenv').config();
import { SlashCommandBuilder } from "@discordjs/builders";
const { Client } = require('@notionhq/client');
const { MessageEmbed } = require('discord.js');

interface FetchResult {
  name: string
  bounty?: string
  taker?: string
  reviewer?: string
  pic?: string
  status?: string
  priority?: string
}[]

const notion = new Client({ 
    auth: process.env.NOTION_TOKEN 
});

const fetchBounty = async () => {
  
  const databaseId = '5d3dd78f98f5457987704263f2bb3f21';
  const arr : FetchResult[] = [];
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: 'Status',
          select: {
            equals: 'Backlog'
          },
        },
        {
          property: 'Status',
          select: {
            equals: 'In Progress'
          }
        }
      ]
    }
  });
  
  for (let i = 0; i < response.results.length; i++) {
    
    const name = response.results[i].properties.Name.title[0]?.plain_text || 'N/A'
    const bounty = response.results[i].properties.Bounty.rich_text[0]?.plain_text || 'N/A'
    const taker = response.results[i].properties.Taker?.select?.name || 'N/A'
    const reviewer = response.results[i].properties.Reviewer?.select?.name || 'N/A'
    const pic = response.results[i]['Q&A PIC']?.select?.name || 'N/A'
    const status = response.results[i].properties.Status?.select?.name || 'N/A'
    const priority = response.results[i].properties.Priority?.select?.name || 'N/A'

    arr.push({
      name,
      bounty,
      taker,
      reviewer,
      pic,
      status,
      priority
    });
  }
  return arr;
}

export = {
  data: new SlashCommandBuilder()
      .setName("bounty")
      .setDescription("Check on going bounty")
      .addStringOption(option =>
          option.setName('project')
              .setDescription('Choose the project check')
              .setRequired(true)
              .addChoice('Grug Bot', 'grugbot')),

  async execute(message: any) {
    if(message.options.getString('project') === 'grugbot') {
      fetchBounty()
          .then((ongoingBounty: FetchResult[]) => {

            const listEmbed = new MessageEmbed()
                .setTitle(`List of ongoing bounty for ${message.options.getString('project')} project`)
                .addFields(
                  {
                      name: "Task",
                      value: ongoingBounty.map(a => {
                          return a.name
                      }).join(`\n`),
                      inline: true
                  },
                  {
                    name: "Bounty",
                    value: ongoingBounty.map(a => {
                        return a.bounty
                    }).join(`\n`),
                    inline: true
                  },
                  {
                    name: "Taker",
                    value: ongoingBounty.map(a => {
                        return a.taker
                    }).join(`\n`),
                    inline: true
                  },
                  {
                    name: "For more details, please visit",
                    value: 'https://grugslair.notion.site/Grug-Bot-Bounty-b08caaf5ff5440b0a7594cb69437e4ec',
                    inline: false
                  }
                )
                message.channel.send({ embeds: [listEmbed] });
          })
          .catch((error: any) => message.channel.send(error.message));
    }
  },
};