const router = require("express").Router();
const Movies = require("../modals/Movie");

// get all movies
// GET /api/movies/all
// public
router.get("/all", async (req, res) => {
  const search = req.query.search;
  try {
    let movies;
    if (search) {
      const all = await Movies.find();
      movies = all.filter((i) => {
        return i.title.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      movies = await Movies.find();
    }
    res.status(200).json(movies);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single movie
// GET /api/movies/:id
// public
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    res.status(200).json(movie);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// like movie
// PUT /api/movies/like/:id
// public
router.put("/like/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    const likes = movie.likes;
    await Movies.findByIdAndUpdate(
      id,
      {
        $set: { likes: likes + 1 },
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// unlike movie
// PUT /api/movies/unlike/:id
// public
router.put("/unlike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    const likes = movie.likes;
    await Movies.findByIdAndUpdate(
      id,
      {
        $set: { likes: likes - 1 },
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// dislike movie
// PUT /api/movies/dislike/:id
// public
router.put("/dislike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    const dislikes = movie.dislikes;
    console.log(dislikes);
    await Movies.findByIdAndUpdate(
      id,
      {
        $set: { dislikes: dislikes + 1 },
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// undislike movie
// PUT /api/movies/undislike/:id
// public
router.put("/undislike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const movie = await Movies.findById(id);
    const dislikes = movie.dislikes;
    await Movies.findByIdAndUpdate(
      id,
      {
        $set: { dislikes: dislikes - 1 },
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
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
