import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import AccountFindPwd from './accountFindPwd';
//import AccountFindPwdWonik from './accountFindPwdWonik';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../resource/id';
import { i18n, withTranslation, i18nUtil } from '../../../language/i18n';

class AccountFindPwdPath extends Component {
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
			return (<h2>{i18n.t('account.�����͸� �ҷ����� �ֽ��ϴ�')}</h2>);
		}
		//else if (siteID === ProjectResource.Site.Wonik || siteID === ProjectResource.Site.GG_A) {
		//	return (<AccountFindPwdWonik />);
		//}
		else {
			return (<AccountFindPwd />);
        }
			
    }
}

export default withRouter(AccountFindPwdPath);