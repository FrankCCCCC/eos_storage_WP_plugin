const Express = require('express');
const app = Express();
const port = process.env.PORT || 4900;
const url = "https://eos-jungle.eosblocksmith.io:443";

const { Api, JsonRpc } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');  // development only
const fetch = require('node-fetch');                                // node only
const { TextDecoder, TextEncoder } = require('util');               // node only

// const privateKeys = ["5JdQRKiTgxEvZeVYMz11UN68cSfzYvsUL7bAjbHV7U8hmyJKohr"]; // Local eosjs
const privateKeys = ["5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X"];//Jungle jwqnka13noaq

const signatureProvider = new JsSignatureProvider(privateKeys);
// const rpc = new JsonRpc('http://172.17.0.2:8888', { fetch });
const rpc = new JsonRpc('https://eos-jungle.eosblocksmith.io:443', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });



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

      return result;
}

app.listen(port, () => {
    async function upload(author, title, content){
        const contract_account = "jwqnka13noaq";
        const contract_action = "upload";

        var now = new Date();
        var time_upload = now.toISOString();
        
        var arg = {
            user: contract_account,
            author: author,
            title: title,
            content: content,
            time_upload: time_upload
        };

        // new Promise((resolve, reject) => {
        //     var re = eos_push_transaction("jwqnka13noaq", "upload", "jwqnka13noaq", arg, 60);
        //     resolve(re);
        // }).then((re) => {
        //     console.log(re);
        //     return re;
        // }).catch((err) => {
        //     console.log(err);
        //     return err;
        // });

        var re = await eos_push_transaction(contract_account, contract_action, contract_account, arg, 60);
        return re;
    }
    app.use(Express.urlencoded());
    app.get('/', (req, res) => {
        res.send('Here is EOS Storage Plugin of Wordpress Backend');
    });
    app.post('/', (req, res) => {
        console.log("Get POST Request");
        console.log(req.body);
        const param = req.body;
        var trx = "none";
        new Promise((resolve, reject) => {
            trx = upload(param.author, param.title, param.content, param.time_upload, param.user);
            resolve(trx);    
        }).then((trx) => {
            // var trxStr = JSON.stringify(trx);
            console.log("Transaction:\n");
            console.log(trx);
            var resMsg = {
                msg: "Upload Success",
                transaction: trx
            };
            res.send(resMsg);
        }).catch((err) => {
            // var errStr = JSON.stringify(err);
            console.log("Transaction Error:\n");
            console.log(err);
            var resMsg = {
                msg: "Upload Fail",
                transaction: err
            };
            res.send(resMsg);
        })
        
    });
    app.get('/', (req, res) => {
        console.log("Get GET Request");
        console.log(req.query);
        const param = req.query;
        var trx = "none";
        trx = upload(param.author, param.title, param.content, param.time_upload, param.user);
        console.log("TRX: " + trx);
        res.send(trx);
    });
    console.log(`Here is Node JS and Express running on port ${port}`);
    // upload("cloud", "cloud_T", "cloud_C", "cloud_T", "cloud_U");
});
