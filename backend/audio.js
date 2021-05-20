const fs = require("fs");
const path = require("path");

const audioDir = __dirname + "/../db/audio_files/";

////////////////////////////////////////////////////////////////////////////////
// Card Audio

function getCardIds() {
  const files = fs.readdirSync(audioDir + "cards/");
  let ids = [];
  for (let f in files) {
    const name = files[f].replace(".mp3", "");
    const id = parseInt(name);
    if (isNaN(id)) continue;
    ids.push(id);
  }
  return ids;
}

function getCard(id) {
  const file = path.join(audioDir + "cards/" + id + ".mp3");
  if (fs.existsSync(file)) return file;
  return null;
}

function saveCard(request, id) {
  request.pipe(fs.createWriteStream(audioDir + "cards/" + id + ".mp3"));
}

function deleteCard(id) {
  const file = path.join(audioDir + "cards/" + id + ".mp3");
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getCardIds = getCardIds;
module.exports.getCard = getCard;
module.exports.saveCard = saveCard;
module.exports.deleteCard = deleteCard;
