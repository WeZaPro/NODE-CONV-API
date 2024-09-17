const db = require("../models");
const https = require("https");
const LineBot = db.getMessage;
const DataGTM = db.userGtms;
require("dotenv").config();
const liff = require("@line/liff");

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
    utm_source: req.body.utm_source,
    utm_medium: req.body.utm_medium,
    utm_term: req.body.utm_term,
    gg_ketword: req.body.gg_ketword,
  });

  if (gtmData.utm_source && gtmData.utm_medium) {
    DataGTM.findOne(
      { convUserId: req.body.convUserId },
      function (err, _dataGTM) {
        // console.log("_dataGTM ", _dataGTM);
        if (!_dataGTM) {
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

// function samplePayload() {
//   console.log("test send payLoad-->");
//   return [
//     {
//       type: "template",
//       altText: "this is a confirm template",
//       template: {
//         columns: [
//           {
//             title: "เบียร์สด หรือ นามะบีรุ",
//             actions: [
//               {
//                 type: "uri",
//                 uri: "https://liff.line.me/2001254953-w391eWy1",
//                 label: "รายละเอียด",
//               },
//             ],
//             text: "เป็นเครื่องดื่มที่ทางร้านนาเอบะขาดไม่ได้เลย ลูกค้ามักจะถามถึงเป็นอันดับแรก",
//             thumbnailImageUrl:
//               "https://naebaizakaya.com/wp-content/uploads/2023/11/1-1.jpg",
//           },
//           {
//             actions: [
//               {
//                 type: "uri",
//                 uri: "https://liff.line.me/2001254953-w391eWy1",
//                 label: "รายละเอียด",
//               },
//             ],
//             title: "เมนูเสียบไม้ หรือ ยากิโทริ",
//             text: "ยากิโทริคือไก่ย่างเสียบไม้โดยจะมีไก่หลายส่วนให้เลือก",
//             thumbnailImageUrl:
//               "https://naebaizakaya.com/wp-content/uploads/2023/11/2-2.jpg",
//           },
//           {
//             text: "เป็นเครื่องดื่มอีกชนิดที่ลูกค้าที่ร้านนาเอบะชอบสั่งมาดื่มกัน มีรสชาติหวานอมเปรี้ยว",
//             thumbnailImageUrl:
//               "https://naebaizakaya.com/wp-content/uploads/2023/11/3-1.jpg",
//             actions: [
//               {
//                 label: "รายละเอียด",
//                 uri: "https://liff.line.me/2001254953-w391eWy1",
//                 type: "uri",
//               },
//             ],
//             title: "เหล้าบ๊วย หรือ อุเมะชุ",
//           },
//           {
//             title: "หม้อไฟ หรือ นาเบะ",
//             actions: [
//               {
//                 type: "uri",
//                 label: "รายละเอียด",
//                 uri: "https://liff.line.me/2001254953-w391eWy1",
//               },
//             ],
//             text: "คืออาหารที่ใส่ผัก,เห็ด,เนื้อสัตว์,เต้าหู้ และเส้น ลงในหม้อแล้วพร้อมเสริฟ",
//             thumbnailImageUrl:
//               "https://naebaizakaya.com/wp-content/uploads/2023/11/4-1.jpg",
//           },
//         ],
//         type: "carousel",
//         imageSize: "cover",
//         imageAspectRatio: "square",
//       },
//     },
//   ];
// }
