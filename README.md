# Dex Listings Scanner - Telegram Bot
This is a Telegram bot which will notify you whenever a new pair is added on your favouirte DEXs. 

## Description
The script is listening for the event "PairCreated" emitted from the factory contract of the DEX. Whenever this happens, a log with all the info will be written into a text file, and a message to the bot will be sent.

You can remove the DEX I've put and add the ones you want, as long as you can find the URL RPC of the blockchain and the factory address of the DEX.

## Setup
1. Export your mnemonic private key from Metamask (preferably of an account you don't use, also it won't spend gas of course), and insert it on line 5 of app.js:
```
const mnemonic = 'YOUR MNEMONIC PHRASE GOES HERE';
```
2. On Telegram, search BotFather and create a bot. At the end of the procedure you'll find a key in a format like 7862412351:ABCdI2ujasdasguun38nuan8nin-512kjhi and insert it on line 7 of app.js:
```
const bot = new Telegraf('YOUR API TOKEN GOES HERE');
```
3. If you want to add a DEX you want to scan, you have 3 things to do:
- Create an object with DEX factory contract address, URL RPC of its blockchain and its name. Example:
```
const traderjoe = {
  address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
  rpcLink: 'https://api.avax.network/ext/bc/C/rpc',
  dex: 'TraderJoe'
};
```
- Create the contract object. Example:
```
const netswapFactory = buildContract(netswap.address, netswap.rpcLink);
```
- Add the listening and log creation. Example:
```
traderjoeFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
  logPairInfo(_token0, _token1, _pairAddress, traderjoe.rpcLink, traderjoe.dex, context);
});
```

## Find the factory address of the DEX and the URL RPC of the blockchain
#### Address
Let's say you know the DEX you want to add. To find the address, usually you can just go to its docs and you'll probably find a section with all the contracts addresses listed. Example: [Trader Joe Docs](docs.traderjoexyz.com/main/the-project/contracts).
#### URL RPC
If you have already add the blockchain on Metamask, you can go to select a network, then go to "Add Network". Press "Cancel" and then you'll find "New RPC URL".