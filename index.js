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
    await page.setJavaScriptEnabled(true)
    await page.goto(`https://twitter.com/${req.query.url}`);
    await page.setJavaScriptEnabled(true)
    let obj = {}
    let count = 0
    const extractor = async (page, obj) => {
        for (let i = 0; i < 100; i++) {
            let id, date, text
            try {
                id = await page.evaluate(i => document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].getAttribute('data-tweet-id'), i);
                date = await page.evaluate(i => document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].getAttribute('title'), i);
                text = await page.evaluate(i => document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerHTML, i);
                obj[id] = { date: date, text: text }
                console.log(i)
            } catch (err) { continue }
        }
        await page.evaluate(async () => { window.scrollBy(0, 400); })
        count++
        if (count === 20) {
            clearInterval(interval)
        }
    }
    const interval = setInterval(() => {
        extractor(page, obj)
    }, 400)
    res.send(obj)
    await browser.close();
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})
