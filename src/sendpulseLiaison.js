const fs = require("fs");
const cheerio = require("cheerio");
const sendpulse = require("sendpulse-api");

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

      const html = buildEmailHtml(scrapedInfo);
      fs.writeFileSync("gen.html", html);

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

function buildEmailHtml(scrapedInfo) {
  const html = fs.readFileSync("./src/template.html", "UTF8");
  const $ = cheerio.load(html);
  for (const gameInfo of scrapedInfo) {
    const formattedStartDate = formatDate(gameInfo.date.startDate);
    const formattedEndDate = formatDate(gameInfo.date.endDate);

    // This has to be updated with the inline styles when changing the html template
    const row = `
    <tr>
      <td style="border-bottom: 1px solid rgb(38, 38, 38);">
        <p>
          ${gameInfo.title}
        </p>
      </td>

      <td style="border-bottom: 1px solid rgb(38, 38, 38);">
        <p>
          ${chooseStartDateText(formattedStartDate, formattedEndDate, gameInfo)}
        </p>
      </td>

      <td style="border-bottom: 1px solid rgb(38, 38, 38);">
        <p>
          ${formattedEndDate}
        </p>
      </td>
    </tr>
    `;
    $("#game-table").append(row);
  }
  return $.html();
}

function formatDate(date) {
  const dateObj = new Date(date);
  const formatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric"
  };
  return dateObj.toLocaleDateString("en-US", formatOptions);
}

function chooseStartDateText(formattedStartDate, formattedEndDate, gameInfo) {
  if (formattedStartDate === formattedEndDate) {
    return "Now";
  } else {
    return formattedStartDate;
  }
}

module.exports = {
  createCampaign: createCampaign,
  buildEmailHtml: buildEmailHtml
};