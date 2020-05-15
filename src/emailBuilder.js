const fs = require("fs");
const cheerio = require("cheerio");

function buildEmailHtml(scrapedInfo) {
  const html = fs.readFileSync("./template.html", "UTF8");
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
          ${chooseStartDateText(formattedStartDate, formattedEndDate)}
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
  if (date === "?") {
    return "?";
  }

  const dateObj = new Date(date);
  const formatOptions = {
    month: "short",
    day: "numeric"
  };
  return dateObj.toLocaleDateString("en-US", formatOptions);
}

function chooseStartDateText(formattedStartDate, formattedEndDate) {
  if (formattedStartDate === formattedEndDate) {
    return "Now";
  } else {
    return formattedStartDate;
  }
}

module.exports = {
  buildEmailHtml: buildEmailHtml
};
