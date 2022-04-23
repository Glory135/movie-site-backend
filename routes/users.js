const router = require("express").Router();
const Users = require("../modals/user/User");
const bcrypt = require("bcrypt");
const { generateToken, validate } = require("../jwt");
const Favourite = require("../modals/user/Favourite");
const Movies = require("../modals/Movie");
const { cloudinary } = require("../cloudinary");

// sign uo
// POST /api/users/register
// public
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  //  check if all fields are filled
  if (!username || !email || !password) {
    res.status(400).json({ message: "fill all fields" });
  } else {
    //  check if user exists
    const userEmailExists = await Users.findOne({ email });
    const userNameExists = await Users.findOne({ username });
    if (userEmailExists || userNameExists) {
      res.status(400).json({ message: "user alreaddy exists" });
    } else {
      //   encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const all = await Users.find();
      const nextId = all[all.length - 1].id + 1;

      // img config
      const imgStr = req.body.image;

      const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
        upload_preset: "ml_default",
      });
      console.log(uploadedResponse);
      //   save user
      const user = new Users({
        ...req.body,
        id: nextId,
        admin: false,
        password: hashedPassword,
        image: uploadedResponse.public_id,
      });
      if (user) {
        await user
          .save()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      } else {
        res.status(400).json({ message: "invalid user data" });
      }
    }
  }
});

// log in
// POST /api/users/login
// public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //   check for email
  const user = await Users.findOne({ email });

  //   compare passwprd
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({ user, token: generateToken(user._id, user.email) });
  } else {
    res.status(400).json("invalid credentials");
  }
});

// get user data
// GET /api/users/me
// private
router.get("/me", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  res.status(200).json(user);
});

// add favourite
// POST /api/users/me/favourites/add/:videoId
// private
router.post("/me/favourites/add/:videoId", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const video = req.params.videoId;
  // check if video is already in users favourites
  const exists = await Favourite.findOne({ user: user._id, video });
  if (exists) {
    res
      .status(400)
      .json({ message: "video already exists in your favourites" });
  } else {
    await Favourite.create({ user: user._id, video })
      .then((result) => {
        res
          .status(200)
          .json({ result, message: "Successfully added to favourites" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// remove fav
// DELETE /api/users/me/favourite/remove/:videoId
// private
router.delete("/me/favourites/remove/:videoId", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const video = req.params.videoId;
  // check if video is already in users favourites
  const exists = await Favourite.findOne({ user: user._id, video });
  if (exists) {
    try {
      await Favourite.deleteOne({ user: user._id, video });
      res.status(200).json("favourite removed!!");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res
      .status(400)
      .json({ message: "video does not exist in your favourites" });
  }
});

// get single fav
// GET /api/users/me/favourite/:id
// private
router.get("/me/favourite/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const id = req.params.id;
  try {
    const fav = await Favourite.findOne({ user: user._id, video: id });
    if (fav) {
      res.status(200).json(fav);
    } else {
      res.status(404).json("favourite does not exist");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// get favourites of user
// GET /api/users/me/favourites
// private
router.get("/me/favourites", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  try {
    const favourites = await Favourite.find({ user: user._id });
    let all = favourites.map((i) => {
      return Movies.findById(i.video);
    });

    let movies = [...all];
    console.log(movies);
    console.log(movies);
    res.status(200).json(movies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// user update profile
// PUT /api/users/update
// private
router.put("/update", validate, async (req, res) => {
  // img config
  const imgStr = req.body.image;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  console.log(uploadedResponse);
  await Users.findByIdAndUpdate(
    req.user._id,
    {
      $set: { ...req.body, image: uploadedResponse.public_id },
    },
    { new: true }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// user update password
// PUT /api/users/update/password
// private
router.put("/update/password", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const { oldPassword, newPassword } = req.body;

  // compare old passwords
  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    //   encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // set new password
    user.password = hashedPassword;
    await Users.findByIdAndUpdate(req.user._id, user)
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(400).json("invalid password");
  }
});

module.exports = router;
