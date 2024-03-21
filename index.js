const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { default: axios } = require("axios");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "localAuth",
  }),
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  console.log(msg.body);
  console.log(msg.from);
  console.log(msg.id.id);

  const responseApi = await axios.get("https://quran-api.santrikoding.com/api/surah");
  const data = responseApi.data;
  const surah = data.find((item) => item.nama_latin === msg.body);

  //   Start
  if (msg.body === "start") {
    await client.sendMessage(
      msg.from,
      "Selamat Datang di Bot Quran \nMasukkan perintah sesuai menu berikut :\n1. !random (Untuk mendapatkan random ayat) \n2. !surah (Untuk melihat list surah)\n3. nama_surah (Ketik nama surah yang diinginkan)"
    );
  } else if (msg.body === "!random") {
    const nomor = Math.floor(Math.random() * 114) + 1;
    const responseDetailSurah = await axios.get(`https://quran-api.santrikoding.com/api/surah/${nomor}`);
    const data = responseDetailSurah.data;
    const rand = Math.floor(Math.random() * data.jumlah_ayat) + 1;
    const ayat = data.ayat[rand].nomor;

    try {
      await client.sendMessage(
        msg.from,
        `Surah : ${data.nama_latin}
        \nArti : ${data.arti}
        \nJumlah Ayat : ${data.jumlah_ayat}
        \nRandom Ayat : ${ayat}
        \n${data.ayat[rand].ar}
        \n${data.ayat[rand].idn}`
      );
    } catch (error) {
      console.log(error);
      await sendMessage(msg.from, "Terjadi kesalahan dalam memuat data");
    }

    // !Surah
  } else if (msg.body === "!surah") {
    try {
      const surahText = data.map((surah) => `${surah.nomor}. ${surah.nama_latin}`).join("\n");
      await client.sendMessage(msg.from, surahText);
    } catch (error) {
      console.log(error);
      await sendMessage(msg.from, "Terjadi kesalahan dalam memuat data");
    }

    // Nama Surah
  } else if (msg.body === surah.nama_latin) {
    try {
      const { nama_latin, jumlah_ayat, tempat_turun } = surah;
      await client.sendMessage(
        msg.from,
        `Surah ${nama_latin} 
        \nJumlah Ayat : ${jumlah_ayat} 
        \nTempat Turun : ${tempat_turun}`
      );
    } catch (error) {
      console.log(error);
      await sendMessage(msg.from, "Terjadi kesalahan dalam memuat data");
    }
  }
});

client.initialize();
