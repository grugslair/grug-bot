import requests
import sys

file_name = 'app/services/discord/commands/competitions_data/'+sys.argv[1]

with open(file_name) as file:
    lines = file.readlines()
    lines = [line.rstrip() for line in lines]
# print(lines[0],lines[1],lines[2])

ids = lines[0].split('=')[1].lstrip().split(',')
start_date = lines[1].split('=')[1].lstrip()
end_date = lines[2].split('=')[1].lstrip()

# ids = ['nft-worlds','crabada','lords','magic','rainbow-token-2','xpendium','unicorn-milk','immutable-x','illuvium','gods-unchained','splinterlands','decentral-games-ice','metis-token','skale','crypto-raiders','layer2dao','axie-infinity','dydx','loopring','omisego','cartesi','iotex']

currents_url = f"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids={','.join(ids)}"
currents = requests.get(currents_url).json()

data = {}
for i in currents:
  data[i['id']] = [i['symbol'], i['name'], i['current_price']]

print("Start fetching data")

for i in ids:
  # histo_url = f'https://api.coingecko.com/api/v3/coins/{i}/ohlc?vs_currency=usd&days=90'
  # hist = requests.get(histo_url).json() 
  buy_url = f"https://api.coingecko.com/api/v3/coins/{i}/history?date=01-04-2022&localization=false"

  print("q")

  buy = requests.get(buy_url).json()
  print("qq")

  try:
    data[i].append(buy['market_data']['current_price']['usd'])
    print("f")
  except: 
    data[i].append(None)


for k, v in data.items():
  v.append((v[-2]/v[-1]-1)*100)

data_sorted = [[i, v[1], f'{v[2]:.4}',  f'{v[3]:.4}',  f'{v[4]:.3}'] for i, (k, v) in enumerate(sorted(data.items(), key=lambda item: item[1][-1], reverse=True))]

s = [[str(e) for e in row] for row in data_sorted]
lens = [max(map(len, col)) for col in zip(*s)]
fmt = '\t'.join('{{:{}}}'.format(x) for x in lens)
table = [fmt.format(*row) for row in s]
print( '```'+'\n'.join(table)+'```')

