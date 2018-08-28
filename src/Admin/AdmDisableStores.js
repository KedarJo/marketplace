import React, { Component } from 'react'
//import '../css/pure-min.css'

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
            className="btn btn-secondary"
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
      <table className="table">
        <thead className="table-primary">
          <tr>
            <th scope="col">ID#</th>
            <th scope="col">Business Title</th>
            <th scope="col">Government ID</th>
            <th scope="col">Stores</th>
            <th scope="col">Disable</th>
          </tr>
        </thead>
        <tbody>
          { this.props.storeOwners.length !== 0
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
    )
  }
}

export default AdmDisableStores
