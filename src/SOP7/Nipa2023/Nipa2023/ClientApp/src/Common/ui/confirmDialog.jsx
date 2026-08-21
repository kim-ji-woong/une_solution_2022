import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { ConfirmDialogComponent } from '../styled/confirmDialogStyled.js';

export class ConfirmDialog extends Component {
    static keys = [];
    static idxEnter = -1;       // Enter 단축키 인덱스 번호 

    getMessage() {
        const messages = [];

        this.props.messages.map((message, index) => 
            messages.push(<p key={"message_" + index}>{message}</p>
            ));

        return (
            <main>
                <div>{messages}</div>
            </main>
        );
    }

    getButtons() {
        const buttons = [];

        // 비밀번호 변경 완료 후 팝업 close
        if (this.props.onClickClosePopupFindPwd && this.props.type === 'success') {
            buttons.push(
                <button key={"button_0"} className={'close'} onClick={() => this.props.onClickClosePopupFindPwd('changePwd', false)}>확인</button>
            );
        }
        else if (!this.props.buttons || this.props.buttons.length === 0) {
            buttons.push(
                <button key={"button_0"} className={'close'} onClick={this.props.onClose}>확인</button>
            );
        }
        else {
            this.props.buttons.map((button, index) => { 
                if (this.props.onClickButton) {
                    if (button === "초기화") {
                        return buttons.push(
                            <button key={"button_" + index} className={"button_" + index} onClick={() => this.props.onClickClosePopup('manager', false)} title="단축키(Enter)">{button}</button>
                        );
                    } 
                    else if (button === "취소") {
                        return buttons.push(
                            <button key={"button_" + index} className={"button_" + index} onClick={this.props.onClose}>{button}</button>
                        );
                    }
                    else {
                        return buttons.push(
                            <button key={"button_" + index} className={"button_" + index} onClick={() => this.props.onClickButton(index)}>{button}</button>
                        );
                    }
                }
                else {
                    return buttons.push(
                        <button key={"button_" + index} className={'close'} onClick={this.props.onClose}>{button}</button>
                    );
                }
            });
        }

        return (
            <footer>
                {buttons}
            </footer>
            );
    }

    render() {
        if (!this.props.onClose) {
            return <></>
        }

		return (
            // this.props.type
            // -> save, success, remove, error
            <ConfirmDialogComponent className={'modal openModal UI_Section'} type={this.props.type}>
                <section>
                    <header>
                        <button className={'close'} onClick={this.props.onCloseConfirmDialog}> &times; </button>
                    </header>
                    {
                        this.getMessage()
                    }
                    {
                        this.getButtons()
                    }
                </section>
            </ConfirmDialogComponent>
			);
    }
}

export default withRouter(ConfirmDialog);