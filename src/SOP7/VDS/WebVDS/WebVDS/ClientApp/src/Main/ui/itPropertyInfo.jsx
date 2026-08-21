import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import '../../Main/css/main.css';
import PopupDraggable from './popupDraggable';
import ProjectResource from '../../Root/resource/id';
import ITPropertyInfoDetail from './itPropertyInfoDetail';
import ITVentRackInfo from './inventRackInfo';
import Main from './main';

class ITPropertyInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDetail: false,
            popupMinWidth: 320,
            popupMinHeight: 467
        }
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }


    static getItemSize(item) {
        if (item.itemType?.height && item.itemType?.width && item.itemType?.depth) {
            const height = Math.round(item.itemType.height / 10);
            const width = Math.round(item.itemType.width / 10);
            const depth = Math.round(item.itemType.depth / 10);

            return height + "*" + width + "*" + depth + "(cm)";
        }

        return "";
    }

    static getText(text) {
        if (!text) {
            return "";
        }

        return text;
    }

    toggleDetail() {
        this.props.setVisiblePopups(Main.popupLayer.itPropertyInfoDetail, !this.props.detailVisible);
    }

    onClose() {
        this.props.setVisiblePopups(this.props.popupType, false);
    }

    getItemData(data) {
        if (!data) {
            return "-";
        }

        return data;
    }

    getBoxItems(box) {
        if (box) {
            return (
                <div className={main.inventInfoContentBox}>
                    <div className={main.hostName}><span>Box 명</span><span>:</span><span>{this.getItemData(box.basic_Name)}</span></div>
                    <div className={main.hostName}><span>Box 등급</span><span>:</span><span>{this.getItemData(box.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>Box 제조사</span><span>:</span><span>{this.getItemData(box.basic_Company)}</span></div>
                    <div className={main.hostName}><span>Box 모델명</span><span>:</span><span>{this.getItemData(box.basic_ModelName)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(box.basic_Status)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(box.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(box.cpU_ModelName)}</span></div>
                    <div className={main.hostName}><span>Clock Speed</span><span>:</span><span>{this.getItemData(box.cpU_ClockSpeed)}</span></div>
                    <div className={main.hostName}><span>총 Core 수</span><span>:</span><span>{this.getItemData(box.cpU_TotalCoreCount)}</span></div>
                    <div className={main.hostName}><span>총 Memory 용량</span><span>:</span><span>{this.getItemData(box.mem_TotalMemoryVolume)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentBox}>
                <div className={main.hostName}><span>Box 명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Box 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Box 제조사</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Box 모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Clock Speed</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>총 Core 수</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>총 Memory 용량</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getBackupItems(backup) {
        if (backup) {
            return (
                <div className={main.inventInfoContentBackup}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(backup.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(backup.basic_Status)}</span></div>
                    <div className={main.hostName}><span>백업 등급</span><span>:</span><span>{this.getItemData(backup.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(backup.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(backup.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(backup.hW_Company)}</span></div>
                    <div className={main.hostName}><span>Usable 용량(GB)</span><span>:</span><span>{this.getItemData(backup.hW_UsableVolumeGB)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentBackup}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>백업 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Usable 용량(GB)</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getEtcItems(etc) {
        if (etc) {
            return (
                <div className={main.inventInfoContentEtc}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(etc.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(etc.basic_Status)}</span></div>
                    <div className={main.hostName}><span>기타 장비 상세분류</span><span>:</span><span>{this.getItemData(etc.basic_EquipDetailClass)}</span></div>
                    <div className={main.hostName}><span>기타 등급</span><span>:</span><span>{this.getItemData(etc.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(etc.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(etc.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(etc.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentEtc}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>기타 장비 상세분류</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>기타 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getNetworkItems(network) {
        if (network) {
            return (
                <div className={main.inventInfoContentNetwork}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(network.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(network.basic_Status)}</span></div>
                    <div className={main.hostName}><span>네트워크 장비 상세분류</span><span>:</span><span>{this.getItemData(network.basic_EquipDetailClass)}</span></div>
                    <div className={main.hostName}><span>네트워크 운영 등급</span><span>:</span><span>{this.getItemData(network.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(network.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(network.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(network.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentNetwork}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>네트워크 장비 상세분류</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>네트워크 운영 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getSanSwitchItems(_switch) {
        if (_switch) {
            return (
                <div className={main.inventInfoContentSwitch}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(_switch.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(_switch.basic_Status)}</span></div>
                    <div className={main.hostName}><span>SAN 스위치 등급</span><span>:</span><span>{this.getItemData(_switch.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(_switch.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(_switch.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(_switch.hW_Company)}</span></div>
                    <div className={main.hostName}><span>FC 포트 개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch.hW_FCPortCount)}</span></div>
                    <div className={main.hostName}><span>FC 포트 사용개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch.hW_FCPortUseCount)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentSwitch}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>SAN 스위치 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>FC 포트 개수(최대포트수)</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>FC 포트 사용개수(최대포트수)</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getSecurityItems(security) {
        if (security) {
            return (
                <div className={main.inventInfoContentSecurity}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(security.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(security.basic_Status)}</span></div>
                    <div className={main.hostName}><span>보안 등급</span><span>:</span><span>{this.getItemData(security.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(security.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(security.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(security.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentSecurity}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>보안 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getStorageItems(storage) {
        if (storage) {
            return (
                <div className={main.inventInfoContentStorage}>
                    <div className={main.hostName}><span>장비명</span><span>:</span><span>{this.getItemData(storage.basic_Name)}</span></div>
                    <div className={main.hostName}><span>상태</span><span>:</span><span>{this.getItemData(storage.basic_Status)}</span></div>
                    <div className={main.hostName}><span>Storage 등급</span><span>:</span><span>{this.getItemData(storage.basic_ItemLevel)}</span></div>
                    <div className={main.hostName}><span>용도</span><span>:</span><span>{this.getItemData(storage.basic_Usage)}</span></div>
                    <div className={main.hostName}><span>모델명</span><span>:</span><span>{this.getItemData(storage.hW_ModelName)}</span></div>
                    <div className={main.hostName}><span>제조사</span><span>:</span><span>{this.getItemData(storage.hW_Company)}</span></div>
                    <div className={main.hostName}><span>Disk 종류</span><span>:</span><span>{this.getItemData(storage.hW_DiskType)}</span></div>
                    <div className={main.hostName}><span>Total Usable 용량</span><span>:</span><span>{this.getItemData(storage.hW_TotalUsableVolume)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentStorage}>
                <div className={main.hostName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Storage 등급</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Disk 종류</span><span>:</span><span>-</span></div>
                <div className={main.hostName}><span>Total Usable 용량</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getItemTypeName(item) {
        if (item.itemType?.equipmentTypeData?.engName) {
            return item.itemType.equipmentTypeData.engName.toLowerCase();
        }

        return "";
    }

    render() {
        const item = this.props.selected.item;

        if (!item) {
            return <></>
        }

        const itemTypeName = this.getItemTypeName(item);
        const circleClassName = item.status === 1 ? main.greenCircle : main.redCircle;

        return (
            <>
                <div id={this.props.popupType} className={main.itPropertyInfoPopup + " " + main.itPropertyInfoBox}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={this.state.popupMinWidth}
                        popupMinHeight={this.state.popupMinHeight}
                        topSize={32}
                        /* popupState={this.props.popupState} */
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                        <div className={main.itPropertyInfoBoxx} style={{ padding: '17px' }}>
                            <span className={main.itPropertyInfoTitle}><p>{ProjectResource.ID.main.itPropertyInfo}</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>
                            <div>
                            <div className={main.itPropertyInfoContent}>
                                <span className={main.itInfoTitle}>{item.rack.name}</span>

                                {/* <div id={main.rackArea}>
                                <span id={main.rackBox}>
                                    <span className={main.box1}>{item.uPos}</span>
                                    <span className={main.box2}>{ProjectResource.getEquipmentTypeName(item?.itemType?.equipmentTypeData)}</span>
                                    <span className={main.box3}>{ProjectResource.getCompanyName(item?.itemType?.company)}</span>
                                    <span className={main.box4}>{item?.itemType?.modelName}</span>
                                    <span className={main.box5}>{item?.itemType?.unit + "U"}</span>
                                    <span className={main.box6}><span className={main.greenCircle}></span></span>
                                </span>
                            </div> */}

                                <div id={main.rackArea}>
                                    <span id={main.rackBox}>
                                        <span className={main.box1}>{item.uPos}</span>
                                        <span className={main.box2}>{ProjectResource.getEquipmentTypeName(item?.itemType?.equipmentTypeData)}</span>
                                        <span className={main.box3}>{item.name}</span>
                                        <span className={main.box4}>{item.itemType?.modelName}</span>
                                        <span className={main.box5}>{item.itemType?.unit + "U"}</span>
                                            <span className={main.box6}><span className={circleClassName}></span></span>
                                    </span>
                                </div>

                                <span className={main.itDashLine}></span>
                                {
                                    itemTypeName === "box"/*item.box*/ && this.getBoxItems(item.box)
                                }
                                {
                                    itemTypeName === "backup"/*item.backup*/ && this.getBackupItems(item.backup)
                                }
                                {
                                    itemTypeName === "etc"/*item.etc*/ && this.getEtcItems(item.etc)
                                }
                                {
                                    itemTypeName === "network"/*item.network*/ && this.getNetworkItems(item.network)
                                }
                                {
                                    itemTypeName === "san switch"/*item.sanSwitch*/ && this.getSanSwitchItems(item.sanSwitch)
                                }
                                {
                                    itemTypeName === "security"/*item.security*/ && this.getSecurityItems(item.security)
                                }
                                {
                                    itemTypeName === "storage"/*item.storage*/ && this.getStorageItems(item.storage)
                                }
                                {
                                    /*<div className={main.inventInfoContent}>
                                        <div className={main.hostName}><span>{ProjectResource.ID.main.itPropertyInfoDetail.hostName}</span><span>:</span><span>{item.name}</span></div>
                                        <div className={main.cpu}><span>{ProjectResource.ID.main.itPropertyInfoDetail.cpu}</span><span>:</span><span>{ITPropertyInfo.getText(item.cpu)}</span></div>
                                        <div className={main.memory}><span>{ProjectResource.ID.main.itPropertyInfoDetail.ram}</span><span>:</span><span>{ITPropertyInfo.getText(item.ram)}</span></div>
                                        <div className={main.disk}><span>{ProjectResource.ID.main.itPropertyInfoDetail.disk}</span><span>:</span><span>{ITPropertyInfo.getText(item.diskInfo)}</span></div>
                                        <div className={main.diskSize}><span>{ProjectResource.ID.main.itPropertyInfoDetail.diskVolume}</span><span>:</span><span>{ITPropertyInfo.getText(item.diskVolume)}</span></div>
                                        <div className={main.itInstallation}><span>{ProjectResource.ID.main.itPropertyInfoDetail.regDate}</span><span>:</span><span>{ITVentRackInfo.getRegDate(item)}</span></div>
                                        <div className={main.itSize}><span>{ProjectResource.ID.main.itPropertyInfoDetail.size}</span><span>:</span><span>{ITPropertyInfo.getItemSize(item)}</span></div>
                                        <div className={main.shelf}><span>{ProjectResource.ID.main.itPropertyInfoDetail.shelf}</span><span>:</span><span>{ProjectResource.getNeedText(item.shelf)}</span></div>
                                    </div>*/
                                }
                                {
                                    !this.props.detailVisible &&
                                    <div className={main.moreView} onClick={() => this.toggleDetail()}>
                                        <span className={main.moreViewText}>{ProjectResource.ID.main.itPropertyInfoDetail.moreDetail}</span>
                                        <span className={main.moreViewIcon}></span>
                                    </div>
                                }
                              </div>
                            </div>
                        </div> 

                    </PopupDraggable>
                </div>
            </>
        );
    }

}

export default ITPropertyInfo;