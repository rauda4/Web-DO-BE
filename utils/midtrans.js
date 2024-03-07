const midtransClient = require('midtrans-client');
require('dotenv').config();

const coreMidtrans = () => {
  const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY
  });
  return coreApi;
};

const snapMidtrans = () => {
  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY
  });
  return snap;
};

module.exports = { coreMidtrans, snapMidtrans };
