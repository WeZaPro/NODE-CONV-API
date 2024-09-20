module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const lineBot = require("../controllers/lineChatBot.controller");

  var router = require("express").Router();
  const axios = require("axios");
  const bodyParser = require("body-parser");
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/webhook", lineBot.getChat);
  app.post("/webhook", lineBot.chat);

  // API SET DATA
  app.post("/send-message", lineBot.sendMessageFromWeb);
  app.post("/saveDataInfo", lineBot.saveDataInfo);

  app.post("/lineUser", lineBot.lineUser);

  app.post("/lineCheckDestination", lineBot.lineCheckDestination);
  app.post("/updateLineBotId", lineBot.updateLineBotId);

  // ---------------------------
  // API CHAT BOT
  const line = require("@line/bot-sdk");
  const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.channelSecret,
  };

  const client = new line.Client(config);

  // Provider Line Login
  const clientId = process.env.clientId;
  const clientSecret = process.env.channelSecret;
  const redirectUri = process.env.redirectUri;

  app.get("/callback", async (req, res) => {
    // console.log("req ", req);
    const requestUrl = req.originalUrl;
    console.log("Request URL:", requestUrl);
    const state = req.query.state;
    console.log("state>>>>> ", state);

    const authorizationCode = req.query.code;

    if (!authorizationCode) {
      return res.status(400).send("Authorization code is missing");
    }

    try {
      const response = await axios.post(
        "https://api.line.me/oauth2/v2.1/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const accessToken = response.data.access_token;
      // res.send(`Access Token: ${accessToken}`);

      if (accessToken) {
        // ถ้าทุกอย่างถูกต้อง redirect ไปที่ Vue.js หน้า Home

        //https://vue-line-liff-conversion.onrender.com
        //https://schoolshopliffweb.onrender.com
        res.redirect(`${state}?token=${accessToken}`);
      } else {
        // ถ้าเกิดข้อผิดพลาด redirect ไปหน้า Error
        res.redirect(state);
      }
    } catch (error) {
      console.error(
        "Error exchanging code for access token:",
        error.response ? error.response.data : error.message
      );
      // ส่งข้อผิดพลาดที่เจอไปยังผู้ใช้
      res
        .status(500)
        .send(
          `Error exchanging code for access token: ${
            error.response
              ? error.response.data.error_description
              : error.message
          }`
        );
    }
  });

  // app.get("/callbackA", async (req, res) => {
  //   console.log("req.body ", req.body);
  //   const authorizationCode = req.query.code;

  //   if (!authorizationCode) {
  //     return res.status(400).send("Authorization code is missing");
  //   }

  //   try {
  //     const response = await axios.post(
  //       "https://api.line.me/oauth2/v2.1/token",
  //       new URLSearchParams({
  //         grant_type: "authorization_code",
  //         code: authorizationCode,
  //         redirect_uri: redirectUri,
  //         client_id: clientId,
  //         client_secret: clientSecret,
  //       }),
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );

  //     const accessToken = response.data.access_token;
  //     // res.send(`Access Token: ${accessToken}`);

  //     if (accessToken) {
  //       // ถ้าทุกอย่างถูกต้อง redirect ไปที่ Vue.js หน้า Home
  //       res.redirect(
  //         `https://schoolshopliffweb.onrender.com?token=${accessToken}`
  //       );
  //     } else {
  //       // ถ้าเกิดข้อผิดพลาด redirect ไปหน้า Error
  //       res.redirect("https://schoolshopliffweb.onrender.com");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error exchanging code for access token:",
  //       error.response ? error.response.data : error.message
  //     );
  //     // ส่งข้อผิดพลาดที่เจอไปยังผู้ใช้
  //     res
  //       .status(500)
  //       .send(
  //         `Error exchanging code for access token: ${
  //           error.response
  //             ? error.response.data.error_description
  //             : error.message
  //         }`
  //       );
  //   }
  // });

  app.post("/findConvUidToUpdateLineUid", async (req, res) => {
    const db = require("../models");
    const DataGTM = db.userGtms;

    const convUid = req.body.convUserId;
    const lineUid = req.body.lineUid;

    console.log();

    const filter = { convUserId: convUid };
    const update = { lineUid: lineUid };

    DataGTM.findOneAndUpdate(filter, update, {
      new: true,
    })
      .then((data) => {
        if (!data) {
          const notFound = "Not found findconvUserIdAndUpdateLineUid with id ";
          // return notFound;
          res.send({ message: notFound });
        } else {
          // return data;
          res.send({ message: data });
          // res
          //   .status(500)
          //   .send({ message: "Error retrieving fingToken
        }
      })
      .catch((err) => {
        console.log("err ", err);
        // res
        //   .status(500)
        //   .send({ message: "Error retrieving fingTokenFormDestination with id=" + destination });
      });
  });

  app.use("/api/", router);
};

function findTokenFormDestination(destination) {
  const db = require("../models");
  const Customer = db.customer;
  Customer.findOne({ linebot_destination: destination })
    .then((data) => {
      if (!data) {
        const notFound = "Not found fingTokenFormDestination with id ";
        return notFound;
      } else {
        return data;
      }
    })
    .catch((err) => {
      console.log("err ", err);
      // res
      //   .status(500)
      //   .send({ message: "Error retrieving fingTokenFormDestination with id=" + destination });
    });
}
