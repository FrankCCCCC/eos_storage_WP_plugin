const network = {
    kylin: "https://api-kylin.eosasia.one",
    local: "http://localhost:8888",
};
const users = {
    kylin: {
        weragune24nn: "weragune24nn",
        eosio: "eosio",
        eosioToken: "eosio.token"
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

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only
// const { TextEncoder, TextDecoder } = require('text-encoding');      // React Native, IE11, and Edge Browsers only

// const privateKeys = ["5JdQRKiTgxEvZeVYMz11UN68cSfzYvsUL7bAjbHV7U8hmyJKohr"]; // Local eosjs
const privateKeys = ["5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X"];//Jungle jwqnka13noaq

const signatureProvider = new JsSignatureProvider(privateKeys);
// const rpc = new JsonRpc('http://172.17.0.2:8888', { fetch });
const rpc = new JsonRpc('https://eos-jungle.eosblocksmith.io:443', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

// console.log(resp.rows);
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
}

const argv = process.argv;
var contract_args = {
    user: argv[3],
    author: argv[5],
    title: argv[6],
    content: argv[7],
    time_upload: argv[8]
    // user: 'wp',
    // author: "WP_author",
    // title: 'WP_T',
    // content: 'WP_C',
    // time_upload: "WP_TIME"
  };

  
// eos_get_info();
// eos_get_table_rows(contract.local.eosjs.code, users.local.eosjs, 'setm', 10);

eos_push_transaction("jwqnka13noaq", "upload", "jwqnka13noaq", contract_args, 60);
// eos_push_transaction("eosjs", "upload", "eosjs", contract_args, 60);