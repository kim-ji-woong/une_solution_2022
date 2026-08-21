import styled from "styled-components";
import PR from "../resource/id";

import '../../Common/css/commonWonik.scss';

import rqLogo from "../../Common/img/common/rq_logo.png";
import rqLogoGC from "../../Common/image/common/GCgreencross_white.png";
import rqLogoSujain from "../../Common/image/common/logo_sujain.png";
import rqLogoWonik from "../../Common/image/common/logo_wonik.png";
import rqLogoSenko from "../../Common/image/common/logo_senko.png";
import rqLogoHydrogen from "../../Common/image/common/logo_ksms2.png";
import rqLogoTlb from "../../Common/image/common/logo_Tlb.png";
import rqLogoGyeonggi from "../../Common/image/common/logo_Gyeonggi.png";
import rqLogoMagog from "../../Common/image/common/logo_magog.png";

import rqQckBtn from "../../Common/img/common/rq_quick.png";
import rqAppBtn from "../../Common/img/common/rq_app.png";
import rqUser from "../../Common/img/common/rq_user.png";
import rqUser2 from "../../Common/img/common/rq_user2.png";
import rqUser3 from "../../Common/img/common/rq_user3.png";
import rqArrow from "../../Common/img/common/rq_arrow.png";
import rqSetting from "../../Common/img/common/rq_setting.png";
import rqProfile from "../../Common/img/common/rq_profile.jpg";

import rpLogoWI from '../../Common/img/imgwonik/header_ci.png'
import userIcon from '../../Common/img/imgwonik/header_user_icon.png'
import arrowIcon from '../../Common/img/imgwonik/header_arrow_icon.png'
import menuIcon from '../../Common/img/imgwonik/header_menu_icon.png'
import settingIcon from '../../Common/img/imgwonik/header_setting_icon.png'

import gg_titlebar_arrow_default from '../../Common/img/imgGyeonggi/gg_titlebar_arrow_default.svg';
import gg_titlebar_select_arrow from '../../Common/img/imgGyeonggi/gg_titlebar_select_arrow.svg';

