const express = require("express");
const auth = require("../../middleware/auth");
const Posts = require("../../models/Posts");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const { update } = require("../../models/User");

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

    const { destination, description, image_url } = req.body;

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
    const posts = await Posts.find().populate("user", [
      "name",
      "avatar",
      "email",
    ]);
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
