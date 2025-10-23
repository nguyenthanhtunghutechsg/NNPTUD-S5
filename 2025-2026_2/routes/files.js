var express = require('express');
var router = express.Router();
var path = require('path')
let fs = require('fs')
let { uploadAFileWithField, uploadMultiFilesWithField } = require('../utils/uploadHandler')


router.get('/:filename', function (req, res, next) {
  let pathFile = path.join(__dirname, "../resources/images/", req.params.filename);
  if (fs.existsSync(pathFile)) {
    res.status(200).sendFile(pathFile);
  } else {
    res.status(200).send({
      success: false,
      data: "file not found"
    });
  }
})

router.post("/uploads", uploadAFileWithField('image'), function (req, res, next) {
  let URL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
  res.status(200).send({
    success: true,
    data: URL
  });
})
router.post("/uploadMulti", uploadMultiFilesWithField('image'), function (req, res, next) {
  let URLs = req.files.map(function (file) {
    return `${req.protocol}://${req.get('host')}/files/${file.filename}`
  })
  res.status(200).send({
    success: true,
    data: URLs
  });
})





module.exports = router;