/**********************************************************************/
export const _TitleBar = {
    soulbrain: {
        divPosition: 'fixed',
        divZIndex: 2,
        divRight: 0,
        divTop: 0,
        divBackground: '#131d24',
        divHeight: '50px',
        divPadding: '10px',

        divBeforeContent: '',
        divBeforeDisplay: 'block',
        divBeforeWidth: 0,
        divBeforeHeight: 0,
        divBeforeBorderTop: 'solid 50px #131d24',
        divBeforeBorderLeft: 'solid 30px transparent',
        divBeforePosition: 'absolute',
        divBeforeRight: '100%',
        divBeforeTop: 0,

        rqLogoWrapSpanDisplay: 'none',
        rqLogoWrapFloat: 'left',

        rqBtnWrapFloat: 'left',

        logoShortCutPosition: 'absolute',
        logoShortCutBackground: '#222222',
        logoShortCutColor: '#fff',
        logoShortCutBorder: 'solid 0.5px #737373',
        logoShortCutWidth: '30px',
        logoShortCutHeight: '20px',
        logoShortCutLeft: '-20px',
        logoShortCutTop: '5px',
        logoShortCutZIndex: 2,
        logoShortCutTextAlign: 'center',
        logoShortCutPaddingTop: '5px',
        logoShortCutFontSize: '10px',
        logoShortCutFontWeight: 400,
        logoShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqLogoDisplay: 'block',
        rqLogoFloat: 'left',
        rqLogoWidth: '110px',
        rqLogoheight: '30px',
        rqLogoMarginRight: '30px',
        rqLogoBackground: `url(${rqLogo}) no-repeat center center;`,
        rqLogoCursor: 'pointer',

        rqLogoGCDisplay: 'inline-block',
        rqLogoGCFloat: 'left',
        rqLogoGCWidth: '110px',
        rqLogoGCHeight: '30px',
        rqLogoGCMarginRight: '20px',
        rqLogoGCBackground: `url(${rqLogoGC}) no-repeat center 3px`,
        rqLogoGCBackgroundSize: '100%',
        rqLogoGCBackgroundPositionX: '-2px',
        rqLogoGCCursor: 'pointer',

        rqLogoSujainDisplay: 'inline-block',
        rqLogoSujainFloat: 'left',
        rqLogoSujainWidth: '80px',
        rqLogoSujainHeight: '57px',
        rqLogoSujainMarginRight: '20px',
        rqLogoSujainBackground: `url(${rqLogoSujain}) no-repeat center`,
        rqLogoSujainBackgroundSize: '100%',
        rqLogoSujainBackgroundPositionY: '7px',
        rqLogoSujainCursor: 'pointer',

        rqLogoWonikDisplay: 'inline-block',
        rqLogoWonikFloat: 'left',
        rqLogoWonikWidth: '140px',
        rqLogoWonikHeight: '57px',
        rqLogoWonikMarginRight: '20px',
        rqLogoWonikBackground: `url(${rqLogoWonik}) no-repeat center`,
        rqLogoWonikBackgroundSize: '100%',
        rqLogoWonikPositionY: '7px',
        rqLogoWonikCousor: 'pointer',

        rqLogoSenkoDisplay: 'inline-block',
        rqLogoSenkoFloat: 'left',
        rqLogoSenkoWidth: '103px',
        rqLogoSenkoHeight: '30px',
        rqLogoSenkoMarginRight: '20px',
        rqLogoSenkoBackground: `url(${rqLogoSenko}) no-repeat center`,
        rqLogoSenkoBackgroundSize: '100%',
        rqLogoSenkoPositionY: '7px',
        rqLogoSenkoCousor: 'pointer',

        rqLogoHydrogenDisplay: 'inline-block',
        rqLogoHydrogenFloat: 'left',
        rqLogoHydrogenWidth: '103px',
        rqLogoHydrogenHeight: '30px',
        rqLogoHydrogenMarginRight: '20px',
        rqLogoHydrogenBackground: `url(${rqLogoHydrogen}) no-repeat center`,
        rqLogoHydrogenBackgroundSize: '80%',
        rqLogoHydrogenPositionY: '7px',
        rqLogoHydrogenCousor: 'pointer',

        rqLogoTlbDisplay: 'inline-block',
        rqLogoTlbFloat: 'left',
        rqLogoTlbWidth: '103px',
        rqLogoTlbHeight: '30px',
        rqLogoTlbMarginRight: '20px',
        rqLogoTlbBackground: `url(${rqLogoTlb}) no-repeat center`,
        rqLogoTlbBackgroundSize: '80%',
        rqLogoTlbPositionY: '7px',
        rqLogoTlbCousor: 'pointer',

        rqLogoMagogDisplay: 'inline-block',
        rqLogoMagogFloat: 'left',
        rqLogoMagogWidth: '103px',
        rqLogoMagogHeight: '30px',
        rqLogoMagogMarginRight: '20px',
        rqLogoMagogBackground: `url(${rqLogoMagog}) no-repeat center`,
        rqLogoMagogBackgroundSize: '100%',
        rqLogoMagogPositionY: '7px',
        rqLogoMagogCousor: 'pointer',

        rqQckFloat: 'left',
        rqQckPosition: 'relative',
        rqQckMarginRight: '20px',

        rqQckButtonDisplay: 'block',
        rqQckButtonWidth: '30px',
        rqQckButtonHeight: '30px',
        rqQckButtonCursor: 'pointer',
        rqQckButtonTextIndent: '-9999px',
        rqQckButtonBackground: `url(${rqQckBtn}) no-repeat center center`,

        rqQckBtnDisplay: 'block',

        rqAppFloat: 'left',
        rqAppPosition: 'relative',
        rqAppMarginRight: '20px',

        rqAppButtonDisplay: 'block',
        rqAppButtonWidth: '30px',
        rqAppButtonHeight: '30px',
        rqAppButtonCursor: 'pointer',
        rqAppButtonTextIndent: '-9999px',
        rqAppButtonBackground: `url(${rqAppBtn}) no-repeat center center`,

        rqAppUlDisplay: 'none',
        rqAppUlPosition: 'absolute',
        rqAppUlTop: '100%',
        rqAppUlLeft: '50%',
        rqAppUlWidth: '110px',
        rqAppUlMarginTop: '10px',
        rqAppUlMarginLeft: '-55px',
        rqAppUlPadding: '10px 0',
        rqAppUlBackground: '#121b24',
        rqAppUlBorder: 'solid 1px #3aa7de',
        rqAppUlWebkitBorderRadius: '4px',
        rqAppUlMozBorderRadius: '4px',
        rqAppUlBoderRadius: '4px',

        rqAppUlLiPosition: 'relative',

        rqAppUlLiADisplay: 'block',
        rqAppUlLiAColor: '#fff',
        rqAppUlLiATextAlign: 'center',
        rqAppUlLiAFontSize: '13px',
        rqAppUlLiAHeight: '30px',
        rqAppUlLiALineHeight: '30px',

        rqAppUlLiAHover: '#ff8400',

        menuShortCutPosition: 'absolute',
        menuShortCutBackground: '#222222',
        menuShortCutColor: '#fff',
        menuShortCutBorder: 'solid 0.5px #737373',
        menuShortCutWidth: '30px',
        menuShortCutHeight: '20px',
        menuShortCutLeft: '-10px',
        menuShortCutZIndex: 1,
        menuShortCutTextAlign: 'center',
        menuShortCutPaddingTop: '6%',
        menuShortCutFontSize: '10px',
        menuShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqUsrFloat: 'left',
        rqUsrPosition: 'relative',
        rqUsrMarginRight: '20px',

        rqUsrButtonDisplay: 'block',
        rqUsrButtonHeight: '30px',
        rqUsrButtonBackground: 'none',
        rqUsrButtonColor: '#fff',
        rqUsrButtonCursor: 'pointer',

        rqUsrButtonSpanVerticalAlign: 'middle',
        rqUsrButtonSpanMargin: '10px',

        rqUsrButtonBeforeDisplay: 'inline-block',
        rqUsrButtonBeforeVerticalAlign: 'middle',
        rqUsrButtonBeforeWidth: '25px',
        rqUsrButtonBeforeHeight: '30px',
        rqUsrButtonBeforeBackground: `url(${rqUser}) no-repeat center center`,

        rqUsrButtonAfterDisplay: 'inline-block',
        rqUsrButtonAfterVerticalAlign: 'middle',
        rqUsrButtonAfterWidth: '8px',
        rqUsrButtonAfterHeight: '6px',
        rqUsrButtonAfterMarginTop: '3px',
        rqUsrButtonAfterBackground: `url(${rqArrow}) no-repeat center bottom`,

        rqUsrButtonOnAfterBackgroundPosition: 'center top',

        rqUsrDivDisplay: 'none',
        rqUsrDivPosition: 'absolute',
        rqUsrDivWidth: '132px',
        rqUsrDivTop: '100%',
        rqUsrDivLeft: '50%',
        rqUsrDivMarginTop: '10px',
        rqUsrDivMarginLeft: '-66px',
        rqUsrDivBackground: '#273040',
        rqUsrDivTextAlign: 'center',
        rqUsrDivBorder: 'solid 1px #75d61c',
        rqUsrDivOverflow: 'hidden',
        rqUsrDivWebkitBorderRadius: '4px 4px 8px 8px',
        rqUsrDivMozBorderRadius: '4px 4px 8px 8px',
        rqUsrDivBorderRadius: '4px 4px 8px 8px',

        rqUsrDivEmDisplay: 'block',
        rqUsrDivEmWidth: '44px',
        rqUsrDivEmHeight: '44px',
        rqUsrDivEmBorder: 'solid 2px #75d61c',
        rqUsrDivEmMargin: '10px auto',
        rqUsrDivEmBackgroundSize: 'cover',
        rqUsrDivEmTextIndent: '-9999px',
        rqUsrDivEmWebkitBorderRadius: '50%',
        rqUsrDivEmMozBorderRadius: '50%',
        rqUsrDivEmBorderRadius: '50%',

        rqUsrDivSpanDisplay: 'block',
        rqUsrDivSpanColor: '#75d61c',
        rqUsrDivSpanFontSize: '12px',
        rqUsrDivSpanMarginTop: '-5px',

        rqUsrDivPColor: '#fff',
        rqUsrDivPFontSize: '13px',

        rqUsrDivUlMarginTop: '10px',

        rqUsrDivUlLiFloat: 'left',
        rqUsrDivUlLiWidth: '33.3%',
        rqUsrDivUlLiBackground: '#1a212e',

        rqUsrDivUlLiADisplay: 'block',
        rqUsrDivUlLiAHeight: '30px',
        rqUsrDivUlLiALineHeight: '30px',
        rqUsrDivUlLiAColor: '#fff',
        rqUsrDivUlLiAFontSize: '11px',
        rqUsrDivUlLiABackground: '#1a212e',
        rqUsrDivUlLiALetterSpacing: '-0.1em',

        rqUsrDivUlLiAHoverBackround: '#75d61c',

        amanagementWidth: '18px',
        amanagementHeight: '12px',
        amanagementMarginLeft: '3px',
        amanagementMarginTop: '9px',
        amanagementDisplay: 'inline-block',

        apasswordWidth: '15px',
        apasswordHeight: '14px',
        apasswordMarginLeft: '3px',
        apasswordMarginTop: '9px',
        apasswordDisplay: 'inline-block',

        alogoutWidth: '12px',
        alogoutHeight: '14px',
        alogoutMarginLeft: '3px',
        alogoutMarginTop: '8px',
        alogoutDisplay: 'inline-block',

        rqUsrDivUlRqliFloat: 'left',
        rqUsrDivUlRqliWidth: '50%',
        rqUsrDivUlRqliBackground: '#1a212e',

        rqUsrDivUlRqliUpasswordWidth: '15px',
        rqUsrDivUlRqliUpasswordHeight: '12px',
        rqUsrDivUlRqliUpasswordMarginLeft: '3px',
        rqUsrDivUlRqliUpasswordMarginTop: '9px',
        rqUsrDivUlRqliUpasswordDisplay: 'inline-block',

        rqUsrDivUlRqliUlogoutWidth: '13px',
        rqUsrDivUlRqliUlogoutHeight: '12px',
        rqUsrDivUlRqliUlogoutMarginLeft: '3px',
        rqUsrDivUlRqliUlogoutMarginTop: '8.5px',
        rqUsrDivUlRqliUlogoutDisplay: 'inline-block',

        rqStngFloat: 'left',
        rqStngDisplay: 'block',
        rqStngWidth: '30px',
        rqStngHeight: '30px',
        rqStngMarginRight: '10px',
        rqStngBackground: `url(${rqSetting}) no-repeat center center`,

        rqUsrDeputyButtonBeforeBackground: `url(${rqUser2}) no-repeat center center`,

        rqUsrDeputyDivBorder: 'solid 1px #44addf',

        rqUsrDeputyDivEmBorder: 'solid 2px #44addf',

        rqUsrDeputyDivSpanColor: '#44addf',

        rqUsrDeputyDivUlLiWidth: '100%',

        rqUsrDeputyDivUlLiAFontSize: '12px',

        rqUsrDeputyDivUlLiAHoverBackground: '#44addf',

        rqUsrUserButtonBeforeBackground: `url(${rqUser3}) no-repeat center center`,

        rqUsrUserDivBorder: 'solid 1px #fc8b07',
        
        rqUsrUserDivEmBorder: 'solid 2px #fc8b07',

        rqUsrUserDivSpanColor: '#fc8b07',

        rqUsrUserDivUlLiAFontSize: '12px',

        rqUsrUserDivUlLiAHoverBackground: '#fc8b07',

        adminProfileBackground: `url(${rqProfile}) no-repeat center center`,

        setShortCutPosition: 'absolute',
        setShortCutBackground: '#222222',
        setShortCutColor: '#fff',
        setShortCutBorder: 'solid 0.5px #737373',
        setShortCutWidth: '30px',
        setShortCutHeight: '20px',
        setShortCutRight: '30px',
        setShortCutTop: '7px',
        setShortCutZIndex: 1,
        setShortCutTextAlign: 'center', 
        setShortCutPaddingTop: '1.6%',
        setShortCutFontSize: '10px',
        setShortCutOpacity: 0.8


    },
    Wonik: {
        divPosition: 'fixed',
        divZIndex: 2,
        divBackground: 'var(--dashboard-color)',
        divHeight: '50px',
        divPadding: '21px 40px',
        divWidth: '100vw',
        divDisplay: 'flex',
        divAlignItems: 'center',
        divColor: 'var(--white-color)',

        rqLogoWrapDisplay: 'flex',
        rqLogoWrapAlignItems: 'center',

        rqLogoWrapSpanFontSize: '18px',
        rqLogoWrapSpanPaddingLeft: '20px',
        rqLogoWrapSpanMarginLeft: '20px',
        rqLogoWrapSpanBorderLeft: '1px solid var(--middle-gray-color)',

        rqBtnWrapPosition: 'absolute',
        rqBtnWrapRight: 0,
        rqBtnWrapTop: '16px',
        rqBtnWrapMarginRight: '40px',
        rqBtnWrapDisplay: 'flex',
        rqBtnWrapFlexDirection: 'row',

        logoShortCutPosition: 'absolute',
        logoShortCutBackground: '#222222',
        logoShortCutColor: '#fff',
        logoShortCutBorder: 'solid 0.5px #737373',
        logoShortCutWidth: '30px',
        logoShortCutHeight: '20px',
        logoShortCutLeft: '-20px',
        logoShortCutTop: '5px',
        logoShortCutZIndex: 2,
        logoShortCutTextAlign: 'center',
        logoShortCutPaddingTop: '5px',
        logoShortCutFontSize: '10px',
        logoShortCutFontWeight: 400,
        logoShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqLogoDisplay: 'block',
        rqLogoFloat: 'left',
        rqLogoWidth: '140px',
        rqLogoheight: '22px',
        rqLogoBackground: `url(${rqLogo}) no-repeat center center;`,
        rqLogoCursor: 'pointer',
        rqLogoTop: '19px',

        rqLogoGCDisplay: 'inline-block',
        rqLogoGCFloat: 'left',
        rqLogoGCWidth: '110px',
        rqLogoGCHeight: '30px',
        rqLogoGCMarginRight: '20px',
        rqLogoGCBackground: `url(${rqLogoGC}) no-repeat center 3px`,
        rqLogoGCBackgroundSize: '100%',
        rqLogoGCBackgroundPositionX: '-2px',
        rqLogoGCCursor: 'pointer',

        rqLogoSujainDisplay: 'inline-block',
        rqLogoSujainFloat: 'left',
        rqLogoSujainWidth: '80px',
        rqLogoSujainHeight: '57px',
        rqLogoSujainMarginRight: '20px',
        rqLogoSujainBackground: `url(${rqLogoSujain}) no-repeat center`,
        rqLogoSujainBackgroundSize: '100%',
        rqLogoSujainBackgroundPositionY: '7px',
        rqLogoSujainCursor: 'pointer',

        rqLogoWonikDisplay: 'inline-block',
        rqLogoWonikFloat: 'left',
        rqLogoWonikWidth: '140px',
        rqLogoWonikHeight: '32px',
        rqLogoWonikBackground: `url(${rqLogoWonik}) no-repeat center`,
        rqLogoWonikBackgroundSize: '100%',
        rqLogoWonikPositionY: '7px',
        rqLogoWonikCousor: 'pointer',

        rqLogoSenkoDisplay: 'inline-block',
        rqLogoSenkoFloat: 'left',
        rqLogoSenkoWidth: '103px',
        rqLogoSenkoHeight: '30px',
        rqLogoSenkoMarginRight: '20px',
        rqLogoSenkoBackground: `url(${rqLogoSenko}) no-repeat center`,
        rqLogoSenkoBackgroundSize: '100%',
        rqLogoSenkoPositionY: '7px',
        rqLogoSenkoCousor: 'pointer',

        rqLogoHydrogenDisplay: 'inline-block',
        rqLogoHydrogenFloat: 'left',
        rqLogoHydrogenWidth: '103px',
        rqLogoHydrogenHeight: '30px',
        rqLogoHydrogenMarginRight: '20px',
        rqLogoHydrogenBackground: `url(${rqLogoHydrogen}) no-repeat center`,
        rqLogoHydrogenBackgroundSize: '80%',
        rqLogoHydrogenPositionY: '7px',
        rqLogoHydrogenCousor: 'pointer',

        rqLogoTlbDisplay: 'inline-block',
        rqLogoTlbFloat: 'left',
        rqLogoTlbWidth: '103px',
        rqLogoTlbHeight: '30px',
        rqLogoTlbMarginRight: '20px',
        rqLogoTlbBackground: `url(${rqLogoTlb}) no-repeat center`,
        rqLogoTlbBackgroundSize: '80%',
        rqLogoTlbPositionY: '7px',
        rqLogoTlbCousor: 'pointer',

        rqLogoMagogDisplay: 'inline-block',
        rqLogoMagogFloat: 'left',
        rqLogoMagogWidth: '103px',
        rqLogoMagogHeight: '30px',
        rqLogoMagogMarginRight: '20px',
        rqLogoMagogBackground: `url(${rqLogoMagog}) no-repeat center`,
        rqLogoMagogBackgroundSize: '100%',
        rqLogoMagogPositionY: '7px',
        rqLogoMagogCousor: 'pointer',

        rqQckDisplay: 'none',
        rqQckFloat: 'left',
        rqQckPosition: 'relative',
        rqQckMarginRight: '20px',

        rqQckButtonDisplay: 'block',
        rqQckButtonWidth: '30px',
        rqQckButtonHeight: '30px',
        rqQckButtonCursor: 'pointer',
        rqQckButtonTextIndent: '-9999px',
        rqQckButtonBackground: `url(${rqQckBtn}) no-repeat center center`,

        rqQckBtnDisplay: 'none',

        rqAppFloat: 'left',
        rqAppPosition: 'relative',
        rqAppMarginRight: '20px',
        rqAppOrder: 2,
        rqAppPadding: '0 20px',
        rqAppHeight: '17px',
        rqAppBorderLeft: '1px solid var(--middle-gray-color)',
        rqAppBorderRight: '1px solid var(--middle-gray-color)',

        rqAppButtonDisplay: 'block',
        rqAppButtonWidth: '20px',
        rqAppButtonHeight: '20px',
        rqAppButtonCursor: 'pointer',
        rqAppButtonTextIndent: '-9999px',
        rqAppButtonBackground: `url(${menuIcon}) no-repeat center center`,
        rqAppButtonPosition: 'relative',
        rqAppButtonTop: '-1px',

        rqAppUlDisplay: 'none',
        rqAppUlPosition: 'absolute',
        rqAppUlTop: '100%',
        rqAppUlLeft: '50%',
        rqAppUlWidth: '110px',
        rqAppUlMarginTop: '16px',
        rqAppUlMarginLeft: '-55px',
        rqAppUlPadding: '10px 0',
        rqAppUlBackground: 'var(--navy-color)',
        rqAppUlBorder: 'solid 1px #272e41',
        rqAppUlWebkitBorderRadius: '4px',
        rqAppUlMozBorderRadius: '4px',
        rqAppUlBoderRadius: '4px',

        rqAppUlLiPosition: 'relative',

        rqAppUlLiADisplay: 'block',
        rqAppUlLiAColor: '#fff',
        rqAppUlLiATextAlign: 'center',
        rqAppUlLiAFontSize: '13px',
        rqAppUlLiAHeight: '30px',
        rqAppUlLiALineHeight: '30px',

        rqAppUlLiAHover: 'var(--dashboard-color)',

        menuShortCutPosition: 'absolute',
        menuShortCutBackground: '#222222',
        menuShortCutColor: '#fff',
        menuShortCutBorder: 'solid 0.5px #737373',
        menuShortCutWidth: '30px',
        menuShortCutHeight: '20px',
        menuShortCutLeft: '-10px',
        menuShortCutZIndex: 1,
        menuShortCutTextAlign: 'center',
        menuShortCutPaddingTop: '6%',
        menuShortCutFontSize: '10px',
        menuShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqUsrFloat: 'left',
        rqUsrPosition: 'relative',
        rqUsrMarginRight: '20px',
        rqUsrOrder: 1,

        rqUsrButtonDisplay: 'block',
        rqUsrButtonHeight: '22px',
        rqUsrButtonBackground: 'none',
        rqUsrButtonColor: 'var(--middle-gray-color)',
        rqUsrButtonCursor: 'pointer',
        rqUsrButtonPosition: 'relative',
        rqUsrButtonTop: '-1px',

        rqUsrButtonSpanMargin: '10px',
        rqUsrButtonSpanFontSize: '14px',
        rqUsrButtonSpanFontWeight: 'bold',

        rqUsrButtonBeforeDisplay: 'inline-block',
        rqUsrButtonBeforeVerticalAlign: 'middle',
        rqUsrButtonBeforeWidth: '22px',
        rqUsrButtonBeforeHeight: '22px',
        rqUsrButtonBeforeBackground: `url(${userIcon}) no-repeat center center`,

        rqUsrButtonAfterDisplay: 'inline-block',
        rqUsrButtonAfterVerticalAlign: 'middle',
        rqUsrButtonAfterWidth: '7px',
        rqUsrButtonAfterHeight: '4px',
        rqUsrButtonAfterBackground: `url(${arrowIcon}) no-repeat center bottom`,

        rqUsrButtonOnAfterBackgroundPosition: 'center top',

        rqUsrDivDisplay: 'none',
        rqUsrDivPosition: 'absolute',
        rqUsrDivWidth: '100px',
        rqUsrDivTop: '100%',
        rqUsrDivLeft: '81%',
        rqUsrDivMarginTop: '11px',
        rqUsrDivMarginLeft: '-66px',
        rqUsrDivBackground: 'var(--navy-color)',
        rqUsrDivTextAlign: 'center',
        rqUsrDivBorder: 'solid 1px #272e41',
        rqUsrDivOverflow: 'hidden',
        rqUsrDivWebkitBorderRadius: '4px 4px 8px 8px',
        rqUsrDivMozBorderRadius: '4px 4px 8px 8px',
        rqUsrDivBorderRadius: '4px 4px 8px 8px',

        rqUsrDivEmDisplay: 'none',
        rqUsrDivEmWidth: '44px',
        rqUsrDivEmHeight: '44px',
        rqUsrDivEmBorder: 'solid 2px #75d61c',
        rqUsrDivEmMargin: '10px auto',
        rqUsrDivEmBackgroundSize: 'cover',
        rqUsrDivEmTextIndent: '-9999px',
        rqUsrDivEmWebkitBorderRadius: '50%',
        rqUsrDivEmMozBorderRadius: '50%',
        rqUsrDivEmBorderRadius: '50%',

        rqUsrDivSpanDisplay: 'block',
        rqUsrDivSpanColor: 'var(--title-bar-text-blue-color)',
        rqUsrDivSpanFontSize: '14px',
        rqUsrDivSpanFontWeight: '600',
        rqUsrDivSpanMarginTop: '20px',
        rqUsrDivSpanMarginBottom: '4px',

        rqUsrDivPColor: '#fff',
        rqUsrDivPFontSize: '14px',

        rqUsrDivUlMarginTop: '20px',

        rqUsrDivUlLiFloat: 'left',
        rqUsrDivUlLiWidth: '33.3%',
        rqUsrDivUlLiBackground: '#1a212e',

        rqUsrDivUlLiADisplay: 'block',
        rqUsrDivUlLiAHeight: '24px',
        rqUsrDivUlLiALineHeight: '24px',
        rqUsrDivUlLiAColor: '#fff',
        rqUsrDivUlLiAFontSize: '11px',
        rqUsrDivUlLiABackground: '#1a212e',
        rqUsrDivUlLiALetterSpacing: '-0.1em',

        rqUsrDivUlLiAHoverBackround: 'var(--dashboard-color)',

        amanagementWidth: '18px',
        amanagementHeight: '12px',
        amanagementMarginLeft: '3px',
        amanagementMarginTop: '6px',
        amanagementDisplay: 'inline-block',

        apasswordWidth: '15px',
        apasswordHeight: '14px',
        apasswordMarginLeft: '1px',
        apasswordMarginTop: '5px',
        apasswordDisplay: 'inline-block',
        iconObjectFit: 'none',

        alogoutWidth: '12px',
        alogoutHeight: '14px',
        alogoutMarginLeft: '3px',
        alogoutMarginTop: '5px',
        alogoutDisplay: 'inline-block',

        rqUsrDivUlRqliFloat: 'left',
        rqUsrDivUlRqliWidth: '50%',
        rqUsrDivUlRqliBackground: '#1a212e',

        rqUsrDivUlRqliUpasswordWidth: '15px',
        rqUsrDivUlRqliUpasswordHeight: '12px',
        rqUsrDivUlRqliUpasswordMarginLeft: '3px',
        rqUsrDivUlRqliUpasswordMarginTop: '9px',
        rqUsrDivUlRqliUpasswordDisplay: 'inline-block',

        rqUsrDivUlRqliUlogoutWidth: '13px',
        rqUsrDivUlRqliUlogoutHeight: '12px',
        rqUsrDivUlRqliUlogoutMarginLeft: '3px',
        rqUsrDivUlRqliUlogoutMarginTop: '8.5px',
        rqUsrDivUlRqliUlogoutDisplay: 'inline-block',

        rqStngFloat: 'left',
        rqStngDisplay: 'block',
        rqStngWidth: '20px',
        rqStngHeight: '20px',
        rqStngBackground: `url(${settingIcon}) no-repeat center center`,
        rqStanOrder: 3,
        rqStanPosition: 'relative',
        rqStanTop: '-1px',
        rqStanCursor: 'pointer',


        rqUsrDeputyButtonBeforeBackground: `url(${rqUser2}) no-repeat center center`,

        rqUsrDeputyDivBorder: 'solid 1px #44addf',

        rqUsrDeputyDivEmBorder: 'solid 2px #44addf',

        rqUsrDeputyDivSpanColor: '#44addf',

        rqUsrDeputyDivUlLiWidth: '100%',

        rqUsrDeputyDivUlLiAFontSize: '12px',

        rqUsrDeputyDivUlLiAHoverBackground: '#44addf',

        rqUsrUserButtonBeforeBackground: `url(${rqUser3}) no-repeat center center`,

        rqUsrUserDivBorder: 'solid 1px #fc8b07',
        
        rqUsrUserDivEmBorder: 'solid 2px #fc8b07',

        rqUsrUserDivSpanColor: '#fc8b07',

        rqUsrUserDivUlLiAFontSize: '12px',

        rqUsrUserDivUlLiAHoverBackground: '#fc8b07',

        adminProfileBackground: `url(${rqProfile}) no-repeat center center`,

        setShortCutPosition: 'absolute',
        setShortCutBackground: '#222222',
        setShortCutColor: '#fff',
        setShortCutBorder: 'solid 0.5px #737373',
        setShortCutWidth: '30px',
        setShortCutHeight: '20px',
        setShortCutRight: '30px',
        setShortCutTop: '7px',
        setShortCutZIndex: 1,
        setShortCutTextAlign: 'center', 
        setShortCutPaddingTop: '1.6%',
        setShortCutFontSize: '10px',
        setShortCutOpacity: 0.8

        
    },
    Hydrogen: {
        divPosition: 'fixed',
        divZIndex: 2,
        divBackground: '#244554',
        divHeight: '60px',
        divPadding: '21px 40px',
        divWidth: '100vw',
        divDisplay: 'flex',
        divAlignItems: 'center',
        divColor: 'var(--white-color)',

        rqLogoWrapDisplay: 'flex',
        rqLogoWrapAlignItems: 'center',

        rqLogoWrapSpanFontSize: '18px',
        rqLogoWrapSpanPaddingLeft: '20px',
        rqLogoWrapSpanMarginLeft: '20px',
        rqLogoWrapSpanBorderLeft: '1px solid var(--middle-gray-color)',

        rqBtnWrapPosition: 'absolute',
        rqBtnWrapRight: 0,
        rqBtnWrapTop: '17.5px',
        rqBtnWrapMarginRight: '40px',
        rqBtnWrapDisplay: 'flex',
        rqBtnWrapFlexDirection: 'row',

        logoShortCutPosition: 'absolute',
        logoShortCutBackground: '#222222',
        logoShortCutColor: '#fff',
        logoShortCutBorder: 'solid 0.5px #737373',
        logoShortCutWidth: '30px',
        logoShortCutHeight: '20px',
        logoShortCutLeft: '-20px',
        logoShortCutTop: '5px',
        logoShortCutZIndex: 2,
        logoShortCutTextAlign: 'center',
        logoShortCutPaddingTop: '5px',
        logoShortCutFontSize: '10px',
        logoShortCutFontWeight: 400,
        logoShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqLogoDisplay: 'block',
        rqLogoFloat: 'left',
        rqLogoWidth: '140px',
        rqLogoheight: '22px',
        rqLogoBackground: `url(${rqLogo}) no-repeat center center;`,
        rqLogoCursor: 'pointer',
        rqLogoTop: '19px',

        rqLogoGCDisplay: 'inline-block',
        rqLogoGCFloat: 'left',
        rqLogoGCWidth: '110px',
        rqLogoGCHeight: '30px',
        rqLogoGCMarginRight: '20px',
        rqLogoGCBackground: `url(${rqLogoGC}) no-repeat center 3px`,
        rqLogoGCBackgroundSize: '100%',
        rqLogoGCBackgroundPositionX: '-2px',
        rqLogoGCCursor: 'pointer',

        rqLogoSujainDisplay: 'inline-block',
        rqLogoSujainFloat: 'left',
        rqLogoSujainWidth: '80px',
        rqLogoSujainHeight: '57px',
        rqLogoSujainMarginRight: '20px',
        rqLogoSujainBackground: `url(${rqLogoSujain}) no-repeat center`,
        rqLogoSujainBackgroundSize: '100%',
        rqLogoSujainBackgroundPositionY: '7px',
        rqLogoSujainCursor: 'pointer',

        rqLogoWonikDisplay: 'inline-block',
        rqLogoWonikFloat: 'left',
        rqLogoWonikWidth: '140px',
        rqLogoWonikHeight: '32px',
        rqLogoWonikBackground: `url(${rqLogoWonik}) no-repeat center`,
        rqLogoWonikBackgroundSize: '100%',
        rqLogoWonikPositionY: '7px',
        rqLogoWonikCousor: 'pointer',

        rqLogoSenkoDisplay: 'inline-block',
        rqLogoSenkoFloat: 'left',
        rqLogoSenkoWidth: '103px',
        rqLogoSenkoHeight: '30px',
        rqLogoSenkoMarginRight: '20px',
        rqLogoSenkoBackground: `url(${rqLogoSenko}) no-repeat center`,
        rqLogoSenkoBackgroundSize: '100%',
        rqLogoSenkoPositionY: '7px',
        rqLogoSenkoCousor: 'pointer',

        rqLogoHydrogenDisplay: 'inline-block',
        rqLogoHydrogenFloat: 'left',
        rqLogoHydrogenWidth: '103px',
        rqLogoHydrogenHeight: '30px',
        rqLogoHydrogenMarginRight: '20px',
        rqLogoHydrogenBackground: `url(${rqLogoHydrogen}) no-repeat center`,
        rqLogoHydrogenBackgroundSize: '80%',
        rqLogoHydrogenPositionY: '7px',
        rqLogoHydrogenCousor: 'pointer',

        rqLogoTlbDisplay: 'inline-block',
        rqLogoTlbFloat: 'left',
        rqLogoTlbWidth: '103px',
        rqLogoTlbHeight: '30px',
        rqLogoTlbMarginRight: '20px',
        rqLogoTlbBackground: `url(${rqLogoTlb}) no-repeat center`,
        rqLogoTlbBackgroundSize: '80%',
        rqLogoTlbPositionY: '7px',
        rqLogoTlbCousor: 'pointer',

        rqLogoMagogDisplay: 'inline-block',
        rqLogoMagogFloat: 'left',
        rqLogoMagogWidth: '103px',
        rqLogoMagogHeight: '30px',
        rqLogoMagogMarginRight: '20px',
        rqLogoMagogBackground: `url(${rqLogoMagog}) no-repeat center`,
        rqLogoMagogBackgroundSize: '100%',
        rqLogoMagogPositionY: '7px',
        rqLogoMagogCousor: 'pointer',

        rqQckDisplay: 'none',
        rqQckFloat: 'left',
        rqQckPosition: 'relative',
        rqQckMarginRight: '20px',

        rqQckButtonDisplay: 'block',
        rqQckButtonWidth: '30px',
        rqQckButtonHeight: '30px',
        rqQckButtonCursor: 'pointer',
        rqQckButtonTextIndent: '-9999px',
        rqQckButtonBackground: `url(${rqQckBtn}) no-repeat center center`,

        rqQckBtnDisplay: 'none',

        rqAppFloat: 'left',
        rqAppPosition: 'relative',
        rqAppMarginRight: '20px',
        rqAppOrder: 2,
        rqAppPadding: '0 20px',
        rqAppHeight: '20px',
        rqAppBorderLeft: '1px solid var(--middle-gray-color)',
        rqAppBorderRight: '1px solid var(--middle-gray-color)',

        rqAppButtonDisplay: 'block',
        rqAppButtonWidth: '20px',
        rqAppButtonHeight: '20px',
        rqAppButtonCursor: 'pointer',
        rqAppButtonTextIndent: '-9999px',
        rqAppButtonBackground: `url(${menuIcon}) no-repeat center center`,
        rqAppButtonPosition: 'relative',
        rqAppButtonTop: '-1px',

        rqAppUlDisplay: 'none',
        rqAppUlPosition: 'absolute',
        rqAppUlTop: '100%',
        rqAppUlLeft: '50%',
        rqAppUlWidth: '104px',
        rqAppUlHeight: '126px',
        rqAppUlMarginTop: '16px',
        rqAppUlMarginLeft: '-55px',
        rqAppUlPadding: '10px 0',
        rqAppUlBackground: 'var(--navy-color)',
        rqAppUlBorder: 'solid 1px #00AFFF',
        rqAppUlWebkitBorderRadius: '4px',
        rqAppUlMozBorderRadius: '4px',
        rqAppUlBoderRadius: '10px',

        rqAppUlLiPosition: 'relative',

        rqAppUlLiADisplay: 'block',
        rqAppUlLiAColor: '#fff',
        rqAppUlLiATextAlign: 'center',
        rqAppUlLiAFontSize: '16px',
        rqAppUlLiAHeight: '28px',
        rqAppUlLiALineHeight: '28px',

        /* rqAppUlLiAHover: 'var(--dashboard-color)', */
        rqAppUlLiTextHover: '#00AFFF',

        menuShortCutPosition: 'absolute',
        menuShortCutBackground: '#222222',
        menuShortCutColor: '#fff',
        menuShortCutBorder: 'solid 0.5px #737373',
        menuShortCutWidth: '30px',
        menuShortCutHeight: '20px',
        menuShortCutLeft: '-10px',
        menuShortCutZIndex: 1,
        menuShortCutTextAlign: 'center',
        menuShortCutPaddingTop: '6%',
        menuShortCutFontSize: '10px',
        menuShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqUsrFloat: 'left',
        rqUsrPosition: 'relative',
        rqUsrMarginRight: '0px',
        rqUsrOrder: 1,

        rqUsrButtonDisplay: 'block',
        rqUsrButtonHeight: '22px',
        rqUsrButtonBackground: 'none',
        rqUsrButtonColor: 'var(--middle-gray-color)',
        rqUsrButtonCursor: 'pointer',
        rqUsrButtonPosition: 'relative',
        rqUsrButtonTop: '-1px',

        rqUsrButtonSpanMargin: '5px 10px 5px 5px',
        rqUsrButtonSpanFontSize: '14px',
        rqUsrButtonSpanFontWeight: 'bold',

        rqUsrButtonBeforeDisplay: 'inline-block',
        rqUsrButtonBeforeVerticalAlign: 'middle',
        rqUsrButtonBeforeWidth: '22px',
        rqUsrButtonBeforeHeight: '22px',
        rqUsrButtonBeforeBackground: `url(${userIcon}) no-repeat center center`,

        rqUsrButtonAfterDisplay: 'inline-block',
        rqUsrButtonAfterVerticalAlign: 'middle',
        rqUsrButtonAfterWidth: '7px',
        rqUsrButtonAfterHeight: '4px',
        rqUsrButtonAfterBackground: `url(${arrowIcon}) no-repeat center bottom`,

        rqUsrButtonOnAfterBackgroundPosition: 'center top',

        rqUsrDivDisplay: 'none',
        rqUsrDivPosition: 'absolute',
        rqUsrDivWidth: '100px',
        rqUsrDivTop: '100%',
        rqUsrDivLeft: '70%',
        rqUsrDivMarginTop: '11px',
        rqUsrDivMarginLeft: '-66px',
        rqUsrDivBackground: 'var(--navy-color)',
        rqUsrDivTextAlign: 'center',
        rqUsrDivBorder: 'solid 1px #00AFFF',
        rqUsrDivOverflow: 'hidden',
        rqUsrDivWebkitBorderRadius: '4px 4px 8px 8px',
        rqUsrDivMozBorderRadius: '4px 4px 8px 8px',
        rqUsrDivBorderRadius: '10px 10px 10px 10px',

        rqUsrDivEmDisplay: 'none',
        rqUsrDivEmWidth: '44px',
        rqUsrDivEmHeight: '44px',
        rqUsrDivEmBorder: 'solid 2px #75d61c',
        rqUsrDivEmMargin: '10px auto',
        rqUsrDivEmBackgroundSize: 'cover',
        rqUsrDivEmTextIndent: '-9999px',
        rqUsrDivEmWebkitBorderRadius: '50%',
        rqUsrDivEmMozBorderRadius: '50%',
        rqUsrDivEmBorderRadius: '50%',

        rqUsrDivSpanDisplay: 'block',
        rqUsrDivSpanColor: '#00AFFF',
        rqUsrDivSpanFontSize: '16px',
        rqUsrDivSpanFontWeight: '600',
        rqUsrDivSpanMarginTop: '16px',
        rqUsrDivSpanMarginBottom: '4px',

        rqUsrDivPColor: '#fff',
        rqUsrDivPFontSize: '14px',

        rqUsrDivUlMarginTop: '10px',

        rqUsrDivUlLiFloat: 'left',
        rqUsrDivUlLiWidth: '33.3%',
        rqUsrDivUlLiBackground: '#1a212e',

        rqUsrDivUlLiADisplay: 'block',
        rqUsrDivUlLiAHeight: '24px',
        rqUsrDivUlLiALineHeight: '24px',
        rqUsrDivUlLiAColor: '#fff',
        rqUsrDivUlLiAFontSize: '11px',
        rqUsrDivUlLiABackground: '#1a212e',
        rqUsrDivUlLiALetterSpacing: '-0.1em',

        rqUsrDivUlLiAHoverBackround: 'var(--dashboard-color)',

        amanagementWidth: '18px',
        amanagementHeight: '12px',
        amanagementMarginLeft: '3px',
        amanagementMarginTop: '6px',
        amanagementDisplay: 'inline-block',

        apasswordWidth: '15px',
        apasswordHeight: '14px',
        apasswordMarginLeft: '1px',
        apasswordMarginTop: '5px',
        apasswordDisplay: 'inline-block',
        iconObjectFit: 'none',

        alogoutWidth: '12px',
        alogoutHeight: '14px',
        alogoutMarginLeft: '3px',
        alogoutMarginTop: '5px',
        alogoutDisplay: 'inline-block',

        rqUsrDivUlRqliFloat: 'left',
        rqUsrDivUlRqliWidth: '50%',
        rqUsrDivUlRqliBackground: '#1a212e',

        rqUsrDivUlRqliUpasswordWidth: '15px',
        rqUsrDivUlRqliUpasswordHeight: '12px',
        rqUsrDivUlRqliUpasswordMarginLeft: '3px',
        rqUsrDivUlRqliUpasswordMarginTop: '9px',
        rqUsrDivUlRqliUpasswordDisplay: 'inline-block',

        rqUsrDivUlRqliUlogoutWidth: '13px',
        rqUsrDivUlRqliUlogoutHeight: '12px',
        rqUsrDivUlRqliUlogoutMarginLeft: '3px',
        rqUsrDivUlRqliUlogoutMarginTop: '8.5px',
        rqUsrDivUlRqliUlogoutDisplay: 'inline-block',

        rqStngFloat: 'left',
        rqStngDisplay: 'block',
        rqStngWidth: '20px',
        rqStngHeight: '20px',
        rqStngBackground: `url(${settingIcon}) no-repeat center center`,
        rqStanOrder: 3,
        rqStanPosition: 'relative',
        rqStanTop: '-1px',
        rqStanCursor: 'pointer',


        rqUsrDeputyButtonBeforeBackground: `url(${rqUser2}) no-repeat center center`,

        rqUsrDeputyDivBorder: 'solid 1px #44addf',

        rqUsrDeputyDivEmBorder: 'solid 2px #44addf',

        rqUsrDeputyDivSpanColor: '#44addf',

        rqUsrDeputyDivUlLiWidth: '100%',

        rqUsrDeputyDivUlLiAFontSize: '12px',

        rqUsrDeputyDivUlLiAHoverBackground: '#44addf',

        rqUsrUserButtonBeforeBackground: `url(${rqUser3}) no-repeat center center`,

        rqUsrUserDivBorder: 'solid 1px #fc8b07',

        rqUsrUserDivEmBorder: 'solid 2px #fc8b07',

        rqUsrUserDivSpanColor: '#fc8b07',

        rqUsrUserDivUlLiAFontSize: '12px',

        rqUsrUserDivUlLiAHoverBackground: '#fc8b07',

        adminProfileBackground: `url(${rqProfile}) no-repeat center center`,

        setShortCutPosition: 'absolute',
        setShortCutBackground: '#222222',
        setShortCutColor: '#fff',
        setShortCutBorder: 'solid 0.5px #737373',
        setShortCutWidth: '30px',
        setShortCutHeight: '20px',
        setShortCutRight: '30px',
        setShortCutTop: '7px',
        setShortCutZIndex: 1,
        setShortCutTextAlign: 'center',
        setShortCutPaddingTop: '1.6%',
        setShortCutFontSize: '10px',
        setShortCutOpacity: 0.8,

        rqAppUlLiAPadding: '0px 6px'


    },
    Gyeonggi: {
        divPosition: 'fixed',
        divZIndex: 2,
        divBackground: 'var(--dashboard-color)',
        divHeight: '50px',
        divPadding: '21px 40px',
        divWidth: '100vw',
        divDisplay: 'flex',
        divAlignItems: 'center',
        divColor: 'var(--white-color)',

        rqLogoWrapDisplay: 'flex',
        rqLogoWrapAlignItems: 'center',

        rqLogoWrapSpanFontSize: '18px',
        rqLogoWrapSpanPaddingLeft: '20px',
        rqLogoWrapSpanMarginLeft: '2px',
        rqLogoWrapSpanBorderLeft: '1px solid var(--middle-gray-color)',

        rqBtnWrapPosition: 'absolute',
        rqBtnWrapRight: 0,
        rqBtnWrapTop: '16px',
        rqBtnWrapMarginRight: '40px',
        rqBtnWrapDisplay: 'flex',
        rqBtnWrapFlexDirection: 'row',

        logoShortCutPosition: 'absolute',
        logoShortCutBackground: '#222222',
        logoShortCutColor: '#fff',
        logoShortCutBorder: 'solid 0.5px #737373',
        logoShortCutWidth: '30px',
        logoShortCutHeight: '20px',
        logoShortCutLeft: '-20px',
        logoShortCutTop: '5px',
        logoShortCutZIndex: 2,
        logoShortCutTextAlign: 'center',
        logoShortCutPaddingTop: '5px',
        logoShortCutFontSize: '10px',
        logoShortCutFontWeight: 400,
        logoShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqLogoDisplay: 'block',
        rqLogoFloat: 'left',
        rqLogoWidth: '140px',
        rqLogoheight: '22px',
        rqLogoBackground: `url(${rqLogo}) no-repeat center center;`,
        rqLogoCursor: 'pointer',
        rqLogoTop: '19px',

        rqLogoGCDisplay: 'inline-block',
        rqLogoGCFloat: 'left',
        rqLogoGCWidth: '110px',
        rqLogoGCHeight: '30px',
        rqLogoGCMarginRight: '20px',
        rqLogoGCBackground: `url(${rqLogoGC}) no-repeat center 3px`,
        rqLogoGCBackgroundSize: '100%',
        rqLogoGCBackgroundPositionX: '-2px',
        rqLogoGCCursor: 'pointer',

        rqLogoSujainDisplay: 'inline-block',
        rqLogoSujainFloat: 'left',
        rqLogoSujainWidth: '80px',
        rqLogoSujainHeight: '57px',
        rqLogoSujainMarginRight: '20px',
        rqLogoSujainBackground: `url(${rqLogoSujain}) no-repeat center`,
        rqLogoSujainBackgroundSize: '100%',
        rqLogoSujainBackgroundPositionY: '7px',
        rqLogoSujainCursor: 'pointer',

        rqLogoWonikDisplay: 'inline-block',
        rqLogoWonikFloat: 'left',
        rqLogoWonikWidth: '140px',
        rqLogoWonikHeight: '32px',
        rqLogoWonikBackground: `url(${rqLogoWonik}) no-repeat center`,
        rqLogoWonikBackgroundSize: '100%',
        rqLogoWonikPositionY: '7px',
        rqLogoWonikCousor: 'pointer',

        rqLogoSenkoDisplay: 'inline-block',
        rqLogoSenkoFloat: 'left',
        rqLogoSenkoWidth: '103px',
        rqLogoSenkoHeight: '30px',
        rqLogoSenkoMarginRight: '20px',
        rqLogoSenkoBackground: `url(${rqLogoSenko}) no-repeat center`,
        rqLogoSenkoBackgroundSize: '100%',
        rqLogoSenkoPositionY: '7px',
        rqLogoSenkoCousor: 'pointer',

        rqLogoHydrogenDisplay: 'inline-block',
        rqLogoHydrogenFloat: 'left',
        rqLogoHydrogenWidth: '103px',
        rqLogoHydrogenHeight: '30px',
        rqLogoHydrogenMarginRight: '20px',
        rqLogoHydrogenBackground: `url(${rqLogoHydrogen}) no-repeat center`,
        rqLogoHydrogenBackgroundSize: '80%',
        rqLogoHydrogenPositionY: '7px',
        rqLogoHydrogenCousor: 'pointer',

        rqLogoTlbDisplay: 'inline-block',
        rqLogoTlbFloat: 'left',
        rqLogoTlbWidth: '103px',
        rqLogoTlbHeight: '30px',
        rqLogoTlbMarginRight: '20px',
        rqLogoTlbBackground: `url(${rqLogoTlb}) no-repeat center`,
        rqLogoTlbBackgroundSize: '80%',
        rqLogoTlbPositionY: '7px',
        rqLogoTlbCousor: 'pointer',

        rqLogoGGDisplay: 'inline-block',
        rqLogoGGFloat: 'left',
        rqLogoGGWidth: '63px',
        rqLogoGGHeight: '24px',
        rqLogoGGMarginRight: '20px',
        rqLogoGGBackground: `url(${rqLogoGyeonggi}) no-repeat center`,
        rqLogoGGBackgroundSize: '100%',
        rqLogoGGPositionY: '1px',

        rqQckDisplay: 'none',
        rqQckFloat: 'left',
        rqQckPosition: 'relative',
        rqQckMarginRight: '20px',

        rqQckButtonDisplay: 'block',
        rqQckButtonWidth: '30px',
        rqQckButtonHeight: '30px',
        rqQckButtonCursor: 'pointer',
        rqQckButtonTextIndent: '-9999px',
        rqQckButtonBackground: `url(${rqQckBtn}) no-repeat center center`,

        rqQckBtnDisplay: 'none',

        rqAppFloat: 'left',
        rqAppPosition: 'relative',
        rqAppMarginRight: '20px',
        rqAppOrder: 2,
        rqAppPadding: '0 20px',
        rqAppHeight: '17px',
        rqAppBorderLeft: '1px solid var(--middle-gray-color)',
        rqAppBorderRight: '1px solid var(--middle-gray-color)',

        rqAppButtonDisplay: 'block',
        rqAppButtonWidth: '20px',
        rqAppButtonHeight: '20px',
        rqAppButtonCursor: 'pointer',
        rqAppButtonTextIndent: '-9999px',
        rqAppButtonBackground: `url(${menuIcon}) no-repeat center center`,
        rqAppButtonPosition: 'relative',
        rqAppButtonTop: '-1px',

        rqAppUlDisplay: 'none',
        rqAppUlPosition: 'absolute',
        rqAppUlTop: '100%',
        rqAppUlLeft: '50%',
        rqAppUlWidth: '110px',
        rqAppUlMarginTop: '16px',
        rqAppUlMarginLeft: '-55px',
        rqAppUlPadding: '10px 0',
        rqAppUlBackground: 'var(--navy-color)',
        rqAppUlBorder: 'solid 1px #272e41',
        rqAppUlWebkitBorderRadius: '4px',
        rqAppUlMozBorderRadius: '4px',
        rqAppUlBoderRadius: '4px',

        rqAppUlLiPosition: 'relative',

        rqAppUlLiADisplay: 'block',
        rqAppUlLiAColor: '#fff',
        rqAppUlLiATextAlign: 'center',
        rqAppUlLiAFontSize: '13px',
        rqAppUlLiAHeight: '30px',
        rqAppUlLiALineHeight: '30px',

        rqAppUlLiAHover: 'var(--dashboard-color)',

        menuShortCutPosition: 'absolute',
        menuShortCutBackground: '#222222',
        menuShortCutColor: '#fff',
        menuShortCutBorder: 'solid 0.5px #737373',
        menuShortCutWidth: '30px',
        menuShortCutHeight: '20px',
        menuShortCutLeft: '-10px',
        menuShortCutZIndex: 1,
        menuShortCutTextAlign: 'center',
        menuShortCutPaddingTop: '6%',
        menuShortCutFontSize: '10px',
        menuShortCutOpacity: 0.8,

        hideKeyVisibility: 'hidden',

        rqUsrFloat: 'left',
        rqUsrPosition: 'relative',
        rqUsrMarginRight: '20px',
        rqUsrOrder: 1,

        rqUsrButtonDisplay: 'block',
        rqUsrButtonHeight: '22px',
        rqUsrButtonBackground: 'none',
        rqUsrButtonColor: 'var(--middle-gray-color)',
        rqUsrButtonCursor: 'pointer',
        rqUsrButtonPosition: 'relative',
        rqUsrButtonTop: '-1px',

        rqUsrButtonSpanMargin: '10px',
        rqUsrButtonSpanFontSize: '14px',
        rqUsrButtonSpanFontWeight: 'bold',

        rqUsrButtonBeforeDisplay: 'inline-block',
        rqUsrButtonBeforeVerticalAlign: 'middle',
        rqUsrButtonBeforeWidth: '22px',
        rqUsrButtonBeforeHeight: '22px',
        rqUsrButtonBeforeBackground: `url(${userIcon}) no-repeat center center`,

        rqUsrButtonAfterDisplay: 'inline-block',
        rqUsrButtonAfterVerticalAlign: 'middle',
        rqUsrButtonAfterWidth: '7px',
        rqUsrButtonAfterHeight: '4px',
        rqUsrButtonAfterBackground: `url(${arrowIcon}) no-repeat center bottom`,

        rqUsrButtonOnAfterBackgroundPosition: 'center top',

        rqUsrDivDisplay: 'none',
        rqUsrDivPosition: 'absolute',
        rqUsrDivWidth: '100px',
        rqUsrDivTop: '100%',
        rqUsrDivLeft: '81%',
        rqUsrDivMarginTop: '11px',
        rqUsrDivMarginLeft: '-66px',
        rqUsrDivBackground: 'var(--navy-color)',
        rqUsrDivTextAlign: 'center',
        rqUsrDivBorder: 'solid 1px #272e41',
        rqUsrDivOverflow: 'hidden',
        rqUsrDivWebkitBorderRadius: '4px 4px 8px 8px',
        rqUsrDivMozBorderRadius: '4px 4px 8px 8px',
        rqUsrDivBorderRadius: '4px 4px 8px 8px',

        rqUsrDivEmDisplay: 'none',
        rqUsrDivEmWidth: '44px',
        rqUsrDivEmHeight: '44px',
        rqUsrDivEmBorder: 'solid 2px #75d61c',
        rqUsrDivEmMargin: '10px auto',
        rqUsrDivEmBackgroundSize: 'cover',
        rqUsrDivEmTextIndent: '-9999px',
        rqUsrDivEmWebkitBorderRadius: '50%',
        rqUsrDivEmMozBorderRadius: '50%',
        rqUsrDivEmBorderRadius: '50%',

        rqUsrDivSpanDisplay: 'block',
        rqUsrDivSpanColor: 'var(--title-bar-text-blue-color)',
        rqUsrDivSpanFontSize: '14px',
        rqUsrDivSpanFontWeight: '600',
        rqUsrDivSpanMarginTop: '20px',
        rqUsrDivSpanMarginBottom: '4px',

        rqUsrDivPColor: '#fff',
        rqUsrDivPFontSize: '14px',

        rqUsrDivUlMarginTop: '20px',

        rqUsrDivUlLiFloat: 'left',
        rqUsrDivUlLiWidth: '33.3%',
        rqUsrDivUlLiBackground: '#1a212e',

        rqUsrDivUlLiADisplay: 'block',
        rqUsrDivUlLiAHeight: '24px',
        rqUsrDivUlLiALineHeight: '24px',
        rqUsrDivUlLiAColor: '#fff',
        rqUsrDivUlLiAFontSize: '11px',
        rqUsrDivUlLiABackground: '#1a212e',
        rqUsrDivUlLiALetterSpacing: '-0.1em',

        rqUsrDivUlLiAHoverBackround: 'var(--dashboard-color)',

        amanagementWidth: '18px',
        amanagementHeight: '12px',
        amanagementMarginLeft: '3px',
        amanagementMarginTop: '6px',
        amanagementDisplay: 'inline-block',

        apasswordWidth: '15px',
        apasswordHeight: '14px',
        apasswordMarginLeft: '1px',
        apasswordMarginTop: '5px',
        apasswordDisplay: 'inline-block',
        iconObjectFit: 'contain',

        alogoutWidth: '12px',
        alogoutHeight: '14px',
        alogoutMarginLeft: '3px',
        alogoutMarginTop: '5px',
        alogoutDisplay: 'inline-block',

        rqUsrDivUlRqliFloat: 'left',
        rqUsrDivUlRqliWidth: '50%',
        rqUsrDivUlRqliBackground: '#1a212e',

        rqUsrDivUlRqliUpasswordWidth: '15px',
        rqUsrDivUlRqliUpasswordHeight: '12px',
        rqUsrDivUlRqliUpasswordMarginLeft: '3px',
        rqUsrDivUlRqliUpasswordMarginTop: '9px',
        rqUsrDivUlRqliUpasswordDisplay: 'inline-block',

        rqUsrDivUlRqliUlogoutWidth: '13px',
        rqUsrDivUlRqliUlogoutHeight: '12px',
        rqUsrDivUlRqliUlogoutMarginLeft: '3px',
        rqUsrDivUlRqliUlogoutMarginTop: '8.5px',
        rqUsrDivUlRqliUlogoutDisplay: 'inline-block',

        rqStngFloat: 'left',
        rqStngDisplay: 'block',
        rqStngWidth: '20px',
        rqStngHeight: '20px',
        rqStngBackground: `url(${settingIcon}) no-repeat center center`,
        rqStanOrder: 3,
        rqStanPosition: 'relative',
        rqStanTop: '-1px',
        rqStanCursor: 'pointer',


        rqUsrDeputyButtonBeforeBackground: `url(${rqUser2}) no-repeat center center`,

        rqUsrDeputyDivBorder: 'solid 1px #44addf',

        rqUsrDeputyDivEmBorder: 'solid 2px #44addf',

        rqUsrDeputyDivSpanColor: '#44addf',

        rqUsrDeputyDivUlLiWidth: '100%',

        rqUsrDeputyDivUlLiAFontSize: '12px',

        rqUsrDeputyDivUlLiAHoverBackground: '#44addf',

        rqUsrUserButtonBeforeBackground: `url(${rqUser3}) no-repeat center center`,

        rqUsrUserDivBorder: 'solid 1px #fc8b07',
        
        rqUsrUserDivEmBorder: 'solid 2px #fc8b07',

        rqUsrUserDivSpanColor: '#fc8b07',

        rqUsrUserDivUlLiAFontSize: '12px',

        rqUsrUserDivUlLiAHoverBackground: '#fc8b07',

        adminProfileBackground: `url(${rqProfile}) no-repeat center center`,

        setShortCutPosition: 'absolute',
        setShortCutBackground: '#222222',
        setShortCutColor: '#fff',
        setShortCutBorder: 'solid 0.5px #737373',
        setShortCutWidth: '30px',
        setShortCutHeight: '20px',
        setShortCutRight: '30px',
        setShortCutTop: '7px',
        setShortCutZIndex: 1,
        setShortCutTextAlign: 'center', 
        setShortCutPaddingTop: '1.6%',
        setShortCutFontSize: '10px',
        setShortCutOpacity: 0.8
    }
}

