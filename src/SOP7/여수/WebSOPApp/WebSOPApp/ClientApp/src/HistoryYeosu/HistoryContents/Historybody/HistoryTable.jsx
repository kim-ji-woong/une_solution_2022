import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { HistoryTable } from "./../../styled";
import { DownBox } from "./../../styled";
import { ArrowSmallDown } from "./../../styled";
import { HistorySelectBox } from "./../../styled";

class HistoryTable2 extends Component {

    render() {
        return (
            <>
                <HistoryTable>
                    <DownBox>
                      <span>전체 다운로드</span>
                      <span>선택 다운로드</span>
                    </DownBox>
                    <table className="historyTable" width="100%">
                        <thead className="yeosuSOPTr">
                          <tr>
                            <th width="3%"><input type="checkbox" /></th>
                            <th width="3%">번호</th>
                            <th width="12%">일시</th>
                            <th width="12%">종료일시</th>
                            <th width="20%">목록명</th>
                            {/* <th width="20%">전체<ArrowSmallDown></ArrowSmallDown> */}
                            <th width="15%">위치</th>
                            <th width="10%">
                                <HistorySelectBox>
                                    <select className="sopTableSelect">
                                        <option value="전체">전체</option>
                                        <option value="평일/주간">평일/주간</option>
                                        <option value="휴일/야간">휴일/야간</option>
                                    </select>
                                </HistorySelectBox>
                            </th>
                            <th width="5%">탐지 유형</th>
                            <th width="10%">위기경보 단계</th>
                            <th width="5%">대응SOP</th>
                            <th width="5%">메모</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">01</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                          </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">02</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">03</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">04</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">05</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">06</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">07</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                                <td width="3%">08</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="12%">2022-12-09 14:39:25</td>
                                <td width="20%">LG화치공장1</td>
                                <td width="15%">주삼동 518-11</td>
                                <td width="10%">테스트</td>
                                <td width="5%">테스트</td>
                                <td width="10%">심각</td>
                                <td width="5%">-</td>
                                <td width="5%"><span className="memoIcon"></span></td>
                            </tr>
                        </tbody>
                    </table>
                </HistoryTable>
            </>
        );
    }
}

export default HistoryTable2;