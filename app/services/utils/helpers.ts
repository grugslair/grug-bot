import { openSeaConfig } from "../../config";

export const settings = {
    method: "GET",
    headers: {
        "X-API-KEY": openSeaConfig.openseaApiKey,
    },
};

export const buildMessage = async (openSeaEvent: any, sale: boolean) => {

    let description;

    const fields = [
        {
            name: "OPEN SEA",
            value: `[View On Open Sea](https://opensea.io/assets/0xfa9ed22ca5d329ecaee9347f72e18c1fc291471b/${openSeaEvent.asset.token_id})`,
            inline: true,
        },
    ];


    if (sale) {
        description = `has just been sold for ${openSeaEvent.total_price / 1e18}\u039E`;

        fields.push(
            {
                name: "From",
                value: `[${openSeaEvent.seller.user?.username || openSeaEvent.seller.address.slice(0, 8)
                    }](https://etherscan.io/address/${openSeaEvent.seller.address})`,
                inline: true,
            },
            {
                name: "To",
                value: `[${openSeaEvent.winner_account.user?.username ||
                    openSeaEvent.winner_account.address.slice(0, 8)
                    }](https://etherscan.io/address/${openSeaEvent.winner_account.address})`,
                inline: true,
            }
        );
    } else {
        description = `has just been listed for ${openSeaEvent.starting_price / 1e18
            }\u039E`;

        fields.push({
            name: "From",
            value: `[${openSeaEvent.seller.user?.username || openSeaEvent.seller.address.slice(0, 8)
                }](https://etherscan.io/address/${openSeaEvent.seller.address})`,
            inline: true,
        });
    }

    return {
        attributes: {
            title: openSeaEvent.asset.name,
            description: description,
            fields,
            image: {
                url: `${openSeaEvent.asset.image_url}`,
            }
        }
    };
};
