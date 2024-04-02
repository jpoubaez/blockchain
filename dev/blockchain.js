const sha256 = require('sha256'); // importem llibreria pel hash

function Blockchain () {
    this.chain = [];
    this.pendingTransactions = [];
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

Blockchain.prototype.getlastBlock = function () { 
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
    };
    this.pendingTransactions.push(newTransaction);
    return this.getlastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify( currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

module.exports = Blockchain; // per a poder-ho veure i utilitzar en altres fitxers