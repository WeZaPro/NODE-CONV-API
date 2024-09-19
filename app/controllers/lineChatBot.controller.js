const db = require("../models");
const https = require("https");
const LineBot = db.getMessage;
const DataGTM = db.userGtms;
require("dotenv").config();
const liff = require("@line/liff");

// API CHAT BOT
const line = require("@line/bot-sdk");
const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.channelSecret,
};
const client = new line.Client(config);

// let channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
let channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

exports.getChat = (req, res) => {
  console.log("GET CHAT----->");
  res.status(200).send({ message: "Send from chat bot" });
};

exports.chat = (req, res) => {
  console.log("CHAT----->");
  console.log("req.body.events----->", req.body.events);
  try {
    const lineChatBot = new LineBot({
      userId: req.body.events[0].source.userId,
      inputMessage: req.body.events[0].message.text,
    });
    //Todo -> find user id from db=> req.body.events[0].source.userId
    //Todo -> yes -> next | no -> save to db

    LineBot.findOne(
      { userId: req.body.events[0].source.userId },
      function (err, _userId) {
        console.log("_userId => ", _userId);
        console.log(
          "req.body.events[0].message.text  => ",
          req.body.events[0].message.text
        );

        //Todo รับข้อความจาก Liff -> เช็คว่าใช่คำว่า "START"
        if (req.body.events[0].message.text === "START") {
          //Todo save db
          lineChatBot
            .save()
            .then((data) => {
              console.log("save-> ", data);
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while creating the Tutorial.",
              });
            });
        } else {
          if (_userId === null) {
            //Todo send message confirm save
            confirmSaveDb(req, res, channelAccessToken);
          } else {
            console.log("req.body.events[0].--> ", req.body.events[0]);
          }
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

function confirmSaveDb(req, res, channelAccessToken) {
  console.log("confirmSaveDb ", confirmSaveDb);
  try {
    const lineUserId = req.body.events[0].source.userId;
    if (req.body.events[0].message.type === "text") {
      // not stricker

      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        //   messages: samplePayload(),

        messages: setRegister(lineUserId),

        //   ],
      });

      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + channelAccessToken,
      };

      const webhookOptions = {
        hostname: "api.line.me",
        path: "/v2/bot/message/reply",
        method: "POST",
        headers: headers,
        body: dataString,
      };

      const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
        });
      });

      request.on("error", (err) => {
        console.error(err);
      });

      request.write(dataString);
      request.end();

      //=====> end
    } else {
      console.log("message type = !text");
      res.status(200).send({
        message: "message type = !text",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

function setRegister(lineUserId) {
  const testParam = lineUserId;
  //https://liff.line.me/1656824759-KYL5BkQ6/
  // const testParam = "Uad26c3928a8f42fb5eb677bf560bf07f";
  //var urlLiff = `line://app/${process.env.liffApp}/path?botUserId=` + testParam; //ไปหน้า Liff App |แก้เป็น liff web a หน้าสำหรับ redirect
  // var urlLiff = `https://liff.line.me/1656824759-j1N4MAYk`;
  var urlLiff = process.env.liffChat;
  console.log("urlLiff -> ", testParam);
  return [
    {
      type: "template",
      altText: "this is a confirm template",
      template: {
        type: "confirm",
        text: "ต้องการที่จะติดต่อพนักงานหรือไม่?",
        actions: [
          {
            // type: "message",
            // label: "YES",
            // text: "START",
            //
            type: "uri",
            label: "YES",
            uri: urlLiff,
          },
          {
            type: "message",
            label: "NO",
            text: "NO",
          },
        ],
      },
    },
  ];
}

function sendMessage(req, res, channelAccessToken) {
  if (req.body.events[0].message.type === "text") {
    // not stricker

    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      //   messages: samplePayload(),

      messages: [
        {
          type: "text",
          text: responseMessage(req.body.events[0].message.text),
        },
        {
          type: "sticker",
          packageId: "446",
          stickerId: "1988",
        },
      ],

      //   ],
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + channelAccessToken,
    };

    const webhookOptions = {
      hostname: "api.line.me",
      path: "/v2/bot/message/reply",
      method: "POST",
      headers: headers,
      body: dataString,
    };

    const request = https.request(webhookOptions, (res) => {
      res.on("data", (d) => {
        process.stdout.write(d);
      });
    });

    request.on("error", (err) => {
      console.error(err);
    });

    request.write(dataString);
    request.end();

    //=====> end
  } else {
    console.log("message type = !text");
    res.status(200).send({
      message: "message type = !text",
    });
  }
}

function responseMessage(inputMsg) {
  return inputMsg;
}
exports.saveDataInfo = async (req, res) => {
  // get data from website ผ่าน gtm แล้ว save to mongo
  const gtmData = new DataGTM({
    customerID: req.body.customerID,
    convUserId: req.body.convUserId,
    userAgent: req.body.userAgent,
    ipAddess: req.body.ipAddess,
    clientID: req.body.clientID,
    utm_campaign: req.body.utm_campaign,
    utm_source: req.body.utm_source,
    utm_medium: req.body.utm_medium,
    utm_term: req.body.utm_term,
    gg_keyword: req.body.gg_keyword,
    session_id: req.body.session_id,
  });

  // DataGTM.findOne(
  //   { convUserId: req.body.convUserId },
  //   function (err, _dataGTM) {
  //     // console.log("_dataGTM ", _dataGTM);
  //     if (!_dataGTM) {
  //       gtmData.save().then((dataSave) => {
  //         // console.log("dataSave ", dataSave);
  //         // res.send({ message: "save data ok", sendData: dataSave });
  //         res.status(200).send({ message: "save data ok", sendData: dataSave });
  //       });
  //     }
  //   }
  // );
  console.log("-------------IPADDRESS----------------", req.body.ipAddess);
  console.log("gtmData --------", gtmData);
  if (gtmData.utm_source && gtmData.utm_medium) {
    console.log("Save db --------");
    console.log("utm_source ", gtmData.utm_source);
    console.log("utm_medium ", gtmData.utm_medium);
    DataGTM.findOne(
      { convUserId: req.body.convUserId },
      // { ipAddess: req.body.ipAddess },
      function (err, _dataGTM) {
        console.log("-------------_dataGTM-------------------------", _dataGTM);

        if (_dataGTM) {
          console.log("พบข้อมูล _dataGTM >>>>> ", _dataGTM);
        } else {
          console.log("ไม่พบข้อมูล _dataGTM  & SAVE >>>>> ", _dataGTM);
          gtmData.save().then((dataSave) => {
            // console.log("dataSave ", dataSave);
            // res.send({ message: "save data ok", sendData: dataSave });
            res
              .status(200)
              .send({ message: "save data ok", sendData: dataSave });
          });
        }
      }
    );
  } else {
    console.log("---------------------------------------------");
    console.log("Don't Save db ขาดข้อมูล UTM --------");
    console.log("utm_source ", gtmData.utm_source);
    console.log("utm_medium ", gtmData.utm_medium);
  }
};
//

exports.sendMessageFromWeb = async (req, res) => {
  console.log("req.body -> ", req.body);

  // ตรวจสอบว่ามี 'to' และ 'messages' หรือไม่
  if (!req.body.to || !req.body.messages) {
    return res
      .status(400)
      .json({ message: "'to' and 'messages' fields are required" });
  }

  const messagingApiUrl = "https://api.line.me/v2/bot/message/push";
  const messagingAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  // const messagingAccessToken =
  //   "tvb2bkJUvF5ZbSzAf9WDSmfwbwRDxI/2Nlw1TROa2XbaSAXdySiT1w4OvRQrTWPcZXSWvNn1cwlZtBkjly5fhhubxbIXzxZ5sAqnk0644k4l1ShKzP2MXJxZ50Wd1L0d1Yba6vX1JVDQYA/EBH2DbgdB04t89/1O/w1cDnyilFU=";

  try {
    const response = await fetch(messagingApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messagingAccessToken}`,
      },
      body: JSON.stringify(req.body),
    });

    const responseData = await response.json();
    console.log("response data: ", responseData);

    if (response.ok) {
      res.status(200).json({ message: "Message sent successfully" });
    } else {
      console.log("Failed response data: ", responseData);
      res
        .status(response.status)
        .json({ message: "Failed to send message", details: responseData });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.lineUser = async (req, res) => {
  // console.log("req.body.events ", req.body.events[0]);
  // console.log("req.body.destination ", req.body.destination);
  // console.log("userId ", req.body.events[0].source.userId);
  const lineUid = req.body.events[0].source.userId;
  // get data from website ผ่าน gtm แล้ว save to mongo
  // const gtmData = new DataGTM({
  //   customerID: req.body.customerID,
  //   convUserId: req.body.convUserId,
  //   userAgent: req.body.userAgent,
  //   ipAddess: req.body.ipAddess,
  //   clientID: req.body.clientID,
  //   utm_campaign: req.body.utm_campaign,
  //   utm_source: req.body.utm_source,
  //   utm_medium: req.body.utm_medium,
  //   utm_term: req.body.utm_term,
  //   gg_keyword: req.body.gg_keyword,
  // });
  // const filter = { lineUid: lineUid };
  const userId = req.body.events[0].source.userId;
  const profile = await client.getProfile(userId);

  //ADD FRIEND
  const addNewFriend = {
    measurement_id: "G-BF1T8ZNXZQ",
    secret_value: "C2sGHFZaRF6MA0KQ_igkiA",
    event: "addFriend",
  };

  const purchase = {
    measurement_id: "G-BF1T8ZNXZQ",
    secret_value: "NMsz4YtcS0SlSoFV-jK-uQ",
    event: "PurchaseA",
  };

  const interest = {
    measurement_id: "G-BF1T8ZNXZQ",
    secret_value: "_UBms8ItRX2nl49klAVNVw",
    event: "interest",
  };

  try {
    if (
      req.body.events[0].type == "message" ||
      req.body.events[0].type == "text"
    ) {
      console.log(
        "TYPE Message============> ",
        req.body.events[0].message.text
      );
      const getText = req.body.events[0].message.text;
      let messageBack = ""; // Use let instead of const to allow reassignment

      const checkTextA = "สนใจ";
      const checkTextB = "สั่งซื้อ";
      const isInterest = getText.includes(checkTextA);
      const isPurchase = getText.includes(checkTextB);
      // console.log("isInterest ", isInterest);

      if (isInterest) {
        // console.log("interest case");
        messageBack = `${checkTextA} = interest case`;
        await fnAddConv(userId, interest);
        // ส่งข้อความตอบกลับผู้ใช้
        return client.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else if (isPurchase) {
        // console.log("purchase case");
        messageBack = `${checkTextB} = purchase case`;
        await fnAddConv(userId, purchase);
        // ส่งข้อความตอบกลับผู้ใช้
        return client.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else {
        // console.log("default case");
        messageBack = "default case";
        // ส่งข้อความตอบกลับผู้ใช้
        // return client.replyMessage(req.body.events[0].replyToken, {
        //   type: "text",
        //   text: `SEND CASE ${messageBack}! `,
        // });
      }
    } else if (req.body.events[0].type == "follow") {
      console.log("TYPE FOLLOW============> ");
      // const userId = req.body.events[0].source.userId;
      // const profile = await client.getProfile(userId);
      // console.log("User Profile:", profile);

      await fnAddConv(userId, addNewFriend);

      // ส่งข้อความตอบกลับผู้ใช้
      return client.replyMessage(req.body.events[0].replyToken, {
        type: "text",
        text: `Hello ${profile.displayName}! Your user ID is ${profile.userId}.`,
      });
    }
  } catch (err) {
    console.error("Error getting profile:", err);
  }

  // res.send("test");
};

// };

const fnAddConv = async function (userId, getEnv) {
  console.log("getEnv ", getEnv);
  try {
    let update = "";
    if (getEnv.event == "addFriend") {
      update = { addFriend: true };
    } else if (getEnv.event == "interest") {
      update = { eventA: true };
    } else if (getEnv.event == "PurchaseA") {
      update = { eventB: true };
    } else {
      update = { eventC: "na" };
    }

    const filter = { lineUid: userId };

    // Use the options to return the updated document
    const addConv = await DataGTM.findOneAndUpdate(filter, update, {
      new: true,
    });
    await sendToGa4(userId, getEnv);
    console.log("addConv ", addConv);
    // goto GA4 API Conversion
  } catch (error) {
    console.error("Error updating addFriend: ", error);
  }
};

const sendToGa4 = async function (userId, getEnv) {
  console.log("sendToGa4 ", userId);

  // Find the document in the database
  DataGTM.findOne({ lineUid: userId }, function (err, _dataGTM) {
    if (err) {
      console.error("Error finding data: ", err);
      return;
    }

    if (!_dataGTM) {
      console.log("No data found for user: ", userId);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      client_id: _dataGTM.clientID,
      user_properties: { ipAddress: { value: _dataGTM.ipAddess } },
      events: [
        {
          name: getEnv.event,
          params: {
            convUserId: _dataGTM.convUserId,
            campaign: _dataGTM.utm_campaign,
            source: _dataGTM.utm_source,
            medium: _dataGTM.utm_medium,
            term: _dataGTM.utm_term,
            content: _dataGTM.gg_keyword,
            session_id: _dataGTM.session_id,
            // engagement_time_msec: "100",
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const api_secret = getEnv.secret_value; // Corrected 'api_secre' to 'api_secret'
    const measurement_id = getEnv.measurement_id;

    // Added '&' between the query parameters in the URL
    fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
      // "https://www.google-analytics.com/mp/collect?measurement_id=G-BF1T8ZNXZQ&api_secret=Dpl6kV_3TC-FtqFKFQ9Plw",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          // Handle error response
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        // Check if there's any content to parse
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Parse response as JSON
        } else {
          return response.text(); // Handle non-JSON response (if any)
        }
      })
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => console.error("Error with fetch: ", error));
  });
};
