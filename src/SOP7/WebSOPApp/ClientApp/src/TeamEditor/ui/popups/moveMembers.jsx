import React, { Component } from 'react';
import { ModalBackground } from '../../../Root/styled/variables';
import { MoveMembersComponent } from '../../styled/TeamEditorStyled';
import imgCloseWonik from '../../../Common/img/sub/dashboard_layer_close.png';
import TeamEditorResource from '../../resource/id';

class MoveMembers extends Component {
    constructor(props) {
        super(props);

    }

    getSelectedMembersCount = () => {
        const memberGridData = this.props.memberGridData;
        let selectedMembersCount = 0;

        if (memberGridData && memberGridData.length > 0) {
            for (const member of memberGridData) {
                if (member.check) {
                    selectedMembersCount++;
                }
            }
        }

        return selectedMembersCount;
    }

    getTeamTreeData = () => {
        const ui = [];

        const teamTreeData = this.props.teamTreeData;

        if (teamTreeData && teamTreeData.length > 0) {

            let treeDatas = teamTreeData.map((data, index) => (
                (teamTreeData[index].Children === null || teamTreeData[index].Children === undefined || teamTreeData[index].length === 0)
                    ?
                    <TreeNode key={data.ID}
                        teamTreeData={data}
                        setSelectedMoveTeam={this.props.setSelectedMoveTeam}
                        selectedMoveTeam={this.props.selectedMoveTeam}
                    />
                    :
                    <li key={data.ID}>
                        <TreeNode key={data.ID}
                            teamTreeData={data}
                            setSelectedMoveTeam={this.props.setSelectedMoveTeam}
                            selectedMoveTeam={this.props.selectedMoveTeam}
                        />
                    </li>
            ))

            ui.push(
                <ul className='treeview' key='treeview'>
                    {treeDatas}
                </ul>
            )
        }

        return ui;
    }

    onClickMoveMembers = () => {
        const selectedMembersCount = this.getSelectedMembersCount();

        if (selectedMembersCount === 0) {
            this.props.showConfirmDialog("오류", ["선택된 조직원이 없습니다."], null, null);
            return;
        }

        if (!this.props.selectedMoveTeam) {
            this.props.showConfirmDialog("오류", ["선택된 조직이 없습니다."], null, null);
            return;
        }

        const memberGridData = this.props.memberGridData;
        const memberIDs = [];

        if (memberGridData && memberGridData.length > 0) {
            for (const member of memberGridData) {
                if (member.check) {
                    memberIDs.push(this.props.teamType === TeamEditorResource.menu.조직 ? member.ID : member.id);
                }
            }

            this.props.doMoveMembers(this.props.teamType, this.props.selectedMoveTeam.ID, memberIDs);
        }
    }

    render() {
        return (
            <ModalBackground>
            <MoveMembersComponent>
                <div className={"popupBox"}>
                    <div className='popupboxLine' />
                    <div className={"popupBoxTitle"}>조직이동</div>
                    <div className={"popupBoxX"}><a onClick={() => this.props.handleMoveMembersPopup(false)}><img src={imgCloseWonik} alt='닫기' /></a></div>

                    <section>
                        <div className='selectedInfo'>
                            <p>조직이동 인원이 총</p>
                            <p>{this.getSelectedMembersCount()}</p>
                            <p>명 선택되었습니다.</p>
                        </div>

                        <div className='teamInfo'>
                            <div className='head'>
                                <p>이동조직 : </p>
                                <p>{this.props.selectedMoveTeam ? this.props.selectedMoveTeam.TeamName : '조직을 선택해주세요'}</p>
                            </div>
                            <div className='body'>
                                {this.getTeamTreeData()}
                            </div>
                        </div>

                        <div className='submit'>
                            <button onClick={() => this.onClickMoveMembers()}>이동하기</button>
                        </div>
                    </section>
                </div>
            </MoveMembersComponent>
            </ModalBackground>
        );
    }
}

export default MoveMembers;


class TreeNode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };
    }

    toggleOpen = () => {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    };

    render() {
        if (!this.props.teamTreeData) {
            return <></>;
        }

        const { isOpen } = this.state;
        const { teamTreeData, selectedMoveTeam, setSelectedMoveTeam } = this.props;
        const teamName = teamTreeData.TeamName;
        const haveChildren = teamTreeData.Children && teamTreeData.Children.length > 0;

        return (
            <>
                <div>
                    {haveChildren && (
                        <i
                            className={`fa ${isOpen ? 'fa-minus' : 'fa-plus'}`}
                            onClick={this.toggleOpen}
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                        >
                            {isOpen ? '접기' : '더보기'}
                        </i>
                    )}
                    <a
                        className={selectedMoveTeam?.ID === teamTreeData.ID ? 'on' : ''}
                        onClick={() => setSelectedMoveTeam(teamTreeData)}
                    >
                        {teamName}
                    </a>
                </div>
                {haveChildren && isOpen && (
                    <ul>
                        {teamTreeData.Children.map((child) => (
                            <li key={child.ID}>
                                <TreeNode key={child.ID}
                                    teamTreeData={child}
                                    setSelectedMoveTeam={setSelectedMoveTeam}
                                    selectedMoveTeam={selectedMoveTeam}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    }
}