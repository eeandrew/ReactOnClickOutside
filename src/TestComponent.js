import React from 'react';
import clickOutside from './clickOutside.js';


class TestComponent extends React.Component {
	handleClickOutside() {
		console.log('on outside click');
	}
	render() {
		return <p>Hello World</p>
	}
}

export default clickOutside(TestComponent);