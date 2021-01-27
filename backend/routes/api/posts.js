const express = require("express");
const auth = require("../../middleware/auth");
const Posts = require("../../models/Posts");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const { update } = require("../../models/User");
const StreamrClient = require('streamr-client')
const API = 'f085735391c60a402f4742b0f859f8c495472baf411e1bd21fbc579bfa884bf9'

const SHARED_SECRET = "9rpMdLArQ3C8_-ISvBLrLgrTzIjC2oRFuE5YuPyfyc3w"
const DATA_UNION_CONTRACT_ADDRESS = "0x9a722acfb84b51e5b01b9b9331648924814f8f8d"

const router = express.Router();


router.get("/me", auth, async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.user.id }).populate("user", [
      "name",
      "avatar",
      "email",
    ]);
    if (!posts) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.get("/clickedUser", auth, async (req, res) => {
  try {
    const posts = await Posts.find({ user: req.headers.id }).populate("user", [
      "name",
      "avatar",
      "email",
    ]);
    if (!posts) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

router.delete("/delete/:id", (req, res) => {
  Posts.findByIdAndRemove(req.params.id)
    .then((doc) => {
      if (!doc) {
        res.send("Not found");
      }
      res.send(doc);
    })
    .catch((err) => {
      console.log(err.message);
      res.send({ error: err.message });
    });
});


router.post(
  "/",
  [auth, [check("description", "description is required").not().isEmpty()]],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destination, description, age, coo, image_url } = req.body;

    //send data to streamr
    var DEST_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Destination'
    var AGE_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Age'
    var COO_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Country_Of_Origin'
    //var TRAVEL_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/travel'

    const streamr = new StreamrClient({
      auth: {
        privateKey: req.headers.privatekey,
      },
      url: "wss://hack.streamr.network/api/v1/ws",
      restUrl: "https://hack.streamr.network/api/v1"
    })

    const dest = {
      "destination": destination
    }
    const age_send = {
      "age": parseInt(age)
    }
    const origin_send = {
      "country of origin": coo
    }

    streamr.joinDataUnion(DATA_UNION_CONTRACT_ADDRESS, SHARED_SECRET)
      .then(() => {
        streamr.publish('0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Age', {
          age: age
        })

        streamr.publish(DEST_STREAM_ID, dest)
        //streamr.publish(AGE_STREAM_ID, age_send)
        // streamr.publish(TRAVEL_STREAM_ID, msg).then(() => {
        //   console.log("travel hist sent")
        // })
        streamr.publish(COO_STREAM_ID, origin_send)
      })


    //Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    if (destination) profileFields.destination = destination;
    if (description) profileFields.description = description;
    if (image_url) profileFields.image_url = image_url;

    try {
      let userData = await Posts.findOne({ destination });
      if (userData) {
        return res.status(401).json({ err: "Post already exists" });
      }
      console.log(userData);
      posts = new Posts(profileFields);
      await posts.save();
      return res.json(posts);
    } catch (err) {
      next(err);
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/update/:id",
  [auth, [check("description", "desc is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destination, description, image_url } = req.body;

    //Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    if (destination) profileFields.destination = destination;
    if (description) profileFields.description = description;
    if (image_url) profileFields.image_url = image_url;
    try {
      Posts.findByIdAndUpdate(
        req.params.id,
        { $set: profileFields },
        { new: true }
      )
        .then((doc) => {
          if (!doc) {
            res.send("Not found");
          }
          res.send(doc);
        })
        .catch((err) => {
          console.log(err.message);
          res.send({ error: err.message });
        });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find({
      user: { $ne: req.headers.id },
    }).populate("user", ["name", "avatar", "email"]);
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
