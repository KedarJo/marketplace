import React, { Component } from 'react'

function CusNav (props) {

  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-expand-lg navbar-light bg-light">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a href="#"
            className="nav-link"
            onClick={() => props.setCurrent('Shop')}>Shop</a>
          </li>
          <li className="nav-item">
            <a href="#"
            className="nav-link"
            onClick={() => props.setCurrent('BrowseStores')}>Take a tour</a>
          </li>
          <li className="nav-item">
            <a href="#"
            className="nav-link"
            onClick={() => props.setCurrent('RegisterAsStoreowner')}>Become a Storeowner</a>
          </li>
        </ul>
    </nav>
  )


}

/* Changing to funtional component
class CusNav extends Component {

  render() {

  }
}
*/

export default CusNav
