const db = require("../models");
const https = require("https");
const LineBot = db.getMessage;
const DataGTM = db.userGtms;
require("dotenv").config();
const liff = require("@line/liff");

// API CHAT BOT
const line = require("@line/bot-sdk");
// check channel access token + channel Secret

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
  // console.log("CHAT----->");
  // console.log("req.body.events----->", req.body.events);
  // try {
  //   const lineChatBot = new LineBot({
  //     userId: req.body.events[0].source.userId,
  //     inputMessage: req.body.events[0].message.text,
  //   });
  //   //Todo -> find user id from db=> req.body.events[0].source.userId
  //   //Todo -> yes -> next | no -> save to db
  //   LineBot.findOne(
  //     { userId: req.body.events[0].source.userId },
  //     function (err, _userId) {
  //       console.log("_userId => ", _userId);
  //       console.log(
  //         "req.body.events[0].message.text  => ",
  //         req.body.events[0].message.text
  //       );
  //       //Todo รับข้อความจาก Liff -> เช็คว่าใช่คำว่า "START"
  //       if (req.body.events[0].message.text === "START") {
  //         //Todo save db
  //         lineChatBot
  //           .save()
  //           .then((data) => {
  //             console.log("save-> ", data);
  //             res.send(data);
  //           })
  //           .catch((err) => {
  //             res.status(500).send({
  //               message:
  //                 err.message ||
  //                 "Some error occurred while creating the Tutorial.",
  //             });
  //           });
  //       } else {
  //         if (_userId === null) {
  //           //Todo send message confirm save
  //           // confirmSaveDb(req, res, channelAccessToken);
  //         } else {
  //           console.log("req.body.events[0].--> ", req.body.events[0]);
  //         }
  //       }
  //     }
  //   );
  // } catch (err) {
  //   console.log(err);
  // }
};

function confirmSaveDb(req, res, channelAccessToken) {
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
            // text: lineUserId,
            //
            type: "uri",
            label: "YES",
            uri: `${urlLiff}/?botUserId=${lineUserId}`,
          },
          {
            type: "uri",
            label: "NO",
            uri: `${urlLiff}/?lineUserId=${lineUserId}`,
          },
          // {
          //   type: "message",
          //   label: "NO",
          //   text: "NO",
          // },
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

