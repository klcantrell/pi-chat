import React, { Component } from 'react';
import styles from '../../style/components/input.scss';

class Input extends Component {
  state = {
    inputText: '',
  }

  handleChange = e => {
    this.setState({
      inputText: e.target.value,
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.inputText) {
      this.props.handleSubmit(this.state.inputText);
      this.setState({
        inputText: '',
      });
    }
  }

  render() {
    const { inputText } = this.state;
    const { disabled } = this.props;
    return (
      <form action="#" onSubmit={this.handleSubmit} className={`input-field ${styles.input}`}>
        <i className="material-icons prefix">mode_edit</i>
        <input
          id="chat_input"
          type="text"
          className={styles.inputText}
          value={inputText}
          onChange={this.handleChange}
          disabled={disabled}
          autoCapitalize="off"
          autoComplete="off"
        />
        <label htmlFor="chat_input">Message</label>
      </form>
    );
  }
 }

 export default Input;
