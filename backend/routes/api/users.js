const express = require("express");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");
const StreamrClient = require('streamr-client')


const User = require("../../models/User");
const { findById } = require("../../models/User");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.find({ _id: req.headers.id }).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

async function friendrequestRemove(uid, frid) {
  data = await User.findById({ _id: uid }).select("friendrequestsent");
  list = data.friendrequestsent;
  const index = list.indexOf(frid);
  if (index > -1) {
    list.splice(index, 1);
  }

  await User.findByIdAndUpdate(
    uid,
    { $set: { friendrequestsent: list } },
    { new: false }
  );
}

async function friendreject(uid, frid) {
  data = await User.findById({ _id: uid }).select("inbox");
  list = data.inbox;
  const index = list.indexOf(frid);
  if (index > -1) {
    list.splice(index, 1);
  }

  //update the inbox with the list
  await User.findByIdAndUpdate(uid, { $set: { inbox: list } }, { new: false });
  await friendrequestRemove(frid, uid);
}

async function friendaccept(uid, frid) {
  data = await User.findById({ _id: uid }).select("inbox");
  list = data.inbox;
  const index = list.indexOf(frid);
  if (index > -1) {
    list.splice(index, 1);
  }

  //update the inbox with the list
  await User.findByIdAndUpdate(uid, { $set: { inbox: list } }, { new: false });

  try {
    data2 = await User.findById({ _id: frid }).select("inbox");
    list2 = data2.inbox;
    const index2 = list2.indexOf(uid);
    if (index2 > -1) {
      list2.splice(index2, 1);
    }
    await User.findByIdAndUpdate(frid, { $set: { inbox: list } }, { new: false });
  }
  catch (err) {
    console.log(err)
  }

  //get current friendlist and push the new friend and update it.
  data = await User.findById({ _id: uid }).select("friendlist");
  inbox_list = data.friendlist;
  inbox_list.push(frid); //pushing new friend
  set_list = new Set(inbox_list);
  await User.findByIdAndUpdate(
    uid,
    { $set: { friendlist: Array.from(set_list) } },
    { new: false }
  );

  //update the the friendlist other way around
  data = await User.findById({ _id: frid }).select("friendlist");
  inbox_list = data.friendlist;
  inbox_list.push(uid); //pushing new friend
  set_list = new Set(inbox_list);
  await User.findByIdAndUpdate(
    frid,
    { $set: { friendlist: Array.from(set_list) } },
    { new: false }
  );

  //removing the friendrequest once the friend is accepted
  await friendrequestRemove(frid, uid);

  console.log(list);
}

//stuff to take care of is .. if the user already in friends , then do not allow sending friend request again.

router.put("/inbox/request", async (req, res) => {
  try {
    const val = req.headers.accepted;
    const uid = req.headers.uid;
    const frid = req.headers.frid;
    if (val == "true") {
      // const uid = req.headers.uid;
      // const frid = req.headers.frid;
      await friendaccept(uid, frid);
      res.json({ msg: "friend request accepted" });
    } else if (val == 'false') {
      await friendreject(uid, frid);
      res.json({ msg: "friend request rejected" });
    }
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/inbox", [auth], async (req, res) => {
  data = await User.findById({ _id: req.headers.uid }).select("inbox");
  inbox_list = data.inbox;
  for (var i = 0; i < inbox_list.length; i++) {
    friend_details = await User.findById({ _id: inbox_list[i] }).select("name");
    inbox_list[i] = inbox_list[i] + ";" + friend_details.name;
  }
  res.send(inbox_list);
});

router.get("/friend", [auth], async (req, res) => {
  data = await User.findById({ _id: req.headers.uid }).select("friendlist");
  friend_list = data.friendlist;
  for (var i = 0; i < friend_list.length; i++) {
    friend_details = await User.findById({ _id: friend_list[i] }).select("name");
    friend_list[i] = friend_list[i] + ";" + friend_details.name;
  }
  // console.log(friend_list)
  res.send(friend_list);
});

router.put("/unfriend", [auth], async (req, res) => {
  data1 = await User.findById({ _id: req.headers.uid }).select("friendlist");
  list1 = data1.friendlist;
  index1 = list1.indexOf(req.headers.frid);
  if (index1 > -1) {
    list1.splice(index1, 1);
  }
  await User.findByIdAndUpdate(req.headers.uid, { $set: { friendlist: list1 } }, { new: false });

  data2 = await User.findById({ _id: req.headers.frid }).select("friendlist");
  list2 = data2.friendlist;
  index2 = list2.indexOf(req.headers.uid);
  if (index2 > -1) {
    list2.splice(index2, 1);
  }
  await User.findByIdAndUpdate(req.headers.frid, { $set: { friendlist: list2 } }, { new: false });
  res.json({ msg: "removed Friend" });
});


async function requestsender(from, to) {
  // console.log("friend request from : " + from + " to: " + to);
  for (i = 0; i < to.length; i++) {
    data = await User.findById({ _id: to[i] }).select("inbox");
    inbox_list = data.inbox;
    inbox_list.push(from);
    set_list = new Set(inbox_list);
    // console.log(inbox_list);
    // console.log(final_list);
    await User.findByIdAndUpdate(
      to[i],
      { $set: { inbox: Array.from(set_list) } },
      { new: false }
    );
  }
}

router.put("/friend/send", [auth], async (req, res) => {
  try {
    //storing friendrequests
    data = await User.findById({ _id: req.headers.uid }).select(
      "friendrequestsent"
    );
    fr_list = data.friendrequestsent;
    fr_list.push(req.headers.fid);
    set_list = new Set(fr_list);
    await User.findByIdAndUpdate(
      req.headers.uid,
      { $set: { friendrequestsent: Array.from(set_list) } },
      { new: false }
    );

    //sending friend requests
    const list = await User.findOne({
      _id: req.headers.uid,
    }).select("friendrequestsent");
    console.log(list);
    requestsender(list._id, list.friendrequestsent);
    res.json(list);
  } catch (err) {
    console.log(err);
  }
});

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "include a valid email").isEmail(),
    check("password", "Please enter a password more than 6 words").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, accountType, friendrequestsent } = req.body;
    console.log(req.body);
    try {
      //if the user exist

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: "user alreadqy exists" }] });
      }
      //get users gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        d: "mm",
      });
      var playerWallet = StreamrClient.generateEthereumAccount()
      const privateKey = playerWallet.privateKey
      user = new User({
        name,
        email,
        avatar,
        password,
        accountType,
        privateKey
      });

      //encrypt the password using bcrypt

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return the json web token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtsecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server bad");
    }
  }
);

module.exports = router;
