import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Check if Phantom connection code exists
if (html.includes('window.solana')) {
    console.log('✅ Phantom connection code found');
} else {
    console.log('❌ No Phantom connection code found');
}

// Check for Ray ID generation
if (html.includes('Ray ID: Generating...')) {
    console.log('❌ Ray ID is stuck on "Generating..."');
} else {
    console.log('✅ Ray ID generation working');
}

// Check for connect button functionality
if (html.includes('connectPhantom()') || html.includes('connectWallet()')) {
    console.log('✅ Connect function found');
} else {
    console.log('❌ No connect function found');
}
