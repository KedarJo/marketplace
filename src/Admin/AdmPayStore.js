import React, { Component } from 'react'
import '../css/pure-min.css'

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
            className="pure-button"
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
      <table className="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Store Owner</th>
            <th>Store ID</th>
            <th>Store Name</th>
            <th>Pending Balance (wei)</th>
            <th>Payout</th>
          </tr>
        </thead>
        <tbody>
          { this.props.stores.length !== 0
            ?  rows
            :
               <tr>
                 <td>None</td>
                 <td>None</td>
                 <td>None</td>
                 <td>None</td>
                 <td>None</td>
               </tr>
        }
        </tbody>
      </table>
    </div>
    )
  }
}

export default AdmPayStore
