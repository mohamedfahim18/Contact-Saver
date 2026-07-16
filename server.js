require("dotenv").config();
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');

const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dns.resolveSrv("_mongodb._tcp.cluster0.thdyvss.mongodb.net", (err, records) => {
    if (err) {
        console.error(err);
    } else {
        console.log(records);
    }
});



mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");    
})
.catch((err)=>{
    console.log("Connection Error");
    console.log(err)
});

const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: String,
    phone: String,
    email: String
});

const Contact = mongoose.model("Contact", contactSchema);



const server = http.createServer(async(req,res)=>{

    console.log(req.method,req.url);

    if (req.method=="GET" && req.url=="/") {

        fs.readFile("index.html", (err,data) => {
            res.end(data);
        });

        return;
    }

    if (req.method=="GET" && req.url=="/style.css") {

        fs.readFile("style.css", (err,data) => {
            res.writeHead(200, {
                "Content-Type": "text/css; charset=UTF-8"
            });
            res.end(data);
        });

        return;
    }

    if (req.method=="GET" && req.url=="/script.js") {

        fs.readFile("script.js",(err,data)=>{

            res.writeHead(200,{
                "Content-Type": "application/javascript; charset=UTF-8"
            });

            res.end(data);

        });

        return;
    }

    if (req.method=="POST" && req.url=="/add-contact") {

        let body="";

        req.on("data",(chunk)=>{
            body+=chunk;
        });

        req.on("end",async()=>{
            let data = new URLSearchParams(body);
            let contact = new Contact({
                name: data.get("name"),
                phone: data.get("phone"),
                email: data.get("email")
            });
            await contact.save();
            res.end("Contact Saved");
        });
        return;
    }

    if (req.method=="GET" && req.url=="/contacts") {
        let contacts = await Contact.find();
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(contacts));
        return;
    }

    if (req.method=="POST" && req.url=="/delete-contact") {

        let body="";

        req.on("data",(chunk)=>{
            body+=chunk;
        });
        req.on("end", async ()=>{
            let data=new URLSearchParams(body);
            await Contact.findByIdAndDelete(data.get("id"));
            res.end("Deleted");
        });
        return;
    }

    res.end("Page Not Found");

});


const PORT=process.env.PORT||3000;

server.listen(PORT,()=> {
    console.log("Server is Running...");
});
