
import React, { Component } from 'react';
import $ from 'jquery';
import uis from '../../../Common/css/ui.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';

import '../../../SOPSimulator/css/message.css';

class ManualInputMessagePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bInputManual: false,
            phoneNumbers: [],
            bIncludeOrg: false,
        }

        this.props = props;
    }

    componentDidMount() {

        $(document).ready(function () {
            var i = 1; 

            //let phoneDiv =
            //    `
            //        <span class="phoneNumInput">
            //            <input type="text" placeholder="핸드폰번호를 입력해주세요" />
            //            <span class="trashIcon" onClick={this.deleteEvent}></span>
            //        </span>
            //    `

            //$('.' + uis.addBlank).click(function () {
            //    $('.' + uis.phoneNumAddBox).append(phoneDiv);
            //       i++;
            //});
        });

        $('.rqAppBtn2').click(function () {
            $('.rqBtn2 > div > ul').toggle();
            $('.' + uis.messageScheckBox).toggle();
        });
    }


    onClickClose = () => {
        this.props.close();
    }

    onProgress = async () => {
        if (this.state.bInputManual) {
            if (this.state.phoneNumbers.length === 0) {
                this.props.showConfirmDialog('알림', '핸드폰번호를 입력하세요', ['확인'], null);
                return;
            }

            await this.props.onProgress(0, this.state.bIncludeOrg, this.state.phoneNumbers);
        }
        else {
            await this.props.onProgress(0);
        }

        this.onClickClose();
    }

    onBlurCheckPhoneNumber = (target, index) => {
        let patternPhone = /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/;

        const phoneValid = patternPhone.test(target.value);
        if (!phoneValid && target.value != "") {
            //alert(target.value + "휴대전화번호 형식이 맞지 않습니다.");
            //this.props.showErrorDialog("에러", [target.value + " 휴대전화번호 형식이 맞지 않습니다."]);

            const phoneNumbers = [...this.state.phoneNumbers];
            phoneNumbers[index] = '';
            this.setState({ phoneNumbers });

            //this.setState({ value: "" });
            //this.props.member.PhoneNumber = '';
            return;
        }

        //this.props.sectionData.phoneNumbers.push(target.value);
    }

    onChangeCheckPhoneNumber = (target, index) => {
        // 휴대전화일 경우 숫자 및 자릿수 제한
        const regex = /^[0-9\b -]{0,13}$/;
        if (regex.test(target.value)) {
            let value = target.value;
            let inputValue = value.replace(/-/g, '');
            inputValue = inputValue.replace(/ /g, '');

            inputValue = value;

            const phoneNumbers = [...this.state.phoneNumbers];
            phoneNumbers[index] = inputValue;
            this.setState({ phoneNumbers });
        }
    }

    onRemovePhoneNumber = (index) => {
        const phoneNumbers = [...this.state.phoneNumbers];
        phoneNumbers.splice(index, 1);
        this.setState({ phoneNumbers });
    }

    onAddPhoneNumber = () => {
        const phoneNumbers = [...this.state.phoneNumbers];
        phoneNumbers.push('');
        this.setState({ phoneNumbers });
    }

    onCheckInputManual = (target) => {
        this.setState({ bInputManual: target.checked });
    }

    onCheckIncludeOrg = (target) => {
        this.setState({ bIncludeOrg: target.checked });
    }

    getPhoneNumbersUI() {
        if (!this.state.bInputManual) {
            return null;
        }

        let ui = [];
        const length = this.state.phoneNumbers.length;
        //if (length === 0) {
        //    ui.push(
        //        <>
        //            <input key={'inputPhoneNumber_' + 0} type="text" placeholder="핸드폰번호를 입력해주세요"
        //                onBlur={(e) => this.onBlurCheckPhoneNumber(e.target, 0)}
        //                onChange={(e) => this.onChangeCheckPhoneNumber(e.target, 0)}
        //            />
        //            <span className="trashIcon" onClick={() => this.onRemovePhoneNumber(0)}></span>
        //        </>
        //    );

        //    return ui;
        //}
        for (let i = 0; i < length; i++) {
            ui.push(
                <span className="phoneNumInput">
                    <input key={'inputPhoneNumber_' + i} type="text" placeholder="핸드폰번호를 입력해주세요"
                        value={this.state.phoneNumbers[i]}
                        onBlur={(e) => this.onBlurCheckPhoneNumber(e.target, i)}
                        onChange={(e) => this.onChangeCheckPhoneNumber(e.target, i)}
                    />
                    <span className="trashIcon" onClick={() => this.onRemovePhoneNumber(i)}></span>
                </span>
            );
        }

        return ui;
    }
    
    render() {
        const getPhoneNumbersUI = this.getPhoneNumbersUI();
        return (
            <>
               <div className={uis.messageBox + " rqBtn2"}>
                 <div className={uis.messageFlex}>
                        <span className={uis.closeBtn} onClick={this.props.onClose} ></span>
                    <span className={uis.messageIcon}></span>
                    <div className={uis.messageTextFlex}>
                        <span className={uis.messageQuestion}>{this.props.message}</span>
                            <span className={uis.messageCheckbox}>
                                <input type="checkBox" checked={this.state.bInputManual} onClick={(e) => this.onCheckInputManual(e.target)} className="rqAppBtn2" />
                                <p>수동입력</p>
                            </span>
                        <span className={uis.messageSmalltext}>* 수동입력 선택 시 수동으로 입력한 연락처로만 상황전파가 됩니다.</span>
                    </div>
                  </div>

                  <div>
                    <ul className={uis.phoneNumBox} style={{ display: 'none' }}>
                      <div className={uis.phoneNumAddBox + " " + uis.scrollbar}>                          
                            {getPhoneNumbersUI}
                      </div>
                            <span className={uis.messagePlus + " " + uis.addBlank} onClick={this.onAddPhoneNumber}></span>
                    </ul>
                 </div>

                 <div className={uis.messageBtnArea}>
                   <span>
                            <span className={uis.messageScheckBox} style={{ display: 'none' }}>
                                <input type="checkBox" checked={this.state.bIncludeOrg} onClick={(e) => this.onCheckIncludeOrg(e.target)} /><p>기존 전파대상자 포함 발송</p>
                     </span>
                        </span>
                        <span onClick={this.onProgress}> 상황전파</span>
                        <span onClick={this.props.onClose}>취소</span>
                </div>
              </div>
            </>
        );
    }
}

export default ManualInputMessagePopup;