export const TitleBar = styled.div`
    & {
        position: ${_TitleBar[PR.styleMode].divPosition};
        z-index: ${_TitleBar[PR.styleMode].divZIndex};
        right: ${_TitleBar[PR.styleMode].divRight};
        top: ${_TitleBar[PR.styleMode].divTop};
        background: ${_TitleBar[PR.styleMode].divBackground};
        height: ${_TitleBar[PR.styleMode].divHeight};
        padding: ${_TitleBar[PR.styleMode].divPadding};
        width: ${_TitleBar[PR.styleMode].divWidth};
        color: ${_TitleBar[PR.styleMode].divColor};
        display: ${_TitleBar[PR.styleMode].divDisplay};
        align-items: ${_TitleBar[PR.styleMode].divAlignItems};
    }

    &:before {
        content: '';
        display: ${_TitleBar[PR.styleMode].divBeforeDisplay};
        width: ${_TitleBar[PR.styleMode].divBeforeWidth};
        height: ${_TitleBar[PR.styleMode].divBeforeHeight};
        border-top: ${_TitleBar[PR.styleMode].divBeforeBorderTop};
        border-left: ${_TitleBar[PR.styleMode].divBeforeBorderLeft};
        position: ${_TitleBar[PR.styleMode].divBeforePosition};
        right: ${_TitleBar[PR.styleMode].divBeforeRight};
        top: ${_TitleBar[PR.styleMode].divBeforeTop};
    }

    &:after {
        ${props => props.theme.variables.clearfix()};
    }

    .rqLogoWrap {
        display: ${_TitleBar[PR.styleMode].rqLogoWrapDisplay};
        align-items: ${_TitleBar[PR.styleMode].rqLogoWrapAlignItems};
        float: ${_TitleBar[PR.styleMode].rqLogoWrapFloat};
        
        span {
            display: ${_TitleBar[PR.styleMode].rqLogoWrapSpanDisplay};
            font-size: ${_TitleBar[PR.styleMode].rqLogoWrapSpanFontSize};
            padding-left: ${_TitleBar[PR.styleMode].rqLogoWrapSpanPaddingLeft};
            margin-left: ${_TitleBar[PR.styleMode].rqLogoWrapSpanMarginLeft};
            border-left: ${_TitleBar[PR.styleMode].rqLogoWrapSpanBorderLeft};
        }
    }

    .rqBtnWrap {
        position: ${_TitleBar[PR.styleMode].rqBtnWrapPosition};
        right: ${_TitleBar[PR.styleMode].rqBtnWrapRight};
        top: ${_TitleBar[PR.styleMode].rqBtnWrapTop};
        margin-right: ${_TitleBar[PR.styleMode].rqBtnWrapMarginRight};
        display: ${_TitleBar[PR.styleMode].rqBtnWrapDisplay};;
        flex-direction: ${_TitleBar[PR.styleMode].rqBtnWrapFlexDirection};
        float: ${_TitleBar[PR.styleMode].rqBtnWrapFloat};
        align-items: center;
    }

    .rqQckBtn {
        display: ${_TitleBar[PR.styleMode].rqQckBtnDisplay};
    }

    .logoShortCut {
        position: ${_TitleBar[PR.styleMode].logoShortCutPosition};
        background: ${_TitleBar[PR.styleMode].logoShortCutBackground};
        color: ${_TitleBar[PR.styleMode].logoShortCutColor};
        border: ${_TitleBar[PR.styleMode].logoShortCutBorder};
        width: ${_TitleBar[PR.styleMode].logoShortCutWidth};
        height: ${_TitleBar[PR.styleMode].logoShortCutHeight};
        left: ${_TitleBar[PR.styleMode].logoShortCutLeft};
        top: ${_TitleBar[PR.styleMode].logoShortCutTop};
        z-index: ${_TitleBar[PR.styleMode].logoShortCutZIndex};
        text-align: ${_TitleBar[PR.styleMode].logoShortCutTextAlign};
        padding-top: ${_TitleBar[PR.styleMode].logoShortCutPaddingTop};
        font-size: ${_TitleBar[PR.styleMode].logoShortCutFontSize};
        font-weight: ${_TitleBar[PR.styleMode].logoShortCutFontWeight};
        opacity: ${_TitleBar[PR.styleMode].logoShortCutOpacity};
    }

    .hideKey {
        visibility: ${_TitleBar[PR.styleMode].hideKeyVisibility};
    }

    .rqLogo {
        display: ${_TitleBar[PR.styleMode].rqLogoDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoheight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoBackground};
        cursor: ${_TitleBar[PR.styleMode].rqLogoCursor};
        position: ${_TitleBar[PR.styleMode].rqLogoPosition};
        top: ${_TitleBar[PR.styleMode].rqLogoTop};
    }

    .rqLogoGC {
        display: ${_TitleBar[PR.styleMode].rqLogoGCDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoGCFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoGCWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoGCHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoGCMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoGCBackground};
        background-size: ${_TitleBar[PR.styleMode].rqLogoGCBackgroundSize};
        background-position-x: ${_TitleBar[PR.styleMode].rqLogoGCBackgroundPositionX};
        cursor: ${_TitleBar[PR.styleMode].rqLogoGCCursor};
    }

    .rqLogoSujain {
        display: ${_TitleBar[PR.styleMode].rqLogoSujainDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoSujainFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoSujainWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoSujainHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoSujainMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoSujainBackground};
        background-size: ${_TitleBar[PR.styleMode].rqLogoSujainBackgroundSize};
        background-position-y: ${_TitleBar[PR.styleMode].rqLogoSujainBackgroundPositionY};
        cursor: ${_TitleBar[PR.styleMode].rqLogoSujainCursor};
    }

    .rqLogoWonik {
        display: ${_TitleBar[PR.styleMode].rqLogoWonikDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoWonikFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoWonikWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoWonikHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoWonikMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoWonikBackground};
        background-size: ${_TitleBar[PR.styleMode].rqLogoWonikBackgroundSize};
        background-position-y: ${_TitleBar[PR.styleMode].rqLogoWonikPositionY};
        cursor: ${_TitleBar[PR.styleMode].rqLogoWonikCousor};
    }

    .rqLogoSenko {
        display: ${_TitleBar[PR.styleMode].rqLogoSenkoDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoSenkoFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoSenkoWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoSenkoHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoSenkoMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoSenkoBackground};
        background-size: ${_TitleBar[PR.styleMode].rqLogoSenkoBackgroundSize};
        background-position-y: ${_TitleBar[PR.styleMode].rqLogoSenkoPositionY};
        cursor: ${_TitleBar[PR.styleMode].rqLogoSenkoCousor};
    }

    .rqLogoHydrogen {
        display: ${_TitleBar[PR.styleMode].rqLogoHydrogenDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoHydrogenFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoHydrogenWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoHydrogenHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoHydrogenMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoHydrogenBackground}; 
        background-size: ${_TitleBar[PR.styleMode].rqLogoHydrogenBackgroundSize};
        /* background-position-y: ${_TitleBar[PR.styleMode].rqLogoHydrogenPositionY}; */
        cursor: ${_TitleBar[PR.styleMode].rqLogoHydrogenCousor};
    }

    .rqLogoTlb {
        display: ${_TitleBar[PR.styleMode].rqLogoTlbDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoTlbFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoTlbWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoTlbHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoTlbMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoTlbBackground}; 
        background-size: ${_TitleBar[PR.styleMode].rqLogoTlbBackgroundSize};
        /* background-position-y: ${_TitleBar[PR.styleMode].rqLogoTlbPositionY}; */
        cursor: ${_TitleBar[PR.styleMode].rqLogoTlbCousor};
    }

    .rqLogoGG {
        display: ${_TitleBar[PR.styleMode].rqLogoGGDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoGGFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoGGWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoGGHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoGGMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoGGBackground}; 
        background-size: ${_TitleBar[PR.styleMode].rqLogoGGBackgroundSize};
        background-position-y: ${_TitleBar[PR.styleMode].rqLogoGGPositionY};
        cursor: ${(props) => props.$isEditMode ? 'default' : 'pointer'}
    }

    .rqLogoMagog {
        display: ${_TitleBar[PR.styleMode].rqLogoMagogDisplay};
        float: ${_TitleBar[PR.styleMode].rqLogoMagogFloat};
        width: ${_TitleBar[PR.styleMode].rqLogoMagogWidth};
        height: ${_TitleBar[PR.styleMode].rqLogoMagogHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqLogoMagogMarginRight};
        background: ${_TitleBar[PR.styleMode].rqLogoMagogBackground};
        background-size: ${_TitleBar[PR.styleMode].rqLogoMagogBackgroundSize};
        background-position-y: ${_TitleBar[PR.styleMode].rqLogoMagogPositionY};
        cursor: ${_TitleBar[PR.styleMode].rqLogoMagogCousor};
    }

    .rqQck {
        display: ${_TitleBar[PR.styleMode].rqQckDisplay};
        float: ${_TitleBar[PR.styleMode].rqQckFloat};
        position: ${_TitleBar[PR.styleMode].rqQckPosition};
        margin-right: ${_TitleBar[PR.styleMode].rqQckMarginRight};
    }

    .rqQck button {
        display: ${_TitleBar[PR.styleMode].rqQckButtonDisplay};
        width: ${_TitleBar[PR.styleMode].rqQckButtonWidth};
        height: ${_TitleBar[PR.styleMode].rqQckButtonHeight};
        cursor: ${_TitleBar[PR.styleMode].rqQckButtonCursor};
        text-indent: ${_TitleBar[PR.styleMode].rqQckButtonTextIndent};
        background: ${_TitleBar[PR.styleMode].rqQckButtonBackground};
    }

    
    .rqApp {
        float: ${_TitleBar[PR.styleMode].rqAppFloat};
        position: ${_TitleBar[PR.styleMode].rqAppPosition};
        margin-right: ${_TitleBar[PR.styleMode].rqAppMarginRight};
        order: ${_TitleBar[PR.styleMode].rqAppOrder};
        padding: ${_TitleBar[PR.styleMode].rqAppPadding};
        height: ${_TitleBar[PR.styleMode].rqAppHeight};
        border-left: ${_TitleBar[PR.styleMode].rqAppBorderLeft};
        border-right: ${_TitleBar[PR.styleMode].rqAppBorderRight};
        cursor: pointer;
    }

    .rqApp button {
        display: ${_TitleBar[PR.styleMode].rqAppButtonDisplay};
        width: ${_TitleBar[PR.styleMode].rqAppButtonWidth};
        height: ${_TitleBar[PR.styleMode].rqAppButtonHeight};
        cursor: ${_TitleBar[PR.styleMode].rqAppButtonCursor};
        text-indent: ${_TitleBar[PR.styleMode].rqAppButtonTextIndent};
        background: ${_TitleBar[PR.styleMode].rqAppButtonBackground};
        position: ${_TitleBar[PR.styleMode].rqAppButtonPosition};
        top: ${_TitleBar[PR.styleMode].rqAppButtonTop};
    }

    .rqApp ul {
        display: ${_TitleBar[PR.styleMode].rqAppUlDisplay};
        position: ${_TitleBar[PR.styleMode].rqAppUlPosition};
        top: ${_TitleBar[PR.styleMode].rqAppUlTop};
        left: ${_TitleBar[PR.styleMode].rqAppUlLeft};
        width: ${_TitleBar[PR.styleMode].rqAppUlWidth};
        height: ${_TitleBar[PR.styleMode].rqAppUlHeight};
        margin-top: ${_TitleBar[PR.styleMode].rqAppUlMarginTop};
        margin-left: ${_TitleBar[PR.styleMode].rqAppUlMarginLeft};
        padding: ${_TitleBar[PR.styleMode].rqAppUlPadding};
        background: ${_TitleBar[PR.styleMode].rqAppUlBackground};
        border: ${_TitleBar[PR.styleMode].rqAppUlBorder};
        -webkit-border-radius: ${_TitleBar[PR.styleMode].rqAppUlWebkitBorderRadius};
        -moz-border-radius: ${_TitleBar[PR.styleMode].rqAppUlMozBorderRadius};
        border-radius: ${_TitleBar[PR.styleMode].rqAppUlBoderRadius};
    } 

    .rqApp ul li {
        position: ${_TitleBar[PR.styleMode].rqAppUlLiPosition};
    } 

    .rqApp ul li a {
        display: ${_TitleBar[PR.styleMode].rqAppUlLiADisplay};
        color: ${_TitleBar[PR.styleMode].rqAppUlLiAColor};
        text-align: ${_TitleBar[PR.styleMode].rqAppUlLiATextAlign};
        font-size: ${_TitleBar[PR.styleMode].rqAppUlLiAFontSize};
        height: ${_TitleBar[PR.styleMode].rqAppUlLiAHeight};
        line-height: ${_TitleBar[PR.styleMode].rqAppUlLiALineHeight};
        padding:${_TitleBar[PR.styleMode].rqAppUlLiAPadding};
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }

    .rqApp ul li a:hover {
        background: ${_TitleBar[PR.styleMode].rqAppUlLiAHover};
        color: ${_TitleBar[PR.styleMode].rqAppUlLiTextHover};
    }
    

    .menuShortCut {
        position: ${_TitleBar[PR.styleMode].menuShortCutPosition};
        background: ${_TitleBar[PR.styleMode].menuShortCutBackground};
        color: ${_TitleBar[PR.styleMode].menuShortCutColor};
        border: ${_TitleBar[PR.styleMode].menuShortCutBorder};
        width: ${_TitleBar[PR.styleMode].menuShortCutWidth};
        height: ${_TitleBar[PR.styleMode].menuShortCutHeight};
        left: ${_TitleBar[PR.styleMode].menuShortCutLeft};
        z-index: ${_TitleBar[PR.styleMode].menuShortCutZIndex};
        text-align: ${_TitleBar[PR.styleMode].menuShortCutTextAlign};
        padding-top: ${_TitleBar[PR.styleMode].menuShortCutPaddingTop};
        font-size: ${_TitleBar[PR.styleMode].menuShortCutFontSize};
        opacity: ${_TitleBar[PR.styleMode].menuShortCutOpacity};
    }

    .hideKey {
        visibility: ${_TitleBar[PR.styleMode].hideKeyVisibility};
    }

    .rqUsr {
        float: ${_TitleBar[PR.styleMode].rqUsrFloat};
        position: ${_TitleBar[PR.styleMode].rqUsrPosition};
        margin-right: ${_TitleBar[PR.styleMode].rqUsrMarginRight};
        order: ${_TitleBar[PR.styleMode].rqUsrOrder};
    }

    .rqUsr button {
        display: ${_TitleBar[PR.styleMode].rqUsrButtonDisplay};
        height: ${_TitleBar[PR.styleMode].rqUsrButtonHeight};
        background: ${_TitleBar[PR.styleMode].rqUsrButtonBackground};
        color: ${_TitleBar[PR.styleMode].rqUsrButtonColor};
        cursor: ${_TitleBar[PR.styleMode].rqUsrButtonCursor};
        position: ${_TitleBar[PR.styleMode].rqUsrButtonPosition};
        top: ${_TitleBar[PR.styleMode].rqUsrButtonTop};
    }

    .rqUsr button span {
        vertical-align: ${_TitleBar[PR.styleMode].rqUsrButtonSpanVerticalAlign};
        margin: ${_TitleBar[PR.styleMode].rqUsrButtonSpanMargin};
        font-size: ${_TitleBar[PR.styleMode].rqUsrButtonSpanFontSize};
        font-weight: ${_TitleBar[PR.styleMode].rqUsrButtonSpanFontWeight};
    }

    .rqUsr button:before {
        content: "";
        display: ${_TitleBar[PR.styleMode].rqUsrButtonBeforeDisplay};
        vertical-align: ${_TitleBar[PR.styleMode].rqUsrButtonBeforeVerticalAlign};
        width: ${_TitleBar[PR.styleMode].rqUsrButtonBeforeWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrButtonBeforeHeight};
        background: ${_TitleBar[PR.styleMode].rqUsrButtonBeforeBackground};
    }

    /*.rqUsr button:after {
        content: "";
        display: ${_TitleBar[PR.styleMode].rqUsrButtonAfterDisplay};
        vertical-align: ${_TitleBar[PR.styleMode].rqUsrButtonAfterVerticalAlign};
        width: ${_TitleBar[PR.styleMode].rqUsrButtonAfterWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrButtonAfterHeight};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrButtonAfterMarginTop};
        background: ${_TitleBar[PR.styleMode].rqUsrButtonAfterBackground};
    }*/

    .rqUsr button.on:after {
        background-position: ${_TitleBar[PR.styleMode].rqUsrButtonOnAfterBackgroundPosition};
    }

    /* test */
    .rqUsrSpan:after {
        content: "";
        display: ${_TitleBar[PR.styleMode].rqUsrButtonAfterDisplay};
        vertical-align: ${_TitleBar[PR.styleMode].rqUsrButtonAfterVerticalAlign};
        width: ${_TitleBar[PR.styleMode].rqUsrButtonAfterWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrButtonAfterHeight};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrButtonAfterMarginTop};
        background: ${_TitleBar[PR.styleMode].rqUsrButtonAfterBackground};
    }

    .rqUsrSpan.on:after {
        background-position: ${_TitleBar[PR.styleMode].rqUsrButtonOnAfterBackgroundPosition};
    }
    .rqUsrSpan p{
        display: inline-block;
        margin-right: 10px;
    }

    /* hydrogen */
    .rqContectNation{
        display: block;
        color: #D9D9D9;
        font-size: 10px;
        font-family: Pretendard;
        text-align: left;
        margin-top: 2.5px;
        
    }

    
    .rqUsr div {
        display: ${_TitleBar[PR.styleMode].rqUsrDivDisplay};
        position: ${_TitleBar[PR.styleMode].rqUsrDivPosition};
        width: ${_TitleBar[PR.styleMode].rqUsrDivWidth};
        top: ${_TitleBar[PR.styleMode].rqUsrDivTop};
        left: ${_TitleBar[PR.styleMode].rqUsrDivLeft};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrDivMarginTop};
        margin-left: ${_TitleBar[PR.styleMode].rqUsrDivMarginLeft};
        background: ${_TitleBar[PR.styleMode].rqUsrDivBackground};
        text-align: ${_TitleBar[PR.styleMode].rqUsrDivTextAlign};
        border: ${_TitleBar[PR.styleMode].rqUsrDivBorder};
        overflow: ${_TitleBar[PR.styleMode].rqUsrDivOverflow};
        -webkit-border-radius: ${_TitleBar[PR.styleMode].rqUsrDivWebkitBorderRadius};
        -moz-border-radius: ${_TitleBar[PR.styleMode].rqUsrDivMozBorderRadius};
        border-radius: ${_TitleBar[PR.styleMode].rqUsrDivBorderRadius};
    }

    .rqUsr div em {
        display: ${_TitleBar[PR.styleMode].rqUsrDivEmDisplay};
        width: ${_TitleBar[PR.styleMode].rqUsrDivEmWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrDivEmHeight};
        border: ${_TitleBar[PR.styleMode].rqUsrDivEmBorder};
        margin: ${_TitleBar[PR.styleMode].rqUsrDivEmMargin};
        background-size: ${_TitleBar[PR.styleMode].rqUsrDivEmBackgroundSize};
        text-indent: ${_TitleBar[PR.styleMode].rqUsrDivEmTextIndent};
        -webkit-border-radius: ${_TitleBar[PR.styleMode].rqUsrDivEmWebkitBorderRadius};
        -moz-border-radius: ${_TitleBar[PR.styleMode].rqUsrDivEmMozBorderRadius};
        border-radius: ${_TitleBar[PR.styleMode].rqUsrDivEmBorderRadius};
    }

    .rqUsr div span {
        display: ${_TitleBar[PR.styleMode].rqUsrDivSpanDisplay};
        color: ${_TitleBar[PR.styleMode].rqUsrDivSpanColor};
        font-size: ${_TitleBar[PR.styleMode].rqUsrDivSpanFontSize};
        font-weight: ${_TitleBar[PR.styleMode].rqUsrDivSpanFontWeight};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrDivSpanMarginTop};
        margin-bottom: ${_TitleBar[PR.styleMode].rqUsrDivSpanMarginBottom};
    }

    .rqUsr div p {
        color: ${_TitleBar[PR.styleMode].rqUsrDivPColor};
        font-size: ${_TitleBar[PR.styleMode].rqUsrDivPFontSize};
    }

    .rqUsr div ul {
        margin-top: ${_TitleBar[PR.styleMode].rqUsrDivUlMarginTop};
    }

    .rqUsr div ul:after {
        ${props => props.theme.variables.clearfix()};
    }

    .rqUsr div ul li {
        float: ${_TitleBar[PR.styleMode].rqUsrDivUlLiFloat};
        width: ${_TitleBar[PR.styleMode].rqUsrDivUlLiWidth};
        background: ${_TitleBar[PR.styleMode].rqUsrDivUlLiBackground};
    }

    /* hydrogen */
    .adminIconArea{
        display: block;
       
    }

    .adminIconArea .adminIconAreaLi{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        font-size: 12px;
        color: #D8D8D8;
        background: #244554;
    }
    .adminIconArea .adminIconAreaLi a{
        background: #244554;
    }

    
    .rqUsr div ul li a {
        display: ${_TitleBar[PR.styleMode].rqUsrDivUlLiADisplay};
        height: ${_TitleBar[PR.styleMode].rqUsrDivUlLiAHeight};
        line-height: ${_TitleBar[PR.styleMode].rqUsrDivUlLiALineHeight};
        color: ${_TitleBar[PR.styleMode].rqUsrDivUlLiAColor};
        font-size: ${_TitleBar[PR.styleMode].rqUsrDivUlLiAFontSize};
        background: ${_TitleBar[PR.styleMode].rqUsrDivUlLiABackground};
        letter-spacing: ${_TitleBar[PR.styleMode].rqUsrDivUlLiALetterSpacing};
    }

    .rqUsr div ul li a:hover {
        background: ${_TitleBar[PR.styleMode].rqUsrDivUlLiAHoverBackround};
    }

    .rqUsr div ul li .Amanagement {
        width: ${_TitleBar[PR.styleMode].amanagementWidth};
        height: ${_TitleBar[PR.styleMode].amanagementHeight};
        margin-left: ${_TitleBar[PR.styleMode].amanagementMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].amanagementMarginTop};
        display: ${_TitleBar[PR.styleMode].amanagementDisplay};
        object-fit: ${_TitleBar[PR.styleMode].iconObjectFit};
    }

    .rqUsr div ul li .Apassword {
        width: ${_TitleBar[PR.styleMode].apasswordWidth};
        height: ${_TitleBar[PR.styleMode].apasswordHeight};
        margin-left: ${_TitleBar[PR.styleMode].apasswordMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].apasswordMarginTop};
        display: ${_TitleBar[PR.styleMode].apasswordDisplay};
        object-fit: ${_TitleBar[PR.styleMode].iconObjectFit};
    }

    .rqUsr div ul li .Alogout {
        width: ${_TitleBar[PR.styleMode].alogoutWidth};
        height: ${_TitleBar[PR.styleMode].alogoutHeight};
        margin-left: ${_TitleBar[PR.styleMode].alogoutMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].alogoutMarginTop};
        display: ${_TitleBar[PR.styleMode].alogoutDisplay};
        object-fit: ${_TitleBar[PR.styleMode].iconObjectFit};
    }

    .rqUsr div ul li .AlogoutHydrogen {
        width: ${_TitleBar[PR.styleMode].alogoutWidth};
        height: ${_TitleBar[PR.styleMode].alogoutHeight};
        margin-left: ${_TitleBar[PR.styleMode].alogoutMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].alogoutMarginTop};
        display: ${_TitleBar[PR.styleMode].alogoutDisplay};
        /* object-fit: ${_TitleBar[PR.styleMode].iconObjectFit}; */
    }

    .rqUsr div ul .rqli {
        float: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliFloat};
        width: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliWidth};
        background: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliBackground};
    }

    .rqUsr div ul .rqli .Upassword {
        width: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUpasswordWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUpasswordHeight};
        margin-left: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUpasswordMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUpasswordMarginTop};
        display: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUpasswordDisplay};
    }

    .rqUsr div ul .rqli .Ulogout {
        width: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUlogoutWidth};
        height: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUlogoutHeight};
        margin-left: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUlogoutMarginLeft};
        margin-top: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUlogoutMarginTop};
        display: ${_TitleBar[PR.styleMode].rqUsrDivUlRqliUlogoutDisplay};
    }

    .rqStng {
        float: ${_TitleBar[PR.styleMode].rqStngFloat};
        display: ${_TitleBar[PR.styleMode].rqStngDisplay};
        width: ${_TitleBar[PR.styleMode].rqStngWidth};
        height: ${_TitleBar[PR.styleMode].rqStngHeight};
        margin-right: ${_TitleBar[PR.styleMode].rqStngMarginRight};
        background: ${_TitleBar[PR.styleMode].rqStngBackground};
        order: ${_TitleBar[PR.styleMode].rqStanOrder};
        position: ${_TitleBar[PR.styleMode].rqStanPosition};
        top: ${_TitleBar[PR.styleMode].rqStanTop};
        cursor: ${_TitleBar[PR.styleMode].rqStanCursor}; 
    }

    .rqUsr.deputy button:before {
        background: ${_TitleBar[PR.styleMode].rqUsrDeputyButtonBeforeBackground};
    }

    .rqUsr.deputy div {
        border: ${_TitleBar[PR.styleMode].rqUsrDeputyDivBorder};
    }

    .rqUsr.deputy div em {
        border: ${_TitleBar[PR.styleMode].rqUsrDeputyDivEmBorder};
    }

    .rqUsr.deputy div span {
        color: ${_TitleBar[PR.styleMode].rqUsrDeputyDivSpanColor};
    }

    .rqUsr.deputy div ul li {
        width: ${_TitleBar[PR.styleMode].rqUsrDeputyDivUlLiWidth};
    }

    .rqUsr.deputy div ul li a {
        font-size: ${_TitleBar[PR.styleMode].rqUsrDeputyDivUlLiAFontSize};
    }

    .rqUsr.deputy div ul li a:hover {
        background: ${_TitleBar[PR.styleMode].rqUsrDeputyDivUlLiAHoverBackground};
    }

    .rqUsr.user button:before {
        background: ${_TitleBar[PR.styleMode].rqUsrUserButtonBeforeBackground};
    }

    .rqUsr.user div {
        border: ${_TitleBar[PR.styleMode].rqUsrUserDivBorder};
    }

    .rqUsr.user div em {
        border: ${_TitleBar[PR.styleMode].rqUsrUserDivEmBorder};
    }

    .rqUsr.user div span {
        color: ${_TitleBar[PR.styleMode].rqUsrUserDivSpanColor};
    }

    .rqUsr.user div ul li a {
        font-size: ${_TitleBar[PR.styleMode].rqUsrUserDivUlLiAFontSize};
    }

    .rqUsr.user div ul li a:hover {
        background: ${_TitleBar[PR.styleMode].rqUsrUserDivUlLiAHoverBackground};
    }

    .adminProfile {
        background: ${_TitleBar[PR.styleMode].adminProfileBackground};
    }

    .adminUserName{
        display: block;
        font-size: 16px !important;
        text-align: center;
    }

    .adminContectNation{
        display: block;
        font-size: 10px !important;
        color: #ffffff;
        padding: 3px;
    }

    .setShortCut {
        position: ${_TitleBar[PR.styleMode].setShortCutPosition};
        background: ${_TitleBar[PR.styleMode].setShortCutBackground};
        color: ${_TitleBar[PR.styleMode].setShortCutColor};
        border: ${_TitleBar[PR.styleMode].setShortCutBorder};
        width: ${_TitleBar[PR.styleMode].setShortCutWidth};
        height: ${_TitleBar[PR.styleMode].setShortCutHeight};
        right: ${_TitleBar[PR.styleMode].setShortCutRight};
        top: ${_TitleBar[PR.styleMode].setShortCutTop};
        z-index: ${_TitleBar[PR.styleMode].setShortCutZIndex};
        text-align: ${_TitleBar[PR.styleMode].setShortCutTextAlign};
        padding-top: ${_TitleBar[PR.styleMode].setShortCutPaddingTop};
        font-size: ${_TitleBar[PR.styleMode].setShortCutFontSize};
        opacity: ${_TitleBar[PR.styleMode].setShortCutOpacity};
    } 
`;

