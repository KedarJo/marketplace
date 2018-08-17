import React, { Component } from 'react'
import '../css/pure-min.css'

class AdmDisableStoreRow extends Component {
  render() {
    const account = JSON.parse(this.props.account)

    return(
        <tr>
          <td>{account.acct}</td>
          <td>{account.busTitle}</td>
          <td>{account.govID}</td>
          <td>{account.numStores}</td>
          <td><button
            className="pure-button"
            onClick={() => this.props.action(account.acct)}>Disable</button></td>
        </tr>
    )
  }
}



class AdmDisableStores extends Component {

  render() {
    const rows = [];
    if (this.props.storeOwners.length !== 0) {
      this.props.storeOwners.forEach((account) => {

        rows.push(
          <AdmDisableStoreRow
          account={JSON.stringify(account)}
          key={account.acct}
          action={this.props.action} />
        )
      })
    }

    return (
      <table className="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>ID#</th>
            <th>Business Title</th>
            <th>Government ID</th>
            <th>Stores</th>
            <th>Disable</th>
          </tr>
        </thead>
        <tbody>
          { this.props.storeOwners.length !== 0
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
    )
  }
}

export default AdmDisableStores
