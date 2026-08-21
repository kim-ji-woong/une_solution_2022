import React, { Component } from 'react';
import ProjectResource from '../../Root/resource/id';
import styles from '../css/modal.module.css';
//import SDMSResource from '../../SDMS/resource/id'
import CommonResource from '../resource/id';

export class ConfirmDialog extends Component {
    static keys = [];
    static idxEnter = -1;       // Enter 단축키 인덱스 번호 

    static icon = {
        check: 1,
        warning: 2,
        question: 3,
        plus: 4,
        trash: 5,
        save: 6
    }

	constructor(props) {
        super(props);

        this.refBody = React.createRef();
        this.clickX = 0;
        this.clickY = 0;
        this.moveX = 0;
        this.moveY = 0;
        this.originMoveX = 0;
        this.originMoveY = 0;
    }

    componentDidMount() {
        const body = this.refBody.current;

        if (!body) {
            return;
        }

        // 팝업 마우스 드래그 이벤트 리스너
        this.popupDragMouseMove = (event) => {
            this.moveX = event.clientX - this.clickX + this.originMoveX;
            this.moveY = event.clientY - this.clickY + this.originMoveY;

            body.style.transform = `translate(${this.moveX}px, ${this.moveY}px)`;
        }

        // 단축키 이벤트 리스너
        document.addEventListener("keydown", this.keyFunction, false);
        document.addEventListener("keyup", this.keysReleased, false);
    }

    componentWillUnmount() {
        // 단축키 이벤트 리스너 제거
        document.removeEventListener("keydown", this.keyFunction);
        document.removeEventListener("keyup", this.keysReleased);
    }

    // 팝업 드래그 시작(팝업을 누르고 있을 때)
    popupDragMousePress(event) {
        if (event.button == 0) {
            this.clickX = event.clientX;
            this.clickY = event.clientY;
            
            document.addEventListener('mousemove', this.popupDragMouseMove);
            document.addEventListener('mouseup', this.popupDragMouseUp);
        }
    }

    // 팝업 드래그 종료(mouse up)
    popupDragMouseUp = () => {
        document.removeEventListener('mousemove', this.popupDragMouseMove);
        document.removeEventListener('mouseup', this.popupDragMouseUp);

        this.originMoveX = this.moveX;
        this.originMoveY = this.moveY;
    }

    keyFunction = (e) => this.keysPressed(e, this);

    keysPressed(e, target) {
        // store an entry for every key pressed
        ConfirmDialog.keys[e.keyCode] = true;

        if (ConfirmDialog.keys[27]) {
            // ESC 누를 시 
            target.props.onClose();

            ConfirmDialog.keys[27] = false;
            // prevent default browser behavior
            e.preventDefault();
        } else if (ConfirmDialog.keys[13]) {
            // Enter 누를 시 
            target.props.onClickButton(ConfirmDialog.idxEnter);

            ConfirmDialog.keys[13] = false;
            // prevent default browser behavior
            e.preventDefault();
        }
    }

    keysReleased(e) {
        // mark keys that were released
        ConfirmDialog.keys[e.keyCode] = false;
    }

    getMessageText(message, index, iconType) {
        if (index === 0) {
            return message;
        }

        if (!iconType) {
            return message;
        }
    }

    getMessage() {
        const messages = [];

        this.props.messages.map((message, index) => {
            const iconType = this.getIconType();

            if (index === 0 || !iconType) {
                messages.push(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={iconType}></span>
                        <p className={styles.dangerText} key={"message_" + index}>{message}</p>
                    </div>
                );
            }
            else {
                messages.push(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p className={styles.dangerText + " " + styles.indent} key={"message_" + index}>{message}</p>
                    </div>
                );
            }
        });

        return (
            <main>
                {messages}
            </main>
            );
    }


    getButtons() {
        const buttons = [];
        const btnColor = this.getButtonColor();
        const btnCount = this.props.buttons && this.props.buttons.length > 0 ? this.props.buttons.length : 1;

        if (!this.props.buttons || this.props.buttons.length === 0) {
            //btnColor
            buttons.push(
                <button key={"button_0"} /* className={btnColor} */ onClick={() => this.props.onClose()}></button>
            );
        }
        else {
            this.props.buttons.map((button, index) => {
                const btnClassName = index === btnCount - 1 ? btnColor : styles.confirmCancel;

                if (this.props.onClickButton) {
                    buttons.push(
                        <button key={"button_" + index} className={btnClassName} onClick={() => this.props.onClickButton(index)}>{button}</button>
                    );
                }
                else {
                    buttons.push(
                        <button key={"button_" + index} onClick={this.props.onClose}>{button}</button>
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


    getButtonColor() {
        if (!this.props.title) {
            return styles.confirmAgreeBlue;
        }
        else if (this.props.title === ProjectResource.ID.messageBox.title.error) {
            return styles.confirmAgreeRed;
        }
        else if (this.props.title === ProjectResource.ID.messageBox.title.warning) {
            return styles.confirmAgreeRed;
        }
        if (this.props.title === ProjectResource.ID.messageBox.title.info) {
            return styles.confirmAgreeBlue;
        }
        if (this.props.title === ProjectResource.ID.messageBox.title.confirmCancel) {
            return styles.confirmAgreeRed;
        }

        return styles.confirmAgreeBlue;
    }

    getIconType() {
        const iconType = this.props.icon;

        if (!iconType) {
            return null;
        }

        if (iconType === ConfirmDialog.icon.check) {
            return styles.modalCheckIcon;
        }
        else if (iconType === ConfirmDialog.icon.warning) {
            return styles.modalMarkIcon;
        }
        else if (iconType === ConfirmDialog.icon.question) {
            return styles.modalQuestionIcon;
        }
        else if (iconType === ConfirmDialog.icon.plus) {
            return styles.modalPlusIcon;
        }
        else if (iconType === ConfirmDialog.icon.trash) {
            return styles.modalTrashIcon;
        }
        else if (iconType === ConfirmDialog.icon.save) {
            return styles.modalDiskIcon;
        }

        return null;
    }

    render() {
        if (!this.props.onClose) {
            return <></>
        }

        return (
            <>
                <div ref={this.refBody} className={styles.modalVDSMove + " " + styles.openModalVDS + " " + CommonResource.UISection}>
                    <section>
                        <header onMouseDown={(e) => this.popupDragMousePress(e)}>
                            {/* {this.props.title} */}
                            {/*<button className={styles.close} onClick={this.props.onClose}> &times; </button>*/}
                        </header>
                        {
                            this.getMessage()
                        }
                        {
                            this.getButtons()
                        }
                    </section>
                </div>
            </>
        );
    }
}

export default ConfirmDialog;