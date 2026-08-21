import React, { Component } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';
import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

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
        let checkBoxUI = null;

        const isEditMode = this.props.isEditMode;

        if (isEditMode === true &&
            (userAuthor === AccountResource.accountLevelID.master || userAuthor === AccountResource.accountLevelID.admin)) {
            checkBoxUI = <ColCheckBox
                value={this.props.index + 1} defaultChecked={member.check || ''}
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
                    colID={i18n.t('teamEditor.formText.이름') + member.ID} columnName={i18n.t('teamEditor.formText.이름')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                {
                    ProjectResource.SiteID !== ProjectResource.Site.Tlb && ProjectResource.SiteID !== ProjectResource.Site.Hydrogen ?
                    <ColComboBox
                        value={member.JobPositionID} options={this.props.jobPositions} member={member}
                            columnName={i18n.t('teamEditor.formText.직급')} isEditMode={member.isEditMode} editColumnName={member.editType}
                        onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                        />
                        : <></>
                }
                <ColComboBox
                    value={member.JobLevelID} options={this.props.jobLevels} member={member}
                    columnName={i18n.t('teamEditor.formText.직위')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                <ColText
                    value={member.PhoneNumber} member={member} checkPhoneNumber={this.props.checkPhoneNumber}
                    colID={i18n.t('teamEditor.formText.휴대전화번호') + member.ID} columnName={i18n.t('teamEditor.formText.휴대전화번호')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                {
                    ProjectResource.SiteID !== ProjectResource.Site.Tlb && ProjectResource.SiteID !== ProjectResource.Site.Hydrogen &&
                    <ColText
                        value={member.MemberID} member={member}
                        colID={i18n.t('teamEditor.formText.사번') + member.ID} columnName={i18n.t('teamEditor.formText.사번')} isEditMode={member.isEditMode} editColumnName={member.editType}
                        checkMemberID={this.props.checkMemberID}
                        showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                        onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                    />
                }
                <ColText
                    value={member.OfficePhoneNumber} member={member}
                    colID={i18n.t('teamEditor.formText.근무처 전화번호') + member.ID} columnName={i18n.t('teamEditor.formText.근무처 전화번호')} isEditMode={member.isEditMode} editColumnName={member.editType}
                    showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                    onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                />
                {
                    ProjectResource.SiteID !== ProjectResource.Site.Tlb &&
                    <ColText
                        value={member.Email} member={member}
                        colID={i18n.t('common.메일') + member.ID} columnName={i18n.t('common.메일')} isEditMode={member.isEditMode} editColumnName={member.editType}
                        checkEmail={this.props.checkEmail}
                        showConfirmDialog={this.props.showConfirmDialog} showErrorDialog={this.props.showErrorDialog}
                        onChangeMemberEditMode={this.props.onChangeMemberEditMode} onChangeMember={this.props.onChangeMember}
                    />
                }
            </>
        );
    }
}

export default withTranslation()(ColRegularMemberNew);