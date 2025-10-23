var express = require('express');
var router = express.Router();
let path = require('path')

router.get('/',function(req,res,next){
    let filepath = path.join(__dirname,'../resources/files/chat.html')
    res.sendFile(filepath)
})

module.exports = router;