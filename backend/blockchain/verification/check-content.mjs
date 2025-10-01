import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

console.log('🔍 CHECKING MISSING CONTENT:');

// Check for mining section
if (html.includes('Mine $SA Token Mining')) {
    console.log('✅ Mining section found');
} else {
    console.log('❌ Mining section MISSING');
}

// Check for balance display
if (html.includes('Available Balance')) {
    console.log('✅ Balance display found');
} else {
    console.log('❌ Balance display MISSING');
}

// Check for withdrawal section
if (html.includes('Withdraw $SA to Phantom')) {
    console.log('✅ Withdrawal section found');
} else {
    console.log('❌ Withdrawal section MISSING');
}

// Check for JavaScript mining functions
if (html.includes('mineTokens()') || html.includes('startMining()')) {
    console.log('✅ Mining functions found');
} else {
    console.log('❌ Mining functions MISSING');
}
