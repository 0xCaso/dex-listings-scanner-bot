# Dex Listings Scanner - Telegram Bot
A Telegram Bot which will notify you whenever a new pair is added on your favouirte DEXs. You can remove the DEX i put and add the ones you want, as long as you can find the URL RPC of the blockchain and the factory address (which creates the new token pairs) of the dex.

## Setup
1. Export your mnemonic private key from Metamask (preferably of an account you don't use, also it won't spend gas of course), and insert it on line 5 of app.js:
```
const mnemonic = 'YOUR MNEMONIC PHRASE GOES HERE';
```
2. On Telegram, search BotFather and create a bot. At the end of the procedure you'll find a key in this format:
```
7862412351:ABCdI2ujasdasguun38nuan8nin-512kjhi
```
    and insert it on line 7 of app.js:
```
const bot = new Telegraf('YOUR API TOKEN GOES HERE');
```