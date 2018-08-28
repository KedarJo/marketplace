import React, { Component } from 'react'
//import '../css/pure-min.css'


class AdmAddSuper extends Component {

  render() {
    return (
      <form
      id="AddSuperuser"
      onSubmit={(event) => {
        event.preventDefault()
        this.props.action(this.superaccount.value)
      }}>

          <h3>Grant Superuser Access</h3>
          <div className="form-group">
              <label htmlFor="Superuser">Enter Account #</label>
              <input
              id="Superuser" type="text" placeholder="Account#" className="form-control"
              ref={(input) => this.superaccount=input}></input>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    )
  }
}

/*
<form
className="pure-form pure-form-aligned"
id="AddSuperuser"
onSubmit={(event) => {
  event.preventDefault()
  this.props.action(this.superaccount.value)
}}>
  <fieldset>
    <legend>Grant Superuser Access</legend>
    <div className="pure-control-group">
        <label htmlFor="Superuser">Account number</label>
        <input
        id="Superuser" type="text" placeholder="Account#" className="pure-input-1-2"
        ref={(input) => this.superaccount=input}></input>

    </div>
    <div className="pure-controls">
      <button type="submit" className="pure-button">Submit</button>
    </div>
  </fieldset>
</form>
*/


export default AdmAddSuper
