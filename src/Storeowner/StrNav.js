import React, { Component } from 'react'


class StrNav extends Component {

  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-md navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="#"
              className="nav-link active"
              onClick={() => this.props.setCurrent('BrowseMyStores')}>Stores</a>
            </li>
          </ul>
      </nav>
    )
  }
}

export default StrNav
