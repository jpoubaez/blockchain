const Blockchain = require('./blockchain'); // crido la el fitxer blockchain.js

const bitcoin = new Blockchain();  // creo una instancio de Blockchain
bitcoin.createNewBlock(9274,'OItOEREDHKHKD','6597767x6daa'); // per a provar
bitcoin.createNewBlock(9812,'OIUOE5jkhfHKD','7817d4x6gt44'); // per a provar
bitcoin.createNewBlock(4583,'19FGTJIIUHRTS','656s90679dsf'); // per a provar
bitcoin.createNewTransaction(100,'ALEXHT845SJ5TKCJ2','JENN5BG5DF6HT8NG9');

console.log(bitcoin); // la printo tota

