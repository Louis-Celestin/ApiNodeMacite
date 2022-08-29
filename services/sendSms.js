var axios = require("axios");
const { parse } = require("dotenv");
require("dotenv").config();
var qs = require("qs");
function sendSms(numero, message) {
  var data = qs.stringify({
    grant_type: "client_credentials",
  });
  var config = {
    method: "post",
    url: "https://api.orange.com/oauth/v3/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + process.env.TOKEN_SMS_ORANGE,
      Accept: "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      const tokenJson = JSON.stringify(response.data.access_token);
      const token = JSON.parse(tokenJson);

      console.log("********************************************");
      console.log(token);
      configSendSms(token, numero, message);
    })
    .catch(function (error) {
      return JSON.stringify({ message: "Message non envoie" });
    });
}

function configSendSms(token, numero, message) {
  console.log("OK");
  var datas = JSON.stringify({
    outboundSMSMessageRequest: {
      address: "tel:+225" + numero,
      senderAddress: "tel:+2250702928786",
      senderName: "MonService",
      outboundSMSTextMessage: {
        message: message,
      },
    },
  });

  var configu = {
    method: "post",
    url: "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B2250702928786/requests",
    headers: {
      "Content-Type": "application/json",

      Authorization: "Bearer " + token,
    },
    data: datas,
  };

  axios(configu)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = sendSms;
