import { Connection, clusterApiUrl } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

async function checkToken() {
    const connection = new Connection(clusterApiUrl('devnet'));
    const tokenAddress = 'H7PWQkA6rRFuRxcKpASspFr6G3mG6L3T87tj3JpyoszX';
    
    try {
        const mintInfo = await getMint(connection, tokenAddress);
        console.log('🎉 TOKEN EXISTS!');
        console.log('Address:', tokenAddress);
        console.log('Decimals:', mintInfo.decimals);
        console.log('Supply:', mintInfo.supply.toString());
        console.log('Mint Authority:', mintInfo.mintAuthority?.toString() || 'REVOKED');
        console.log('Freeze Authority:', mintInfo.freezeAuthority?.toString() || 'REVOKED');
        
        console.log('\n✅ You already have a $SA token!');
        console.log('Now send SOL to your Phantom wallet to pay for transactions.');
        
    } catch (error) {
        console.log('❌ Token not found or error:', error.message);
        console.log('You need to create the token first.');
    }
}

checkToken();
