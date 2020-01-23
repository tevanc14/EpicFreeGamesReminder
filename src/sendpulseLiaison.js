const sendpulse = require("sendpulse-api");

const emailBuilder = require("./emailBuilder");
const secrets = require("./secrets.json");

const tokenStorage = "/tmp/";

function createCampaign(scrapedInfo) {
  sendpulse.init(
    secrets.sendpulse.apiUserId,
    secrets.sendpulse.apiSecret,
    tokenStorage,
    token => {
      if (token && token.is_error) {
        console.log("NO TOKEN!?!?!!?");
      }

      const html = emailBuilder.buildEmailHtml(scrapedInfo);

      sendpulse.createCampaign(
        callback,
        "Sleek Software",
        "tevan@sleek.software",
        "New Free Game From Epic Games",
        html,
        secrets.sendpulse.addressBookId
      );
    }
  );
}

function callback(data) {
  console.log("Finished trying to start the campaign:", data);
}

module.exports = {
  createCampaign: createCampaign
};
