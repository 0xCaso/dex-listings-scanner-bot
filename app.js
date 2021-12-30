const ethers = require('ethers');
const fs = require('fs');
const Telegraf = require('telegraf').Telegraf;

const mnemonic = 'YOUR MNEMONIC PHRASE GOES HERE';
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const bot = new Telegraf('YOUR API TOKEN GOES HERE');

/*
	====================================================
	DEFINING DEXs AND NETWORKs INFO - ADD AN OBJECT HERE
	====================================================
*/

const netswap = {
	address: '0x70f51d68D16e8f9e418441280342BD43AC9Dff9f',
	rpcLink: 'https://andromeda.metis.io/?owner=1088',
	dex: 'Netswap'
};

const tethys = {
	address: '0x2CdFB20205701FF01689461610C9F321D1d00F80',
	rpcLink: 'https://andromeda.metis.io/?owner=1088',
	dex: 'Tethys'
};

const trisolaris = {
	address: '0xc66F594268041dB60507F00703b152492fb176E7',
    rpcLink: 'https://mainnet.aurora.dev/Fon6fPMs5rCdJc4mxX4kiSK1vsKdzc3D8k6UF8aruek',
    dex: 'Trisolaris'
};

const fuseswap = {
	address: '0x1d1f1A7280D67246665Bb196F38553b469294f3a',
    rpcLink: 'https://rpc.fuse.io',
    dex: 'Fuseswap'
};

const traderjoe = {
	address: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10',
    rpcLink: 'https://api.avax.network/ext/bc/C/rpc',
    dex: 'TraderJoe'
};

/*
	==============================================
	CONTRACT OBJECTS CREATION - ADD AN OBJECT HERE
	==============================================
*/

const netswapFactory = buildContract(netswap.address, netswap.rpcLink);
const tethysFactory = buildContract(tethys.address, tethys.rpcLink);
const trisolarisFactory = buildContract(trisolaris.address, trisolaris.rpcLink);
const fuseswapFactory = buildContract(fuseswap.address, fuseswap.rpcLink);
const traderjoeFactory = buildContract(traderjoe.address, traderjoe.rpcLink);

/*
	=============================================
	STARTING BOT - NO NEED TO MODIFY
	=============================================
*/

bot.start((context) => {
	/*
		=====================================================================
		LISTENING ON EVERY CONTRACT'S PAIR CREATION EVENT - NO NEED TO MODIFY
		=====================================================================
	*/
	console.log('Bot started.')
	context.reply('Scanning your favourite dexs...')

	netswapFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
	  logPairInfo(_token0, _token1, _pairAddress, netswap.rpcLink, netswap.dex, context);
	});

	tethysFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
	  logPairInfo(_token0, _token1, _pairAddress, tethys.rpcLink, tethys.dex, context);
	});

	trisolarisFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
	  logPairInfo(_token0, _token1, _pairAddress, trisolaris.rpcLink, trisolaris.dex, context);
	});

	fuseswapFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
	  logPairInfo(_token0, _token1, _pairAddress, fuseswap.rpcLink, fuseswap.dex, context);
	});

	traderjoeFactory.on('PairCreated', async (_token0, _token1, _pairAddress) => {
	  logPairInfo(_token0, _token1, _pairAddress, traderjoe.rpcLink, traderjoe.dex, context);
	});
})

bot.launch()

/*
	=============
	=============

	AUX FUNCTIONS

	=============
	=============
*/

function buildContract(_address, _rpcLink) {
  const provider = new ethers.providers.JsonRpcProvider(_rpcLink);
  const account = wallet.connect(provider);

  const factory = new ethers.Contract(
    _address,
    ['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'],
    account
  );

  return factory;
}

async function getTokenSymbol(_address, _rpcLink) {
  const provider = new ethers.providers.JsonRpcProvider(_rpcLink);
  const account = wallet.connect(provider);

  const token = new ethers.Contract(
    _address, 
    ["function symbol() view returns (string)"], 
    account
  );

  var symbol = await token.symbol();
  return '$' + symbol;
}

async function logPairInfo(_token0, _token1, _pairAddress, rpcLink, dex, context) {
  let symbol0 = await getTokenSymbol(_token0, rpcLink);
  let symbol1 = await getTokenSymbol(_token1, rpcLink);

  var msg = `
=============================
New ` + dex + ` pair detected
` + getDate() + `

` + symbol0 + ` : ${_token0}

` + symbol1 + ` : ${_token1}

pairAddress: ${_pairAddress}
=============================`;

  fs.appendFile('./logs/' + dex + '_log.txt', msg, function (err) {
    if (err) throw err;
    console.log(msg);
  });

  context.reply(msg);
}

function getDate() {
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  return dateTime;
}