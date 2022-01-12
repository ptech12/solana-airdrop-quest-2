const {
    Connection,
    PublicKey, 
    Keypair,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    Transaction,
    Account
} = require('@solana/web3.js');

const newPair = new Keypair();
console.log(newPair);


// adding a public key
// we are extracting the public key from "accountinfo" into myPublicKey
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();

// We do the same for the private key
// Now we are extracting secret key from the accountinfo which is Uint8Array of length 64.
const secretKey = newPair._keypair.secretKey;

// What if we want to see the balance of the account
// web3.js allow us using getBalance() method inside the Connection class
const getWalletBalance = async () => {
    try{
        // creates a connetion object to solana's devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); 

        // Let's create a wallet object using the secret key
        const myWallet = await Keypair.fromSecretKey(secretKey);

        // quering the balance of this wallet
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        console.log(`=> wallet address ${publicKey}`);
        console.log(`Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
    }catch(err){
        console.log(err);
    }
};

// The AirDropSol function
const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);
        console.log(`-- Airdropping 2 SOL --`)
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


// Testing OUT
const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

driverFunction();