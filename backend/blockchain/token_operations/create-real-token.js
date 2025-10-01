const { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const fs = require('fs');

async function createSAToken() {
    console.log('🚀 Starting $SA Token Creation...\n');
    
    // Generate deployer wallet
    const deployer = Keypair.generate();
    console.log('✅ Deployer Wallet Created:', deployer.publicKey.toString());
    
    // Connect to Devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    console.log('🔗 Connected to Solana Devnet');
    
    try {
        // Request airdrop
        console.log('💰 Requesting Devnet SOL airdrop...');
        const airdropSignature = await connection.requestAirdrop(
            deployer.publicKey,
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature);
        console.log('✅ Airdrop received');
        
        // Create the $SA token
        console.log('🪙 Creating $SA Token Mint...');
        const tokenMint = await createMint(
            connection,
            deployer,
            deployer.publicKey,
            null,
            9 // Decimals
        );
        
        console.log('\n🎉 SUCCESS! $SA TOKEN CREATED!');
        console.log('================================');
        console.log('Token Address:', tokenMint.toString());
        console.log('Deployer Wallet:', deployer.publicKey.toString());
        console.log('================================\n');
        
        // Save wallet info
        const walletInfo = {
            publicKey: deployer.publicKey.toString(),
            secretKey: Array.from(deployer.secretKey),
            tokenMint: tokenMint.toString(),
            network: 'devnet'
        };
        
        fs.writeFileSync('sa-token-info.json', JSON.stringify(walletInfo, null, 2));
        console.log('💾 Token info saved to: sa-token-info.json');
        
        return tokenMint;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('💡 Tip: This might be a rate limit. Wait 30 seconds and try again.');
    }
}

createSAToken();
