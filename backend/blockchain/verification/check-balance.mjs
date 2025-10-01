import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function checkBalance() {
    const connection = new Connection(clusterApiUrl('devnet'));
    
    // Your Phantom wallet address
    const phantomWallet = 'GTwt2qmXZcv3fZXmLi8Vh74hfH1Ma1vuV3u8vRtY5aCt';
    
    try {
        const balance = await connection.getBalance(phantomWallet);
        console.log('💰 BALANCE CHECK:');
        console.log('Wallet:', phantomWallet);
        console.log('Balance:', (balance / LAMPORTS_PER_SOL).toFixed(4), 'SOL');
        console.log('Network: Devnet');
        
        if (balance > 0) {
            console.log('✅ You have SOL on Devnet!');
        } else {
            console.log('❌ No SOL found on Devnet');
            console.log('The 5 SOL might be in a different wallet');
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

checkBalance();
