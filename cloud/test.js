const mod = require('./src/initializer.js');
const User_API = require('./src/user_api');
const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch'); 
const usr = {account: "jwqnka13noaq", public_key: "EOS5adzeBDm18Qg44reD9BxydmHX8F1tyPsDxCBUxsaWunUjpVp3E", private_key: "5Hse6HU8gt49wA2DSdomT6JujWzzHWbpgm54cf3Ci6qiGdrbB2X"};
// new Promise((resolve, reject) => {
//     let rpc = mod.init();

//     // setInterval(() => {
//         console.log(rpc);
//         // rpc = new JsonRpc("https://eos-jungle.eosblocksmith.io:443", { fetch });
//     // }, 3);
    
//     resolve(rpc);
// }).then((rpc) => {
//     console.log("ffffff");
//     // resolve(rpc)
// }).then((rpc) => {
//     console.log("KKKK");
//     var api = new User_API.User_API(usr, rpc)
// })

var f = async () => {
    let rpc = await mod.init();
    console.log(rpc);
    var api = new User_API.User_API(usr, rpc);
    await api.validate();
}

f();

// new Promise((resolve, reject) => {
//     var l = 0;
//     console.log("A");
//     setTimeout(() => {console.log("A0");}, 3000);
//     var r = () => {return new Promise((resolve, reject) => {
//         // setTimeout(() => {console.log("A1"); return "A1"}, 3000);
//         // for(i = 0; i<1000; i++){}
//         console.log("A1");
//         l++;
//         resolve("A1");
//     }).then(() => {
//         // setTimeout(() => {console.log("A1then"); return "A1"}, 3000);
//         console.log("A1then");
//         l++;
//         return l;
//     })}
//     var async_r = async () => {var e = await r(); for(i = 0; i<1000; i++){console.log("Before E");} console.log("E: " + e); return e;}
//     var res_async = async_r();
//     console.log("ASYNC_R" + String(res_async));
//     console.log(l);
//     resolve("A");
// }).then(() => {
//     console.log("B");
//     setTimeout(() => {console.log("B0");}, 30);
//     // var f = async () => {setTimeout(() => {console.log("B0"); return "B0"}, 30);};
//     // console.log(await f());
//     new Promise((resolve, reject) => {
//         setTimeout(() => {console.log("B1"); return "B1"}, 3);
//         resolve("B1");
//     }).then(() => {
//         setTimeout(() => {console.log("B1then"); return "B1"}, 3);
//     })
// })