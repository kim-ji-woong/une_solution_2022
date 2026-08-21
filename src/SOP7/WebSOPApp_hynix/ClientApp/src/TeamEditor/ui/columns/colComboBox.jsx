import React, { Component } from 'react';

import $ from 'jquery';
import styles from '../../../Common/css/style.module.css';
import uneStyles from '../../../Common/css/uneCommon.module.css';
import { i18n, withTranslation, i18nUtil  } from '../../../language/i18n';

class ColComboBox extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            value: this.props.value,     // 선택된 값
            options: this.props.options, // 콤보박스 리스트
            isClickChk: false,           // 더블클릭 체크값
            columnName: this.props.columnName
        };

        this.props = props;

        if (this.state.value == null) {
            this.state.value = "";
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.options !== this.props.options) {
            this.setState({ options: this.props.options });
        }
    }

    onChangeEditMode = (isEditMode) => {
        this.props.onChangeMemberEditMode(this.props.member, this.state.columnName, isEditMode);
    }

    onChangeCheck = (e) => {
        let val = Number(e.target.value);
        this.setState({ value: val });

        let isUpdate = true;
        if (this.props.value === val) {
            isUpdate = false;
        }

        if (this.state.columnName === i18n.t('teamEditor.formText.직위')) {
            this.props.member.JobLevelID = val;
        }
        else if (this.state.columnName === i18n.t('teamEditor.formText.직급')) {
            this.props.member.JobPositionID = val;
        }
        else if (this.state.columnName === i18n.t('teamEditor.formText.정/부')) {
            this.props.member.role = val;
        }
        else {
            return;
        }

        this.props.onChangeMember(this.props.member, isUpdate);
    }

    render() {
        var strName = null;
        if (this.props.options !== null) {
            for (var i = 0; i < this.props.options.length; i++) {
                if (this.props.options[i].value === this.props.value) {
                    strName = i18nUtil.convertText(this.props.options[i].name);
                    break;
                }
            }
        }

        return (
            this.props.isEditMode && this.state.columnName === this.props.editColumnName ?
                <td>
                    <select onChange={(e) => this.onChangeCheck(e)} defaultValue={this.props.value} autoFocus className={uneStyles.selectCombo}>
                    {
                        this.props.options.map((level, index) =>
                        (
                            <option key={level.value} value={level.value}>{i18nUtil.convertText(level.name)}</option>
                        ))
                    }
                    </select>
                </td>
                :
                <td onMouseDown={() => this.onChangeEditMode(true)}>
                    <span className={styles.fixation}>{strName}</span>
                </td>
            );
    }
}

export default withTranslation()(ColComboBox);