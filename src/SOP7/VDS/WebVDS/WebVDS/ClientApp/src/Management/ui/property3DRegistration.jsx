import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';


class Property3DRegistration extends Component {

    render() {
        return (
            <>
                <div style={{ display: 'flex' }}>
                    <span className={dash.userRightTitle}>3D자산 신규등록</span>
                    <span className={dash.managementClose}></span>
                </div>

                <span className={dash.newRegistration}>신규등록</span>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div className={dash.categoryBoxIT}>
                        <span>구분</span>
                        <select>
                            <option>RACK</option>
                            <option>IT자산</option>
                        </select>
                    </div>
                    <div className={dash.memoRegiBox}>
                        <span>메모</span>
                        <div className={dash.memo3DIconDis}></div>
                    </div>
                </div>

                <div className={dash.regiArea}>
                    <div className={dash.registrationBox}>
                        <div className={dash.registration3DFlex1}>
                            {/* <div className={dash.sortationRBox}>
                                <span>구분</span>
                                <select>
                                    <option>직접입력</option>
                                    <option>서버</option>
                                    <option>네트워크</option>
                                    <option>기타</option>
                                </select>
                            </div> */}
                            <div className={dash.modelPropertyRBox}>
                                <span>모델명</span>
                                <input type="text" placeholder="" />
                            </div>
                            <div className={dash.manufacturerBoxR}>
                                <span>제조사</span>
                                <input type="text" placeholder="" />
                            </div>
                            <div className={dash.kindPropertyRBox}>
                                <span>종류</span>
                                <select>
                                    <option>A-Type</option>
                                    <option>B-Type</option>
                                </select>
                            </div>
                            <div className={dash.unitRBox}>
                                <span>Unit</span>
                                <input type="text" placeholder="" />
                            </div>
                        </div>
                        <div className={dash.registration3DFlex2}>
                            {/* <div className={dash.colorBox}>
                                <span>색상</span>
                                <select>
                                    <option>Black</option>
                                    <option>Gray</option>
                                </select>
                            </div> */}
                            <div className={dash.colorBox}>
                                <span>카테고리</span>
                                <select>
                                    <option>서버</option>
                                    <option>네트워크</option>
                                    <option>어플라이언스</option>
                                    <option>백업</option>
                                    <option>스토리지</option>
                                    <option>보안</option>
                                </select>
                            </div>
                            <div className={dash.modelSizeBox}>
                               <span>크기</span>
                               <div className={dash.modelInputBox}>
                                 <div className={dash.modelInput1}><input type="text" placeholder="W" /></div>
                                 <div className={dash.modelInput2}><input type="text" placeholder="D" /></div>
                                 <div className={dash.modelInput3}><input type="text" placeholder="H" /></div>
                               </div>
                               <div className={dash.unitSelectBox}>
                                 {/* <select>
                                    <option>mm</option>
                                    <option>cm</option>
                                 </select> */}
                                 <span>mm</span>
                               </div>
                            </div>
                        </div>

                        {/* <div className={dash.registration3DFlex3}>
                           <div className={dash.modelFileBox}>
                                <span>파일</span>
                                <div>
                                  <input type="text" placeholder="" />
                                  <div className={dash.modelFileIcon}></div>
                                </div>
                            </div>
                        </div> */}
                    </div>

                    <div className={dash.userRightsBtn3D}>
                        <span className={dash.registrationBtn}>등록</span>
                    </div>
                </div>

                {/* <div className={dash.userDashedLine}></div>
                <div className={dash.userFlexBox}>
                    <span className={dash.userListTitle}>신규등록 미리보기</span>
                    <span className={dash.recycleBinIcon}></span>
                </div>
                <div className={dash.managementTable}>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}><input type="checkBox" /></th>
                                <th style={{ width: '12%' }}>등록일자</th>
                                <th style={{ width: '12%' }}>카테고리</th>
                                <th style={{ width: '12%' }}>구분</th>
                                <th style={{ width: '12%' }}>제조사</th>
                                <th style={{ width: '12%' }}>종류</th>
                                <th style={{ width: '16%' }}>Unit</th>
                                <th style={{ width: '16%' }}>모델명</th>
                                <th style={{ width: '15%' }}>크기(W*D*H)</th>
                                <th style={{ width: '15%' }}>상세보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={dash.activeText}>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>RACK</td>
                                <td>기타</td>
                                <td>DELL</td>
                                <td>A타입</td>
                                <td>42</td>
                                <td>SVR_1</td>
                                <td>600*900*2069</td>
                                <td><span className={dash.plusIconR}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div> */}

            </>
        );
    }
}

export default Property3DRegistration;