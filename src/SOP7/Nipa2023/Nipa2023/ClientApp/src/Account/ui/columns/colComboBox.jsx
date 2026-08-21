import React, { Component } from 'react';
import AccountResource from '../../resource/id';

class ColComboBox extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            value: this.props.value,     // 선택된 값
        };

        this.props = props;

        if (this.state.value == null) {
            this.state.value = "";
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.options !== this.props.options) {
            this.setState({ options: this.props.options });
        }
    }

    onChangeMember = (type, value, id) => {

        let isUpdate = true;
        if (this.state.value === value) {
            isUpdate = false;
        }

        this.props.onChangeMember(type, value, id, isUpdate);
    }

    render() {
        let value = this.state.value;

        return (
            <select 
                defaultValue={value}
                onChange={(e) => this.onChangeMember('combo', parseInt(e.target.value), this.props.id)} 
            >
                {/* 마스터는 1명만 존재하므로 옵션에 존재 불가 */}
                {/* <option value="1">{AccountResource.ID.accountLevel.master}</option> */}
                <option value="2">{AccountResource.ID.accountLevel.generalAdmin}</option>
                <option value="3">{AccountResource.ID.accountLevel.admin}</option>
            </select>
        );
    }
}

export default ColComboBox;