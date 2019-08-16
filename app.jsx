import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import parser from 'react-html-parser'

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            input: '',
            output: []
        }
        this.changeInput = this.changeInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    changeInput(e) {
        this.setState({ input: e.target.value })
    }
    handleSubmit(e) {
        e.preventDefault()
        axios.get(`/scrape?url=${this.state.input}`)
            .then(({ data }) => {
                console.log(data)
                let arr = []
                let name = this.state.input
                for (let key in data) {
                    let obj = {}
                    obj.id = `https://twitter.com/${name}/status/${key}`
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
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Enter Twitter handle here" value={this.state.input} onChange={this.changeInput}></input>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.output.map((tweet, idx) => {
                    return (
                        <React.Fragment key={idx}>
                            <a href={tweet.id}>{tweet.id}</a>
                            <p style={{ float: right }}>{tweet.date}</p>
                            <p>{parser(tweet.text)}</p>
                            <hr />
                        </React.Fragment>
                    )
                })}
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
