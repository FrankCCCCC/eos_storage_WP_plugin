const Log = require('./log.js');
const IPFS = require('ipfs');
const write_log = Log.write_log();
// const node = new IPFS()

// const data = 'Hello, <YOUR NAME HERE>'

// // once the node is ready
// node.once('ready', () => {
//   // convert your data to a Buffer and add it to IPFS
//   node.add(IPFS.Buffer.from(data), (err, files) => {
//     if (err) return console.error(err)

//     // 'hash', known as CID, is a string uniquely addressing the data
//     // and can be used to get it again. 'files' is an array because
//     // 'add' supports multiple additions, but we only added one entry
//     console.log(files[0].hash)
//   })
// })

async function main(){
  const node = await IPFS.create();
  const version = await node.version();

  console.log(version);
  console.log('Version: ' + version.version);

  const filesAdded = await node.add({
    path: 'hello.txt',
    content: Buffer.from('Hello World 101')
  })

  console.log('Added file: ', filesAdded[0].path, filesAdded[0].hash);
  console.log(filesAdded);

  const fileBuffer = await node.cat(filesAdded[0].hash);
  console.log('Added file contents: ', fileBuffer.toString());
}

main();

exports.IPFS_Node = class IPFS_Node{
  constructor(){

  }

  async create(){
    try{
      this.node = await IPFS.create();
      this.version = String(this.node.version.version);
      write_log(`Create IPFS Node with IPFS-JS ${version}`);
    }catch(err){
      write_log("ERROR: Create IPFS Node Fail");
      write_log(err);
    }
  }

  async add(path, content){
    let fileAdded = await ;
  }
}