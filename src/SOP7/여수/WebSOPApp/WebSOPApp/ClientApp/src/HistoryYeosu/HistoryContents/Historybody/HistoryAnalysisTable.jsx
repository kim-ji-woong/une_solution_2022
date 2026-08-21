import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { HistoryAnalysisTables } from "./../../styled";
import { DownBox } from "./../../styled";
import { ArrowSmallDown } from "./../../styled";
import { HistorySelectBox } from "./../../styled";

class HistoryAnalysisTable extends Component {

    render() {
        return (
            <>
                <HistoryAnalysisTables>
                    <DownBox>
                        <span>전체 다운로드</span>
                        <span>선택 다운로드</span>
                    </DownBox>
                    <table className="historyATable" width="100%">
                        <thead className="yeosuSOPTr">
                        <tr>
                            <th width="3%"><input type="checkbox" /></th>
                            <th width="5%">번호</th>
                            <th width="10%">유형</th>
                            <th width="20%">위치</th>
                            <th width="15%">센서명</th>
                            <th width="10%">탐지횟수</th>
                            <th width="10%">오작동</th>
                            <th width="10%">현장복구</th>
                            <th width="10%">사용자복구</th>
                            <th width="10%">오작동률(%)</th>
                          </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="5%">01</td>
                            <td width="10%">대기센서</td>
                            <td width="20%">전남 여수시 율촌면 피득촌길 1-1</td>
                            <td width="15%">SP-AQS1</td>
                            <td width="15%">1</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">주의</td>
                        </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                            <td width="5%">02</td>
                            <td width="10%">대기센서</td>
                            <td width="20%">전남 여수시 율촌면 피득촌길 1-1</td>
                            <td width="15%">SP-AQS1</td>
                            <td width="15%">1</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">주의</td>
                        </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" /></td>
                            <td width="5%">03</td>
                            <td width="10%">대기센서</td>
                            <td width="20%">전남 여수시 율촌면 피득촌길 1-1</td>
                            <td width="15%">SP-AQS1</td>
                            <td width="15%">1</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">주의</td>
                        </tr>
                        <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="5%">04</td>
                            <td width="10%">대기센서</td>
                            <td width="20%">전남 여수시 율촌면 피득촌길 1-1</td>
                            <td width="15%">SP-AQS1</td>
                            <td width="15%">1</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">주의</td>
                        </tr>
                        <tr>
                            <td width="3%"><input type="checkbox" /></td>
                            <td width="5%">05</td>
                            <td width="10%">대기센서</td>
                            <td width="20%">전남 여수시 율촌면 피득촌길 1-1</td>
                            <td width="15%">SP-AQS1</td>
                            <td width="15%">1</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">3</td>
                            <td width="10%">주의</td>
                        </tr>
                      </tbody>
                    </table>
                </HistoryAnalysisTables>
            </>
        );
    }
}

export default HistoryAnalysisTable;