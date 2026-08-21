import React, { Component } from 'react';

import $ from 'jquery';
import SDMSResource from '../../resource/id';
import content from '../../../Common/css/content.module.css';
import PopupDraggable from './popupDraggable';
import SettingsStore from '../../../Settings/settingsStore';
import SDMS from '../sdms';

import { SensorInfoBox } from './../../styled';
import { SensorTitle } from './../../styled';
import { SensorIconPOIBox } from './../../styled';
import { SeosorCloseIcon } from './../../styled';
 
import { POIadd, POIaddDis } from './../../styled';
import { POIdelete, POIdeleteDis } from './../../styled';
import { POIchange, POIchangeDis } from './../../styled';
import { POImove, POImoveDis } from './../../styled';
import { SensorSearchBox } from './../../styled';
import { SearchIcon } from './../../styled';
import { SensorList2 } from './../../styled';
import { SensorListTitle } from './../../styled';

import { SensorselectBox } from './../../styled';
import { SensorListContents } from './../../styled';
import { SensorSelectBox } from './../../styled';

import { AtmosphereIconL } from './../../styled';
import { WaterQualityIconL } from './../../styled';
import { WeatherIconL } from './../../styled';
import { VOCIconL } from './../../styled';
import { CCTVIconL } from './../../styled';
import { BacteriaIconL } from './../../styled';


import { POIAddBox } from './../../styled';
import { POIAddWaterBox } from './../../styled';
import { SClassification } from './../../styled';
import { SBranchName } from './../../styled';
import { SAddress } from './../../styled';
import { Scategory, ScategoryWater } from './../../styled';
import { POIBtn } from './../../styled';
import { TriBox, TriBox2 } from './../../styled';

class POIEditInfo extends Component {

