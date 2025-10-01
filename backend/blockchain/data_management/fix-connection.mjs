import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Add Phantom connection function if missing
if (!html.includes('async function connectPhantom()') && !html.includes('async function connectWallet()')) {
    const phantomCode = `
<script>
async function connectPhantom() {
    try {
        const provider = window.solana;
        if (!provider) {
            alert('Please install Phantom Wallet!');
            return;
        }
        
        console.log('Connecting to Phantom...');
        await provider.connect();
        const publicKey = provider.publicKey.toString();
        
        // Update UI
        document.getElementById('walletStatus').innerHTML = '✅ Connected: ' + publicKey.substring(0, 8) + '...';
        document.getElementById('connectButton').style.display = 'none';
        
        // Generate Ray ID
        const rayId = 'RAY-' + Math.random().toString(36).substring(2, 15).toUpperCase();
        document.querySelector('rayIdElement').innerHTML = 'Ray ID: ' + rayId;
        
        console.log('Connected to:', publicKey);
        
    } catch (error) {
        console.error('Connection failed:', error);
        alert('Connection failed: ' + error.message);
    }
}

// Auto-connect if already authorized
if (window.solana && window.solana.isConnected) {
    connectPhantom();
}
</script>
`;

    // Insert before closing body tag
    html = html.replace('</body>', phantomCode + '</body>');
    
    // Also make sure the connect button calls the function
    html = html.replace('Connect Phantom Wallet</button>', 'Connect Phantom Wallet</button>');
    html = html.replace('- [ ] Connect Phantom Wallet', '- [x] <button onclick="connectPhantom()" id="connectButton">Connect Phantom Wallet</button>');
    
    fs.writeFileSync('index.html', html);
    console.log('✅ Phantom connection code added!');
} else {
    console.log('✅ Connection code already exists');
}
