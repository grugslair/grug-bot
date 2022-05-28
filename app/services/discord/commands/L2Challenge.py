print('....')

import requests
import pandas as pd

ids = ['nft-worlds','crabada','lords','magic','rainbow-token-2','xpendium','unicorn-milk','immutable-x','illuvium','gods-unchained','splinterlands','decentral-games-ice','metis-token','skale','crypto-raiders','layer2dao','axie-infinity','dydx','loopring','omisego','cartesi','iotex']

currents_url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={','.join(ids)}"
currents = requests.get(currents_url).json()

data = {}
for i in currents:
  data[i['id']] = [i['symbol'], i['name'], i['current_price']]

for i in ids:

  # histo_url = f'https://api.coingecko.com/api/v3/coins/{i}/ohlc?vs_currency=usd&days=90'
  # hist = requests.get(histo_url).json()
  
  buy_url = f"https://api.coingecko.com/api/v3/coins/{i}/history?date=01-04-2022&localization=false"
  buy = requests.get(buy_url).json()

  try:
    data[i].append(buy['market_data']['current_price']['usd'])
  except: 
    data[i].append(None)
df = pd.DataFrame.from_dict(data, orient='index', columns = ['symbol','name','current_price','buy_price'])

df['growth'] = (df['current_price'] / df['buy_price'] - 1 ) * 100
df = df.sort_values('growth', ascending = False, ignore_index = True)

response = '```'+df.to_string()+'```'
print(response)

