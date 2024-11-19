var multer = require("multer")
var path = require("path")
var fs = require("fs")
const dateObj = new Date()
const month = dateObj.getUTCMonth() + 1
const day = dateObj.getUTCDate()
const year = dateObj.getUTCFullYear()
    // console.log('----------->', year, month, day)

var store = multer.diskStorage({

    destination: function(req, file, cb) {
        if (!fs.existsSync('./uploads/' + year)) {
            fs.mkdirSync('./uploads/' + year)
        }
        if (!fs.existsSync('./uploads/' + year + '/' + month)) {
            fs.mkdirSync('./uploads/' + year + '/' + month)
        }
        cb(null, './uploads/' + year + '/' + month)
    },
    filename: function(req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname))
            // cb(null, req.body.docname + '.jpg')
    }
})

var Studentstorage = multer.diskStorage({
    destination: function(req, file, cb) {

        var url_string = req.params.id;
        var urlInArray = url_string.split(',');

        /**
         * converting array url in directory structure to check the avaialbilty of the directory
         */
        var directory_path = '';
        urlInArray.forEach(element => {
            directory_path = directory_path + '/' + element;
        });
        if (fs.existsSync('./uploads/' + directory_path)) {
            //file exists
        } else {
            var recurring_path = ''
            urlInArray.forEach(element => {
                recurring_path = recurring_path + '/' + element;
                fs.mkdirSync('./uploads/' + recurring_path);
            });
        }
        cb(null, "./uploads/" + directory_path);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname);
    }
});

var StudentUpload = multer({ storage: Studentstorage }).single("file");






var upload = multer({ storage: store }).single("file")

module.exports = {
    upload: (req, res) => {
        upload(req, res, function(err) {
            if (err) {
                return res.status(501).json({ error: err })
            }
            return res.json({ msg: "Uploaded Successfully", file: req.file, "fileName": req.file.filename })
        })
    },

    uploadDocument: (req, res) => {
        StudentUpload(req, res, function(err) {
            if (err) {
                return res.status(501).json({ error: err });
            }
            //do all database record saving activity
            return res.json({ msg: "Uploaded Successfully", file: req.file });
            // return res.json({originalname:req.file.originalname, uploadname:req.file.filename});
        });
    },

    download: (req, res) => {
        filepath = path.join(__dirname, "/../") + req.params.folder1 + '/' + req.params.folder2 + '/' + req.params.folder3 + '/' + req.params.filename
        defaultfilepath = path.join(__dirname, "/../public/uploads") + "/no-image.png"
        if (fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.sendFile(defaultfilepath)
        }
    },

    folderDownload: (req, res) => {
        filepath = path.join(__dirname, "/../uploads") + "/" + req.params.folder + "/" + req.params.filename
        defaultfilepath = path.join(__dirname, "/../public/uploads") + "/no-image.png"
        if (fs.existsSync(filepath)) {
            res.sendFile(filepath)
        } else {
            res.sendFile(defaultfilepath)
        }
    },



}