//TODO HOLD *********
exports.sendMessageFromWeb = async (req, res) => {
  console.log("req.body -> ", req.body);
  // console.log("req.body messages-> ", req.body.messages);
  // console.log("req.body.messages[1].text-> ", req.body.messages[1].text);

  const sendLine = {
    to: "Ue7435fca0163b1e68944d0f3eb3589ae",

    messages: [
      {
        type: "text",

        text: "Hello from Vue.js! | user id : U634375582d774e1c8ce69c31f6f1ba48",
      },
    ],
  };

  // ตรวจสอบว่ามี 'to' และ 'messages' หรือไม่
  if (!req.body.to || !req.body.messages) {
    return res
      .status(400)
      .json({ message: "'to' and 'messages' fields are required" });
  }

  const messagingApiUrl = "https://api.line.me/v2/bot/message/push";
  // const messagingAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const messagingAccessToken =
    "XMJ7WeHHv/jhWWGEeDqV3PxO7fuxAtRumykv5/hm4ZqD+dQac2XtZiQySQavmI38CcwkeucAeTgiVRg1nyv6bE95TkrNDURLRYqM1PjmgfkZ7EQHWiBT5/sIAhIs7iyr6FAKSBvTEX3bfmKVVKGB4gdB04t89/1O/w1cDnyilFU=";
  // const messagingAccessToken =
  //   "tvb2bkJUvF5ZbSzAf9WDSmfwbwRDxI/2Nlw1TROa2XbaSAXdySiT1w4OvRQrTWPcZXSWvNn1cwlZtBkjly5fhhubxbIXzxZ5sAqnk0644k4l1ShKzP2MXJxZ50Wd1L0d1Yba6vX1JVDQYA/EBH2DbgdB04t89/1O/w1cDnyilFU=";

  try {
    const response = await fetch(messagingApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${messagingAccessToken}`,
      },
      // body: JSON.stringify(req.body),
      body: JSON.stringify(sendLine),
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

exports.lineCheckDestination = async (req, res) => {
  console.log("req.body.events ", req.body.events[0]);
  console.log("req.body.destination ", req.body.destination);
  res.send({ message: "testLine" });
};

exports.updateLineBotId = async (req, res) => {
  console.log("req.body.lineUid ", req.body.lineUid);
  console.log("req.body.lineBotUid ", req.body.lineBotUid);
  try {
    if (req.body.lineUid && req.body.lineBotUid) {
      const filter = { lineUid: req.body.lineUid };
      const update = {
        lineBotUid: req.body.lineBotUid,
      };
      // Use the options to return the updated document
      const addLineBotUid = await DataGTM.findOneAndUpdate(filter, update, {
        new: true,
      });
      console.log("addLineBotUid ", addLineBotUid);
      res.send({ message: "updateLineBotId" });
    } else {
      res.send({ message: "no data request" });
    }
  } catch (err) {
    console.log("err ", err);
  }
};

exports.lineUser = async (req, res) => {
  // console.log("Req >>>>>>>>>>>>>>> ", req);
  // check destination
  const BotMarketing_Destination = "U07ab7da94695cca39e6333e9a7db7ba7";
  const AccessToken_BotMarketing =
    "tvb2bkJUvF5ZbSzAf9WDSmfwbwRDxI/2Nlw1TROa2XbaSAXdySiT1w4OvRQrTWPcZXSWvNn1cwlZtBkjly5fhhubxbIXzxZ5sAqnk0644k4l1ShKzP2MXJxZ50Wd1L0d1Yba6vX1JVDQYA/EBH2DbgdB04t89/1O/w1cDnyilFU=";
  const channelSecret_BotMarketing = "ed8d53f3b3d65b4f30a12af005f0a510";
  const BotMarketing_ga4_id = "G-BF1T8ZNXZQ";
  //
  const BotMarketing_ga4_event_addNewFriend = "addFriend";
  const BotMarketing_ga4_secret_addNewFriend = "C2sGHFZaRF6MA0KQ_igkiA";
  //
  const BotMarketing_ga4_event_purchase = "PurchaseA";
  const BotMarketing_ga4_secret__purchase = "NMsz4YtcS0SlSoFV-jK-uQ";
  //
  const BotMarketing_ga4_event_interest = "interest";
  const BotMarketing_ga4_secret_interest = "_UBms8ItRX2nl49klAVNVw";
  //-----------------------------------------------------------------------------------------------------------------
  const SiriBot_Destination = "U8b1d7e5f0a2986289113cfb14df51e18";
  const AccessToken_SiriBot =
    "XMJ7WeHHv/jhWWGEeDqV3PxO7fuxAtRumykv5/hm4ZqD+dQac2XtZiQySQavmI38CcwkeucAeTgiVRg1nyv6bE95TkrNDURLRYqM1PjmgfkZ7EQHWiBT5/sIAhIs7iyr6FAKSBvTEX3bfmKVVKGB4gdB04t89/1O/w1cDnyilFU=";
  const channelSecret_SiriBot = "894bf30e64cb28fff808ce93ffb19230";
  const SiriBot_ga4_id = "G-041ZG8ZZ50";
  //
  const SiriBot_ga4_event_addNewFriend = "addFriend";
  const SiriBot_ga4_secret_addNewFriend = "ERh5RV41TVOQORPAFcJaKw";
  //
  const SiriBot_ga4_event_purchase = "PurchaseA";
  const SiriBot_ga4_secret_purchase = "FVxfTVDPSFuV78wK3Fv4fQ";
  //
  const SiriBot_ga4_event_interest = "interest";
  const SiriBot_ga4_secret_interest = "eF_AC5SeRxi2BwCBZok5Yw";
  //-------------------------------------------------------------------------------

  let channel_access_token = "";
  let secret_channel = "";
  //
  let _ga4_id = "";
  let _addNewFriend_secret = "";
  let _addNewFriend_event = "";
  let _purchaseA_secret = "";
  let _purchaseA_event = "";
  let _interest_secret = "";
  let _interest_event = "";
  //
  switch (req.body.destination) {
    case BotMarketing_Destination:
      msg = "Bot Marketing ==> ";
      channel_access_token = AccessToken_BotMarketing;
      _ga4_id = BotMarketing_ga4_id;
      _addNewFriend_secret = BotMarketing_ga4_secret_addNewFriend;
      _addNewFriend_event = BotMarketing_ga4_event_addNewFriend;
      _purchaseA_secret = BotMarketing_ga4_secret__purchase;
      _purchaseA_event = BotMarketing_ga4_event_purchase;
      _interest_secret = BotMarketing_ga4_secret_interest;
      _interest_event = BotMarketing_ga4_event_interest;
      break;

    case SiriBot_Destination:
      msg = "SiriBot ==> ";
      channel_access_token = AccessToken_SiriBot;
      //
      _ga4_id = SiriBot_ga4_id;
      _addNewFriend_secret = SiriBot_ga4_secret_addNewFriend;
      _addNewFriend_event = SiriBot_ga4_event_addNewFriend;
      _purchaseA_secret = SiriBot_ga4_secret_purchase;
      _purchaseA_event = SiriBot_ga4_event_purchase;
      _interest_secret = SiriBot_ga4_secret_interest;
      _interest_event = SiriBot_ga4_event_interest; //
      break;
  }

  const config_line = {
    channelAccessToken: channel_access_token,
    channelSecret: secret_channel,
  };
  const client_line = new line.Client(config_line);

  // console.log("req.body ", req.body);
  // console.log("req.body.destination ", req.body.destination);
  // console.log("req.body.events ", req.body.events[0]);
  // console.log("req.body.destination ", req.body.destination);
  // console.log("userId ", req.body.events[0].source.userId);
  const lineUid = req.body.events[0].source.userId;

  const userId = req.body.events[0].source.userId;
  const profile = await client_line.getProfile(userId);

  //ADD FRIEND
  const addNewFriend = {
    measurement_id: _ga4_id,
    secret_value: _addNewFriend_secret,
    event: _addNewFriend_event,
  };

  const purchase = {
    measurement_id: _ga4_id,
    secret_value: _purchaseA_secret,
    event: _purchaseA_event,
  };

  const interest = {
    measurement_id: _ga4_id,
    secret_value: _interest_secret,
    event: _interest_event,
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

      console.log("isPurchase ", isPurchase);
      console.log("isInterest ", isInterest);

      const START = "START";
      // console.log("isInterest ", isInterest);

      if (isInterest) {
        // console.log("interest case");
        messageBack = `${checkTextA} = interest case`;
        console.log("interest ", interest);
        await fnAddConv(userId, interest);
        // ส่งข้อความตอบกลับผู้ใช้
        return client_line.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else if (isPurchase) {
        // console.log("purchase case");
        messageBack = `${checkTextB} = purchase case`;
        await fnAddConv(userId, purchase);
        // ส่งข้อความตอบกลับผู้ใช้
        return client_line.replyMessage(req.body.events[0].replyToken, {
          type: "text",
          text: `SEND CASE ${messageBack}! `,
        });
      } else {
        // รับ TEXT จาก LIFF WEB
        //Todo
        // update bot User ID
        messageBack = ` = update userid case`;

        try {
          DataGTM.findOne(
            { lineBotUid: req.body.events[0].source.userId },
            function (err, _userId) {
              console.log("_userId => ", _userId);
              if (_userId === null) {
                //Todo send message confirm save
                confirmSaveDb(req, res, config_line.channelAccessToken);
                // กด yes บน reply จะส่ง botUid ไปกับ param และ find lineUid -> update botUid
              } else {
                console.log("req.body.events[0].--> ", req.body.events[0]);
              }
            }
          );
        } catch (err) {
          console.log(err);
        }
      }
    } else if (req.body.events[0].type == "follow") {
      console.log("TYPE FOLLOW============> ");
      // const userId = req.body.events[0].source.userId;
      // const profile = await client.getProfile(userId);
      // console.log("User Profile:", profile);

      await fnAddConv(userId, addNewFriend);

      // ส่งข้อความตอบกลับผู้ใช้
      return client_line.replyMessage(req.body.events[0].replyToken, {
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
  console.log("getEnv secret_value ", getEnv.secret_value);
  console.log("getEnv event ", getEnv.event);

  try {
    let update = "";
    if (getEnv.event === "addFriend") {
      update = { addFriend: true };
    } else if (getEnv.event === "interest") {
      update = { eventA: true };
    } else if (getEnv.event === "PurchaseA") {
      update = { eventB: true };
    } else {
      update = { eventC: "na" };
    }

    const filter = { lineBotUid: userId };
    console.log("ADD CONVERSION TO DB filter==>> ", filter);
    console.log("ADD CONVERSION TO DB update==>> ", update);
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
  console.log("sendToGa4 ");
  console.log("userId >>>>>>> ", userId);
  console.log("getEnv event>>>>>> ", getEnv.event);
  console.log("getEnv secret_value>>>>>> ", getEnv.secret_value);
  console.log("getEnv measurement_id>>>>>> ", getEnv.measurement_id);

  // Find the document in the database
  DataGTM.findOne({ lineBotUid: userId }, function (_dataGTM) {
    console.log("findOne DataGTM>>>>>>>>>>>", _dataGTM);
    // console.log("findOne err>>>>>>>>>>>", err);

    // if (err) {
    //   console.error("Error finding data: ", err);
    //   return;
    // }

    if (!_dataGTM) {
      console.log("Nodata>>>>>>>", userId);
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

    console.log("raw>>>>>>> ", raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const api_secret = getEnv.secret_value; // Corrected 'api_secre' to 'api_secret'
    const measurement_id = getEnv.measurement_id;

    console.log("findOne api_secret>>>>>>>>>>>", api_secret);
    console.log("findOne measurement_id>>>>>>>>>>>", measurement_id);

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
