const router = require("express").Router();
const Users = require("../modals/user/User");
const Movies = require("../modals/Movie");
const Series = require("../modals/series/Series");
const Season = require("../modals/series/Season");
const Episode = require("../modals/series/Episode");
const { validate } = require("../jwt");
const bcrypt = require("bcrypt");
const Favourite = require("../modals/user/Favourite");
const { cloudinary } = require("../cloudinary");

// ---------------------------------------------------user start-----------------------------------------------
// register newAdmin (admin only)
// POST /api/admin/register
// private
router.post("/register", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const { username, email, password } = req.body;
  // img config
  const imgStr = req.body.image;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    // check if all necessary fields are filled
    if (!username || !email || !password) {
      res.status(400).json("fill all fields");
    } else {
      // check if user exists
      const userEmailExists = await Users.findOne({ email });
      const usernameExists = await Users.findOne({ username });
      const all = await Users.find();
      const nextId = all[all.length - 1].id + 1;
      if (userEmailExists || usernameExists) {
        res.status(400).json("user alreaddy exists");
      } else {
        // encrypt passwprd
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // save admin
        const admin = new Users({
          ...req.body,
          id: nextId,
          admin: true,
          password: hashPassword,
          image: uploadedResponse.public_id,
        });
        if (admin) {
          await admin
            .save()
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json(err);
            });
        }
      }
    }
  } else {
    res.status(401).json("not an admin");
  }
});

// get all users (admin only)
//  GET /api/admin/users/all
// protected
router.get("/users/all", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  if (user.admin) {
    try {
      const allUsers = await Users.find();
      res.status(200).json(allUsers);
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json("not an admin");
  }
});

// Delete user (admin only)
// DELETE /api/admin/users/:id
// protected
router.delete("/users/:id", validate, async (req, res) => {
  const id = req.params.id;

  const user = await Users.findById(req.user._id);
  if (user.admin) {
    try {
      await Users.findByIdAndDelete(id);
      await Favourite.deleteMany({ user: id });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json("not an admin");
  }
});
// ---------------------------------------------------user end-----------------------------------------------

// --------------------------------------movies start-----------------------------------------
// creating movie (admin only)
//  POST /api/admin/movies/post
// protected
router.post("/movies/post", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  // img config
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    try {
      const all = await Movies.find();
      const nextId = all[all.length - 1].id + 1;
      const movie = new Movies({
        ...req.body,
        id: nextId,
        poster: {
          poster: uploadedResponse.public_id,
          url: uploadedResponse.url,
        },
        likes: 0,
        dislikes: 0,
      });
      if (movie) {
        await movie
          .save()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(401).json("not an admin");
  }
});

// updating movie (admin only)
// PUT /api/admin/movies/update/:id
// protected
router.put("/movies/update/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const id = req.params.id;
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    await Movies.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
          poster: {
            poster: uploadedResponse.public_id,
            url: uploadedResponse.url,
          },
        },
      },
      { new: true }
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(401).json("not an admin");
  }
});

// delete movie (admoin only)
// DELETE /api/admin/movies/delete/:id
// protected
router.delete("/movies/delete/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const id = req.params.id;
  if (user.admin) {
    try {
      const movie = await Movies.findById(id);
      await Movies.findByIdAndDelete(id);
      res.status(200).json(`successfully Deleted ${movie.title}`);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});
// --------------------------------------movies end-----------------------------------------

// --------------------------------------series start-----------------------------------------
// creating series (admin only)
// POST /api/admin/series
// private
router.post("/series", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const all = await Series.find();
  const nextId = all[all.length - 1].id + 1;
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    try {
      const series = new Series({
        ...req.body,
        id: nextId,
        poster: {
          poster: uploadedResponse.public_id,
          url: uploadedResponse.url,
        },
        likes: 0,
        dislikes: 0,
      });
      if (series) {
        await series
          .save()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});
// delete series (admin only)
// DELETE /api/admin/series/:id
// private
router.delete("/series/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  if (user.admin) {
    const id = req.params.id;
    try {
      const series = await Series.findById(id);
      await Series.findByIdAndDelete(id);
      await Season.deleteMany({ series: id });
      await Episode.deleteMany({ series: id });
      res.status(200).json(`successfully deleted ${series.title}`);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});

// creating seasons to series (admin)
// POST /api/admin/series/saeson
// private
router.post("/series/season", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const { title } = req.body;
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    const all = await Season.find();
    const nextId = all[all.length - 1].id + 1;
    const series = await Series.findOne({ title });
    if (series) {
      const season = await Season.create({
        ...req.body,
        series: series._id,
        id: nextId,
        poster: {
          poster: uploadedResponse.public_id,
          url: uploadedResponse.url,
        },
      });
      res.status(200).json({ season, series });
    } else {
      res.status(404).json("series not found");
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});
// delete season (admin only)
// DELETE /api/admin/series/season/:id
// private
router.delete("/series/season/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  if (user.admin) {
    const id = req.params.id;
    try {
      const season = await Season.findById(id);
      await Season.findByIdAndDelete(id);
      await Episode.deleteMany({ season: id });
      res
        .status(200)
        .json(
          `successfully deleted season ${season.season} of ${season.title}`
        );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});

// creating episodes to seasons (admin only)
// POST /api/admin/series/season/episode
// private
router.post("/series/season/episode", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const { title, seasonNo } = req.body;
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    const all = await Episode.find();
    const nextId = all[all.length - 1].id + 1;
    const series = await Series.findOne({ title });
    const season = await Season.findOne({ title, season: seasonNo });
    if (series) {
      if (season) {
        const episode = await Episode.create({
          ...req.body,
          series: series._id,
          season: season._id,
          id: nextId,
          poster: {
            poster: uploadedResponse.public_id,
            url: uploadedResponse.url,
          },
        });
        res.status(200).json({ episode, season, series });
      } else {
        res.status(404).json("season not found");
      }
    } else {
      res.status(404).json("series not found");
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});

// updating episodes (admin only)
// PUT /api/admin/series/season/episode/:id
// private
router.put("/series/season/episode/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  const imgStr = req.body.poster;
  const uploadedResponse = await cloudinary.uploader.upload(imgStr, {
    upload_preset: "ml_default",
  });
  if (user.admin) {
    const id = req.params.id;

    await Episode.findByIdAndUpdate(
      id,
      { $set: { ...req.body, poster: uploadedResponse.public_id } },
      { new: true }
    )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(401).json("Not An Admin");
  }
});

// delete episode (admin only)
// DELETE /api/admin/series/season/episode:id
// private
router.delete("/series/season/episode/:id", validate, async (req, res) => {
  const user = await Users.findById(req.user._id);
  if (user.admin) {
    const id = req.params.id;
    try {
      const episode = await Episode.findById(id);
      await Episode.findByIdAndDelete(id);
      res
        .status(200)
        .json(
          `successfully deleted season ${episode.seasonNo} episode ${episode.episode} of ${episode.title}`
        );
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("Not An Admin");
  }
});

// --------------------------------------series end-----------------------------------------

module.exports = router;
