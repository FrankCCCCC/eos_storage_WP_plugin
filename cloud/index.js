// For build server
const Express = require('express');

// Functionality
const Log = require('./src/log.js');
const Init = require('./src/initializer.js');
const User = require('./src/user_api.js');
const Contract = require('./src/contract_api');
const write_log = Log.write_log;
const User_API = User.User_API;
const upload = Contract.upload;

// Some Global Parameter
var hostConfig = {
    port: "", // Server Port
    endpoint: "", // Blockchain Network Endpoint
    account: "", // Contract Account
    public_key: "", // Contract Account Public Key
    private_key: "" // Contract Account Private Key
}
var hostRpc = {};
var hostApi = {};
const app = Express();

function get_user_struct(account, public_key, private_key){
    return {account: account, public_key: public_key, private_key: private_key};
}

app.use(Express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    write_log("Recieve GET Request: /");
    try{
        let msg = 'Here is EOS Storage Plugin of Wordpress Backend'; 
        res.send(msg);
        write_log("Already Send Response: " + msg);
    }catch(err){
        write_log("ERROR: Sending Response Fail");
        write_log(err);
    }
    
});
app.post('/upload', (req, res) => {
    write_log("Recieve POST Request: /upload");
    write_log("HTTP Body: " + JSON.stringify(req.body));
    let titleStr = String(req.body.title);
    let authorStr = String(req.body.author);
    let contentStr = String(req.body.content);
    let accountStr = String("jwqnka13noaq");
    let publicKeyStr = String("EOS5adzeBDm18Qg44reD9BxydmHX8F1tyPsDxCBUxsaWunUjpVp3E");
    let privateKeyStr = String("5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X");
    let user_struct = get_user_struct(accountStr, publicKeyStr, privateKeyStr);
    let trx = "none";
    let user_api = new User_API(user_struct, hostRpc);;

    new Promise((resolve, reject) => {
        write_log("Call Contract API Action Upload");
        trx = upload(user_api, hostConfig, authorStr, titleStr, contentStr);
        resolve(trx);    
    }).then((trx) => {
        write_log("Transaction Success:");
        let resMsg = {
            msg: "Upload Success",
            transaction: trx
        };
        write_log("Send Response: msg= " + resMsg + " Transaction ID= " + trx.transaction_id);
        res.send(resMsg);
        resolve(resMsg);
    }).then(() => {
        delete user_api;
    }).catch((err) => {
        write_log("ERROR: Transaction Fail");
        write_log(err);
        let resMsg = {
            msg: "Upload Fail",
            transaction: err
        };
        write_log("Send Response: " + JSON.stringify(resMsg));
        res.send(resMsg);
    });
});

async function start_server(){
    hostRpc = await Init.init();
    hostConfig = Init.config;
    hostApi = new User_API(get_user_struct("jwqnka13noaq", "EOS5adzeBDm18Qg44reD9BxydmHX8F1tyPsDxCBUxsaWunUjpVp3E", "5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X"), hostRpc);
    await hostApi.validate();
    app.listen(hostConfig.port, () => {
        write_log(`Here is Node JS and Express running on port ${hostConfig.port}`);
    });
}

start_server();
