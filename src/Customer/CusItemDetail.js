import React, { Component } from 'react'
import '../css/pure-min.css'

/*
*/
class CusItemDetail extends Component {

    render() {
      //console.log('render')
      //console.log(this.props.sku)
      let skuStoreID = this.props.sku.storeID.toString()
      let skuPrice = this.props.sku.price.toString()
      let skuDiscount = this.props.sku.discount.toString()
      let skuUnitPrice = this.props.sku.price * (100 - this.props.sku.discount) / 100
      let skuTotal = skuUnitPrice

      return (
        <form
          className="pure-form pure-form-aligned"
          id="customerPurchase"
          onSubmit={(event) => {
            event.preventDefault()
            this.props.action(this.quantity.value)
          }}>
          <fieldset>
            <legend><h3>{this.props.sku.title}</h3></legend>
            <div className="pure-g pure-u-1 pure-u-md-1-3">
              <span>Sold By {this.props.sku.storeOwner}, Store ID# {skuStoreID} </span><br/>
              <img src={`https://ipfs.io/ipfs/${this.props.sku.imgIPFS}`} className="pure-img" />
            </div>
            {this.props.sku.quantity < 15
              ?  <span>Only {this.props.sku.quantity.toString()} left! Almost out-of-stock</span>
              :  <span></span>
            }
            <br/>
            <div className="pure-control-group">
              <label htmlFor='skuPrice'>Price: </label>
              <span id='skuPrice'>{skuPrice} wei</span>
            </div>
            <div className="pure-control-group">
              <label htmlFor='skuDiscount'>Discount: </label>
              <span id='skuDiscount'>{skuDiscount} % </span>
            </div>
            <div className="pure-control-group">
                <label htmlFor="SelectQuantity">Qty</label>
                <select
                id="SelectQuantity" className="pure-input-1-2"
                ref={(input) => this.quantity=input}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
            <div className="pure-control-group">
              <label htmlFor='skuTotal'>Total: </label>
              <span id='skuTotal'>Ensure sufficient funds before purchase</span>
            </div>
            <div className="pure-controls">
              <button type="submit" className="pure-button">Buy</button>
            </div>
          </fieldset>
        </form>
      )
    }
  }

  export default CusItemDetail
