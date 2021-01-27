const express = require("express");
const router = express.Router();
const StreamrClient = require('streamr-client')
const ethers = require('ethers')
var SHARED_SECRET = "9rpMdLArQ3C8_-ISvBLrLgrTzIjC2oRFuE5YuPyfyc3w"
var DATA_UNION_CONTRACT_ADDRESS = "0x9a722acfb84b51e5b01b9b9331648924814f8f8d"



router.post("/coins", (req, res) => {
  try {
    const key = req.headers.privatekey
    console.log(key)
    const streamr = new StreamrClient({
      auth: {
        privateKey: key
      },
      url: "wss://hack.streamr.network/api/v1/ws",
      restUrl: "https://hack.streamr.network/api/v1"

    })
    streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
      .then((memberDetails) => {
        console.log('memberDetails: ', memberDetails)
        streamr.getMemberStats(DATA_UNION_CONTRACT_ADDRESS, memberDetails.memberAddress)
          .then((stats) => {
            //   console.log('stats:', stats)
            const coins = stats.earnings
            return res.json({ coins: ethers.utils.formatEther(stats.earnings) })
          })
      })
  }
  catch (err) {
    res.send(err)
  }
})


router.get("/withdraw", (req, res) => {
  var wallet = new ethers.Wallet(req.headers.privatekey)
  const streamr = new StreamrClient({
    auth: {
      privateKey: req.headers.privatekey,
    },
    url: "wss://hack.streamr.network/api/v1/ws",
    restUrl: "https://hack.streamr.network/api/v1"
  })
  streamr.withdraw(DATA_UNION_CONTRACT_ADDRESS, wallet)
  res.send("withdrawn")
})

router.post("/reccomend", (req, res) => {
  try {
    var TRAVEL_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/travel'

    const streamr = new StreamrClient({
      auth: {
        privateKey: req.headers.privatekey,
      },
      url: "wss://hack.streamr.network/api/v1/ws",
      restUrl: "https://hack.streamr.network/api/v1"
    })

    const dest = {
      "destination of choice": req.headers.dest
    }

    streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
      .then((memberDetails) => {
        //console.log('memberDetails: ', memberDetails)

        streamr.publish('0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/travel',
          dest
        )
      })

  }
  catch (err) {
    console.log(err)
  }
})


//privateKey:"0xb800ef74d7baa399ca1159976a20f0bd8eb0a4ad65dae67828b0d381ba79a97b"

module.exports = router;