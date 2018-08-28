import React, { Component } from 'react'


//class AdmPause extends Component {
//  render() {}
function AdmPause (props) {
    return (
      <div>
      {props.paused
        ? <button
          className="btn btn-primary"
          onClick={() => props.action()}>Unpause Contract</button>
        : <button
          className="btn btn-primary"
          onClick={() => props.action()}>Pause Contract</button>
      }
      </div>
    )
}

export default AdmPause
