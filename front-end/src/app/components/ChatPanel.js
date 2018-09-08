import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import SimpleBar from 'simplebar';
import styles from '../../style/components/chat-panel.scss';
import Chat from './Chat';
import Input from './Input';
import Loading from './Loading';

const TEMP_QUERY = gql`
  {
    singleChat {
      items {
        message
        createdAt
      }
    }
  }
`;

const WELCOME_CHAT = {
    welcome: true,
    type: 'pi',
    message: { __html: 'Welcome! Type <strong>get temperature</strong> and I\'ll give you the latest temperature reading.  Type <strong>log</strong> and I\'ll continuously send temperature readings every second if I can.' },
    createdAt: new Date(Date.now()),
};

const NOT_LIVE_CHAT = {
  type: 'pi',
  message: 'I\'m sorry, but I\'m not reading temperatures at the moment.  Try again later!',
  createdAt: new Date(Date.now()),
};

class ChatPanel extends Component {
  state = {
    chats: [],
    userQuerying: false,
    welcomeSent: false,
    showLoader: false,
  }

  componentDidMount() {
    this.simplebar = new SimpleBar(this.overflowFix, {
      autoHide: false,
    });
    setTimeout(() => {
      this.setState(({ chats }) => {
        return {
          chats: [...chats, WELCOME_CHAT],
          welcomeSent: true,
        };
      });
    }, 2000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.simplebar) {
      const scrollEl = this.simplebar.getScrollElement();
      const height = this.chatsBox.offsetHeight;
      scrollEl.scrollTop = height;
    }
    if (!prevState.userQuerying && this.state.userQuerying) {
      this.props.client.query({
        query: TEMP_QUERY,
      }).then(res => {
        const data = { ...res.data.singleChat.items[0] };
        const piChat = {
          type: 'pi',
          message: data.message,
          createdAt: new Date(data.createdAt),
        };
        setTimeout(() => {
          this.setState({
            showLoader: true,
          });
        }, 1500);
        setTimeout(() => {
          this.setState(({ chats }) => {
            return {
              chats: [...chats, piChat],
              userQuerying: false,
              showLoader: false,
            };
          });
        }, 2500);
      });
    }
  }

  captureUserChat = chat => {
    const isUserQuerying = chat.includes('get temperature');
    const userChat = {
      message: chat,
      createdAt: new Date(),
      type: 'user',
    };
    this.setState(({ chats }) => {
      return {
        chats: [...chats, userChat],
        userQuerying: isUserQuerying,
      };
    });
  }

  render() {
    const { chats, showLoader, welcomeSent } = this.state;
    return (
      <div className={`${styles.panel} card-panel`}>
        <div className={styles["overflow-fix"]} ref={node => this.overflowFix = node}>
          <div className={styles.chats} ref={node => this.chatsBox = node}>
            {chats.map((c, i) => (
              <Chat key={`${c.type}-${i}`} chat={c} />
            ))}
            {showLoader || !welcomeSent ? (
              <Loading />
            ) : (
              null
            )}
          </div>
        </div>
        <Input handleSubmit={this.captureUserChat} />
      </div>
    );
  }
}

export default withApollo(ChatPanel);