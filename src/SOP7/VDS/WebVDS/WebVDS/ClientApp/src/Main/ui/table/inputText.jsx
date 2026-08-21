import React, { Component } from 'react';

import main from '../../../Main/css/main.module.css';


class InputText extends Component {
    static Type = {
        Text: "text",
        Number: "number",
        NullNumber: "nullNumber"
    }

    constructor(props) {
        super(props);

        this.backup = "";       // 원본 데이터

        this.state = {
            prevProps: props,
            value: this.getDefaultValue(), // 표시하는 데이터
            type: this.getDefaultType()
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        return {
            prevProps: props,
            value: InputText._getDefaultValue(props),
            type: state.type
        };
    }

    getDefaultValue() {
        if (this.props.value !== null && this.props.value !== undefined) {
            this.backup = this.props.value;
            return this.props.value;
        }

        return "";
    }

    static _getDefaultValue(props) {
        if (props.value !== null && props.value !== undefined) {
            return props.value;
        }

        return "";
    }

    getDefaultType() {
        if (this.props.type !== null && this.props.type !== undefined) {
            return this.props.type;
        }

        return InputText.Type.Text;
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            this.backup = this.state.value;
            e.target.blur();
        } else if (e.key === 'Escape') {
            this.state.value = this.backup;
            this.setState({ value: this.backup })
            e.target.blur();
        }
    }

    onChangeCheck = (target) => {
        if (this.state.value === target.value) {
            return;
        }

        let value = target.value;

        if (this.state.type === InputText.Type.Number) {
            // 숫자 제한
            if (isNaN(Number(target.value))) {
                return;
            }
            /*const regex = /^[0-9]+$/;
            if (!regex.test(target.value))
                return;*/
        }
        else if (this.state.type === InputText.Type.NullNumber) {
            if (value === null || value === undefined || value.trim.length === 0) {
                this.setState({ value: null });
            }
            else {
                if (isNaN(Number(target.value))) {
                    return;
                }
                /*const regex = /^[0-9]+$/;
                if (!regex.test(target.value))
                    return;*/
            }
        }

        this.setState({ value });
    }

    onBlur = (target) => {
        const value = this.state.value;
        const type = this.state.type;
        let data = value;


        if (type === InputText.Type.Number) {
            data = Number(data);
            if (data === NaN)
                data = null;
        }

        this.props.onChange(data);
    }

    render() {
        if (this.props.editMode) {
            return (
                <>
                    <input
                        type="text"
                        value={this.state.value}
                        onKeyDown={this.handleKeyDown}
                        onChange={(e) => this.onChangeCheck(e.target)}
                        onBlur={(e) => this.onBlur(e.target)}
                    />
                </>
            );
        }

        return (
            <>
                <input
                    type="text"
                    value={this.state.value}
                    onKeyDown={this.handleKeyDown}
                    onChange={(e) => this.onChangeCheck(e.target)}
                    onBlur={(e) => this.onBlur(e.target)}
                    readOnly
                />
            </>
        );
    }
}
export default InputText;