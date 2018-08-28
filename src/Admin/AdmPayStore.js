import React, { Component } from 'react'
//import '../css/pure-min.css'

class AdmPayStoreRow extends Component {
  render() {
    const store = JSON.parse(this.props.store)

    return(
        <tr>
          <td>{store.storeOwner}</td>
          <td>{store.storeID}</td>
          <td>{store.title}</td>
          <td>{store.storeBal}</td>
          <td><button
            className="btn btn-secondary"
            onClick={() => this.props.action(store.storeID)}>Pay</button></td>
        </tr>
    )
  }
}

class AdmPayStore extends Component {

  render() {
    //console.log('AdmPayStore/render')
    const rows = [];

    if (this.props.stores.length !== 0) {
      this.props.stores.forEach((store) => {

        rows.push(
          <AdmPayStoreRow
          store={JSON.stringify(store)}
          key={store.storeID}
          action={this.props.action} />
        )
      })
    }

    return (
    <div>
      <span>MarketPlace Balance Held: {this.props.contractBal.toString()} (wei)</span>
      <table className="table">
        <thead className="table-primary">
          <tr>
            <th scope="col">Store Owner</th>
            <th scope="col">Store ID</th>
            <th scope="col">Store Name</th>
            <th scope="col">Pending Balance (wei)</th>
            <th scope="col">Payout</th>
          </tr>
        </thead>
        <tbody>
          { this.props.stores.length !== 0
            ?  rows
            :
               <tr>
                 <td scope="col">None</td>
                 <td scope="col">None</td>
                 <td scope="col">None</td>
                 <td scope="col">None</td>
                 <td scope="col">None</td>
               </tr>
        }
        </tbody>
      </table>
    </div>
    )
  }
}

export default AdmPayStore
