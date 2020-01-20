const {
  Storage
} = require("@google-cloud/storage");
const fs = require("fs");

const storage = new Storage();
const bucketName = "epic_free_games_reminder_data";
const bucket = storage.bucket(bucketName);
const dirName = "archive";
// Must be in /tmp to be writeable in GCF
const fileName = "latest.json";
const localFilePath = `/tmp/${fileName}`;

async function writeData(data) {
  fs.writeFileSync(localFilePath, JSON.stringify(data));

  const options = {
    destination: fileName,
    contentType: "application/json"
  };

  bucket.upload(localFilePath, options, async (err, file) => {
    fs.unlinkSync(localFilePath);

    if (err) throw new Error(err);

    await file.copy(buildArchiveFileName());
  });
}

async function readData() {
  const file = storage.bucket(bucketName).file(fileName);
  if ((await file.exists())[0]) {
    const resultBytes = await file.download();
    return JSON.parse(resultBytes.toString());
  } else {
    return {}
  }
}

function buildArchiveFileName() {
  return `${dirName}/${Date.now()}.json`;
}

module.exports = {
  writeData: writeData,
  readData: readData
}