import React, { Component } from 'react';
import Commands from "../../services/commands";
import $ from 'jquery';
import styles from '../../../Common/css/style.module.css';
import teamEditors from '../../css/teamEditor.module.css';
import TeamEditorResource from '../../resource/id';

class ColText extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            value: this.props.value,
            columnName: this.props.columnName,
        };

        this.isFristFocus = true;
        this.props = props;
    }

    componentDidMount() {
        //let colID = this.state.columnName + this.props.member.ID;
        const form = document.getElementById('td_' + this.props.colID);
        form.addEventListener('focusout', (event) => {

            const txt = document.getElementById('input_' + this.props.colID);
            if (txt !== null) {
                this.onBlurCheck(txt);
            }            
        });
    }

    onChangeEditMode = (isEditMode) => {
        this.props.onChangeMemberEditMode(this.props.member, this.state.columnName, isEditMode);
    }

    //정규식
    onBlurCheck = (e) => {
        if (this.isFristFocus) {
            return;
        }

        let target = e;
        let isUpdate = true;

        if (this.state.columnName === TeamEditorResource.ID.colTextMode.phoneNumber) {
            let patternPhone = /01[016789][^0][0-9]{2,3}[0-9]{3,4}/;
            // let patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;

            const phoneValid = patternPhone.test(target.value);
            if (!phoneValid && target.value != "") {
                this.props.showErrorDialog([target.value + " 휴대전화번호 형식이 맞지 않습니다."], null, null, 'error');
                this.setState({ value: "" });
                this.props.member.PhoneNumber = '';
                return;
            }

            // 중복 검사
            if (target.value !== '') {
                this.props.checkPhoneNumber(this.props.member.ID, target.value, target);
            }

            this.props.member.PhoneNumber = target.value;
            // this.props.member.PhoneNumber = target.value.replace(/[^0-9]/g, ''); // 숫자를 제외한 모든 문자 제거
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber) {
            let patternOffice = /02|0[3-9]{1}[0-9]{1}[0-9]{3,4}[0-9]{4}/;
            // let patternOffice = /02|0[3-9]{1}[0-9]{1}-[0-9]{3,4}-[0-9]{4}/;

            const officeValid = patternOffice.test(target.value);
            if (!officeValid && target.value != "") {
                this.props.showErrorDialog([target.value + " 전화번호 형식이 맞지 않습니다."], null, null, 'error');
                this.setState({ value: "" });
                this.props.member.OfficePhoneNumber = '';
                return;
            }

            this.props.member.OfficePhoneNumber = target.value;
            // this.props.member.OfficePhoneNumber = target.value.replace(/[^0-9]/g, ''); // 숫자를 제외한 모든 문자 제거

        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.email) {
            let patternEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

            const emailValid = patternEmail.test(target.value);
            if (target.value != "" && !emailValid) {
                //alert(target.value + "이메일 형식이 맞지 않습니다.");
                this.props.showErrorDialog([target.value + " 이메일 형식이 맞지 않습니다."], null, null, 'error');
                this.setState({ value: "" });
                this.props.member.Email = '';
                return;
            }

            // 중복 검사
            if (target.value !== '') {
                this.props.checkEmail(this.props.member.ID, target.value, target);
            }

            this.props.member.Email = target.value;
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.memberID) {

            // 중복 검사
            if (target.value !== '') {
                this.props.checkMemberID(this.props.member.ID, target.value, target);
            }

            this.props.member.MemberID = target.value;
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.memberName) {
            this.props.member.MemberName = target.value;
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.role) {
            this.props.member.role = target.value;
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
            this.props.member.displaySOPName = target.value;
        }
        else {
            return;
        }

        if (this.props.value === target.value) {
            isUpdate = false;
        }

        // console.log("props.value: " + this.props.value + ", target.value: " + target.value + ", state.value: " + this.state.value);
        // console.log(this.props.member);
        this.props.onChangeMember(this.props.member, isUpdate);
    }

    onChangeCheck = (e) => {
        this.isFristFocus = false;

        let target = e;
        if (this.state.value === target.value) {
            return;
        }

        if (this.state.columnName === TeamEditorResource.ID.colTextMode.phoneNumber ||
            this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber) {
            // 휴대전화일 경우 숫자 및 자릿수 제한
            const regex = /^[0-9\b -]{0,13}$/;
            if (regex.test(target.value)) {
                let value = target.value;
                let inputValue = value.replace(/-/g, '');
                inputValue = inputValue.replace(/ /g, '');

                // if (inputValue.length === 4) {
                //     // 지역번호 02 경우
                //     if (this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber &&
                //         inputValue.indexOf('02') === 0) {
                //         inputValue = inputValue.replace(/(\d{2})(\d{2})/, '$1-$2');
                //     } else {
                //         inputValue = inputValue.replace(/(\d{3})(\d{1})/, '$1-$2');
                //     }
                // } else if (inputValue.length === 8) {
                //     if (this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber &&
                //         inputValue.indexOf('02') === 0) {
                //         // 지역번호 02 경우
                //         inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1-$2-$3');
                //     } else 
                //         inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{1})/, '$1-$2-$3');
                // } else if (inputValue.length === 9) {
                //     if (this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber &&
                //         inputValue.indexOf('02') === 0) {
                //         // 지역번호 02 경우
                //         inputValue = inputValue.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
                //     } 
                // } else if (inputValue.length === 10) {
                //     if (this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber &&
                //         inputValue.indexOf('02') === 0) {
                //         // 지역번호 02 경우
                //         inputValue = inputValue.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
                //     } else
                //         inputValue = inputValue.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
                // } else if (inputValue.length === 11 &&
                //     !(this.state.columnName === TeamEditorResource.ID.colTextMode.officePhoneNumber && inputValue.indexOf('02') === 0)) {
                //     inputValue = inputValue.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
                // } else {
                //     inputValue = value;
                // }

                this.setState({ value: inputValue });
            }
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.memberName) {
            let value = target.value;
            const stateValue = this.state.value;

            // 한글, 영문만 허용
            const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|]+$/;
            const chk = reg.test(value);

            let inputValue = stateValue;

            if (value === "" || chk)
                inputValue = value;

            this.setState({ value: inputValue });
        }
        else if (this.state.columnName === TeamEditorResource.ID.colTextMode.memberID ||
            this.state.columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
            let value = target.value;
            const stateValue = this.state.value;

            // <,>,",',&,/ 특수문자 제외
            const reg = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9~!@#$%^*()_|+\-=?;:,.\{\}\[\]\\]*$/;
            const chk = reg.test(value);

            let inputValue = stateValue;

            if (value === "" || chk)
                inputValue = value;

            this.setState({ value: inputValue });
        }
        else {
            this.setState({ value: target.value });
        } 

       return;
    }

    handleKeyPress = (e) => {
        this.isFristFocus = false;
        if (e.key === "Enter") {
            //this.onBlurCheck(e.target);  componentDidMount에 선언된 onBlurCheck하고 중복되어 이중으로 호출되어 주석처리 
            e.target.blur();
        }
        else if (e.key === 'Escape') {
            this.setState({ value: this.props.value });
            this.onChangeEditMode(false);
        }
    }

    render() {
        //let colID = this.state.columnName + this.props.member.ID;
        let value = this.state.value;
        let placeholder = '';
        if (this.state.columnName === TeamEditorResource.ID.colTextMode.memberName ||
            this.state.columnName === TeamEditorResource.ID.colTextMode.displaySOPName) {
            if (value === '새 인원') {
                value = '';
                placeholder = '새 인원';
            }
        }

        return (
            this.props.isEditMode && this.state.columnName === this.props.editColumnName ?
                <td id={'td_' + this.props.colID}>
                    <input
                        type="text"
                        id={'input_' + this.props.colID}
                        autoFocus={true}
                        onChange={(e) => this.onChangeCheck(e.target)}
                        //onBlur={(e) => this.onBlurCheck(e.target)} componentDidMount에 선언된 onBlurCheck하고 중복되어 이중으로 호출되어 주석처리 
                        onKeyPress={this.handleKeyPress}
                        value={value || ''}
                        placeholder={placeholder}                        
                    />
                </td >
                :
                <td id={'td_' + this.props.colID} onMouseDown={() => this.onChangeEditMode(true)}>
                    <span className={styles.fixation + " " + teamEditors.colTextSpan}>{this.state.value}</span>
                </td>
            );
    }
}

export default ColText;