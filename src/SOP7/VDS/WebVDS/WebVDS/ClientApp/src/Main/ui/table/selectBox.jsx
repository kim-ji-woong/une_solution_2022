import React, { Component } from 'react';

import main from '../../../Main/css/main.module.css';


class SelectBox extends Component {
    static Type = {
        YesNo: "yesno",
    }

    constructor(props) {
        super(props);

        this.state = {
            value: null,          // 표시하는 데이터
            type: SelectBox.Type.YesNo,
        }

        this.props = props;

        if (this.props.value !== undefined) {
            this.state.value = this.props.value;
        }
        if (this.props.type)
            this.state.type = this.props.type;
    }

    onChangeData = (target) => {
        let value = target.value;

        if (value === "true")
            value = true;
        else if (value === "false")
            value = false;
        else
            value = null;

        if (this.state.value === value) {
            return;
        }

        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        if (this.props.editMode) {
            return (
                <p id="tableText">
                    <select className={main.inventSelectBox} onChange={(e) => this.onChangeData(e.target)} value={this.state.value}>
                        <option value="" >-</option>
                        <option value={true} >예</option>
                        <option value={false} >아니오</option>
                    </select>
                </p>
            );
        }

        return (
            <p id="tableText">
                <select className={main.inventSelectBox} onChange={(e) => this.onChangeData(e.target)} value={this.state.value} disabled>
                    <option value="" >-</option>
                    <option value={true} >예</option>
                    <option value={false} >아니오</option>
                </select>
            </p>
        );
    }
}
export default SelectBox;