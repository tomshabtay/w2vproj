let express = require('express')
let app = express()

let postRoute = require('./routes/post')
let bodyParser = require('body-parser')

let jobs = require('./jobs.js')

app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log(`${new Date().toString()} => ${req.originalUrl}`, req.body)
  next()
})

app.use(postRoute)
app.use(express.static('public'))

// 404 Handler
app.use((req, res, next) => {
  res.status(404).send('404')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))

// Starting Jobs
jobs.updateScoresJob();
jobs.updateTopListJob();
jobs.initTopListJob();
jobs.initPostsJob();


