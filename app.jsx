import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

class App extends React.Component {
    constructor () {
        super()
        this.state = {
           input: ''
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
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
