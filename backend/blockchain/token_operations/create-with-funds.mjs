import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import fs from 'fs';

async function createWithFunds() {
    console.log('🚀 Creating token with pre-funded wallet...');
    
    // Load the wallet you funded
    const walletData = JSON.parse(fs.readFileSync('temp-wallet.json', 'utf8'));
    const deployer = Keypair.fromSecretKey(new Uint8Array(walletData.secretKey));
    
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Check balance
    const balance = await connection.getBalance(deployer.publicKey);
    console.log('💰 Wallet balance:', balance / 1e9, 'SOL');
    
    if (balance < 0.1 * 1e9) {
        console.log('❌ Insufficient funds. Please fund the wallet first.');
        console.log('Wallet address:', deployer.publicKey.toString());
        return;
    }
    
    // Create token
    const tokenMint = await createMint(
        connection,
        deployer,
        deployer.publicKey,
        null,
        9
    );
    
    console.log('\n🎉 $SA TOKEN CREATED!');
    console.log('Token Address:', tokenMint.toString());
    
    fs.writeFileSync('sa-token-live.json', JSON.stringify({
        tokenMint: tokenMint.toString(),
        deployer: deployer.publicKey.toString()
    }, null, 2));
    
    console.log('✅ Token info saved to sa-token-live.json');
}

createWithFunds();
