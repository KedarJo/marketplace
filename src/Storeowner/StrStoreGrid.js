import React, { Component } from 'react'
//import '../css/pure-min.css'

class StrStoreGridRow extends Component {
  render() {
    //console.log('StrStoreGridRow')
    const store = JSON.parse(this.props.store)

    return(
        <div className="col-sm-4">
          <div className="card text-center">
            <h5 className="card-header">{store.title}</h5>
            <div className="card-body">
                <img className="card-img-top" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
            </div>

            <div>
              <a className="btn btn-light" onClick={(e) => this.props.action(store.storeID)}>Browse</a>
              <span> </span>
              <a className="btn btn-light" onClick={(e) => this.props.actionEdit(store.storeID)}>Edit</a>
            </div>

          </div>
        </div>
    )
  }
}

class StrStoreGrid extends Component {

    render() {

      const rows = []
      if (this.props.stores.length !== 0) {
        this.props.stores.forEach((store) => {
          //console.log('Filling rows')
          rows.push(
            <StrStoreGridRow
            store={JSON.stringify(store)}
            key={store.storeID}
            action={this.props.action}
            actionEdit={this.props.actionEdit}/>
          )
        })
      }
      //console.log(this.props.storeOwner)
      //console.log(this.props.stores.length)

      return (

      <div>
        <div>
          <span >Stores Of:
          {this.props.storeOwner === null
            ? <span></span>
            : <span> {this.props.storeOwner.busTitle}</span>
          }
          </span>
        </div>

        <div className="row">

            {this.props.stores.length !== 0
              ? rows
              : <p>No Stores Yet...</p>
            }

        </div>
        <br/>
        <button className="btn btn-primary" onClick={this.props.actionAdd}>Add Store</button>
      </div>
      )
   }
}


export default StrStoreGrid
