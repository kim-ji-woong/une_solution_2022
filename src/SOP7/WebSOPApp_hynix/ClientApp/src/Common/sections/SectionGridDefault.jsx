import React, { Component } from 'react';
import SopManager from '../../SOPManager/ui/sopManager';
import styles from '../css/section.module.css';
import commonStyles from '../css/style.module.css';

import { DefaultGrid } from '../../SOPSimulator/styled/sopSimulatorStyled';
import SopManagerResource from '../../SOPManager/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

class SectionGridDefault extends Component {
    onClickMenu(menu) {
        this.props.content(menu, null);
    }

    render() {
        return (
            <DefaultGrid className={'defaultGrid'}>
                <div className={'defaultGridArea'}>
                    <div className={'defaultButtonAreaV'}>
                        <div className={'defaultButtonAreaH'}>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.새_SOP)}>{i18n.t('sopManager.menu.새 SOP')}</button>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.열기)}>{i18n.t('sopManager.menu.열기')}</button>
                            <button className={'clickable'} onClick={(e) => this.onClickMenu(SopManagerResource.menu.파일_열기)}>{i18n.t('sopManager.menu.파일 열기')}</button>
                        </div>
                    </div>
                </div>
            </DefaultGrid>
        );
    }
}

export default withTranslation()(SectionGridDefault);