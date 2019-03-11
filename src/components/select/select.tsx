import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { SelectValue, SelectProps } from './interface';
import classnames from 'classnames';
import Option from './option';
import './style/index.less';

export default class Select<T = SelectValue> extends Component<SelectProps<T>, any> {
	state = {
		selected: false,
	};
	static Option: typeof Option;
	public dropdownContainer: HTMLDivElement;

	handleSelected = e => {
		this.setState({
			selected: !this.state.selected,
		});
		this.renderSelectMenu();
	};
	renderOption = (left: number, top: number, width: number) => {
		let { children } = this.props;
		let { selected } = this.state;
		console.log(selected);
		return (
			<div className="curtain" onClick={this.handleCloseSelect}>
				<div
					className={classnames('biz-select-dropdown')}
					style={{ width: width, top: top, left: left, opacity: selected ? 0 : 1 }}
				>
					{children}
				</div>
			</div>
		);
	};
	renderSelectMenu = () => {
		if (!this.dropdownContainer) {
			this.dropdownContainer = document.createElement('div');
		}

		let dom: any = ReactDOM.findDOMNode(this);
		let { left, top, width, height } = dom.getBoundingClientRect();

		document.body.appendChild(this.dropdownContainer);
		ReactDOM.render(this.renderOption(left, top + height + 3, width), this.dropdownContainer);
	};
	handleCloseSelect = () => {
		this.setState({
			selected: !this.state.selected,
		});
		this.renderSelectMenu();
	};
	render() {
		let { className, children } = this.props;
		let { selected } = this.state;
		return (
			<div className={classnames('biz-select', className)} ref="bizSelect">
				<div
					className={classnames('biz-select-selection', { 'biz-selected': selected })}
					onClick={this.handleSelected.bind(this, event)}
				>
					<div className="biz-select-selection_rendered">
						<div className={classnames('biz-select-selection-selected-value')}>
							李佳阳
						</div>
						<span unselectable="on" className="biz-select-arrow">
							<i className="biz-select-arrow-icon" />
						</span>
					</div>
				</div>
			</div>
		);
	}
}
Select.Option = Option;
