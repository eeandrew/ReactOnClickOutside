import React from 'react';
import ReactDOM from 'react-dom';
import {IGNORE_CLASS,isNodeFound,generateOutsideCheck,registeredComponents,handlers} from './util.js';

function clickOutside(Component) {
	class OnClickOutside extends React.Component {
		static getClass() {
			if(Component.getClass) {
				return Component.getClass();
			}
			return Component;
		}
    constructor(props) {
      super(props);
      this._bindFunc();
    }

    _bindFunc() {
      let funcs = ['getInstance'];
      funcs.map((func)=>{
        this[func].bind(this);
      });
    }

    getInstance() {
      return this.refs.instance;
    }

    _outsideClickHandler(evt){

    }

    componentDidMount() {
      let instance = this.getInstance();
      if(typeof instance.handleClickOutside !== 'function') {
        throw new Error('handleClickOutside(evt) must be supplied to your componet');
      }
      let fn = this._outsideClickHandler = generateOutsideCheck(
        ReactDOM.findDOMNode(instance),
        instance.handleClickOutside,
        this.props.outsideClickIgnoreClass || IGNORE_CLASS,
        this.props.preventDefault || false,
        this.props.stopPropagation || false
      );

      let pos = registeredComponents.length;
      registeredComponents.push(this);
      handlers[pos] = fn;
      if(!this.props.disableOnClickOutside) {
        this.enableOnClickOutside();
      }
    }

    componentWillUnmount() {
      this.disableOnClickOutside();
      this._outsideClickHandler = false;
      let pos = registeredComponents.indexOf(this);
      if(pos > -1) {
        if(handlers[pos]){handlers.splice(pos,1);}
        registeredComponents.splice(pos,1);
      }
    }

    render() {
      let passedProps = this.props;
      let props = { ref: 'instance' };
      Object.keys(this.props).forEach(function(key) {
        props[key] = passedProps[key];
      });
      return (<Component {...props} />);
    }

    enableOnClickOutside() {
      let fn = this._outsideClickHandler;
      if(typeof document !== 'undefined') {
        document.addEventListener('mousedown',fn);
        document.addEventListener('touchstart',fn);
      }
    }

    disableOnClickOutside() {
      let fn = this._outsideClickHandler;
      if(typeof document !== 'undefined') {
        document.removeEventListener('mousedown',fn);
        document.removeEventListener('touchstart',fn);
      }
    }

	} 
	return OnClickOutside;
}

export default clickOutside;