import React, { Component } from 'react';
import CommonResource from '../../Common/resource/id';
import ConfirmDialog from '../../Common/ui/confirmDialog';

import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';


class VDCEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false
        }
    }

    onClickInitiaiize() {
        if (!this.props.isActive) {
            return;
        }

        this.props.onInitialize();
    }

    onClickSave() {
        if (this.props.isActive) {
            this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["해당 내용을 저장하시겠습니까?"], ["취소", "저장", "저장 후 편집기능 바로가기"], (index) => this.postClickSave(index), ConfirmDialog.icon.save);
        }
    }

    postClickSave(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.onSave();
        }
        else if (index === 2) {
            this.onSaveNEdit();
        }
    }

    onCancel() {
        this.setState({ showPopup: false });
    }

    onSave() {
        this.setState({ showPopup: false });
        this.props.onSave(false);
    }

    onSaveNEdit() {
        this.setState({ showPopup: false });
        this.props.onSave(true);
    }

    render() {
        const resetBtnClassName = this.props.isActive ? dash.resetBtn + " " + dash.resetActive : dash.resetBtn;
        const saveBtnClassName = this.props.isActive ? dash.saveBtn + " " + dash.saveActive : dash.saveBtn;

        return (
            <>
                <div className={dash.itEventArea + " " + CommonResource.UISection}>
                    <div className={dash.dcEventBox}>
                        <span className={dash.blueCircle}></span>
                        <span className={dash.dcEventTitle}>{ProjectResource.getNewRegistTitle(this.props.dataCenter)}</span>
                    </div>

                    {/* <div className={dash.vdcEventBtnBox}>
                        <div style={{ display: 'flex', alignItems: 'center' , borderRight: 'dashed 1px #707070', height: '26px' }}>
                            <span className={dash.saveTitle}>저장</span>
                            <span className={dash.saveIcon}></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' , borderRight: 'dashed 1px #707070', height: '26px' }}>
                            <span className={dash.downTitle}>다운로드</span>
                            <span className={dash.downIcon}></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className={dash.upTitle}>업로드</span>
                            <span className={dash.upIcon}></span>
                        </div>
                    </div> */}

                    <div className={dash.dcEventBtn + " " + CommonResource.UISection}>
                        <span className={resetBtnClassName} onClick={() => this.onClickInitiaiize()}>초기화</span>
                        <span className={saveBtnClassName} onClick={() => this.onClickSave()}>저장</span>
                    </div>
                </div>


                {/* 저장 팝업창 */}
                {/*
                    <div id={dash.saveEditPop}>
                        <div>
                            <div>
                                <div className={dash.saveEditPop}>
                                    <span className={dash.saveEditCloseIcon}></span>
                                    <div className={dash.saveFlex1}>
                                        <span className={dash.fileSaveIcon2}></span>
                                        <span className={dash.fileText}>해당 내용을 저장하시겠습니까?</span>
                                    </div>
                                    <div className={dash.saveFlex2}>
                                        <span className={dash.fileCancel}>취소</span>
                                        <span className={dash.fileConfirm}>확인</span>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                */}

                {/* 등록창 */}
                {
                    this.state.showPopup &&
                    <div id={dash.registrationPop}>
                        <div>
                            <div>
                                <div className={dash.regiPop + " " + CommonResource.UISection}>
                                    <span className={dash.regiCloseIcon}></span>
                                    <div className={dash.regiFlex1}>
                                        <span className={dash.regiSaveIcon}></span>
                                        <span className={dash.regiText}>해당 내용을 저장하시겠습니까?</span>
                                    </div>
                                    <div className={dash.regiFlex2}>
                                        <span className={dash.regiCancel} onClick={() => this.onCancel()}>취소</span>
                                        <span className={dash.regiConfirm} onClick={() => this.onSave()}>저장</span>
                                        <span className={dash.regiEdit} onClick={() => this.onSaveNEdit()}>저장 후 편집기능 바로가기</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }
}
export default VDCEvent;