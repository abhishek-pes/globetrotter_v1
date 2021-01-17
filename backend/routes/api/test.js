const express = require("express");
const router = express.Router();
const StreamrClient = require('streamr-client')
const API = 'f085735391c60a402f4742b0f859f8c495472baf411e1bd21fbc579bfa884bf9'

router.post("/dest_send", (req, res) => {
    var STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Globetrotter'

    const streamr = new StreamrClient({
        auth: {
            privateKey: API,
        },
    })

    const msg = {
        "destination": req.body.destination
    }

    streamr.publish(STREAM_ID, msg).then(() => {
        console.log("destination sent")
    })
    res.json({ msg: "destination sent" })
});


module.exports = router;