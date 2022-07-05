require('dotenv').config();

export const twitterConfig = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || "",
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || "",
    access_token: process.env.TWITTER_ACCESS_TOKEN_KEY || "",
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || "",
};

export const discordConfig = {
    prefix: "!",
    client_id: process.env.DISCORD_CLIENT_ID || "",
    guild_id: process.env.DISCORD_GUILD_ID || "",
    token: process.env.DISCORD_TOKEN || "",
    salesChannel: process.env.DISCORD_SALES_CHANNEL,
    listingsChannel: process.env.DISCORD_LISTINGS_CHANNEL,
}

export const openSeaConfig = {
    openseaAssetUrl: "https://api.opensea.io/api/v1/asset",
    openseaEventsUrl: "https://api.opensea.io/api/v1/events",
    openseaApiKey: process.env.OPEN_SEA_API_KEY || "",
    collectionName: process.env.OPEN_SEA_COLLECTION_NAME,
    contractAddress: process.env.REALMS_CONTRACT_ADDRESS
}

export const ethereumConfig = {
    ethplorerApiKey: process.env.ETHPLORER_TOKEN,
    ethereumAddress: process.env.ETHEREUM_ADDRESS
}