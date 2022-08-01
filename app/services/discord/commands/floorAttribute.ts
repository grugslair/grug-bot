import { SlashCommandBuilder } from "@discordjs/builders";
const { MessageActionRow , MessageSelectMenu } = require('discord.js');
const AsciiTable = require('ascii-table');
const sdk = require('api')('@reservoirprotocol/v1.0#sdk16nl65dxbkg');

sdk.auth('demo-api-key');
sdk.server('https://api.reservoir.tools');

const fetchAttributes = async (slug: string) => {
    return sdk.getCollectionV3({
        slug,
        Accept: '*/*'
    })  
    .then((res: any) => {
        const collectionId = res.collection.id
        const collectionName = res.collection.name
        const collectionAttributes = res.collection.attributes.map((a: any) => a.key).sort((a:string, b:string) => a.localeCompare(b));
        return { collectionId, collectionName, collectionAttributes }
    })
    .catch((err: any) => {
        console.error(err)
        return
    });
}

const fetchFloorAttributes = async (collection: string, attributeKey: string) => {
    const table = new AsciiTable()
    table.setHeading('Attributes', 'Count', 'On Sale', 'Floor Price', 'Last Sell')

    return sdk.getCollectionsCollectionAttributesExploreV3({
        collection,
        attributeKey, 
        includeTopBid: true, 
        maxFloorAskPrices: 5,
        maxLastSells: 1,
        limit: 100,
        sortBy: 'floorAskPrice',
        Accept: '*/*'
    })  
    .then((res: any) => {
        res.attributes.sort((a: any,b: any) => b.tokenCount - a.tokenCount);
        for (var i = 0; i < res.attributes.length; i++) {
            table.addRow(res.attributes[i].value, res.attributes[i].tokenCount, res.attributes[i].onSaleCount , res.attributes[i].floorAskPrices[0], res.attributes[i].lastSells[0]?.value)}
        return table
    })
    .catch((err: any) => {
        console.error(err)
        return
    });
}

export = {
    data: new SlashCommandBuilder()
        .setName("floor_atttribute")
        .setDescription("Look up the floor of collections from a project, grouped by attribute")
        .addStringOption(option =>
            option
                .setName('collection')
                .setDescription('input the contract slug of collection (i.e lootrealms)')
                .setRequired(true)
        ),
    
    
        async execute(message: any) {
        fetchAttributes(message.options.getString('collection'))
            .then((result:any) => {
                let row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                ); 

                for (var i = 0; i < result.collectionAttributes.length; i++) {
			        row.components[0].addOptions([{
							label: `${result.collectionAttributes[i]}`,
							value: `${result.collectionAttributes[i]}`,
						}]);
                    }  
                    
                const filter = (interaction: any) => 
                    interaction.isSelectMenu() 

                const collector = message.channel.createMessageComponentCollector({
                    filter,
                    max: '1',
                });

                message.channel.send({ content: `Choose floor filter of ${result.collectionName}` , components: [row] });

                collector.on('collect', async (collected: any) => {
                    const value = collected.values[0];
                    fetchFloorAttributes(result.collectionId, value)
                    .then((res:any) => {
                        let table = res.toString();
                        console.log(table)
                        if (table.length > 1900) {
                            table = table.substring(0,1900)
                        }
                        
                        console.log(table)
                        message.channel.send(`Floor price of **${message.options.getString('collection')}** with attribute filter **${value}**` + "```\n" + table + "\n```")
                            collected.message.delete();
                    })
                    .catch(() => console.log('No interaction were collected'))
                })
            })
            .catch((error: any) => message.channel.send(error.message));
    },
}