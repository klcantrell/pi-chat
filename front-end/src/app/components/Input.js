import React, { Component } from 'react';

class Input extends Component {
  render() {
    return (
      <div className="input-field">
        <i className="material-icons prefix">mode_edit</i>
        <textarea id="chat_input" className="materialize-textarea"></textarea>
        <label htmlFor="chat_input">Message</label>
      </div>
    );
  }
 }

 export default Input;