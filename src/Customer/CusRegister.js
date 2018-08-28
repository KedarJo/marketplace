import React, { Component } from 'react'
//import '../css/pure-min.css'


class CusRegister extends Component {

  render() {
    return (
      <form
      id="CustomerRegistration"
      onSubmit={(event) => {
        event.preventDefault()
        this.props.action(this.busTitle.value, this.govID.value)
      }}>
          <h5>Fill Registration Info and Submit</h5>
          <div className="form-group">
              <label htmlFor="busTitle">Business Title</label>
              <input
              id="busTitle" type="text" placeholder="Business Title" className="form-control"
              ref={(input) => this.busTitle=input}></input>
          </div>
          <div className="form-group">
              <label htmlFor="govID">Government ID</label>
              <input
              id="govID" type="text" placeholder="EIN / TIN / Other" className="form-control"
              ref={(input) => this.govID=input}></input>

          </div>
          <button type="submit" className="btn btn-primary">Submit Request</button>

      </form>
    )
  }
}

export default CusRegister
