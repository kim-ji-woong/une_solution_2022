import React, { Component } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import styles from '../../../Common/css/style.module.css';
import teamEditors from '../../css/teamEditor.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class ColTemporaryMemberNew extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            member: null,
            //jobPositions: null,
            //roles: null,
        };

        this.props = props;
    }

    onChangeCheckBox = (checked) => {
        let member = this.props.member;
        member.check = checked;

        //this.setState({ member: member });
        //this.props.onChange(this.props.index, member);
        return;
    }

    onChangeRole = (role) => {
        this.props.member.role = role;
    }

    onChangeDisplaySOPName = (displaySOPName) => {
        this.props.member.displaySOPName = displaySOPName;
    }

    openPopup = (columnName) => {
        const member = this.props.member;
        this.props.onChangeMemberEditMode(this.props.member, columnName, true);
        this.props.openPopup(member);
    }

    onChangeMemberEditMode = (columnName) => {
        let isEditMode = true;
        if (this.props.member.editType === columnName) {
            isEditMode = false;
        }

        this.props.onChangeMemberEditMode(this.props.member, columnName, isEditMode);
    }

    render() {        
        let regularTeamName = "";
        let regularMemberName = "";
        let jobPositionName = "";

        const member = this.props.member;        
        if (member.regular !== null && member.regular !== undefined)
            regularTeamName = member.regular.teamName;

        if (member.regularMember !== null && member.regularMember !== undefined) {
            const regularMember = member.regularMember;
            regularMemberName = regularMember.memberName;

            const jobPositions = this.props.jobPositions;

            for (let i = 0; i < jobPositions.length; i++) {
                let jobPosition = jobPositions[i];

                if (regularMember.jobPositionID === jobPosition.value) {
                    //jobPositionName = jobPosition.name;
                    jobPositionName = i18nUtil.convertText(jobPosition.name);
                    break;
                }
            }
        }

        // 권한에 따라 삭제 컬럼 표시
        const userAuthor = ProjectResource.getUserAuthor();
        const isEditMode = this.props.isEditMode;
        let checkBoxUI = null;

        if (isEditMode === true &&
            (userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin)) {
            checkBoxUI = <ColCheckBox
                defaultChecked={member.check}
                isEditMode={member.isEditMode}
                onChange={this.onChangeCheckBox}
            />;
        }

        return (
            <>
                {checkBoxUI}
                <td><span>{this.props.index + 1}</span></td>
                <ColComboBox
                    value={member.role} options={this.props.roles} member={member}
                    columnName={i18n.t('teamEditor.formText.정/부')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColText
                    value={member.displaySOPName} member={member}
                    colID={i18n.t('teamEditor.formText.SOP이름') + member.id} columnName={i18n.t('teamEditor.formText.SOP이름')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <td>
                    <span className={styles.fixation + " " + teamEditors.colTextLink} onMouseDown={() => this.openPopup(i18n.t('teamEditor.formText.부서명'))}>{regularTeamName}</span>                    
                </td>
                <td>
                    <span>{jobPositionName}</span>
                </td>
                <td>
                    <span className={styles.fixation + " " + teamEditors.colTextLink} onMouseDown={() => this.openPopup(i18n.t('teamEditor.formText.성명'))}>{regularMemberName}</span>                    
                </td>
            </>
        );
    }
}

export default withTranslation()(ColTemporaryMemberNew);