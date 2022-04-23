const router = require("express").Router();
const Episode = require("../modals/series/Episode");
const Season = require("../modals/series/Season");
const Series = require("../modals/series/Series");

// get all series
// GET /api/series
// public
router.get("/", async (req, res) => {
  const search = req.query.search;
  try {
    let series;
    if (search) {
      const all = await Series.find();
      series = all.filter((i) => {
        return i.title.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      series = await Series.find();
    }

    res.status(200).json(series);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single series
// GET /api/series/:id
// public
router.get("/:seriesId", async (req, res) => {
  const id = req.params.seriesId;
  try {
    const singleSeries = await Series.findById(id);
    const seasons = await Season.find({ series: id });
    const episodes = await Episode.find({ series: id });
    res.status(200).json({ singleSeries, seasons, episodes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all season of a series
// GET /api/series/:seriesId/seasons
// public
router.get("/:seriesId/seasons", async (req, res) => {
  const id = req.params.seriesId;
  try {
    const seasons = await Season.find({ series: id });
    res.status(200).json(seasons);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single season of a series
// GET /api/series/season/:seasonId
// public
router.get("/season/:seasonId", async (req, res) => {
  const id = req.params.seasonId;
  try {
    const season = await Season.findById(id);
    const episodes = await Episode.find({ season: id });
    res.status(200).json({ season, episodes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all episodes
// GET api/series/season/episodes
// public
router.get("/season/episodes/all", async (req, res) => {
  const search = req.query.search;
  try {
    let episodes;
    if (search) {
      const all = await Episode.find();
      episodes = all.filter((i) => {
        return i.title.toLowerCase().includes(search.toLowerCase());
      });
    } else {
      episodes = await Episode.find();
    }

    res.status(200).json(episodes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all epsode of a season
// GET /api/series/:id/season/:id/episode
// public
router.get("/season/:seasonId/episodes", async (req, res) => {
  const id = req.params.seasonId;
  try {
    const episodes = await Episode.find({ season: id });
    res.status(200).json(episodes);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get single episode
// GET /api/series/season/episode/:episodeId
router.get("/season/episode/:episodeId", async (req, res) => {
  const id = req.params.episodeId;
  try {
    const episode = await Episode.findById(id);
    res.status(200).json(episode);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// like series
// PUT /api/series/like/:id
// public
router.put("/like/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const serie = await Series.findById(id);
    const likes = serie.likes;
    await Series.findByIdAndUpdate(
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
// unlike serie
// PUT /api/series/unlike/:id
// public
router.put("/unlike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const serie = await Series.findById(id);
    const likes = serie.likes;
    await Series.findByIdAndUpdate(
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

// dislike serie
// PUT /api/series/dislike/:id
// public
router.put("/dislike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const serie = await Series.findById(id);
    const dislikes = serie.dislikes;
    console.log(dislikes);
    await Series.findByIdAndUpdate(
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
// undislike serie
// PUT /api/series/undislike/:id
// public
router.put("/undislike/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const serie = await Series.findById(id);
    const dislikes = serie.dislikes;
    await Series.findByIdAndUpdate(
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
