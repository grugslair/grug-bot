import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { settings } from '../../utils/helpers';

const fetchFloor = async (collectionName: string) => {``
    let url = `https://api.opensea.io/api/v1/collection/` + collectionName + `/stats`
    let res = await fetch(url, settings);

    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }

    let data = await res.json();

    return Number(data.stats.floor_price);
}

export = {
    data: new SlashCommandBuilder()
        .setName("floor")
        .setDescription("Look up the floor of a collection")
        .addStringOption(option =>
            option.setName('collection')
                .setDescription('Choose the collection to look up')
                .setRequired(true)
                .addChoice('Grug\'s Lair', 'grugslair')
                .addChoice('Realms', 'lootrealms')),
    async execute(message: any) {
        fetchFloor(message.options.getString('collection'))
            .then((floorPrice: any) => {
                message.channel.send(`Ser, the current floor price of ${message.options.getString('collection')} is ${floorPrice.toFixed(3)}Ξ`);
            })
            .catch((error: any) => message.channel.send(error.message));
    },
};