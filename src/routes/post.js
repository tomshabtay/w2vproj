let PostModel = require('../models/post.model')
let PostTopListModel = require('../models/post-top-list.model')
let express = require('express')
let router = express.Router()
let alg = require('../calc-score-alg.2')

// Serve the top list
// POST localhost:3000/post/toplist
router.get('/post/toplist', (req, res) => {
  PostTopListModel.find({}, ['body'], { limit: 1 }, function (err, posts) {
    console.log(posts.body)

    if (err) {
      res.status(500).json(err)
    }
    res.status(201).send(posts)

  })
})

// Upvote a post
// GET localhost:3000/post/upvote/:id
router.get('/post/upvote/:id', (req, res) => {
  let postId = req.params.id
  PostModel.findOneAndUpdate({ _id: postId }, { $inc: { ups: 1 } }, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).json(err)
    }

    setTimeout(() => {
      let points = doc.ups
      let date = new Date(doc.timestamp * 1000)
      let score = alg.calcPostScore(points, date, doc._id,false) //force update set to false
    }, 1000)

    res.status(201).send(doc)
  });

})

// Downvote a post
// GET localhost:3000/post/downvote/:id
router.get('/post/downvote/:id', (req, res) => {
  let postId = req.params.id
  PostModel.findOneAndUpdate({ _id: postId }, { $inc: { ups: -1 } }, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).json(err)
    }

    setTimeout(() => {
      let points = doc.ups
      let date = new Date(doc.timestamp * 1000)
      let score = alg.calcPostScore(points, date, doc._id,false) //force update set to false
    }, 1000)

    res.status(201).send(doc)
  });

})

// Create a new post
// POST localhost:3000/post
router.post('/post', (req, res) => {
  let model = new PostModel(req.body)
  model.save()
    .then(doc => {
      if (!doc || doc.length === 0) {
        return res.status(500).send(doc)
      }

      res.status(201).send(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Update a post
// PUT localhost:3000/post
router.put('/post', (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('Missing URL parameter: email')
  }

  PostModel.findOneAndUpdate({
    _id: req.query.id
  }, req.body, {
      new: true
    })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// Delete a post
// DELETE localhost:3000/post
router.delete('/post', (req, res) => {
  if (!req.query.id) {
    return res.status(400).send('Missing URL parameter: id')
  }

  PostModel.findOneAndRemove({
    _id: req.query.id
  })
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// getting the top list (for development only)
router.get('/post/topdev', (req, res) => {
  PostModel.find({}, ['title', 'score', 'timestamp', 'ups'], { limit: 100, sort: { score: -1 } }, function (err, posts) {
    if (err) {
      res.status(500).json(err)
    }

    var postArr = [];
    posts.forEach(function (post) {
      postArr.push(post);
    });
    res.status(201).send(postArr)
  });

})

// router.post('/post/init', (req, res) => {
//   if (!req.body) {
//     return res.status(400).send('Request body is missing')
//   }

//   let model = new PostTopListModel({ body: "adsf" })
//   model.save()
//     .then(doc => {
//       if (!doc || doc.length === 0) {
//         return res.status(500).send(doc)
//       }

//       res.status(201).send(doc)
//     })
//     .catch(err => {
//       res.status(500).json(err)
//     })
// })

module.exports = router