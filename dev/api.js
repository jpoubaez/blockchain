const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const nodeAddress = uuid().split('-').join(''); // traiem els - que hi hagin i hi posem espai

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

app.listen(3000, function(){
    console.log('listening per el port 3000...'); 

});