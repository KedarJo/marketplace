import React, { Component } from 'react'
import CusItemGrid from './CusItemGrid'
//import '../css/pure-min.css'


class CusStoreDetail extends Component {

    render() {
      return (
        <div>
          <h2>{this.props.store.title}</h2>

          <br/>

          <CusItemGrid
          skus={this.props.skus}
          action={this.props.handleCusItemClick} />
        </div>
      )
    }
  }

  export default CusStoreDetail
