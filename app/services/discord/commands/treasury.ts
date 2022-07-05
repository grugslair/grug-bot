import fetch from 'node-fetch';
// import { SlashCommandBuilder } from "@discordjs/builders";
import { settings } from '../../utils/helpers';
import { ethereumConfig } from "../../../config"; 

const fetchTreasury = async () => {

    let url = `https://api.ethplorer.io/getAddressInfo/${ethereumConfig.ethereumAddress}/?apiKey=${ethereumConfig.ethplorerApiKey}`
    let res = await fetch(url, settings);
    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }

    let data = await res.json();
    console.log(data)
    return data;
}

export = {
    fetchTreasury
}