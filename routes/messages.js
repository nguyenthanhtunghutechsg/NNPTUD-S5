var express = require('express');
var router = express.Router();
let { Authentication } = require('../utils/authHandler')
let messageSchema = require('../schemas/messages')

router.get("/:userId", Authentication, async function (req, res, next) {
  let userId = req.params.userId;
  let me = req.userId;
  let messages = await messageSchema.find({
    $or: [{
      from: me, to: userId
    }, {
      from: userId, to: me
    }]
  }).select('from to text').sort({
    createdAt: 1
  })
  res.send({
    success: true,
    data: messages
  })
})
router.post('/', Authentication, async function (req, res, next) {
  let to = req.body.to;
  let text = req.body.text;
  let newMessage = new messageSchema({
    from: req.userId,
    to: to,
    text: text
  })
  await newMessage.save();
  res.status(200).send({
    success: true,
    data: newMessage
  })
})

module.exports = router;