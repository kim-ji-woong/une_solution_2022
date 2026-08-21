import React, { Component } from 'react';

import { SensorDetectBox } from './../../styled';
import { DisasterType } from './../../styled';
import { CriticalStage } from './../../styled';
import { ModeSelect } from './../../styled';
import { WriterBox } from './../../styled';

import { InquiryPeriod } from './../../styled';
import { InquiryPeriodSelect } from './../../styled';
import { SearchBtn } from './../../styled';


class SensorSOPSelect extends Component {

    render() {
        return (
            <>
                <SensorDetectBox>
                    <DisasterType>
                        <span>재난타입</span>
                        <select name="재난타입">
                            <option value="전체" selected>전체</option>
                            <option value="대기">대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                        </select>
                    </DisasterType>
                    <CriticalStage>
                        <span>위기단계</span>
                        <select name="위기단계">
                            <option value="전체" selected>전체</option>
                            <option value="대기">대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                        </select>
                    </CriticalStage>
                    <ModeSelect>
                        <span>모드</span>
                        <select name="모드">
                            <option value="전체" selected>전체</option>
                            <option value="대기">대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                        </select>
                    </ModeSelect>
                    <WriterBox>
                      <span>작성자</span>
                      <input type="text" name="writer" />
                    </WriterBox>
                    <InquiryPeriod>
                        <span>조회기간 지정</span>
                        <label htmlFor="date">
                            <input type="date"
                                id="date"
                                /* max="2077-06-20"
                                min="2077-06-05" */
                                value="2077-06-15" />
                        </label>
                    </InquiryPeriod>
                    <InquiryPeriodSelect>
                        <span>조회기간 선택</span>
                        <label htmlFor="date">
                            <input type="date"
                                id="date"
                                /* max="2077-06-20"
                                min="2077-06-05" */
                                value="2077-06-15" />
                        </label>
                    </InquiryPeriodSelect>
                    <SearchBtn>검색</SearchBtn>
                </SensorDetectBox>
            </>
        )
    }
}

export default SensorSOPSelect;