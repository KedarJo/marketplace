import React, { Component } from 'react'


class AdmPause extends Component {

  render() {
    return (
      <div>
      {this.props.paused
        ? <button
          className="btn btn-primary"
          onClick={() => this.props.action()}>Unpause Contract</button>
        : <button
          className="btn btn-primary"
          onClick={() => this.props.action()}>Pause Contract</button>
      }
      </div>
    )
  }
}

export default AdmPause
