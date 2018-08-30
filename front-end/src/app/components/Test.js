import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import 'materialize-css/js/dropdown';
import style from '../../style/components/test.scss';

class Test extends Component {
  componentDidMount() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    const instances = M.Dropdown.init(elems, { coverTrigger: false });
  }
  
  render() {
    return (
      <div style={{width: "300px"}} ref={node => this.container = node}>
        <h1 className={style.header}>sup!</h1>
        <a className="waves-effect waves-light btn">button</a>
        <a className='dropdown-trigger btn' data-target='dropdown1'>Drop Me!</a>

        <ul id='dropdown1' className={`dropdown-content ${style["dropdown-width"]}`}>
          <li><span>one</span></li>
          <li><span>two</span></li>
          <li className="divider" tabIndex="-1"></li>
          <li><span>three</span></li>
          <li><span><i className="material-icons">view_module</i>four</span></li>
          <li><span><i className="material-icons">cloud</i>five</span></li>
        </ul>
      </div>
    );
  }
}

export default hot(module)(Test);