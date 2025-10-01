const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const path = require('path');

const app = express();

// Session configuration
app.use(session({
    secret: 'sociedade-absolutus-sa-token-mining-' + Math.random().toString(36),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

app.use(passport.initialize());
app.use(passport.session());

// User storage (in production, use a database)
const users = new Map();

// Passport serialization
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user || null);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        provider: 'google',
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        firstLogin: !users.has(profile.id)
    };
    
    users.set(profile.id, user);
    return done(null, user);
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        provider: 'github',
        name: profile.displayName || profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        username: profile.username,
        firstLogin: !users.has(profile.id)
    };
    
    users.set(profile.id, user);
    return done(null, user);
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'your-facebook-app-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'your-facebook-app-secret',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email', 'photos']
}, (accessToken, refreshToken, profile, done) => {
    const user = {
        id: profile.id,
        provider: 'facebook',
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value,
        firstLogin: !users.has(profile.id)
    };
    
    users.set(profile.id, user);
    return done(null, user);
}));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { 
    successRedirect: '/',
    failureRedirect: '/?error=auth_failed'
}));

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { 
    successRedirect: '/',
    failureRedirect: '/?error=auth_failed'
}));

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successRedirect: '/',
    failureRedirect: '/?error=auth_failed'
}));

app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/auth/user', (req, res) => {
    res.json({ user: req.user || null });
});

app.get('/auth/stats', (req, res) => {
    res.json({
        totalUsers: users.size,
        users: Array.from(users.values())
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🔐 Auth server running on port ${PORT}`);
    console.log('🌐 Available endpoints:');
    console.log('   /auth/google');
    console.log('   /auth/github');
    console.log('   /auth/facebook');
    console.log('   /auth/logout');
    console.log('   /auth/user');
});
