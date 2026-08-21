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

    // 데이터 0일 경우를 위해
const CustomBar = (props) => {
    const { fill, x, y, width, height, data1, data2, chartWidth } = props;

    if(data1 === 0 && data2 === 0 ) {
        return <rect x={x} y={y} width={chartWidth} height={10} stroke="none" fill={'#dbdbdb'} rx={5} />;
    } else {
        return <rect x={x} y={y} width={width} height={height} stroke="none" fill={fill} rx={5} />;
    }
};

export class AccessChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.props = props;
    }

    getDisplayData = () => {
        const data = [];

        let temp = {};
        temp.name = (this.props.buildingGroupName ? this.props.buildingGroupName : "");
        temp.data1 = (this.props.workerCnt ? this.props.workerCnt : 0);
        temp.data2 = (this.props.visitorCnt ? this.props.visitorCnt : 0);

        data.push(temp);

        return data;
    }

    // 라벨 포지션 수정을 위해
    renderCustomizedLabelMember = (props) => {
        const { x, y, value } = props;

        return <text x={x} y={y - 10} fontSize="12" fill="#5398FF" fontWeight="normal">{`임직원 : ${value}`}</text>;
    };

    renderCustomizedLabelVisitor = (props) => {
        const { y, value } = props;

        let width = this.props.chartWidth;
        let regex = /[^0-9]/g;
        let chartWidth = width?.replace(regex, "") - 105;

        return <text x={chartWidth} y={y - 10} fontSize="12" fill="#D3D5D9" fontWeight="normal">{`방문자 : ${value}`}</text>;
    };

    render() {
        const data = this.getDisplayData();

        let width = this.props.chartWidth;
        let regex = /[^0-9]/g;
        let chartWidth = width?.replace(regex, "") - 60;
        
        return (
            <ResponsiveContainer height={70} width={chartWidth}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 18 }}
                    stackOffset="expand"
                    barSize={10}
                >
                    <XAxis hide type="number" />

                    <YAxis
                        hide
                        type="category"
                        dataKey="name"
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
        );
    }
}

export default withRouter(AccessChart);