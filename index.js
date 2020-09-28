const express = require('express')
const dotenv = require('dotenv')
const app = express()
const session = require("express-session")
const bodyParser = require("body-parser");

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

dotenv.config()
const port = process.env.PORT || 3030

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_OAUTH_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    console.log('Your Token:', token);
    console.log('Your TokenSecret:', tokenSecret);
    done(null, profile)
  }
));

app.use(express.static("public"));
app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(bodyParser.urlencoded({ extended: false }));app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.redirect('/auth/twitter')
})

app.get('/success', (req, res) => {
    const { displayName, username } = req.session.passport.user
    res.send('YAYYYYY ' + username + ' - ' + displayName + '!')
})

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/success');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
  