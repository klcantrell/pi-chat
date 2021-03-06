import React, { Component } from 'react';
import posed from 'react-pose';
import styles from '../../style/components/loading.scss';

const LoadingPosed = posed.div({
  visible: {
    opacity: 1,
    transition: {
      duration: 300,
    }
  },
  hidden: {
    opacity: 0,
  },
});

class Loading extends Component {
  state = {
    hidden: true,
  }

  componentDidMount() {
    this.setState({
      hidden: false,
    });
  }

  render() {
    const { hidden } = this.state;
    const { initialLoad } = this.props;
    return (
      <div className={styles.container}>
        <LoadingPosed pose={hidden ? 'hidden' : 'visible'} className={styles.loading}>
          <div className={styles.ring1} />
          <div className={styles.ring2} />
          <div className={styles.ring3} />
          <div className={styles.center} />
        </LoadingPosed>
        {initialLoad && (
          <h3 className={styles.title}>PiChat</h3>
        )}
      </div>
    );
  }
};

export default Loading;