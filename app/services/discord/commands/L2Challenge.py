import requests
import pandas as pd

ids = ['nft-worlds','crabada','lords','magic','rainbow-token-2','xpendium','unicorn-milk','immutable-x','illuvium','gods-unchained','splinterlands','decentral-games-ice','metis-token','skale','crypto-raiders','layer2dao','axie-infinity','dydx','loopring','omisego','cartesi','iotex']
data = []

for i in ids:

  market_url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={i}"
  price_url = f"https://api.coingecko.com/api/v3/coins/{i}/history?date=01-04-2022&localization=false"
  r = requests.get(market_url).json()
  p = requests.get(price_url).json()

  try:
    r[0]['buy_price'] = p['market_data']['current_price']['usd']
    data.append(r[0])
  except: 
    print(i,' data not found')
  
df = pd.DataFrame(data)
df = df[['symbol','name','buy_price','current_price']]
df['growth'] = (df['current_price'] / df['buy_price'] - 1 ) * 100
df = df.sort_values('growth', ascending = False, ignore_index = True)

response = '```'+df.to_string()+'```'
print(response)

