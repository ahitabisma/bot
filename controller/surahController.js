const client = require("./clientController");
const { default: axios } = require("axios");

const Surah = async (from, message) => {
  const responseSurah = await axios.get("https://api.myquran.com/v2/quran/surat/semua");
  const dataSurah = responseSurah.data.data;
  const surah = dataSurah.find((item) => item.name_id === message);
  console.log(surah)

  //   !Random Ayat
  if (message === "!random") {
    const responseAcak = await axios.get("https://api.myquran.com/v2/quran/ayat/acak");
    const data = responseAcak.data.data;
    const { info, ayat } = data;

    try {
      await client.sendMessage(
        from,
        `Surah : ${info.surat.nama.id}\nJumlah Ayat : ${info.surat.ayat_max}\nRandom Ayat : ${ayat.ayah}
        \n${ayat.arab}\n_${ayat.latin}_
        \nArtinya : ${ayat.text}`
      );
    } catch (error) {
      console.log(error);
      await client.sendMessage(from, "Terjadi kesalahan dalam memuat data");
    }

    // !Surah
  } else if (message === "!surah") {
    try {
      const surahText = dataSurah.map((surah) => `${surah.number}. ${surah.name_id}`).join("\n");
      await client.sendMessage(from, surahText);
    } catch (error) {
      console.log(error);
      await client.sendMessage(from, "Terjadi kesalahan dalam memuat data");
    }

    // Nama Surah
  } else if (message === surah.name_id) {
    try {
      const responseDetailSurah = await axios.get(`https://api.myquran.com/v2/quran/surat/${surah.number}`);
      const data = responseDetailSurah.data.data;
      const { name_id, number, number_of_verses, revelation_id, translation_id, tafsir } = data;
      await client.sendMessage(
        from,
        `Surah ${name_id} (${translation_id})\nSurah ke-${number}\nJumlah Ayat : ${number_of_verses}\nTempat Turun : ${revelation_id}
        \nTafsir : ${tafsir}`
      );
    } catch (error) {
      console.log(error);
      await client.sendMessage(from, "Terjadi kesalahan dalam memuat data");
    }
  }
};

module.exports = Surah;
