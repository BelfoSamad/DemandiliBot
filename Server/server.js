require('./db');

//------------------------------------ Declarations
const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    passport = require('passport'),
    Receive = require("./bot/services/base/receive"),
    GraphAPi = require("./bot/services/base/graph-api"),
    config = require("./bot/config"),
    User = require("./bot/models/user");

let users = [];

var app = express();

//------------------------------------ Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());


//TODO: change teh placing of this code
app.get("/webhook", (req, res) => {
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === config.verifyToken) {
            // Responds with the challenge token from the request
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for your webhook
app.post("/webhook", (req, res) => {
    let body = req.body;

    // Checks if this is an event from a page subscription
    if (body.object === "page") {
        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];

            // Get the sender PSID
            let senderPsid = webhookEvent.sender.id;

            if (!(senderPsid in users)) {
                let user = new User(senderPsid);
                GraphAPi.getUserProfile(senderPsid)
                    .then(userProfile => {
                        user.setProfile(userProfile);
                    })
                    .catch(error => {
                        // The profile is unavailable
                        console.log("Profile is unavailable:", error);
                    })
                    .finally(() => {
                        users[senderPsid] = user;
                        //i18n.setLocale(user.locale);
                        if (webhookEvent.pass_thread_control)
                            Receive.handleHandoverControl(user);
                        else Receive.handleMessage(user, webhookEvent);
                    });
            } else {
                let user = users[senderPsid];
                if (webhookEvent.pass_thread_control)
                    Receive.handleHandoverControl(user);
                else Receive.handleMessage(user, webhookEvent);
            }

        });
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});

// Set up your App's Messenger Profile
app.get("/profile", (req, res) => {
    let token = req.query["verify_token"];

    /*
    if (!config.webhookUrl.startsWith("https://")) {
        res.status(200).send("ERROR - Need a proper API_URL in the .env file");
    }*/
    
    var Profile = require("./bot/services/base/profile.js");
    Profile = new Profile();

    // Checks if a token and mode is in the query string of the request
    if (token) {
        if (token === config.verifyToken) {
            //Setup the Profile
            Profile.setupProfile();

            //Send Status
            res.write("<h1>Everything is Setup and Good To Go</h1>");
            res.status(200).end();
        } else {
            //'403 Forbidden'
            res.sendStatus(403);
        }
    } else {
        //404 Not Found
        res.sendStatus(404);
    }
});

// listen for requests
var listener = app.listen(config.port, function () {
    console.log("Your app is listening on port " + listener.address().port);
});