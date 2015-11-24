import lorem from 'lorem-ipsum';
import React from 'react';
import ReactDOM from 'react-dom';

import SplitView from '../../src';

const App = React.createClass({

	displayName: 'App',

	render() {
		return (
			<div className="App">
				<SplitView>
					<p>{lorem({ count: Math.random() * 8 })}</p>
					<p>{lorem({ count: Math.random() * 8 })}</p>
				</SplitView>
			</div>
		);
	}

});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);
