const sendpulse = require("sendpulse-api");

const secrets = require("./secrets.json");

const tokenStorage = "/tmp/";

sendpulse.init(secrets.sendpulse.apiUserId, secrets.sendpulse.apiSecret, tokenStorage, token => {
  if (token && token.is_error) {
    console.log("NO TOKEN!?!?!!?");
  }

  sendpulse.createCampaign(
    callback,
    "Sleek Software",
    "no-reply@sleek.software",
    "New Free Game From Epic Games",
    buildEmailHtml(),
    secrets.sendpulse.addressBookId
  );
});

function callback(data) {
  console.log("Started campaign:", data);
}

function buildEmailHtml() {
  return "<h1>FREE GAMES, but not the scam kind</h1>";
}