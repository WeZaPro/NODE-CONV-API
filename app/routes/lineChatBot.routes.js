module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const lineBot = require("../controllers/lineChatBot.controller");

  var router = require("express").Router();

  app.get("/webhook", lineBot.getChat);
  app.post("/webhook", lineBot.chat);

  // API SET DATA
  app.post("/send-message", lineBot.sendMessageFromWeb);
  app.post("/saveDataInfo", lineBot.saveDataInfo);

  // ---------------------------
  // API CHAT BOT
  const line = require("@line/bot-sdk");
  const config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.channelSecret,
  };

  const client = new line.Client(config);

  // app.post("/lineUser", line.middleware(config), (req, res) => {
  app.post("/lineUser", async (req, res) => {
    console.log("req.body.events ", req.body.events[0]);

    //console.log("text===>  ", req.body.events[0].message.text);
    // รับ request จาก bot ให้เช็ค linebot destination = req.body.destination
    console.log("req.body.destination ", req.body.destination);
    // find destination from mongodb => get data
    try {
      if (
        req.body.events[0].type == "message" ||
        req.body.events[0].type == "text"
      ) {
        console.log(")K============> ");
        const userId = req.body.events[0].source.userId;
        const profile = await client.getProfile(userId);
        console.log("User Profile:", profile);

        // ส่งข้อความตอบกลับผู้ใช้
        return client.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `Hello ${profile.displayName}! Your user ID is ${profile.userId}.`,
        });
      }
    } catch (err) {
      console.error("Error getting profile:", err);
    }
  });

  app.use("/api/", router);
};
