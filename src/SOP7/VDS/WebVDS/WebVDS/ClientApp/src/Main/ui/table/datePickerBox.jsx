import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/esm/locale';
import main from '../../../Main/css/main.module.css';


class DatePickerBox extends Component {
    static Type = {
        YesNo: "yesno",
    }

    constructor(props) {
        super(props);

        this.state = {
            value: "",          // 표시하는 데이터
        }

        this.props = props;

        if (this.props.value) {
            this.state.value = new Date(this.props.value);
        }

    }

    onChangeData = (data) => {
        let value = data;

        if (this.state.value === value) {
            return;
        }

        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        if (this.props.editMode) {
            return (
                <div className={main.datepicker}>
                    <DatePicker
                        dateFormat="yyyy-MM-dd"
                        selected={this.state.value}
                        onChange={(value) => this.onChangeData(value)}
                        locale={ko}
                    />
                </div>
            );
        }

        return (
            <div className={main.datepicker}>
                <DatePicker
                    dateFormat="yyyy-MM-dd"
                    selected={this.state.value}
                    onChange={(value) => this.onChangeData(value)}
                    locale={ko}
                    readOnly
                />
            </div>
        );
    }
}
export default DatePickerBox;