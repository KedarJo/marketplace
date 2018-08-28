import React, { Component } from 'react'
// import '../css/pure-min.css'


//class CusItemGridRow extends Component {
//  render() {
    //console.log('CusItemGridRow')
function CusItemGridRow (props) {
    const sku = JSON.parse(props.sku)

    return(
        <div className="col-sm-4">
            <div className="card text-center">
              <h5 className="card-header">{sku.title}</h5>
              <div className="card-body">
                  <img className="card-img-top" src={`https://ipfs.io/ipfs/${sku.imgIPFS}`} alt={`Image for ${sku.title}`}/>
                  <span>Price (wei): {sku.price}</span><br/>
                  <span>Discount %: {sku.discount}</span><br/>
                  <button className="btn btn-light" onClick={(e) => props.action(sku.sku)}>Details</button>
              </div>
            </div>
        </div>
    )
}

//class CusItemGrid extends Component {
//    render() {}
function CusItemGrid (props) {
      const rows = []
      if (props.skus.length !== 0) {
          props.skus.forEach((sku) => {
          //console.log('Filling rows ' + sku)
          rows.push(
            <CusItemGridRow
            sku={JSON.stringify(sku)}
            key={sku.sku}
            action={props.action} />
          )
        })
      }

      return (
        <div className='container'>
        <div className='row'>

          {props.skus.length !== 0
            ? rows
            :<p></p>
          }

        </div>
        </div>

      )
  }

  export default CusItemGrid
