import React from 'react';
import { withRouter } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    LabelList
} from "recharts";

import SDMSResource from '../../../../SDMS/resource/id';

// 데이터 0일 경우를 위해
const CustomBar = (props) => {
    const { fill, x, y, width, height, data1, data2, chartWidth } = props;

    if(data1 === 0 && data2 === 0 ) {
        return <rect x={x} y={y} width={chartWidth - 60} height={10} stroke="none" fill={'#dbdbdb'} rx={5} />;
    } else {
        return <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} rx={5} />;
    }
};

// Y축 포지션 정렬을 위해
const YAxisTick = (props) => {
    const { y, payload } = props;
    return (
        <g transform={`translate(${60},${y - 35})`}>
            <text x={0} y={0}
            textAnchor="start"
            fill="#fff"
            fontSize="16">
                {payload.value}
            </text>
        </g>)
}

const data = [
    { name: "캠퍼스A", data1: 0, data2: 400 },
    { name: "캠퍼스B", data1: 40, data2: 3 },
    { name: "캠퍼스C", data1: 0, data2: 0 },
    { name: "캠퍼스D", data1: 100, data2: 40 },
    { name: "캠퍼스E", data1: 200, data2: 40 },
];

export class AccessChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reload: 0,
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

    // 라벨 포지션 수정을 위해
    renderCustomizedLabelMember = (props) => {
        const { x, y, value } = props;
    
        return <text x={x} y={y - 10} fontSize="12" fill="#5398FF" fontWeight="normal">{`임직원 : ${value}`}</text>;
    };

    renderCustomizedLabelVisitor = (props) => {
        const { y, value } = props;
        const { chartWidth } = this.props;
    
        if(value >= 0 && value <= 9 ) {
            return <text x={chartWidth - 45} y={y - 10} fontSize="12" fill="#D3D5D9" fontWeight="normal">{`방문자 : ${value}`}</text>;
        } else if(value >= 1 && value <= 99) {
            return <text x={chartWidth - 50} y={y - 10} fontSize="12" fill="#D3D5D9" fontWeight="normal">{`방문자 : ${value}`}</text>;
        } else {
            return <text x={chartWidth - 57} y={y - 10} fontSize="12" fill="#D3D5D9" fontWeight="normal">{`방문자 : ${value}`}</text>;
        }
    };

    accessChartData = () => {
        const selectSiteID = this.props.selectSiteID;
        const buildingGroupList = this.props.buildingGroupList;
        const workerInfos = this.props.workerInfos;
        let chartHeight = 0;

        const data = [];
        const accessChartData = [];        

        if (selectSiteID === -1) {
            // 전 캠퍼스 인원 현황
            if (buildingGroupList?.length > 0 && workerInfos?.buildingGroupWorkerInfos?.length >= 0) {
    
                for (let i = 0; i < buildingGroupList.length; i++) {
                    const buildingGroup = buildingGroupList[i];
                    
                    if (!data[buildingGroup.id]) {
                        data[buildingGroup.id] = { name: buildingGroup.displayText, data1: 0, data2: 0 };
                    }
                }

                for (let j = 0; j < workerInfos.buildingGroupWorkerInfos.length; j++) {
                    const buildingGroupWorkerInfo = workerInfos.buildingGroupWorkerInfos[j];

                    if (data[buildingGroupWorkerInfo.spatialID]) {
                        if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Worker) {
                            data[buildingGroupWorkerInfo.spatialID].data1 = buildingGroupWorkerInfo.workerCount;
                        } else if (buildingGroupWorkerInfo.workerType === SDMSResource.workerType.Visitor) {
                            data[buildingGroupWorkerInfo.spatialID].data2 = buildingGroupWorkerInfo.workerCount;
                        }
                    }
                }
            }
            
        } else if (selectSiteID && selectSiteID !== -1) {
            // 지정 캠퍼스 인원 현황
            if (buildingGroupList?.length > 0 && workerInfos?.buildingWorkerInfos?.length >= 0) {

                for (let i = 0; i < buildingGroupList.length; i++) {
                    const buildingGroup = buildingGroupList[i];

                    if (buildingGroup.siteID === selectSiteID && buildingGroup?.buildingDatas.length > 0) {
                        for (let j = 0; j < buildingGroup.buildingDatas.length; j++) {
                            const building = buildingGroup.buildingDatas[j];

                            if (!data[building.id]) {
                                data[building.id] = { name: building.displayText, data1: 0, data2: 0 };
                            }
                        }

                        for (let j = 0; j < workerInfos.buildingWorkerInfos.length; j++) {
                            const buildingWorkerInfo = workerInfos.buildingWorkerInfos[j];

                            if (data[buildingWorkerInfo.spatialID]) {
                                if (buildingWorkerInfo.workerType === SDMSResource.workerType.Worker) {
                                    data[buildingWorkerInfo.spatialID].data1 = buildingWorkerInfo.workerCount;
                                } else if (buildingWorkerInfo.workerType === SDMSResource.workerType.Visitor) {
                                    data[buildingWorkerInfo.spatialID].data2 = buildingWorkerInfo.workerCount;
                                }
                            }
                    
                        }
                    }
                }
            }
        }

        if (data.length > 0) {
            for (const key in data) {
                const workerinfo = data[key];
                accessChartData.push(workerinfo);
            }
            chartHeight = accessChartData.length * 80;
        }
        
        return [accessChartData, chartHeight];
    }

    render() {
        const [accessChartData, chartHeight] = this.accessChartData();
        const { chartWidth } = this.props;

        return (
            <ResponsiveContainer height={chartHeight} width={chartWidth}>
                <BarChart
                    layout="vertical"
                    data={accessChartData}
                    margin={{ top: 18 }}
                    stackOffset="expand"
                    barSize={10}
                >
                    <XAxis hide type="number" />

                    <YAxis
                        // hide
                        type="category"
                        dataKey="name"
                        tick={<YAxisTick />}
                        stroke="#FFFFFF"
                        fontSize="16"
                        axisLine={false}
                        tickLine={false}
                    />

                    <Bar 
                        dataKey="data1" 
                        fill="#5398FF" 
                        isAnimationActive={false}
                        stackId="a" 
                        shape={<CustomBar chartWidth={chartWidth} />}
                    >
                        <LabelList
                            dataKey="data1"
                            content={this.renderCustomizedLabelMember}
                        />
                    </Bar>
                    <Bar 
                        dataKey="data2" 
                        fill="#0E162D" 
                        isAnimationActive={false}
                        stackId="a" 
                        shape={<CustomBar chartWidth={chartWidth} />}
                    >
                        <LabelList
                            dataKey="data2"
                            content={this.renderCustomizedLabelVisitor}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            
            // <ResponsiveContainer height={chartHeight} width={300}>
            //     <BarChart
            //         layout="vertical"
            //         data={accessChartData}
            //         margin={{ top: 18 }}
            //         stackOffset="expand"
            //         barSize={10}
            //     >
            //         <XAxis hide type="number" />

            //         <YAxis
            //             // hide
            //             type="category"
            //             dataKey="name"
            //             tick={<YAxisTick />}
            //             stroke="#FFFFFF"
            //             fontSize="16"
            //             axisLine={false}
            //             tickLine={false}
            //         />

            //         <Bar 
            //             dataKey="data1" 
            //             fill="#5398FF" 
            //             stackId="a" 
            //             shape={<CustomBar />}
            //         >
            //             <LabelList
            //                 dataKey="data1"
            //                 content={renderCustomizedLabelMember}
            //             />
            //         </Bar>
            //         <Bar 
            //             dataKey="data2" 
            //             fill="#0E162D" 
            //             stackId="a" 
            //             shape={<CustomBar />}
            //         >
            //             <LabelList
            //                 dataKey="data2"
            //                 content={renderCustomizedLabelVisitor}
            //             />
            //         </Bar>
            //     </BarChart>
            // </ResponsiveContainer>
            // <React.Fragment>
            //     {barChartUI}
            // </React.Fragment>
        );
    }
}

export default withRouter(AccessChart);