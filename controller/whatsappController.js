const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
// const { LocalAuth } = require("whatsapp-web.js/dist/auth");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "localAuth",
  }),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.initialize();

module.exports = {
  getClient: () => client,
};
