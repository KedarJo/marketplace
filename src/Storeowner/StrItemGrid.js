import React, { Component } from 'react'
import '../css/pure-min.css'

class StrItemGridRow extends Component {
  render() {
    //console.log('StrItemGridRow')
    const sku = JSON.parse(this.props.sku)

    return(
        <div className="pure-u-1 pure-u-md-1-3 pure-u-xl-1-4">
          <h3>{sku.title}</h3>
          <img className="pure-img" src={`https://ipfs.io/ipfs/${sku.imgIPFS}`} alt={`Image for ${sku.title}`}/>
          <span>Quantity Left: {sku.quantity}</span><br/>
          <span>Price (wei): {sku.price}</span><br/>
          <span>Discount %: {sku.discount}</span><br/>
          <button className="pure-button" onClick={(e) => this.props.actionEdit(sku.sku)}>More</button>
        </div>
    )
  }
}

class StrItemGrid extends Component {

    render() {
      const rows = []
      if (this.props.skus.length !== 0) {
        this.props.skus.forEach((sku) => {
          //console.log('Filling rows ' + sku)
          rows.push(
            <StrItemGridRow
            sku={JSON.stringify(sku)}
            key={sku.sku}
            actionEdit={this.props.actionEdit} />
          )
        })

      }
      //console.log(this.props.storeOwner)
      //console.log(this.props.store)

      return (

      <div>
        <div className="pure-g">
          <span className="pure-u-1">Listings Of:
          {this.props.storeOwner === null
            ? <span></span>
            : <span> {this.props.storeOwner.busTitle} / {this.props.store.title}</span>
          }
          </span>
        </div>
        <div id='store-row'>
          <div className="pure-g pure-u-1">
            {this.props.skus.length !== 0
              ? rows
              : <p>No Listings Yet...</p>
            }
          </div>

        </div>
        <br/>
        <br/>
        <button className="pure-button" onClick={this.props.actionAdd}>List New Item</button>
      </div>

      )
    }
  }

  export default StrItemGrid
