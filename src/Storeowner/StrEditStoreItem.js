import React, { Component } from 'react'
//import '../css/pure-min.css'

import ipfs from '../ipfs'


class StrEditStoreItem extends Component {
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
    //console.log('StrEditStoreItem  constructor')
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
    let retIPFSHash
    let retskuTitle
    let retskuPrice
    let retskuDiscount
    let retskuQty
    //console.log('onSubmit')

    if (this.state.buffer !== null) {
      ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          //console.error(error.toString());
          return
        }
        this.setState({IPFSHash: result[0].hash})
      })
    }

    this.state.IPFSHash == "" ? retIPFSHash = this.props.sku.imgIPFS : retIPFSHash = this.state.IPFSHash
    this.state.skuTitle.value == "" ? retskuTitle = this.props.sku.title : retskuTitle = this.state.skuTitle.value
    this.state.skuPrice.value == 0 ? retskuPrice = this.props.sku.price : retskuPrice = this.state.skuPrice.value
    this.state.skuDiscount.value == 0 ? retskuDiscount = this.props.sku.discount : retskuDiscount = this.state.skuDiscount.value
    this.state.skuQty.value == 0 ? retskuQty = this.props.sku.quantity : retskuQty = this.state.skuQty.value

    this.props.action(this.props.sku.sku, retskuTitle, retskuPrice, retskuDiscount, retskuQty, retIPFSHash)

  }

  render() {
    // console.log('render/return')
    return (
      <form
        id="StoreFront"
        onSubmit={this.handleSubmit}
      >
          <h3>{this.props.storeOwner.busTitle} / {this.props.store.title} / Maintain Item Info</h3>
          <img src={`https://ipfs.io/ipfs/${this.props.sku.imgIPFS}`} alt="" />
          <div className="form-group">
              <label htmlFor="skuTitle">Change Item Name:</label>
              <input
              id="skuTitle" type="text" placeholder={this.props.sku.title} className="form-control"
              ref={(input) => this.state.skuTitle=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="skuPrice">New Item Price (Wei):</label>
              <input
              id="skuPrice" type="number" placeholder={this.props.sku.price} className="form-control"
              ref={(input) => this.state.skuPrice=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="skuDiscount">New Discount %:</label>
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
              id="skuQty" type="number" placeholder={this.props.sku.quantity} className="form-control"
              ref={(input) => this.state.skuQty=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="imgUpload">New Hero Image for Item</label>
              <input
              id="imgUpload" type="file"
              onChange={this.captureFile}></input>

          </div>
          <button type="submit" className="btn btn-primary">Update Listing</button>
      </form>
    )
  }
}

export default StrEditStoreItem
