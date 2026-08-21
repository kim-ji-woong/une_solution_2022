import React, { Component } from 'react';
import ColText from '../columns/colText';
import ColComboBox from '../columns/colComboBox';
import ColCheckBox from '../columns/colCheckBox';

import styles from '../../../Common/css/style.module.css';
import teamEditors from '../../css/teamEditor.module.css';

import { TeamEditController } from '../../services/teamEditController';

import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class ColSelectManager extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            member: null,
            jobLevels: null,
            jobPositions: null,
            check: false,           // 선택(라디오 체크) 유무
        };

        this.props = props;
        //this.state.member = this.props.member;
        //this.state.jobLevels = this.props.jobLevels;
        //this.state.jobPositions = this.props.jobPositions;

        if (this.props.member.check == true)
            this.state.check = true;
    }

    componentDidUpdate(prevProps, prevState) {

    }

    render() {
        let jobPosition = "";
        if (this.props.member.JobPositionID != null)
            jobPosition = i18nUtil.convertText(this.props.jobPositions[this.props.member.JobPositionID]?.name);

        let jobLevel = "";
        if (this.props.member.JobLevelID != null)
            jobLevel = i18nUtil.convertText(this.props.jobLevels[this.props.member.JobLevelID]?.name);

        return (
            <>
                <td className={teamEditors.teamRadio}><input type="radio" checked={this.state.check} /></td>
                <td>{this.props.index + 1}</td>
                <td className={teamEditors.colTextSpan}>{this.props.teamName}</td>
                <td className={teamEditors.colTextSpan}>{this.props.member.MemberName}</td>
                <td className={teamEditors.colTextSpan}>{jobPosition}</td>
                <td className={teamEditors.colTextSpan}>{this.props.member.PhoneNumber}</td>
                <td className={teamEditors.colTextSpan}>{this.props.member.OfficePhoneNumber}</td>
            </>
        );
    }
}

export default ColSelectManager;