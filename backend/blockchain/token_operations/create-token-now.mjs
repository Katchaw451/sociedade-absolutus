import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import fs from 'fs';

async function createSAToken() {
    console.log('🚀 Creating $SA Token with your funded wallet...\n');
    
    // Your existing funded wallet
    const deployerPublicKey = '8wKA13AETGjrY48dPzRbTTPvNF6HF2VrxLTmafgT2Esu';
    console.log('✅ Using your funded wallet:', deployerPublicKey);
    
    // Generate a new keypair for the token (we'll use your public key and create a new keypair for signing)
    // Since we don't have your private key, we'll create a new wallet and you can fund it
    const newDeployer = Keypair.generate();
    
    console.log('\n🎯 FUNDING INSTRUCTIONS:');
    console.log('=======================');
    console.log('1. Send 0.1 SOL from your funded wallet to this new deployer:');
    console.log('   FROM: ' + deployerPublicKey);
    console.log('   TO:   ' + newDeployer.publicKey.toString());
    console.log('');
    console.log('2. You can send it using:');
    console.log('   - Phantom Wallet interface');
    console.log('   - Solana CLI: solana transfer ' + newDeployer.publicKey.toString() + ' 0.1');
    console.log('   - Or use: https://spl-token-ui.com/');
    console.log('=======================\n');
    
    // Save the new deployer wallet
    const walletInfo = {
        publicKey: newDeployer.publicKey.toString(),
        secretKey: Array.from(newDeployer.secretKey),
        fundedWallet: deployerPublicKey,
        status: 'waiting_for_funding'
    };
    
    fs.writeFileSync('sa-token-deployer.json', JSON.stringify(walletInfo, null, 2));
    console.log('💾 New deployer wallet saved to: sa-token-deployer.json');
    console.log('⚠️  KEEP THIS FILE SAFE - contains private key!');
}

createSAToken();
