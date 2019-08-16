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
    let obj = await autoScroll(page)
    async function autoScroll(page) {
        return page.evaluate(async () => {
            return await new Promise((resolve, reject) => {
                let obj = {}
                var totalHeight = 0;
                var distance = 400;
                var count = 0
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    for (let i = 0; i < 100; i++) {
                        let id, date, text, body
                        try {
                            body = document.body
                            // id = document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].getAttribute('data-tweet-id')
                            // date = document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].getAttribute('title')
                            // text = document.body.childNodes[7].childNodes[3].childNodes[1].childNodes[5].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[7].childNodes[1].childNodes[3].childNodes[1].childNodes[i].childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerHTML
                            // obj[id] = { date: date, text: text }
                            obj.a = body
                        } catch (err) { continue }
                    }
                    count++
                    //if(totalHeight >= scrollHeight){
                    if (count === 20) {
                        clearInterval(timer);
                        resolve(obj);
                    }
                }, 400);
            });
        }, page);
    }
    res.send(obj)
    await browser.close();
})

app.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})
