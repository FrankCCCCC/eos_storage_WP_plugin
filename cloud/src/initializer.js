// For access file
const Fs = require('fs');

// For EOSJS
const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');                                // node only
const Log = require("./log.js");

// Some Global Parameter
var config = {
    port: "",
    endpoint: "",
    account: "",
    public_key: "",
    private_key: ""
}
const configfile = "server.config.json";
var rpc = 0;

// @Starting Server
function server_set_up(){ // read config and set up some important global parameters
    let path = "./src/" + configfile;
    let content = Fs.readFileSync(path, 'utf-8');
    let data = JSON.parse(content);
    config.port = Number(data.port);
    config.endpoint = String(data.endpoint);
    config.account = String(data.account);
    config.public_key = String(data.public_key);
    config.private_key = String(data.private_key);

    Log.write_log("Set Up Endpoint: " + config.endpoint);
    Log.write_log("Set Up Contract Account: " + config.account);
    Log.write_log("Set Up Contract Account Public Key: " + config.public_key);
    Log.write_log("Set Up Contract Account Private Key: " + config.private_key);

    rpc = new JsonRpc(config.endpoint, { fetch });
}

function server_test_conn(){ // test the parameter work or not
    let p1 = new Promise((resolve, reject) => {
        Log.write_log("Trying to connect " + config.endpoint);
        let async_func_get_info = async () => {let res = await rpc.get_info(); return res;};
        let chain_info = async_func_get_info();
        resolve(chain_info);
    }).then((chain_info) => {
        Log.write_log("Endpoint Connect Successfully, Connect to Chain_ID" + chain_info.chain_id);
    }).catch((err) => {
        Log.write_log("ERROR: Fail to Connet Endpoint " + chain_info.chain_id);
        Log.write_log(err);
    });

    let p2 = new Promise((resolve, reject) => {
        Log.write_log("Trying to fetch account info " + config.account);
        let async_func_get_account = async () => {let res = await rpc.get_account(config.account); return res;};
        let account_info = async_func_get_account();
        resolve(account_info);
    }).then((account_info) => {
        Log.write_log("Fetching Account Success");
        Log.write_log("account_name: " + account_info.account_name + " | created: " + account_info.created + " | " + "last_code_update: " + account_info.last_code_update);
    }).catch((err) => {
        Log.write_log("ERROR: Fetching Account Fail");
        Log.write_log(err);
    })

    let p3 = new Promise((resolve, reject) => {
        Log.write_log("Trying to fetch contract raw code and ABI " + config.account);
        let async_func_get_code = async () => {let res = await rpc.get_raw_code_and_abi(config.account); return res;};
        let contract_code = async_func_get_code();
        resolve(contract_code);
    }).then((contract_code) => {
        Log.write_log("Fetching Contract Success");
        let wasm = contract_code.wasm;
        let abi = contract_code.abi;
        try{
            if(wasm != ""){Log.write_log("Wasm already Set");}
            else{throw "Wasm dosen't Set yet";}
            if(abi != ""){Log.write_log("ABI already Set")}
            else{throw "ABI dosen't Set yet";}
        }catch(err){
            Log.write_log("ERROR: " + err);}
    }).catch((err) => {
        Log.write_log("Fetching Contract Code Fail");
        Log.write_log(err);
    })

    Promise.all([p1, p2, p3]).then(() => {console.log('ALL');});
}

async function server_test_conn_async(){
    Log.write_log("Testing config connection...");
    let test_endpoint_f = async () => {
        try{
            Log.write_log("Trying to connect " + config.endpoint);
            let chain_info = await rpc.get_info();
            Log.write_log("Endpoint Connect Successfully, Connect to Chain_ID" + chain_info.chain_id);
        }catch(err){
            Log.write_log("ERROR: Fail to Connet Endpoint " + chain_info.chain_id);
            Log.write_log(err);
        }
    }

    let test_account_f = async () => {
        try{
            Log.write_log("Trying to fetch account info " + config.account);
            let account_info = await rpc.get_account(config.account);
            Log.write_log("Fetching Account Success");
            Log.write_log("account_name: " + account_info.account_name + " | created: " + account_info.created + " | " + "last_code_update: " + account_info.last_code_update);
        }catch(err){
            Log.write_log("ERROR: Fetching Account Fail");
            Log.write_log(err);
        }
    }
    
    let test_contract_f = async () => {
        try{
            Log.write_log("Trying to fetch contract raw code and ABI " + config.account);
            let contract_code = await rpc.get_raw_code_and_abi(config.account);
    
            Log.write_log("Fetching Contract Success");
            let wasm = contract_code.wasm;
            let abi = contract_code.abi;
            try{
                if(wasm != ""){Log.write_log("Wasm already Set");}
                else{throw "Wasm dosen't Set yet";}
                if(abi != ""){Log.write_log("ABI already Set")}
                else{throw "ABI dosen't Set yet";}
            }catch(err){
                Log.write_log("ERROR: " + err);}
        }catch(err){
            Log.write_log("Fetching Contract Code Fail");
            Log.write_log(err);
        }
    }
    await Promise.all([test_endpoint_f(), test_account_f(), test_contract_f()]).then(() => {
        Log.write_log("Testing Config Connection Done");
    }).catch((err) => {
        Log.write_log("ERROR: Testing Config Connection Fail");
        Log.write_log(err);
    });
    // await test_endpoint_f();
    // await test_account_f();
    // await test_contract_f();
}

exports.init = async function init(){
    console.log("Server Initializeing...");
    // new Promise((resolve, reject) => {
    //     server_set_up();
        
    //     resolve(rpc)
    // }).then((rpc) => {
    //     server_test_conn();
    // }).then(()=>{
    //     return rpc;  
    // })


    server_set_up();
    await server_test_conn_async();
    return rpc;
}

exports.config = config;