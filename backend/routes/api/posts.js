const express = require("express");
const auth = require("../../middleware/auth");
const Posts = require("../../models/Posts");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const { update } = require("../../models/User");
const StreamrClient = require('streamr-client')
const API = 'f085735391c60a402f4742b0f859f8c495472baf411e1bd21fbc579bfa884bf9'

const router = express.Router();

//@route  api/profile/me
//get current users profile
//private

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

//@route  api/profile
//post create a profile
//private
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
    var DEST_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/Globetrotter'
    var AGE_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/age'
    var COO_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/country_of_origin'
    // var TRAVEL_STREAM_ID = '0xfe0d298da1223de5d6b3ef8c0785ab57a46e68f5/travel'

    const streamr = new StreamrClient({
      auth: {
        privateKey: API,
      },
    })

    const dest = {
      "destination": destination
    }
    const age_send = {
      "age": age
    }
    const origin_send = {
      "country of origin": coo
    }

    streamr.publish(DEST_STREAM_ID, dest).then(() => {
      console.log("destination sent")
    })
    streamr.publish(AGE_STREAM_ID, msg).then(() => {
      console.log("age sent")
    })
    // streamr.publish(TRAVEL_STREAM_ID, msg).then(() => {
    //   console.log("travel hist sent")
    // })
    streamr.publish(COO_STREAM_ID, msg).then(() => {
      console.log("country of origin sent")
    })

    //Build profile objects
    const profileFields = {};
    profileFields.user = req.user.id;
    if (destination) profileFields.destination = destination;
    if (description) profileFields.description = description;
    if (image_url) profileFields.image_url = image_url;

    try {
      // let profile = await Profile.findOne({ user: req.user.id })
      // if (profile) {
      //     //update
      //     profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });

      //     return res.json(profile)
      // }
      //create
      let userData = await Posts.findOne({ destination });
      if (userData) {
        return res.status(401).json({ err: "Post already exists" });
      }
      console.log(userData);

      //   if (userid) {
      //     res.status(400).send("profile already exists");
      //   }
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

// router.post("/likes", auth, async (req, res) => {
//   console.log(req.params.id);
//   const likes = await Profile.findOne({ user: req.user.id });
//   return res.json(likes);
// });

//update the profile posts
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

// router.post("/likes", auth, async (req, res) => {
//   console.log(req.params.id);
//   const likes = await Profile.findOne({ user: req.user.id });
//   return res.json(likes);
// });

//@route  api/profile
//get  all profile
//public

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
