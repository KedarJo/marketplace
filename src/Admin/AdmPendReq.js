import React, { Component } from 'react'
import '../css/pure-min.css'


class AdmPendReqRow extends Component {
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
            onClick={() => this.props.action(account.acct, true)}>Approve</button></td>
          <td><button
            className="pure-button"
            onClick={() => this.props.action(account.acct, false)}>Deny</button></td>
        </tr>
    )

  }
}

class AdmPendReq extends Component {

  render() {
    const rows = [];
    if (this.props.pendAccount.length !== 0) {
      this.props.pendAccount.forEach((account) => {
        rows.push(
          <AdmPendReqRow
          account={JSON.stringify(account)}
          key={account.govID}
          action={this.props.action}/>
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
            <th>Approve</th>
            <th>Deny</th>
          </tr>
        </thead>
        <tbody>
          { this.props.pendAccount.length !== 0
            ? rows
            :
             <tr >
               <td>None</td>
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



export default AdmPendReq
