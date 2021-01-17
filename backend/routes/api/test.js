const express = require("express");
const router = express.Router();
const StreamrClient = require('streamr-client')

router.post("/form",(req,res)=>{
var STREAM_ID = '0xcedd0024aa729244f33f13348e0bf7601f933fad/test_globetrotter'
var API = '206656bcf576be28697407f0b363d85b125bf5dc75baa0a19578aa6797f78064'

const streamr = new StreamrClient({
    auth: {
        privateKey: API,
    },
})

const msg = {
    "name":req.body.name
}

streamr.publish(STREAM_ID, msg).then(() => {
    console.log("data sent")
})
res.json({"msg":"data sent"})
});
module.exports = router;