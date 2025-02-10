const express = require("express");
const AWS = require("aws-sdk");

const router = express.Router();

// Configure AWS DynamoDB
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Save individual chat message
router.post("/chat", async (req, res) => {
  const { userId, message, timestamp } = req.body;

  const params = {
    TableName: "Conversations",
    Item: {
      UserID: userId,
      Timestamp: timestamp,
      Message: message,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(200).send({ message: "Message saved successfully!" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).send({ error: "Could not save message" });
  }
});

// Save entire conversation
router.post("/save-conversation", async (req, res) => {
  const { userId, title, conversation, timestamp } = req.body;

  const params = {
    TableName: "Conversations",
    Item: {
      UserID: userId,
      Title: title,
      Conversation: conversation,
      Timestamp: timestamp,
    },
  };

  try {
    await dynamoDB.put(params).promise();
    res.status(200).send({ message: "Conversation saved successfully!" });
  } catch (error) {
    console.error("Error saving conversation:", error);
    res.status(500).send({ error: "Could not save conversation" });
  }
});

module.exports = router;
