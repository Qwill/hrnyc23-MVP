const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const puppeteer = require('puppeteer')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4562
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(path.join(__dirname, '/dist')))
app.use(bodyParser.json())
app.use(cors())

io.on('connection', (socket) => {
    socket.on('submit', async input => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(`https://twitter.com/${input}`);
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
                                let name = tweet.getAttribute('data-name')
                                let userId = tweet.getAttribute('data-user-id')
                                let date = tweet.childNodes[1].childNodes[3].childNodes[1].childNodes[3].childNodes[1].getAttribute('title')
                                let text = tweet.childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerHTML
                                obj[id] = { date: date, text: text, name: name, userId: userId }
                            } catch (err) { return }
                            try {
                                let test = tweet.childNodes[1].childNodes[3].childNodes[5].innerHTML
                                obj[id].test = test
                            } catch (err) { return }
                        })
                        count++
                        if (totalHeight >= scrollHeight) {
                            //if (count === 100) {
                            clearInterval(timer);
                            resolve(obj);
                        }
                    }, 400);
                });
            });
        }
        socket.emit('tweets', obj)
        await browser.close();
    })
    socket.on('end', () => {
        socket.disconnect(0)
    })
})

http.listen(port, () => {
    console.log('Listening on port ' + port + '...')
})
