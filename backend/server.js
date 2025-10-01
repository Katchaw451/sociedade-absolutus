const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Data storage path
const DATA_DIR = process.env.DATA_DIR || '/home/absolutus-analytics';
const WALLET_DATA_FILE = path.join(DATA_DIR, 'wallet_data.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
function initializeDataFiles() {
    if (!fs.existsSync(WALLET_DATA_FILE)) {
        fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify({}));
    }
    if (!fs.existsSync(TRANSACTIONS_FILE)) {
        fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify({}));
    }
}

// Read wallet data
function readWalletData() {
    try {
        const data = fs.readFileSync(WALLET_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading wallet data:', error);
        return {};
    }
}

// Write wallet data
function writeWalletData(data) {
    try {
        fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing wallet data:', error);
        return false;
    }
}

// Read transactions
function readTransactions() {
    try {
        const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading transactions:', error);
        return {};
    }
}

// Write transactions
function writeTransactions(data) {
    try {
        fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing transactions:', error);
        return false;
    }
}

// API Routes

// Get wallet data for device
app.post('/api/wallet-data', (req, res) => {
    const { deviceId } = req.body;
    
    if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
    }
    
    const walletData = readWalletData();
    const transactionsData = readTransactions();
    
    const deviceWalletData = walletData[deviceId] || {
        balance: 0,
        totalMined: 0,
        miningPower: 1.0,
        lastUpdated: new Date().toISOString()
    };
    
    const deviceTransactions = transactionsData[deviceId] || [];
    
    res.json({
        ...deviceWalletData,
        transactions: deviceTransactions.slice(-20) // Return last 20 transactions
    });
});

// Save wallet data
app.post('/api/save-data', (req, res) => {
    const { deviceId, balance, totalMined, miningPower, lastUpdated } = req.body;
    
    if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
    }
    
    const walletData = readWalletData();
    
    walletData[deviceId] = {
        balance: balance || 0,
        totalMined: totalMined || 0,
        miningPower: miningPower || 1.0,
        lastUpdated: lastUpdated || new Date().toISOString()
    };
    
    if (writeWalletData(walletData)) {
        res.json({ success: true, message: 'Data saved successfully' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Log transaction
app.post('/api/log-transaction', (req, res) => {
    const { deviceId, type, description, rayId, timestamp } = req.body;
    
    if (!deviceId) {
        return res.status(400).json({ error: 'Device ID is required' });
    }
    
    const transactionsData = readTransactions();
    
    if (!transactionsData[deviceId]) {
        transactionsData[deviceId] = [];
    }
    
    const transaction = {
        type,
        description,
        rayId,
        timestamp,
        id: Date.now().toString()
    };
    
    transactionsData[deviceId].unshift(transaction);
    
    // Keep only last 50 transactions per device
    if (transactionsData[deviceId].length > 50) {
        transactionsData[deviceId] = transactionsData[deviceId].slice(0, 50);
    }
    
    if (writeTransactions(transactionsData)) {
        res.json({ success: true, message: 'Transaction logged successfully' });
    } else {
        res.status(500).json({ error: 'Failed to log transaction' });
    }
});

// Get all data (admin endpoint)
app.get('/api/admin/data', (req, res) => {
    const walletData = readWalletData();
    const transactionsData = readTransactions();
    
    res.json({
        wallets: walletData,
        transactions: transactionsData
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize data files on startup
initializeDataFiles();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Data storage directory: ${DATA_DIR}`);
});
