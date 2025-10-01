const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

// Middleware
app.use(express.json());
app.use(session({
    secret: 'sa-mining-github-' + Math.random().toString(36),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

// Simple user storage
const users = new Map();

// Passport setup
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user || null);
});

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: process.env.GITHUB_CALLBACK_URL || "https://sociedade-absolutus.vercel.app/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log('GitHub profile received:', profile);
    
    const user = {
        id: profile.id,
        provider: 'github',
        name: profile.displayName || profile.username,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile._json.avatar_url,
        profileUrl: profile.profileUrl,
        firstLogin: !users.has(profile.id)
    };
    
    users.set(profile.id, user);
    return done(null, user);
}));

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
    passport.authenticate('github', { 
        failureRedirect: '/?error=github_auth_failed',
        successRedirect: '/?login=success'
    })
);

app.get('/auth/user', (req, res) => {
    res.json({ 
        user: req.user || null,
        totalUsers: users.size
    });
});

app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/auth/stats', (req, res) => {
    res.json({
        totalUsers: users.size,
        users: Array.from(users.values())
    });
});

// Health check
app.get('/auth/health', (req, res) => {
    res.json({ status: 'OK', users: users.size });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🔐 GitHub Auth server running on port ${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('   GET /auth/github');
    console.log('   GET /auth/github/callback');
    console.log('   GET /auth/user');
    console.log('   GET /auth/logout');
    console.log('   GET /auth/stats');
    console.log('   GET /auth/health');
});
