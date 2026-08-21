import React, { Component } from 'react';

import { SopFlowChartBox } from "./../../styled";
import { RefrushIcon } from "./../../styled";
import { StepBar } from "./../../styled";
import { EditIcon } from "./../../styled";

import { TriangleI } from "./../../styled";
import { TriangleA } from "./../../styled";
import { TriangleD } from "./../../styled";
import { TriangleS } from "./../../styled";

/* import EditIcon2 from "../../../../resource/image/sop/editCircle.png"; */

class SopFlowChart extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                <SopFlowChartBox>
                    <span className="sopBoxTitle">
                        <span className="sopTitle">기상특보</span>
                        <span className="sopRefrush">새로고침
                            <RefrushIcon></RefrushIcon>
                        </span>
                    </span>

                    <StepBar>
                      <span className="interest">관심</span>
                      <TriangleI></TriangleI>
                      <span className="attention">주의</span>
                      <TriangleA></TriangleA>
                      <span className="danger">경계</span>
                      <TriangleD></TriangleD>
                      <span className="serious">심각</span>
                      <TriangleS></TriangleS>
                    </StepBar>
                    <EditIcon>
                     {/* <EditIcon2></EditIcon2> */}
                    </EditIcon>
                </SopFlowChartBox>
            </>
        );
    }
}

export default SopFlowChart;