import React, { Component } from 'react'


class AdmNav extends Component {

  render() {
    return (
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
    )
  }
}

export default AdmNav
