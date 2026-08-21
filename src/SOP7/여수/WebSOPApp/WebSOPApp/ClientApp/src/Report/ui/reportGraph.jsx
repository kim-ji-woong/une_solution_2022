import React, { Component } from 'react';
//import { withRouter } from 'react-router-dom';
import { ReportGraphComponent } from '../styled/ReportStyled';
import { Line } from "react-chartjs-2";

import WindChart from './windChart';
import LineChart from './lineChart';
import ReportResource from '../resource/id';

class ReportGraph extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.props = props;
    }

    // 측정값 Line Chart 생성 (풍향&풍속 제외)
    getLineChart = (zones, dataSource) => {
        const materials = this.props.materials;
        let ui = [];
        let labels = [];

        // 측정소별 차트 컬러 지정
        const colors = ["#BC8F8F", "#F08080", "#CD5C5C", "#A52A2A", "#B22222", "#800000", "#8B0000", "#FF0000", "#FFE4E1", "#FA8072", "#FF6347", "#E9967A", "#FF7F50", "#FF4500", "#FFA07A", "#A0522D", "#FFF5EE", "#D2691E", "#8B4513", "#F4A460", "#FFFACD", "#F0E68C", "#EEE8AA", "#BDB76B", "#FFD700", "#F5F5DC", "#FFFFE0", "#FAFAD2", "#808000", "#FFFF00", "#6B8E23", "#9ACD32", "#556B2F", "#8FBC8F", "#98FB98", "#90EE90", "#228B22", "#32CD32", "#006400", "#008000", "#00FFFF", "#00BFFF", "#4682B4", "#1E90FF", "#708090", "#708090", "#4169E1", "#E6E6FA", "#00008B", "#0000FF", "#6A5ACD", "#9370DB", "#4B0082", "#BA55D3", "#D8BFD8", "#EE82EE", "#67B9EE", "#CEEDA5", "#9F6AE1", "#FEA26E", "#6BA48F", "#EA3535", "#8D96B7"];
    
        zones.forEach((zone, index) => zone.color = colors[index]);
    
        // 시간 label 만들기
        for (let data of dataSource) {
            if (data !== undefined) {
                const timeStamp = data.map((item) => item.timeStamp);

                for (let time of timeStamp) {
                    let date = new Date(time);
                    const getDate = ReportResource.getDate(date);

                    if (getDate === labels[0]) break;
                    labels.push(getDate);
                }
                break;
            }
        }
    
        // chart dataset 만들기
        const getDataByMaterialID = (materialID) => {
            const dataSets = [];

            dataSource.forEach((data, i) => {
                if (data !== undefined) {
                    const zoneInfo = zones.find((item) => item.zoneID === i);
                    const datas = dataSource[zoneInfo.zoneID];
                    let filteredData = null;
                    if (this.props.curDataPeriodType === ReportResource.dataPeriodType.hour) {
                        filteredData = datas.filter(item => item.materialID === materialID);
                    } else if (this.props.curDataPeriodType === ReportResource.dataPeriodType.minute) {
                        filteredData = datas.filter(item => item.materialID === materialID);   
                    }

                    if (filteredData.length > 0) {
                        dataSets.push({
                            label: zoneInfo.sensorName,
                            data: filteredData.map((item) => item.sensorValue),
                            borderColor: zoneInfo.color,
                            borderWidth: 2,
                            fill: false,
                        });
                    }
                }
            });

             return dataSets;
        };
    
        // data 측정 단위 뽑기
        const getDataByMaterialUOM = (materialID) => {
            let materialUOM = '';

            dataSource.forEach((data, i) => {
                if (data !== undefined) {
                    const zoneInfo = zones.find((item) => item.zoneID === i);
                    const datas = dataSource[zoneInfo.zoneID];
                    const filteredData = datas.filter(item => item.materialID === materialID);

                    if (filteredData.length > 0) {
                        materialUOM = filteredData[0].materialUOM;
                    }
                }
            });

            return materialUOM ? materialUOM : '';
        };
    
        const chartComponents = (type, materialUOM, datasets) => (
            <div className={'reportGraphBox'} key={'reportLineGraph' + type}>
                <span>[{type}]</span>
                <div className={'reportGraphArea'} style={{ padding: '10px' }}>
                    <LineChart
                        labels={labels}
                        datasets={datasets}
                        materialUOM={materialUOM}
                    />
                </div>
            </div>
        );
    
        const dataSets = {};
        const materialUOM = {};

        for (let material of materials) {
            const type = material.id;

            // 풍향/풍속 데이터 제외
            if(type !== 261 && type !== 262) {
                dataSets[type] = getDataByMaterialID(type);
                materialUOM[type] = getDataByMaterialUOM(type);
            }
        }
    
        for (let type in dataSets) {
            let material = materials.find((material) => (material.id === Number(type) && material.id !== 261 && material.id !== 262));
            ui.push(chartComponents(material.materialName, materialUOM[type], dataSets[type]));
        }
    
        return ui;
    }

    // 풍향&풍속 Bar chart 생성
    getWindChart = (zones, dataSource) => {
        let ui = [];

        for(let i = 0; i < dataSource.length; i++) {
            if(dataSource[i] !== undefined) {
                const zoneInfo = zones.find((item) => item.zoneID === i);
                const datas = dataSource[zoneInfo.zoneID];
                
                const windDirectionDatas = datas.filter((item) => item.materialID === 261);
                const windSpeedDatas = datas.filter((item) => item.materialID === 262);

                if(windDirectionDatas.length > 0 && windSpeedDatas.length > 0) {
                    ui.push(
                        <div className={'reportGraphBox'} key={'reportBarGraph' + i}>
                            <span>[{zoneInfo.sensorName}]</span>
                            <div className={'reportGraphPolarArea'} style={{ padding: '10px' }}>
                                <WindChart
                                    windDirectionDatas={windDirectionDatas}
                                    windSpeedDatas={windSpeedDatas}
                                    getStringWindDirection={this.props.getStringWindDirection}
                                />
                            </div>
                        </div>
                    );
                }
            }
        }
        return ui;
    }

    render() {
        let windChartUI = [];
        let lineChartUI = [];

        const zones = this.props.sensorDatas;
        const dataSource = this.props.dataSource;
        if(zones !== null && dataSource !== null) {
            windChartUI = this.getWindChart(zones, dataSource);
            lineChartUI = this.getLineChart(zones, dataSource);
        }

        const layout = this.props.layout;

        return (
            <>
            <ReportGraphComponent id={'spWrap'} $layout={layout}>
                <ul className={'reportGraphTitle'}>
                    <li className={layout === 2 ? 'downSizeScreenIcon' : 'wideScreenIcon2'} onClick={() => this.props.handleLayout(2)}></li>
                </ul>
                <div className={'reportGraphContents'}>
                    {lineChartUI}

                    {/* 풍향, 풍속 차트 */}
                    {windChartUI}
                </div>
            </ReportGraphComponent>
            </>
        );
    }
}

export default ReportGraph;