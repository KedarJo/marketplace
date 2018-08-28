import React, { Component } from 'react'


class CusNav extends Component {

  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-md navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('Shop')}>Shop</a>
            </li>
            <li className="nav-item">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('BrowseStores')}>Take a tour</a>
            </li>
            <li className="nav-item">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('RegisterAsStoreowner')}>Become a Storeowner</a>
            </li>
          </ul>
      </nav>
    )
  }
}

export default CusNav
