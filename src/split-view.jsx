import React, { PropTypes } from 'react';

import bound from './bound';
import joinWith from './join-with';

export default React.createClass({

	displayName: 'SplitView',

	propTypes: {
		children: PropTypes.arrayOf(PropTypes.element).isRequired,
		direction: PropTypes.oneOf(['row', 'column']),
		paneStyle: PropTypes.object,
		splitterSize: PropTypes.number,
		splitterStyle: PropTypes.object,
		style: PropTypes.object
	},

	getDefaultProps() {
		return {
			direction: 'row',
			splitterSize: 4
		};
	},

	getInitialState() {
		return {
			ratios: this.props.children.map(() => 1 / this.props.children.length)
		};
	},

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mouseup', this.mouseup);
	},

	handleMouseDown(event) {
		const splitterIndex = this.splitters.indexOf(event.target);

		this.movement = {
			splitterIndex,
			availableRatio: this.state.ratios[splitterIndex]
				+ this.state.ratios[splitterIndex + 1],
			minimumPosition:
				this.panes[splitterIndex]
				.getBoundingClientRect()[
					this.props.direction === 'row' ? 'left' : 'top'
				],
			maximumPosition:
				this.panes[splitterIndex + 1]
				.getBoundingClientRect()[
					this.props.direction === 'row' ? 'right' : 'bottom'
				]
		};

		window.addEventListener('mousemove', this.handleMouseMove);
		window.addEventListener('mouseup', this.handleMouseUp);
	},

	handleMouseMove(event) {
		const {
			splitterIndex,
			availableRatio,
			minimumPosition,
			maximumPosition
		} = this.movement;

		const currentPosition = this.props.direction === 'row'
			? event.clientX : event.clientY;
		const relativePosition = (currentPosition - minimumPosition)
			/ (maximumPosition - minimumPosition - this.props.splitterSize);

		const beforeRatio = bound(0, availableRatio * relativePosition, availableRatio);
		const afterRatio = availableRatio - beforeRatio;

		this.setState({
			ratios: [
				...this.state.ratios.slice(0, splitterIndex),
				beforeRatio,
				afterRatio,
				...this.state.ratios.slice(splitterIndex + 2)
			]
		});

		event.preventDefault();
	},

	handleMouseUp() {
		Reflect.deleteProperty(this, 'movement');

		window.removeEventListener('mousemove', this.handleMouseMove);
		window.removeEventListener('mouseup', this.handleMouseUp);
	},

	getStyle() {
		return {
			display: 'flex',
			flexDirection: this.props.direction,
			...this.props.style
		};
	},

	getPaneStyle(index) {
		return {
			display: 'flex',
			flexGrow: this.state.ratios[index],
			flexShrink: 1,
			flexBasis: 0,
			overflow: 'scroll',
			...this.props.paneStyle
		};
	},

	getSplitterStyle() {
		return {
			background: '#ccc',
			cursor: this.props.direction === 'row' ? 'ew-resize' : 'ns-resize',
			flexBasis: `${this.props.splitterSize}px`,
			flexGrow: 0,
			flexShrink: 0,
			...this.props.splitterStyle
		};
	},

	render() {
		this.panes = [];
		this.splitters = [];

		return (
			<div ref="container" style={this.getStyle()}>
				{joinWith(this.props.children.map((child, i) => (
					<div
						key={`pane${i}`}
						ref={pane => this.panes[i] = pane}
						style={this.getPaneStyle(i)}
					>
						{child}
					</div>
				)), (prev, next, index) => (
					<div
						key={`splitter${index}`}
						onMouseDown={this.handleMouseDown}
						ref={splitter => this.splitters[index] = splitter}
						style={this.getSplitterStyle()}
					/>
				))}
			</div>
		);
	}

});
