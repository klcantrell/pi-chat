import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import styles from '../../style/components/chat-panel.scss'
import Chat from './Chat';
import Input from './Input';

const mockChats = [
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
  state = {
    chats: [],
  }

  captureUserChat = chat => {
    const userChat = {
      message: chat,
      createdAt: new Date(),
      type: 'user',
    }
    this.setState(({ chats }) => {
      return {
        chats: [...chats, userChat],
      };
    });
  }

  render() {
    const { chats } = this.state;
    return (
      <div className={`${styles.panel} card-panel`}>
        {chats.map((c, i) => (
          <Chat key={`${c.type}-${i}`} chat={c} />
        ))}
        <Input handleSubmit={this.captureUserChat} />
      </div>
    );
  }
}

export default withApollo(ChatPanel);