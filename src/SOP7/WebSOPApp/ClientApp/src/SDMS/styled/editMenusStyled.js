import styled from "styled-components";
import PR from "../../Root/resource/id";

import "../../Common/css/commonWonik.scss";

import edit_top_save from "../../Common/img/sub/edit_top_save.png";
import edit_top_close from "../../Common/img/sub/edit_top_close.png";
import wonik_edit_top_save from "../../Common/img/sub/wonik_edit_top_save.png";
import wonik_edit_top_close from "../../Common/img/sub/wonik_edit_top_close.png";
import header_background from "../../Common/img/sub/header_background.png";

import quickButton_cctv from "../../Common/image/icon/QuickButton/quickButton_cctv.png";
import quickButton_poi from "../../Common/image/icon/QuickButton/quickButton_poi.png";
import quickButton_fakeWall from "../../Common/image/icon/QuickButton/quickButton_fakeWall.png";
import quickButton_equipZoneName from "../../Common/image/icon/QuickButton/quickButton_equipZoneName.png";
import quickButton_cctvGroup from "../../Common/image/icon/QuickButton/quickButton_cctvGroup.png";

import wonik_quickButton_poi_on from "../../Common/image/icon/QuickButton/wonik_quickButton_poi_on.png";
import wonik_quickButton_poi_off from "../../Common/image/icon/QuickButton/wonik_quickButton_poi_off.png";
import wonik_quickButton_fakeWall_on from "../../Common/image/icon/QuickButton/wonik_quickButton_fakeWall_on.png";
import wonik_quickButton_fakeWall_off from "../../Common/image/icon/QuickButton/wonik_quickButton_fakeWall_off.png";
import wonik_quickButton_equipZoneName_on from "../../Common/image/icon/QuickButton/wonik_quickButton_equipZoneName_on.png";
import wonik_quickButton_equipZoneName_off from "../../Common/image/icon/QuickButton/wonik_quickButton_equipZoneName_off.png";
import wonik_quickButton_cctvGroup_on from "../../Common/image/icon/QuickButton/wonik_quickButton_cctvGroup_on.png";
import wonik_quickButton_cctvGroup_off from "../../Common/image/icon/QuickButton/wonik_quickButton_cctvGroup_off.png";
import wonik_quickButton_editcctv_on from "../../Common/image/icon/QuickButton/wonik_quickButton_editcctv_on.png";
import wonik_quickButton_editcctv_off from "../../Common/image/icon/QuickButton/wonik_quickButton_editcctv_off.png";


/**********************************************************************/
// SDMS 편집모드

