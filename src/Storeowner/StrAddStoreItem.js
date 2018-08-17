import React, { Component } from 'react'
import '../css/pure-min.css'

import ipfs from '../ipfs'


class StrAddStoreItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      IPFSHash: "",
      skuTitle: "",
      skuPrice: 0,
      skuDiscount: 0,
      skuQty: 0
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
      this.props.action(this.state.skuTitle.value,
                        this.state.skuPrice.value,
                        this.state.skuDiscount.value,
                        this.state.skuQty.value,
                        this.state.IPFSHash)
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
          <legend>{this.props.storeOwner.busTitle} / {this.props.store.title} / New Item Info</legend>
          <img src={`https://ipfs.io/ipfs/${this.state.IPFSHash}`} alt="" />
          <div className="pure-control-group">
              <label htmlFor="skuTitle">Item Name:</label>
              <input
              id="skuTitle" type="text" placeholder="Item Name" className="pure-input-1-3"
              ref={(input) => this.state.skuTitle=input}></input>
          </div>
          <div className="pure-control-group">
              <label htmlFor="skuPrice">Item Price (Wei):</label>
              <input
              id="skuPrice" type="number" placeholder='1000000' className="pure-input-1-3"
              ref={(input) => this.state.skuPrice=input}></input>
          </div>
          <div className="pure-control-group">
              <label htmlFor="skuDiscount">Discount %:</label>
              <select
              id="skuDiscount" type="number" className="pure-input-1-3"
              ref={(input) => this.state.skuDiscount=input}>
                <option>0</option>
                <option>10</option>
                <option>20</option>
                <option>30</option>
                <option>40</option>
                <option>50</option>
                <option>60</option>
                <option>70</option>
                <option>80</option>
                <option>90</option>
                <option>100</option>

              </select>
          </div>
          <div className="pure-control-group">
              <label htmlFor="skuQty">Qty:</label>
              <input
              id="skuQty" type="number" placeholder='100' className="pure-input-1-3"
              ref={(input) => this.state.skuQty=input}></input>
          </div>
          <div className="pure-control-group">
              <label htmlFor="imgUpload">Hero Image for Item</label>
              <input
              id="imgUpload" type="file"
              onChange={this.captureFile}></input>

          </div>
          <div className="pure-controls">
            <button type="submit" className="pure-button">Add Listing</button>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default StrAddStoreItem
