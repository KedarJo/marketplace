import React, { Component } from 'react'
//import '../css/pure-min.css'

//class StrStoreGridRow extends Component {
//  render() {}
    //console.log('StrStoreGridRow')
function StrStoreGridRow (props) {
    const store = JSON.parse(props.store)

    return(
        <div className="col-sm-4">
          <div className="card text-center">
            <h5 className="card-header">{store.title}</h5>
            <div className="card-body">
                <img className="card-img-top" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
            </div>
            <div>
              <span>Store Balance: {store.storeBal} (wei)</span><br />
              <a className="btn btn-light" onClick={(e) => props.action(store.storeID)}>Browse</a>
              <span> </span>
              <a className="btn btn-light" onClick={(e) => props.actionEdit(store.storeID)}>Edit</a>
            </div>

          </div>
        </div>
    )
}

//class StrStoreGrid extends Component {
//    render() {}
function StrStoreGrid (props) {
      const rows = []
      if (props.stores.length !== 0) {
          props.stores.forEach((store) => {
          //console.log('Filling rows')
          rows.push(
            <StrStoreGridRow
            store={JSON.stringify(store)}
            key={store.storeID}
            action={props.action}
            actionEdit={props.actionEdit}/>
          )
        })
      }
      //console.log(this.props.storeOwner)
      //console.log(this.props.stores.length)

      return (

      <div>
        <div>
          <span >Stores Of:
          {props.storeOwner === null
            ? <span></span>
            : <span> {props.storeOwner.busTitle}</span>
          }
          </span>
        </div>

        <div className="row">

            {props.stores.length !== 0
              ? rows
              : <p>No Stores Yet...</p>
            }

        </div>
        <br/>
        <button className="btn btn-primary" onClick={props.actionAdd}>Add Store</button>
      </div>
      )

}


export default StrStoreGrid
