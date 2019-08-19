const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const puppeteer = require('puppeteer')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4562

app.use(express.static(path.join(__dirname, '/dist')))
app.use(bodyParser.json())
app.use(cors())

app.get('/scrape', async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://twitter.com/${req.query.url}`);
    let obj = await autoScroll(page)
    async function autoScroll(page) {
        return page.evaluate(async () => {
            return await new Promise((resolve, reject) => {
                let obj = {}
                let totalHeight = 0;
                let distance = 400;
                let count = 0
                const timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    Array.apply(null, document.getElementsByClassName('js-stream-item')).forEach((tweet) => {
                        try {
                            let id = tweet.getAttribute('data-item-id')
                            let date = tweet.childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].getAttribute('title')
                            let text = tweet.childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerHTML
                            obj[id] = { date: date, text: text }
                        } catch (err) { return }
                    })
                    count++
                    //if (totalHeight >= scrollHeight) {
                    if (count === 100) {
                        clearInterval(timer);
                        resolve(obj);
                    }
                }, 400);
            });
        });
    }
    res.send(obj)
    await browser.close();
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})
