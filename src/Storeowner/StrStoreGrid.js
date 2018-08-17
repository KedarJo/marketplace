import React, { Component } from 'react'
import '../css/pure-min.css'

class StrStoreGridRow extends Component {
  render() {
    //console.log('StrStoreGridRow')
    const store = JSON.parse(this.props.store)

    return(
        <div className="pure-u-1 pure-u-md-1-3 pure-u-xl-1-4">
          <h3>{store.title}</h3>
          <img className="pure-img" src={`https://ipfs.io/ipfs/${store.imgIPFS}`} alt={`Image for ${store.title}`}/>
          <button className="pure-button" onClick={(e) => this.props.action(store.storeID)}>More</button>
          <button className="pure-button" onClick={(e) => this.props.actionEdit(store.storeID)}>Edit</button>
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
        <div className="pure-g">
          <span className="pure-u-1">Stores Of:
          {this.props.storeOwner === null
            ? <span></span>
            : <span> {this.props.storeOwner.busTitle}</span>
          }
          </span>
        </div>
        <div id='store-row'>
          <div className="pure-g pure-u-1">
            {this.props.stores.length !== 0
              ? rows
              : <p>No Stores Yet...</p>
            }
          </div>

        </div>
        <br/>
        <br/>
        <button className="pure-button" onClick={this.props.actionAdd}>Add Store</button>
      </div>

      )
    }
  }

  export default StrStoreGrid
