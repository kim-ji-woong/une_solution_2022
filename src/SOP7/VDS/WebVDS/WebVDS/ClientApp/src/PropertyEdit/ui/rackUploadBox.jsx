import React, { Component } from 'react';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import EditController from '../services/editController';

import ExcelDownload from '../../Main/services/excelDownload';
import AccountResource from '../../Account/resource/id';
import Edit from './edit';
import ConfirmDialog from '../../Common/ui/confirmDialog';


class RackUploadBox extends Component {
    constructor(props) {
        super(props);

        this.refUploadITProperty = React.createRef();
    }

    async onClickDownloadITProperty() {
        const [result, errorMessage] = await EditController.requestDownloadITProperty(this.props.dataCenter.id);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    async onClickDownloadRack() {
        const [result, errorMessage] = await EditController.requestDownloadRack(this.props.dataCenter.id);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    async onSelectITPropertyFile(e) {
        const file = e.target.files[0];
        this.refUploadITProperty.current.value = "";

        const type = /(.*?)\.(xls|xlsx)$/;

        if (!file.name.match(type)) {
            this.props.alertMessage("엑셀 파일(xls, xlsx)만 업로드 가능합니다.", ProjectResource.ID.messageBox.title.error);
            return;
        } else if (file.size > 10485760) {
            this.props.alertMessage("최대 10MB 엑셀 파일을 업로드 할 수 있습니다.", ProjectResource.ID.messageBox.title.error);
            return;
        }

        this.props.onLoading(true);

        const [result, errorMessage] = await EditController.requestUploadITProperty(file, this.props.dataCenter.id);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
        else {
            this.props.reloadDatas("IT자산 정보가 업데이트 되었습니다.");
        }

        this.props.onLoading(false);
    }

    onSelectUpload(index) {
        this.props.onCloseConfirmDialog();

        if (index === 1) {
            this.refUploadITProperty.current.click();
        }
    }

    onClickUploadITProperty() {
        this.props.showConfirmDialog(ProjectResource.ID.messageBox.title.confirm, ["업로드한 파일로 데이터가 업데이트 되며, 기존 데이터는 모두 삭제됩니다.", "계속 진행할까요?"], ["취소", "확인"], (index) => this.onSelectUpload(index));
    }

    onClickDownloadItemDetails = async () => {
        // 해당 데이터 센터 정보 불러오기
        const [result, errorMessage] = await EditController.requestItemDetails(this.props.dataCenter.id);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
                return;
            }
        }

        ExcelDownload.downloadItemDetailFile(result);
    }

    getITPropertyDetailUploadElements(user) {
        if (Edit.isEditableUser(user) === false) {
            return (
                <></>
                );
        }

        return (
            <span className={edit.upLoadTextBox}>
                <p className={edit.upLoadText}>업로드</p>
                <span className={edit.upLoadIcon} onClick={() => this.props.gotoInventoryManagement()}></span>
            </span>
            );
    }

    getITEquipmentUploadElements(user) {
        if (Edit.isEditableUser(user) === false) {
            return (
                <></>
            );
        }

        return (
            <span className={edit.upLoadTextBox}>
                <p className={edit.upLoadText}>업로드</p>
                <span className={edit.upLoadIcon} onClick={() => this.onClickUploadITProperty()}></span>
                <input ref={this.refUploadITProperty} type="file" style={{ display: "none" }} onChange={(e) => this.onSelectITPropertyFile(e)} />
            </span>
        );
    }

    render() {
        const user = ProjectResource.getUserInfo();

        return (
            <>
                <div className={edit.rackUploadArea}>
                    <div className={edit.rackUploadBox}>
                        <span className={edit.rackUploadTitle}>IT장비</span>
                        <span className={edit.downLoadTextBox}>
                            <p className={edit.downLoadText}>다운로드</p>
                            <span className={edit.downLoadIcon} onClick={() => this.onClickDownloadITProperty()}></span>
                        </span>
                        {
                            this.getITEquipmentUploadElements(user)
                        }
                    </div>
                    <div className={edit.rackUploadBox}>
                        <span className={edit.rackUploadTitle}>IT장비 정보</span>
                        <span className={edit.downLoadTextBox}>
                            <p className={edit.downLoadText}>다운로드</p>
                            <span className={edit.downLoadIcon} onClick={() => this.onClickDownloadItemDetails()}></span>
                        </span>
                        {
                            this.getITPropertyDetailUploadElements(user)
                        }
                    </div>
                    <div className={edit.rackUploadBox}>
                        <span className={edit.rackUploadTitle}>랙 실장도</span>
                        <span className={edit.downLoadTextBox}>
                            <p className={edit.downLoadText}>다운로드</p>
                            <span className={edit.downLoadIcon} onClick={() => this.onClickDownloadRack()}></span>
                        </span>
                    </div>
                </div>

                {/* it자산 업로드 popup */}
                {/* <div id={edit.ITpropertyPop2}>
                    <div>
                        <div>
                            <div className={edit.itUploadBox}>
                            <div style={{ display: 'flex' }}>
                               <span className={edit.itUploadTitle}>인벤토리 정보 업로드</span>
                               <span className={edit.itUploadClose}></span>
                            </div>
                            <div className={edit.rackitUploadBox}>
                                <span className={edit.squareBox}>
                                    <span className={edit.fileUpload}></span>
                                </span>
                            </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </>
        )
    }

}
export default RackUploadBox;