import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import LoginPageSB from './loginPageSB';
import LoginPageWonik from './loginPageWonik';
import LoginPageHydrogen from './loginPageHydrogen';

import ProjectResource from '../../Root/resource/id';
import { i18n, withTranslation } from '../../language/i18n';

class LoginPath extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		}

		this.props = props;

		this.initSiteID();
	}

	componentDidMount() {
		let siteID = ProjectResource.SiteID;

		if(siteID === ProjectResource.Site.Wonik) {
			$('body').css({ 'background': '#0E162D' });
		} else if(siteID === ProjectResource.Site.Soulbrain) {
			$('body').css({ 'background': 'rgba(0,0,0,0.9)' });
		} else if (siteID === ProjectResource.Site.Hydrogen) {
			$('body').css({ 'background': 'rgba(0,0,0,0.9)' });
		}
	}

	async initSiteID() {
		let siteID = ProjectResource.SiteID;

		if (siteID === null || siteID === undefined) {
			siteID = await ProjectResource.loadSiteID();

			this.setState({ loading: false });
			return;
		}

		this.state.loading = false;
	}

	render() {
		const siteID = ProjectResource.SiteID;

		if (!siteID) {
			return (<h2>{i18n.t('account.데이터를 불러오고 있습니다')}</h2>);
		} else if (siteID === ProjectResource.Site.Wonik || siteID === ProjectResource.Site.GG_A) {
			return (<LoginPageWonik />);
		} else if (siteID === ProjectResource.Site.Hydrogen) {
			return (<LoginPageHydrogen />);
		} else {
			return (<LoginPageSB />);
        }
    }
}

export default withRouter(withTranslation()(LoginPath));