export const _EditMenusComponent = {
    soulbrain: {
        edTitleTop: '0',
        edTitleColor: '#e3ad2b',
        edTitleWidth: '300px',
        edTitleHeight: '50px',
        edTitleH2FontSize: '22px',
        edTitlePadding: '10px 0 10px 20px',
        edtSaveIcon: `url(${edit_top_save}) no-repeat center center`,
        edtCloseIcon: `url(${edit_top_close}) no-repeat center center`,
        dsmTitleFontSize: '40px',
        dsmTitlePosition: '30px',
        poiOn: `url(${quickButton_poi}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        poiOff: `url(${quickButton_poi}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        fakeWallOn: `url(${quickButton_fakeWall}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        fakeWallOff: `url(${quickButton_fakeWall}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        equipZoneNameOn: `url(${quickButton_equipZoneName}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        equipZoneNameOff: `url(${quickButton_equipZoneName}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        cctvGroupOn: `url(${quickButton_cctvGroup}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        cctvGroupOff: `url(${quickButton_cctvGroup}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        cctvOn: `url(${quickButton_cctv}) no-repeat center center, rgba(255, 132, 0, 0.7)`,
        cctvOff: `url(${quickButton_cctv}) no-repeat center center, rgba(37, 52, 61, 0.8)`,
        dsBotUlLiAHoverBackground: 'rgba(13,18,28,0.9) !important',
    },
    Wonik: {
        edTitleTop: '50px',
        edTitleColor: `url(${header_background}) no-repeat`,
        edTitleWidth: '301px',
        edTitleHeight: '50px',
        edTitleH2FontSize: '18px',
        edTitleH2FontWeight: '600',
        edTitlePadding: '9px 0 10px 20px',
        edtSaveIcon: `url(${wonik_edit_top_save}) no-repeat center center`,
        edtCloseIcon: `url(${wonik_edit_top_close}) no-repeat center center`,
        edtCloseMargin: '30px',
        dsmTitleFontSize: '38px',
        dsmTitlePosition: '40px',
        dsmTitleFontWeight: '600',
        poiOn: `url(${wonik_quickButton_poi_on}) no-repeat center center !important`,
        poiOff: `url(${wonik_quickButton_poi_off}) no-repeat center center !important`,
        fakeWallOn: `url(${wonik_quickButton_fakeWall_on}) no-repeat center center !important`,
        fakeWallOff: `url(${wonik_quickButton_fakeWall_off}) no-repeat center center !important`,
        equipZoneNameOn: `url(${wonik_quickButton_equipZoneName_on}) no-repeat center center !important`,
        equipZoneNameOff: `url(${wonik_quickButton_equipZoneName_off}) no-repeat center center !important`,
        cctvGroupOn: `url(${wonik_quickButton_cctvGroup_on}) no-repeat center center !important`,
        cctvGroupOff: `url(${wonik_quickButton_cctvGroup_off}) no-repeat center center !important`,
        cctvOn: `url(${wonik_quickButton_editcctv_on}) no-repeat center center !important`,
        cctvOff: `url(${wonik_quickButton_editcctv_off}) no-repeat center center !important`,
        dsBotUlLiAHoverBackground: 'rgba(39, 46, 66, 1)!important',
    },
    Hydrogen: {
        edTitleTop: '50px',
        edTitleColor: `url(${header_background}) no-repeat`,
        edTitleWidth: '301px',
        edTitleHeight: '50px',
        edTitleH2FontSize: '18px',
        edTitleH2FontWeight: '600',
        edTitlePadding: '9px 0 10px 20px',
        edtSaveIcon: `url(${wonik_edit_top_save}) no-repeat center center`,
        edtCloseIcon: `url(${wonik_edit_top_close}) no-repeat center center`,
        edtCloseMargin: '30px',
        dsmTitleFontSize: '38px',
        dsmTitlePosition: '40px',
        dsmTitleFontWeight: '600',
        poiOn: `url(${wonik_quickButton_poi_on}) no-repeat center center !important`,
        poiOff: `url(${wonik_quickButton_poi_off}) no-repeat center center !important`,
        fakeWallOn: `url(${wonik_quickButton_fakeWall_on}) no-repeat center center !important`,
        fakeWallOff: `url(${wonik_quickButton_fakeWall_off}) no-repeat center center !important`,
        equipZoneNameOn: `url(${wonik_quickButton_equipZoneName_on}) no-repeat center center !important`,
        equipZoneNameOff: `url(${wonik_quickButton_equipZoneName_off}) no-repeat center center !important`,
        cctvGroupOn: `url(${wonik_quickButton_cctvGroup_on}) no-repeat center center !important`,
        cctvGroupOff: `url(${wonik_quickButton_cctvGroup_off}) no-repeat center center !important`,
        cctvOn: `url(${wonik_quickButton_editcctv_on}) no-repeat center center !important`,
        cctvOff: `url(${wonik_quickButton_editcctv_off}) no-repeat center center !important`,
        dsBotUlLiAHoverBackground: 'rgba(39, 46, 66, 1)!important',
    },
    Gyeonggi: {
        edTitleTop: '50px',
        edTitleColor: `url(${header_background}) no-repeat`,
        edTitleWidth: '301px',
        edTitleHeight: '50px',
        edTitleH2FontSize: '18px',
        edTitleH2FontWeight: '600',
        edTitlePadding: '9px 0 10px 20px',
        edtSaveIcon: `url(${wonik_edit_top_save}) no-repeat center center`,
        edtCloseIcon: `url(${wonik_edit_top_close}) no-repeat center center`,
        edtCloseMargin: '30px',
        dsmTitleFontSize: '38px',
        dsmTitlePosition: '40px',
        dsmTitleFontWeight: '600',
        poiOn: `url(${wonik_quickButton_poi_on}) no-repeat center center !important`,
        poiOff: `url(${wonik_quickButton_poi_off}) no-repeat center center !important`,
        fakeWallOn: `url(${wonik_quickButton_fakeWall_on}) no-repeat center center !important`,
        fakeWallOff: `url(${wonik_quickButton_fakeWall_off}) no-repeat center center !important`,
        equipZoneNameOn: `url(${wonik_quickButton_equipZoneName_on}) no-repeat center center !important`,
        equipZoneNameOff: `url(${wonik_quickButton_equipZoneName_off}) no-repeat center center !important`,
        cctvGroupOn: `url(${wonik_quickButton_cctvGroup_on}) no-repeat center center !important`,
        cctvGroupOff: `url(${wonik_quickButton_cctvGroup_off}) no-repeat center center !important`,
        cctvOn: `url(${wonik_quickButton_editcctv_on}) no-repeat center center !important`,
        cctvOff: `url(${wonik_quickButton_editcctv_off}) no-repeat center center !important`,
        dsBotUlLiAHoverBackground: 'rgba(39, 46, 66, 1)!important',
    }
}

export const EditMenusComponent = styled.div`
    width: 0;
    height: 0;

    #edTitle {
        width: ${_EditMenusComponent[PR.styleMode].edTitleWidth};
        position: fixed;
        z-index: 100; /* 0615 */
        left: 0;
        top: ${_EditMenusComponent[PR.styleMode].edTitleTop};
        background: ${_EditMenusComponent[PR.styleMode].edTitleColor};
        height: ${_EditMenusComponent[PR.styleMode].edTitleHeight};
        padding: ${_EditMenusComponent[PR.styleMode].edTitlePadding};
    }

    #edTitle:before {
        content: "";
        display: ${(props) => props.$stylemode === 'soulbrain' ? 'block' : 'none'};
        width: 0;
        height: 0;
        border-top: solid 50px #e3ad2b;
        border-right: solid 30px transparent;
        position: absolute;
        left: 100%;
        top: 0;
    }

    #edTitle:after {
        content: "";
        display: table;
        clear: both;
    }

    #edTitle h2 {
        float: left;
        height: 30px;
        line-height: 30px;
        font-size: ${_EditMenusComponent[PR.styleMode].edTitleH2FontSize};
        letter-spacing: -0.075em;
        font-weight: ${_EditMenusComponent[PR.styleMode].edTitleH2FontWeight};
    }

    #edTitle a {
        display: block;
        float: right;
        width: 30px;
        height: 30px;
        text-indent: -9999px;
    }

    #edTitle a.edtSave {
        background: ${_EditMenusComponent[PR.styleMode].edtSaveIcon};
        cursor: pointer;
    }

    #edTitle a.edtClose {
        background: ${_EditMenusComponent[PR.styleMode].edtCloseIcon};
        cursor: pointer;
        margin-right: ${_EditMenusComponent[PR.styleMode].edtCloseMargin};
    }

    #dsMap {
        width: 100%;
        height: 100%;
    }

    .dsmTitle {
        position: fixed;
        z-index: 98;
        right: ${_EditMenusComponent[PR.styleMode].dsmTitlePosition};
        bottom: ${_EditMenusComponent[PR.styleMode].dsmTitlePosition};
        color: #fff;
        font-size: ${_EditMenusComponent[PR.styleMode].dsmTitleFontSize};
        line-height: 1em;
        font-weight: ${_EditMenusComponent[PR.styleMode].dsmTitleFontWeight};
    }

    #dsBot {
	position: fixed;
	z-index: 99; /* 0518 */
	left: 50%;
	bottom: 20px;
	width: 500px;
	margin-left: -250px;
}

    #dsBot button {
        display: block;
        background: #25343d;
        width: 100%;
        height: 20px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
    }

    #dsBot button.edit {
        width: 70%;
        position:absolute;
        left:50%;
        top:-20px;
        transform: translateX(-50%);
    }

    #dsBot ul {
        position: absolute;
        left: 34px;
        right: 34px;
        bottom: 0;
        margin-bottom: 10px;
    }

    #dsBot ul.edit {
        left: 114px;
    }

    #dsBot ul:after {
        content: '';
        display: table;
        clear: both;
    }

    #dsBot ul li {
        float: left;
        padding: 0 2px;
        position: relative;
    }

    #dsBot ul li a {
        display: table;
        width: 50px;
        height: 50px;
        border: solid 1px #fff;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    #dsBot ul li a span {
        display: table-cell;
        width: 100%;
        vertical-align: middle;
        text-align: center;
        color: #fff;
        font-size: 12px;
        line-height: 1.1em;
    }

    #dsBot ul li a span em {
        display: none;
    }

    #dsBot ul li a:hover {
        background: ${_EditMenusComponent[PR.styleMode].dsBotUlLiAHoverBackground};
    }

    #dsBot ul li a:hover em {
        display: block;
    }

    .poi.on {
        background: ${_EditMenusComponent[PR.styleMode].poiOn};
    }

    .poi.off {
        background: ${_EditMenusComponent[PR.styleMode].poiOff};
    }

    .fakeWall.on {
        background: ${_EditMenusComponent[PR.styleMode].fakeWallOn};
    }

    .fakeWall.off {
        background: ${_EditMenusComponent[PR.styleMode].fakeWallOff};
    }

    .equipZoneName.on {
        background: ${_EditMenusComponent[PR.styleMode].equipZoneNameOn};
    }

    .equipZoneName.off {
        background: ${_EditMenusComponent[PR.styleMode].equipZoneNameOff};
    }

    .cctvGroup.on {
        background: ${_EditMenusComponent[PR.styleMode].cctvGroupOn};
    }

    .cctvGroup.off {
        background: ${_EditMenusComponent[PR.styleMode].cctvGroupOff};
    }

    .cctv.on {
        background: ${_EditMenusComponent[PR.styleMode].cctvOn};
    }

    .cctv.off {
        background: ${_EditMenusComponent[PR.styleMode].cctvOff};
    }
`;
