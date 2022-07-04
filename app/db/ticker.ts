interface Tickers {
    name: string;
    project: string;
    collection: string;
    address: string;
  }
  
  export const tickers: Array<Tickers> = [
    {
        name: 'Realms (for Adventurers)',
        project: 'realmverse',
        collection: 'lootrealms',
        address: '0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d'
    },
    {
        name: 'Loot (for Adventurers)',
        project: 'realmverse',
        collection: 'lootproject',
        address: '0xFF9C1b15B16263C61d017ee9F65C50e4AE0113D7'
    },
    {
        name: 'Crypts and Caverns',
        project: 'realmverse',
        collection: 'crypts-and-caverns',
        address: '0x86f7692569914B5060Ef39aAb99e62eC96A6Ed45'
    }
]
