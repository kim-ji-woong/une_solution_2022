import React from 'react';
import ProjectResource from '../../Root/resource/id';

import { ConfirmDialogComponent } from '../styled/confirmDialogStyled';
import close_btn from '../images/close_btn_bk.png';

export default function ConfirmDialog({ type, messages, buttons, onClickButton, onCloseConfirmDialog /* 오작동 처리 전용 콜백 */ }) {

    /*
    * 1. type
    * -> ERROR, WARNING, SUCCESS, INFO, QUESTION
    *
    * 2. 버튼 규칙
    * -> 확인 버튼은 항상 우측에 위치함.
    * -> 전달된 함수가 있다면 index에 따라 구분할 것.
    */

    let dialogColor = '#757575';
    if (type === ProjectResource.dialogTypes.ERROR) {
        dialogColor = '#D32F2F';
    } else if (type === ProjectResource.dialogTypes.WARNING) {
        dialogColor = '#F9A825';
    } else if (type === ProjectResource.dialogTypes.SUCCESS) {
        dialogColor = '#4CAF50';
    } else if (type === ProjectResource.dialogTypes.INFO || 
                type === ProjectResource.dialogTypes.QUESTION ||
                type === ProjectResource.dialogTypes.MALFUNCTION) {
        dialogColor = '#0091EA';
    }
    
    const [isMalfunction, setIsMalfunction] = React.useState(false);

    const getMessage = () => {
        const confirmMessages = [];

        messages.map((message, index) => 
            confirmMessages.push(<p key={"message_" + index}>{message}</p>
        ));

        return (
            <main>
                <div>{confirmMessages}</div>
            </main>
        );
    }
    
    const onChangeMalfunction = (e) => {
        setIsMalfunction(e.target.checked);
    }
    
    const handleCloseAlarm = () => {
        onClickButton(null, isMalfunction);
    }

    const getButtons = () => {
        const confirmButtons = [];

        if (type === ProjectResource.dialogTypes.MALFUNCTION) {
            confirmButtons.push(
                <div key='checkbox'>
                    <input type='checkbox' id='malfunctionCheck' onChange={(e) => onChangeMalfunction(e)}/>
                    <label htmlFor='malfunctionCheck'>오작동 처리하기</label>
                </div>
            );

            confirmButtons.push(
                <button key={"button_0"} className={'confirmClose'} onClick={() => handleCloseAlarm(null, isMalfunction)}>확인</button>
            );
        }
        else if (!buttons || buttons.length === 0) {
            confirmButtons.push(
                <button key={"button_0"} className={'confirmClose'} onClick={onCloseConfirmDialog}>확인</button>
            );
        }
        else {
            buttons.map((button, index) => {
                if (onClickButton) {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={() => onClickButton(index)}>{button}</button>
                    );
                }
                else {
                    confirmButtons.push(
                        <button key={"button_" + index} className={'confirmClose'} onClick={onCloseConfirmDialog}>{button}</button>
                    );
                }
            });
        }

        return (
            <footer>
                {confirmButtons}
            </footer>
        );
    }
    
    return (
        <ConfirmDialogComponent className={"UI_Fix"} $dialogType={type} $dialogColor={dialogColor}>
            <section className='body'>
                {
                    getMessage()
                }
                {
                    getButtons()
                }
                <button className='closeBtn' onClick={onCloseConfirmDialog}>
                    <img src={close_btn} alt='닫기버튼' />
                </button>
            </section>
        </ConfirmDialogComponent>
    );
}
