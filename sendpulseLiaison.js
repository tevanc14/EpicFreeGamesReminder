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

      sendpulse.createCampaign(
        callback,
        "Sleek Software",
        "tevan@sleek.software",
        "New Free Game From Epic Games",
        buildEmailHtml(scrapedInfo),
        secrets.sendpulse.addressBookId
      );
    }
  );
}

function callback(data) {
  console.log("Started campaign:", data);
}

function buildEmailHtml(scrapedInfo) {
  const html = fs.readFileSync("./template.html", "UTF8");
  const $ = cheerio.load(html);
  for (const gameInfo of scrapedInfo) {
    const formattedStartDate = formatDate(gameInfo.date.startDate);
    const formattedEndDate = formatDate(gameInfo.date.endDate);

    const row = `
    <tr class="game-row" 
        onclick="window.open('${gameInfo.link}', '_blank');">
      <th>
          ${gameInfo.title}
      </th>
      <th>
          ${chooseStartDateText(formattedStartDate, formattedEndDate, gameInfo)}
      </th>
      <th>
          <time datetime="${gameInfo.date.endDate}">${formattedEndDate}</time>
      </th>
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
  console.log(formattedStartDate, formattedEndDate);
  if (formattedStartDate === formattedEndDate) {
    return "<p>Now</p>";
  } else {
    return `<time datetime="${gameInfo.date.startDate}">${formattedStartDate}</time>`;
  }
}

module.exports = {
  createCampaign: createCampaign,
  buildEmailHtml: buildEmailHtml
};