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
			splitterSize: 10
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
		this.activeSplitter = this.splitters.indexOf(event.target);

		window.addEventListener('mousemove', this.handleMouseMove);
		window.addEventListener('mouseup', this.handleMouseUp);
	},

	handleMouseMove(event) {
		const rect = this.refs.container.getBoundingClientRect();
		const totalSize = this.props.direction === 'row' ? rect.width : rect.height;
		const availableSize = totalSize - ((this.props.children.length - 1) * this.props.splitterSize);

		const currentPosition = this.props.direction === 'row'
			? event.clientX - rect.left
			: event.clientY - rect.top;
		const adjustedPosition = currentPosition - (this.activeSplitter + 0.5) * this.props.splitterSize;

		this.setState({
			ratios: [
				...this.state.ratios.slice(0, this.activeSplitter),
				bound(0, adjustedPosition / availableSize, 1),
				bound(0, 1 - adjustedPosition / availableSize, 1),
				...this.state.ratios.slice(this.activeSplitter + 2)
			]
		});

		event.preventDefault();
	},

	handleMouseUp() {
		Reflect.deleteProperty(this, 'activeSplitter');

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
			flex: this.state.ratios[index],
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
