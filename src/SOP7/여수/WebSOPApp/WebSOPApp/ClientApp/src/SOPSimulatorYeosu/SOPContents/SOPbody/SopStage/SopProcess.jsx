import React, { Component } from 'react';

import { SopProcessBox } from "../../../styled";
import { SopFlexBox } from "./../../../styled";
import { SopFlexBoxS1 } from "./../../../styled";
import { SopFlexBoxS2 } from "./../../../styled";
import { SopFlexBoxS3 } from "./../../../styled";

//import { SopFlexBox } from "./../../../styled";
import { SopStartTitle } from "../../../styled";
import { SopDisableTitle } from "../../../styled";
import { SopStartBtn } from "../../../styled";
import { SopNextBtn } from "../../../styled";
import { SoptotalBtn } from "../../../styled";
import { SopCompletion } from "../../../styled";
import { SopIncomplete } from "../../../styled";

import { PersonIcon } from "../../../styled";
import { SopCheckBox } from "../../../styled";
import { SopSMSBtn } from "../../../styled";
import { SopEmailBtn } from "../../../styled";

import { SmallTri } from "../../../styled";
import { PersonDropBox } from "../../../styled";



class SopProcess extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                {/* active ui */}
                <SopProcessBox className="active">
                    <SopFlexBoxS1>
                        <SopDisableTitle className="active" style={{ display: 'flex' }}>3.안전사고 프로세스 실행

                            <div style={{ display: 'flex', position: 'absolute', zIndex: '1', left: '220px' }}>
                                <PersonIcon className="active" onclick={this.showDropBox}></PersonIcon>
                                <div style={{ display: 'flex' }} className="dropArea">
                                    <SmallTri></SmallTri>
                                    <PersonDropBox>
                                        <p>전파대상자 : 업체명 외 12곳</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                    </PersonDropBox>
                                </div>
                            </div>

                        </SopDisableTitle>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                        <div className="check_wrap">
                            <input type="checkbox" id="check_btn_1" />
                            <label htmlFor="check_btn_1"></label>
                        </div>
                          <p className="active">행동요령</p>
                        </div>

                        <div style={{ display: 'flex', width: '100%' , padding: '14px 0px' }}>
                           <div className="check_wrap">
                              <input type="checkbox" id="check_btn_2" />
                              <label htmlFor="check_btn_2"></label>
                           </div>
                           <p className="active">1.기상특보 발령 이후 기상에 기인하여 시설물 파손 등 회사 내 안전사고
                              프로세스에 의거하여 후속 절차 진행 - '안전사고(수동접수) 상황'
                              통합방재센터 대응 프로세스' SOP 실행</p>
                        </div>
                    </SopFlexBoxS1>

                    <SopFlexBoxS2>
                        <SopNextBtn className="active">다음</SopNextBtn>
                        <SoptotalBtn className="active">전체전파</SoptotalBtn>
                        <div style={{ padding: '14px 0px' }}>
                            <SopSMSBtn className="active"></SopSMSBtn>
                            {/* <SopEmailBtn className="active"></SopEmailBtn> */}
                        </div>
                    </SopFlexBoxS2>

                    <SopFlexBoxS3>
                        <div style={{ padding: '0px 40px' }}>
                            <SopIncomplete>미완료</SopIncomplete>
                            <SopIncomplete>미완료</SopIncomplete>
                        </div>
                    </SopFlexBoxS3>
                </SopProcessBox>


                {/* disable ui */}
                {/* <SopProcessBox>
                    <SopFlexBoxS1>
                        <SopDisableTitle style={{ display: 'flex' }}>3.안전사고 프로세스 실행

                            <div style={{ display: 'flex', position: 'absolute', zIndex: '1', left: '220px' }}>
                                <PersonIcon onclick={this.showDropBox}></PersonIcon>
                                <div style={{ display: 'flex' }} className="dropArea">
                                    <SmallTri></SmallTri>
                                    <PersonDropBox>
                                        <p>전파대상자 : 업체명 외 12곳</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                        <p>업체명</p>
                                    </PersonDropBox>
                                </div>
                            </div>

                        </SopDisableTitle>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                            <div className="check_wrap">
                                <input type="checkbox" id="check_btn_1" />
                                <label htmlFor="check_btn_1"></label>
                            </div>
                            <p>행동요령</p>
                        </div>

                        <div style={{ display: 'flex', width: '100%', padding: '14px 0px' }}>
                            <div className="check_wrap">
                                <input type="checkbox" id="check_btn_2" />
                                <label htmlFor="check_btn_2"></label>
                            </div>
                            <p>1.기상특보 발령 이후 기상에 기인하여 시설물 파손 등 회사 내 안전사고
                                프로세스에 의거하여 후속 절차 진행 - '안전사고(수동접수) 상황'
                                통합방재센터 대응 프로세스' SOP 실행</p>
                        </div>
                    </SopFlexBoxS1>

                    <SopFlexBoxS2>
                        <SopNextBtn>다음</SopNextBtn>
                        <SoptotalBtn>전체전파</SoptotalBtn>
                        <div style={{ padding: '14px 0px' }}>
                            <SopSMSBtn></SopSMSBtn>
                            <SopEmailBtn></SopEmailBtn>
                        </div>
                    </SopFlexBoxS2>

                    <SopFlexBoxS3>
                        <div style={{ padding: '0px 40px' }}>
                            <SopIncomplete>미완료</SopIncomplete>
                            <SopIncomplete>미완료</SopIncomplete>
                        </div>
                    </SopFlexBoxS3>
                </SopProcessBox> */}
            </>
        );
    }
}

export default SopProcess;