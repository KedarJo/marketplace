import React, { Component } from 'react'
import CusItemGrid from './CusItemGrid'
//import '../css/pure-min.css'


//class CusStoreDetail extends Component {
//    render() {}
function CusStoreDetail (props) {
      return (
        <div>
          <h2>{props.store.title}</h2>
          <br/>
          <CusItemGrid
          skus={props.skus}
          action={props.handleCusItemClick} />
        </div>
      )

  }

  export default CusStoreDetail
