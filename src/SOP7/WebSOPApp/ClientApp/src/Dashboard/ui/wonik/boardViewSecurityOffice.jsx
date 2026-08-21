import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { BoardViewSecurityOffice } from '../../styled/dashboardWonik';

import ProjectResource from '../../../Root/resource/id';

import minimap_sample1 from '../../../Common/img/imgwonik/minimap_sample1.png'
import assembly_H1 from '../../../Common/img/imgwonik/assembly_H1.png'
import assembly_H2 from '../../../Common/img/imgwonik/assembly_H2.png'
import assembly_A1 from '../../../Common/img/imgwonik/assembly_A1.png'
import assembly_A2 from '../../../Common/img/imgwonik/assembly_A2.png'
import assembly_C1 from '../../../Common/img/imgwonik/assembly_C1.png'
import assembly_C2 from '../../../Common/img/imgwonik/assembly_C2.png'
import assembly_V1 from '../../../Common/img/imgwonik/assembly_V1.png'
import assembly_V2 from '../../../Common/img/imgwonik/assembly_V2.png'
import assembly_S1 from '../../../Common/img/imgwonik/assembly_S1.png'
import assembly_S2 from '../../../Common/img/imgwonik/assembly_S2.png'

class BoardViewSecurityOfficeWonik extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            listDropDownShow: false,
            buildingName: 'H캠퍼스 H1동',

            selectBuildingID: null,
        }

		this.props = props;	
	}    



    componentWillUpdate(nextProps, nextState) {
        if (this.props.workerInfos !== nextProps.workerInfos || 
            this.props.buildingGroupList !== nextProps.buildingGroupList) {
            let reload = this.state.reload;
            reload++;
            this.setState({ reload });
        }
    }

    getBuildingName = (e) => {
        const selectBuildingID = e.target.id;

        if (selectBuildingID !== null && selectBuildingID !== undefined && selectBuildingID !== "") 
            this.state.selectBuildingID = selectBuildingID;

        this.setState({ listDropDownShow: false });
    }

    getBuildingUI = () => {
        const selectSiteID = this.props.selectSiteID;
        const buildingGroupList = this.props.buildingGroupList;
        const workerInfos = this.props.workerInfos?.zoneWorkerInfos;

        const selectBuildingID = this.state.selectBuildingID;

        let buildingName = "-";
        let buildingGroupName = "";

        let buildingListUI = [];
        let zoneListUI = [];
        let assemblyUI = [];

        for (let i = 0; i < buildingGroupList?.length; i++) {
            const buildingGroup = buildingGroupList[i];

            if (selectSiteID === buildingGroup.siteID) {

                let assembly_indoor_worker = 0;
                let assembly_indoor_visitor = 0;

                for (let j = 0; j < buildingGroup.buildingDatas?.length; j++) {
                    const buildingData = buildingGroup.buildingDatas[j];

                    buildingListUI.push(<li key={"SecurityOffice_Building_" + buildingData.id} id={buildingData.id}>{buildingGroup.displayText + " " + buildingData.displayText}</li>);

                    if ((selectBuildingID === null && j === 0) ||
                        (selectBuildingID !== null && selectBuildingID === buildingData.id.toString())) {

                        buildingGroupName = buildingGroup.displayText;
                        buildingName = buildingData.displayText;

                        for (let z = 0; z < buildingData.zoneDatas?.length; z++) {
                            const zoneData = buildingData.zoneDatas[z];
                            let worker = 0;
                            let visitor = 0;

                            for (let n = 0; n < workerInfos?.length; n++) {
                                const workerInfo = workerInfos[n];

                                if (workerInfo.spatialID === zoneData.id &&
                                    workerInfo.workerType === null) {
                                    worker = workerInfo.workerCount;
                                }
                                else if (workerInfo.spatialID === zoneData.id &&
                                    workerInfo.workerType === 1) {
                                    visitor = workerInfo.workerCount;
                                }
                            }

                            zoneListUI.push(
                                <tr key={"SecurityOffice_Zone_" + zoneData.id + "_"}>
                                    <td>{zoneData.displayText}</td>
                                    <td>{worker + visitor}</td>
                                    <td>{worker}</td>
                                    <td>{visitor}</td>
                                </tr>);
                        }
                    }
                }

                // 집결지       
                const outdoorID = (selectSiteID - ProjectResource.SiteID) + 20000;

                for (let n = 0; n < workerInfos?.length; n++) {
                    const workerInfo = workerInfos[n];

                    if (workerInfo.spatialID === outdoorID &&
                        workerInfo.workerType === null) {
                        assembly_indoor_worker = workerInfo.workerCount;
                    }
                    else if (workerInfo.spatialID === outdoorID &&
                        workerInfo.workerType === 1) {
                        assembly_indoor_visitor = workerInfo.workerCount;
                    }
                }

                assemblyUI.push(
                    <tr key={"SecurityOffice_Assembly_" + assembly_indoor_worker + "_" + assembly_indoor_visitor}>
                        <td>집결지</td>
                        <td>{assembly_indoor_worker + assembly_indoor_visitor}</td>
                        <td>{assembly_indoor_worker}</td>
                        <td>{assembly_indoor_visitor}</td>
                    </tr>);

                break;
            }

        }

        return [buildingGroupName, buildingName, buildingListUI, zoneListUI, assemblyUI];
    }

    getAssemblyMap = () => {
        let assemblyMap1 = assembly_H1;
        let assemblyMap2 = assembly_H2;

        const selectSiteID = this.props.selectSiteID;

        if (selectSiteID === ProjectResource.Site.Wonik_A) {
            assemblyMap1 = assembly_A1;
            assemblyMap2 = assembly_A2;
        }
        else if (selectSiteID === ProjectResource.Site.Wonik_C) {
            assemblyMap1 = assembly_C1;
            assemblyMap2 = assembly_C2;
        }
        else if (selectSiteID === ProjectResource.Site.Wonik_V) {
            assemblyMap1 = assembly_V1;
            assemblyMap2 = assembly_V2;
        }
        else if (selectSiteID === ProjectResource.Site.Wonik_S) {
            assemblyMap1 = assembly_S1;
            assemblyMap2 = assembly_S2;
        }

        return [assemblyMap1, assemblyMap2];
    }

    render() {
        //const { listDropDownShow, buildingName } = this.state;

        const [buildingGroupName, buildingName, buildingListUI, zoneListUI, assemblyUI] = this.getBuildingUI();

        const [assemblyMap1, assemblyMap2] = this.getAssemblyMap();


		return (
			<BoardViewSecurityOffice className="board-view-area" $show={this.state.listDropDownShow}>
                <div className='board-view-wrap left'>
                    <div className='selected-building-wrap'>
                        <div className='selected-building'>
                            <span className='building-name' onClick={() => this.setState({ listDropDownShow: !this.state.listDropDownShow })}>{buildingGroupName + " " + buildingName}</span>
                            {
                                this.state.listDropDownShow && 
                                    <ul className='building-list scrollbar' onClick={(e) => this.getBuildingName(e)}>
                                        {buildingListUI}
                                    </ul>
                            }
                        </div>
                    </div>
                    <div className='building-info-wrap'>
                        <div className='building-info-table-wrap scrollbar'>
                            <table>
                                <thead>
                                    <tr>
                                        <td width={'25%'}>층별</td>
                                        <td width={'25%'}>총 인원</td>
                                        <td width={'25%'}>임직원</td>
                                        <td width={'25%'}>방문객</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { zoneListUI }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='board-view-wrap right'>
                    <div className='selected-building-wrap'>
                        <div className='selected-building'>
                            <span>{buildingGroupName} 집결지</span>
                        </div>
                    </div>
                    <div className='building-info-wrap'>
                        <div className='building-info-table-wrap scrollbar'>
                            <table>
                                <thead>
                                    <tr>
                                        <td width={'25%'}>장소</td>
                                        <td width={'25%'}>총 인원</td>
                                        <td width={'25%'}>임직원</td>
                                        <td width={'25%'}>방문객</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    { assemblyUI }
                                </tbody>
                            </table>
                        </div>

                        <div className='minimap-area'>
                            <div>
                                <p>집결지</p>
                                <div>
                                    <img src={assemblyMap1} />
                                </div>
                            </div>
                            <div>
                                <p>집결지</p>
                                <div>
                                    <img src={assemblyMap2} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </BoardViewSecurityOffice>
        );
    }
}

export default withRouter(BoardViewSecurityOfficeWonik);