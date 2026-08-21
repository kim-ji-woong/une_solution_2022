import React, { Component } from 'react';

import { TeamListComponent } from '../../styled/teamEditorStyled';

class TeamList extends Component {

	constructor(props) {
		super(props);

		this.state = {
		}

		this.props = props;
	}

    searchEnterKey = () => {
        if (window.event && window.event.keyCode === 13) {    
            this.searchUser();
        }
    }
    
    searchUser = () => {
        const text = document.getElementById('txtSearch').value;
        this.props.searchUser(text);
    }

    getMemberList() {
        const teamMemberList = this.props.teamMemberList;

        let memberTable = [];
        let memberCount = 1;

        if (teamMemberList.length > 0) {

            for(let i = 0; i < teamMemberList.length; i++) {

                let member = teamMemberList[i];

                memberTable.push(
                    <tr key={'teamMember' + memberCount}>
                        <td>{memberCount}</td>
                        <td>{member.teamName}</td>
                        <td>{member.memberName}</td>
                        <td>{member.jobPosition ? member.jobPosition : '-'}</td>
                        <td>{member.jobLevel ? member.jobLevel : '-'}</td>
                        <td>{member.phoneNumber ? member.phoneNumber : '-'}</td>
                        <td>{member.id}</td>
                        <td>{member.officePhoneNumber ? member.officePhoneNumber : '-'}</td>
                        <td>{member.email ? member.email : '-'}</td>
                    </tr>
                );

                memberCount += 1;
            }
        }

        return memberTable;
    }

    render() {
        const memberTable = this.getMemberList();
        const selectedTeam = this.props.selectedTeam;

        return (
            <TeamListComponent>
                <div className='headerWrap'>
                    <h5>{selectedTeam == null ? '전체' : selectedTeam.teamName}</h5>
                    <div className={'searchWrap'}>
                        <input type="text" id="txtSearch" onKeyUp={this.searchEnterKey} placeholder='검색어를 입력해주세요.'/>
                        <a onClick={this.searchUser}>검색</a>
                    </div>
                </div>
                <div className='contentWrap'>
                    <table>
                        <thead>
                            <tr>
                                <td width={'3%'}>NO.</td>
                                <td width={'10%'}>소속팀</td>
                                <td width={'10%'}>이름</td>
                                <td width={'10%'}>직위</td>
                                <td width={'10%'}>직급</td>
                                <td width={'10%'}>핸드폰 번호</td>
                                <td width={'10%'}>사번</td>
                                <td width={'10%'}>근무처 전화번호</td>
                                <td width={'10%'}>Email</td>
                            </tr>
                        </thead>
                        <tbody>
                            {memberTable}
                        </tbody>
                    </table>
                </div>
            </TeamListComponent>
        );
    }
}

export default TeamList;