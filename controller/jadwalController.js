const client = require("./clientController");
const { default: axios } = require("axios");

const JadwalSholat = async (from, message) => {
  if (message === "!jadwal") {
    try {
      const idKota = 1402;
      const date = new Date();
      const responsejadwal = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      const data = responsejadwal.data.data;
      const { subuh, dzuhur, ashar, maghrib, isya } = data.jadwal;

      await client.sendMessage(
        from,
        `Jadwal Sholat Hari Ini Untuk Wilayah Banyumas\n- Subuh : ${subuh}\n- Dzuhur : ${dzuhur}\n- Ashar : ${ashar}\n- Maghrib : ${maghrib}\n- Isya : ${isya}
      `
      );
    } catch (error) {
      console.log(error);
      await client.sendMessage(from, "Terjadi kesalahan dalam memuat data");
    }
  }
};

module.exports = JadwalSholat;
