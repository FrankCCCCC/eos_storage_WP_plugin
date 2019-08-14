const functions = require('firebase-functions');

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

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

async function eos_get_info_inner(){
    var res = await rpc.get_info();
    return res;
}

exports.eos_get_info = functions.https.onRequest((request, response) => {
    var fetchInfo = new Promise((resolve, reject) => {
        var re = eos_get_info_inner();
        resolve(re);
    }).then((re) => {
        console.log(re);
        response.send(re);
        return re;
    });
});