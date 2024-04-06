const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const rp = require('request-promise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const nodeAddress = uuid().split('-').join(''); // traiem els - que hi hagin i hi posem espai

const port = process.argv[2]; // rebre per quin port escoltarà

const bitcoin = new Blockchain();

app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function(req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount,
    req.body.sender, req.body.recipient) 
    res.json({ note:`Transaction will be added in block
    ${blockIndex}.`});
});

app.get('/mine', function(req, res) {

    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];

    bitcoin.createNewTransaction(12.5, "00", nodeAddress); // recompensa, a quina adreça?? la creem
    
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
    

    res.json({
        note: "New block mined successfully",
        block: newBlock
    });

});

app.post('/register-and-broadcast-node', function(req, res) { // afegim el nou node si no el teníem a networkNodes[]
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);
    const regNodesPromises = []; // hi posarem tots els que tenim registrats i necessiten les dades del nou
    bitcoin.networkNodes.forEach(networkNodeUrl => { // difondre'l cap a tothom excepte el nou
        // enviar a cada node ja existent una peticio register-node amb les dades del nou
        bitcoin.networkNodes.forEach(networkNodeUrl => {
            const requestOptions = { // les dades del request
                uri: networkNodeUrl + '/register-node', // diferent per a cada destí
                method: 'POST',
                body: { newNodeUrl: newNodeUrl }, // tots reben lo mateix: el nou
                json: true
            }
        }
        regNodesPromises.push(rp(requestOptions)); // preparat per a cada node ja existent
    }; // end of difondre'l cap a tothom excepte el nou

    Promise.all(regNodesPromises) // enviem a tots
    .then(data => { // si ha anat bé, li diem al nou la info dels nodes ja existents
        const bulkRegisterOptions = { 
            uri: newNodeUrl + '/register-nodes-bulk'  
            method: 'POST',
            body: {allNetworkNodes: [...bitcoin.networkNodes,
            bitcoin.currentNodeUrl]} 
            json:true
        }

        return rp(bulkRegisterOptions);
    }) // si ha anat bé, missatge exit
    .then(data => {
        res.json({ note: 'New node registered with network successfully.' });
    });
};

app.listen(port, function(){ // ara escoltem pel port que ens passin
    console.log(`listening per el port ${port} ...`); 

});