const IPFS = require('ipfs');
const node = new IPFS()

const data = 'Hello, <YOUR NAME HERE>'

// once the node is ready
node.once('ready', () => {
  // convert your data to a Buffer and add it to IPFS
  node.add(IPFS.Buffer.from(data), (err, files) => {
    if (err) return console.error(err)

    // 'hash', known as CID, is a string uniquely addressing the data
    // and can be used to get it again. 'files' is an array because
    // 'add' supports multiple additions, but we only added one entry
    console.log(files[0].hash)
  })
})