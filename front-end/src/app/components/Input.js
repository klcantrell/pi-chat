import React, { Component } from 'react';

class Input extends Component {
  state = {
    inputText: '',
  }

  handleChange = e => {
    if(e.target.value.includes('\n')) {
      this.props.handleSubmit(this.state.inputText)
      return this.setState({
        inputText: '',
      })
    }
    this.setState({
      inputText: e.target.value,
    });
  }

  render() {
    const { inputText } = this.state;
    return (
      <div className="input-field">
        <i className="material-icons prefix">mode_edit</i>
        <textarea
          id="chat_input"
          className="materialize-textarea"
          value={inputText}
          onChange={this.handleChange}
        > 
        </textarea>
        <label htmlFor="chat_input">Message</label>
      </div>
    );
  }
 }

 export default Input;
