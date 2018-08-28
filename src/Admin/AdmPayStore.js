import React, { Component } from 'react'
//import '../css/pure-min.css'

//class AdmPayStoreRow extends Component {
//  render() {}
function AdmPayStoreRow (props) {
    const store = JSON.parse(props.store)

    return(
        <tr>
          <td>{store.storeOwner}</td>
          <td>{store.storeID}</td>
          <td>{store.title}</td>
          <td>{store.storeBal}</td>
          <td><button
            className="btn btn-secondary"
            onClick={() => props.action(store.storeID)}>Pay</button></td>
        </tr>
    )
}

//class AdmPayStore extends Component {
//  render() {}
function AdmPayStore (props) {
    //console.log('AdmPayStore/render')
    const rows = [];

    if (props.stores.length !== 0) {
        props.stores.forEach((store) => {

        rows.push(
          <AdmPayStoreRow
          store={JSON.stringify(store)}
          key={store.storeID}
          action={props.action} />
        )
      })
    }

    return (
    <div>
      <span>MarketPlace Balance Held: {props.contractBal.toString()} (wei)</span>
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
          { props.stores.length !== 0
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

export default AdmPayStore
