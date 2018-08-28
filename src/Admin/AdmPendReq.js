import React, { Component } from 'react'
//import '../css/pure-min.css'


//class AdmPendReqRow extends Component {
//  render() {}
function AdmPendReqRow (props) {
    const account = JSON.parse(props.account)

    return(
        <tr>
          <td>{account.acct}</td>
          <td>{account.busTitle}</td>
          <td>{account.govID}</td>
          <td>{account.numStores}</td>
          <td><button
            className="btn btn-secondary"
            onClick={() => props.action(account.acct, true)}>Approve</button></td>
          <td><button
            className="btn btn-secondary"
            onClick={() => props.action(account.acct, false)}>Deny</button></td>
        </tr>
    )

}

//class AdmPendReq extends Component {
//  render() {}
function AdmPendReq (props) {
    const rows = [];
    if (props.pendAccount.length !== 0) {
        props.pendAccount.forEach((account) => {
        rows.push(
          <AdmPendReqRow
          account={JSON.stringify(account)}
          key={account.govID}
          action={props.action}/>
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
            <th scope="col">Approve</th>
            <th scope="col">Deny</th>
          </tr>
        </thead>
        <tbody>
          { props.pendAccount.length !== 0
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



export default AdmPendReq
