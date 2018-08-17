import React, { Component } from 'react'
import '../css/pure-min.css'


class CusItemGridRow extends Component {
  render() {
    //console.log('CusItemGridRow')
    const sku = JSON.parse(this.props.sku)

    return(
        <div className="pure-u-1 pure-u-md-1-3 pure-u-xl-1-4">
          <h3>{sku.title}</h3>
          <img className="pure-img" src={`https://ipfs.io/ipfs/${sku.imgIPFS}`} alt={`Image for ${sku.title}`}/>
          <span>Price (wei): {sku.price}</span><br/>
          <span>Discount %: {sku.discount}</span><br/>
          <button className="pure-button" onClick={(e) => this.props.action(sku.sku)}>More</button>
        </div>
    )
  }
}

class CusItemGrid extends Component {

    render() {
      const rows = []
      if (this.props.skus.length !== 0) {
        this.props.skus.forEach((sku) => {
          //console.log('Filling rows ' + sku)
          rows.push(
            <CusItemGridRow
            sku={JSON.stringify(sku)}
            key={sku.sku}
            action={this.props.action} />
          )
        })
      }

      return (
        <div id='item-row'>
          <div className="pure-g">
          {this.props.skus.length !== 0
            ? rows
            :<p></p>
          }
          </div>
        </div>

      )
    }
  }

  export default CusItemGrid
