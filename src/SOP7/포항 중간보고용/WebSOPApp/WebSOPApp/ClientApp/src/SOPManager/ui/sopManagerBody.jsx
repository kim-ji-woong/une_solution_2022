import React, { Component } from 'react';

import styles from '../../Common/css/style.module.css';
import bodyStyles from '../css/body.module.css';
import sectionStyles from '../../Common/css/section.module.css';

import SopManagerResource from '../resource/id';
import PanelAreas from './panelAreas';
import SopController from '../services/sopController';
import SectionData from '../../Common/models/sections/sectionData';
import SectionDataAnnotation from '../../Common/models/sections/sectionDataAnnotation';
import SectionDataDecision from '../../Common/models/sections/sectionDataDecision';
import SectionDataEndpoint from '../../Common/models/sections/sectionDataEndpoint';
import SectionDataInternal from '../../Common/models/sections/sectionDataInternal';
import SectionDataProcess from '../../Common/models/sections/sectionDataProcess';
import JsonManager from '../services/jsonManager';
import NewSOPOptions from './body/newSOPOptions';
import SopManagerBodyMain from './body/sopManagerBodyMain';
import SopManager from './sopManager';
import SaveSOPOptions from './popup/saveSOPOptions';

//import $ from 'jquery';

class SopManagerBody extends Component {
	static cssStyles = styles;

	constructor(props) {
		super(props);

		this.props = props;
	}

	getBodyContents() {
		if (this.props.menu === SopManager.menu.editSOP ||
			this.props.menu === SopManager.menu.open) {
			return <SopManagerBodyMain sopData={this.props.menuDatas} loginUser={this.props.loginUser} showCascading={this.props.showCascading} content={this.props.content} changeCascadingMode={this.props.changeCascadingMode} showConfirmDialog={this.props.showConfirmDialog} />;
		}
		else if (this.props.menu === SopManager.menu.newSOP) {
			return <NewSOPOptions content={this.props.content} sopData={this.props.sopData} loginUser={this.props.loginUser} showConfirmDialog={this.props.showConfirmDialog} />;
		}
		else if (this.props.menu === SopManager.menu.save) {
			return <SaveSOPOptions sopData={this.props.menuDatas} content={this.props.content} loginUser={this.props.loginUser} showConfirmDialog={this.props.showConfirmDialog} onCloseConfirmDialog={this.props.onCloseConfirmDialog} />;
		} else {
			return <SopManagerBodyMain sopData={this.props.menuDatas} loginUser={this.props.loginUser} showCascading={this.props.showCascading} content={this.props.content} changeCascadingMode={this.props.changeCascadingMode} showConfirmDialog={this.props.showConfirmDialog} />;
		}

		return <></>;
    }

	render() {
		return (
			<div className={bodyStyles.sopCont}>
				{
					this.getBodyContents()
                }
			</div>
		);
	}
}

export default SopManagerBody;