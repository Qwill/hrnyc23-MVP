import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import parser from 'react-html-parser'
import socketIOClient from "socket.io-client";

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            input: '',
            output: [],
            scraping: false
        }
        this.changeInput = this.changeInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    changeInput(e) {
        this.setState({ input: e.target.value })
    }
    handleSubmit(e) {
        e.preventDefault()
        let name = this.state.input
        this.setState({ output: [], scraping: true })
        const socket = socketIOClient('167.99.159.42')
        socket.emit('submit', this.state.input)
        socket.on('tweets', data => {
            this.setState({ input: '', scraping: false })
            let arr = []
            for (let key in data) {
                let obj = {}
                obj.id = key
                obj.link = `https://twitter.com/${name}/status/${key}`
                obj.date = data[key].date
                obj.text = data[key].text
                obj.name = data[key].name
                obj.userId = data[key].userId
                obj.quoteName = data[key].quoteName
                obj.quoteSN = data[key].quoteSN
                obj.quoteText = data[key].quoteText
                arr.push(obj)
            }
            const compare = (a, b) => {
                if (Number(a.id) > Number(b.id)) {
                    return -1
                }
                if (Number(a.id) < Number(b.id)) {
                    return 1
                }
                return 0
            }
            arr.sort(compare)
            this.setState({ output: arr })
            socket.emit('end')
        })
    }
    render() {
        return (
            <React.Fragment>
                <span>
                    <form style={{ display: 'inline' }} onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Enter Twitter handle here" value={this.state.input} onChange={this.changeInput}></input>
                        <input type="submit" value="Submit" />
                    </form>
                    {this.state.scraping ? <span style={{ marginLeft: '30px' }}>Scraping...</span> : null}
                </span>
                <hr />
                {this.state.output.map((tweet, idx) => {
                    return (
                        <React.Fragment key={idx} >
                            <a style={{ fontSize: 'small' }} href={tweet.link}>{tweet.link}</a>
                            <p style={{ float: 'right' }}><em>{tweet.date}</em></p>
                            <p style={{ fontSize: 'small' }}><strong>{tweet.name}</strong> {tweet.userId}</p>
                            <p style={{ fontFamily: 'helvetica' }}>{parser(tweet.text)}</p>
                            <br />
                            <p style={{ fontSize: 'small' }}><strong>{tweet.quoteName}</strong> {tweet.quoteSN}</p>
                            <p style={{ fontFamily: 'helvetica' }}>{parser(tweet.quoteText)}</p>
                            <hr />
                        </React.Fragment>
                    )
                })}
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
