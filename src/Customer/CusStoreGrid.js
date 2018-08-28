import React, { Component } from 'react'
//import '../css/pure-min.css'

//class CusStoreGridRow extends Component {
//  render() {}
    //console.log('CusStoreGridRow')
function CusStoreGridRow (props) {
    const store = JSON.parse(props.store)

    return(
      <div className="col-sm-4">
      <div className="card text-center">
        <h5 className="card-header">{store.title}</h5>
        <div className="card-body">
        <img className="card-img-top" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
        <span>{store.numItems} items </span><br/>
        <button className="btn btn-light" onClick={(e) => props.action(store.storeID)}>More</button>
        </div>
      </div>
      </div>

    )
}

//class CusStoreGrid extends Component {
//    render() {
function CusStoreGrid (props) {
      const rows = []
      if (props.stores.length !== 0) {
          props.stores.forEach((store) => {
          //console.log('Filling rows')
          rows.push(
            <CusStoreGridRow
            store={JSON.stringify(store)}
            key={store.storeID}
            action={props.action} />
          )
        })
      }

      return (
        <div className="row">
          {props.stores.length !== 0
            ? rows
            :<p></p>
          }
        </div>
      )
  }

  /*
  <div className="pure-u-1 pure-u-md-1-3 pure-u-xl-1-4">
    <h3>{store.title}</h3>
    <img className="pure-img" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
    <span>{store.numItems} items </span><br/>
    <button className="pure-button" onClick={(e) => this.props.action(store.storeID)}>More</button>
  </div>

    <div className="col-sm-6 col-md-4 col-lg-3 ">
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{store.title}</h3>
        </div>
        <div className="panel-body">
          <img className="img-rounded img-center" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
          <br/>
          <strong>Items offered: </strong><span>{store.numItems}</span>
          <br/>
          <button className="btn btn-default" onClick={(e) => this.props.action(store.storeID)}>More</button>
        </div>
      </div>
    </div>
  */

  export default CusStoreGrid
