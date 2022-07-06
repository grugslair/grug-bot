import fetch from 'node-fetch';
import { SlashCommandBuilder } from "@discordjs/builders";
import { settings } from '../../utils/helpers';
import { ethereumConfig } from "../../../config"; 
const { MessageEmbed } = require('discord.js');

interface TokenInfo {
    name: string
    symbol: string
    decimals: number
    price: {
        rate: number
    }
}   

interface FetchResult {
    address: string
    ETH: {
        price: {
            rate: number
        }
        balance: number
    }
    tokens: {
        tokenInfo: TokenInfo 
        balance: number 
    }[]
}

interface PushResult {
    token_name: string
    token_symbol: string
    token_price: number
    token_balance: number
    token_balance_usd: number
}

const fetchTreasuryToken = async () => {
    const arr : PushResult[] = [] 
    let url = `https://api.ethplorer.io/getAddressInfo/${ethereumConfig.ethereumAddress}/?apiKey=${ethereumConfig.ethplorerApiKey}`
    let res = await fetch(url, settings);
    if (res.status == 404 || res.status == 400) {
        throw new Error("Error retrieving collection stats.");
    }
    if (res.status != 200) {
        throw new Error(`Couldn't retrieve metadata: ${res.statusText}`);
    }
    let data : FetchResult = await res.json();
    arr.push({
        token_name          : 'Ethereum',
        token_symbol        : 'ETH',
        token_price         : data.ETH.price.rate,
        token_balance       : data.ETH.balance,
        token_balance_usd   : data.ETH.balance * data.ETH.price.rate
    });

    for (let i = 0; i < data.tokens.length; i++) {
        let tokenInfo: TokenInfo = data.tokens[i].tokenInfo
        if (tokenInfo.price.rate) {
            arr.push({
                token_name          : tokenInfo.name,
                token_symbol        : tokenInfo.symbol,
                token_price         : tokenInfo.price.rate || 0,
                token_balance       : data.tokens[i].balance / (10 ** tokenInfo.decimals),
                token_balance_usd   : data.tokens[i].balance / (10 ** tokenInfo.decimals) * tokenInfo.price.rate || 0
            })
        }
    }
    arr.sort((a,b) => b.token_balance_usd - a.token_balance_usd);
    return arr;
}

export = {
    data: new SlashCommandBuilder()
        .setName("treasury")
        .setDescription("Check Grug's Lair Treasury Balance on ")
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Choose category')
                .setRequired(true)
                .addChoice('ERC20', 'erc20')),
    async execute(message: any) {

        if(message.options.getString('category') === 'erc20') {
            
            fetchTreasuryToken()
            .then((tokenBalances: PushResult[]) => {
                const listEmbed = new MessageEmbed()
                .setTitle(`Grug's Lair Treasury Balance on ${message.options.getString('category')}`)
                .addFields(
                    {
                        name: "Symbol",
                        value: tokenBalances.map(a => {
                            return a.token_symbol
                        }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Token Name",
                        value: tokenBalances.map(a => {
                            return a.token_name
                        }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Token Price",
                        value: tokenBalances.map(a => {
                        return a.token_price.toFixed(6).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                    }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Symbol",
                        value: tokenBalances.map(a => {
                            return a.token_symbol
                        }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Token Balance",
                        value: tokenBalances.map(a => {
                        return a.token_balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                    }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Balance (in USD)",
                        value: tokenBalances.map(a => {
                        return a.token_balance_usd.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                    }).join(`\n`),
                        inline: true
                    },
                    {
                        name: "Total Balance (in USD)",
                        value: tokenBalances.reduce((accumulator, object) => {
                            return accumulator + object.token_balance_usd;
                          }, 0).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                    }
                )
                message.channel.send({ embeds: [listEmbed] });
            })
            .catch((error: any) => message.channel.send(error.message));
        }
    },
}