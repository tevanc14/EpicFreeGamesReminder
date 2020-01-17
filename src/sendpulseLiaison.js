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
    <tr class="table-row" 
        onclick="window.open('${gameInfo.link}', '_blank');"
        style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; cursor: pointer;">
      <th class="table-cell">
          ${gameInfo.title}
      </th>
      <th class="table-cell"
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding: 30px;">
          ${chooseStartDateText(formattedStartDate, formattedEndDate, gameInfo)}
      </th>
      <th class="table-cell"
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding: 30px;">
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