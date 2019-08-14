const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const puppeteer = require('puppeteer')
const cors = require('cors')
const app = express()
const port = 4562

app.use(express.static(path.join(__dirname, '/dist')))
app.use(bodyParser.json())
app.use(cors())

app.get('/scrape', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://mobile.twitter.com/${req.query.url}`); 
    const doc = await page.evaluate(() => document.body.innerHTML);
    res.send(doc)
    await browser.close();
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})