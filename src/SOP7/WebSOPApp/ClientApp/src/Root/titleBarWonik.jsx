import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

import { HeaderWrap } from './styled/titleBarWonik';
import logoImg from '../Common/img/imgwonik/header_ci.png'

class TitleBarWonik extends Component {

	componentDidMount() {
		$('body').css({ 'background': '#0E162D' });
	}

	render() {
		return (
			<HeaderWrap>
                <div className='header-left-wrap'>
                    <img src={logoImg} alt='logo' />
                    <span>2023-04-19(수) 오후 3:32</span>
                </div>
                
                <div className='header-right-wrap'>
                    <button className="user-nav">
                        사용자
                    </button>
                    <button className="menu-nav">
                        <h2 className='blind'>메뉴</h2>
                    </button>
                    <button className="setting">
                        <h2 className='blind'>설정</h2>
                    </button>
                </div>
            </HeaderWrap>
        );
    }
}

export default withRouter(TitleBarWonik);