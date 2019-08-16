import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import parser from 'react-html-parser'

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
        this.setState({ output: [], scraping: true })
        axios.get(`/scrape?url=${this.state.input}`)
            .then(({ data }) => {
                this.setState({ scraping: false })
                console.log(data)
                let arr = []
                let name = this.state.input
                for (let key in data) {
                    let obj = {}
                    obj.id = key
                    obj.link = `https://twitter.com/${name}/status/${key}`
                    obj.date = data[key].date
                    obj.text = data[key].text
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
            })
            .catch((err) => {
                console.log('Error: ', err)
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
                            <p style={{ fontFamily: 'helvetica' }}>{parser(tweet.text)}</p>
                            <hr />
                        </React.Fragment>
                    )
                })}
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
