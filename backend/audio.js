const fs = require("fs");
const path = require("path");

const audioDir = __dirname + "/../db/audio_files/";

////////////////////////////////////////////////////////////////////////////////

function getAudioIds(folder) {
  const files = fs.readdirSync(audioDir + folder + "/");
  let ids = [];
  for (let f in files) {
    const name = files[f].replace(".mp3", "");
    const id = parseInt(name);
    if (isNaN(id)) continue;
    ids.push(id);
  }
  return ids;
}

function getAudio(folder, id) {
  const file = path.join(audioDir + folder + "/" + id + ".mp3");
  if (fs.existsSync(file)) return file;
  return null;
}

function saveAudio(request, folder, id) {
  request.pipe(fs.createWriteStream(audioDir + folder + "/" + id + ".mp3"));
}

function deleteAudio(folder, id) {
  const file = path.join(audioDir + folder + "/" + id + ".mp3");
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}

////////////////////////////////////////////////////////////////////////////////

module.exports.getAudioIds = getAudioIds;
module.exports.getAudio = getAudio;
module.exports.saveAudio = saveAudio;
module.exports.deleteAudio = deleteAudio;
