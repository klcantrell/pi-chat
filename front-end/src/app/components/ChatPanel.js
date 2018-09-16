import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import SimpleBar from 'simplebar';
import styles from '../../style/components/chat-panel.scss';
import Chat from './Chat';
import Input from './Input';
import Loading from './Loading';

const TEMP_QUERY = gql`
  query {
    singleChat {
      items {
        message
        createdAt
      }
    }
  }
`;

const TEMP_SUBSCRIPTION = gql`
  subscription {
    onCreateChat {
      message
      createdAt
      id
      kind
    }
  }
`;

const WELCOME_CHAT = () => ({
    withMarkup: true,
    type: 'pi',
    message: { __html: `
      <span>Welcome!  Here are a list of messages you can send me:</span>
      <ul class=${styles.welcomeInstructionsList}>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>get temp</strong> and I\'ll give you the latest temperature reading.</li>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>log</strong> to subscribe to real-time updates of my temperature readings.</li>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>stop</strong> if you want to unsubscribe from real-time updates.</li>
      </ul>
    `},
    createdAt: new Date(Date.now()),
});

const NOT_LIVE_CHAT = () => ({
  type: 'pi',
  message: 'I\'m sorry, but I\'m not reading temperatures at the moment.  Try again later!',
  createdAt: new Date(Date.now()),
});

const ERROR_CHAT = () => ({
  type: 'pi',
  message: 'I\'m sorry, but something went wrong.  Try again later!',
  createdAt: new Date(Date.now()),
});

const REMINDER_CHAT = () => ({
  withMarkup: true,
  type: 'pi',
  message: { __html: `
    I\'m sorry but I only understand the commands <strong>get temp</strong>, <strong>log</strong>, and <strong>stop</strong>. Try one of those!
  `},
  createdAt: new Date(Date.now()),
});

const NOSUB_CHAT = () => ({
  withMarkup: true,
  type: 'pi',
  message: { __html: `
    I\'m sorry but there's no subscription to stop.  Type <strong>log</strong> if you want to subscribe.
  `},
  createdAt: new Date(Date.now()),
});

class ChatPanel extends Component {
  state = {
    chats: [],
    welcomeSent: false,
    showLoader: false,
    subscriptionActive: false,
    isUserUnsubscribing: false,
    inProcess: false,
  }

