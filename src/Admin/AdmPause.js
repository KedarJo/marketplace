import React, { Component } from 'react'


class AdmPause extends Component {

  render() {
    return (
      <div>
      {this.props.paused
        ? <button
          className="pure-button"
          onClick={() => this.props.action()}>Unpause Contract</button>
        : <button
          className="pure-button"
          onClick={() => this.props.action()}>Pause Contract</button>
      }
      </div>
    )
  }
}

export default AdmPause
