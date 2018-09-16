import React, { Component } from 'react';
import styles from '../../style/components/chat.scss';
import posed from 'react-pose';
import { timeDifferenceForDate } from '../utils'; 

const ChatPosed = posed.div({
  visible: {
    opacity: 1,
    bottom: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
    }
  },
  hidden: {
    opacity: 0,
    bottom: -50,
  },
});

class Chat extends Component {
  state = {
    isVisible: false,
  }

  componentDidMount() {
    this.setState({
      isVisible: true,
    })
  }

  renderTime(chat) {
    if (chat.type === 'pi') {
      const piStaleValue = timeDifferenceForDate(chat.createdAt);
      if (piStaleValue) {
        return `Last update was ${piStaleValue}`;
      }
    }
    return `${chat.createdAt.toDateString()} at ${chat.createdAt.toLocaleTimeString()}`;
  }

  render() {
    const { isVisible } = this.state;
    const { chat } = this.props;
    return (
      <ChatPosed pose={isVisible ? 'visible' : 'hidden'} className={`card horizontal ${styles.chat}`}>
        <div className={`card-image ${styles[`${chat.type}-avatar`]}`} />
        <div className={styles.content}>
          <div className={styles.meta}>
            <p className={styles.owner}>{chat.type === 'pi' ? 'pi' : 'me'}</p>
            <p className={styles.date}>
              {this.renderTime(chat)}
            </p>
          </div>
          <div className="card-content">
            {chat.withMarkup ? (
                <p dangerouslySetInnerHTML={chat.message} />
              ) : (
                <p>{chat.message}</p>
            )}
          </div>
        </div>
      </ChatPosed>
    );
  }
}

export default Chat;
