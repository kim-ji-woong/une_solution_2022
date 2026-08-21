import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { HistorySOPTables } from "./../../styled";
import { DownBox } from "./../../styled";
import { ArrowSmallDown } from "./../../styled";
import { HistorySelectBox } from "./../../styled";
import SopDetailPop from '../Historybody/SopDetailPop';


class HistorySOPTable extends Component {

    render() {
        return (
            <>
                <HistorySOPTables style={{ position: 'relative' }}>
                    <DownBox>
                        <span>전체 다운로드</span>
                        <span>선택 다운로드</span>
                    </DownBox>
                    <table className="historySopTable" width="100%">
                        <thead className="yeosuSOPTr">
                          <tr>
                            <th width="3%"><input type="checkbox" /></th>
                            <th width="3%">번호</th>
                            <th width="7%">SOP유형</th>
                            <th width="7%">SOP이름</th>
                            <th width="7%">위기경보단계</th>
                            {/* <th width="20%">전체<ArrowSmallDown></ArrowSmallDown> */}
                            <th width="7%">SOP모드</th>
                            {/* <th width="10%">
                                <HistorySelectBox>
                                    <select className="sopTableSelect">
                                        <option value="전체">전체</option>
                                        <option value="평일/주간">평일/주간</option>
                                        <option value="휴일/야간">휴일/야간</option>
                                    </select>
                                </HistorySelectBox>
                            </th> */}
                            <th width="11%">센서명</th>
                            <th width="15%">위치</th>
                            <th width="13%">시작시간</th>
                            <th width="13%">종료시간</th>
                            <th width="7%">이름</th>
                            <th width="7%">상세대응이력</th>
                          </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                          </tr>
                          <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                          </tr>
                          <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                         </tr>
                         <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                         </tr>
                          <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                         </tr>
                         <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                         </tr>
                          <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                         </tr>
                          <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="3%">01</td>
                            <td width="7%">대기</td>
                            <td width="7%">대기_자동</td>
                            <td width="7%">심각</td>
                            <td width="7%">실제</td>
                            <td width="11%">-</td>
                            <td width="15%">LG화치공장1</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="13%">2022-01-26 10:08:17</td>
                            <td width="7%">작업자</td>
                            <td width="7%">상세정보</td>
                          </tr>
                      </tbody>
                    </table>
                </HistorySOPTables>

                <SopDetailPop />
            </>
        );
    }
}

export default HistorySOPTable;