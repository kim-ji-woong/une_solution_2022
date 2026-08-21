import React, { Component } from 'react';
import CommonResource from '../../Common/resource/id';

import dash from '../../Dashboard/css/dash.module.css';
import EditController from '../../PropertyEdit/services/editController';
import ProjectResource from '../../Root/resource/id';


class ITUploadBox extends Component {
    async onClickDownloadRack() {
        const [result, errorMessage] = await EditController.requestDownloadRack(this.props.dataCenter.id);

        if (!result) {
            if (errorMessage && errorMessage.length > 0) {
                this.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
            }
        }
    }

    render() {
        return (
            <>
                <div className={dash.rackUploadArea + " " + CommonResource.UISection}>
                    {/* <div className={dash.rackUploadBox}>
                        <span className={dash.rackUploadTitle}>IT자산</span>
                        <span className={dash.downLoadTextBox}>
                            <p className={dash.downLoadText}>다운로드</p>
                            <span className={dash.downLoadIcon}></span>
                        </span>
                        <span className={dash.upLoadTextBox}>
                            <p className={dash.upLoadText}>업로드</p>
                            <span className={dash.upLoadIcon}></span>
                        </span>
                    </div>
                    <div className={dash.rackUploadBox}>
                        <span className={dash.rackUploadTitle}>IT자산 상세정보</span>
                        <span className={dash.downLoadTextBox}>
                            <p className={dash.downLoadText}>다운로드</p>
                            <span className={dash.downLoadIcon}></span>
                        </span>
                        <span className={dash.upLoadTextBox}>
                            <p className={dash.upLoadText}>업로드</p>
                            <span className={dash.upLoadIcon}></span>
                        </span>
                    </div> */}
                    <div className={dash.rackUploadBox}>
                        <span className={dash.rackUploadTitle}>랙 실장도</span>
                        <span className={dash.downLoadTextBox}>
                            <p className={dash.downLoadText}>다운로드</p>
                            <span className={dash.downLoadIcon} onClick={() => this.onClickDownloadRack()}></span>
                        </span>
                    </div>
                </div>
            </>
        );
    }
}
export default ITUploadBox;