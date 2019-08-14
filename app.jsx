import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
    constructor () {
        super()
        this.state = {

        }
    }
    render () {
        return (
            <React.Fragment>
                <div>Rendered properly</div>
            </React.Fragment>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))