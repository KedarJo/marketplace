import React, { Component } from 'react'


class StrNav extends Component {

  render() {
    return (
      <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#"
          className="pure-menu-heading pure-menu-link pure-menu-active"
          onClick={() => this.props.setCurrent('BrowseMyStores')}>Stores</a>
      </nav>
    )
  }
}

export default StrNav
