import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { AccessView } from '../../styled/dashboardWonik';
import AccessChart from './chartsWonik/accessChart';

import CountUp from 'react-countup';

import SDMSResource from '../../../SDMS/resource/id';

class AccessWonik extends Component {
    constructor(props) {
        super(props);

        this.state = {
            chartWidth: 300,
        }
        
        this.props = props;
    }
    
    componentDidMount() {
        let width = window.outerWidth;

        // 해상도에 따라 차트 width 변경
        if (width > 1920) {
            this.setState({
                chartWidth: 410
            });
        };
    }

    accessWorkerCount = () => {
        const selectSiteID = this.props.selectSiteID;
        const buildingGroupList = this.props.buildingGroupList;
        const workerInfos = this.props.workerInfos;

        let worker = 0;
        let visitor = 0;

        if (buildingGroupList?.length > 0 && workerInfos?.buildingGroupWorkerInfos?.length > 0) {

            if (selectSiteID === -1) {
                // 전 캠퍼스 인원 현황
                for (let j = 0; j < workerInfos.buildingGroupWorkerInfos.length; j++) {
                    const buildingGroupWorkerInfo = workerInfos.buildingGroupWorkerInfos[j];

                    if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Worker) {
                        worker += buildingGroupWorkerInfo.workerCount;
                    } else if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Visitor) {
                        visitor += buildingGroupWorkerInfo.workerCount;
                    }
                }
            } else if (selectSiteID && selectSiteID !== -1) {
                // 지정 캠퍼스 인원 현황
                for (let i = 0; i < buildingGroupList.length; i++) {
                    const buildingGroup = buildingGroupList[i];

                    if (buildingGroup.siteID === selectSiteID) {
                        for (let j = 0; j < workerInfos.buildingGroupWorkerInfos.length; j++) {
                            const buildingGroupWorkerInfo = workerInfos.buildingGroupWorkerInfos[j];

                            if (buildingGroup.id === buildingGroupWorkerInfo.spatialID) {
                                if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Worker) {
                                    worker += buildingGroupWorkerInfo.workerCount;
                                } else if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Visitor) {
                                    visitor += buildingGroupWorkerInfo.workerCount;
                                }
                            }
                        }
                    }
                } 
            } 

        }

        return [worker, visitor];
    }

    render() {
        const [worker, visitor] = this.accessWorkerCount();
        const { chartWidth } = this.state;

		return (
			<AccessView className="access-area" chartwidth={chartWidth}>
                <h1>작업자 입출입 현황</h1>
                
                <div className='access-area-wrap'>
                    <div className='access-area-top'>
                        <div className='access-area-content'>
                            <div className='access-area-content-icon-people' />
                            <p>총 인원</p>
                            <p><CountUp end={worker + visitor} />명</p>
                        </div>
                        <div className='access-area-content'>
                            <div className='access-area-content-icon-human' />
                            <p>임직원</p>
                            <p><CountUp end={worker} />명</p>
                        </div>
                        <div className='access-area-content'>
                            <div className='access-area-content-icon-id' />
                            <p>방문객</p>
                            <p><CountUp end={visitor} />명</p>
                        </div>
                    </div>
                    <div className='access-area-chart'>
                        <AccessChart 
                            selectSiteID={this.props.selectSiteID}
						    buildingGroupList={this.props.buildingGroupList}
						    workerInfos={this.props.workerInfos}
                            chartWidth={chartWidth}
                        />
                    </div>
                </div>
            </AccessView>
        );
    }
}

export default withRouter(AccessWonik);