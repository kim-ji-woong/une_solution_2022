
import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { SopTable } from "./../../styled";
import { ArrowSmallDown } from "./../../styled";
import { SOPselectBox } from "./../../styled";

class SopTable2 extends Component {

    render() {
        return (
           <>
              <SopTable> 
                <table class="yeosuTable" width="100%">
                    <tr class="yeosuSOPTr">
                        <th width="5%">번호</th>
                        <th width="65%">목록명</th>
                        {/* <th width="20%">전체<ArrowSmallDown></ArrowSmallDown> */}
                        <th width="20%">

                        <SOPselectBox>
                           <select className="sopTableSelect">
                             <option value="전체">전체</option>
                             <option value="평일/주간">평일/주간</option>
                             <option value="휴일/야간">휴일/야간</option>
                           </select>
                        </SOPselectBox>
                        </th>
                        <th width="10%">날짜</th>
                    </tr>
                    <tr>
                        <td width="5%">01</td>
                        <td width="65%"><Link to="/sop-simulatorYeosuList">자연재해 - 기상특보 - 기상특보</Link></td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">02</td>
                        <td width="65%">화재 - 화재 - 건물화재</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">03</td>
                        <td width="65%">화재 - 화재 - 화재_자동</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">04</td>
                        <td width="65%">화재 - 화재 - 화재_수동</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">05</td>
                        <td width="65%">누출사고 - 가스 - 누출_수동</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">06</td>
                        <td width="65%">누출사고 - 가스 - 누출_자동</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">07</td>
                        <td width="65%">기타 - 안전사고 - 안전사고_자동</td>
                        <td width="20%">평일/주간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                    <tr>
                        <td width="5%">08</td>
                        <td width="65%">화재 - 폭발화재 - 회의실_1에서의 화재 발생시 대응 조치</td>
                        <td width="20%" class="yeosuRedFont">휴일/야간</td>
                        <td width="10%">2021-08-02 12:42:53</td>
                    </tr>
                </table>
              </SopTable>
           </>
       );
    }
}

export default SopTable2;