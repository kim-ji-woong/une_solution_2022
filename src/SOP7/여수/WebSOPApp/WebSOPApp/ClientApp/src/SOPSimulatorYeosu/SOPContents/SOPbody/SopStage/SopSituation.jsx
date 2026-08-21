import React, { Component } from 'react';

import { SopSituationBox } from "../../../styled";
import { SopFlexBoxS1 } from "./../../../styled";
import { SopFlexBoxS2 } from "./../../../styled";
import { SopFlexBoxS3 } from "./../../../styled";
import { SopStartTitle } from "../../../styled";
import { SopDisableTitle } from "../../../styled";
import { SopStartBtn } from "../../../styled";
import { SopNextBtn } from "../../../styled";
import { SoptotalBtn } from "../../../styled";
import { SopCompletion } from "../../../styled";
import { SopIncomplete } from "../../../styled";

import { PersonIcon } from "../../../styled";

import { PersonDropBox } from "../../../styled";

import { SopCheckBox } from "../../../styled";
import { SopSMSBtn } from "../../../styled";
import { SopEmailBtn } from "../../../styled";

import { SmallTri } from "../../../styled";

import uneStyles from '../../../../Common/css/uneCommon.module.css';
import '../../../../SDMS/css/popup.css';

import $ from 'jquery';



class SopSituation extends Component {
    constructor(props) {
        super(props);

    }

    /* showDropBox(){
        $('.' + uneStyles.dropArea).css({ visibility: 'visible' });
    } */

    componentDidMount() {
        $(document).ready(function () {
            $(".abc").click(function () {
              $(".dropArea").toggle();
            });
         });
    }

    render() {
        return (
            <>
                {/* active ui */}
                <SopSituationBox className="active">
                    <SopFlexBoxS1>
                        <SopDisableTitle  className="active" style={{ display: 'flex' }}>2.상황접수
                            <div style={{ display: 'flex', position: 'absolute', zIndex: '1', left: '120px' }}>
                                <PersonIcon className="active" className="abc"></PersonIcon>
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
                        <div style={{ display: 'flex' , width: '100%' , alignItems: 'center', padding: '14px 0px' }}>
                           <div className="check_wrap">
                             <input type="checkbox" id="check_btn_1" />
                             <label htmlFor="check_btn_1"></label>
                           </div>
                          <p className="active">행동요령</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                          <div className="check_wrap">
                            <input type="checkbox" id="check_btn_2" />
                            <label htmlFor="check_btn_2"></label>
                          </div>
                          <p className="active">1.기상특보 이후 기상에 기인하여 시설물 파손 등 회사 내 안전사고 접수시</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                          <div className="check_wrap">
                            <input type="checkbox" id="check_btn_3" />
                            <label htmlFor="check_btn_3"></label>
                          </div>
                           <p className="active">2.현장 확인 및 모니터링 중 안전사고 상황을 인지한 경우</p>
                        </div>
                    </SopFlexBoxS1>

                    <SopFlexBoxS2>
                        <SopNextBtn className="active">다음</SopNextBtn>
                        <SoptotalBtn className="active">전체전파</SoptotalBtn>
                        <div style={{ padding: '14px 0px' }}>
                          <SopSMSBtn  className="active"></SopSMSBtn>
                          {/* <SopEmailBtn className="active" ></SopEmailBtn> */}
                        </div>
                        <div style={{ padding: '14px 0px' }}>
                          <SopSMSBtn  className="active"></SopSMSBtn>
                          {/* <SopEmailBtn  className="active"></SopEmailBtn> */}
                        </div>
                    </SopFlexBoxS2>

                    <SopFlexBoxS3>
                        <div style={{ padding: '0px 40px' }}>
                            <SopCompletion>완료</SopCompletion>
                            <SopIncomplete>미완료</SopIncomplete>
                            <SopIncomplete>미완료</SopIncomplete>
                        </div>
                    </SopFlexBoxS3>
                </SopSituationBox> 


                {/* disable ui */}
                {/* <SopSituationBox>
                    <SopFlexBoxS1>
                        <SopDisableTitle style={{ display: 'flex' }}>2.상황접수
                            <div style={{ display: 'flex', position: 'absolute', zIndex: '1', left: '120px' }}>
                                <PersonIcon className="abc"></PersonIcon>
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
                        <div style={{ display: 'flex' , width: '100%' , alignItems: 'center', padding: '14px 0px' }}>
                           <div className="check_wrap">
                             <input type="checkbox" id="check_btn_1" />
                             <label htmlFor="check_btn_1"></label>
                           </div>
                           <p>행동요령</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                         <div className="check_wrap">
                            <input type="checkbox" id="check_btn_2" />
                            <label htmlFor="check_btn_2"></label>
                         </div>
                          <p>1.기상특보 이후 기상에 기인하여 시설물 파손 등 회사 내 안전사고 접수시</p>
                        </div>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', padding: '14px 0px' }}>
                            <div className="check_wrap">
                                <input type="checkbox" id="check_btn_3" />
                                <label htmlFor="check_btn_3"></label>
                            </div>
                           <p>2.현장 확인 및 모니터링 중 안전사고 상황을 인지한 경우</p>
                        </div>
                    </SopFlexBoxS1>
                    <SopFlexBoxS2>
                        <SopNextBtn>다음</SopNextBtn>
                        <SoptotalBtn>전체전파</SoptotalBtn>
                        <div style={{ padding: '14px 0px' }}>
                          <SopSMSBtn></SopSMSBtn>
                          <SopEmailBtn></SopEmailBtn>
                        </div>
                        <div style={{ padding: '14px 0px' }}>
                          <SopSMSBtn></SopSMSBtn>
                          <SopEmailBtn></SopEmailBtn>
                        </div>
                    </SopFlexBoxS2>
                    <SopFlexBoxS3>
                        <div style={{ padding: '0px 40px' }}>
                            <SopCompletion>완료</SopCompletion>
                            <SopIncomplete>미완료</SopIncomplete>
                            <SopIncomplete>미완료</SopIncomplete>
                        </div>
                    </SopFlexBoxS3>
                </SopSituationBox> */}

            </>
        );
    }
}

export default SopSituation;