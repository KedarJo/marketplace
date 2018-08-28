import React, { Component } from 'react'
//import '../css/pure-min.css'

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
        id="StoreFront"
        onSubmit={this.handleSubmit}
      >

          <h3>Store Info</h3>
          <img src={`https://ipfs.io/ipfs/${this.state.IPFSHash}`} alt="" />
          <div className="form-group">
              <label htmlFor="strTitle">Store Name</label>
              <input
              id="strTitle" type="text" placeholder="Store Name" className="form-control"
              ref={(input) => this.state.strTitle=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="imgUpload">Hero Image for Store Front </label>
              <input
              id="imgUpload" type="file"
              onChange={this.captureFile}></input>

          </div>
          <button type="submit" className="btn btn-primary">Submit Request</button>
      </form>
    )
  }
}

export default StrAddStore
