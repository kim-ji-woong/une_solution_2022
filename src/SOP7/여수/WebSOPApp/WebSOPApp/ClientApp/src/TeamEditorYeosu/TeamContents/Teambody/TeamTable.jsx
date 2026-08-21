import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';

import { TeamTable } from "./../../styled";
import { DownBox } from "./../../styled";
import { ArrowSmallDown } from "./../../styled";
import { TeamMemberSelectBox } from "./../../styled";

class TeamTables extends Component {

    render() {
        return (
            <>
                <TeamTable>
                    {/* <DownBox>
                        <span>전체 다운로드</span>
                        <span>선택 다운로드</span>
                    </DownBox> */}
                    <table className="historyTable" width="100%">
                        <thead className="yeosuSOPTr">
                            <tr>
                                <th width="3%"><input type="checkbox" className="teamCheckBox" /></th>
                                <th width="3%">번호</th>
                                <th width="10%">소속팀</th>
                                <th width="10%">이름</th>
                                <th width="10%">직위</th>
                                <th width="10%">직급</th>
                                <th width="14%">휴대전화번호</th>
                                <th width="13%">사번</th>
                                <th width="14%">근무처 전화번호</th>
                                <th width="13%">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">01</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">
                                    <TeamMemberSelectBox>
                                        <select className="teamTableSelect">
                                            <option value="사원" selected>사원</option>
                                            <option value="알 수 없음">알 수 없음</option>
                                            <option value="팀원">팀원</option>
                                            <option value="팀장">팀장</option>
                                            <option value="파트장">파트장</option>
                                            <option value="센터장">센터장</option>
                                            <option value="실장">실장</option>
                                            <option value="차장">차장</option>
                                            <option value="본부장">본부장</option>
                                            <option value="부회장">부회장</option>
                                        </select>
                                    </TeamMemberSelectBox>
                                </td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">02</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">03</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">04</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">05</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">06</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">07</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">08</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">09</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                            <tr>
                                <td width="3%"><input type="checkbox" className="teamCheckBox"/></td>
                                <td width="3%">10</td>
                                <td width="10%">환경안전팀</td>
                                <td width="10%">새 인원</td>
                                <td width="10%">팀원</td>
                                <td width="10%">사원</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">A10003</td>
                                <td width="14%">010-0000-0000</td>
                                <td width="13%">yeosu2023@gmail.com</td>
                            </tr>
                        </tbody>
                    </table>
                </TeamTable>
            </>
        );
    }
}

export default TeamTables;