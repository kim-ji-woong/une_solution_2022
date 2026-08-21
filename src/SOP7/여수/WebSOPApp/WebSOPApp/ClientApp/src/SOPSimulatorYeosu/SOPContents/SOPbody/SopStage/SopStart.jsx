import React, { Component } from 'react';

import { SopStartBox } from "./../../../styled";
import { SopFlexBox } from "./../../../styled";

import { SopFlexBoxS1 } from "./../../../styled";
import { SopFlexBoxS2 } from "./../../../styled";
import { SopFlexBoxS3 } from "./../../../styled";
//import { SopActiveFlexBox } from "./../../../styled";

import { SopStartTitle } from "../../../styled";
import { SopStartBtn } from "../../../styled";
import { SopCompletion } from "../../../styled";
import { SopDLocation } from "../../../styled";
//import { InputBoxD } from "../../../styled";
import { SopTabArea } from "../../../styled";
import { SopTabAreaActive } from "../../../styled";
//import { ApplicationBtn } from "../../../styled";


import $ from 'jquery';


class SopStart extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        $("#btn_toggle").click(function () {
            $("#Toggle").toggle();
        });

        $('.tabs-stage div').hide();
        $('.tabs-stage div:first').show();
        $('.tabs-nav li:first').addClass('tab-active');

        // Change tab class and display content
        $('.tabs-nav a').on('click', function (event) {
            event.preventDefault();
            $('.tabs-nav li').removeClass('tab-active');
            $(this).parent().addClass('tab-active');
            $('.tabs-stage div').hide();
            $($(this).attr('href')).show();
        });
    }


    render() {
        return (
          <>
            {/* active ui */}
                {/* <SopStartBox id="startBox" className="active">
                <SopFlexBoxS1>
                  <SopStartTitle className="active">1.시작
                    <div id="Toggle" style={{ display: 'none' }}>
                        <SopFlexBox>
                            <SopDLocation className="active">재난 위치
                                <input type="text" className="active" />
                            </SopDLocation>
                        </SopFlexBox>
                        <SopTabAreaActive>
                            <div className="tabs">
                                <ul className="tabs-nav">
                                   <li style={{ width: '40%' }}><a href="#tab-1">현재 시간을 재난발생시간으로 설정</a></li>
                                   <li style={{ width: '30%' }}><a href="#tab-2">재난발생 시간 입력</a></li>
                                   <li style={{ width: '20%' }}><a href="#tab-3"></a></li>
                                </ul>
                                <div className="tabs-stage">
                                    <div id="tab-1">
                                        <span className="tabTextBox"><input type="text"  className="active" />년</span>
                                        <span className="tabTextBox"><input type="text"  className="active" />월</span>
                                        <span className="tabTextBox"><input type="text"  className="active" />일</span>
                                        <span className="tabTextBox"><input type="text"  className="active" /></span>
                                        <span className="tabBtn active">적용</span>
                                    </div>
                                    <div id="tab-2">
                                        <span className="tabTextBox"><input type="text"  className="active" />년</span>
                                        <span className="tabTextBox"><input type="text"  className="active" />월</span>
                                        <span className="tabTextBox"><input type="text"  className="active" />일</span>
                                        <span className="tabTextBox"><input type="text"  className="active" /></span>
                                        <span className="tabBtn active">적용</span>
                                    </div>
                                    <div id="tab-3">
                                    </div>
                                </div>
                            </div>
                        </SopTabAreaActive>
                    </div>
                  </SopStartTitle>
                </SopFlexBoxS1>
                <SopFlexBoxS2>
                  <div style={{ padding: '20px 40px' }}>
                     <SopStartBtn id="btn_toggle" className="active">시작</SopStartBtn>
                  </div>
                </SopFlexBoxS2>
                <SopFlexBoxS3>
                  <SopCompletion></SopCompletion>
                </SopFlexBoxS3>
               </SopStartBox> */}


               {/* disable ui */}
                <SopStartBox id="startBox">
                  <SopFlexBoxS1>
                    <SopStartTitle>1.시작
                        <div id="Toggle" style={{ display: 'none' }}>
                            <SopFlexBox>
                                <SopDLocation>재난 위치
                                    <input type="text"/>
                                </SopDLocation>
                            </SopFlexBox>
                            <SopTabArea>
                                <div className="tabs">
                                    <ul className="tabs-nav">
                                        <li style={{ width: '40%' }}><a href="#tab-1">현재 시간을 재난발생시간으로 설정</a></li>
                                        <li style={{ width: '30%' }}><a href="#tab-2">재난발생 시간 입력</a></li>
                                        <li style={{ width: '20%' }}><a href="#tab-3"></a></li>
                                    </ul>
                                    <div className="tabs-stage">
                                        <div id="tab-1">
                                            <span className="tabTextBox"><input type="text" placeholder="2020" />년</span>
                                            <span className="tabTextBox"><input type="text" placeholder="08" />월</span>
                                            <span className="tabTextBox"><input type="text" placeholder="11" />일</span>
                                            <span className="tabTextBox"><input type="text" placeholder="14 : 09" /></span>
                                            <span className="tabBtn">적용</span>
                                        </div>
                                        <div id="tab-2">
                                            <span className="tabTextBox"><input type="text" placeholder="2020" />년</span>
                                            <span className="tabTextBox"><input type="text" placeholder="08" />월</span>
                                            <span className="tabTextBox"><input type="text" placeholder="11" />일</span>
                                            <span className="tabTextBox"><input type="text" placeholder="14 : 09" /></span>
                                            <span className="tabBtn">적용</span>
                                        </div>
                                        <div id="tab-3">
                                        </div>
                                    </div>
                                </div>
                            </SopTabArea>
                        </div>
                    </SopStartTitle>
                </SopFlexBoxS1>
                <SopFlexBoxS2>
                    <div style={{ padding: '20px 40px' }}>
                        <SopStartBtn id="btn_toggle">시작</SopStartBtn>
                    </div>
                </SopFlexBoxS2>
                <SopFlexBoxS3>
                    <SopCompletion></SopCompletion>
                </SopFlexBoxS3>
             </SopStartBox>
          </>
        );
    }
}

export default SopStart;