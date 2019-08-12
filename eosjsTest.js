const network = {
    kylin: "https://api-kylin.eosasia.one",
    local: "http://localhost:8888",
    jungle: "http://jungle2.cryptolions.io:80"
};
const users = {
    kylin: {
        weragune24nn: "weragune24nn",
        eosio: "eosio",
        eosioToken: "eosio.token"
    },
    jungle: {
        jwqnka13noaq: "jwqnka13noaq",
        tqweqwms23m3: "tqweqwms23m3"
    },
    local: {
        test: "test",
        eosio: "eosio",
        eosioToken: "eosio.token",
        recreate: "recreate",
        hi: "hi",
        hello: "hello",
        eosjs: "eosjs",
        eosjs2: "eosjs2"
    }
};
const contract = {
    kylin: {
        weragune24nn: {
            code: "weragune24nn",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        },
        eosio: {
            code: "eosio",
            table: {
            }
        },
        eosioToken: {
            code: "eosio.token",
            table: {
                accounts: "accounts",
                stats: "stats"
            }
        }
    },
    jungle:{
        jwqnka13noaq: {
            code: "jwqnka13noaq",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        },
        tqweqwms23m3: {
            code: "tqweqwms23m3",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        }
    },
    local: {
        weragune24nn: {
            code: "weragune24nn",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        },
        eosio: {
            code: "eosio",
            table: {
            }
        },
        eosioToken: {
            code: "eosio.token",
            table: {
                accounts: "accounts",
                stats: "stats"
            }
        },
        eosjs: {
            code: "eosjs",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        },
        eosjs2: {
            code: "eosjs2",
            action: {
                upload: "upload",
                articlelist: "articlelist",
                hi: "hi"
            },
            table: {
                setm: "setm"
            }
        }
    }
};

const fs = require('fs');

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
const { Serialize } = require(`eosjs`);

// const { TextEncoder, TextDecoder } = require('text-encoding');      // React Native, IE11, and Edge Browsers only

const privateKeys = ["5JdQRKiTgxEvZeVYMz11UN68cSfzYvsUL7bAjbHV7U8hmyJKohr"]; //Local eosjs
// const privateKeys = ["5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X"]; //Jungle jwqnka13noaq

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8888', { fetch });
// const rpc = new JsonRpc('http://jungle2.cryptolions.io:80', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const buffer = new Serialize.SerialBuffer({
    textEncoder: api.textEncoder,
    textDecoder: api.textDecoder,
});


async function eos_get_table_rows(code, scope, table, limit){
    codeStr= String(code);
    scopeStr = String(scope);
    tableStr = String(table);
    limitNum = String(limit);

    const resp = await rpc.get_table_rows({
        json: true,              // Get the response as json
        code: codeStr,     // Contract that we target
        scope: scopeStr,         // Account that owns the data
        table: tableStr,        // Table name
        limit: limitNum,               // Maximum number of rows that we want to get
        // reverse = false,         // Optional: Get reversed data
        // show_payer = false,      // Optional: Show ram payer
    });
    
    console.log(resp.rows);
}

async function eos_get_info(){
    console.log(await rpc.get_block(1));
}

async function eos_get_account(account_name){
    accountStr = String(account_name);
    console.log(await rpc.get_account(accountStr));
}

async function eos_set_abi(account, contract){
    const accountStr = String(account);
    const contractStr = String(contract);
    const contractFile = __dirname + "/" + contractStr + ".abi"
    console.log(contractFile);
    // const abiLocation = path(contractFile);
    const abiLocation = contractFile;

    let abi = JSON.parse(fs.readFileSync(abiLocation), `utf8`);
    const abiDefinition = api.abiTypes.get(`abi_def`)
    // need to make sure abi has every field in abiDefinition.fields
    // otherwise serialize throws
    abi = abiDefinition.fields.reduce(
        (acc, { name: fieldName }) => Object.assign(acc, { [fieldName]: acc[fieldName] || [] }),
        abi,
    );
    abiDefinition.serialize(buffer, abi);

    const arg = {
        account: accountStr,
        abi: Buffer.from(buffer.asUint8Array()).toString(`hex`)
    };

    eos_push_transaction('eosio', 'setabi', accountStr, arg, 60);
}

async function eos_set_code(account, contract){
    const accountStr = String(account);
    const contractStr = String(contract);
    const contractFile = __dirname + "/" + contractStr + ".wasm";
    const wasmLocation = contractFile;

    // let wasmLocation = path.join(contractFile);
    wasm = await fs.readFileSync(wasmLocation, "utf-8");
    //replace space and line break
    wasm = wasm.replace(/(\r\n\t|\n|\r\t| )/gm, "");

    const arg = {
        account: accountStr,
        vmtype: 0,
        vmversion: 0,
        code: wasm
    };
    eos_push_transaction("eosio", "setcode", accountStr, arg, 60);
}

async function eos_buyram(payer, reciever, rambyte){
    const payerStr = String(payer);
    const recieverStr = String(reciever);
    const rambyteNum = Number(rambyte);

    const arg = {
        payer: payerStr,
        receiver: recieverStr,
        bytes: rambyteNum,
      };

      eos_push_transaction("eosio", "buyrambytes", payerStr, arg, 60);
}

async function eos_push_transaction(account, name, actor, args, expireSeconds){
    accountStr = String(account);
    nameStr = String(name);
    actor = String(actor);
    expireSecondsNum = Number(expireSeconds);

    const result = await api.transact({
        actions: [{
          account: account,
          name: name,
          authorization: [{
            actor: actor,
            permission: 'active',
          }],
          data: args,
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: expireSeconds,
      });
      console.log(name);
      console.log(result);
}

var contract_args = {
    user: 'eosjstest',
    author: "eosjsTest.js",
    title: 'eosjsTest_T',
    content: 'eosjsTest_C',
    time_upload: 'eosjsTest_TIME'
  };
// eos_get_info();
eos_get_table_rows(contract.local.eosjs.code, users.local.eosjs, 'setm', 10);
eos_push_transaction(contract.local.eosjs.code, contract.local.eosjs.action.upload, users.local.eosjs, contract_args, 60);
// eos_get_account("jwqnka13noaq");
eos_set_abi(users.local.eosjs2, "hello");
// eos_buyram(users.local.eosjs, users.local.eosjs, 10000);
eos_set_code(users.local.eosjs2, "hello");
