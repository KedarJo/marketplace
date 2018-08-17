import React, { Component } from 'react'
import CusItemGrid from './CusItemGrid'
import '../css/pure-min.css'


class CusStoreDetail extends Component {

    render() {
      return (
        <div className="pure-g pure-u-1 pure-u-md-1-3 pure-u-xl-1-4">
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
