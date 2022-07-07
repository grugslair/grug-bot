require('dotenv').config();
import { SlashCommandBuilder } from "@discordjs/builders";
const { Client } = require('@notionhq/client');
const { MessageEmbed } = require('discord.js');

interface FetchResult {
  name: string
  date: {
    start: Date
    end: Date
    timezone: string
  }
}[]

const notion = new Client({ 
    auth: process.env.NOTION_TOKEN 
});

const fetchBounty = async () => {
  
  const databaseId = process.env.NOTION_DATABASE_EVENT;
  const arr : FetchResult[] = [];
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'Date',
        direction: 'ascending'
      }
    ]
  });
  
  for (let i = 0; i < response.results.length; i++) {

    const name = response.results[i].properties.Name?.title[0]?.plain_text || 'N/A'
    const date = response.results[i].properties.Date?.date || 'N/A'

    arr.push({
      name,
      date,
    });
  }
  return arr;
}

export = {
  data: new SlashCommandBuilder()
      .setName("event")
      .setDescription("Retrieve list of future Grug's Lair events"),
  async execute(message: any) {
      fetchBounty()
          .then((eventList: FetchResult[]) => {

            const listEmbed = new MessageEmbed()
                .setTitle(`Upcoming Events for the Lair`)
                .addFields(
                  {
                      name: "Event",
                      value: eventList.map(a => {
                          return a.name
                      }).join(`\n`),
                      inline: true
                  },
                  {
                    name: "Date",
                    value: eventList.map(a => {
                      const date_start = new Date(a.date.start).getTime()/1000
                      const date_end = new Date(a.date.end).getTime()/1000
                        if (a.date.end) {
                          return `<t:${date_start}:D> to <t:${date_end}:D>`
                        } else if (a.date.start) {
                          return `<t:${date_start}:D>`
                        } else {
                          return ''
                        }
                    }).join(`\n`),
                    inline: true
                  }
                )
                message.channel.send({ embeds: [listEmbed] });
          })
          .catch((error: any) => message.channel.send(error.message));
    }
};