export const CampusBarComponent = styled.div`
    position: absolute;
    top: -8px;
    right: 220px;
    z-index: 3;
    color: #D3D5D9;
    margin-right: 40px;

    .rqCampus {
        position: fixed;
        left: 50%;
        top: 15px;
        transform: translate(-50%, 0);
        
        h5 {
            color: #5398FF;
            font-size: 20px;
            font-weight: 600;
        }
    }

    ul {
        ${props => props.theme.variables.flex()};
        font-size: 14px;
        position: relative;
        top: 3px;

        li {
            width: 76px;
            height: 28px;
            line-height: 27px;
            text-align: center;
            letter-spacing: 0.8px;
            border: 1px solid var(--dark-gray-color);
            border-radius: 5px;
            margin-left: 10px;
            cursor: pointer;

            &.on {
                background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                color: #fff;
            }
        }
    }

    > p {
        position: relative;
        top: 10px;
        width: 112px;
        user-select: none;
    }

    .rqCampus_gg {
        ${props => props.theme.variables.flex('flex-start', 'center')}
        gap: 10px;

        .allBtn {
            width: 142px;
            height: 36px;
            background: #525868 0% 0% no-repeat padding-box;
            border-radius: 5px;
            ${props => props.theme.variables.flex('center', 'center')}

            span {
                color: #fff;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 10px;

                &::after {
                    content: '';
                    display: inline-block;
                    background: url(${gg_titlebar_arrow_default}) no-repeat center center;
                    width: 16px;
                    height: 11px;
                }
            }

            &:hover {
                background: #5398FF;
            }

            &:active {
                background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
            }
        }

        .leftBtn {
            width: 156px;
            height: 36px;
            background: #272E42 url(${gg_titlebar_select_arrow}) 95% 49% no-repeat;
            border: 1px solid #525868;
            border-radius: 5px;
            color: #fff;
            font-size: 14px;
            padding-left: 10px;
            padding-right: 28px;
            cursor: pointer;
            white-space: nowrap; 
            text-overflow: ellipsis; 
            overflow: hidden;

            &:hover {
                border: 1px solid #3B83F4;
            }

            &.on,
            &:active {
                border: 1px solid #4F96FE;
            }
        }

        ul {
            display: none;
            width: 156px;
            background: #0E162D;
            border: 1px solid #FFFFFF38;
            font-size: 14px;
            position: absolute;
            top: 36px;
            right: 0;
            
            li {
                width: 100%;
                height: 26px;
                line-height: 26px;
                text-align: center;
                letter-spacing: 0.3px;
                border: 0;
                border-radius: 0;
                margin-left: 0;
                font-size: 14px !important;
                color: #fff;
                cursor: pointer;

                &:hover {
                    background: #FFFFFF38;
                }
            }

            &.on {
                display: block;
            }
        }
    }
`;