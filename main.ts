import {tokenABI} from "./lib/tokenABI";
import {tokenAddreses} from "./lib/tokenAddreses";
import * as fs from 'fs';
let Web3 = require("web3")

const web3 = new Web3("https://cloudflare-eth.com")
const tokenAddresses = tokenAddreses
const myAddress = '0xA145ac099E3d2e9781C9c848249E2e6b256b030D';

let res: object[] = []

// get balance of top tokens
const get_balances = async () => {
    await Promise.all(tokenAddresses.map(async (token) => {
        try {
            const tokenInst = new web3.eth.Contract(tokenABI, token.address);
            const balance = await tokenInst.methods.balanceOf(myAddress).call()
            res.push({
                "balance": balance,
                "token" : token.symbol
            })
        }catch (e){
            console.log(e)
        }
    }));
}



async function fetch_assets_balances(){

    await web3.eth.getBalance(myAddress).then((res:string) => {
        fs.writeFile('result.txt', '', function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
        fs.appendFile(
            './result.txt',
            "Ether balance :" + JSON.stringify(res) + "\n",
            function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
    })

    await get_balances().finally(() => {
        fs.appendFile('result.txt', '[', function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
        res.map(token => {
            fs.appendFile(
                'result.txt',
                JSON.stringify(token, null, 2) + ',\n',
                function (err) {
                    if (err) {
                        console.error('Crap happens');
                    }
                }
            );
        })
        fs.appendFile('result.txt', ']', function (err) {
                if (err) {
                    console.error('Crap happens');
                }
            }
        );
    })
    res = []
}

fetch_assets_balances().then(() => {
    res = [];
    setInterval(fetch_assets_balances, 60000)
})
