import React, { Component } from 'react';
import styled from 'styled-components';
import settings_right_arrow from '../../../Common/img/sub/settings_right_arrow.png';

import ProjectResource from '../../../Root/resource/id';
import AccountResource from '../../../Account/resource/id';

export const _SelectBox = {
    soulbrain: {
        divBackground: '#FF8400',
    },
    Wonik: {
        divBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
    },
    Hydrogen: {
        divBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
    },
    Gyeonggi: {
        divBackground: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
    }
}

const SelectBox = styled.div`
    position: relative;
    width: 100%;
    height: 41px;

    background: #525868;
    align-self: center;
    cursor: pointer;

    &.on {
        background: ${_SelectBox[ProjectResource.styleMode].divBackground};
    }

    &::before {

        ${(props) => (props.$show ? `content: url(${settings_right_arrow});  transform: rotate(180deg); transition: .3s;` : `content: url(${settings_right_arrow}); transition: .3s;`)};
        
        position: absolute;
        top: 13px;
        right: 18px;
    }
`;

const Label = styled.label`
    position: absolute;
    top: 11px;
    margin-left: 19px;
    color: #fff;
    font-size: 18px;
    letter-spacing: 0.9px;
`;

let height = 0; // option의 갯수로 height값 할당을 위해
const SelectOptions = styled.ul`
    ${(props) => (height = (props.children.length * 41) + 'px')};
    width: 159px; 
    position: absolute;
    top: 42px;
    background: #0E162D;
    overflow: hidden;
    height: ${(props) => (props.$show ? height : "0")};
    transition: height 0.3s ease-in-out;
    color: #fff;
    font-size: 18px;
    letter-spacing: 0.9px;
    z-index: 9999;
`;

const Option = styled.li`
    height: 41px;
    line-height: 41px;
    padding-left: 19px;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;





export default class LayoutSetting extends Component {
    constructor(props) {
		super(props);

		this.state = {
		    isShowOptions: false,
            reload: 0,
        }

		this.props = props;
	}

    componentWillUpdate(nextProps, nextState) {
		if (this.props.selectedSiteID !== nextProps.selectedSiteID) {
            let reload = this.state.reload;
            reload++;
            this.setState({reload});
		}
	}

    onClickShowOptions = () => {
        let isShowOptions = this.state.isShowOptions;

        this.setState({isShowOptions: !isShowOptions});
    }

    getSiteList = () => {
        const siteList = [];

	    // 총괄관리자: 전체 건물 다 봄
	    // 관리자: 해당하는 siteID만 봄(실행 권한 있음)
	    // 사용자: 해당하는 SiteID만 봄(실행 권한 없음)
	    const userInfo = ProjectResource.getUserInfo();
        const sites = ProjectResource?.sites;
        const selectedSiteID = this.props.selectedSiteID;
        let siteName = "";

	    if (userInfo?.levelID === AccountResource.accountLevelID.master) {
            for (let i = 0; i < sites?.length; i++) {
                const site = sites[i];
                siteList.push(<Option key={site.id} onClick={() => this.props.onChangeSite(site.id)}>{site.siteName}</Option>);

                if (site.id === selectedSiteID) {
                    siteName = site.siteName;
                }
            }

	    } else if (userInfo?.levelID === AccountResource.accountLevelID.admin) {		    
            for (let i = 0; i < sites?.length; i++) {
                const site = sites[i];

                if (site.id === selectedSiteID) {
                    siteName = site.siteName;
                }

                if (site.id === userInfo.siteID) {
                    siteList.push(<Option key={site.siteName}>{site.siteName}</Option>);
                    break;
                }                
            }
        }

        return [siteList, siteName];
    }

    render() {
         const [siteList, siteName] = this.getSiteList();

        return (
            <SelectBox className='settings-selectBox' onClick={() => this.onClickShowOptions()} $show={this.state.isShowOptions}>
                <Label>{siteName}</Label>
                <SelectOptions $show={this.state.isShowOptions}>
                    {siteList}
                </SelectOptions>
            </SelectBox>
        );
    }
};