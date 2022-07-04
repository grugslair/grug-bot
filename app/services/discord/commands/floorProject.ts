import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { tickers } from "../../../db/ticker";
import { settings } from '../../utils/helpers';
const { MessageEmbed } = require('discord.js');

interface OpenseaResponse {
    stats: {
        floor_price: number;
    }
}

interface FetchResult {
    name: string
    floor_price: number
}

const fetchMultipleFloor = async (projectName: string) => {``

    const result = tickers.filter((obj) => {
        return obj.project === projectName;
    });

    const arr : FetchResult[] = []

    for (let i = 0; i < result.length ; i++) {
        const collectionName = result[i].collection;
        let url = `https://api.opensea.io/api/v1/collection/` + collectionName + `/stats`
        let res = await fetch(url, settings);

        if (res.status == 404 || res.status == 400) {
            throw new Error("Error retrieving collection stats.");
        }
        if (res.status != 200) {
            throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
        }

        let data : OpenseaResponse = await res.json();
        arr.push({
            name        : result[i].name,
            floor_price : data.stats.floor_price
        })
    }
    return arr;
}

export = {
    data: new SlashCommandBuilder()
        .setName("floor_project")
        .setDescription("Look up the floor of collections from a project")
        .addStringOption(option =>
            option.setName('project')
                .setDescription('Choose the project to look up')
                .setRequired(true)
                .addChoice('Realmverse', 'realmverse')),
    async execute(message: any) {
        fetchMultipleFloor(message.options.getString('project'))
            .then((floorPrices: FetchResult[]) => {
                const listEmbed = new MessageEmbed()
                .setTitle(`NFT Collection Price for: ${message.options.getString('project')} project`)
                .addFields(
                    {
                        name: "Collection Name",
                        value: floorPrices.map(a => {
                            return a.name
                        }).join(`\n`),
                        inline: true
                    },
                    {
                      name: "Floor Price",
                      value: floorPrices.map(a => {
                        return a.floor_price
                    }).join(`\n`),
                      inline: true
                   }
                )
                message.channel.send({ embeds: [listEmbed] });
            })
            .catch((error: any) => message.channel.send(error.message));
    },
};

// export = {
//     async run(){
//         fetchMultipleFloor('Realmverse')
//             .then((floorPrices: FetchResult[]) => {

//                 const listEmbed = new MessageEmbed()
//                 .setTitle('Connected')
//                 .setDescription(`Total : ${floorPrices.length}`)
//                 .addFields(
//                     {
//                         name: "Name",
//                         value: floorPrices.map(a => {
//                             return a.name
//                         }),
//                         inline: true
//                     },
//                     {
//                       name: "Floor Price",
//                       value: floorPrices.map(a => {
//                         return a.floor_price
//                     }),
//                       inline: true
//                    }
//                 )
//                 message.channel.send(listEmbed);
//             })
//             .catch((error: any) => message.channel.send(error.message));
//     }
// }