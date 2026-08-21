import React, { Component } from 'react';
import AccountResource from '../../Account/resource/id';
import CommonResource from '../../Common/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import Edit from './edit';


class EditEvent extends Component {
    static popupNone = 0;
    static popupConfirmSave = 1;

    constructor(props) {
        super(props);

        this.state = {
            popupType: EditEvent.popupNone
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    onClickReset() {
        if (this.props.isChanged) {
            this.props.onInitialize();
        }

        this.setState({ popupType: EditEvent.popupNone });
    }

    onClickSave() {
        if (this.props.isChanged) {
            this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["저장하시겠습니까?"], ["취소", "확인"], (index) => this.posClickSave(index), ConfirmDialog.icon.save);
            //this.setState({ popupType: EditEvent.popupConfirmSave });
        }
    }

    posClickSave(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.doSave();
        }
    }

    doSave() {
        this.props.onSave();
        this.setState({ popupType: EditEvent.popupNone });
    }

    render() {
        const title = this.props.isRackEdit ? ProjectResource.getRackEditText() : ProjectResource.getITPropertyEditText();
        const resetClassName = this.props.isChanged ? edit.resetBtn + " " + edit.active : edit.resetBtn;
        const saveClassName = this.props.isChanged ? edit.saveBtn + " " + edit.active : edit.saveBtn;

        const isEditable = Edit.isEditableUser(this.props.user);

        return (
            <>
                <div className={edit.rackEventArea + " UI_Section"}>
                    <div className={edit.rackEventBox}>
                       <span className={edit.pinkCircle}></span>
                        <span className={edit.rackEventTitle}>{title}</span>
                    </div>

                    {
                        isEditable &&
                        <div className={edit.rackEventBtn}>
                            <span className={resetClassName} onClick={() => this.onClickReset()}>{ProjectResource.ID.button.initialize}</span>
                            <span className={saveClassName} onClick={() => this.onClickSave()}>{ProjectResource.ID.button.save}</span>
                        </div>
                    }
                </div>

                {/* 저장 팝업창 */}
                {
                    this.state.popupType === EditEvent.popupConfirmSave && isEditable &&
                    <div id={edit.saveEditPop}>
                        <div>
                                <div>
                                <div className={edit.saveEditPop + " " + CommonResource.UISection}>
                                <span className={edit.saveEditCloseIcon}></span>
                                <div className={edit.saveFlex1}>
                                    <span className={edit.fileSaveIcon}></span>
                                            {/*<span className={edit.fileText}>해당 내용을 저장하시겠습니까?</span>*/}
                                            <span className={edit.fileText}>저장하시겠습니까?</span>
                                </div>
                                <div className={edit.saveFlex2}>
                                        <span className={edit.fileCancel} onClick={() => this.onClickReset()}>취소</span>
                                        <span className={edit.fileConfirm} onClick={() => this.doSave()}>확인</span>
                                </div>
                            </div> 
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}
export default EditEvent;