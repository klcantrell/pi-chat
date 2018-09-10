import React, { Component } from 'react';
import styles from '../../style/components/input.scss';

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
    const { ready } = this.props;
    return (
      <div className={`input-field ${styles.input}`}>
        <i className="material-icons prefix">mode_edit</i>
        <textarea
          id="chat_input"
          className="materialize-textarea"
          value={inputText}
          onChange={this.handleChange}
          disabled={!ready}
        > 
        </textarea>
        <label htmlFor="chat_input">Message</label>
      </div>
    );
  }
 }

 export default Input;
