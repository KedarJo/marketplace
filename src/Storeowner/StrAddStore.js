import React, { Component } from 'react'
import '../css/pure-min.css'

import ipfs from '../ipfs'


class StrAddStore extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      IPFSHash: "",
      strTitle: ""
    }
    this.captureFile = this.captureFile.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  captureFile(event) {
    event.preventDefault()
    //console.log('captureFile ')
    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState( {buffer: Buffer(reader.result)} )
      //console.log('file buffer ' + this.state.buffer)
    }

  }

  handleSubmit(event) {
    event.preventDefault()
    //console.log('onSubmit')
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        //console.error(error.toString());
        return
      }
      this.setState({IPFSHash: result[0].hash})
      this.props.action(this.state.strTitle.value, this.state.IPFSHash)
    })

  }

  render() {
    //console.log('render')
    return (
      <form
        className="pure-form pure-form-aligned"
        id="StoreFront"
        onSubmit={this.handleSubmit}
      >
        <fieldset>
          <legend>Store Info</legend>
          <img src={`https://ipfs.io/ipfs/${this.state.IPFSHash}`} alt="" />
          <div className="pure-control-group">
              <label htmlFor="strTitle">Store Name</label>
              <input
              id="strTitle" type="text" placeholder="Store Name" className="pure-input-1-3"
              ref={(input) => this.state.strTitle=input}></input>
          </div>
          <div className="pure-control-group">
              <label htmlFor="imgUpload">Hero Image for Store Front</label>
              <input
              id="imgUpload" type="file"
              onChange={this.captureFile}></input>

          </div>
          <div className="pure-controls">
            <button type="submit" className="pure-button">Submit Request</button>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default StrAddStore
