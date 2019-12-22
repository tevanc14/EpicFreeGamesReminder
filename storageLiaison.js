const {
  Storage
} = require("@google-cloud/storage");
const fs = require("fs");

const storage = new Storage();
const bucketName = "epic_free_games_reminder_data";
const bucket = storage.bucket(bucketName);
const dirName = "archive";
const fileName = "latest.json";

async function writeData(data) {
  fs.writeFileSync(fileName, JSON.stringify(data));

  const options = {
    destination: fileName,
    contentType: "application/json"
  };

  bucket.upload(fileName, options, async (err, file) => {
    fs.unlinkSync(fileName);

    if (err) throw new Error(err);

    await file.copy(buildArchiveFileName());
  });
}

async function readData() {
  const file = storage.bucket(bucketName).file(fileName);
  return await JSON.parse(file.download());
}

function buildArchiveFileName() {
  return dirName + "/" + Date.now() + ".json";
}

module.exports = {
  writeData: writeData,
  readData: readData
}