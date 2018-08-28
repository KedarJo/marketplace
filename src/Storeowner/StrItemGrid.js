import React, { Component } from 'react'
//import '../css/pure-min.css'

//class StrItemGridRow extends Component {
//  render() {}
function StrItemGridRow (props) {
    //console.log('StrItemGridRow')
    const sku = JSON.parse(props.sku)

    return(
        <div className="col-sm-4">
            <div className="card text-center">
                <h5 className="card-header">{sku.title}</h5>
                <div className="card-body">
                    <img className="card-img-top" src={`https://ipfs.io/ipfs/${sku.imgIPFS}`} alt={`Image for ${sku.title}`}/>
                    <span>Quantity Left: {sku.quantity}</span><br/>
                    <span>Price (wei): {sku.price}</span><br/>
                    <span>Discount %: {sku.discount}</span><br/>
                    <a className="btn btn-light" onClick={(e) => props.actionEdit(sku.sku)}>Edit</a>
                </div>
            </div>
        </div>
    )
}

//class StrItemGrid extends Component {
//    render() {
function StrItemGrid (props) {
      const rows = []
      if (props.skus.length !== 0) {
          props.skus.forEach((sku) => {
          //console.log('Filling rows ' + sku)
          rows.push(
            <StrItemGridRow
            sku={JSON.stringify(sku)}
            key={sku.sku}
            actionEdit={props.actionEdit} />
          )
        })

      }
      //console.log(this.props.storeOwner)
      //console.log(this.props.store)

      return (

          <div>
              <span>Listings Of:
              {props.storeOwner === null
                ? <span></span>
                : <span> {props.storeOwner.busTitle} / {props.store.title}</span>
              }

              </span>
            <div className="row">

                {props.skus.length !== 0
                  ? rows
                  : <p>No Listings Yet...</p>
                }


            </div>
            <br/>
            <br/>
            <button className="btn btn-primary" onClick={props.actionAdd}>List New Item</button>
          </div>
      )
  }

  export default StrItemGrid
