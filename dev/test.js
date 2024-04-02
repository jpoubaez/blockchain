const Blockchain = require('./blockchain'); // crido la el fitxer blockchain.js

const bitcoin = new Blockchain();  // creo una instancia de Blockchain


bitcoin.createNewBlock(9274,'OItOEREDHKHKD','6597767x6daa'); // per a provar
bitcoin.createNewTransaction(300,'JENN5BG5DF6HT8NG9','ALEXHT845SJ5TKCJ2');
bitcoin.createNewBlock(9812,bitcoin.getlastBlockHash(),'7817d4x6gt44'); // per a provar
bitcoin.createNewTransaction(100,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9');
bitcoin.createNewTransaction(200,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9');
bitcoin.createNewBlock(4583,bitcoin.getlastBlockHash(),'656s90679dsf'); // per a provar

const currentBlockData = [
    {
        amount: 300,
        sender: 'JENN5BG5DF6HT8NG9',
        recipient: 'ALEXHT845SJ5TKCJ2',  
    },
    {
        amount: 100,
        sender: 'ALEXHT845SJ5TKCJ2',
        recipient: 'JENN5BG5DF6HT8NG9',  
    }, 
    {
        amount: 200,
        sender: 'JENN5BG5DF6HT8NG9',
        recipient: 'ALEXHT845SJ5TKCJ2',  
    }   
];
const previousBlockHash = bitcoin.getlastBlockHash();
const nonce = 100;
const nouHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
console.log(nouHash);

bitcoin.createNewTransaction(currentBlockData[0].amount,currentBlockData[0].sender,currentBlockData[0].recipient);
bitcoin.createNewTransaction(currentBlockData[1].amount,currentBlockData[1].sender,currentBlockData[1].recipient);
bitcoin.createNewTransaction(currentBlockData[2].amount,currentBlockData[2].sender,currentBlockData[2].recipient);
bitcoin.createNewBlock(nonce,previousBlockHash,nouHash);

console.log(bitcoin); // la printo tota
console.log(bitcoin.chain[3]);

