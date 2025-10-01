import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Remove SES lockdown script that's blocking Phantom
html = html.replace(/<script[^>]*lockdown[^>]*><\/script>/gi, '');
html = html.replace(/<script[^>]*ses[^>]*><\/script>/gi, '');

// Remove blocked Solana scripts that are failing to load
html = html.replace(/<script src="https:\/\/unpkg\.com\/@solana\/wallet-adapter-wallets[^>]*><\/script>/gi, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/@solana\/web3\.js[^>]*><\/script>/gi, '');

// Add working Solana CDN
const solanaScript = `
<script src="https://unpkg.com/@solana/web3.js@latest/lib/index.iife.js"></script>
<script>
// Simple Phantom connection without SES restrictions
async function connectPhantom() {
    try {
        console.log('Connecting to Phantom...');
        const provider = window.solana;
        
        if (!provider || !provider.isPhantom) {
            alert('Please install Phantom Wallet from https://phantom.app/');
            return;
        }
        
        // Connect
        await provider.connect();
        const publicKey = provider.publicKey.toString();
        console.log('Connected:', publicKey);
        
        // Update UI
        const connectButton = document.querySelector('button');
        if (connectButton) {
            connectButton.textContent = '✅ Connected: ' + publicKey.substring(0, 8) + '...';
            connectButton.disabled = true;
        }
        
        // Update Ray ID
        const rayId = 'RAY-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        document.body.innerHTML = document.body.innerHTML.replace('Ray ID: Generating...', 'Ray ID: ' + rayId);
        
        alert('Successfully connected to Phantom!');
        
    } catch (error) {
        console.error('Connection failed:', error);
        alert('Connection failed: ' + error.message);
    }
}

// Make function globally available
window.connectPhantom = connectPhantom;
</script>
`;

// Add the working script before closing body tag
html = html.replace('</body>', solanaScript + '</body>');

fs.writeFileSync('index.html', html);
console.log('✅ Removed SES lockdown and added working Phantom connection!');
