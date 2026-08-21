import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { OperationView } from '../../styled/dashboardWonik';

import OperationChart from './chartsWonik/operationChart';

import DashboardResource from '../../resource/id';

class OperationWonik extends Component {
    constructor(props) {
		super(props);

        this.state = {
            page: "chart"
        }

        // this.handlePage = this.handlePage.bind(this)
    }

    // 작업 현황 페이지 전환
    handlePage(props) {
        this.setState((prevState) => {
            if(prevState === props){
                return;
            }
            return {page: props};
        })
    }

    getOperationData = () => {
        let data = [];
        let operationData = [];

        const selectSiteID = this.props.selectSiteID;
        const buildingGroupList = this.props.buildingGroupList;
        const workPermit = this.props.workPermit;

        let idx = 1;

        if (selectSiteID === -1) {
            // 전 캠퍼스 작업자 정보
            if (buildingGroupList?.length > 0 && workPermit?.buildingGroupWorkPermits?.length > 0) {
                 for (let j = 0; j < workPermit.buildingGroupWorkPermits.length; j++) {
                    const buildingGroupWorkPermit = workPermit.buildingGroupWorkPermits[j];

                    if (buildingGroupWorkPermit.workerCount === 0)
                        continue;

                    if (data[buildingGroupWorkPermit.workerType]) {
                        data[buildingGroupWorkPermit.workerType].data += buildingGroupWorkPermit.workerCount;
                        
                    } else {
                        const titleName = DashboardResource.getWorkerTypeString(buildingGroupWorkPermit.workerType);
                        const count = buildingGroupWorkPermit.workerCount;

                        data[buildingGroupWorkPermit.workerType] = {index : idx, title: titleName, data: count};
                        idx++;
                    }
                }
            }

        } else if (selectSiteID && selectSiteID !== -1) {
            // 해당 캠퍼스 작업자 정보
            if (buildingGroupList?.length > 0 && workPermit?.buildingGroupWorkPermits?.length > 0) {
                for (let i = 0; i < buildingGroupList.length; i++) {
                    const buildingGroup = buildingGroupList[i];

                    if (buildingGroup.siteID !== selectSiteID) 
                        continue;

                    for (let j = 0; j < workPermit.buildingGroupWorkPermits.length; j++) {
                        const buildingGroupWorkPermit = workPermit.buildingGroupWorkPermits[j];

                        if (buildingGroup.id !== buildingGroupWorkPermit.spatialID ||
                            buildingGroupWorkPermit.workerCount === 0)
                            continue;

                        if (data[buildingGroupWorkPermit.workerType]) {
                            data[buildingGroupWorkPermit.workerType].data += buildingGroupWorkPermit.workerCount;
                        
                        } else {
                            const titleName = DashboardResource.getWorkerTypeString(buildingGroupWorkPermit.workerType);
                            const count = buildingGroupWorkPermit.workerCount;

                            data[buildingGroupWorkPermit.workerType] = {index : idx, title: titleName, data: count};
                            idx++;
                        }
                    }
                }
            }
        }

        if (data?.length > 0) {
            for (const key in data) {
                const workPermitData = data[key];
                operationData.push(workPermitData);
            }

            operationData = operationData.sort((a, b) => {
                if (a.data < b.data) return 1;
                else return -1;
            })
        }

        return operationData;
    }

    render() {

        /*const data = [
            { index: 1, title: '일반', data: '12건' },
            { index: 2, title: '화기', data: '2건' },
            { index: 3, title: '고소', data: '2건' },
            { index: 4, title: '방사선', data: '2건' },
            { index: 5, title: '전기', data: '2건' },
            { index: 6, title: '용접', data: '2건' },
            { index: 7, title: '중장비', data: '2건' },
            { index: 8, title: '굴착', data: '2건' }
        ]*/

        const operationData = this.getOperationData();

		return (
			<OperationView className="operation-area">
                <div className="operation-area-top">
                    <h1>작업 현황</h1>
                    <div className='button-wrap'>
                        <button className={this.state.page === 'chart' ? 'left-btn' : 'left-btn-active'} onClick={() => this.handlePage('chart')} />
                        <button className={this.state.page ==='board' ? 'right-btn' : 'right-btn-active'} onClick={() => this.handlePage('board')} />
                    </div>
                </div>
                <div className='operation-area-wrap'>
                    {
                        this.state.page === 'chart' ? 
                            <div className='operation-chart-wrap'>
                                <OperationChart operationData={operationData} />
                            </div> : 
                            <div className='operation-board-wrap'>
                                {
                                    operationData.map((data) => 
                                        <div key={data.index} className='operation-board'>
                                            <ul className='operation-board-title'>
                                                <li>{data.index}</li>
                                                <li>{data.title}</li>
                                            </ul>
                                            <ul className='operation-board-data'>
                                                <li className='line' />
                                                <li>{data.data}건</li>
                                            </ul>
                                        </div>
                                    )
                                }
                            </div>
                    }
                </div>
            </OperationView>
        );
    }
}

export default withRouter(OperationWonik);