    constructor(props) {
        super(props);

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));
    }

    componentDidMount() {

    }


    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }

        //this.setScrollbar();
    }

    repositionPopup(popupState) {
        let data = popupState.poiEditInfo;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboard + ' ' + content.viewDashboardBoxD)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    render() {
        return (
            <>
                <div id={this.props.popupType} className={content.poiEditInfoPopup + " " + SDMSResource.UISection}>
                    <PopupDraggable
                        id={this.props.popupType}
                        popupMinWidth={372}
                        popupMinHeight={463}
                        topSize={10}
                        popupState={this.props.popupState}
                        setActiveDragPopup={this.props.setActiveDragPopup}
                        setPopupState={this.props.setPopupState}
                    >

                  <SensorInfoBox /* style={{ position: 'relative' }} */>
                    <SensorTitle>POI편집모드</SensorTitle>
                    <SeosorCloseIcon onClick={() => this.props.setVisiblePopups(SDMS.menu.poiEditInfo, false)}></SeosorCloseIcon>
                       <SensorIconPOIBox>
                         <POIadd></POIadd>
                         {/* <POIdelete></POIdelete> */}
                         {/* <POImove></POImove> */}
                         <POIdeleteDis></POIdeleteDis>
                         <POIchangeDis></POIchangeDis>     
                         <POImoveDis></POImoveDis>
                       </SensorIconPOIBox>

                       <SensorSearchBox>
                         <input type="text" placeholder="검색어를 입력해주세요" />
                         <SearchIcon></SearchIcon>
                       </SensorSearchBox>

                       <SensorList2>
                         <SensorListTitle>
                            <span>센서 목록</span>

                           {/* <span class="selectBox">
                              <option>전체</option>
                              <option>대기</option>
                              <option>수질</option>
                              <option>기상</option>
                              <option>VOC</option>
                              <option>CCTV</option>
                              <option>악취</option> 
                            </span> */}

                            <SensorselectBox>
                                <select className="sensorList" name="SensorList">
                                   <option value="전체" selected="selected">전체</option>
                                   <option value="대기">대기</option>
                                   <option value="수질">수질</option>
                                   <option value="기상">기상</option>
                                   <option value="VOC">VOC</option>
                                   <option value="CCTV">CCTV</option>
                                   <option value="악취">악취</option>
                                </select>
                            </SensorselectBox>
                         </SensorListTitle>
                         <SensorListContents>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>GS칼텍스0{/* <input type="text" className="sensorListInput" /> */}</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>GS칼텍스1</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>GS칼텍스2</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>GS칼텍스3</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>롯데케피탈 여수 1공장</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>여천NCC 여수 1공장</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <AtmosphereIconL></AtmosphereIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <WaterQualityIconL></WaterQualityIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <WeatherIconL></WeatherIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <VOCIconL></VOCIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <CCTVIconL></CCTVIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                            <div className="SensorListLine">
                                <BacteriaIconL></BacteriaIconL>
                                <span>여천NCC 여수 2공장</span>
                            </div>
                        </SensorListContents>
                       </SensorList2>
                    </SensorInfoBox>
                    </PopupDraggable>

                {/* 추가 팝업창 */}
                <div style={{ display : 'flex' , position: 'absolute', left: '-230px', top: '0px' }}>
                <POIAddBox>
                   <span>추가</span>
                   <SClassification>
                     <span>센서분류</span>
                     <select name="">
                        <option value="대기" selected>대기</option>
                        <option value="수질">수질</option>
                        <option value="기상">기상</option>
                        <option value="VOC">VOC</option>
                        <option value="CCTV">CCTV</option>
                        <option value="악취">악취</option>
                     </select>
                   </SClassification>
                   <SBranchName>
                     <span>지점명</span>
                     <input type="text" placeholder="지점명을 입력해주세요" />
                   </SBranchName>
                   <SAddress>
                     <span>센서주소</span>
                     <input type="text" placeholder="주소를 입력해주세요" />
                   </SAddress>
                   <Scategory>
                     <span>센서항목</span>
                     <input type="text" placeholder="미세먼지(PM10)" />
                     <input type="text" placeholder="초미세먼지(PM2.5)" />
                     <select name="">
                        <option value="추가할 항목을 선택해주세요" selected>추가할 항목을 선택해주세요</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                     </select>
                     <select name="">
                        <option value="추가할 항목을 선택해주세요" selected>추가할 항목을 선택해주세요</option>
                        <option value="02">02</option>
                        <option value="03">03</option>
                     </select>
                   </Scategory>
                   <POIBtn>
                     <span className="reset">초기화</span>
                     <span className="save">저장</span>
                   </POIBtn>
                </POIAddBox>
                <TriBox></TriBox>
                </div>

                {/* 수정 팝업창 */}
                <div style={{ display: 'flex' , position: 'absolute', left: '-500px', top: '0px' }}>
                <POIAddBox>
                    <span>수정</span>
                    <SClassification>
                        <span>센서분류</span>
                        <select name="">
                            <option value="대기" selected>대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                            <option value="악취">악취</option>
                        </select>
                    </SClassification>
                    <SBranchName>
                        <span>지점명</span>
                        <input type="text" placeholder="지점명을 입력해주세요" />
                    </SBranchName>
                    <SAddress>
                        <span>센서주소</span>
                        <input type="text" placeholder="주소를 입력해주세요" />
                    </SAddress>
                    <Scategory>
                        <span>센서항목</span>
                        <input type="text" placeholder="미세먼지(PM10)" />
                        <input type="text" placeholder="초미세먼지(PM2.5)" />
                        <select name="">
                            <option value="01" selected>01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                        </select>
                        <select name="">
                            <option value="01" selected>01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                        </select>
                    </Scategory>
                    <POIBtn>
                        <span className="reset">초기화</span>
                        <span className="save">저장</span>
                    </POIBtn>
                </POIAddBox>
                <TriBox2></TriBox2>
                </div>
                </div>


                {/* 대기센서 추가 팝업창 */}
                {/* <POIAddBox style={{ position: 'absolute', left: '700px', top: '300px' }}>
                    <span>추가</span>
                    <SClassification>
                        <span>센서분류</span>
                        <select name="">
                            <option value="대기" selected>대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                            <option value="악취">악취</option>
                        </select>
                    </SClassification>
                    <SBranchName>
                        <span>지점명</span>
                        <input type="text" placeholder="지점명을 입력해주세요" />
                    </SBranchName>
                    <SAddress>
                        <span>센서주소</span>
                        <input type="text" placeholder="주소를 입력해주세요" />
                    </SAddress>
                    <Scategory>
                        <span>센서항목</span>
                        <input type="text" placeholder="미세먼지(PM10)" />
                        <input type="text" placeholder="초미세먼지(PM2.5)" />
                        <select name="">
                            <option value="추가할 항목을 선택해주세요" selected>추가할 항목을 선택해주세요</option>
                            <option value="없음">없음</option>
                        </select>
                        <select name="">
                            <option value="추가할 항목을 선택해주세요" selected>추가할 항목을 선택해주세요</option>
                            <option value="없음">없음</option>
                            <option value="CL2">CL2</option>
                            <option value="NH3">NH3</option>
                            <option value="HCL">HCL</option>
                            <option value="VOC">VOC</option>
                            <option value="H2S">H2S</option>
                        </select>
                    </Scategory>
                    <POIBtn>
                        <span className="reset">초기화</span>
                        <span className="save">저장</span>
                    </POIBtn>
                </POIAddBox> */}

                {/* 수질센서 추가 팝업창 */}
                {/* <POIAddWaterBox style={{ position: 'absolute', left: '900px', top: '300px' }}>
                    <span>추가</span>
                    <SClassification>
                        <span>센서분류</span>
                        <select name="">
                            <option value="대기" selected>대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                            <option value="악취">악취</option>
                        </select>
                    </SClassification>
                    <SBranchName>
                        <span>지점명</span>
                        <input type="text" placeholder="지점명을 입력해주세요" />
                    </SBranchName>
                    <SAddress>
                        <span>센서주소</span>
                        <input type="text" placeholder="주소를 입력해주세요" />
                    </SAddress>
                    <ScategoryWater>
                        <span>센서항목</span>
                        <input type="text" placeholder="DO" />
                        <input type="text" placeholder="전기전도도" />
                        <input type="text" placeholder="탁도" />
                        <input type="text" placeholder="ph" />
                        <input type="text" placeholder="수온" />
                    </ScategoryWater>
                    <POIBtn>
                        <span className="reset">초기화</span>
                        <span className="save">저장</span>
                    </POIBtn>
                </POIAddWaterBox> */}


                {/* 수질센서 수정 팝업창 */}
                {/* <POIAddBox style={{ position: 'absolute', left: '1100px', top: '300px' }}>
                    <span>수정</span>
                    <SClassification>
                        <span>센서분류</span>
                        <select name="">
                            <option value="대기" selected>대기</option>
                            <option value="수질">수질</option>
                            <option value="기상">기상</option>
                            <option value="VOC">VOC</option>
                            <option value="CCTV">CCTV</option>
                            <option value="악취">악취</option>
                        </select>
                    </SClassification>
                    <SBranchName>
                        <span>지점명</span>
                        <input type="text" placeholder="지점명을 입력해주세요" />
                    </SBranchName>
                    <SAddress>
                        <span>센서주소</span>
                        <input type="text" placeholder="주소를 입력해주세요" />
                    </SAddress>
                    <Scategory>
                        <span>센서항목</span>
                        <input type="text" placeholder="미세먼지(PM10)" />
                        <input type="text" placeholder="초미세먼지(PM2.5)" />
                        <select name="">
                            <option value="염소가스(CI2)" selected>염소가스(CI2)</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                        </select>
                        <select name="">
                            <option value="없음" selected>없음</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                        </select>
                    </Scategory>
                    <POIBtn>
                        <span className="reset">초기화</span>
                        <span className="save">저장</span>
                    </POIBtn>
                </POIAddBox> */}
            </>
        );
    }
};

export default POIEditInfo;