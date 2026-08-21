import React, { Component } from 'react';
import SopManager from '../../SOPManager/ui/sopManager';
import styles from '../css/section.module.css';
import commonStyles from '../css/style.module.css';

import { DefaultButtonAreaH, NewSopIconN, SopOpenIconN, FileOpenIconP } from '../../SOPManager/styled/managerStyled';

class SectionGridDefault extends Component {
    onClickMenu(menu) {
        this.props.content(menu, null);
    }

	render() {
        return (
            <div className={styles.defaultGrid}>
                <div className={styles.defaultGridArea}>
                    <div className={styles.defaultButtonAreaV}>
                        <DefaultButtonAreaH>
                            <button className={styles.clickable} onClick={(e) => this.onClickMenu(SopManager.menu.newSOP)}><NewSopIconN></NewSopIconN>{SopManager.menu.newSOP}</button>
                            <button className={styles.clickable} onClick={(e) => this.onClickMenu(SopManager.menu.open)}><SopOpenIconN></SopOpenIconN>{SopManager.menu.open}</button>
                            <button className={styles.clickable} onClick={(e) => this.onClickMenu(SopManager.menu.openXML)}><FileOpenIconP></FileOpenIconP>{SopManager.menu.openXML}</button>
                        </DefaultButtonAreaH>
                    </div>
                </div>
            </div>
        );
    }
}

export default SectionGridDefault;