import { SlashCommandBuilder } from "@discordjs/builders";
import fs from 'node:fs'
  
let { PythonShell } = require("python-shell");
  
const competitions_data = fs.readdirSync('app/services/discord/commands/competitions_data').filter(file => file.endsWith('.txt'));

export = {
    data: new SlashCommandBuilder()
        .setName("competition")
        .setDescription("Standings of Grug\'s Lait Trading Competition")
        .addStringOption(option =>{
            option.setName('competition')
                .setDescription('Select competition')
                .setRequired(true)
                // .addChoice('L2 Trading Competition April-May 2022__', 'AprilMay2022')
                // .addChoice('Metaverse Trading Competition December 2021__', 'December2021')
                // .addChoice('Script Test', 'ScriptTest')
                for(const comp of competitions_data){
                    option.addChoice(comp.slice(0,-4), comp)
                }
                return option
            }

            )
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Select mode')
                .addChoice('See final historical report', 'HistoricalReport')
                .addChoice('See final historical table', 'Historical')
                .addChoice('Compare to current prices', 'Current')
        ),
            
    async execute(message: any) {
        let compet = message.options.getString('competition')
        let mode = message.options.getString('mode')  
        
        const allFileContents = fs.readFileSync('app/services/discord/commands/competitions_data/'+compet, 'utf-8');
        const answer = allFileContents.split(/\r?\n/);

        if (mode == 'HistoricalReport'){
            message.channel.send(answer[3].split('\\n').join('\n'))
                .catch((error: any) => message.channel.send(error.message))
            message.channel.send(answer[4].split('\\n').join('\n'))
                .catch((error: any) => message.channel.send(error.message))                       
            message.channel.send({
                embeds: [{
                    fields: [{
                    name: "Full results by time",
                    value: answer[5],
                    inline: true}]
                }]
            })
            .catch((error: any) => message.channel.send(error.message))
        }
        else if (mode == 'Historical'){
            message.channel.send(answer[3].split('\\n').join('\n'))
                .catch((error: any) => message.channel.send(error.message))
            message.channel.send(answer[4].split('\\n').join('\n'))
                .catch((error: any) => message.channel.send(error.message))                       
        }

        // else if (compet == 'December2021'){
        //     message.channel.send('```   symbol                 name  final_price    buy_price     growth\n0    etna         ETNA Network     0.137045     0.143029  -4.184042\n1     eth             Ethereum  4036.549718  4637.121617 -12.951394\n2     ice  Decentral Games ICE     0.120358     0.142760 -15.692320\n3    meda             Medacoin     0.000462     0.000615 -24.837561\n4    waxp                  WAX     0.463442     0.679565 -31.803198\n5    hero             Metahero     0.151398     0.222104 -31.834905\n6    soul            Phantasma     2.254409     3.587407 -37.157721\n7     vra             Verasity     0.035332     0.057580 -38.637908\n8     ufo           UFO Gaming     0.000025     0.000041 -39.219837\n9     pkr               Polker     0.113465     0.227219 -50.063566\n10  atlas           Star Atlas     0.095055     0.192760 -50.687157\n11   riot          Riot Racers     0.435749     0.945897 -53.932702\n12   gaia       Gaia Everworld     0.489138     1.062138 -53.947813\n13   atri                Atari     0.065645     0.146335 -55.140415\n14  mars4                MARS4     0.023523     0.052699 -55.363788\n15   vibe                 VIBE     0.039227     0.100578 -60.997857\n16   dark       Dark Frontiers     0.623954     1.642410 -62.009861\n17    xtm                Torum     0.689605     1.998988 -65.502276```')
        //         .catch((error: any) => message.channel.send(error.message))
        //     message.channel.send('The winners were: \n 1. $ETNA, xoxoxd \n ~~2. $ETH, Grug~~ \n 2. $ICE, IceQueen \n 3. $MEDA, Chaotenstar')
        //         .catch((error: any) => message.channel.send(error.message))                       
        //     message.channel.send({
        //         embeds: [{
        //             fields: [{
        //             name: "Full results by time",
        //             value: "are availible [here](https://datapane.com/reports/0AEvn93/metaverse-competition-december-2021/)",
        //             inline: true}]
        //         }]
        //         })
        //         .catch((error: any) => message.channel.send(error.message))
        // }

        else {
            let options = {
                mode: "text",
                args: [compet]
            };
                PythonShell.run("app/services/discord/commands/CompetitionCurrent.py", options, function (err: any, results: any) {
                if (err) message.channel.send(err);
                let result = results.join('\n');
                message.channel.send(result)
                    .catch((error: any) => message.channel.send(error.message))
            });
    }          
    },
};
