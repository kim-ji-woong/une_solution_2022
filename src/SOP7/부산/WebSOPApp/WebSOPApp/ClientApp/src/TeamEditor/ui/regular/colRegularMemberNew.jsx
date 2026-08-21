import React, { Component } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import { TeamEditController } from '../../services/teamEditController';
//import Commands from "../../services/commands";
//import CommandStyle from "../../services/commandStyle";
import TeamEditorResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

class ColRegularMemberNew extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            member: null,
            jobLevels: null,
            jobPositions: null,
        };

        this.props = props;
        this.state.member = this.props.member;
        this.state.jobLevels = this.props.jobLevels;
        this.state.jobPositions = this.props.jobPositions;
    }

    onChangeCheckBox = (checked) => {
        let member = this.state.member;
        member.check = checked;

        //this.setState({ member: member });
        //this.props.onChange(this.props.index, member);
        //return;
    }

    render() {
        let teamName = "";
        if (this.props.teamName !== null)
            teamName = this.props.teamName;

        const member = this.props.member;

        // 권한에 따라 삭제 컬럼 표시
        const userAuthor = ProjectResource.getUserAuthor();

        //const isEditMode = this.props.isEditMode;

        let checkBoxUI = null;

        //userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin
        if (userAuthor === AccountResource.ID.accountLevel.admin) {
            checkBoxUI = <ColCheckBox
                value={this.props.index + 1} defaultChecked={member.check}
                isEditMode={member.isEditMode}
                onChange={this.onChangeCheckBox}
            />;
        }

        return (
            <>
                {checkBoxUI}
                <td><span>{this.props.index + 1}</span></td>
                <td><span>{teamName}</span></td>
                <ColText
                    value={member.MemberName} member={member}
                    colID={TeamEditorResource.ID.colTextMode.memberName + member.ID} columnName={TeamEditorResource.ID.colTextMode.memberName} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColComboBox
                    value={member.JobPositionID} options={this.props.jobPositions} member={member}
                    columnName={TeamEditorResource.ID.colTextMode.jobPosition} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColComboBox
                    value={member.JobLevelID} options={this.props.jobLevels} member={member}
                    columnName={TeamEditorResource.ID.colTextMode.jobLevel} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColText
                    value={member.PhoneNumber} member={member} checkPhoneNumber={this.props.checkPhoneNumber}
                    colID={TeamEditorResource.ID.colTextMode.phoneNumber + member.ID} columnName={TeamEditorResource.ID.colTextMode.phoneNumber} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                {/* <ColText
                    value={member.MemberID} member={member}
                    colID={TeamEditorResource.ID.colTextMode.memberID + member.ID} columnName={TeamEditorResource.ID.colTextMode.memberID} isEditMode={member.isEditMode} editColumnName={member.editType}
                    checkMemberID={this.props.checkMemberID}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                /> */}
                <ColText
                    value={member.OfficePhoneNumber} member={member}
                    colID={TeamEditorResource.ID.colTextMode.officePhoneNumber + member.ID} columnName={TeamEditorResource.ID.colTextMode.officePhoneNumber} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColText
                    value={member.Email} member={member}
                    colID={TeamEditorResource.ID.colTextMode.email + member.ID} columnName={TeamEditorResource.ID.colTextMode.email} isEditMode={member.isEditMode} editColumnName={member.editType}
                    checkEmail={this.props.checkEmail}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
            </>
        );
    }
}

export default ColRegularMemberNew;