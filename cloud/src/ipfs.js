const IPFS = require('ipfs');
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

async function init(){
  const node = await IPFS.create();
  const version = await node.version();

  console.log(version);
  console.log('Version: ' + version.version);

  const filesAdded = await node.add({
    path: 'hello.txt',
    content: Buffer.from('Hello World 101')
  })

  console.log('Added file: ', filesAdded[0].path, filesAdded[0].hash);

  const fileBuffer = await node.cat(filesAdded[0].hash);
  console.log('Added file contents: ', fileBuffer.toString());
}

init();