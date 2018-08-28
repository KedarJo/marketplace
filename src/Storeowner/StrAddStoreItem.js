import React, { Component } from 'react'
//import '../css/pure-min.css'

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
        id="StoreFront"
        onSubmit={this.handleSubmit}
      >

          <h3>{this.props.storeOwner.busTitle} / {this.props.store.title} / New Item Info</h3>
          <img src={`https://ipfs.io/ipfs/${this.state.IPFSHash}`} alt="" />
          <div className="form-group">
              <label htmlFor="skuTitle">Item Name:</label>
              <input
              id="skuTitle" type="text" placeholder="Item Name" className="form-control"
              ref={(input) => this.state.skuTitle=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="skuPrice">Item Price (Wei):</label>
              <input
              id="skuPrice" type="number" placeholder='1000000' className="form-control"
              ref={(input) => this.state.skuPrice=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="skuDiscount">Discount %:</label>
              <select
              id="skuDiscount" type="number" className="form-control"
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
          <div className="form-group">
              <label htmlFor="skuQty">Qty:</label>
              <input
              id="skuQty" type="number" placeholder='100' className="form-control"
              ref={(input) => this.state.skuQty=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="imgUpload">Hero Image for Item </label>
              <input
              id="imgUpload" type="file"
              onChange={this.captureFile}></input>

          </div>

          <button type="submit" className="btn btn-primary">Add Listing</button>

      </form>
    )
  }
}

export default StrAddStoreItem