  componentDidMount() {
    this.simplebar = new SimpleBar(this.overflowFix, {
      autoHide: false,
    });
    if (this.props.ready) {
      setTimeout(() => {
        this.setState(({ chats }) => {
          return {
            chats: [...chats, WELCOME_CHAT()],
            welcomeSent: true,
          };
        });
      }, 3000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.simplebar && this.state.chats.length > 1) {
      const scrollEl = this.simplebar.getScrollElement();
      const height = this.chatsBox.offsetHeight;
      scrollEl.scrollTop = height;
    }
  }

  handleUserChat = chat => {
    const { inProcess, subscriptionActive } = this.state;

    const userChat = {
      message: chat,
      createdAt: new Date(),
      type: 'user',
    };
    this.setState(({ chats }) => {
      return {
        chats: [...chats, userChat],
        inProcess: true,
      };
    });

    const isUserQuerying = /^\s*get temp\s*$/.test(chat.toLowerCase());
    const isUserSubscribing = /^\s*log\s*$/.test(chat.toLowerCase());
    const isUserUnsubscribing = /^\s*stop\s*$/.test(chat.toLowerCase());

    if (isUserQuerying && !subscriptionActive && !inProcess) {
      return this.queryLatestTemp().then(chat => {
        this.sendPiChat(chat);
      });
    }
    if (isUserSubscribing && !subscriptionActive && !inProcess) {
      return this.subscribe();
    }
    if (isUserUnsubscribing) {
      return subscriptionActive
        ? this.setState({
            isUserUnsubscribing,
          })
        : this.sendPiChat(NOSUB_CHAT());
    }
    if (!subscriptionActive && !inProcess) {
      this.sendPiChat(REMINDER_CHAT());
    }
  }

  queryLatestTemp = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.setState({
          showLoader: true,
        });
      }, 1500);
      this.props.client.query({
        fetchPolicy: 'no-cache',
        query: TEMP_QUERY,
      }).then(({ data: { singleChat } }) => {
        const chatData = { ...singleChat.items[0] };
        const piChat = {
          type: 'pi',
          message: chatData.message,
          createdAt: new Date(chatData.createdAt),
        };
        resolve(piChat);
      });
    })
  }

  handleSubUpdate = piChat => {
    clearTimeout(this.notLiveTimeout);
    if (this.state.isUserUnsubscribing) {
      return this.unsubscribe();
    }
    this.sendPiChat(piChat).then(() => {
      setTimeout(() => {
        this.setState({
          showLoader: true,
        })
      }, 500);
    });
    this.notLiveTimeout = setTimeout(() => {
      if (this.state.subscriptionActive) {
        this.unsubscribe(NOT_LIVE_CHAT());
      }
    }, 10000);
  }

  sendPiChat = piChat => {
    return new Promise((resolve, reject) => {
      if (!this.state.showLoader && !this.state.isUserUnsubscribing) {
        setTimeout(() => {
          this.setState({
            showLoader: true,
          });
        }, 1500);
      }
      setTimeout(() => {
        this.setState(({ chats }) => {
          return {
            chats: [...chats, piChat],
            showLoader: false,
            inProcess: false,
          };
        });
        resolve();
      }, 2500);
    });
  }

  subscribe() {
    let _this = this;
    _this.setState({
      subscriptionActive: true,
    });
    setTimeout(() => {
      _this.setState({
        showLoader: true,
      });
    }, 1000);
    _this.notLiveTimeout = setTimeout(() => {
      if (_this.state.subscriptionActive) {
        _this.unsubscribe(NOT_LIVE_CHAT());
      }
    }, 10000);
    if (!_this.subscriptionObserver) {
      _this.subscriptionObserver = _this.props.client.subscribe({
        query: TEMP_SUBSCRIPTION,
      }).subscribe({
        next({ data: { onCreateChat: chatData } }) {
          const piChat = {
            type: 'pi',
            message: chatData.message,
            createdAt: new Date(chatData.createdAt),
          };
          _this.handleSubUpdate(piChat);
        },
        error(err) {
          console.log(err);
          _this.unsubscribe(ERROR_CHAT());
        }
      });
    }
  }

  unsubscribe(message) {
    if (this.subscriptionObserver) {
      clearTimeout(this.notLiveTimeout);
      this.subscriptionObserver.unsubscribe();
      this.subscriptionObserver = null;
      this.setState(({ chats }) => {
        const unsubscribeState = {
          subscriptionActive: false,
          isUserUnsubscribing: false,
          showLoader: false,
          inProcess: false,
        };
        return message
          ? {
              ...unsubscribeState,
              chats: [...chats, message],
            }
          : {
              ...unsubscribeState,
            };
      });
    }
  }

  render() {
    const { chats, showLoader, welcomeSent } = this.state;
    const { ready } = this.props;
    return (
      <div className={`${styles.panel} card-panel`}>
        <div className={styles["overflow-fix"]} ref={node => this.overflowFix = node}>
          <div className={styles.chats} ref={node => this.chatsBox = node}>
            {chats.map((c, i) => (
              <Chat key={`${c.type}-${i}`} chat={c} />
            ))}
            {showLoader || !welcomeSent ? (
              <Loading initialLoad={!welcomeSent} />
            ) : (
              null
            )}
          </div>
        </div>
        <Input handleSubmit={this.handleUserChat} disabled={!welcomeSent} />
      </div>
    );
  }
}

export default ({ ready }) => {
  return ready ? (
    <ApolloConsumer>
      {client => (
        <ChatPanel client={client} ready={ready} />
      )}
    </ApolloConsumer>
  ) : (
    <ChatPanel />
  );
};