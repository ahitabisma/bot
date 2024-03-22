const client = require("./controller/clientController");
const Surah = require("./controller/surahController");
const JadwalSholat = require("./controller/jadwalController");

client.on("message", async (msg) => {
  console.log(msg.body);
  console.log(msg.from);
  console.log(msg.id.id);

  if (msg.body === "start") {
    await client.sendMessage(
      msg.from,
      `Selamat Datang di Bot Quran & Jadwal Sholat
      \nMasukkan perintah sesuai menu berikut :
      1. !random (Untuk mendapatkan random ayat)
      2. !surah (Untuk melihat list surah)
      3. nama_surah (Ketik nama surah yang diinginkan)
      4. !jadwal (Untuk mendapatkan jadwal sholat hari ini)
      `
    );
  } else {
    if (msg.body === "!jadwal") {
      await JadwalSholat(msg.from, msg.body);
    } else {
      await Surah(msg.from, msg.body);
    }
  }
});

client.initialize();
