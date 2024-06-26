const sha256 = require('sha256'); // importem llibreria pel hash

const currentNodeUrl = process.argv[3];  // rebre la url

const uuid = require('uuid/v1');

function Blockchain () {
    this.chain = [];
    this.pendingTransactions = [];

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];

    this.createNewBlock(100,'0','0'); // hi posem lo que vulguem
}

Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) { 
    const newBlock = { 
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions, // el que posarem al bloc
        nonce: nonce, // proof of work, el bloc és correcte
        hash: hash, // el hash del nou block
        previousBlockHash: previousBlockHash, // el hash del bloc anterior
    };

    this.pendingTransactions = []; // resetegem l'array per posar transacció del següent bloc la proxima vegada
    this.chain.push(newBlock);
     
    return newBlock;
}

Blockchain.prototype.getLastBlock = function () { 
    return this.chain[this.chain.length - 1];

}

Blockchain.prototype.getlastBlockHash = function () { 
    return this.chain[this.chain.length - 1].hash;

}


Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('') // treu els -
    };
    //this.pendingTransactions.push(newTransaction); aixo abans, ara no cal
    //return this.getLastBlock()['index'] + 1;
    return newTransaction; // ara només la crea i no la posa a pendingTransacions
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify( currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function( previousBlockHash, currentBlockData) { 
    let nonce = 0; // let declara variable
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce); 
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    };
    return nonce;   
}

module.exports = Blockchain; // per a poder-ho veure i utilitzar en altres fitxers