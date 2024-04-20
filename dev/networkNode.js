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
    //const blockIndex = bitcoin.createNewTransaction(req.body.amount,
    //req.body.sender, req.body.recipient) // abans es creava i posava a la cua cridant això
    const newTransaction = req.body; // posem aquó directament a la cua
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({ note:`Transaction will be added in block ${blockIndex}.`});  
});

app.post('/transaction/broadcast', function(req, res) {
    // rebem la transacció del post i l'afegim a la nostra cua de pendents
    const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = { // opcions de la request per a cada node
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };

        requestPromises.push(rp(requestOptions)); // fem la request i la posem a la pila
    });

    Promise.all(requestPromises)  // Les enviem 
    .then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.' });
    });
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
        const requestOptions = { // les dades del request
            uri: networkNodeUrl + '/register-node', // diferent per a cada destí
            method: 'POST',
            body: { newNodeUrl: newNodeUrl }, // tots reben lo mateix: el nou
            json: true // volem json
        }
        
        regNodesPromises.push(rp(requestOptions)); // preparant promise individual per a cada node ja existent
    }); // end of difondre'l cap a tothom excepte el nou

    Promise.all(regNodesPromises) // enviem a tots les promises preparades
    .then(data => { // si ha anat bé i ha acabat, li diem al nou la info dels nodes ja existents. Data és resposta rebuda
        const bulkRegisterOptions = { 
            uri: newNodeUrl + '/register-nodes-bulk',  
            method: 'POST',
            body: {allNetworkNodes: [...bitcoin.networkNodes, // ... és un operador (spread) per a que agafi el contingut de l'array
            bitcoin.currentNodeUrl]}, 
            json:true // volem json
        }

        return rp(bulkRegisterOptions); // ens prepara la promise i l'enviem amb return
    }) // si ha anat bé, missatge exit
    .then(data => { // data és la resposta rebuda, per tant ha acabat
        res.json({ note: 'New node registered with network successfully.' });
    });
});

app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl; // rebem uri del nou
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1; // si no el tenim, l'hi posem
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl; // mirem que no siguem nosaltres!!
    if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
    res.json({ note: 'New node registered successfully.' }); // contestem
});

app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes; // l'array amb les URLs dels nodes ja existents
    allNetworkNodes.forEach(networkNodeUrl => { // iterem i l'afegim a l'array del blockchain amb els nodes
        const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1; // Vigilem que no hi sigui
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl; //vigilem que no siguem nosaltres mateixos
        if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
    });
    res.json({ note: 'Bulk registration successful.' }); // contestem
});

app.listen(port, function(){ // ara escoltem pel port que ens passin
    console.log(`listening per el port ${port} ...`); 

});