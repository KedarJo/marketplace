import React, { Component } from 'react'


class AdmNav extends Component {

  render() {
    return (
      <nav className="navbar fixed-top navbar-expand-md navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('ApproveRequests')}>Approve Requests</a>
            </li>
            <li className="nav-item">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('DisableStoreOwners')}>Disable Store Owners</a>
            </li>
            <li className="nav-item">
              <a href="#"
              className="nav-link"
              onClick={() => this.props.setCurrent('PayStore')}>Pay Stores</a>
            </li>
            <li className="nav-item">
              {this.props.admin
                ? <a href="#"
                  className="nav-link"
                  onClick={() => this.props.setCurrent('AddSuperuser')}>Add Superuser</a>
                : <a></a>
              }
            </li>
            <li className="nav-item">
              {this.props.admin
                ? <a href="#"
                  className="nav-link"
                  onClick={() => this.props.setCurrent('PauseOperation')}>Pause Operation</a>
                : <a></a>
              }
            </li>
          </ul>

      </nav>
    )
  }
}
/*
<nav className="navbar pure-menu pure-menu-horizontal">
    <a href="#"
    className="pure-menu-heading pure-menu-link pure-menu-active"
    onClick={() => this.props.setCurrent('ApproveRequests')}>Approve Requests</a>
    <a href="#"
    className="pure-menu-heading pure-menu-link"
    onClick={() => this.props.setCurrent('DisableStoreOwners')}>Disable Store Owners</a>
    <a href="#"
    className="pure-menu-heading pure-menu-link"
    onClick={() => this.props.setCurrent('PayStore')}>Pay Stores</a>
    {this.props.admin
      ? <a href="#"
        className="pure-menu-heading pure-menu-link"
        onClick={() => this.props.setCurrent('AddSuperuser')}>Add Superuser</a>
      : <a></a>
    }
    {this.props.admin
      ? <a href="#"
        className="pure-menu-heading pure-menu-link"
        onClick={() => this.props.setCurrent('PauseOperation')}>Pause Operation</a>
      : <a></a>
    }

</nav>
*/
export default AdmNav
