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

const WELCOME_CHAT = {
    welcome: true,
    type: 'pi',
    message: { __html: `
      <span>Welcome!  Here are a list of messages you can send me:</span>
      <ul class=${styles.welcomeInstructionsList}>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>get temperature</strong> and I\'ll give you the latest temperature reading.</li>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>log</strong> and I\'ll continuously send temperature readings every second if I can.</li>
        <li class=${styles.welcomeInstructionsItem}>Type <strong>stop</strong> if you need me to quit logging.</li>
      </ul>
    `},
    createdAt: new Date(Date.now()),
};

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

class ChatPanel extends Component {
  state = {
    chats: [],
    userQuerying: false,
    subscriptionActive: false,
    userWaitingOnSubscriptionResponse: false,
    welcomeSent: false,
    showLoader: false,
    isUserUnsubscribing: false,
  }

  componentDidMount() {
    this.simplebar = new SimpleBar(this.overflowFix, {
      autoHide: false,
    });
    if (this.props.ready) {
      setTimeout(() => {
        this.setState(({ chats }) => {
          return {
            chats: [...chats, WELCOME_CHAT],
            welcomeSent: true,
          };
        });
      }, 3000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.simplebar) {
      const scrollEl = this.simplebar.getScrollElement();
      const height = this.chatsBox.offsetHeight;
      scrollEl.scrollTop = height;
    }
    if (!prevState.userQuerying && this.state.userQuerying) {
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
    if (!prevState.userWaitingOnSubscriptionResponse && this.state.userWaitingOnSubscriptionResponse) {
      if (this.state.subscriptionActive) {
        this.loadAnimationBufferTimeout = setTimeout(() => {
          this.setState({
            showLoader: true,
          });
        }, 600);
      } else {
        this.setState({
          showLoader: false,
        });
      }
    }
    if (prevState.userWaitingOnSubscriptionResponse && !this.state.userWaitingOnSubscriptionResponse) {
      if (this.state.subscriptionActive) {
        this.setState({
          showLoader: false,
          userWaitingOnSubscriptionResponse: true,
        }) 
      } else {
        this.setState({
          showLoader: false,
        });
      }
    }
  }

  captureUserChat = chat => {
    const isUserQuerying = chat.includes('get temperature');
    const isUserSubscribing = chat.includes('log');
    const isUserUnsubscribing = chat.includes('stop');
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
    if (isUserSubscribing) {
      this.subscribe();
    }
    if (isUserUnsubscribing && this.state.subscriptionActive) {
      this.setState({
        isUserUnsubscribing,
      });
    }
  }

  subscribe() {
    this.setState({
      subscriptionActive: true,
      userWaitingOnSubscriptionResponse: true,
    });
    this.notLiveTimeout = setTimeout(() => {
      if (this.state.userWaitingOnSubscriptionResponse) {
        this.unsubscribe(NOT_LIVE_CHAT());
      }
    }, 10000);
    let _this = this;
    if (!this.subscriptionObserver) {
      this.subscriptionObserver = this.props.client.subscribe({
        query: TEMP_SUBSCRIPTION,
      }).subscribe({
        next({ data: { onCreateChat: chatData } }) {
          clearTimeout(_this.notLiveTimeout);
          const piChat = {
            type: 'pi',
            message: chatData.message,
            createdAt: new Date(chatData.createdAt),
          };
          _this.setState(({ chats }) => {
            return {
              chats: [...chats, piChat],
              userWaitingOnSubscriptionResponse: false,
            }
          });
          if (_this.state.isUserUnsubscribing) {
            return _this.unsubscribe();
          }
          _this.notLiveTimeout = setTimeout(() => {
            if (_this.state.userWaitingOnSubscriptionResponse) {
              _this.unsubscribe(NOT_LIVE_CHAT());
            }
          }, 10000);
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
      clearTimeout(this.loadAnimationBufferTimeout);
      clearTimeout(this.notLiveTimeout);
      this.subscriptionObserver.unsubscribe();
      this.subscriptionObserver = null;
      this.setState(({ chats }) => {
        const unsubscibeState = {
          userWaitingOnSubscriptionResponse: false,
          subscriptionActive: false,
          isUserUnsubscribing: false,
        };
        return message
          ? {
              ...unsubscibeState,
              chats: [...chats, message],
            }
          : {
              ...unsubscibeState,
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
        <Input handleSubmit={this.captureUserChat} disabled={!welcomeSent} />
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