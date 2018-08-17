import React, { Component } from 'react'
import '../css/pure-min.css'


class CusRegister extends Component {

  render() {
    return (
      <form
      className="pure-form pure-form-aligned"
      id="CustomerRegistration"
      onSubmit={(event) => {
        event.preventDefault()
        this.props.action(this.busTitle.value, this.govID.value)
      }}>
        <fieldset>
          <legend>Fill Registration Info and Submit</legend>
          <div className="pure-control-group">
              <label htmlFor="busTitle">Business Title</label>
              <input
              id="busTitle" type="text" placeholder="Business Title" className="pure-input-1-2"
              ref={(input) => this.busTitle=input}></input>
          </div>
          <div className="pure-control-group">
              <label htmlFor="govID">Government ID</label>
              <input
              id="govID" type="text" placeholder="EIN / TIN / Other" className="pure-input-1-2"
              ref={(input) => this.govID=input}></input>

          </div>
          <div className="pure-controls">
            <button type="submit" className="pure-button">Submit Request</button>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default CusRegister
