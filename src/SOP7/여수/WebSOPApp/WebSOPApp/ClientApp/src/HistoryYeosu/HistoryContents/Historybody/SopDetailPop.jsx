import React, { Component } from 'react';


import { SopDetailBox } from "./../../styled";
import { SensorTitle } from "../../styled";
import { SeosorCloseIcon } from "../../styled";
import { SopDetailTable } from "../../styled";
import { SopSpreadTable } from "../../styled";



class SopDetailPop extends Component {
    render() {
        return (
            <>
                <div style={{ position: 'absolute', left: '40%', top: '40%' }}>
                  <SopDetailBox>
                    <SensorTitle>SOP 상세정보</SensorTitle>
                    <SeosorCloseIcon></SeosorCloseIcon>

                    <SopDetailTable>
                    <table className="sopDetailTable">
                      <thead>
                       <tr>
                         <th style={{ width: '10%' }}>NO.</th>
                         <th style={{ width: '20%' }}>프로세스 제목</th>
                         <th style={{ width: '30%' }}>전파 대상자</th>
                         <th style={{ width: '25%' }}>시간</th>
                         <th style={{ width: '15%' }}>완료여부</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>시작</td>
                          <td></td>
                          <td>2023-07-09 14:54</td>
                          <td>확인</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>상황접수</td>
                            <td></td>
                            <td>2023-07-09 14:54</td>
                            <td>실행중</td>
                        </tr>
                     </tbody>
                    </table>
                   </SopDetailTable>

                   <SopSpreadTable>
                     <table className="sopSpreadTable">
                     <thead>
                        <tr> 
                            <th style={{ width: '10%' }}>NO.</th>
                            <th style={{ width: '20%' }}>프로세스 제목</th>
                            <th style={{ width: '30%' }}>세부 임무/전파 메시지</th>
                            <th style={{ width: '25%' }}>시간</th>
                            <th style={{ width: '15%' }}>완료여부</th>
                        </tr>
                     </thead>
                     <tbody></tbody>
                     </table>
                   </SopSpreadTable>

                  </SopDetailBox>
                </div>
            </>
        );
    }
}

export default SopDetailPop;