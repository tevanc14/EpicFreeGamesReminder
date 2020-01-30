const sendpulse = require("sendpulse-api");

const emailBuilder = require("./emailBuilder");
const secrets = require("./secrets.json");

const tokenStorage = "/tmp/";

function createCampaign(scrapedInfo) {
  sendpulse.init(
    secrets.sendpulse.apiUserId,
    secrets.sendpulse.apiSecret,
    tokenStorage,
    async (token) => {
      if (token && token.is_error) {
        console.log("NO TOKEN!?!?!!?");
      }

      const html = emailBuilder.buildEmailHtml(scrapedInfo);
      await sendpulsePromiseWrapper(html);
    }
  );
}

function sendpulsePromiseWrapper(html) {
  return new Promise((resolve, reject) => {
    sendpulse.createCampaign(
      response => {
        console.log("Finished trying to start the campaign:", response);
        resolve("Finished successfully");
      },
      "Sleek Software",
      "tevan@sleek.software",
      "New Free Game From Epic Games",
      html,
      secrets.sendpulse.addressBookId
    );
  });
}

module.exports = {
  createCampaign: createCampaign
};
