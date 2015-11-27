import lorem from 'lorem-ipsum';
import React from 'react';
import ReactDOM from 'react-dom';
import RadioGroup from 'react-radio-group';

import SplitView from '../../src';

const App = React.createClass({

	displayName: 'App',

	getInitialState() {
		return {
			direction: 'row'
		};
	},

	handleChangeDirection(direction) {
		this.setState({ direction });
	},

	render() {
		return (
			<div className="App">
				<aside className="App-sidebar">
					<RadioGroup
						name="direction"
						onChange={this.handleChangeDirection}
						selectedValue={this.state.direction}
					>
						{Radio => (
							<div>
								<label><Radio value="column" />Column</label>
								<label><Radio value="row" />Row</label>
							</div>
						)}
					</RadioGroup>
				</aside>
				<div className="App-example">
					<SplitView direction={this.state.direction}>
						<p>{lorem({ count: Math.random() * 8 })}</p>
						<p>{lorem({ count: Math.random() * 8 })}</p>
						<p>{lorem({ count: Math.random() * 8 })}</p>
					</SplitView>
				</div>
			</div>
		);
	}

});

ReactDOM.render(
	<App />,
	document.getElementById('app')
);
