const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 4562

app.use(express.static(path.join(__dirname, '/dist')))
app.use(bodyParser.json())

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})