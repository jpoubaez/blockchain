const Blockchain = require('./blockchain'); // crido la el fitxer blockchain.js

const bitcoin = new Blockchain();  // creo una instancia de Blockchain

function crearBloc (dadesNoves) {
	// segons la mida de dadesNoves, crear transaccions
	for (let i=0;i < dadesNoves.length; i++) {
		bitcoin.createNewTransaction(dadesNoves[i].amount,dadesNoves[i].sender,dadesNoves[i].recipient);
	}
	
	let previousBlockHash = bitcoin.getlastBlockHash();
	let nonce = bitcoin.proofOfWork(previousBlockHash, dadesNoves);
	let nouHash = bitcoin.hashBlock(previousBlockHash, dadesNoves, nonce);
	bitcoin.createNewBlock(nonce,previousBlockHash,nouHash); // per a provar
}

let currentBlockData = [
    {
        amount: 330,
        sender: 'JENN5BG5DF6HT8NG9',
        recipient: 'ALEXHT845SJ5TKCJ2',  
    }
];
crearBloc(currentBlockData);


currentBlockData = [
    {
        amount: 812,
        sender: 'ALEXHT845SJ5TKCJ2',
        recipient: 'JENN5BG5DF6HT8NG9',  
    }
];
crearBloc(currentBlockData);


currentBlockData = [
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
crearBloc(currentBlockData);


currentBlockData = [
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
crearBloc(currentBlockData);

console.log(bitcoin); // la printo tota
console.log(bitcoin.getlastBlock());

