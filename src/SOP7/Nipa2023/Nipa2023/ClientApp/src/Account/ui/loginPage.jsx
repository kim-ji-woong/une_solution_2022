import React, { Component } from 'react';
import $ from 'jquery';
import { withRouter } from 'react-router-dom';

import { AccountController } from '../services/accountController';

import ProjectResource from '../../Root/resource/id';
import AccountResource from '../resource/id';

import { LoginPageComponent } from '../styled/loginPageStyled';
import LoginSection from './components/loginSection';
import FindPwdSection from './components/findPwdSection';

import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import background_img1 from '../images/background_img1.png';
import background_img2 from '../images/background_img2.png';
import background_img3 from '../images/background_img3.png';

class LoginPage extends Component {
	static FirstPage = "/sdms";
	
	constructor(props) {
		super(props);

		this.refPwdID = React.createRef();
		this.refPhone = React.createRef();

		this.state = {
			loginError: null,
			pwdError: null,
			pwdSuccess: null,

			current: 0
		}

		this.checkLogin();
	}

	async checkLogin() {
		const [result, errorMessage] = await AccountController.useAutoLogin();

		if (result?.success && result.autoLogin) {
			// 세션 키를 이용해 로그인 체크
			const user = ProjectResource.initUserInfo(result.siteID);
			if (user !== null && user !== undefined) {

				if (user.sessionKey !== null && user.sessionKey !== undefined) {
					// 로그인 정보가 남아있다면
					const [result, message] = await AccountController.checkLoginSession(user.id, user.sessionKey);

					if (result === AccountResource.loginState.login) {
						this.props.history.push(LoginPage.FirstPage);
					}
				}
			}
		}
	}

	componentDidMount() {
		// navigation event
		setTimeout(() => {
			this.navEvent();
		});
	}

	navEvent() {
		let tabsNewAnim = $('#navbar');
		let onItemNewAnim = tabsNewAnim.find('.on');
		let onWidthNewAnimHeight = onItemNewAnim.innerHeight();
		let onWidthNewAnimWidth = onItemNewAnim.innerWidth();
		let itemPosNewAnimTop = onItemNewAnim.position();
		let itemPosNewAnimLeft = onItemNewAnim.position();

		$(".hori-selector").css({
			"top":itemPosNewAnimTop.top + "px", 
			"left":itemPosNewAnimLeft.left + "px",
			"height": onWidthNewAnimHeight + "px",
			"width": onWidthNewAnimWidth + "px"
		});

		$("#navbar").on("click","li",function(e){
			$('#navbar ul li').removeClass("on");
			$(this).addClass('on');

			let onWidthNewAnimHeight = $(this).innerHeight();
			let onWidthNewAnimWidth = $(this).innerWidth();
			let itemPosNewAnimTop = $(this).position();
			let itemPosNewAnimLeft = $(this).position();

			$(".hori-selector").css({
				"top":itemPosNewAnimTop.top + "px", 
				"left":itemPosNewAnimLeft.left + "px",
				"height": onWidthNewAnimHeight + "px",
				"width": onWidthNewAnimWidth + "px"
			});
		});
	}

	onClickLogin = (id, pw) => {

		if (id.length === 0) {
			this.setState({ loginError: AccountResource.ID.textLoginIDError });
			return;
		}

		if (pw.length === 0) {
			this.setState({ loginError: AccountResource.ID.textLoginPwdError });
			return;
		}

		this.doLogin(id, pw);
	}

	async doLogin(id, pw) {
		const result = await AccountController.login(id, pw);

		if (result === null) {
			this.setState({ loginError: AccountResource.ID.textLoginError });
		}

		if (result.success === true) {
			// 로그인 성공

			// 세션 저장
			ProjectResource.setLoginUser(result.user);

			this.props.history.push(LoginPage.FirstPage);
		}
		else {
			if (result?.message && result.message.length > 0) {
				this.setState({ loginError: result.message });
			}
			else {
				this.setState({ loginError: AccountResource.ID.textLoginError });
			}
		}
	}

	onChangeSection = (target, section) => {
		this.setState({ current: section, loginError: null, pwdError: null, pwdSuccess: null });
	}

	onClickFindPwd = (name, phone) => {

		if (name.length === 0) {
			this.setState({ pwdError: AccountResource.ID.textPlaceName });
			return;
		}

		if (phone.length === 0) {
			this.setState({ pwdError: AccountResource.ID.textPlacePhone });
			return;
		}

		this.findPassword(name, phone);
	}

	async findPassword(name, phone) {

		const [result, message] = await AccountController.requestFindPassword(name, phone);

		if (result === null) {
            this.setState({ pwdError: message });
			return;
        } else if (result == true) {
            this.setState({ pwdSuccess: "임시 비밀번호를 문자로 발송했습니다." });
        }
        else {
            this.setState({ pwdError: message });
        }
	}

	render() {
		let currentSection = this.state.current;

		const settings = {
			dots: true,
			fade: true,
			infinite: true,
			slidesToShow: 1,
			slidesToScroll: 1,
			autoplay: true,
			speed: 500,
			pauseOnHover: false
		};

		return (
			<LoginPageComponent>
				<div>
					<Slider {...settings}> 
						<img src={background_img1} alt='건물 사진' />
						<img src={background_img2} alt='건물 사진' />
						<img src={background_img3} alt='건물 사진' />
					</Slider>

					<nav id="navbar">
						<ul>
							<div className="hori-selector"></div>
							<li className={'on'} onClick={(e) => this.onChangeSection(e.target, 0)}><span>로그인</span></li>
							<li onClick={(e) => this.onChangeSection(e.target, 1)}><span>비밀번호 찾기</span></li>
						</ul>
					</nav>
				</div>

				{
					this.state.current === 0 &&
					<LoginSection
						onKeyPressLogin={this.onKeyPressLogin}
						onClickLogin={this.onClickLogin}
						loginError={this.state.loginError}
					/>
				}

				{
					this.state.current === 1 &&
					<FindPwdSection
						onClickFindPwd={this.onClickFindPwd}
						pwdError={this.state.pwdError}
						pwdSuccess={this.state.pwdSuccess}
					/>
				}

				<footer>
					<p>2023 NIPA 디지털트윈 제조혁신</p>
					<p>EV / ESS산업 경쟁 혁신을 위한</p>
					<p>지능형 디지털 트윈 제조안전 시스템 입니다.</p>
				</footer>
			</LoginPageComponent>
		);
	}
}

export default withRouter(LoginPage);