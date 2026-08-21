import React, { Component } from 'react';

import { SensorInfoBox } from './../../../../SDMS/styled';
import { SensorTitleE } from './../../../../SDMS/styled';
import { SopResultBox } from "../../../styled";
import { SensorEventBtn } from './../../../../SDMS/styled';


class SopResult extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {

    }

    render() {
        return (
            <>
                <SensorInfoBox style={{ position: 'absolute' , left: '40%', top: '40%', width: '359px' , height: '303px' }}>
                    <SensorTitleE>SOP결과 요약</SensorTitleE>
                    <SopResultBox>
                      <span>1.SOP유형 : 기상특보</span>
                      <span>2.재난위치 : 여수소방서 화학119구조대 옥상</span>
                      <span>3.발생시간 : 2023-01-09 17:18:11</span>
                      <span>4.SOP시작시간 : 2023-07-09 17:18:11</span>
                      <span>5.SOP종료시간 : 2023-07-09 17:18:13</span>
                      <span>6.단계 : 심각</span>
                    </SopResultBox>
                    <SensorEventBtn>
                        <span className="spreading">다운로드</span>
                        <span className="downBtn">닫기</span>
                    </SensorEventBtn>
                </SensorInfoBox>
            </>
        );
    }
}

export default SopResult;