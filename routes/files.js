var express = require('express');
var router = express.Router();
var path = require('path')
let fs = require('fs')
let { uploadAFileWithField, uploadMultiFilesWithField } = require('../utils/uploadHandler')
const { Response } = require('../utils/responseHandler');
let FormData = require('form-data');
let axios = require('axios')

router.get('/:filename', function (req, res, next) {
    let pathFile = path.join(__dirname, "../resources/files/", req.params.filename);
    if (fs.existsSync(pathFile)) {
        res.status(200).sendFile(pathFile);
    } else {
        Response(res, 404, false, "File not found");
    }
})


router.post("/uploads", uploadAFileWithField('image'), async function (req, res, next) {
    let formdata = new FormData();
    let file = fs.createReadStream(req.file.path);
    formdata.append('image', file);
    let result = await axios.post("http://localhost:3001/files/uploads",
        formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
    )
    fs.unlinkSync(req.file.path);
    //console.log(result);
    //let URL = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`
    Response(res, 200, true, result.data);
})
router.post("/uploadMulti", uploadMultiFilesWithField('image'), function (req, res, next) {
    let URLs = req.files.map(function (file) {
        return `${req.protocol}://${req.get('host')}/files/${file.filename}`
    })
    Response(res, 200, true, URLs)
})

module.exports = router;