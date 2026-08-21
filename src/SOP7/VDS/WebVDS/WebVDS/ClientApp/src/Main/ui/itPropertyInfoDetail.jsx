import React, { Component } from 'react';
import $ from 'jquery';
import main from '../../Main/css/main.module.css';
import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';
import ITPropertyInfo from './itPropertyInfo';
import ITVentRackInfo from './inventRackInfo';
//import PopupDraggable from '../../SDMS/ui/popups/popupDraggable';
import ITViewer from './itViewer';
import CommonResource from '../../Common/resource/id';

import Tooltip from '../../Main/ui/tooltip';

class ITPropertyInfoDetail extends Component {
    constructor(props) {
        super(props);

        this.maxLine = 19;
        const [pageNo, totalPage] = this.getPageData();

        this.state = {
            popupMinWidth: 1443,
            popupMinHeight: 851,
            showDetail: false,
            pageNo: pageNo,
            totalPage: totalPage,
            nameTooltipShow: false,
            rackNameTooltipShow: false,
            tooltipTop: 0,
            tooltipLeft: 0,
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    handleTooltip = (param, e) => {
        const domRect = e.target.getBoundingClientRect();

        if (param === 'center') {
            this.setState({
                centerTooltipShow: !this.state.centerTooltipShow,
                tooltipTop: domRect.top - 50,
                tooltipLeft: domRect.left - 20,
            });
        } else if (param === 'name') {
            this.setState({
                nameTooltipShow: !this.state.nameTooltipShow,
                tooltipTop: domRect.top - 20,
                tooltipLeft: domRect.left - 0,
            });
        } else if (param === 'rackname') {
            this.setState({
                rackNameTooltipShow: !this.state.rackNameTooltipShow,
                tooltipTop: domRect.top - 20,
                tooltipLeft: domRect.left - 0,
            });
        }
    }

    getPageData() {
        this.racks = {};
        this.rackItems = {};
        const linkedItems = this.props.item?.linkedItems;

        if (linkedItems) {
            let linkCount = 0;
            const maxLine = this.maxLine;

            for (const item of linkedItems) {
                let rack = this.racks[item.rackID];

                if (!rack) {
                    rack = item.rack;
                    this.racks[item.rackID] = rack;
                    linkCount++;
                }

                let items = this.rackItems[item.rackID];

                if (!items) {
                    items = [];
                    this.rackItems[item.rackID] = items;
                }

                items.push(item);
                linkCount++;
            }

            for (const rackID in this.rackItems) {
                const items = this.rackItems[rackID];

                items.sort((item1, item2) => {
                    if (item1.uPos < item2.uPos) {
                        return 1;
                    }
                    else if (item1.uPos > item2.uPos) {
                        return -1;
                    }

                    return 0;
                });
            }

            if (linkCount > maxLine) {
                if (linkCount % maxLine === 0) {
                    return [1, linkCount / maxLine];
                }
                else {
                    return [1, parseInt(linkCount / maxLine) + 1];
                }
            }

            return [1, null];
        }

        return [null, null];
    }

    onClickViewToggle() {
        this.setState({ showDetail: !this.state.showDetail });
    }

    getLinkedItemElement(item) {
        const rackItems = {};
        const racks = {};

        for (const linkedItem of item.linkedItems) {
            let items = rackItems[linkedItem.rack.id];

            if (!items) {
                items = [];
                rackItems[linkedItem.rack.id] = items;
                racks[linkedItem.rack.id] = linkedItem.rack;
            }

            items.push(linkedItem);
        }

        const rackElements = [];

        for (const rackID in rackItems) {
            const rack = racks[rackID];
            const items = rackItems[rackID];
            const rackBodyElements = [];

            rackBodyElements.push(
                <span className={main.connectRackTitle}>{rack.name}</span>
            );

            const itemElements = [];

            for (const _item of items) {
                const circleClassName = _item.status === 1 ? main.greenCircle : main.redCircle;

                itemElements.push(
                    <>
                    <span id={main.rackBox}>
                        <span className={main.box1}>{_item.uPos}</span>
                        <span className={main.box2}>{ProjectResource.getEquipmentTypeName(_item.itemType.equipmentTypeData)}</span>
                            <span className={main.box3}>{_item.name}</span>
                            <span className={main.box4}>{_item.itemType.modelName}</span>
                        <span className={main.box5}>{_item.itemType.unit + "U"}</span>
                            <span className={main.box6}><span className={circleClassName}></span></span>
                    </span>

                    {/* IT자산 변경 */ }
                    {/* <span id={main.rackBox}>
                        <span className={main.box1}>24</span>
                        <span className={main.box2}>어플라이언스</span>
                        <span className={main.box3}>IT-9</span>
                        <span className={main.box4}>SG510-20-M5</span>
                        <span className={main.box5}>{item.itemType.unit + "U"}</span>
                        <span className={main.box6}><span className={main.greenCircle}></span></span>
                    </span> */}
                    </>
                );
            }

            rackBodyElements.push(
                <div id={main.itRackArea}>
                    {itemElements}
                </div>
            );

            rackElements.push(
                <div className={main.connectBox}>
                    {rackBodyElements}
                </div>
            );
        }

        return (
            <div className={main.connectScrollArea}>
                {rackElements}
            </div>
            );
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
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>Box 명</span><span>:</span><span>{this.getItemData(box.basic_Name)}</span></div>
                    <div className={main.rating}><span>Box 등급</span><span>:</span><span>{this.getItemData(box.basic_ItemLevel)}</span></div>
                    <div className={main.boxManufacturer}><span>Box 제조사</span><span>:</span><span>{this.getItemData(box.basic_Company)}</span></div>
                    <div className={main.boxModelName}><span>Box 모델명</span><span>:</span><span>{this.getItemData(box.basic_ModelName)}</span></div>
                    <div className={main.boxState}><span>상태</span><span>:</span><span>{this.getItemData(box.basic_Status)}</span></div>
                    <div className={main.boxPurpose}><span>용도</span><span>:</span><span>{this.getItemData(box.basic_Usage)}</span></div>
                    <div className={main.boxModel}><span>모델명</span><span>:</span><span>{this.getItemData(box.cpU_ModelName)}</span></div>
                    <div className={main.clockSpeed}><span>Clock Speed</span><span>:</span><span>{this.getItemData(box.cpU_ClockSpeed)}</span></div>
                    <div className={main.coreNum}><span>총 Core 수</span><span>:</span><span>{this.getItemData(box.cpU_TotalCoreCount)}</span></div>
                    <div className={main.boxMemory}><span>총 Memory 용량</span><span>:</span><span>{this.getItemData(box.mem_TotalMemoryVolume)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>Box 명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>Box 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>Box 제조사</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>Box 모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.clockSpeed}><span>Clock Speed</span><span>:</span><span>-</span></div>
                <div className={main.coreNum}><span>총 Core 수</span><span>:</span><span>-</span></div>
                <div className={main.boxMemory}><span>총 Memory 용량</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getBackupItems(backup) {
        if (backup) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(backup.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(backup.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>백업 등급</span><span>:</span><span>{this.getItemData(backup.basic_ItemLevel)}</span></div>
                    <div className={main.boxModelName}><span>용도</span><span>:</span><span>{this.getItemData(backup.basic_Usage)}</span></div>
                    <div className={main.boxState}><span>모델명</span><span>:</span><span>{this.getItemData(backup.hW_ModelName)}</span></div>
                    <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>{this.getItemData(backup.hW_Company)}</span></div>
                    <div className={main.boxModel}><span>Usable 용량(GB)</span><span>:</span><span>{this.getItemData(backup.hW_UsableVolumeGB)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>백업 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>Usable 용량(GB)</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getEtcItems(etc) {
        if (etc) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(etc.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(etc.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>기타 장비 상세분류</span><span>:</span><span>{this.getItemData(etc.basic_EquipDetailClass)}</span></div>
                    <div className={main.boxModelName}><span>기타 등급</span><span>:</span><span>{this.getItemData(etc.basic_ItemLevel)}</span></div>
                    <div className={main.boxState}><span>용도</span><span>:</span><span>{this.getItemData(etc.basic_Usage)}</span></div>
                    <div className={main.boxPurpose}><span>모델명</span><span>:</span><span>{this.getItemData(etc.hW_ModelName)}</span></div>
                    <div className={main.boxModel}><span>제조사</span><span>:</span><span>{this.getItemData(etc.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>기타 장비 상세분류</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>기타 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getNetworkItems(network) {
        if (network) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(network.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(network.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>네트워크 장비 상세분류</span><span>:</span><span>{this.getItemData(network.basic_EquipDetailClass)}</span></div>
                    <div className={main.boxModelName}><span>네트워크 운영 등급</span><span>:</span><span>{this.getItemData(network.basic_ItemLevel)}</span></div>
                    <div className={main.boxState}><span>용도</span><span>:</span><span>{this.getItemData(network.basic_Usage)}</span></div>
                    <div className={main.boxPurpose}><span>모델명</span><span>:</span><span>{this.getItemData(network.hW_ModelName)}</span></div>
                    <div className={main.boxModel}><span>제조사</span><span>:</span><span>{this.getItemData(network.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>네트워크 장비 상세분류</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>네트워크 운영 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getSanSwitchItems(_switch) {
        if (_switch) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(_switch.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(_switch.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>SAN 스위치 등급</span><span>:</span><span>{this.getItemData(_switch.basic_ItemLevel)}</span></div>
                    <div className={main.boxModelName}><span>용도</span><span>:</span><span>{this.getItemData(_switch.basic_Usage)}</span></div>
                    <div className={main.boxState}><span>모델명</span><span>:</span><span>{this.getItemData(_switch.hW_ModelName)}</span></div>
                    <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>{this.getItemData(_switch.hW_Company)}</span></div>
                    <div className={main.boxModel}><span>FC 포트 개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch.hW_FCPortCount)}</span></div>
                    <div className={main.clockSpeed}><span>FC 포트 사용개수(최대포트수)</span><span>:</span><span>{this.getItemData(_switch.hW_FCPortUseCount)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>SAN 스위치 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>FC 포트 개수(최대포트수)</span><span>:</span><span>-</span></div>
                <div className={main.clockSpeed}><span>FC 포트 사용개수(최대포트수)</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getSecurityItems(security) {
        if (security) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(security.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(security.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>보안 등급</span><span>:</span><span>{this.getItemData(security.basic_ItemLevel)}</span></div>
                    <div className={main.boxModelName}><span>용도</span><span>:</span><span>{this.getItemData(security.basic_Usage)}</span></div>
                    <div className={main.boxState}><span>모델명</span><span>:</span><span>{this.getItemData(security.hW_ModelName)}</span></div>
                    <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>{this.getItemData(security.hW_Company)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>보안 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getStorageItems(storage) {
        if (storage) {
            return (
                <div className={main.inventInfoContentDetail}>
                    <div className={main.boxName}><span>장비명</span><span>:</span><span>{this.getItemData(storage.basic_Name)}</span></div>
                    <div className={main.rating}><span>상태</span><span>:</span><span>{this.getItemData(storage.basic_Status)}</span></div>
                    <div className={main.boxManufacturer}><span>Storage 등급</span><span>:</span><span>{this.getItemData(storage.basic_ItemLevel)}</span></div>
                    <div className={main.boxModelName}><span>용도</span><span>:</span><span>{this.getItemData(storage.basic_Usage)}</span></div>
                    <div className={main.boxState}><span>모델명</span><span>:</span><span>{this.getItemData(storage.hW_ModelName)}</span></div>
                    <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>{this.getItemData(storage.hW_Company)}</span></div>
                    <div className={main.boxModel}><span>Disk 종류</span><span>:</span><span>{this.getItemData(storage.hW_DiskType)}</span></div>
                    <div className={main.clockSpeed}><span>Total Usable 용량</span><span>:</span><span>{this.getItemData(storage.hW_TotalUsableVolume)}</span></div>
                </div>
            );
        }

        return (
            <div className={main.inventInfoContentDetail}>
                <div className={main.boxName}><span>장비명</span><span>:</span><span>-</span></div>
                <div className={main.rating}><span>상태</span><span>:</span><span>-</span></div>
                <div className={main.boxManufacturer}><span>Storage 등급</span><span>:</span><span>-</span></div>
                <div className={main.boxModelName}><span>용도</span><span>:</span><span>-</span></div>
                <div className={main.boxState}><span>모델명</span><span>:</span><span>-</span></div>
                <div className={main.boxPurpose}><span>제조사</span><span>:</span><span>-</span></div>
                <div className={main.boxModel}><span>Disk 종류</span><span>:</span><span>-</span></div>
                <div className={main.clockSpeed}><span>Total Usable 용량</span><span>:</span><span>-</span></div>
            </div>
        );
    }

    getBoxConnectionElement(box) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"관리 IP 주소 : " + this.getItemData(box.nW_ManageIPAddr)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"IP 주소 2 : " + this.getItemData(box.nW_IPAddr2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"IP 주소 3 : " + this.getItemData(box.nW_IPAddr3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"IP 주소 4 : " + this.getItemData(box.nW_IPAddr4)}</div>
        );

        return elements;
    }

    getStorageConnectionElement(storage) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"서버명 : " + this.getItemData(storage.connect_ServerName)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"용도 : " + this.getItemData(storage.connect_Usage)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"서비스 등급 : " + this.getItemData(storage.connect_ServiceLevel)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"모델명 : " + this.getItemData(storage.connect_ModelName)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"OS : " + this.getItemData(storage.connect_OS)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"접속 Cable : " + this.getItemData(storage.connect_Cable)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"할당 용량 : " + this.getItemData(storage.connect_GivenVolume)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"실 사용 용량(AP/DB 파일) : " + this.getItemData(storage.connect_RealUseVolume)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"기타 용량(관리) : " + this.getItemData(storage.connect_EtcVolume)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"여유 용량 : " + this.getItemData(storage.connect_FreeVolume)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"월별 증가량 : " + this.getItemData(storage.connect_MonthlyIncrease)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"접속방법 : " + this.getItemData(storage.connect_ConnectType)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"연결 Channel Path 수 : " + this.getItemData(storage.connect_ChannelPathCount)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"Path 이중화 솔루션 : " + this.getItemData(storage.connect_PathDualSolution)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 1 : " + this.getItemData(storage.connect_NWEquip_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 2 : " + this.getItemData(storage.connect_NWEquip_2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 3 : " + this.getItemData(storage.connect_NWEquip_3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 4 : " + this.getItemData(storage.connect_NWEquip_4)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 1 : " + this.getItemData(storage.connect_SanSwitch_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 2 : " + this.getItemData(storage.connect_SanSwitch_2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 3 : " + this.getItemData(storage.connect_SanSwitch_3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 4 : " + this.getItemData(storage.connect_SanSwitch_4)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 5 : " + this.getItemData(storage.connect_SanSwitch_5)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 6 : " + this.getItemData(storage.connect_SanSwitch_6)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 7 : " + this.getItemData(storage.connect_SanSwitch_7)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 8 : " + this.getItemData(storage.connect_SanSwitch_8)}</div>
        );

        return elements;
    }

    getNetworkConnectionElement(network) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 1 : " + this.getItemData(network.connect_NWEquip_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 2 : " + this.getItemData(network.connect_NWEquip_2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 3 : " + this.getItemData(network.connect_NWEquip_3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 4 : " + this.getItemData(network.connect_NWEquip_4)}</div>
        );

        return elements;
    }

    getSecurityConnectionElement(security) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 1 : " + this.getItemData(security.connect_NWEquip_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 2 : " + this.getItemData(security.connect_NWEquip_2)}</div>
        );

        return elements;
    }

    getEtcConnectionElement(etc) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 1 : " + this.getItemData(etc.connect_NWEquip_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 2 : " + this.getItemData(etc.connect_NWEquip_2)}</div>
        );

        return elements;
    }

    getBackupConnectionElement(backup) {
        const elements = [];

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 1 : " + this.getItemData(backup.connect_NWEquip_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 2 : " + this.getItemData(backup.connect_NWEquip_2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 3 : " + this.getItemData(backup.connect_NWEquip_3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NW장비 - 4 : " + this.getItemData(backup.connect_NWEquip_4)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치 - 1 : " + this.getItemData(backup.connect_SanSwitch_1)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"SAN 스위치장비 - 2 : " + this.getItemData(backup.connect_SanSwitch_2)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NWSAN 스위치 - 3 : " + this.getItemData(backup.connect_SanSwitch_3)}</div>
        );

        elements.push(
            <div className={main.nwEquipment1}>{"NWSAN 스위치 - 4 : " + this.getItemData(backup.connect_SanSwitch_4)}</div>
        );

        return elements;
    }

    getItemTypeName(item) {
        if (item.itemType?.equipmentTypeData?.engName) {
            return item.itemType.equipmentTypeData.engName.toLowerCase();
        }

        return "";
    }

    getrackName(name, nameConts, hidden) {
        if (name.length > 18) {
            nameConts = name;
            name = name.substring(0, 18) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltiprackItemName">
                        <span className="tooltiprackItemNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('rackname', e, nameConts)}
                            onMouseLeave={() => this.setState({ rackNameTooltipShow: false })}>
                            {name}
                        </span>
                        <Tooltip
                            show={this.state.rackNameTooltipShow}
                            message={this.nameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltiprackItemNameConts tooltip-left"}
                        >
                            {nameConts}
                        </Tooltip>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{name}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }

    getLInkedItemElements() {
        const pageNo = this.state.pageNo;

        if (pageNo === null) {
            return (
                <></>
                );
        }

        const beginIndex = (pageNo - 1) * this.maxLine;
        const endIndex = beginIndex + this.maxLine;

        let index = 0;
        const elements = [];

        for (const rackID in this.rackItems) {
            const rack = this.racks[rackID];

            if (!rack) {
                continue;
            }

            let items = [];

            if (index >= beginIndex && index < endIndex) {
                items.push(<span className={main.rackNameITC}>{rack.name}</span>);                
            }

            index++;

            if (index >= endIndex) {
                if (items.length > 0) {
                    elements.push(
                        <div className={main.rackAreaITC}>
                            {
                                items
                            }
                        </div>);
                }

                break;
            }

            const rackItems = this.rackItems[rackID];

            for (const rackItem of rackItems) {
                if (index < beginIndex) {
                    index++;
                    continue;
                }
                else if (index >= endIndex) {
                    break;
                }

                const unit = rackItem.itemType ? rackItem.itemType.unit + "U" : "-";
                const status = rackItem.status === 1 ? main.greenCircle : main.redCircle;

                items.push(
                    <span className={main.rackBoxITC}>
                        <span className={main.box1}>{rackItem.uPos}</span>
                        <span className={main.box2}>{ProjectResource.getEquipmentTypeName(rackItem.itemType?.equipmentTypeData)}</span>
                        <span className={main.box3}>
                            {/* {rackItem.name} */}
                            {
                                this.getrackName(rackItem.name, true)
                            }
                        </span>
                        <span className={main.box4}>{rackItem.itemType?.modelName}</span>
                        <span className={main.box5}>{unit}</span>
                        <span className={main.box6}><span className={status}></span></span>
                    </span>
                );

                elements.push(
                    <div className={main.rackAreaITC}>
                        {
                            items
                        }
                    </div>);

                items = [];
                index++;
            }

            if (index >= endIndex) {
                break;
            }
        }

        return elements;
    }

    getPageElements() {
        const pageNo = this.state.pageNo;
        const totalPage = this.state.totalPage;

        if (pageNo === null || totalPage === null) {
            return (
                <></>
            );
        }

        const leftClassName = pageNo > 1 ? main.leftArrowIconITC + " " + main.active : main.leftArrowIconITC;
        const rightClassName = pageNo < totalPage ? main.rightArrowIconITC + " " + main.active : main.rightArrowIconITC;

        return (
            <div className={main.pageAreaITC}>
                <span className={leftClassName} onClick={() => this.movePage(-1)}></span>
                <span className={main.pageNumBoxITC}>{pageNo + " / " + totalPage}</span>
                <span className={rightClassName} onClick={() => this.movePage(1)}></span>
            </div>
        );
    }

    movePage(dir) {
        if (dir < 0) {
            if (this.state.pageNo > 1) {
                this.setState({ pageNo: this.state.pageNo - 1 });
            }
        }
        else {
            if (this.state.pageNo < this.state.totalPage) {
                this.setState({ pageNo: this.state.pageNo + 1 });
            }
        }
    }

    getItemName(name, nameConts, hidden) {
        if (name.length > 18) {
            nameConts = name;
            name = name.substring(0, 18) + "...";

            return (
                <div style={{ position: 'relative' }}>
                    <div className="tooltipItemName">
                        <span className="tooltipItemNameTitle"
                            onMouseEnter={(e) => this.handleTooltip('name', e, nameConts)}
                            onMouseLeave={() => this.setState({ nameTooltipShow: false })}>
                            {name}
                        </span>
                        <Tooltip
                            show={this.state.nameTooltipShow}
                            message={this.nameConts}
                            top={this.state.tooltipTop}
                            left={this.state.tooltipLeft}
                            className={"tooltipItemNameConts tooltip-left"}
                        >
                            {nameConts}
                        </Tooltip>
                    </div>

                </div>
            );
        } else {
            return (
                <div>{name}</div>
            );
        }

        if (hidden) {
            return (
                <div className={dash.textHidden}>{name}</div>
            );
        }

        return (
            <div>{name}</div>
        );
    }

    render() {
        const item = this.props.item;
        const detailBoxClassName = !this.state.showDetail ? main.itInfoDetailBox2 + " " + main.hidden : main.itInfoDetailBox2;

        let imgUrl = "";

        if (item.itemType?.imageUrl) {
            imgUrl = item.itemType.imageUrl.startsWith("/") ? ProjectResource.baseUrl + item.itemType.imageUrl : ProjectResource.baseUrl + "/" + item.itemType.imageUrl;
        }

        const itemTypeName = this.getItemTypeName(item);
        const circleClassName = item.status === 1 ? main.greenCircle : main.redCircle;
        const btnClassName = this.state.showDetail ? main.sanViewBtn + " " + main.reverse : main.sanViewBtn;

        return (
            <>
            <div id='tooltip-area'></div>
            <div id={main.ITpropertyPop}>
                <div>
                <div>
                <div id={this.props.popupType} className={main.itProInfoDetailPopup}>
                    {/* <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={this.state.popupMinWidth}
                        popupMinHeight={this.state.popupMinHeight}
                        topSize={35}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    > */}
                           <div className={main.itpositionArea + " " + CommonResource.UISection}>
                           <div style={{ display: 'flex' }}>
                            <div className={main.itInfoDetailBox}>
                                <span className={main.itPropertyInfoTitle}><p>{ProjectResource.ID.main.itPropertyInfo}</p><span className={main.closeBtn} onClick={() => this.onClose()}></span></span>

                                <div style={{ display: 'flex' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className={main.itInfoContents1}>
                                            <div className={main.itProImageBox}>
                                                <span className={main.itProImageTitle}>{item.rack.name}</span>
                                                <div id={main.rackArea}>
                                                    <span id={main.rackBox}>
                                                        <span className={main.box1}>{item.uPos}</span>
                                                        <span className={main.box2}>{ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData)}</span>
                                                        <span className={main.box3}>
                                                            {/* {item.name} */}
                                                            {
                                                               this.getItemName(item.name, true)
                                                            }
                                                        </span>
                                                        <span className={main.box4}>{item.itemType.modelName}</span>
                                                        <span className={main.box5}>{item.itemType.unit + "U"}</span>
                                                                    <span className={main.box6}><span className={circleClassName}></span></span>
                                                    </span> 

                                                    {/* IT자산 변경 */}
                                                    {/* <span id={main.rackBox}>
                                                        <span className={main.box1}>24</span>
                                                        <span className={main.box2}>어플라이언스</span>
                                                        <span className={main.box3}>IT-9</span>
                                                        <span className={main.box4}>SG510-20-M5</span>
                                                        <span className={main.box5}>{item.itemType.unit + "U"}</span>
                                                        <span className={main.box6}><span className={main.greenCircle}></span></span>
                                                    </span> */}
                                                </div>
                                                <div className={main.itRackImageBox}>
                                                    <span className={main.itRackImage}>
                                                       <span className={main.itRackImageArea}>
                                                            <img src={imgUrl} className={main.itImage} />
                                                       </span>
                                                       <span className={main.rackRotateIcon} onClick={() => this.props.show3DItem(item.itemType.glbUrl, item.itemType.modelName, ProjectResource.getEquipmentTypeName(item.itemType.equipmentTypeData))}></span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={main.itInfoContents2}>
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
                                        </div>

                                         {/* <div className={main.itInfoContents2}>
                                            <span className={main.connectServer}>{ProjectResource.ID.main.itPropertyInfoDetail.linkedServer}</span>

                                            {
                                                this.getLinkedItemElement(item)
                                            }
                                        </div> */}
                                    </div>

                                    {/* <input id="check-btn" type="checkbox" />
                                     <label for="check-btn"><div className={main.sanViewBtn}></div></label> */}

                                      <div className={detailBoxClassName}>
                                        <div className={main.connectScrollArea2}>
                                            <div className={main.connectTitle}>연결 IT장비</div>
                                            {
                                                /*item.box && this.getBoxConnectionElement(item.box)
                                            }
                                            {
                                                item.storage && this.getStorageConnectionElement(item.storage)
                                            }
                                            {
                                                item.network && this.getNetworkConnectionElement(item.network)
                                            }
                                            {
                                                item.security && this.getSecurityConnectionElement(item.security)
                                            }
                                            {
                                                item.etc && this.getEtcConnectionElement(item.etc)
                                            }
                                            {
                                                item.backup && this.getBackupConnectionElement(item.backup)*/
                                                this.getLInkedItemElements()
                                            }

                                            {
                                                this.getPageElements()
                                            }
                                        </div> 
                                    </div> {/* itInfoDetailBox2 */}
                                </div> {/* flex */}
                             </div> {/* itInfoDetailBox */}
                             <div className={btnClassName} onClick={() => this.onClickViewToggle()}></div>
                           </div>{/* flex */}
                        </div>
                       {/* </PopupDraggable> */}
                    </div> {/* itProInfoDetailPopup */}
                 </div>
               </div>
            </div>

            {/* <ITViewer /> */}
            </>
        );
    }

}

export default ITPropertyInfoDetail;