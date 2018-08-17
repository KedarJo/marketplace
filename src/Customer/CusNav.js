import React, { Component } from 'react'


class CusNav extends Component {

  render() {
    return (
      <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#"
          className="pure-menu-heading pure-menu-link pure-menu-active"
          onClick={() => this.props.setCurrent('Shop')}>Shop</a>
          <a href="#"
          className="pure-menu-heading pure-menu-link"
          onClick={() => this.props.setCurrent('BrowseStores')}>Take a tour</a>
          <a href="#"
          className="pure-menu-heading pure-menu-link"
          onClick={() => this.props.setCurrent('RegisterAsStoreowner')}>Become a Storeowner</a>
      </nav>
    )
  }
}

export default CusNav
