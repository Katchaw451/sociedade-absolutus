import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';

async function createToken() {
    console.log('🚀 Creating $SA Token directly...');
    
    try {
        // Connect to Devnet
        const connection = new Connection(clusterApiUrl('devnet'));
        
        // Get provider (Phantom)
        const provider = window.solana;
        if (!provider) {
            console.log('❌ Phantom wallet not found');
            return;
        }
        
        // Connect to wallet
        await provider.connect();
        console.log('✅ Connected to Phantom:', provider.publicKey.toString());
        
        // Create the token
        console.log('🔄 Creating token mint...');
        const tokenMint = await createMint(
            connection,
            provider,           // Payer (your Phantom wallet)
            provider.publicKey, // Mint authority (you)
            null,               // Freeze authority (none - more decentralized)
            9                   // Decimals
        );
        
        console.log('\n🎉 $SA TOKEN CREATED SUCCESSFULLY!');
        console.log('====================================');
        console.log('Token Address:', tokenMint.toString());
        console.log('Mint Authority:', provider.publicKey.toString());
        console.log('Network: Solana Devnet');
        console.log('====================================\n');
        
        // Save to file
        const fs = await import('fs');
        const tokenInfo = {
            tokenMint: tokenMint.toString(),
            deployer: provider.publicKey.toString(),
            network: 'devnet',
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('sa-token-created.json', JSON.stringify(tokenInfo, null, 2));
        console.log('💾 Token info saved to: sa-token-created.json');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

// Run if in browser environment
if (typeof window !== 'undefined') {
    createToken();
} else {
    console.log('📁 Run this script in a browser with Phantom wallet connected');
}
