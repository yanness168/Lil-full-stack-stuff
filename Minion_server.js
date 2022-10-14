const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(__dirname +'/images_uploaded'));
app.use(express.static(__dirname +'/public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,"./images_uploaded")
    },
    filename: (req,file,callback)=>{
        callback(null,`${Date.now()}--${file.originalname}`)
    }
})

const upload = multer({storage:storage});


app.post("/single", upload.single("image"),(req,res)=>{
    console.log(req.file)
    res.send("Image uploaded successfully.")
})
    /* To get a random picture from folder: images_uploaded */
    .get("/single", (req, res) => {
        let upload_dir = path.join(__dirname, "images_uploaded");
        let uploads = fs.readdirSync(upload_dir);
        // Add error handling
        if (uploads == undefined) {
            return res.status(400).send({
                message: 'No images to be uploaded...'
            });
        }

        let max = uploads.length - 1;
        let min = 0;
        let range = max - min;

        /* To return min to max(min and max included) */
        let index = Math.floor(Math.random() * (range + 1) ) + min;   

        let randomImage = uploads[index];
        res.sendFile(path.join(upload_dir, randomImage));
    });


app.post('/multiple', upload.array("images",4),(req,res)=>{
    console.log(req.files)
    console.log("Images uploaded successfully")
    res.send("Image uploaded successfully.")
})
    /* To get multiple photos displayed */
    .get("/multiple", (req, res) => {
        let upload_dir = path.join(__dirname, "images_uploaded");
        let uploads = fs.readdirSync(upload_dir);
        if (uploads == undefined) {
            return res.status(400).send({
                message: 'No images to be uploaded...'
            });
        }
        let mPics = JSON.stringify(uploads);
        // Add error handling
        fs.readdir(upload_dir, function (err, mPics) {
            if(err){
                res.status(500).send({
                    message: "Uable to scan photos...",
                })
            }
            res.status(200).send(mPics);
    });
    
});


app.get("/error-unknown",(req,res,err,next)=>{
    fs.readFile("/file-does-not-exist",(err,data)=>{
        if(err){
            next(err);
        }else{
            res.send(data);
        }
    })
})

app.use((req,res, next,error)=>{
    console.log("Error handling middleware is called!!");
    console.log("Path: " + req.path);
    console.log("ERROR: " + error);

    res.send(`Customized error page: ${error.code}`);
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>console.log('listening on port...'));