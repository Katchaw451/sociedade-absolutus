import { Keypair } from '@solana/web3.js';
import fs from 'fs';

// Generate a new wallet for token deployment
const deployer = Keypair.generate();

console.log('🎯 STEP 1: FUND YOUR WALLET');
console.log('============================');
console.log('1. Go to: https://solfaucet.com/');
console.log('2. Select: DEVNET');
console.log('3. Paste this wallet address:');
console.log('');
console.log('   ' + deployer.publicKey.toString());
console.log('');
console.log('4. Click "Airdrop" to get 2 SOL');
console.log('5. Wait for confirmation, then continue to STEP 2');
console.log('============================\n');

// Save the wallet for later use
const walletInfo = {
    publicKey: deployer.publicKey.toString(),
    secretKey: Array.from(deployer.secretKey),
    step: 'ready_for_funding'
};

fs.writeFileSync('sa-deployer-wallet.json', JSON.stringify(walletInfo, null, 2));
console.log('💾 Wallet saved to: sa-deployer-wallet.json');
console.log('⚠️  KEEP THIS FILE SAFE - it contains private keys!');
