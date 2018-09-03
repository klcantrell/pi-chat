import React, { Component } from 'react';
import styles from '../../style/components/chat.scss';

class Chat extends Component {
  render() {
    const { chat } = this.props;
    return (
      <div className={`card horizontal ${styles.chat}`}>
        <div className={`card-image ${styles[`${chat.type}-avatar`]}`} />
        <div className={styles.content}>
          <div className={styles.meta}>
            <p className={styles.owner}>{chat.type === 'pi' ? 'pi' : 'me'}</p>
            <p className={styles.date}>
              {`${chat.createdAt.toDateString()} at ${chat.createdAt.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="card-content">
            <p>{chat.message}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Chat;
