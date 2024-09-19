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

  // ---------------------------
  // API CHAT BOT
  const line = require("@line/bot-sdk");
  const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.channelSecret,
  };

  const client = new line.Client(config);

  // app.post("/lineUser_test", async (req, res) => {
  //   console.log("req.body.events ", req.body.events[0]);
  //   if (
  //     req.body.events[0].type == "message" ||
  //     req.body.events[0].type == "text"
  //   ) {
  //     console.log("type ---> message");
  //   } else if (req.body.events[0].type == "follow") {
  //     console.log("type ---> follow");
  //   }
  //   res.send("test");
  // });
  // app.post("/lineUser", line.middleware(config), (req, res) => {
  // app.post("/lineUser_hold", async (req, res) => {
  //   console.log("req.body.events ", req.body.events[0]);

  //   //console.log("text===>  ", req.body.events[0].message.text);
  //   // รับ request จาก bot ให้เช็ค linebot destination = req.body.destination
  //   console.log("req.body.destination ", req.body.destination);
  //   // find destination from mongodb => get data
  //   //TODO hold ไว้ก่อนนังไม่ใช้
  //   // const cusData = findTokenFormDestination(req.body.destination);
  //   // console.log("cusData ", cusData);

  //   try {
  //     if (
  //       req.body.events[0].type == "message" ||
  //       req.body.events[0].type == "text"
  //     ) {
  //       console.log("TYPE MESSAGE============> ");
  //       const userId = req.body.events[0].source.userId;
  //       const profile = await client.getProfile(userId);
  //       console.log("User Profile:", profile);
  //       console.log("User ID:", profile.userId);

  //       // ใช้  profile.userId find mongoDB แล้ว Update Follow status + Send Date Event+Secret to GA4

  //       // ส่งข้อความตอบกลับผู้ใช้
  //       return client.replyMessage(req.body.events[0].replyToken, {
  //         type: "text",
  //         text: `Hello ${profile.displayName}! Your user ID is ${profile.userId}.`,
  //       });
  //     } else if (req.body.events[0].type == "follow") {
  //       console.log("TYPE FOLLOW============> ");
  //       const userId = req.body.events[0].source.userId;
  //       const profile = await client.getProfile(userId);
  //       console.log("User Profile:", profile);

  //       // ส่งข้อความตอบกลับผู้ใช้
  //       return client.replyMessage(req.body.events[0].replyToken, {
  //         type: "text",
  //         text: `Hello ${profile.displayName}! Your user ID is ${profile.userId}.`,
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Error getting profile:", err);
  //   }
  // });

  const clientId = process.env.clientId;
  const clientSecret = process.env.channelSecret;
  const redirectUri = process.env.redirectUri;

  app.get("/callback", async (req, res) => {
    console.log("req ", req);
    const requestUrl = req.originalUrl;

    console.log("Request URL:", requestUrl);

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
        res.redirect(
          `https://vue-line-liff-conversion.onrender.com?token=${accessToken}`
        );
      } else {
        // ถ้าเกิดข้อผิดพลาด redirect ไปหน้า Error
        res.redirect("https://vue-line-liff-conversion.onrender.com");
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

  // app.get("/callbackDemo", async (req, res) => {
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
