import React, { Component } from 'react';
import styles from '../../style/components/chat-panel.scss'
import Chat from './Chat';
import Input from './Input';

const chats = [
  {
    type: 'user',
    message: 'What\'s the current tempetature?',
    createdAt: new Date('January 17, 2018 03:24:20'),
  },
  {
    type: 'pi',
    message: '78°',
    createdAt: new Date('January 17, 2018 03:24:23'),
  }
];

class ChatPanel extends Component {
  render() {
    return (
      <div className={`${styles.panel} card-panel`}>
        {chats.map((c, i) => (
          <Chat key={`${c.type}-${i}`} chat={c} />
        ))}
        <Input />
      </div>
    );
  }
}

export default ChatPanel;