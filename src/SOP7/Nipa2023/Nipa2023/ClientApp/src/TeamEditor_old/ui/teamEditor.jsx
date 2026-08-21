import React, { Component } from 'react';

import { TeamEditorComponent } from '../styled/teamEditorStyled';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../../Account/resource/id';

import TreeMenu from './components/treeMenu';
import TeamList from './components/teamList';
import { TeamEditorController } from '../services/teamEditorController';

class TeamEditor extends Component {

	constructor(props) {
		super(props);

		this.state = {
            teamList: [],
            teamMemberList: [],
            selectedTeam: null, // Tree에서 선택된 팀정보
            displayMemberList: [],
            search: '',
		}

		this.props = props;

        this.init();
	}

    async init() {
        const userInfo = ProjectResource.getUserInfo();
        const memberList = [];

        if (userInfo?.siteID) {

            const siteID = userInfo.siteID;
    
            const [teamList, message] = await TeamEditorController.requestTeamList(siteID);
    
            let teamId = [];

            if (teamList) {
                for (let i = 0; i < teamList.length; i++) {
                    let teams = teamList[i];
                    
                    for (let j = 0; j < teams.children.length; j++) {
                        let team = teams.children[j];
                        teamId.push({id: team.id, name: team.teamName});

                        if (team.children.length > 0) {
                            for (let k = 0; k < team.children.length; k++) {
                                let team2depth = team.children[k];
                                teamId.push({id: team2depth.id, name: team2depth.teamName});
                            }
                        }
                    }
                }

                if(teamId.length > 0) {
                    for (let team of teamId) {
                        const teamMemberList = await this.getTeamMemberList(team.id);
            
                        if (teamMemberList) {
                            teamMemberList.map((member) => {
                                member.teamName = team.name;
                                memberList.push(member);
                                return null;
                            });
                        }
                    }
                }
            }
            else {
                console.log(message);
            }
    
            this.setState({ teamList: teamList, teamMemberList: memberList, displayMemberList: memberList });
        }
    }

    getTeamMemberList = async (teamId) => {

        const [teamMemberList, message] = await TeamEditorController.requestTeamMemberList(teamId);

        if(teamMemberList) {
            return teamMemberList;
        }
        else{
            console.log(message);
        }
    }

    // input창에서 검색했을 경우
    searchUser = (text) => {
        const { teamMemberList } = this.state;
        let searchMembers = [];

        for (let i = 0; i < teamMemberList.length; i++) {
            const member = teamMemberList[i];

            if (text !== null && text !== undefined && text !== "") {
                if (Object.values(member).find(element => element === text)) {
                    searchMembers.push(member);
                };
            }
            else {
                searchMembers.push(member);
            }
        }

        this.setState({ displayMemberList: searchMembers });
    }

    // tree에서 팀 선택했을 경우
    selectedTeam = async (team) => {
        const { teamMemberList } = this.state;
        let displayMemberList = [];

        let teamId = [];

        if (team.id === 1) {
            this.setState({ selectedTeam: team, displayMemberList: teamMemberList });
        } 
        else {
            teamId.push({id: team.id, name: team.teamName});

            if (team.children.length > 0) {
                for (let i = 0; i < team.children.length; i++) {
                    let team2depth = team.children[i];
                    teamId.push({id: team2depth.id, name: team2depth.teamName});
                }
            }

            if(teamId.length > 0) {
                for (let team of teamId) {
                    const teamMemberList = await this.getTeamMemberList(team.id);
        
                    if (teamMemberList) {
                        teamMemberList.map((member) => {
                            member.teamName = team.name;
                            displayMemberList.push(member);
                            return null;
                        });
                    }
                }
            }
    
            this.setState({ selectedTeam: team, displayMemberList: displayMemberList });
        }
    }

    render() {
        const {teamList, selectedTeam, displayMemberList} = this.state;

        return (
            <TeamEditorComponent className='UI_Section'>
                <TreeMenu
                    teamList={teamList}
                    selectedTeam={this.selectedTeam}
                />
                <TeamList 
                    teamMemberList={displayMemberList}
                    selectedTeam={selectedTeam}
                    searchUser={this.searchUser}
                />
            </TeamEditorComponent>
        );
    }
}

export default TeamEditor;