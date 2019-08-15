import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
    constructor () {
        super()
        this.state = {
           input: '',
           output: []
        }
        this.changeInput = this.changeInput.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    changeInput(e) {
        this.setState({input: e.target.value})
    }
    handleSubmit(e) {
        e.preventDefault()
        axios.get(`/scrape?url=${this.state.value}`)
        .then(({data}) => {
            console.log(data)
            let arr = []
            for (let key in data) {
                let obj = {}
                obj.id = key
                obj.date = data[key].date
                obj.text = data[key].text
                arr.push(obj)
            }
            const compare = (a, b) => {
                if (a.id > b.id) {
                    return 1
                }
                if (a.id < b.id) {
                    return -1
                }
                return 0
            }
            arr.sort(compare)
            this.setState({output: arr})
        })
        .catch((err) => {
            console.log('Error: ', err)
        })
    }
    render () {
        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.input} onChange={this.changeInput}></input>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.output.map((tweet, idx) => {
                    return (
                        <React.Fragment key={idx}>
                        <p>{tweet.id}</p>
                        <p>{tweet.date}</p>
                        <p>{tweet.text}</p>
                        <hr/>
                        </React.Fragment>
                    )
                })}
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
