import styled, { keyframes } from "styled-components";
import PR from "../../Root/resource/id";
import SdmsResource from "../resource/id";

import "../../Common/css/commonWonik.scss";

import bule_sel from "../../Common/image/icon/bule_sel.png";

import depth_arrow_btn from "../../SDMS/img/popup/depth_arrow_btn.png";
import depth_arrow_btn_active from "../../SDMS/img/popup/depth_arrow_btn_active.png";
import facility_icon from "../../Common/img/imghydrogen/common/facility_icon.svg";
import disconnect from "../../SDMS/img/popup/disconnect.png";
import grayPeople from "../../SDMS/img/popup/grayPeople.png";
import grayPeople2 from "../../SDMS/img/popup/grayPeople2.png";
import greenPeople from "../../SDMS/img/popup/greenPeople.png";
import yellowPeople from "../../SDMS/img/popup/yellowPeople.png";
import sensorETC_visible from "../../SDMS/img/popup/sensorETC_visible.png";
import sensorETC_selected from "../../SDMS/img/popup/sensorETC_selected.png";
import sensorETC_hover from "../../SDMS/img/popup/sensorETC_hover.png";
import checkBox_orange from "../../SDMS/img/popup/checkBox_orange.png";
import sensorPSM_visible from "../../SDMS/img/popup/sensorPSM_visible.png";
import sensorPSM_selected from "../../SDMS/img/popup/sensorPSM_selected.png";
import sensorPSM_hover from "../../SDMS/img/popup/sensorPSM_hover.png";
import magnifier from "../../SDMS/img/popup/magnifier.png";
import alarmBellYellow from "../../SDMS/img/popup/alarmBellYellow.png";
import stickNormal from "../../SDMS/img/popup/stickNormal.png";
import stickBlue from "../../SDMS/img/popup/stickBlue.png";
import stickYellow from "../../SDMS/img/popup/stickYellow.png";
import stickOrange2 from "../../SDMS/img/popup/stickOrange2.png";
import stickRed from "../../SDMS/img/popup/stickRed.png";
import stickNormal3L from "../../SDMS/img/popup/stickNormal3L.png";
import stickBlue3L from "../../SDMS/img/popup/stickBlue3L.png";
import stickYellow3L from "../../SDMS/img/popup/stickYellow3L.png";
import stickOrange3L from "../../SDMS/img/popup/stickOrange3L.png";
import stickRed3L from "../../SDMS/img/popup/stickRed3L.png";
import arrowOrangeLeft from "../../SDMS/img/popup/arrowOrangeLeft.png";
import arrowOrangeRight from "../../SDMS/img/popup/arrowOrangeRight.png";
import safetyArea_people_icon from "../../SDMS/img/popup/safetyArea_people_icon.png";
import yellowHat from '../../SDMS/img/popup/workerAlarm_icon.png';

import wonik_sopIcon from "../../SDMS/img/popup/wonik_sopIcon.png";
import wonik_event_sreenIcon from "../../SDMS/img/popup/wonik_event_sreenIcon.png";
import wonik_event_soundIcon from "../../SDMS/img/popup/wonik_event_soundIcon.png";
import wonik_event_soundOff from "../../SDMS/img/popup/wonik_event_soundOff.png";
import wonik_event_menoIcon from "../../SDMS/img/popup/wonik_event_menoIcon.png";
import wonik_event_endIcon from "../../SDMS/img/popup/wonik_event_endIcon.png";

import dashboard_layer_close from "../../Common/img/sub/dashboard_layer_close.png";
import close_x from '../../Common/image/icon/close_x.svg';

import wonik_dashboard_search from "../../Common/img/sub/wonik_dashboard_search.png";
import dashboard_siren_on from "../../Common/img/sub/dashboard_siren_on.png";
import dashboard_alarm_on from "../../Common/img/sub/dashboard_alarm_on.png";
import dashboard_calendar from "../../Common/img/sub/dashboard_calendar.png";
import dashboard_calendar_bk from "../../Common/img/sub/dashboard_calendar_bk.png";
import dashboard_event_etc from "../../Common/img/sub/dashboard_event_etc.png";
import wonik_dashboard_navigator from "../../Common/img/sub/wonik_dashboard_navigator.png";
import dashboard_nav_ico01 from "../../Common/img/sub/dashboard_nav_ico01.png";
import dashboard_nav_ico02 from "../../Common/img/sub/dashboard_nav_ico02.png";
import dashboard_nav_ico03 from "../../Common/img/sub/dashboard_nav_ico03.png";
import dashboard_nav_ico04 from "../../Common/img/sub/dashboard_nav_ico04.png";
import dashboard_nav_ico05 from "../../Common/img/sub/dashboard_nav_ico05.png";
import dashboard_nav_ico06_on from "../../Common/img/sub/dashboard_nav_ico06_on.png";
import dashboard_nav_ico06_off from "../../Common/img/sub/dashboard_nav_ico06_off.png";
import goBackOutdoor from "../../Common/img/sub/goBackOutdoor.png";

import wPeopleIcon_Active from "../../Common/img/common/wPeopleIcon_Active.png";

import peopleIcon from '../../Common/img/imgwonik/board_people_icon.png'
import humanIcon from '../../Common/img/imgwonik/board_human_icon.png'
import identificationIcon from '../../Common/img/imgwonik/board_identificationNew_icon.png'

import board_human_icon_small_off from '../../Common/img/imgwonik/board_human_icon_small_off.png'
import board_human_icon_small_on from '../../Common/img/imgwonik/board_human_icon_small_on.png'
import board_identification_icon_small_off from '../../Common/img/imgwonik/board_peoples_icon_small_off.png'
import board_identification_icon_small_on from '../../Common/img/imgwonik/board_identification_icon_small_on.png'
import board_sos_icon from '../../Common/img/imgwonik/board_sos_icon.png'

import worker_arrow_white from '../../Common/img/imgwonik/worker_arrow_white.png'

import wonik_status_fire_on from "../../Common/image/icon/wonik_status_fire_on.png";
import wonik_status_fire_off from "../../Common/image/icon/wonik_status_fire_off.png";
import wonik_status_leakage_on from "../../Common/image/icon/wonik_status_leakage_on.png";
import wonik_status_leakage_off from "../../Common/image/icon/wonik_status_leakage_off.png";
import wonik_status_cctv_on from "../../Common/image/icon/wonik_status_cctv_on.png";
import wonik_status_cctv_off from "../../Common/image/icon/wonik_status_cctv_off.png";
import wonik_status_ZoneName_on from "../../Common/image/icon/wonik_status_ZoneName_on.png";
import wonik_status_ZoneName_off from "../../Common/image/icon/wonik_status_ZoneName_off.png";
import wonik_workerIcon_on from "../../Common/image/icon/wonik_workerIcon_on.png";
import wonik_workerIcon_off from "../../Common/image/icon/wonik_workerIcon_off.png";
import wonik_visitorIcon_on from "../../Common/image/icon/wonik_visitorIcon_on.png";
import wonik_visitorIcon_off from "../../Common/image/icon/wonik_visitorIcon_off.png";
import wonik_natural_on from "../../Common/image/icon/wonik_natural_on.png";
import wonik_natural_off from "../../Common/image/icon/wonik_natural_off.png";
import wonik_manufacturing_on from "../../Common/image/icon/wonik_manufacturing_on.png";
import wonik_manufacturing_off from "../../Common/image/icon/wonik_manufacturing_off.png";
import wonik_field_on from "../../Common/image/icon/wonik_field_on.png";
import wonik_field_off from "../../Common/image/icon/wonik_field_off.png";
import wonik_area_score_on from "../../Common/image/icon/wonik_area_score_on.png";
import wonik_area_score_off from "../../Common/image/icon/wonik_area_score_off.png";
import wonik_etc_on from "../../Common/image/icon/wonik_etc_on.png";
import wonik_etc_off from "../../Common/image/icon/wonik_etc_off.png";
import cctv_list_arrow from "../../Common/image/icon/cctv_list_arrow.png";

import bin_icon from '../../Common/img/sub/settings_bin.png';
import bin_icon_hover from '../../Common/img/sub/settings_bin_hover_wonik.png';
import messageSend_icon from '../../Common/img/imgwonik/mail_icon.png';
import download_icon from '../../Common/img/imgwonik/download_icon.png';

import hydrogenPressureIcon_on from "../../Common/img/imghydrogen/H_pressureIcon.png"; //압력
import hydrogenPressureIcon_off from "../../Common/img/imghydrogen/H_pressureIcon_disable.png"; 
import hydrogenTemperatureIcon_on from "../../Common/img/imghydrogen/H_temperatureIcon.png"; //온도
import hydrogenTemperatureIcon_off from "../../Common/img/imghydrogen/H_temperatureIcon_disable.png";
import hydrogenFlowRateIcon_on from "../../Common/img/imghydrogen/H_flowRateIcon.png"; //유량
import hydrogenFlowRateIcon_off from "../../Common/img/imghydrogen/H_flowRateIcon_disable.png";
import hydrogenFireIcon_on from "../../Common/img/imghydrogen/H_fireIcon.png"; //화재
import hydrogenFireIcon_off from "../../Common/img/imghydrogen/H_fireIcon_disable.png";
import hydrogenGasIcon_on from "../../Common/img/imghydrogen/H_gasIcon.png"; //가스
import hydrogenGasIcon_off from "../../Common/img/imghydrogen/H_gasIcon_disable.png";
import hydrogenShutoffIcon_on from "../../Common/img/imghydrogen/H_shutoffIcon.png"; //긴급차단장치
import hydrogenShutoffIcon_off from "../../Common/img/imghydrogen/H_shutoffIcon_disable.png";

import SectionLocationIcon from "../../Common/img/imghydrogen/H_locationIcon.png"; //대시보드 측면 위치아이콘
import SectionAlarmIcon from "../../Common/img/imghydrogen/H_sirenIcon.png"; //대시보드 측면 알람아이콘

import hydrogenEventPressureIcon from "../../Common/img/imghydrogen/H_eventPressure2.png"; //이벤트 정보창 세부정보 아이콘
import hydrogenEventTemperatureIcon from "../../Common/img/imghydrogen/H_eventTemperatureIcon.png";
import hydrogenEventFlowRateIcon from "../../Common/img/imghydrogen/H_eventFlowRateIcon.png";
import hydrogenEventFireIcon from "../../Common/img/imghydrogen/H_eventFireIcon.png";
import hydrogenEventGasIcon from "../../Common/img/imghydrogen/H_eventGasIcon.png";
import hydrogenEventShutoffIcon from "../../Common/img/imghydrogen/H_eventShutoffIcon.png";

import hydrogenEventAlarmActiveIcon from "../../Common/img/imghydrogen/H_eventAlarmIcon.png"; //이벤트정보창 테이블 알람 아이콘
import hydrogenEventAlarmDisableIcon from "../../Common/img/imghydrogen/H_eventAlarmIcon_disable.png";

import DangerImage from '../../Common/img/imghydrogen/dangerImage.png';
import LightLineImage1 from '../../Common/img/imghydrogen/lightLine1.png';
import LightLineImage2 from '../../Common/img/imghydrogen/lightLine2.png';

import SensorInfoBoxBlueImage from '../../Common/img/imghydrogen/sensorInfoBox_blue2.png'; 
import SensorInfoBoxRedImage from '../../Common/img/imghydrogen/sensorInfoBox_red2.png'; 
import GradeBtnImage from '../../Common/img/imgwonik/settings_icon.png';
import GradeBtnImageDisable from '../../Common/img/imgwonik/settings_icon_Disable.png';
import GradeRefreshBtn from '../../Common/img/imgwonik/refresh_icon.png';
import GradeTriangle from '../../Common/img/imgwonik/gradeTriangle.png';
import PercentIcon from '../../Common/img/imgwonik/percent_Icon.png';
import PercentIconActive from '../../Common/img/imgwonik/percent_Icon_Active.png';

import search_off from '../../Account/images/search_off.png';
import search_on from '../../Account/images/search_on.png';
import update_off from '../../Account/images/update_off.png';
import update_on from '../../Account/images/update_on.png';
import delete_off from '../../Account/images/delete_off.png';
import delete_on from '../../Account/images/delete_on.png';
import select_arrow from '../../Account/images/select_arrow.png';
import checkbox from "../../Common/img/common/checkbox.png";

import setting_off from '../../Account/images/settings_off.png';
import setting_on from '../../Common/img/imgwonik/settings_on.png';
import CheckMark from '../../Common/img/imgwonik/checkMark.png';
import PeopleIcon from '../../Common/img/imgwonik/people.png';
import SmsArrow from '../../Common/img/imgwonik/smsSettingArrow.png';
import PopImage from '../../Common/img/imgwonik/popImage2.png';

import settings_information_button from '../../Common/img/sub/settings_information_button.png';
import gg_statusInfo_building from '../../Common/img/imgGyeonggi/gg_statusInfo_building.svg';
import eventDashboardIcon from '../../Common/img/imgGyeonggi/eventDashboardIcon.svg';
import fleeDashboardIcon from '../../Common/img/imgGyeonggi/fleeDashboardIcon.svg';
import fleeDashboardEndIcon from '../../Common/img/imgGyeonggi/fleeDashboardEndIcon.svg';
import parking_siren from '../../Common/img/imgGyeonggi/parking_siren.svg';
import parking_siren_on from '../../Common/img/imgGyeonggi/parking_siren_on.svg';
import lifeSaving_on from '../../Common/img/imgGyeonggi/lifeSaving_on.png';
import lifeSaving_off from '../../Common/img/imgGyeonggi/lifeSaving_off.png';
import cardiacDefibrillator_on from '../../Common/img/imgGyeonggi/cardiac_on.png';
import cardiacDefibrillator_off from '../../Common/img/imgGyeonggi/cardiac_off.png';
import rescueTeam_on from '../../Common/img/imgGyeonggi/rescueTeam_on.png';
import rescueTeam_off from '../../Common/img/imgGyeonggi/rescueTeam_off.png';

import cctvSetBtnDefault from '../../Common/img/imgGyeonggi/cctvIcon_default.svg';
import cctvSetBtnHover from '../../Common/img/imgGyeonggi/cctvIcon_hover.svg';


// 경기 이벤트정보 아이콘
import ggEventEarthquakeIcon from '../../Common/img/imgGyeonggi/ggEventEarthquakeIcon.png';
import ggEventEmergencyBellIcon from '../../Common/img/imgGyeonggi/ggEventEmergencyBellIcon.png';
import ggEventElectricIcon from '../../Common/img/imgGyeonggi/ggEventElectricIcon.png';
import ggEventWaterLevelIcon from '../../Common/img/imgGyeonggi/ggEventWaterLevelIcon.png';
import ggEventTerrorIcon from '../../Common/img/imgGyeonggi/ggEventTerrorIcon.png';
import ggEventPSMIcon from '../../Common/img/imgGyeonggi/ggEventPSMIcon.png';


import weeklyEvent_icon from '../../Common/img/imghydrogen/dashboard/weeklyEvent_icon.svg';
import bg_flow from '../../Common/img/imghydrogen/dashboard/bg_flow.png';
import bg_hydrogen from '../../Common/img/imghydrogen/dashboard/bg_hydrogen.png';
import bg_pressure from '../../Common/img/imghydrogen/dashboard/bg_pressure.png';
import bg_temperature from '../../Common/img/imghydrogen/dashboard/bg_temperature.png';
import bg_oxygenGas from '../../Common/img/imghydrogen/dashboard/bg_oxygenGas.png';
import bg_hydrogenGas from '../../Common/img/imghydrogen/dashboard/bg_hydrogenGas.png';
import bg_flow_on from '../../Common/img/imghydrogen/dashboard/bg_flow_on.png';
import bg_hydrogen_on from '../../Common/img/imghydrogen/dashboard/bg_hydrogen_on.png';
import bg_pressure_on from '../../Common/img/imghydrogen/dashboard/bg_pressure_on.png';
import bg_temperature_on from '../../Common/img/imghydrogen/dashboard/bg_temperature_on.png';
import bg_oxygenGas_on from '../../Common/img/imghydrogen/dashboard/bg_oxygenGas_on.png';
import bg_hydrogenGas_on from '../../Common/img/imghydrogen/dashboard/bg_hydrogenGas_on.png';
import selectArrow_icon from '../../Common/img/imghydrogen/main/selectArrow_icon.svg';
import selectArrow_icon_blue from '../../Common/img/imghydrogen/main/selectArrow_icon_blue.svg';
import selectArrow_icon_disable from '../../Common/img/imghydrogen/main/selectArrow_icon_disable.svg';
import noSound_icon from '../../Common/img/imghydrogen/event/noSound_icon.svg';
import noSound_hover_icon from '../../Common/img/imghydrogen/event/noSound_hover_icon.svg';
import noSound_focus_icon from '../../Common/img/imghydrogen/event/noSound_focus_icon.svg';
import powerSetting_icon from '../../Common/img/imghydrogen/event/powerSettings_icon.svg';
import powerSetting_hover_icon from '../../Common/img/imghydrogen/event/powerSettings_hover_icon.svg';
import powerSetting_focus_icon from '../../Common/img/imghydrogen/event/powerSettings_focus_icon.svg';
import dangerStep1_icon from '../../Common/img/imghydrogen/event/dangerStep1_icon.svg';
import dangerStep2_icon from '../../Common/img/imghydrogen/event/dangerStep2_icon.svg';
import dangerStep_disable from '../../Common/img/imghydrogen/event/dangerStep_disable.svg';
import detailInfo_icon from '../../Common/img/imghydrogen/event/detailInfo_icon.svg';
import detailInfo_icon_hover from '../../Common/img/imghydrogen/event/detailInfo_icon_hover.svg';
import sopButton_icon from '../../Common/img/imghydrogen/event/sopButton_icon.svg';
import sopButton_icon_active from '../../Common/img/imghydrogen/event/sopButton_icon_active.svg';
import sopButton_icon_disable from '../../Common/img/imghydrogen/event/sopButton_icon_disable.svg';
import sopButton_hover_icon from '../../Common/img/imghydrogen/event/sopButton_hover_icon.svg';
import endButton_icon from '../../Common/img/imghydrogen/event/endButton_icon.svg';
import endButton_icon_hover from '../../Common/img/imghydrogen/event/endButton_hover_icon.svg';
import endButton_icon_active from '../../Common/img/imghydrogen/event/endButton_icon_active.svg';
import endButton_icon_disable from '../../Common/img/imghydrogen/event/endButton_icon_disable.svg';
import alarmList_icon from '../../Common/img/imghydrogen/event/alarmList_icon.svg';
import alarmList_hover_icon from '../../Common/img/imghydrogen/event/alarmList_hover_icon.svg';
import alarmList_icon_active from '../../Common/img/imghydrogen/event/alarmList_icon_active.svg';
/* import sopButtonImage from '../../Common/img/imghydrogen/event/sopButton_image.svg';
import sopButtonImage_hover from '../../Common/img/imghydrogen/event/sopButton_image_hover.svg';
import sopButtonImage_disable from '../../Common/img/imghydrogen/event/sopButton_image_disable.svg';
import sopButtonImage_selected from '../../Common/img/imghydrogen/event/sopButton_image_selected.svg';
import sopButtonImage_selectedHover from '../../Common/img/imghydrogen/event/sopButton_image_selected_hover.svg'; */
import memoCheck from '../../Common/img/imghydrogen/event/memoCheck_icon.svg';
import memoCheck_active from '../../Common/img/imghydrogen/event/memoCheck_active_icon.svg';
import memoClose from '../../Common/img/imghydrogen/event/memoClose_icon.svg';
import memoClose_active from '../../Common/img/imghydrogen/event/memoClose_active_icon.svg';
import memoMode from '../../Common/img/imghydrogen/event/memoMode_icon.svg';
import memoMode_active from '../../Common/img/imghydrogen/event/memoMode_active_icon.svg';
import magnifier_icon from '../../Common/img/imghydrogen/main/magnifier_icon.svg';
import magnifier_icon_white from '../../Common/img/imghydrogen/main/magnifier_icon_white.svg';
import question from '../../Common/img/imghydrogen/common/question_Icon.svg';
import alarmBell_icon from '../../Common/img/imghydrogen/event/alarmBell_icon.svg';
import eventClose from '../../Common/img/imghydrogen/event/eventClose_icon.svg';
import rectangle_icon from '../../Common/img/imghydrogen/common/rectangle_icon.svg';
import eventBoxLabel_icon from '../../Common/img/imghydrogen/event/eventBoxLabel_icon.svg';
import eventBoxLabel_icon_disable from '../../Common/img/imghydrogen/event/eventBoxLabel_icon_disable.svg';
import information_background from '../../Common/img/imghydrogen/common/information_background.svg';
import popup_background from '../../Common/img/imghydrogen/common/popup_background.svg';
import compound_background from '../../Common/img/imghydrogen/common/compound_background.svg';
import popupSide_icon from '../../Common/img/imghydrogen/common/popupSide_icon.svg';
import popup_background_noTitle from '../../Common/img/imghydrogen/common/popup_background_noTitle.svg';
import infor_background_noTitle from '../../Common/img/imghydrogen/common/infor_background_noTitle.svg';
import myPage_background_noTitle from '../../Common/img/imghydrogen/common/myPage_background_noTitle.svg';
import compound_background_noTitle from '../../Common/img/imghydrogen/common/compound_background_noTitle.svg';

import facility_drop_icon from '../../Common/img/imghydrogen/facility_drop_icon.svg';
import facility_drop_open_icon from '../../Common/img/imghydrogen/facility_drop_open_icon.svg';
import facility_drop_disable_icon from '../../Common/img/imghydrogen/facility_drop_disable_icon.svg';
import facility_sensors from '../../Common/img/imghydrogen/facility_sensors.svg';
import facility_sensors_off from '../../Common/img/imghydrogen/facility_sensors_off.svg';
import searchClose from '../../Common/img/imghydrogen/main/searchClose.svg';
import statusClose from '../../Common/img/imghydrogen/main/statusClose.svg';
import eventArrowTop from '../../Common/img/imghydrogen/dashboard/eventArrowTop.svg';
import eventArrowBottom from '../../Common/img/imghydrogen/dashboard/eventArrowBottom.svg';

import settingIcon from '../img/popup/settingIcon.svg';
import resultIcon from '../img/popup/resultIcon.svg';
import descriptionIcon from '../img/popup/descriptionIcon.svg';
import downloadIcon from '../img/popup/downloadIcon.svg';
import selectArrowIcon from '../img/popup/selectArrowIcon.svg';
import arrow from '../img/popup/arrow.svg';
import grid_bg from '../img/popup/analysisImg/grid_bg.png';

import sort_icon from '../../Common/img/imghydrogen/main/sort_Icon.svg';



/**********************************************************************/
// SDMS POPUPS 공통 CSS

export const _PopupsCommon = {
    Hydrogen: {
        fontFamily: 'pretendard',
        borderRadius: '0px',
        background: '#2D3E46',
        border: '1px solid  #0085FF',
        backdropFilter: 'blur(3px)',
        dslTopPadding: '10px 20px',
        dslTopBorderRadius: '0px',
        dslTopBorderBottom: 'solid 1px  #0085FF',
        dslTitleColor: ' #0085FF',
        dslTitleFontSize: '16px',
        dslTitleFontWeight: '600',
        dslContPadding: '0 8px 20px 20px',
        dslContEventPadding: '0 8px 20px 20px',
        dslContReceiverPadding: '20px 20px 67px 20px;',
        dslContBackground: '#0e162d',
        dottSize: '8px',
        greenTxt: ' #0085FF',
        redTxt: '#FF5353',
        dslContHeight: 'calc(100% - 37px)',
        dsiSchBackgroundImg: `url(${wonik_dashboard_search}) no-repeat center center`,
        dsiSchBackground: 'var(--navy-color)',
        dsiSchBorderInput: 'solid 1px #525868',
        dsiSchBorderInputStyle: 'solid',
        dsiSchBorderInputWidth: '1px',
        dsiSchBorderInputColor: '#525868 #525868 #525868 transparent',
        dsiSchBorderInputTextRadius: '5px',
        dsiSchMarginRight: '10px',
        dsiSchPaddingRight: '0px',
        dsiScrMarginTop: '20px',
        goLinkBackground: 'linear-gradient(180deg, #2D3E46, #090C0E)',
        goLinkMarginLeft: '8px',
        goLinkWidth: '32px',
        goLinkHeight: '14px',
        goLinkLineHeight: '14px',
        goLinkFontSize: '10px',
        dsiTreePadding: '0 5px 0 0',
        dsiTreeFontSize: '12px',
        dsiTreeLiMarginBottom: '15px',
        scrollbarThumbColor: ' #0085FF',
        inputRadioLabelMargin: '2px',
        inputRadioLabelFontSize: '16px',
        inputRadioLabelFontWeight: '400',
        mainColor: 'var(--title-bar-text-blue-color)',
        memoMainColor: 'var(--title-bar-text-blue-color)',
        viewListHeadWrapSpanColor: 'var(--white-color)',
        viewListHeadWrapSpanMarginRight: '33px',
        viewListHeadWrapFontWeight: 'bold',
        viewList2DepthPadding: '0 10px 5px 10px',
        beforeArrowPosition: 'relative',
        beforeArrowTop: '-5px',
        beforeArrowTop2Depth: '-5px',
        beforeArrowTop3DepthHead: '-2px',
        beforeArrowTop4Depth: '-1px',
        beforeArrowContent: `url(${depth_arrow_btn})`,
        beforeArrowContent2Depth: `url(${depth_arrow_btn})`,
        beforeArrowMarginRight: '5px',
        viewList1DepthPadding: '0px 33px 5px 0',
        viewList2DepthLiPadding: '0',
        viewList5DepthPadding: '5px',
        viewList5DepthLiPadding: '0px 0px 5px 0px',
        viewList5DepthTxtPadding: '0px 5px',
        viewList5DepthTxtSelected: '#fff',
        alarmImgMarginLeft: '4px',
        selectBackground: `var(--navy-color) url(${bule_sel}) 95% 49% no-repeat`,
        selectBackgroundLong: `var(--navy-color) url(${bule_sel}) 98% 49% no-repeat`,
        toolbarPositionRight: '0px',
        viewListHeadWrapBorderTop: 'dashed 1px #9F9F9F',
        viewListHeadWrapPaddingTop: '15px',
        viewListHeadWrapPaddingBottom: '15px',
        hscsDateDatepickerBorder: 'none',
        viewList4DepthLiLastChild: '15px',
        viewListHeadWrapBeforeContent: `url(${depth_arrow_btn})`,
        viewListHeadWrapBeforePosition: 'relative',
        viewListHeadWrapBeforeTop: '-1px',
        viewListHeadWrapBeforeMarginRight: '5px',
        viewListHeadWrapFontSize: '16px',
        viewListContsOnMarginLeft: '10px',
        viewList1DepthFontSize: '16px',
        viewList1DepthFontWeight: '400',
        viewList2DepthSpenFontSize: '14px',
        viewList2DepthSpenOver: 'hidden',
        viewList3DepthLiFontSize: '14px',
        viewList4DepthLiPadding: '5px 0 0 13px',
        dsiSchHInputFontSize: '14px',
        dsiSchHInputFontFamily: 'Pretendard',
        viewList3DepthLiPadding: '5px 0 0 14px',
        viewList2DepthLiPaddingBottom: '5px',
        viewList5DepthOnMarginTop: '5px',
        greenDOTTMarginTop: '0',
        greenDOTTMarginLeft: '4px',
        linkAreaAlignItems: 'center',
        alarmImgWidthSize: '7px',
        alarmImgHeightSize: '8px',
        goLinkFloat: 'right',
        viewList2DepthHeadWidth: 'calc(100% - 34px)',
        viewListContsOnMarginBottom: '10px',
        whiteTxtLetterSpacing: '0px',
        dseTbBorder: 'solid 1px #fff',
        dseTbWidth: 'calc(100% - 10px)',
        dseTbHeight: '245px',
        viewList2DepthSpenWidth: '80%',
        viewList1DepthSPDisplay: 'inline-block',
        viewList1DepthSPWidth: '79%',
        viewList5DepthTxtWidth: '70%',
    },
}

export const PopupsCommon = styled.div`
    border-radius: 0px;
    background: #2D3E46;
    opacity: 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    & .colseX {
        position: absolute;
        right: 14px;
        top: 14px;
        width: 20px;
        height: 20px;
        z-index: 1;
        cursor: pointer;
    }

    .gap5 {
        height: 5px;
        clear: both;
        overflow: hidden;
    }

    .gap10 {
        height: 10px;
        clear: both;
        overflow: hidden;
    }

    .gap15 {
        height: 15px;
        clear: both;
        overflow: hidden;
    }

    .gap20 {
        height: 20px;
        clear: both;
        overflow: hidden;
    }

    .gap25 {
        height: 25px;
        clear: both;
        overflow: hidden;
    }

    .gap30 {
        height: 30px;
        clear: both;
        overflow: hidden;
    }

    .gap35 {
        height: 35px;
        clear: both;
        overflow: hidden;
    }

    .gap40 {
        height: 40px;
        clear: both;
        overflow: hidden;
    }

    .gap50 {
        height: 50px;
        clear: both;
        overflow: hidden;
    }

    .gap60 {
        height: 60px;
        clear: both;
        overflow: hidden;
    }

    .gap70 {
        height: 70px;
        clear: both;
        overflow: hidden;
    }

    input[type="radio"] + label {
        display: inline;
        vertical-align: middle;
        margin-left: 2px;
        font-weight: 400;
        cursor: pointer;
        font-family: 'pretendard';
        font-size: 16px;
    }

    .dslTop {
        padding: 10px 20px;
        position: relative;
        -webkit-border-radius: 0px;
        -moz-border-radius: 0px;
        border-radius: 0px;
        border-bottom: solid 1px  #0085FF;
    }

    .dslGrd {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .dslTitle {
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        color:  #0085FF;
        font-weight: 600;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
        padding-right: 10px;
    }

    .dslTitle span {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-left: 10px;
        letter-spacing: 0em;
        font-weight: 400;
    }

    .dslX {
        display: block;
        width: 16px;
        height: 16px;
        text-indent: -9999px;
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -8px;
        background: url(${dashboard_layer_close}) no-repeat center center;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
        cursor: pointer;
    }

    .dslCont {
        display: flex;
        flex-direction: column;
        padding: 0 8px 20px 20px;
        height: calc(100% - 37px);
    }

    .dsiSch {
        background: var(--navy-color); 
        margin-right: 10px;
        padding-right: 0px;
        position: relative;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .dsiSch input[type="text"] {
        display: block;
        height: 30px;
        padding-left: 10px;
        background: none;
        color: #fff;
        font-size: 12px;
        width: 100%;
        border: solid 1px #525868;
        border-radius: 5px;
    }

    .dsiSch a,
    .dsiSch button,
    .dsiSch input[type="submit"] {
        display: block;
        width: 30px;
        height: 30px;
        background: #f00;
        position: absolute;
        right: 0;
        top: 0;
        text-indent: -9999px;
        background: url(${wonik_dashboard_search}) no-repeat center center;
        border-style: solid;
        border-width: 1px;
        border-color: #525868 #525868 #525868 transparent;
    }

    .dsiScr {
        margin-top: 4px;
        width: calc(100% + 8px);
        height: calc(100% - 40px);
        margin-bottom: 5px; /* 0103 */
    }

    .dsiScr > div:nth-child(4) {
    }

    .dsiScrr {
        margin-top: 10px;
        height: calc(100% - 84px);
        overflow-y: hidden;
    }

    .clickable {
        cursor: pointer;
    }

    .scrollbar {
        overflow-x: hidden;
        overflow-y: auto !important;
    }

    .scrollbar::-webkit-scrollbar-thumb {
        background-color:  #0085FF;

    }

    .scrollbar::-webkit-scrollbar-track {
        /* background-color: #0e162d; */
        background-color: #3C4143;
        border-radius: 2px;
        height: 100px;
    }

    .blueSel {
        background: var(--navy-color) url(${bule_sel}) 95% 49% no-repeat;
        width: 100%;
        height: 50px !important;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        font-size: 14px;
        padding-left: 8px;

        &.long {
            background: var(--navy-color) url(${bule_sel}) 98% 49% no-repeat;
        }
    }

    .eventSel {
        background: var(--navy-color) url(${worker_arrow_white}) no-repeat 90% 49% / 12px;
        width: 90px;
        height: 28px;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        font-size: 14px;
        padding-left: 10px;
        white-space: nowrap; 
        text-overflow: ellipsis; 
        overflow: hidden;
    }

    .eventSel.long {
        background: var(--navy-color) url(${worker_arrow_white}) no-repeat 94% 49% / 12px;
        width: 156px;
        padding-right: 20px;
    }

    .viewListDo > li .viewListConts {
        display: none;
        padding: 0;
        color: #fff;
    }

    .viewListDo > li .viewListConts.on {
        display: block;
    }

    .viewListDo > li .viewListConts > ul > li {
    }

    .viewList2Depth.on {
        display: block;
    }

    .viewList2Depth.on:hover {
    }

    .viewList3Depth.on {
        display: block;
    }

    .viewList4Depth.on {
        display: block;
    }

    .viewList5Depth.on {
        display: block;
        margin-top: 5px;
    } 

    .dsiSel > div.on {
        background: #1e2533;
    }

    .dsiTree {
        display: contents;
        padding: 0 5px 0 0;
        font-family: "dotum", sans-serif;
        font-size: 12px;
    }

    .dsiTree h5 {
        font-size: 12px;
        font-weight: 400;
    }

    .dsiTree h5:after {
        content: "";
        display: table;
        clear: both;
    }

    .dsiTree > li {

    }

    .dsiTree > li .viewListConts {
        display: none;
        padding: 0;
        color: #fff;
        margin-left: 10px;
    }

    .dsiTree > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li {
    }

    .dsiTree > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li > ul > li > a {
        color: #fff;
        line-height: 1.8em;
        display: inline-block;
        padding-left: 5px;
    }

    .dsiTree > li > ul > li > ul > li > a:focus,
    .dsiTree > li > ul > li > ul > li > a:active,
    .dsiTree > li > ul > li > ul > li > a:hover {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > ul > li > h5 > a {
        margin-left: 10px;
    }

    .dsiTree > li > ul > li > ul > li > ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li > ul > li > ul > li > ul > li {
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 {
        padding: 4px;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5:hover {
        background: #1e2533;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span {
        display: block;
        height: 16px;
        line-height: 16px;
        float: left;
        color: #fff;
        cursor: pointer;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span:before {
        content: "▶";
        margin-right: 5px;
    }

    .dsiTree > li > ul > li > ul > li > ul > li ul {
        padding-left: 6px;
        display: none;
    }

    .dsiTree > li .viewListConts.on {
        display: block;
        margin-left: 10px;
        margin-bottom: 10px;
    }

    .dsiTree > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > h5 > span.on:before {
        content: "▼";
    }

    .dsiTree > li > ul > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > h5 > span.on:before {
        content: "▼";
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span.on {
        color: #e4ad2b;
    }

    .dsiTree > li > ul > li > ul > li > ul > li > h5 > span.on:before {
        content: "▼";
    }

    .dsitEdt > div > span.dsiSyr.on {
        background: url(${dashboard_siren_on}) no-repeat center center;
    }

    .dsitEdt > div > span.dsiAlm.on {
        background: url(${dashboard_alarm_on}) no-repeat center center;
    }

    .on {
        display: block;
    }

    .noMemoIconBox li.on,
    .noMemoIconBox li:hover {
        background: #ff8400;
        color: #fff;
    }

    #edtBot li a.on,
    #edtBot li a:hover {
        background: #ff8400;
    }

    .goLink {
        width: 32px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        background: linear-gradient(180deg, #2D3E46, #090C0E);
        color: #fff;
        font-size: 10px;
        border-radius: 15px;
        display: inline-block;
        text-indent: -2px;
        margin-left: 8px;
        float: right;
    } /* 0520 */

    a.goLink:hover {
        background: #0a0c1b !important;
    }

    .selectedClosedAlarm {
        background-color: rgba(59, 59, 59, 0.5);
        border: 1px solid #fff;
    }

    .selectedAlarm {
        border: 1px solid #fff;
    }

    .closedAlarm {
        background-color: rgba(59, 59, 59, 0.5);
    }

    .greenTxt {
        color:  #0085FF;
    }

    .orangeTxt {
        color: #ff7800;
    }

    .redTxt {
        color: #FF5353;
    }

    .whiteTxt {
        color: #fff;
        letter-spacing: 0px;
    }

    .grayTxt {
        color: #9a9a9a;
    }

    .datepicker {
        position: relative;
    }

    .datepicker input[type="text"] {
        padding-right: 32px;
        border: none;
    } /* 0518 */

    .datepicker input[type="text"] + label {
        display: block;
        width: 32px;
        height: 32px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        text-indent: -9999px;
        background: url(${dashboard_calendar}) no-repeat center center;
    }

    .hscsDate .datepicker input[type="text"] {
        display: block;
        width: 120px;
        border: none;
        height: 32px;
        font-size: 13px;
        padding-left: 10px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .hscsDate .datepicker input[type="text"] + label {
        background: url(${dashboard_calendar_bk}) no-repeat center center;
    }

    .popupSizingAreaTop {
        cursor: default;
        position: absolute;
        height: 35px; /* 1011 */
        width: 100%;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaRight {
        cursor: ew-resize;
        position: absolute;
        height: 100%;
        width: 10px;
        left: 100%;
        margin-left: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaLeft {
        cursor: ew-resize;
        position: absolute;
        height: 100%;
        width: 10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaBottom {
        cursor: ns-resize;
        position: absolute;
        height: 10px;
        width: 100%;
        top: 100%;
        margin-top: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaRightBottomPoint {
        cursor: nwse-resize;
        position: absolute;
        height: 10px;
        width: 10px;
        left: 100%;
        top: 100%;
        margin-left: -10px;
        margin-top: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaRightTopPoint {
        cursor: nesw-resize;
        position: absolute;
        height: 10px;
        width: 10px;
        left: 100%;
        top: 10px;
        margin-left: -10px;
        margin-top: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaLeftBottomPoint {
        cursor: nesw-resize;
        position: absolute;
        height: 10px;
        width: 10px;
        top: 100%;
        margin-top: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }
    .popupSizingAreaLeftTopPoint {
        cursor: nwse-resize;
        position: absolute;
        height: 10px;
        width: 10px;
        top: 10px;
        margin-top: -10px;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
    }

    .viewList5DepthTxt {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
        vertical-align: bottom;
        padding: 0px 5px;
        width: 70%;
    } 

    .viewList5DepthTxt.selected {
        color: #fff;
    }

    .greenDOTT {
        width: 8px;
        height: 8px;
        background:  #0085FF;
        border-radius: 100%;
        display: inline-block;
        margin-left: 4px;
        margin-top: 0;
        display: inline-block;
    } 

    .grayDOTT {
        display: inline-block; 
        width: 8px;
        height: 8px;
        background: #898989;
        border-radius: 100%;
        display: inline-block;
        margin-left: 7px;
        margin-top: 4px;
    } 

    .posiRelative {
        position: relative;
    }

    .flexBox {
        content: "";
        clear: both; 
    }

    .linkArea {
        display: inline-flex;
        align-items: center;
    }

    .iconHorizontal {
        display: inline-flex;
        align-items: center;
        cursor: default; 
    }

    .alarmImg {
        display: inline-block;
        width: 7px;
        height: 8px;
        display: inline-block;
        cursor: default;
        margin-left: 4px;
        object-fit: none;
    }

    .viewList5Depth {
        color: #fff;
        padding-left: 5px;
    } 

    .viewList5Depth > li {
        position: relative;
        padding: 0px 0px 5px 0px;
        padding-left: 13px;
        cursor: pointer;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        width: 100%;
    } 

    .viewList5Depth > li:hover {
    }

    .viewList5Depth > li:hover:before {
        content: "ㆍ";
    }

    .viewList5Depth > li:before {
        content: "ㆍ";
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        position: absolute;
        left: 0; 
    } 

    .viewList5Depth {
        display: none;
    }

    /* .viewList2DepthHead {
        position: relative;
        cursor: pointer;
        display: inline-block;
        height: 1.5vh;
        width: calc(100% - 34px);
    } */

    .viewList2DepthSpen {
        display: inline-block;
        line-height: 20px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80%;
    }

    .viewList3Depth {
        color: #fff;
    }

    .viewList3Depth > li {
        position: relative;
        padding: 5px 0 0 14px;
        font-size: 14px;
    }

    .viewList3DepthHead:hover {
        cursor: pointer;
    }

    .viewList3DepthHead:hover:before {
        content: url(${depth_arrow_btn});
    }

    .viewList3DepthHead:before {
        content: url(${depth_arrow_btn});
        position: relative;
        top: -2px;
        margin-right: 5px;
    }

    .viewList5DepthHead {
        display: block;
    }

    .viewList3Depth {
        display: none;
    }

    .viewList4Depth {
        color: #fff;
    } 

    .viewList4Depth > li {
        position: relative;
        padding: 5px 0 0 13px;
    }

    .viewList4Depth > li:last-child(){
        margin-bottom: 15px;
    }

    .viewList4Depth > li:hover {
    }

    .viewList4Depth > li > span {
        cursor: pointer;
    }

    .viewList4Depth > li:hover:before {
        content: url(${depth_arrow_btn});
    }

    .viewList4Depth > li:before {
        content: url(${depth_arrow_btn});
        position: relative;
        top: -1px;
        margin-right: 5px;
    }

    .viewList4Depth {
        display: none;
    }

    .floatR {
        float: right;
    }

    .viewList1Depth {
        padding: 0px 33px 5px 0;
        position: relative;
        cursor: pointer;
        font-weight: 400;
        font-size: 16px;
        color: var(--white-color);
    }

    .viewList1Depth:last-child{
        padding-bottom: 15px;
    }

    /* .viewList1Depth:before {
        content: url(${depth_arrow_btn});
        position: relative;
        top: -5px;
        margin-right: 5px;
    } */

    .viewList1DepthSP{
        display: inline-block;
        width: 79%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .viewList2Depth {
        padding: 0 10px 5px 10px;
    }

    .viewList2Depth > li {
        position: relative;
        padding-left: 0;
        padding-bottom: 5px;

        background: rgba(182,198,210,0.07);
        border-radius: 4px;
    } 

    .viewList2Depth > li:last-child {
        padding-bottom: 0;
    }

    /* .viewList2Depth > li:before {
        content: url(${depth_arrow_btn});
        position: relative;
        top: -5px;
        margin-right: 5px;
    } */

    .viewList2DepthHead {
        position: relative;
        cursor: pointer;
        display: inline-block;
        height: 1.5vh;
    }

    .viewListDo .viewListConts {
        font-size: 13px;
        font-weight: 300;
        line-height: 130%;
        padding: 10px;
        background: #343856;
        color: #fff;
    }

    .viewList2DepthSpen:before {
        content: url(${depth_arrow_btn});
        position: relative;
        top: -5px;
        margin-right: 5px;
    }

    .viewList2Depth {
        display: none;
    }

    .viewList2Depth.on {
        display: block;
    }

    .viewList2Depth.on:hover {
    }

    .viewListHeadWrap {
        clear: both;
        /* margin-top: 10px; */
        /* margin-top: ${_PopupsCommon[PR.styleMode].viewListHeadWrapMarginTop}; */
        padding-bottom: 15px;
        border-bottom: 1px dashed #3b3f5c;
        /* text-indent: ${_PopupsCommon[PR.styleMode].viewListHeadWrapTextIndent}; */
        /* font-size: 15px; */
        font-size: 16px;
        font-weight: bold;
        border-top: dashed 1px #9F9F9F;
        padding-top: 15px;

        .viewListHead::before {
            content: '';
            width: 12px;
            height: 12px;
            background: url(${gg_statusInfo_building}) no-repeat center center;
            margin-right: 5px;
            display: ${(props) => props.$siteID >= PR.Site.GG_A ? 'inline-block' : 'none'};
        }

        .viewListHead.title::before {
            display: none;
        }
    }

    .viewListHeadWrapNew {
        clear: both;
        height: 28px;
        line-height: 28px;
        padding-left: 8px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 4px;
        background: rgba(182, 198, 210, 0.07);

        .viewListHead::before {
            content: '';
            width: 12px;
            height: 12px;
            background: url(${gg_statusInfo_building}) no-repeat center center;
            margin-right: 5px;
            display: ${(props) => props.$siteID >= PR.Site.GG_A ? 'inline-block' : 'none'};
        }

        .viewListHead.title::before {
            display: none;
        }
    }

    /* hydrogen */
    .viewListHeadWrap:before{
        content: url(${depth_arrow_btn});
        /* position: relative;
        top: -1px;
        margin-right: 5px; */
        position: relative;
        top: -1px;
        margin-right: 5px;
    }

    .viewListHeadWrapNew:before{
        content: url(${facility_icon});
        /* position: relative;
        top: -1px;
        margin-right: 5px; */
        position: relative;
        top: 4px;
        margin-right: 6px;
    }

    .viewListHeadWrap span {
        color: var(--white-color);
        margin-right: 33px;
    }

    .viewListHeadWrapNew span {
        color: var(--white-color);
        margin-right: 33px;
        font-size: 14px;
        font-weight: 500;
        height: 28px;
    }

    .viewListDo .viewListHead {
        cursor: pointer;
        font-weight: 500;
        line-height: 3;
        font-size: 16px;
        text-indent: 15px;
        user-select: none;
    }

    .viewListDo .viewListHeadNew {
        cursor: pointer;
        font-weight: 500;
        line-height: 3;
        font-size: 16px;
        text-indent: 15px;
        user-select: none;
    }

    .viewListHead.activeDo:after {
        transform: rotate(45deg);
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
    }

    .viewListHeadNew.activeDo:after {
        transform: rotate(45deg);
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
    }

    .viewListHead.on {
        color: red;
    }

    .viewListHeadNew.on {
        color: red;
    }

    .viewListHead:hover {
        cursor: pointer;
    }

    .viewListHeadNew:hover {
        cursor: pointer;
    }

    .viewListHead.activeDo:after {
        transform: rotate(45deg);
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
    }

    .viewListHead.on {
    }

    .viewListHead:hover {
        cursor: pointer;
    }

    .footer-button-wrap {
        position: absolute;
        bottom: 20px;
        right: 20px;
        
        button {
            color: var(--white-color);
            width: 68px;
            height: 28px;
            border-radius: 5px;
            border: 1px solid #FFFFFF1A;
            margin-left: 10px;
        }
        .save-Items-btn{
            width: 85px;
            padding: 6px 12px;
            background: var(--navy-color);
        }

        .add-btn,
        .reset-btn {
            background: var(--navy-color);
        }

        .confirm-btn {
            background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        }
    }

    .viewDashPopLine{
        display: block;
        width: 4px;
        height: 48px;
        background: #000000;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 3;
    }

    .loading,
    .emptyResult {
        height: calc(100% - 46px);
        ${(props) => props.theme.variables.flex('center', 'center')};
        flex-direction: column;
        gap: 4px;

        > span {
            &:nth-child(2) {
                font-size: 14px;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
            }
            
            &:nth-child(3) {
                color: #787C87;
                font-size: 12px;
                line-height: 170%; /* 20.4px */
                letter-spacing: -0.36px;
            }
        }
    }

    .loading {
        > div {
            margin-bottom: 4px;
        }
        
        > span {
            &:nth-child(2) {
                color: #0085FF;
            }
        }
    }

    .emptyResult {
        > img {
            width: 20px;
            height: 20px;
            margin-bottom: 4px;
        }

        > span {
            &:nth-child(2) {
                color: #EBEBED;
            }
        }
    }
`;


/**********************************************************************/
// 현황정보

export const _StatusInfoComponent = {
    Hydrogen: {
        width: '320px',
        dsToastPadding: '18px 0 0 0',
        dsiSelFontFamily: 'pretendard',
        dsToastPLineHeight: '19px',
        dsToastPLetterSpacing: '.6px',
        dsiSelMarginTop: '15px',
        dsiSelDivBackground: 'none',
        dsiSelDivPaddingLeft: 0,
        dsiSelDivPaddingRight: 0,
        dsiSelUlMarginBottom: '15px',
        visibleFire: `url(${wonik_status_fire_on})`,
        disableFire: `url(${wonik_status_fire_off})`,
        visiblePsm: `url(${wonik_status_leakage_on})`,
        disablePsm: `url(${wonik_status_leakage_off})`,
        visibleCCTV: `url(${wonik_status_cctv_on})`,
        disableCCTV: `url(${wonik_status_cctv_off})`,
        visibleEquip: `url(${wonik_status_ZoneName_on})`,
        disableEquip: `url(${wonik_status_ZoneName_off})`,
        visibleWorker: `url(${wonik_workerIcon_on})`,
        disableWorker: `url(${wonik_workerIcon_off})`,
        visibleVisitor: `url(${wonik_visitorIcon_on})`,
        disableVisitor: `url(${wonik_visitorIcon_off})`,
        visibleNatural: `url(${wonik_natural_on})`,
        disableNatural: `url(${wonik_natural_off})`,
        visibleManufacturing: `url(${wonik_manufacturing_on})`,
        disableManufacturing: `url(${wonik_manufacturing_off})`,
        visibleField: `url(${wonik_field_on})`,
        disableField: `url(${wonik_field_off})`,
        visibleAreaScore: `url(${wonik_area_score_on})`,
        disableAreaScore: `url(${wonik_area_score_off})`,
        visibleEtc: `url(${wonik_etc_on})`,
        disableEtc: `url(${wonik_etc_off})`,
        iconBackgroundSize: '92%',

        visiblePressure: `url(${hydrogenPressureIcon_on})`,
        disablePressure: `url(${hydrogenPressureIcon_off})`,
        visibleTemperature: `url(${hydrogenTemperatureIcon_on})`,
        disableTemperatures: `url(${hydrogenTemperatureIcon_off})`,
        visibleFlowRate: `url(${hydrogenFlowRateIcon_on})`,
        disableFlowRate: `url(${hydrogenFlowRateIcon_off})`,
        visibleFireH: `url(${hydrogenFireIcon_on})`,
        disableFireH: `url(${hydrogenFireIcon_off})`,
        visibleGas: `url(${hydrogenGasIcon_on})`,
        disableGas: `url(${hydrogenGasIcon_off})`,
        visibleShutoff: `url(${hydrogenShutoffIcon_on})`,
        disableShutoff: `url(${hydrogenShutoffIcon_off})`,

    },
}


export const _StatusInfoNewComponent = {
    Hydrogen: {
        width: '320px',
        dsToastPadding: '18px 0 0 0',
        dsiSelFontFamily: 'pretendard',
        dsToastPLineHeight: '19px',
        dsToastPLetterSpacing: '.6px',
        dsiSelMarginTop: '15px',
        dsiSelDivBackground: 'none',
        dsiSelDivPaddingLeft: 0,
        dsiSelDivPaddingRight: 0,
        dsiSelUlMarginBottom: '15px',
        visibleFire: `url(${wonik_status_fire_on})`,
        disableFire: `url(${wonik_status_fire_off})`,
        visiblePsm: `url(${wonik_status_leakage_on})`,
        disablePsm: `url(${wonik_status_leakage_off})`,
        visibleCCTV: `url(${wonik_status_cctv_on})`,
        disableCCTV: `url(${wonik_status_cctv_off})`,
        visibleEquip: `url(${wonik_status_ZoneName_on})`,
        disableEquip: `url(${wonik_status_ZoneName_off})`,
        visibleWorker: `url(${wonik_workerIcon_on})`,
        disableWorker: `url(${wonik_workerIcon_off})`,
        visibleVisitor: `url(${wonik_visitorIcon_on})`,
        disableVisitor: `url(${wonik_visitorIcon_off})`,
        visibleNatural: `url(${wonik_natural_on})`,
        disableNatural: `url(${wonik_natural_off})`,
        visibleManufacturing: `url(${wonik_manufacturing_on})`,
        disableManufacturing: `url(${wonik_manufacturing_off})`,
        visibleField: `url(${wonik_field_on})`,
        disableField: `url(${wonik_field_off})`,
        visibleAreaScore: `url(${wonik_area_score_on})`,
        disableAreaScore: `url(${wonik_area_score_off})`,
        visibleEtc: `url(${wonik_etc_on})`,
        disableEtc: `url(${wonik_etc_off})`,
        iconBackgroundSize: '92%',

        visiblePressure: `url(${hydrogenPressureIcon_on})`,
        disablePressure: `url(${hydrogenPressureIcon_off})`,
        visibleTemperature: `url(${hydrogenTemperatureIcon_on})`,
        disableTemperatures: `url(${hydrogenTemperatureIcon_off})`,
        visibleFlowRate: `url(${hydrogenFlowRateIcon_on})`,
        disableFlowRate: `url(${hydrogenFlowRateIcon_off})`,
        visibleFireH: `url(${hydrogenFireIcon_on})`,
        disableFireH: `url(${hydrogenFireIcon_off})`,
        visibleGas: `url(${hydrogenGasIcon_on})`,
        disableGas: `url(${hydrogenGasIcon_off})`,
        visibleShutoff: `url(${hydrogenShutoffIcon_on})`,
        disableShutoff: `url(${hydrogenShutoffIcon_off})`,

    },
}


export const StatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    right: 0px;
    top: 0px;
    width: ${_StatusInfoComponent[PR.styleMode].width};
    height: 100%;

    .dslCont .alarmList {
        overflow-y: hidden;
        flex: 1;
    }

    .dslCont .alarmDetail {
        height: 172px;
        overflow-y: hidden;
    }

    .dsiSel {
        position: relative;
        font-family: ${_StatusInfoComponent[PR.styleMode].dsiSelFontFamily};
        margin-top: ${_StatusInfoComponent[PR.styleMode].dsiSelMarginTop};
    }

    .dsiSel > div {
        display: block;
        width: 100%;
        text-align: left;
        height: ${_StatusInfoComponent[PR.styleMode].dsiSelDivHeight};
        line-height: ${_StatusInfoComponent[PR.styleMode].dsiSelDivHeight};
        padding-left: ${_StatusInfoComponent[PR.styleMode].dsiSelDivPaddingLeft};
        /* padding-right: ${_StatusInfoComponent[PR.styleMode].dsiSelDivPaddingRight}; */
        color: #e4ad2b;
        font-family: ${_StatusInfoComponent[PR.styleMode].dsiSelFontFamily};
        font-size: 12px;
        font-weight: 300;
        background: ${_StatusInfoComponent[PR.styleMode].dsiSelDivBackground};
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        /* cursor: pointer; */
    }

    .dsiSel ul {
        display: flex;
        /* position: absolute; */
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: ${_StatusInfoComponent[PR.styleMode].dsiSelUlMarginBottom};
    }
    .dsiSel ul li {
        float: left;
        margin-right: 3px;
    }

    .dsiSel ul li label input[type="checkbox"] {
        display: none;
    } /* 기존 input 임시로 없앰*/

    .dsiSel ul li label input[type="checkbox"]:checked {
    }

    .dsiSel ul li label input[type="checkbox"]:after {
    }

    .dsiSel ul li label input[type="checkbox"]:checked:after {
    }

    .dsiSel ul li label {
        display: block;
        float: left;
    }

    .dsToast {
        padding: ${_StatusInfoComponent[PR.styleMode].dsToastPadding};
        width: 260px;
        left: 10px;
        top: 174px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
    }

    .dsToast > a {
        display: block;
        width: 16px;
        height: 16px;
        text-indent: -9999px;
        position: absolute;
        right: 10px;
        top: 10px;
        background: url(${dashboard_layer_close}) no-repeat center center;
    }

    .dsToast p {
        color: #fff;
        font-size: 12px;
        font-family:  ${_StatusInfoComponent[PR.styleMode].dsiSelFontFamily};
        line-height: ${_StatusInfoComponent[PR.styleMode].dsToastPLineHeight};
        letter-spacing: ${_StatusInfoComponent[PR.styleMode].dsToastPLetterSpacing};
    }

    .dsToast p a {
        color: #e4ad2b;
        text-decoration: underline;
        font-weight: 500;
    }

    .visibleFire {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleFire};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visiblePsm {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visiblePsm};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEtc {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleEtc};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleCCTV {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleCCTV};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEquip {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleEquip};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleWorker {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleWorker};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleVisitor {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleVisitor};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableFire {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableFire};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disablePsm {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disablePsm};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEtc {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableEtc};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableCCTV {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableCCTV};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEquip {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableEquip};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableWorker {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableWorker};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableVisitor {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableVisitor};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleNatural {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleNatural};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableNatural {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableNatural};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEmergencyBell {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleEmergencyBell};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEmergencyBell {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableEmergencyBell};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleManufacturing {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleManufacturing};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableManufacturing {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableManufacturing};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleField {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleField};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableField {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableField};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleAreaScore {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleAreaScore};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableAreaScore {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableAreaScore};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    /****** hydrogen ******/
    .visiblePressure {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visiblePressure};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disablePressure {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disablePressure};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }
    .visibleTemperature {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleTemperature};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disableTemperatures {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableTemperatures};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }
    .visibleFlowRate {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleFlowRate};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disableFlowRate {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableFlowRate};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }
    .visibleFireH {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleFireH};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disableFireH {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableFireH};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }
    .visibleGas {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleGas};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disableGas {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableGas};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }
    .visibleShutoff {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleShutoff};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .disableShutoff {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableShutoff};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
    }

    .visiblePark {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visiblePark};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disablePark {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disablePark};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleLife{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleLife};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableLife{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableLife};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleCardiac{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleCardiac};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableCardiac{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableCardiac};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleRescue{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleRescue};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableRescue{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableRescue};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .tooltipGG {
        display: inline-block;
        vertical-align: middle;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 14px;
        color: #fff;
        font-size: 10px;
        margin-left: 5px;
        margin-right: 10px;
        border: solid 1px #ddd;
        cursor: help;
        position: relative;
        background: url(${settings_information_button}) no-repeat center center;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
    }

    .tooltipGG-content {
        position: absolute;
        top: 125px;
        right: -200px;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        background: #0E162DE0 0% 0% no-repeat padding-box;
        font-size: 12px;
        letter-spacing: 0.6px;
        line-height: 1.2;
    }

    .tooltipGG-content:after {
        position: absolute;
        top: 50%;
        left: 1px;
        transform: translate(0, -50%);
        margin-left: -5px;
        width: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-right: 5px solid #0E162DE0;
        content: " ";
        font-size: 0;
        line-height: 0;
    }
`;


/**********************************************************************/
// 설비리스트 팝업창
export const StatusInfoNewComponent = styled(PopupsCommon)`
    position: absolute;
    width: 320px;
    min-height: 515px;
    /* height: 1030px; */
    box-sizing: border-box;
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    border: none;
    top: 5%;

    &::before{
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url(${popup_background})no-repeat center center;
        background-size: cover;
        opacity: 0.15;
        position: absolute;
        left: 0;
        top: 0;
    }

    .statusInfoTitle{
        display: flex;
        align-items: center;
        height: 48px;
        padding: 14px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        
        > span{
            color: #B6C6D2;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-weight: 700;
        }
/* 
        .statusColseX {
            position: absolute;
            right: 20px;
            top: 15px;
            background: url(${statusClose})no-repeat center center;
            z-index: 1;
            cursor: pointer;
        } */
    }

    .dslContStatus{
        padding: 14px;
        height: calc(100% - 50px);

        .dsiScr{
            margin-top: 12px;
            margin-bottom: 5px;
            position: relative;

            .viewListHeadWrapNew {
                clear: both;
                margin-top: ${_PopupsCommon[PR.styleMode].viewListHeadWrapMarginTop};
                /* padding-bottom: ${_PopupsCommon[PR.styleMode].viewListHeadWrapPaddingBottom}; */
                text-indent: ${_PopupsCommon[PR.styleMode].viewListHeadWrapTextIndent};
                font-size: ${_PopupsCommon[PR.styleMode].viewListHeadWrapFontSize};
                font-weight: ${_PopupsCommon[PR.styleMode].viewListHeadWrapFontWeight};
                /* padding-top: ${_PopupsCommon[PR.styleMode].viewListHeadWrapPaddingTop}; */
                margin-bottom: 8px;

                .viewListHeadNew::before {
                    content: '';
                    width: 12px;
                    height: 12px;
                    background: url(${gg_statusInfo_building}) no-repeat center center;
                    margin-right: 5px;
                    display: ${(props) => props.$siteID >= PR.Site.GG_A ? 'inline-block' : 'none' };
                }

                .viewListHeadNew.title::before {
                    display: none;
                }
            }
        }

        .facilityHeadWrap {
            display: flex;
            clear: both;
            width: calc(100% - 5px);
            font-size: 14px;
            font-weight: bold;
            padding: 7px;
            cursor: pointer;

            /* &::before{
                content: url(${facility_drop_icon});
                position: relative;
                margin-right: 6px;
            } */

            .arrowIcon{
                content: url(${facility_drop_icon});
                margin-right: 6px;

                &.on{
                    content: url(${facility_drop_open_icon});
                    /* margin-right: 6px; */
                }
            }

            &.on{
                color: #0095ff !important;
                background: rgba(182,198,210,0.07);
                border-radius: 4px;
            }

            &.textOn{
                color: red;
            }

            /* &::before.on{
                content: url(${facility_drop_icon});
                position: relative;
                margin-right: 6px;
                border: dashed 1px blue;
            } */
        }

        .facilityHeadWrap span:nth-child(2) {
            display: inline-block;
            width: 280px;
            color: var(--white-color);
            /* margin-right: 33px; */
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            
        }

        .facilityHeadWrap.textOn{
            color: red;
        }

        .facilityListHead {
            display: contents;
            cursor: pointer;
            font-weight: 500;
            font-size: 16px;
            user-select: none;
        }

        .facilityListHead::after {
            transform: rotate(45deg);
            -webkit-transition: all 0.2s ease-in-out;
            -moz-transition: all 0.2s ease-in-out;
            transition: all 0.2s ease-in-out;
        }

        .facilityListHead.on {
            color: #0095FF !important;
        }

        .facilityListHead.textOn{
            color: red;
        }

        .facilityListHead:hover {
            cursor: pointer;
        }

        .facilityListConts{
            display: none;
            padding: 10px;
            color: #fff;
            margin-left: 10px;

            &.on{
                display: block;
                margin-left: 0px;
            }
        }

        .facilityListConts.on {
        }

        .facilityList1Depth {
            display: flex;
            align-items: center;
            width: calc(100% + 6px);
            /* padding: 0px 33px 8px 0; */
            padding: 7px;
            position: relative;
            cursor: pointer;
            font-weight: 400;
            font-size: 14px;
            color: var(--white-color);

            .depthArrowIcon{
                content: url(${facility_drop_icon});
                margin-right: 6px;

                &.on{
                    content: url(${facility_drop_open_icon});
                    margin-right: 6px;
                }
            }

            &.on{
                color: #0095ff;
                background: rgba(182,198,210,0.07);
                border-radius: 4px;
            }

            .facilityList1DepthSP{
                display: inline-block;
                width: 90%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }

        /* .facilityList1Depth:last-child{
            padding-bottom: 15px;
        } */

        /* .facilityList1Depth:before {
            content: url(${facility_drop_icon});
            position: relative;
            margin-right: 6px;
        } */

        .facilityList2Depth {
            display: none;
            padding: 4px;
            margin: 8px 0px 8px 10px;
            width: calc(100% - 4px);
            background: rgba(182,198,210,0.07);
            border-radius: 4px;
        }

        .facilityList2Depth > li {
            position: relative;
            padding-left: 0;
            padding-bottom: 5px;
        }

        .facilityList2Depth > li:last-child {
            padding-bottom: 0;
        }

        .facilityList2Depth.on {
            display: block;
        }

        .facilityList2Depth.on:hover {
        }

        .facilityList2DepthHead {
            position: relative;
            cursor: pointer;
            display: inline-block;
            width: 100%;
            height: 1.5vh;
        }

        .facilityList2DepthSpen {
            display: flex;
            align-items: center;
            padding: 4px;
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            /* &::before {
                content: url(${facility_sensors});
                position: relative;
                margin-right: 6px;
            } */

            .sensorIcon_active{
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url(${facility_sensors}) no-repeat center center;
                margin-right: 6px;
            }

            .sensorIcon_disable{
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url(${facility_sensors_off}) no-repeat center center;
                margin-right: 6px;
            }

            > p{
                flex: 1;
                display: inline-block;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            .sensorText_blue{
                color: #0085FF;
            }

            .sensorText_red{
                color: #FF3632;
            }

            .sensorText_red.sensorText_blue{
                color: #0085FF;
            }

            .activeCircle{
                display: block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #FF3632;
            }
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////

    &::after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url(${popupSide_icon})no-repeat center center;
        position: absolute;
        right: 4.5px;
        bottom: 4.5px;
        cursor: pointer;
    }
`;


/**********************************************************************/
// 복합센서 팝업창

export const CompoundDataComponent = styled(PopupsCommon)`
    position: absolute;
    left: 5%;
    bottom: 20%;
    width: 321px !important;
    height: 159px !important;
    box-sizing: border-box;
    border-radius: 8px;
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    border: none;
    opacity: 1;

    .compoundInfoTitle{
        display: flex;
        align-items: center;
        height: 44px;
        padding: 14px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        border-radius: 8px 8px 0 0;

        > span{
            color: #B6C6D2;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-weight: 700;
        }

        /* > span:nth-child(1)::after{
            content: '';
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url(${question})no-repeat center center;
        } */
    }

    .compoundInfoConts{
        padding: 12px;
        width: 100%;
        height: calc(100% - 44px);

        &::before{
            content: '';
            display: inline-block;
            width: 321px;
            height: calc(100% - 44px);
            background: url(${compound_background_noTitle})no-repeat center center;
            background-size: cover;
            opacity: 0.15;
            position: absolute;
            left: 0;
            top: 44px;
            border-radius: 0 0 8px 8px;
        }

        .contentBox {
            position: relative;
            height: 100%;
            border-radius: 4px;
            border: 1px solid #303030;
            background: #1A1A1A;

            & * {
                color: #FFF;
                font-size: 14px;
            }

            .head {
                border-radius: 2px;
                background: rgba(182, 198, 210, 0.07);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;

                .categoryWrap {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 10px;
                    flex: 6;
    
                    .questionMark {
                        display: inline-block;
                        width: 14px;
                        height: 14px;
                        background: url(${question})no-repeat center center;
                        cursor: help;
                    }

                    .tooltipWrap {
                        position: relative;
                    }
                }

                .valueWrap {
                    flex: 1;
                }
            }

            .body {
                
                > div {
                    padding: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 30px;

                    &:not(:last-child) {
                        border-bottom: 1px dashed #3C4143;
                    }

                    .progressNum {
                        flex: 1;

                        span {
                            display: block;
                        }

                        span:nth-child(1) {
                            margin-bottom: 10px;
                            font-size: 14px;
                            font-weight: 400;
                        }
                    }

                    .valueNum {
                        flex: 0 0 auto; // 내용만큼만 차지

                        span:nth-child(1){
                            display: block;
                            font-size: 14px;
                            font-weight: 400;
                            margin-bottom: 5px;
                        }

                        span:nth-child(2){
                            display: block;
                            font-size: 10px;
                            font-weight: 400;
                            color: #7E878B;
                        }
                    }
                    
                    .highConcentration { 
                        appearance: none; 
                        display: block; 
                        width: 100%; 
                        height: 5px; 
                    }

                    .highConcentration::-webkit-progress-bar { 
                        border-radius: 8px;
                        background: #252627;
                    }

                    .highConcentration::-webkit-progress-value { 
                        border-radius: 8px;
                        border: 1px solid rgba(255, 255, 255, 0.07);
                        background: #0085FF;
                        box-shadow: 0px 2px 5px 0px rgba(0, 133, 255, 0.50); 
                    }

                    .lowConcentration { 
                        appearance: none; 
                        display: block; 
                        width: 100%; 
                        height: 5px; 
                    }

                    .lowConcentration::-webkit-progress-bar { 
                        border-radius: 8px;
                        background: #252627;
                    }

                    .lowConcentration::-webkit-progress-value { 
                        border-radius: 8px;
                        border: 1px solid rgba(255, 255, 255, 0.07);
                        background: #FFC444;
                        box-shadow: 0px 2px 5px 0px rgba(255, 196, 68, 0.50);
                    }

                    .oxygen { 
                        appearance: none; 
                        display: block; 
                        width: 100%; 
                        height: 5px; 
                    }

                    .oxygen::-webkit-progress-bar { 
                        border-radius: 8px;
                        background: #252627;
                    }

                    .oxygen::-webkit-progress-value { 
                        border-radius: 8px;
                        background: #FF3632;
                        border: 1px solid rgba(255, 255, 255, 0.07);
                        box-shadow: 0px 2px 5px 0px rgba(255, 54, 50, 0.50);
                    }
                }
            }
        }
    }

    .measurementItemBox{
        display: none;
        position: absolute;
        left: 28px;
        top: -5px;
        z-index: 9999;
        box-sizing: border-box;

        &.on{
            display: block;
        }

        .triangle{
            position: absolute;
            left: -15px;
            top: 8px;
            width: 0;
            height: 0;
            border-bottom: 4px solid transparent;
            border-top: 4px solid transparent;
            border-left: 8px solid transparent;
            border-right: 8px solid #3C4143;
        }
    }

    .measurementItem{
        > table{
            display: table;
            width: 482px; 
            height: 88px;
            border: 1px solid #3C4143;

            thead{
                width: 100%;
                height: 22px;
                background: #2E2F30;
                color: #fff;
                tr{
                    width: 100%;
                }
    
                tr td{
                    padding: 5px;
                    font-size: 12px;
                    font-weight: 400;
                    text-align: center;
                    border-right: 1px solid #3C4143;
    
                    .stage0{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #0095FF;
                        margin-right: 4px;
                    }
    
                    .stage1{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #F9A825;
                        margin-right: 4px;
                    }
    
                    .stage2{
                        display: inline-block;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #FF3632;
                        margin-right: 4px;
                    }
                }
            }
        }

        tbody{
            color: #fff;
            border-bottom: solid 1px #303030;

            tr{
                border-bottom: solid 1px #3C4143;
                background: #242425;
    
                &:last-child{
                    border-bottom: none;
                }
            }
    
            tr td{
                padding: 5px;
                font-size: 12px;
                text-align: center;
                border-right: 1px solid #3C4143;
            }
        }
    }
`;


/**********************************************************************/
// 기상정보

export const _WeatherInfoComponent = {
    Hydrogen: {
        dslContPadding: '0 8px 20px 20px',
        dslContDivMarginTop: '15px',
        dslInfoDisplay: 'flex',
        dslInfoJustify: 'space-around',
        dslInfoMarginTop: '10px',
        dslInfoDtMarginTop: '2px',
        /* dslInfoDtH5Color: 'var(--settings-color)', */
        dslInfoDtH5Color: ' #0085FF',
        dslInfoDtH5MarginTop: '0',
        dslInfoDtH5SpanFontSize: '24px',
        dslInfoDtH5SpanDisplay: 'inline',
        dslInfoDtH5SpanLineHeight: '22px',
        dslInfoDtH5emDisplay: 'none',
        weatherImageWidth: '50px',
        weatherImageHeight: '50px',
        dslInfoDtDivDisplay: 'flex',
        dslInfoDtDivFlexDirection: 'column',
        dslInfoDtDivMarginTop: '8px',
        dslInfoDdPFont: 'pretendard',
        dslInfoDdPFontSize: '14px',
        weatherSiteButtonActive: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        weatherButtonDownTop: '51px',
        weatherButtonLeft: 'calc(100% - 80px)',
    },
}

export const WeatherInfoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 10px;
    top: 60px;
    width: 320px;
    height: 180px;
    overflow: hidden;

    .dslCont {
        padding: ${_WeatherInfoComponent[PR.styleMode].dslContPadding};

        div {
            margin-top: ${_WeatherInfoComponent[PR.styleMode].dslContDivMarginTop};
        }
    }

    .dslInfo {
        display: ${_WeatherInfoComponent[PR.styleMode].dslInfoDisplay};
        justify-content: ${_WeatherInfoComponent[PR.styleMode].dslInfoJustify};
        width: 100%;
        margin-top: ${_WeatherInfoComponent[PR.styleMode].dslInfoMarginTop};

    }

    .dslInfo dt {
        /*display: table-cell;*/
        display: flex;
        margin-left: -10px;
        margin-top: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtMarginTop};
    }

    .dslInfo dt h5 {
        color: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5Color};
        display: inline-block;
        vertical-align: middle;
        font-weight: 500;
        /* margin-left: -5px; */
        margin-top: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5MarginTop};
    }

    .dslInfo dt div {
        display: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtDivDisplay};
        flex-direction: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtDivFlexDirection};
        margin-top: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtDivMarginTop};
    }

    .dslInfo dt h5 span {
        font-size: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5SpanFontSize};
        display: inline-block;
        height: 40px;
        line-height: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5SpanLineHeight};
        vertical-align: top;

        &.weatherArea {
            display: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5SpanDisplay};
            font-size: 12px;
        }

        &:nth-child(2) {
            display: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5SpanDisplay};
        }
    }

    .dslInfo dt h5 em {
        display: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5emDisplay};
        font-style: normal;
        vertical-align: top;
        font-size: 14px;
    }

    .dslInfo dd {
        display: table-cell;
        vertical-align: middle;
    }

    .dslInfo dd p {
        color: #fff;
        font-size: ${_WeatherInfoComponent[PR.styleMode].dslInfoDdPFontSize};
        line-height: 1.7em;
        font-weight: 300;
        font-family: ${_WeatherInfoComponent[PR.styleMode].dslInfoDdPFont};
    }

    .weatherImage {
        width: ${_WeatherInfoComponent[PR.styleMode].weatherImageWidth};
        height: ${_WeatherInfoComponent[PR.styleMode].weatherImageHeight};
        background-size: contain;
        object-fit: contain;
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 10px;
    }

    .weatherSiteButton {
        z-index: 1;
        height: 30px;
        line-height: 28px;
        border: solid 1px #474b69;
        color: #474b69;
        padding: 0 12px;
        margin-right: 5px;
        font-size: 12px;
        border-radius: 5px;
    }

    .weatherSiteButton.active {
        color: white;
        background: ${_WeatherInfoComponent[PR.styleMode].weatherSiteButtonActive};
    }

    /*비활성화*/
    .weatherButton {
        position: absolute;
        /* z-index: 1; */ /* 0518 */
        left: calc(100% - 75px);
        top: 10px;
        display: inline-block;
        height: 30px;
        line-height: 28px;
        border: solid 1px #474b69;
        color: #474b69;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 18px;
    }

    .weatherButton.down {
        top: ${_WeatherInfoComponent[PR.styleMode].weatherButtonDownTop};
    }

    /*기상특보 버튼 활성화*/
    .weatherButton.active.down {
        top: ${_WeatherInfoComponent[PR.styleMode].weatherButtonDownTop};
    }

    .weatherButton.active {
        position: absolute;
        left: ${_WeatherInfoComponent[PR.styleMode].weatherButtonLeft};
        top: 10px;
        display: inline-block;
        height: 30px;
        line-height: 28px;
        background: #232c42;
        border: solid 1px #474b69;
        color: #fff;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 18px;
        cursor: pointer;
    }

    /*기상특보 버튼 활성화*/
    .bythemDashboard .infoContentWeather .map .weatherButton.active {
        position: absolute;
        z-index: 1;
        left: ${_WeatherInfoComponent[PR.styleMode].weatherButtonLeft};
        top: 10px;
        display: inline-block;
        height: 30px;
        line-height: 28px;
        background: #232c42;
        border: solid 1px #474b69;
        color: #fff;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 18px;
        cursor: pointer;
    }

    /*비활성화*/
    .bythemDashboard .infoContentWeather .map .weatherButton {
        position: absolute;
        z-index: 1;
        left: ${_WeatherInfoComponent[PR.styleMode].weatherButtonLeft};
        top: 10px;
        display: inline-block;
        height: 30px;
        line-height: 28px;
        border: solid 1px #474b69;
        color: #474b69;
        padding: 0 12px;
        font-size: 12px;
        border-radius: 18px;
    }
`;


/**********************************************************************/
// CCTV정보

export const _CCTVInfoComponent = {
    Hydrogen: {
        viewDashboardCCTVContsPadding: '10px',
        textWidth: '100%',
        selectedColor: 'var(--title-bar-text-blue-color)',
        col1rowSpanMaxHeight: '20px',
        fontWeight: '400',
        fontSize: '12px',
        paddingLeft: '6px',
        dslGrdActBackground: 'var(--title-bar-text-blue-color) !important',
        dslGrdActColor: 'var(--white-color) !important',
    },
}

export const CCTVInfoComponent = styled(PopupsCommon)`
    position: absolute;
    right: 10px;
    top: 560px;
    width: 360px;
    height: 380px;
    line-height: 130%;

    .viewDashboardCCTVConts {
        padding: ${_CCTVInfoComponent[PR.styleMode].viewDashboardCCTVContsPadding};
    }

    .viewDashboardCCTVGrid {
        width: 100%;
        height: 100%;
        display: grid;
        padding-right: 10px;
        grid-gap: 10px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;
    }

    .viewDashboardCCTVGrid .col1row1 {
        grid-column: 1;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row1.full {
        width: calc(200% + 10px);
        height: calc(200% + 10px);
    }

    .viewDashboardCCTVGrid .col1row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row1 span {
        color: white;
        width: 100%;
    }
    .viewDashboardCCTVGrid .col1row1 span p {
        background-color: black;
        max-height: ${_CCTVInfoComponent[PR.styleMode].col1rowSpanMaxHeight};
        overflow: hidden;
        width: ${_CCTVInfoComponent[PR.styleMode].textWidth};
        font-size: ${_CCTVInfoComponent[PR.styleMode].fontSize};
        padding-left: ${_CCTVInfoComponent[PR.styleMode].paddingLeft};
    }

    .viewDashboardCCTVGrid .col1row1 span p.selected {
        background-color: ${_CCTVInfoComponent[PR.styleMode].selectedColor};
        /* color: black; */
        color: #fff;
        font-weight: ${_CCTVInfoComponent[PR.styleMode].fontWeight};
    }

    .viewDashboardCCTVGrid .col2row1 {
        grid-column: 2;
        grid-row: 1;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row1.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 10px);
    }

    .viewDashboardCCTVGrid .col2row1.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row1 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col2row1 span p {
        background-color: black;
        max-height: ${_CCTVInfoComponent[PR.styleMode].col1rowSpanMaxHeight};
        overflow: hidden;
        width: ${_CCTVInfoComponent[PR.styleMode].textWidth};
        font-size: ${_CCTVInfoComponent[PR.styleMode].fontSize};
        padding-left: ${_CCTVInfoComponent[PR.styleMode].paddingLeft};
    }

    .viewDashboardCCTVGrid .col2row1 span p.selected {
        background-color: ${_CCTVInfoComponent[PR.styleMode].selectedColor};
        /* color: black; */
        color: #fff; 
        font-weight: ${_CCTVInfoComponent[PR.styleMode].fontWeight};
    }

    .viewDashboardCCTVGrid .col1row2 {
        grid-column: 1;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col1row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 10px);
    }

    .viewDashboardCCTVGrid .col1row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col1row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col1row2 span p {
        background-color: black;
        max-height: ${_CCTVInfoComponent[PR.styleMode].col1rowSpanMaxHeight};
        overflow: hidden;
        width: ${_CCTVInfoComponent[PR.styleMode].textWidth};
        font-size: ${_CCTVInfoComponent[PR.styleMode].fontSize};
        padding-left: ${_CCTVInfoComponent[PR.styleMode].paddingLeft};
    }

    .viewDashboardCCTVGrid .col1row2 span p.selected {
        background-color: ${_CCTVInfoComponent[PR.styleMode].selectedColor};
        /* color: black; */
        color: #fff;
        font-weight: ${_CCTVInfoComponent[PR.styleMode].fontWeight};
    }

    .viewDashboardCCTVGrid .col2row2 {
        grid-column: 2;
        grid-row: 2;
        position: relative;
    }

    .viewDashboardCCTVGrid .col2row2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px);
        height: calc(200% + 10px);
    }

    .viewDashboardCCTVGrid .col2row2.hidden {
        display: none;
    }

    .viewDashboardCCTVGrid .col2row2 span {
        color: white;
        width: 100%;
    }

    .viewDashboardCCTVGrid .col2row2 span p {
        background-color: black;
        max-height: ${_CCTVInfoComponent[PR.styleMode].col1rowSpanMaxHeight};
        overflow: hidden;
        width: ${_CCTVInfoComponent[PR.styleMode].textWidth};
        font-size: ${_CCTVInfoComponent[PR.styleMode].fontSize};
        padding-left: ${_CCTVInfoComponent[PR.styleMode].paddingLeft};
    }

    .viewDashboardCCTVGrid .col2row2 span p.selected {
        background-color: ${_CCTVInfoComponent[PR.styleMode].selectedColor};
        /* color: black; */
        color: #fff;
        font-weight: ${_CCTVInfoComponent[PR.styleMode].fontWeight};
    }

    .viewDashboardCCTVGrid div:nth-child(2n + 2) {
        margin-right: 0;
    }

    .viewDashboardCCTVGrid div span {
        position: relative;
        height: 100%;
        display: inline-block;
    }

    .viewDashboardCCTVGrid div span img {
        position: relative;
        width: 180px;
        height: 130px;
    }

    .viewDashboardCCTVGrid div span iframe {
        width: 100% !important;
        height: 100% !important; /* z-index: 101; */
    }

    .viewDashboardCCTVGrid div span video {
        width: 100% !important;
        height: 100% !important; /* z-index: 101; */
    }

    .viewDashboardCCTVGrid div span:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0; /* z-index:98; */
        width: 100%;
        height: 100%; /*border:1px dotted #3b3f5c; background:url(../image/temp/cctv_dot.png) left top no-repeat;*/
    }

    .viewDashboardCCTVGrid div span p {
        position: absolute; /*z-index: 102;*/
        z-index: 9999;
    }

    /* 활성화 */
    .dslGrdAct {
        background-color: ${_CCTVInfoComponent[PR.styleMode].dslGrdActBackground};

        .dslTitle {
            color: ${_CCTVInfoComponent[PR.styleMode].dslGrdActColor};
        }
    }

    .cctvAct {
        position: absolute;
        background-color: rgb(0 143 255);
        color: #fff;
        width: 15px;
        height: 15px;
        left: -5px;
        top: -2px;
        z-index: 1;
        text-align: center;
        font-size: 10px;
        border-radius: 50%;
        font-weight: 600;
        line-height: 15px;
        padding-right: 1px;
    } /* 0125 */

    .hidden {
        display: none;
    }

     /* cctv tooltip */
    .tooltipGG_cctv {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 14px;
        color: #fff;
        margin-left: 5px;
        margin-right: 14px;
        border: solid 1px #ffffff;
        cursor: help;
        position: relative;
        background: url(${cctvSetBtnDefault})no-repeat center center; 
        border-radius: 3px;
        z-index: 9999;

        &:hover{
            display: inline-block;
            width: 20px;
            height: 20px; 
            background: url(${cctvSetBtnHover})no-repeat center center;
            cursor: help;
        }
    }

    .tooltipGG_cctv-content {
        position: absolute;
        top: -50px;
        right: 2px;
        color: #fff;
        padding: 10px;
        border-radius: 5px;
        background: #0E162DE0 0% 0% no-repeat padding-box;
        font-size: 12px;
        letter-spacing: 0.6px;
        line-height: 1.2;
    }

    .tooltipGG_cctv-content:after {
        position: absolute;
        top: 100%;
        left: 42%;
        width: 0;
        height: 0;
        border-bottom: 8px solid #0E162DE0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        content: "";
        transform: rotate(180deg);
    }
`;


/**********************************************************************/
// 대시보드

export const _DashboardComponent = {
    Hydrogen: {
        width: '320px',
        height: '100%',
        sectionblankFontSize: '16px',
        sectionblankBorderBottom: '1px solid #525868',
        sectionblankDivPadding: '7px 0',
        flexBoxSpanPadding: '0 5px',
        viewDashboardTemperatureUlLiMargin: '0 10px',
        colseXSize: '14px',
        colseXTop: '12px',
        viewDashboardBorderBottom: 'dashed 1px #9F9F9F',
        sectionblankDivMargin: '0px',
        sectionblankWidth: '100%',
        sectionblankFontWeight: 'lighter',
        whiteTxtLetterSpacing: '0px',
        sectionblankPaddingRight: '30px',
        detailBtnRight: '24px',
        detailBtnTop: '54px',
    },
}

export const DashboardComponent = styled(PopupsCommon)`
    position: absolute;
    left: 26%;
    top: 15%;
    width: ${_DashboardComponent[PR.styleMode].width};
    height: ${_DashboardComponent[PR.styleMode].height};
    line-height: 130%;

    .viewDashboardSectionConts {
        /* padding: 0 20px; */
    }

    .viewDashboardSensors{
        display: flex;
        height: 37px;
        /* align-items: center;
        justify-content: center; */
        border-bottom: ${_DashboardComponent[PR.styleMode].viewDashboardBorderBottom};
    }

    .viewDashboardTemperature {
        /* clear: both;
        text-align: center;
        overflow: hidden; */
        display: flex;
        width: 100%;
        height: 37px;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .viewDashboardTemperature ul {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 10px 0;
        font-size: ${_DashboardComponent[PR.styleMode].sectionblankFontSize};
        white-space: nowrap;
    } /*애니메이션 효과 제거 형태*/

    .viewDashboardTemperature ul li {
        display: inline-block;
        margin: ${_DashboardComponent[PR.styleMode].viewDashboardTemperatureUlLiMargin};
    }

    .sectionblank {
        /* text-align: center; */
        /* border-bottom: ${_DashboardComponent[PR.styleMode].sectionblankBorderBottom}; */
        display: flex;
        /* width: 100%; */
        width: ${_DashboardComponent[PR.styleMode].sectionblankWidth}; 
        align-items: center;
        justify-content: center;
        font-weight: ${_DashboardComponent[PR.styleMode].sectionblankFontWeight};
        letter-spacing: ${_DashboardComponent[PR.styleMode].whiteTxtLetterSpacing};
        padding-right: ${_DashboardComponent[PR.styleMode].sectionblankPaddingRight};
    }

    .sectionblank > div {
        /* margin: 0 5px; */
        margin: ${_DashboardComponent[PR.styleMode].sectionblankDivMargin};
        padding: ${_DashboardComponent[PR.styleMode].sectionblankDivPadding};
        font-size: ${_DashboardComponent[PR.styleMode].sectionblankFontSize};
        color: #fff;
    }

    .sectionblankAlarm{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        font-weight: ${_DashboardComponent[PR.styleMode].sectionblankFontWeight};
        letter-spacing: ${_DashboardComponent[PR.styleMode].whiteTxtLetterSpacing};
    }

    .sectionLocationIcon{
        display: inline-block;
        width: 40px;
        height: 37px;
        background: url(${SectionLocationIcon}) no-repeat center center;
        background-color: rgba(0, 175, 255, 0.28);
        background-size: 42%;
        
    }

    .sectionAlarmIcon{
        display: inline-block;
        width: 40px;
        height: 37px;
        background: url(${SectionAlarmIcon}) no-repeat center center;
        background-color: rgba(0, 175, 255, 0.28);
        background-size: 54%;

    }

    .disconnectIcon {
        display: inline-block;
        width: 24px;
        height: 26px;
        background: url(${disconnect}) no-repeat;
        background-size: 24px;
        margin-right: 6px;
    }

    .flexBox {
        display: flex;
        justify-content: center;

        span {
            padding: ${_DashboardComponent[PR.styleMode].flexBoxSpanPadding};
        }
    }

    

    .clfix {
        ${(props) => props.theme.variables.clearfix()};
    }

    .detailBtn {
        position: absolute;
        right: ${_DashboardComponent[PR.styleMode].detailBtnRight};
        top: ${_DashboardComponent[PR.styleMode].detailBtnTop};
        cursor: pointer;
    }
`;



/**********************************************************************/
// 대시보드 팝업창
export const DashboardPopComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50px;
    width: 320px !important;
    height: calc(100vh - 50px);
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    border: none;
    /* z-index: 2 !important; */

    /* &::before{
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url(${popup_background_noTitle})no-repeat center center;
        background-size: cover;
        background-size: auto;
        opacity: 0.15;
        position: absolute;
        left: 0;
        top: 48px;
    } */

    &::after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url(${popupSide_icon})no-repeat center center;
        position: absolute;
        right: 4.5px;
        bottom: 4.5px;
        cursor: pointer;
    }

    .viewDashPopTitle{
        display: flex;
        align-items: center;
        width: 100%;
        height: 48px;
        padding: 14px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);

        > span{
            color: #B6C6D2;
            font-size: 14px;
            font-weight: 700;
        }
    }

    .viewDashboardSection{
        padding: 14px;
        position: absolute;
        top: 48px;
        z-index: 1;
        width: calc(100% - 0px);
        height: calc(100% - 50px);
        overflow-x: hidden;
        overflow-y: auto;

        &::before{
            content: '';
            display: inline-block;
            width: 100%;
            height: 100%;
            background: url(${popup_background_noTitle})no-repeat center center;
            background-size: cover;
            opacity: 0.15;
            position: absolute;
            left: 0;
            top: 0;
        }

        &::-webkit-scrollbar {
            width: 4px;
            padding-right: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
            background-color: #1D1D1D;
        }

        &::-webkit-scrollbar-track {
            background-color: #3C4143;
        }

        > div:not(.sensorEventArea) {
            border: 1px solid #292D2E;
        }
        
        .weeklyChart{
            display: block;
            width: 292px;
            height: 288px;
            padding: 20px;
            background: rgba(19, 19, 19, 0.50);
            border-radius: 4px;
            margin-bottom: 14px;
            position: absolute;
            z-index: 1;

            > div{
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                > span{
                    color: #FFF;
                    font-size: 24px;
                    font-weight: 700;
                    margin-right: 8px;
                }

                > img{
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                } 

                .eventArrowTop{
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    background: url(${eventArrowTop})no-repeat;
                }

                .eventArrowBottom{
                    display: inline-block;
                    width: 7px;
                    height: 7px;
                    background: url(${eventArrowBottom})no-repeat;
                }
            }

            > div:nth-child(2){
                color: #939393;
                font-size: 12px;
                font-weight: 400;
                margin-bottom: 28px;
            }

            .chartBox{
                height: 160px;

                .legendUI{
                    margin-left: 29px;

                    .legendActLi{
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        color: #ffffff;
                        font-size: 12px;

                        > span{
                            margin-right: 4px;
                        }
                    }

                    .legendDisableLi{
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                        color: #393E50;
                        font-size: 12px;

                        > span{
                            margin-right: 4px;
                        }
                    }

                    .blueBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        /* background: #0085FF; */
                    }
                    .skyBlueBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #3BDCFF;
                    }
                    .mintBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #62FFEC;
                    }
                    .ivoryBlueBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #B0FFF6;
                    }
                    .lightSkyBlueBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #B0D9FF;
                    }
                    .purpleBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #89A2FF;
                    }
                    .disableBox{
                        display: block;
                        width: 4px;
                        height: 4px;
                        background: #393E50;
                    }
                }
            }
        }

        .weeklyEventInfo{
            width: 292px;
            /* height: 158px; */
            height: 195px;
            background: rgba(19, 19, 19, 0.50);
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 14px;
            position: absolute;
            left: 14px;
            top: 315px;
            z-index: 1;

            > span{
                display: flex;
                align-items: center;
                color: #FFF;
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 17px;

                &::before{
                    content: "";
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: url(${weeklyEvent_icon})no-repeat center center;
                    margin-right: 8px;
                }
            }

            .lineChartBox{
                height: 110px;
            }
        }

        .sensorEventArea{
            display: block;
            width: 292px;
            position: absolute;
            left: 14px;
            top: 523px;
            z-index: 1;

            > div {
                ${(props) => props.theme.variables.flex('center', 'center')};
                gap: 6px;
                margin-bottom: 6px;

                > div {
                    border: 1px solid #292D2E;
                    flex: 1;
                    width: 100%;
                    height: 110px;
                    border-radius: 6px;
                    padding: 12px;
                    ${(props) => props.theme.variables.flex('space-between', 'flex-start')};
                    flex-direction: column;

                    &:hover {
                        box-shadow: 0 0 2px 0 #0085FF inset;

                        > div {
                            &:nth-child(1) {
                                color: #fff;
                            }
                        }
                    }

                    > div {

                        &:nth-child(1) {
                            color: #939393;
                            text-shadow: 0 2px 4px #000;
                            font-size: 14px;
                            font-weight: 500;
                            line-height: 14px; /* 100% */
                        }

                        &:nth-child(2) {
                            ${(props) => props.theme.variables.flex('flex-start', 'flex-start')};
                            gap: 8px;
                            flex-direction: column;

                            > span {
                                color: #FFF;
                                font-size: 12px;
                                line-height: 12px; /* 100% */
                            }
                        }
                    }
                }
            }

            .conductivity{
                display: inline-block;
                width: 143px;
                height: 143px;
                background: #131313;
                border-radius: 6px;
                margin-right: 6px;
                margin-bottom: 14px;

                > div:nth-child(1){
                    height: 85px;
                    background: rgba(30, 30, 30, 0.50);
                    color: #FFF;
                    text-shadow: 0px 2px 4px #000;
                    font-size: 14px;
                    font-weight: 500;
                    padding: 10px;
                    border-radius: 6px 6px 0 0;
                }

                > div:nth-child(2){
                    padding: 10px;

                    > span{
                        display: block;
                        color: #FFF;
                        font-size: 12px;
                        font-weight: 400; 
                    }

                    > span:nth-child(1){
                        margin-bottom: 10px;
                    }
                }
            }

            .flow{
                background: url(${bg_flow}) no-repeat center center;
                
                &:hover {
                    background: url(${bg_flow_on}) no-repeat center center;
                }
            }

            .oxygenGas{
                background: url(${bg_oxygenGas}) no-repeat center center;

                &:hover {
                    background: url(${bg_oxygenGas_on}) no-repeat center center;
                }
            }

            .hydrogenGas{
                background: url(${bg_hydrogenGas}) no-repeat center center;
                
                &:hover {
                    background: url(${bg_hydrogenGas_on}) no-repeat center center;
                }
            }

            .hydrogen{
                background: url(${bg_hydrogen}) no-repeat center center;

                &:hover {
                    background: url(${bg_hydrogen_on}) no-repeat center center;
                }
            }
            
            .pressure{
                background: url(${bg_pressure}) no-repeat center center;
                
                &:hover {
                    background: url(${bg_pressure_on}) no-repeat center center;
                }
            }

            .temperature{
                background: url(${bg_temperature}) no-repeat center center;

                &:hover {
                    background: url(${bg_temperature_on}) no-repeat center center;
                }
            }
        }
    }
`;


/**********************************************************************/
// 미니맵

export const _MiniMapComponent = {
    Hydrogen: {
        padding: '50px 20px 20px 20px',
        miniMapContsPFontWeight: '600',
        miniMapContsPPadding: '20px 0 0 0',
    },
}

export const MiniMapComponent = styled(PopupsCommon)`
    position: absolute;
    left: 335px;
    top: 670px;
    width: 350px;
    height: 260px;
    box-sizing: border-box;

    .miniMapConts {
        /* padding: ${_MiniMapComponent[PR.styleMode].padding}; */
        padding: 10px;
        height: calc(100% - 40px);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .miniMapConts p {
        position: absolute;
        top: 35px;
        padding: ${_MiniMapComponent[PR.styleMode].miniMapContsPPadding};
        box-sizing: border-box;
        height: 40px;
        font-size: 16px;
        font-weight: ${_MiniMapComponent[PR.styleMode].miniMapContsPFontWeight};
        color: white;
        background-color: ${_MiniMapComponent[PR.styleMode].miniMapContsPBackground};
    }

    .miniMapConts img {
        width: auto;
        max-width: 100%;
        height: auto;
        max-height: 100%;
        display: block;
        /* margin-left: auto;
        margin-right: auto; */
        margin-top: 26px;
        /* padding: 14px; */
    }

    .sensorName {
        color: yellow;
        margin-top: 10px;
    }

    .sensorName.marginBottom10 {
        margin-bottom: 10px;
    }

    .inputText {
        color: black;
        margin-top: 10px;
    }

    .width100 {
        width: 100px;
    }

    .menuBtnModel {
        background-color: gray;
        border-radius: 4px;
        margin-top: 11px;
        margin-left: 5px;
        margin-bottom: 20px;
        padding: 10px 10px 10px 10px;
    }

    .horzArea,
    .horzAreaSensor {
        display: flex;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable.whiteText {
        color: white;
    }

    .labelInput {
        position: relative;
        top: -2px;
        cursor: pointer;
        margin-right: 5px;
        margin-left: 15px;
        color: white;
    }
`;


/**********************************************************************/
// 인원현황

export const WorkerInfoComponent = styled(PopupsCommon)`
    position: absolute;
    right: 50px;
    top: 450px;
    width: 530px;
    height: 380px;
    overflow: hidden;

    .workerContents {
        display: block;
        text-align: center;
        height: calc(100% - 40px);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .workerTitle {
        display: flex;
        justify-content: center;
        line-height: 45px;
        background: #141b2a;
        border-radius: 5px;
        margin: 10px;
    }

    .workerTitle .wFact {
        width: 20%;
        color: #fff;
        display: inline-block;
        letter-spacing: -1px;
        font-size: 14px;
    }

    .workerTitle .previousDayWorker {
        width: 20%;
        color: #fff;
        display: inline-block;
        letter-spacing: -1px;
        font-size: 14px;
    }

    .workerTitle .dayWorker {
        width: 20%;
        color: #fff;
        display: inline-block;
        letter-spacing: -1px;
        font-size: 14px;
    }

    .workerTitle .dayVisitor {
        width: 40%;
        color: #fff;
        display: inline-block;
        letter-spacing: -1px;
        font-size: 14px;
    }

    .workerTitle .peoppleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .workerContsBox {
        display: block;
        width: calc(100% - 16px);
        margin: 10px;
    }

    .workerConts2 {
        display: flex;
        justify-content: center;
        background: #141b2a;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 70px;
    }
    .workerConts2 .peopleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .workerConts2Tree {
        display: block;
        background: #141b2a;
        border-radius: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .wFactoryBox {
        display: block;
        width: 20%;
        padding: 20px 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .wFactoryBox .wFactoryBold {
        display: flex;
        height: 100%;
        color: #fff;
        text-align: center;
        font-size: 14px;
        justify-content: center;
        align-items: center;
    }
    
    .wFactoryBox p {
        display: block;
        color: #fff;
        text-align: center;
    }

    .grayPeopleIcon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${grayPeople}) no-repeat;
        background-size: 14px;
    }

    .grayFont {
        display: inline-block;
        color: #d7d7d7;
        margin-left: 4px;
    }

    .greenPeopleIcon {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(${wPeopleIcon_Active}) no-repeat;
        background-size: 14px;
    }

    .greenFont {
        display: inline-block;
        color: #6ef21b;
        margin-left: 4px;
    }

    .buildingName {
        display: inline-block;
        flex-grow: 1;
        text-align: left;
    }

    .peopleNumBox {
        display: inline-flex;
        align-items: center;
        align-content: center;
        vertical-align: middle;
        font-size: 12px;
    }

    .workerConts1Tree {
        display: block;
        background: #141b2a;
        border-radius: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .workerConts2Tree {
        display: block;
        background: #141b2a;
        border-radius: 5px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .stguTree {
    }

    .dayWorkerBox {
        display: flex;
        width: 20%;
        position: relative;
        padding: 0px 4px;
        line-height: 60px;
        justify-content: center;
    }

    .dayWorkerBox .dayWorkerDisableIcon {
        display: inline-block;
        width: 36px;
        background: url(${grayPeople}) no-repeat;
        background-size: 28px;
        background-position: center;
    }

    .dayWorkerBox .dayWorkerDisableNum {
        display: flex;
        color: #d7d7d7;
        text-align: center;
        font-size: 22px;
        justify-content: center;
        align-items: center;
    }

    .dayWorkerBox .dayWorkerIcon {
        display: inline-block;
        width: 36px;
        background: url(${greenPeople}) no-repeat;
        background-size: 28px;
        background-position: center;
    }

    .dayWorkerBox .dayWorkerNum {
        display: flex;
        color: #6beb1a;
        text-align: center;
        font-size: 22px;
        justify-content: center;
        align-items: center;
    }

    .dayVisitorBox {
        display: flex;
        width: 60%;
        line-height: 60px;
        justify-content: center;
    }

    .dayVisitorBox .dayVisitorDisableIcon {
        display: inline-block;
        width: 36px;
        background: url(${grayPeople2}) no-repeat;
        background-size: 28px;
        background-position: center;
    }

    .dayVisitorBox .dayVisitorDisableNum {
        display: flex;
        color: #d7d7d7;
        text-align: center;
        font-size: 22px;
        justify-content: center;
        align-items: center;
    }

    .dayVisitorBox .dayVisitorIcon {
        display: inline-block;
        width: 36px;
        background: url(${yellowPeople}) no-repeat;
        background-size: 28px;
        background-position: center;
    }

    .dayVisitorBox .dayVisitorNum {
        display: flex;
        color: #e4ad2b;
        text-align: center;
        font-size: 22px;
        justify-content: center;
        align-items: center;
    }

    .workerConts1 {
        display: flex;
        justify-content: center;
        background: #141b2a;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 70px;
    }

    .workerConts1 .peopleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .workerConts2 {
        display: flex;
        justify-content: center;
        background: #141b2a;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 70px;
    }

    .workerConts2 .peopleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .workerConts3 {
        display: flex;
        justify-content: center;
        background: #141b2a;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 70px;
    }

    .workerConts3 .peopleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .workerConts4 {
        display: flex;
        justify-content: center;
        background: #141b2a;
        border-radius: 5px;
        margin-bottom: 10px;
        min-height: 70px;
    }

    .workerConts4 .peopleLine {
        display: block;
        width: 0.5px;
        border: solid 0.5px #3e3e3e;
        margin: 6px 0px;
    }

    .previousDayWorkerBox {
        display: flex;
        width: 20%;
        justify-content: center;
    }

    .previousDayWorkerBox .previousDayWorkerIcon {
        display: inline-block;
        width: 36px;
        background: url(${grayPeople}) no-repeat;
        background-size: 28px;
        background-position: center;
    }

    .previousDayWorkerBox .previousDayWorkerNum {
        display: flex;
        color: #fff;
        text-align: center;
        font-size: 22px;
        justify-content: center;
        align-items: center;
    }
`;


/**********************************************************************/
// 센서정보현황

export const SensorStatusComponent = styled(PopupsCommon)`
    position: absolute;
    top: 19%;
    left: 59%;
    /* min-width: 397px;
    min-height: 506px; */

    .sensorContsBox{
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .sensorConts {
        display: block;
        width: 100%;
        height: 80% !important;
        min-height: 426px !important;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .sensorContsSmall {
        display: block;
        width: 100%;
        height: 80% !important;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .sensorIconBox {
        display: flex;
        padding: 6px 0px;
        flex-grow: 1;
    }

    .sensorIconBox .etcIcon {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorETC_visible}) no-repeat;
        background-size: 30px;
    }
    .sensorIconBox .etcIcon.selected {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorETC_selected}) no-repeat;
        background-size: 30px;
    }
    .sensorIconBox .etcIcon:hover {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorETC_hover}) no-repeat;
        background-size: 30px;
    }

    /* 라인 활성화 */
    .sensorInfoBoxInterestLine {
        border: solid 1px #17c572;
    }
    .sensorInfoBoxCautionLine {
        border: solid 1px #fff100;
    }
    .sensorInfoBoxBoundaryLine {
        border: solid 1px #f67b00;
    }
    .sensorInfoBoxSeriousLine {
        border: solid 1px #fe022e;
    }

    .leakNumBox {
        display: flex;
        width: 100px;
        padding: 0px 4px;
    }
    .leakNumBox .leckCheckIcon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(${checkBox_orange}) no-repeat;
        background-size: 10px;
        background-position: center;
    }
    .leakNumBox .leckNum {
        color: #fff;
        font-size: 10px;
        line-height: 20px;
    }

    .etcNumBox {
        display: flex;
        width: 100%;
        padding: 0px 4px;
    }
    .etcNumBox .etcCheckIcon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(${checkBox_orange}) no-repeat;
        background-size: 10px;
        background-position: center;
    }
    .etcNumBox .etcNum {
        color: #fff;
        font-size: 10px;
        line-height: 20px;
    }

    .sensorIconBox .psmIcon {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorPSM_visible}) no-repeat;
        background-size: 30px;
        margin-right: 5px;
    }
    .sensorIconBox .psmIcon.selected {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorPSM_selected}) no-repeat;
        background-size: 30px;
        margin-right: 5px;
    }
    .sensorIconBox .psmIcon:hover {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${sensorPSM_hover}) no-repeat;
        background-size: 30px;
        margin-right: 5px;
    }

    .sensorIconFlex {
        display: flex;
        border-bottom: dashed 1px #565656;
        margin: 0px 10px;
    }

    .fullView {
        line-height: 40px;
        padding: 0px 8px;
    }
    .fullView input[type="checkbox"] {
        display: inline-block;
        vertical-align: middle;
        width: 11px;
        height: 11px;
        cursor: pointer;
        border-radius: 50%;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        position: relative;
        background: #fff;
    }
    .fullView input[type="checkbox"]:checked {
        background: #ff8400;
        border: solid 2px #fff;
        border-radius: 50%;
    }
    .fullView input[type="checkbox"] + label {
        display: inline;
        vertical-align: middle;
        margin-left: 5px;
        font-size: 10px;
        color: #fff;
        font-weight: 400;
        cursor: pointer;
    }
    .fullView span {
        color: #fff;
        font-size: 10px;
        margin-left: 6px;
    }

    .sensorSearchBox {
        display: flex;
        padding: 8px 8px;
    }
    .sensorSearchBox .sensorSearchBlank {
        display: inline-block;
        width: 336px;
        height: 26px;
        border-radius: 6px;
        border: solid 2px #4a575e;
        background: rgb(10 12 27 / 0%);
        color: #fff;
    }
    .sensorSearchBox .sensorSearch {
        display: inline-block;
        background: url(${magnifier}) no-repeat center center;
        width: 26px; /* height:22px; */
        background-size: 22px;
        background-position-x: 6px;
        cursor: pointer;
    }

    .sensorNumBox {
        display: flex;
        width: 100%;
        height: 20px;
    }

    .sensorInfoBox {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 8px;
        margin: 5px 5px;
        position: relative; /* min-width: 170px; min-height: 156px; */
        width: 100%;
        height: 100%;
    }

    .sensorInfoBoxSmall {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 8px;
        margin: 5px 5px;
        position: relative; /* min-width: 170px; min-height: 156px; */
        width: 180px;
        height: 190px;
    }

    .sensorInfoBox .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBox .sensorTitleBox {
        display: flex;
        flex-grow: 1;
    }
    .sensorInfoBox .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 11px;
        width: 140px;
        font-weight: 500;
        letter-spacing: -1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sensorInfoBox .sensorTitle2 {
        display: block;
        color: #7b8f9a;
        font-size: 9px;
        font-weight: 500;
        letter-spacing: -1px;
    }
    .sensorInfoBox .sensorItem {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(${alarmBellYellow}) no-repeat;
        background-size: 20px;
    }

    .sensorInfoBox .sensorStepNormal {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBox .sensorStepInterest {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBox .sensorStepCaution {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBox .sensorStepBoundary {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBox .sensorStepSerious {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBox .sensorStepNone {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBox .sensorText {
        display: inline-block;
        color: #7b8f9a;
        font-size: 12px;
        font-weight: 900;
    }
    .sensorInfoBox .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 10px;
        font-weight: 900;
        position: absolute;
        left: 14px;
        top: 94px;
    }
    .sensorInfoBox .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 10px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBox .halfLine1 {
        display: inline-block;
        width: 1px;
        height: 10px;
        border: solid 0.5px #484848;
        position: absolute;
        left: 18px;
        bottom: -4px;
        transform: rotate(270deg);
    }
    .sensorInfoBox .halfLine4 {
        display: inline-block;
        width: 1px;
        height: 10px;
        border: solid 0.5px #484848;
        position: absolute;
        left: 80px;
        bottom: -4px;
        transform: rotate(90deg);
    }

    .sensorInfoBox .chartArea {
        /* display: flex; flex-direction: column;  height: 58%; */
        display: block;
        height: 100%;
    }
    .sensorInfoBox .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBox .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 120px;
        height: 60px;
        margin-top: 20px;
        /* padding-top:20px; padding-left: 14px; */
        padding-right: 14px;
        font-size: 10px;
    }
    .sensorInfoBox .chartSkills *,
    .sensorInfoBox .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBox .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBox .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBox .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBox .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBox .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }

    .sensorInfoBox .chartSkills li {
        position: absolute;
        top: 101%; /* left: 10%; */
        width: 120px;
        height: 60px;
        border: 10px solid;
        border-top: none;
        border-bottom-left-radius: 175px;
        border-bottom-right-radius: 175px;
        transform-origin: 50% 0;
        padding-left: 10px;
        padding-right: 10px;
    }
    .sensorInfoBox .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBox .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBox .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBox .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange2}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBox .figureSignSerious {
        display: inline-block;
        background: url(${stickRed}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBox .figureSignNone {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #334e57;
        position: absolute;
        left: 46%;
        top: 50%;
    }

    .sensorInfoBox .sensorLH {
        display: block;
        height: 20px;
        color: #7b8f9a;
        font-size: 8px;
        padding: 4px 28px;
    }
    .sensorInfoBox .sensorTextL {
        display: block;
        float: left;
    }
    .sensorInfoBox .sensorTextH {
        display: block;
        float: right;
    }

    .sensorInfoBox .figure {
        display: flex;
        width: 140px;
        height: 20px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 8px;
        padding: 2px 4px;
        margin-top: 20px;
        margin-bottom: 10px;
        align-items: center;
    }
    .sensorInfoBox .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }

    .sensorInfoBox .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 4px;
        margin-right: 4px;
    }
    .sensorInfoBox .numBoldNormal {
        display: inline-block;
        width: 54px;
        color: #16ca73;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox .numBoldInterest {
        display: inline-block;
        width: 54px;
        color: #2e47ff;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox .numBoldCaution {
        display: inline-block;
        width: 54px;
        color: #fff100;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox .numBoldBoundary {
        display: inline-block;
        width: 54px;
        color: #f67b00;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox .numBoldSerious {
        display: inline-block;
        width: 54px;
        color: #fe022e;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox .numBoldNone {
        display: inline-block;
        width: 54px;
        color: #7a8d98;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBox .sensorCheck {
        display: block;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 12px;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 20px;
    }


    .sensorInfoBoxSmall .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBoxSmall .sensorTitleBox {
        display: flex;
        flex-grow: 1;
    }
    .sensorInfoBoxSmall .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 11px;
        width: 140px;
        font-weight: 500;
        letter-spacing: -1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .sensorInfoBoxSmall .sensorTitle2 {
        display: block;
        color: #7b8f9a;
        font-size: 9px;
        font-weight: 500;
        letter-spacing: -1px;
    }
    .sensorInfoBoxSmall .sensorItem {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(${alarmBellYellow}) no-repeat;
        background-size: 20px;
    }

    .sensorInfoBoxSmall .sensorStepNormal {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBoxSmall .sensorStepInterest {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBoxSmall .sensorStepCaution {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBoxSmall .sensorStepBoundary {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBoxSmall .sensorStepSerious {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBoxSmall .sensorStepNone {
        display: block;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBoxSmall .sensorText {
        display: inline-block;
        color: #7b8f9a;
        font-size: 12px;
        font-weight: 900;
    }
    .sensorInfoBoxSmall .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 10px;
        font-weight: 900;
        position: absolute;
        left: 14px;
        top: 94px;
    }
    .sensorInfoBoxSmall .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 10px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBoxSmall .halfLine1 {
        display: inline-block;
        width: 1px;
        height: 10px;
        border: solid 0.5px #484848;
        position: absolute;
        left: 18px;
        bottom: -4px;
        transform: rotate(270deg);
    }
    .sensorInfoBoxSmall .halfLine4 {
        display: inline-block;
        width: 1px;
        height: 10px;
        border: solid 0.5px #484848;
        position: absolute;
        left: 80px;
        bottom: -4px;
        transform: rotate(90deg);
    }

    .sensorInfoBoxSmall .chartArea {
        /* display: flex; flex-direction: column;  height: 58%; */
        display: block;
        height: 100%;
    }
    .sensorInfoBoxSmall .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBoxSmall .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 120px;
        height: 60px;
        margin-top: 20px;
        /* padding-top:20px; padding-left: 14px; */
        padding-right: 14px;
        font-size: 10px;
    }
    .sensorInfoBoxSmall .chartSkills *,
    .sensorInfoBoxSmall .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBoxSmall .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxSmall .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxSmall .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxSmall .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxSmall .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 10px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }

    .sensorInfoBoxSmall .chartSkills li {
        position: absolute;
        top: 101%; /* left: 10%; */
        width: 120px;
        height: 60px;
        border: 10px solid;
        border-top: none;
        border-bottom-left-radius: 175px;
        border-bottom-right-radius: 175px;
        transform-origin: 50% 0;
        padding-left: 10px;
        padding-right: 10px;
    }
    .sensorInfoBoxSmall .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBoxSmall .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBoxSmall .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBoxSmall .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange2}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBoxSmall .figureSignSerious {
        display: inline-block;
        background: url(${stickRed}) no-repeat;
        width: 40px;
        height: 30px;
        position: absolute;
        background-position: right;
        background-size: 40px;
        left: 24%;
        top: 50%;
        transform-origin: 32px 14px;
    }
    .sensorInfoBoxSmall .figureSignNone {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #334e57;
        position: absolute;
        left: 46%;
        top: 50%;
    }

    .sensorInfoBoxSmall .sensorLH {
        display: block;
        height: 20px;
        color: #7b8f9a;
        font-size: 8px;
        padding: 4px 28px;
    }
    .sensorInfoBoxSmall .sensorTextL {
        display: block;
        float: left;
    }
    .sensorInfoBoxSmall .sensorTextH {
        display: block;
        float: right;
    }

    .sensorInfoBoxSmall .figure {
        display: flex;
        width: 140px;
        height: 20px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 8px;
        padding: 2px 4px;
        margin-top: 20px;
        margin-bottom: 10px;
        align-items: center;
    }
    .sensorInfoBoxSmall .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }

    .sensorInfoBoxSmall .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 4px;
        margin-right: 4px;
    }
    .sensorInfoBoxSmall .numBoldNormal {
        display: inline-block;
        width: 54px;
        color: #16ca73;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxSmall .numBoldInterest {
        display: inline-block;
        width: 54px;
        color: #2e47ff;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxSmall .numBoldCaution {
        display: inline-block;
        width: 54px;
        color: #fff100;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxSmall .numBoldBoundary {
        display: inline-block;
        width: 54px;
        color: #f67b00;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxSmall .numBoldSerious {
        display: inline-block;
        width: 54px;
        color: #fe022e;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxSmall .numBoldNone {
        display: inline-block;
        width: 54px;
        color: #7a8d98;
        font-size: 12px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBoxSmall .sensorCheck {
        display: block;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 12px;
        cursor: pointer;
        margin: 0 auto;
        margin-top: 20px;
    }




    .sensorInfoBoxL {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 20px;
        margin: 5px 5px;
        position: relative; /* min-width: 360px; min-height: 336px; */ /* width: 360px; height: 336px; */
        width: 100%;
        height: 98% !important;
        /* min-height: 410px !important; */
    }

    .sensorInfoBoxL .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBoxL .sensorTitleBox {
        display: block;
        flex-grow: 1;
    }
    .sensorInfoBoxL .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 14px;
        font-weight: 500;
        letter-spacing: -1px;
    }

    .sensorInfoBoxL .sensorStepNormal {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBoxL .sensorStepInterest {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBoxL .sensorStepCaution {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBoxL .sensorStepBoundary {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBoxL .sensorStepSerious {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBoxL .sensorStepNone {
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBoxL .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 50px;
        top: 188px;
    }
    .sensorInfoBoxL .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBoxL .chartArea {
        /* display: flex; flex-direction: column; */ /* height: 58%; */
        display: block;
        height: 90%;
        min-height: 330px;
    }
    .sensorInfoBoxL .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 20px;
    }

    .sensorInfoBoxL .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 220px;
        height: 110px;
        margin-top: 18%;
        /* padding-top:20px; padding-left: 14px; */
        padding-right: 14px;
        font-size: 10px;
    }
    .sensorInfoBoxL .chartSkills *,
    .sensorInfoBoxL .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBoxL .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 18px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxL .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 18px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxL .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 18px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxL .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 18px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }
    .sensorInfoBoxL .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 18px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 175px;
        border-top-right-radius: 175px;
    }

    .sensorInfoBoxL .chartSkills li {
        position: absolute;
        top: 101%; /* left: 10%; */
        width: 220px;
        height: 110px;
        border: 18px solid;
        border-top: none;
        border-bottom-left-radius: 175px;
        border-bottom-right-radius: 175px;
        transform-origin: 50% 0;
        padding-left: 10px;
        padding-right: 10px;
    }

    .sensorInfoBoxL .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal}) no-repeat;
        width: 83px;
        height: 28px;
        position: absolute;
        background-position: right;
        background-size: 60px;
        left: 18%;
        top: 54%;
        transform-origin: 74px 14px;
    }
    .sensorInfoBoxL .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue}) no-repeat;
        width: 83px;
        height: 28px;
        position: absolute;
        background-position: right;
        background-size: 60px;
        left: 18%;
        top: 54%;
        transform-origin: 74px 14px;
    }
    .sensorInfoBoxL .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow}) no-repeat;
        width: 83px;
        height: 28px;
        position: absolute;
        background-position: right;
        background-size: 60px;
        left: 18%;
        top: 54%;
        transform-origin: 74px 14px;
    }
    .sensorInfoBoxL .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange2}) no-repeat;
        width: 83px;
        height: 28px;
        position: absolute;
        background-position: right;
        background-size: 60px;
        left: 18%;
        top: 54%;
        transform-origin: 74px 14px;
    }
    .sensorInfoBoxL .figureSignSerious {
        display: inline-block;
        background: url(${stickRed}) no-repeat;
        width: 83px;
        height: 28px;
        position: absolute;
        background-position: right;
        background-size: 60px;
        left: 18%;
        top: 54%;
        transform-origin: 74px 14px;
    }

    .sensorInfoBoxL .figure {
        display: flex;
        width: 220px;
        height: 34px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 11px;
        padding: 2px 10px;
        margin-top: 50px;
        margin-bottom: 10px;
        align-items: center;
    }

    .sensorInfoBoxL .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }
    .sensorInfoBoxL .figure .sensorName {
        display: block;
        width: 90px;
        text-align: center;
        font-size: 14px;
    }

    .sensorInfoBoxL .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sensorInfoBoxL .numBoldNormal {
        display: inline-block;
        width: 90px;
        color: #16ca73;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxL .numBoldInterest {
        display: inline-block;
        width: 90px;
        color: #2e47ff;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxL .numBoldCaution {
        display: inline-block;
        width: 90px;
        color: #fff100;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxL .numBoldBoundary {
        display: inline-block;
        width: 90px;
        color: #f67b00;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxL .numBoldSerious {
        display: inline-block;
        width: 90px;
        color: #fe022e;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBoxL .numBoldNone {
        display: inline-block;
        width: 90px;
        color: #7a8d98;
        font-size: 20px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBoxL .sensorCheck {
        display: block;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 12px;
        cursor: pointer;
        margin: 0 auto;
    }

    .sensorInfoBox2L {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 20px;
        margin: 5px 5px;
        position: relative; /* min-width: 620px; min-height: 570px; */ /* width: 620px; height: 570px; */
        width: 100%;
        height: 100%;
    }

    .sensorInfoBox2L .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBox2L .sensorTitleBox {
        display: block;
        flex-grow: 1;
    }
    .sensorInfoBox2L .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 20px;
        font-weight: 500;
        letter-spacing: -1px;
    }

    .sensorInfoBox2L .sensorStepNormal {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBox2L .sensorStepInterest {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBox2L .sensorStepCaution {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBox2L .sensorStepBoundary {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBox2L .sensorStepSerious {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBox2L .sensorStepNone {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBox2L .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 50px;
        top: 188px;
    }
    .sensorInfoBox2L .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBox2L .chartArea {
        /* display: flex; flex-direction: column; */ /* height: 58%; */
        display: block;
        height: 90%;
    }
    .sensorInfoBox2L .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBox2L .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 340px;
        height: 170px;
        margin-top: 20%;
        /* padding-top:20px; */ /* padding-left: 14px; */
        padding-right: 20px;
        font-size: 10px;
    }
    .sensorInfoBox2L .chartSkills *,
    .sensorInfoBox2L .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBox2L .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 26px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox2L .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 26px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox2L .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 26px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox2L .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 26px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox2L .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 26px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }

    .sensorInfoBox2L .chartSkills li {
        position: absolute;
        top: 101%;
        left: 0%;
        width: 340px;
        height: 170px;
        border: 26px solid;
        border-top: none;
        border-bottom-left-radius: 260px;
        border-bottom-right-radius: 260px;
        transform-origin: 50% 0;
        padding-left: 30px;
        padding-right: 10px;
    }

    .sensorInfoBox2L .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 120px;
        left: 22%;
        top: 56%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox2L .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 120px;
        left: 22%;
        top: 56%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox2L .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 120px;
        left: 22%;
        top: 56%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox2L .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 120px;
        left: 22%;
        top: 56%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox2L .figureSignSerious {
        display: inline-block;
        background: url(${stickRed3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 120px;
        left: 22%;
        top: 56%;
        transform-origin: 100px 30px;
    }

    .sensorInfoBox2L .figure {
        display: flex;
        width: 340px;
        height: 50px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 22px;
        padding: 2px 10px;
        margin-top: 60px;
        margin-bottom: 10px;
        align-items: center;
    }

    .sensorInfoBox2L .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }
    .sensorInfoBox2L .figure .sensorName {
        display: block;
        width: 190px;
        text-align: center;
        font-size: 26px;
    }

    .sensorInfoBox2L .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sensorInfoBox2L .numBoldNormal {
        display: inline-block;
        width: 190px;
        color: #16ca73;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox2L .numBoldInterest {
        display: inline-block;
        width: 190px;
        color: #2e47ff;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox2L .numBoldCaution {
        display: inline-block;
        width: 190px;
        color: #fff100;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox2L .numBoldBoundary {
        display: inline-block;
        width: 190px;
        color: #f67b00;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox2L .numBoldSerious {
        display: inline-block;
        width: 190px;
        color: #fe022e;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox2L .numBoldNone {
        display: inline-block;
        width: 190px;
        color: #7a8d98;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBox2L .sensorCheck {
        display: block;
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 15px;
        cursor: pointer;
        margin: 0 auto;
    }

    .sensorInfoBox3L {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 20px;
        margin: 5px 5px;
        position: relative; /* min-width: 900px; min-height: 750px; */ /*  width: 900px; height: 750px; */
        width: 100%;
        height: 100%;
    }

    .sensorInfoBox3L .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBox3L .sensorTitleBox {
        display: block;
        flex-grow: 1;
    }
    .sensorInfoBox3L .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 20px;
        font-weight: 500;
        letter-spacing: -1px;
    }

    .sensorInfoBox3L .sensorStepNormal {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBox3L .sensorStepInterest {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBox3L .sensorStepCaution {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBox3L .sensorStepBoundary {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBox3L .sensorStepSerious {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBox3L .sensorStepNone {
        display: block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBox3L .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 50px;
        top: 188px;
    }
    .sensorInfoBox3L .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBox3L .chartArea {
        /* display: flex; flex-direction: column; */ /* height: 58%; */
        display: block;
        height: 90%;
    }
    .sensorInfoBox3L .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBox3L .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 460px;
        height: 230px;
        margin-top: 20%;
        /* padding-top:20px; */ /* padding-left: 14px; */
        padding-right: 20px;
        font-size: 10px;
    }
    .sensorInfoBox3L .chartSkills *,
    .sensorInfoBox3L .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBox3L .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 32px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox3L .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 32px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox3L .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 32px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox3L .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 32px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }
    .sensorInfoBox3L .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 32px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 260px;
        border-top-right-radius: 260px;
    }

    .sensorInfoBox3L .chartSkills li {
        position: absolute;
        top: 101%;
        left: 0%;
        width: 460px;
        height: 230px;
        border: 32px solid;
        border-top: none;
        border-bottom-left-radius: 260px;
        border-bottom-right-radius: 260px;
        transform-origin: 50% 0;
        padding-left: 30px;
        padding-right: 10px;
    }

    .sensorInfoBox3L .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 118px;
        left: 29%;
        top: 62%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox3L .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 118px;
        left: 29%;
        top: 62%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox3L .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 118px;
        left: 29%;
        top: 62%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox3L .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 118px;
        left: 29%;
        top: 62%;
        transform-origin: 100px 30px;
    }
    .sensorInfoBox3L .figureSignSerious {
        display: inline-block;
        background: url(${stickRed3L}) no-repeat;
        width: 120px;
        height: 70px;
        position: absolute;
        background-position: right;
        background-size: 118px;
        left: 29%;
        top: 62%;
        transform-origin: 100px 30px;
    }

    .sensorInfoBox3L .figure {
        display: flex;
        width: 460px;
        height: 50px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 22px;
        padding: 2px 10px;
        margin-top: 70px;
        margin-bottom: 10px;
        align-items: center;
    }

    .sensorInfoBox3L .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }
    .sensorInfoBox3L .figure .sensorName {
        display: block;
        width: 190px;
        text-align: center;
        font-size: 26px;
    }

    .sensorInfoBox3L .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sensorInfoBox3L .numBoldNormal {
        display: inline-block;
        width: 190px;
        color: #16ca73;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox3L .numBoldInterest {
        display: inline-block;
        width: 190px;
        color: #2e47ff;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox3L .numBoldCaution {
        display: inline-block;
        width: 190px;
        color: #fff100;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox3L .numBoldBoundary {
        display: inline-block;
        width: 190px;
        color: #f67b00;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox3L .numBoldSerious {
        display: inline-block;
        width: 190px;
        color: #fe022e;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox3L .numBoldNone {
        display: inline-block;
        width: 190px;
        color: #7a8d98;
        font-size: 24px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBox3L .sensorCheck {
        display: block;
        width: 120px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 20px;
        cursor: pointer;
        margin: 0 auto;
    }

    .sensorInfoBox4L {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 20px;
        margin: 5px 5px;
        position: relative; /* min-width: 1390px; min-height: 1120px; */ /*  width: 1390px; height: 1120px; */
        width: 100%;
        height: 100%;
        /* border:dashed 1px red; */
    }

    .sensorInfoBox4L .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBox4L .sensorTitleBox {
        display: block;
        flex-grow: 1;
    }
    .sensorInfoBox4L .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 30px;
        font-weight: 500;
        letter-spacing: -1px;
    }

    .sensorInfoBox4L .sensorStepNormal {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBox4L .sensorStepInterest {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBox4L .sensorStepCaution {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBox4L .sensorStepBoundary {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBox4L .sensorStepSerious {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBox4L .sensorStepNone {
        display: block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBox4L .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 50px;
        top: 188px;
    }
    .sensorInfoBox4L .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBox4L .chartArea {
        /* display: flex; flex-direction: column; */ /* height: 66%; */
        display: block;
        height: 90%;
    }
    .sensorInfoBox4L .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBox4L .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 680px;
        height: 340px;
        margin-top: 20%;
        /* padding-top:20px; */ /* padding-left: 14px; */
        padding-right: 20px;
        font-size: 10px;
    }
    .sensorInfoBox4L .chartSkills *,
    .sensorInfoBox4L .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBox4L .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 42px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 340px;
        border-top-right-radius: 340px;
    }
    .sensorInfoBox4L .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 42px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 340px;
        border-top-right-radius: 340px;
    }
    .sensorInfoBox4L .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 42px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 340px;
        border-top-right-radius: 340px;
    }
    .sensorInfoBox4L .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 42px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 340px;
        border-top-right-radius: 340px;
    }
    .sensorInfoBox4L .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 42px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 340px;
        border-top-right-radius: 340px;
    }

    .sensorInfoBox4L .chartSkills li {
        position: absolute;
        top: 101%;
        left: 0%;
        width: 680px;
        height: 340px;
        border: 42px solid;
        border-top: none;
        border-bottom-left-radius: 340px;
        border-bottom-right-radius: 340px;
        transform-origin: 50% 0;
        padding-left: 30px;
        padding-right: 10px;
    }

    .sensorInfoBox4L .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal3L}) no-repeat;
        width: 210px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 200px;
        left: 26%;
        top: 63%;
        transform-origin: 170px 70px;
    }
    .sensorInfoBox4L .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue3L}) no-repeat;
        width: 210px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 200px;
        left: 26%;
        top: 63%;
        transform-origin: 170px 70px;
    }
    .sensorInfoBox4L .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow3L}) no-repeat;
        width: 210px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 200px;
        left: 26%;
        top: 63%;
        transform-origin: 170px 70px;
    }
    .sensorInfoBox4L .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange3L}) no-repeat;
        width: 210px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 200px;
        left: 26%;
        top: 63%;
        transform-origin: 170px 70px;
    }
    .sensorInfoBox4L .figureSignSerious {
        display: inline-block;
        background: url(${stickRed3L}) no-repeat;
        width: 210px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 200px;
        left: 26%;
        top: 63%;
        transform-origin: 170px 70px;
    }

    .sensorInfoBox4L .figure {
        display: flex;
        width: 650px;
        height: 70px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 36px;
        padding: 2px 10px;
        margin-top: 80px;
        margin-bottom: 10px;
        align-items: center;
    }

    .sensorInfoBox4L .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }
    .sensorInfoBox4L .figure .sensorName {
        display: block;
        width: 300px;
        text-align: center;
        font-size: 36px;
    }

    .sensorInfoBox4L .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sensorInfoBox4L .numBoldNormal {
        display: inline-block;
        width: 300px;
        color: #16ca73;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox4L .numBoldInterest {
        display: inline-block;
        width: 300px;
        color: #2e47ff;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox4L .numBoldCaution {
        display: inline-block;
        width: 300px;
        color: #fff100;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox4L .numBoldBoundary {
        display: inline-block;
        width: 300px;
        color: #f67b00;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox4L .numBoldSerious {
        display: inline-block;
        width: 300px;
        color: #fe022e;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox4L .numBoldNone {
        display: inline-block;
        width: 300px;
        color: #7a8d98;
        font-size: 36px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBox4L .sensorCheck {
        display: block;
        width: 160px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 22px;
        cursor: pointer;
        margin: 0 auto;
    }

    .sensorInfoBox5L {
        display: inline-block;
        background-color: #1b2b38;
        border-radius: 10px;
        color: #ffffff;
        padding: 40px;
        margin: 5px 5px;
        position: relative; /* min-width: 1870px; min-height: 1390px; */ /* width: 1870px; height: 1390px; */
        width: 100%;
        height: 100%;
    }

    .sensorInfoBox5L .sensorTopBox {
        display: inline-flex;
        width: 100%;
    }
    .sensorInfoBox5L .sensorTitleBox {
        display: block;
        flex-grow: 1;
    }
    .sensorInfoBox5L .sensorTitle1 {
        display: block; /*color: #7b8f9a;*/
        font-size: 40px;
        font-weight: 500;
        letter-spacing: -1px;
    }

    .sensorInfoBox5L .sensorStepNormal {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #17c572;
    }
    .sensorInfoBox5L .sensorStepInterest {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #2e47ff;
    }
    .sensorInfoBox5L .sensorStepCaution {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #fff100;
    }
    .sensorInfoBox5L .sensorStepBoundary {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #f67b00;
    }
    .sensorInfoBox5L .sensorStepSerious {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #fe022e;
    }
    .sensorInfoBox5L .sensorStepNone {
        display: block;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #223641;
    }

    .sensorInfoBox5L .sensorText0 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 50px;
        top: 188px;
    }
    .sensorInfoBox5L .sensorText3 {
        display: inline-block;
        color: #7b8f9a;
        font-size: 14px;
        font-weight: 900;
        position: absolute;
        left: 150px;
        top: 94px;
    }

    .sensorInfoBox5L .chartArea {
        /* display: flex; flex-direction: column; */ /* height: 58%; */
        display: block;
        height: 90%;
    }
    .sensorInfoBox5L .chartArea .chartBox {
        display: block;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        margin-top: 14px;
    }

    .sensorInfoBox5L .chartSkills {
        margin: 0 auto;
        padding: 0;
        list-style-type: none;
        overflow: hidden;
        position: relative;
        width: 800px;
        height: 400px;
        margin-top: 14%;
        /* padding-top:20px; padding-left: 14px; */
        padding-right: 14px;
        font-size: 10px;
    }
    .sensorInfoBox5L .chartSkills *,
    .sensorInfoBox5L .chartSkills::before {
        box-sizing: border-box;
    }

    .sensorInfoBox5L .backNormal.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 50px solid rgba(51, 78, 87, 0.3);
        border-bottom: none;
        border-top-left-radius: 400px;
        border-top-right-radius: 400px;
    }
    .sensorInfoBox5L .backInterest.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 50px solid rgba(46, 71, 255, 1);
        border-bottom: none;
        border-top-left-radius: 400px;
        border-top-right-radius: 400px;
    }
    .sensorInfoBox5L .backCaution.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 50px solid rgba(255, 241, 0, 1);
        border-bottom: none;
        border-top-left-radius: 400px;
        border-top-right-radius: 400px;
    }
    .sensorInfoBox5L .backBoundary.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 50px solid rgba(246, 123, 0, 1);
        border-bottom: none;
        border-top-left-radius: 400px;
        border-top-right-radius: 400px;
    }
    .sensorInfoBox5L .backSerious.chartSkills::before {
        position: absolute;
        content: "";
        width: inherit;
        height: inherit;
        border: 50px solid rgba(254, 2, 46, 1);
        border-bottom: none;
        border-top-left-radius: 400px;
        border-top-right-radius: 400px;
    }

    .sensorInfoBox5L .chartSkills li {
        position: absolute;
        top: 101%; /* left: 10%; */
        width: 800px;
        height: 400px;
        border: 50px solid;
        border-top: none;
        border-bottom-left-radius: 400px;
        border-bottom-right-radius: 400px;
        transform-origin: 50% 0;
        padding-left: 10px;
        padding-right: 10px;
    }

    .sensorInfoBox5L .figureSignNormal {
        display: inline-block;
        background: url(${stickNormal3L}) no-repeat;
        width: 288px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 280px;
        left: 20%;
        top: 58%;
        transform-origin: 250px 60px;
    }
    .sensorInfoBox5L .figureSignInterest {
        display: inline-block;
        background: url(${stickBlue3L}) no-repeat;
        width: 288px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 280px;
        left: 20%;
        top: 58%;
        transform-origin: 250px 60px;
    }
    .sensorInfoBox5L .figureSignCaution {
        display: inline-block;
        background: url(${stickYellow3L}) no-repeat;
        width: 288px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 280px;
        left: 20%;
        top: 58%;
        transform-origin: 250px 60px;
    }
    .sensorInfoBox5L .figureSignBoundary {
        display: inline-block;
        background: url(${stickOrange3L}) no-repeat;
        width: 288px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 280px;
        left: 20%;
        top: 58%;
        transform-origin: 250px 60px;
    }
    .sensorInfoBox5L .figureSignSerious {
        display: inline-block;
        background: url(${stickRed3L}) no-repeat;
        width: 288px;
        height: 143px;
        position: absolute;
        background-position: right;
        background-size: 280px;
        left: 20%;
        top: 58%;
        transform-origin: 250px 60px;
    }

    .sensorInfoBox5L .figure {
        display: flex;
        width: 800px;
        height: 76px;
        background-color: #334e57;
        border-radius: 3px;
        margin: 0 auto;
        font-size: 40px;
        padding: 2px 10px;
        margin-top: 140px;
        margin-bottom: 10px;
        align-items: center;
    }

    .sensorInfoBox5L .figureType {
        display: block;
        width: 52%;
        text-align: center;
    }
    .sensorInfoBox5L .figure .sensorName {
        display: block;
        width: 340px;
        text-align: center;
        font-size: 40px;
    }

    .sensorInfoBox5L .line {
        display: inline-block;
        width: 1px;
        height: 16px;
        border-right: solid 1.5px #090909;
        margin-left: 10px;
        margin-right: 10px;
    }
    .sensorInfoBox5L .numBoldNormal {
        display: inline-block;
        width: 340px;
        color: #16ca73;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox5L .numBoldInterest {
        display: inline-block;
        width: 340px;
        color: #2e47ff;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox5L .numBoldCaution {
        display: inline-block;
        width: 340px;
        color: #fff100;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox5L .numBoldBoundary {
        display: inline-block;
        width: 340px;
        color: #f67b00;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox5L .numBoldSerious {
        display: inline-block;
        width: 340px;
        color: #fe022e;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .sensorInfoBox5L .numBoldNone {
        display: inline-block;
        width: 340px;
        color: #7a8d98;
        font-size: 40px;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .sensorInfoBox5L .sensorCheck {
        display: block;
        width: 240px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        background-image: linear-gradient(#434343, #000000);
        border-radius: 24px;
        font-size: 40px;
        cursor: pointer;
        margin: 0 auto;
    }

    .sensorInfoGrid {
        width: 100%;
        height: 100%;
        min-height: 410px;
        display: grid;
        padding-right: 20px;
        padding-bottom: 20px;
        grid-gap: 10px;
        grid-template-rows: 50% 50%;
        grid-template-columns: 50% 50%;
    }

    .sensorInfoNoGrid {
        width: 100%;
        height: 100%;
        min-height: 410px;
        padding-right: 20px;
        padding-bottom: 20px;
    }

    .sensorInfoGrid .sensorGrid1 {
        grid-column: 1;
        grid-row: 1;
        position: relative;
    }
    .sensorInfoGrid .sensorGrid1.full {
        width: calc(200% + 10px); /* height: calc(200% + 10px); */
    }
    .sensorInfoGrid .sensorGrid1.hidden {
        display: none;
    }

    .sensorInfoGrid .sensorGrid2 {
        grid-column: 2;
        grid-row: 1;
        position: relative;
    }
    .sensorInfoGrid .sensorGrid2.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px); /* height: calc(200% + 10px); */
    }
    .sensorInfoGrid .sensorGrid2.hidden {
        display: none;
    }

    .sensorInfoGrid .sensorGrid3 {
        grid-column: 1;
        grid-row: 2;
        position: relative;
    }
    .sensorInfoGrid .sensorGrid3.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px); /* height: calc(200% + 10px); */
    }
    .sensorInfoGrid .sensorGrid3.hidden {
        display: none;
    }

    .sensorInfoGrid .sensorGrid4 {
        grid-column: 2;
        grid-row: 2;
        position: relative;
    }
    .sensorInfoGrid .sensorGrid4.full {
        grid-column: 1;
        grid-row: 1;
        width: calc(200% + 10px); /* height: calc(200% + 10px); */
    }
    .sensorInfoGrid .sensorGrid4.hidden {
        display: none;
    }

    /* 페이징 */
    .sensorPaging {
        text-align: center;
    }
    .pagination {
        list-style: none;
        display: inline-block;
        padding: 0;
        margin-top: 2px;
    }
    .pagination li {
        display: inline;
        text-align: center;
    }
    .pagination a {
        width: 30px;
        height: 30px;
        float: left;
        display: block;
        font-size: 10px;
        text-decoration: none;
        padding: 5px 8px;
        color: #96a0ad;
        line-height: 1.5;
    }
    .pagination a:hover {
        color: #ffffff;
    }
    .left:hover,
    .right:hover {
    }
    .pagination a.active {
        cursor: default;
        color: #ffffff;
    }
    .pagination a:active {
        outline: none;
    }
    .modal .num {
        margin-left: 3px;
        padding: 0;
        width: 30px;
        height: 30px;
        line-height: 30px;
    }
    .modal .num:hover {
        color: #ffffff;
    }
    .modal .num.active,
    .modal .num:active {
        /* background-color: #ef8019; */
        color: #ef8019;
        cursor: pointer;
    }

    .arrowLeft {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${arrowOrangeLeft}) no-repeat;
        background-size: 22px;
        margin-right: 12px;
        background-position: center;
    }
    .arrowLeft:hover {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${arrowOrangeLeft}) no-repeat;
        background-size: 22px;
        margin-right: 12px;
        background-position: center;
    }
    .arrowRight {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${arrowOrangeRight}) no-repeat;
        background-size: 22px;
        margin-left: 12px;
        background-position: center;
    }
    .arrowRight:hover {
        display: inline-block;
        width: 30px;
        height: 30px;
        background: url(${arrowOrangeRight}) no-repeat;
        background-size: 22px;
        margin-left: 12px;
        background-position: center;
    }

    /* 관심단계 */
    .dangerSteps {
        display: flex; /* width: 350px; */ /* height:30px; */
        height: 7%;
        line-height: 30px;
        justify-content: center;
        background-color: #1b2b38;
        border-radius: 6px;
        margin: 2px 14px;
        align-items: center;
        /* position: absolute;
        bottom: 10px;
        width: 100%;
        margin 10px; */
    }
    .dangerSteps .normal {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        text-align: center;
        margin-right: 10px;
    }
    .dangerSteps .normal2L {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        margin-right: 14px;
    }
    .dangerSteps .normal3L {
        color: #fff;
        display: inline-block;
        font-size: 22px;
        text-align: center;
        margin-right: 18px;
    }
    .dangerSteps .normal4L {
        color: #fff;
        display: inline-block;
        font-size: 28px;
        text-align: center;
        margin-right: 22px;
    }
    .dangerSteps .normal5L {
        color: #fff;
        display: inline-block;
        font-size: 34px;
        text-align: center;
        margin-right: 26px;
    }

    .dangerSteps .interest {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        text-align: center;
        margin-right: 10px;
    }
    .dangerSteps .interest2L {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        margin-right: 14px;
    }
    .dangerSteps .interest3L {
        color: #fff;
        display: inline-block;
        font-size: 22px;
        text-align: center;
        margin-right: 18px;
    }
    .dangerSteps .interest4L {
        color: #fff;
        display: inline-block;
        font-size: 28px;
        text-align: center;
        margin-right: 22px;
    }
    .dangerSteps .interest5L {
        color: #fff;
        display: inline-block;
        font-size: 34px;
        text-align: center;
        margin-right: 26px;
    }

    .dangerSteps .caution {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        text-align: center;
        margin-right: 10px;
    }
    .dangerSteps .caution2L {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        margin-right: 14px;
    }
    .dangerSteps .caution3L {
        color: #fff;
        display: inline-block;
        font-size: 22px;
        text-align: center;
        margin-right: 18px;
    }
    .dangerSteps .caution4L {
        color: #fff;
        display: inline-block;
        font-size: 28px;
        text-align: center;
        margin-right: 22px;
    }
    .dangerSteps .caution5L {
        color: #fff;
        display: inline-block;
        font-size: 34px;
        text-align: center;
        margin-right: 26px;
    }

    .dangerSteps .boundary {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        text-align: center;
        margin-right: 10px;
    }
    .dangerSteps .boundary2L {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        margin-right: 14px;
    }
    .dangerSteps .boundary3L {
        color: #fff;
        display: inline-block;
        font-size: 22px;
        text-align: center;
        margin-right: 18px;
    }
    .dangerSteps .boundary4L {
        color: #fff;
        display: inline-block;
        font-size: 28px;
        text-align: center;
        margin-right: 22px;
    }
    .dangerSteps .boundary5L {
        color: #fff;
        display: inline-block;
        font-size: 34px;
        text-align: center;
        margin-right: 26px;
    }

    .dangerSteps .serious {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        text-align: center;
        margin-right: 10px;
    }
    .dangerSteps .serious2L {
        color: #fff;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        margin-right: 14px;
    }
    .dangerSteps .serious3L {
        color: #fff;
        display: inline-block;
        font-size: 22px;
        text-align: center;
        margin-right: 18px;
    }
    .dangerSteps .serious4L {
        color: #fff;
        display: inline-block;
        font-size: 28px;
        text-align: center;
        margin-right: 22px;
    }
    .dangerSteps .serious5L {
        color: #fff;
        display: inline-block;
        font-size: 34px;
        text-align: center;
        margin-right: 26px;
    }

    .dangerSteps .normalCircle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #17c572;
        margin-right: 8px;
    }
    .dangerSteps .normalCircle2L {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #17c572;
        margin-right: 8px;
    }
    .dangerSteps .normalCircle3L {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #17c572;
        margin-right: 8px;
    }
    .dangerSteps .normalCircle4L {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #17c572;
        margin-right: 8px;
    }
    .dangerSteps .normalCircle5L {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #17c572;
        margin-right: 8px;
    }

    .dangerSteps .interestCircle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #2e47ff;
        margin-right: 8px;
    }
    .dangerSteps .interestCircle2L {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #2e47ff;
        margin-right: 8px;
    }
    .dangerSteps .interestCircle3L {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #2e47ff;
        margin-right: 8px;
    }
    .dangerSteps .interestCircle4L {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #2e47ff;
        margin-right: 8px;
    }
    .dangerSteps .interestCircle5L {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #2e47ff;
        margin-right: 8px;
    }

    .dangerSteps .cautionCircle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff100;
        margin-right: 8px;
    }
    .dangerSteps .cautionCircle2L {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #fff100;
        margin-right: 8px;
    }
    .dangerSteps .cautionCircle3L {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fff100;
        margin-right: 8px;
    }
    .dangerSteps .cautionCircle4L {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #fff100;
        margin-right: 8px;
    }
    .dangerSteps .cautionCircle5L {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #fff100;
        margin-right: 8px;
    }

    .dangerSteps .boundaryCircle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #f67b00;
        margin-right: 8px;
    }
    .dangerSteps .boundaryCircle2L {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #f67b00;
        margin-right: 8px;
    }
    .dangerSteps .boundaryCircle3L {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #f67b00;
        margin-right: 8px;
    }
    .dangerSteps .boundaryCircle4L {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #f67b00;
        margin-right: 8px;
    }
    .dangerSteps .boundaryCircle5L {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #f67b00;
        margin-right: 8px;
    }

    .dangerSteps .seriousCircle {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fe022e;
        margin-right: 8px;
    }
    .dangerSteps .seriousCircle2L {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: #fe022e;
        margin-right: 8px;
    }
    .dangerSteps .seriousCircle3L {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #fe022e;
        margin-right: 8px;
    }
    .dangerSteps .seriousCircle4L {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #fe022e;
        margin-right: 8px;
    }
    .dangerSteps .seriousCircle5L {
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #fe022e;
        margin-right: 8px;
    }
`;


/**********************************************************************/
// 수동신고

export const _ManualReportComponent = {
    Hydrogen: {
        height: '417px !important',
        fontSize: '14px',
        borderRadius: '5px !important',
        inputBackground: 'var(--navy-color)',
        tblManuelHeight: '28px !important',
        tblNoneePadding: '6px',
        tblNoneeWidth: '110px',
        menualTextareaHeight: '90px',
        menualTextareaPadding: '5px',
        uiCalWidth: '318px !important',
        middlePoint: '6px',
        btnCalendarSize: '12px',
        btnCalendarXY: '7px',
        btnOrangeBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        btnOrangeWidth: '68px',
        btnOrangeHeight: '28px',
        btnOrangeLineHeight: '26px',
        btnNavyBorderBackground: 'var(--navy-color)',
        btnNavyBorderBorder: '1px solid #FFFFFF1A',
        alignCTextAlign: 'right',
        alignCPaddingRight: '5px',
    },
}

export const ManualReportComponent = styled(PopupsCommon)`
    position: absolute;
    left: 840px;
    top: 400px;
    height: ${_ManualReportComponent[PR.styleMode].height};

    .viewDashboardManuelConts {
        clear: both;
        width: 450px;
        height: 470px;
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .manuelTop {
        background: ${_ManualReportComponent[PR.styleMode].manuelTopBackground};
        padding: ${_PopupsCommon[PR.styleMode].dslTopPadding};
        position: relative;
        /* border-radius: 4px 4px 0px 0px; */
        -webkit-border-radius: ${_PopupsCommon[PR.styleMode].dslTopBorderRadius};
        -moz-border-radius: ${_PopupsCommon[PR.styleMode].dslTopBorderRadius};
        border-radius: ${_PopupsCommon[PR.styleMode].dslTopBorderRadius};
    }

    .boxTypeBlue {
        background: #162235;
        font-size: ${_ManualReportComponent[PR.styleMode].fontSize};
    }

    .boxTypeBluee {
        background-color: rgba(37, 44, 60, 0);
        padding: 15px;
    }

    table.tblNonee tbody td {
        border-bottom: 0px dashed #3b3f5c;
        padding: ${_ManualReportComponent[PR.styleMode].tblNoneePadding};
        color: #fff;
        font-weight: 300;
        vertical-align: middle;
        width: ${_ManualReportComponent[PR.styleMode].tblNoneeWidth};
    }

    .tblManuel input,
    .tblManuel select {
        height: ${_ManualReportComponent[PR.styleMode].tblManuelHeight};
        line-height: ${_ManualReportComponent[PR.styleMode].tblManuelHeight};
    }

    .tel3col {
        clear: both;
    }

    .tel3col li:first-child {
        width: 45%;
        float: left;
        margin-right: 2%;
    }

    .tel3col li {
        width: 25%;
        float: left;
        margin-right: 2%;
    }

    /* .tel3col li:first-child {
        position: relative;
        padding-right: 15px;
        margin-right: 0;
    } */

    .tel3col li:first-child span {
        position: absolute;
        right: 0;
        top: 30%;
        width: 15px;
        display: inline-block;
        text-align: center;
    }

    .tel3col li:last-child {
        margin-right: 0%;
    }

    .tel3colSpan{
        background: #0E162D;
        width: 100%;
        height: 28px !important;
        line-height: 28px;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        font-size: 14px;
        padding-left: 8px;
    }

    .tel3colSpan > p{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    } 

    .buildingGroupText{
        background: var(--navy-color);
        width: 100%;
        height: 28px !important;
        line-height: 28px;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        font-size: 14px;
        padding-left: 8px;
    }

    .buildingBlankText{
        background: var(--navy-color);
        width: 100%;
        height: 28px !important;
        line-height: 28px;
        border-radius: 5px;
        border: none !important;
        color: #fff;
        font-size: 14px;
        padding-left: 8px;
    }

    .calNormal {
        position: relative;
    }

    .calNormal button {
        position: absolute;
        right: 10px;
        width: 20px;
        height: auto;
        min-height: 38px;
        text-indent: -9999px;
        vertical-align: middle;
    }

    input.uiCal {
        background: ${_ManualReportComponent[PR.styleMode].inputBackground};
        height: 50px;
        border: none;
        border-radius: ${_ManualReportComponent[PR.styleMode].borderRadius};
        width: ${_ManualReportComponent[PR.styleMode].uiCalWidth};
        color: #fff;
    }

    .w100p {
        width: 100% !important;
    }

    .btnCalendar {
        width: ${_ManualReportComponent[PR.styleMode].btnCalendarSize};
        height: ${_ManualReportComponent[PR.styleMode].btnCalendarSize};
        display: inline-block;
        position: absolute;
        right: ${_ManualReportComponent[PR.styleMode].btnCalendarXY};
        top: ${_ManualReportComponent[PR.styleMode].btnCalendarXY};
    }

    .timeArea {
        display: flex; /* z-index:1; */
        position: absolute;
        top: 0;
        right: 40px;
    }

    .timeHour > select {
        background: ${_ManualReportComponent[PR.styleMode].inputBackground};
        color: #fff;
        border: none;
        text-align: center;
    }

    .middlePoint {
        margin-top: ${_ManualReportComponent[PR.styleMode].middlePoint};
    }

    .timeMinute > select {
        background: ${_ManualReportComponent[PR.styleMode].inputBackground};
        color: #fff;
        border: none;
    }

    .blueInput {
        background: ${_ManualReportComponent[PR.styleMode].inputBackground};
        width: 100%;
        height: 50px !important;
        border-radius: 5px !important;
        border: none !important;
        color: #fff;
    } /*0721 수정*/

    .blueInput td {
        padding-left: 10px;
    }

    input.blueInput::-ms-input-placeholder {
        color: #fff;
    }

    input.blueInput::-webkit-input-placeholder {
        color: #fff;
    }

    input.blueInput::-moz-placeholder {
        color: #fff;
    }

    .menualTextarea {
        background: ${_ManualReportComponent[PR.styleMode].inputBackground};
        border: none;
        border-radius: ${_ManualReportComponent[PR.styleMode].borderRadius};
        color: #fff;
        max-height: ${_ManualReportComponent[PR.styleMode].menualTextareaHeight};
        min-height: ${_ManualReportComponent[PR.styleMode].menualTextareaHeight};
        padding: ${_ManualReportComponent[PR.styleMode].menualTextareaPadding};
    }

    .alignC {
        text-align: ${_ManualReportComponent[PR.styleMode].alignCTextAlign};
        margin-left: 15px;
        padding-right: ${_ManualReportComponent[PR.styleMode].alignCPaddingRight};
    }

    .btnOrange {
        background: ${_ManualReportComponent[PR.styleMode].btnOrangeBackground};
        border-radius: ${_ManualReportComponent[PR.styleMode].borderRadius};
        width: ${_ManualReportComponent[PR.styleMode].btnOrangeWidth};
        height: ${_ManualReportComponent[PR.styleMode].btnOrangeHeight};
        line-height: ${_ManualReportComponent[PR.styleMode].btnOrangeLineHeight};
        text-align: center;
        color: #fff;
        display: inline-block;
        margin-right: 8px;
        cursor: pointer;
    } /* 0111 */

    .btnOrange:hover {
        cursor: pointer;
    }

    .btnNavyBorder {
        background: ${_ManualReportComponent[PR.styleMode].btnNavyBorderBackground};
        border: ${_ManualReportComponent[PR.styleMode].btnNavyBorderBorder};
        border-radius: ${_ManualReportComponent[PR.styleMode].borderRadius};
        width: ${_ManualReportComponent[PR.styleMode].btnOrangeWidth};
        height: ${_ManualReportComponent[PR.styleMode].btnOrangeHeight};
        line-height: ${_ManualReportComponent[PR.styleMode].btnOrangeLineHeight};
        text-align: center;
        color: #fff;
        display: inline-block;
        cursor: pointer;
    } /* 0111 */
    
    .btnNavyBorder:hover {
        cursor: pointer;
    }
`;


/**********************************************************************/
// 정보

export const _BuildingInfoComponent = {
    Hydrogen: {
        textColor: '#fff',
        fontSize: '14px',
        fontWeight: '400',
        padding: '12px 20px',
        liDotFontSize: '12px',
        viewBuildingContsPadding: '6px 0 6px 15px',
        viewBuildingContsUlLiFontSize: '14px',
        viewBuildingContsUlLiDisplay: 'flex',
        viewBuildingContsUlLiLetterSpacing: '0.7px',
        buildingInfoWidth: '331px !important',
        liDotBeforeContent: '◆',
        viewBuildingTitleletterSpacing: '0.7px',
    },
}


export const BuildingInfoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 10px;
    top: 720px;
    /* width: 320px; */
    width: ${_BuildingInfoComponent[PR.styleMode].buildingInfoWidth};
    height: 210px;
    overflow: hidden;

    .viewBuildingConts {
        clear: both;
        overflow-y: auto;
        /*overflow-y:auto;*/
        height: calc(100% - 32px);
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .viewBuildingTitleBox{
        border: dashed 1px red; 
    }

    .viewBuildingTitle {
        border-bottom: 1px dashed #3b3f5c;
        color: ${_BuildingInfoComponent[PR.styleMode].textColor};
        padding: ${_BuildingInfoComponent[PR.styleMode].padding};
        font-size: ${_BuildingInfoComponent[PR.styleMode].fontSize};
        font-weight: ${_BuildingInfoComponent[PR.styleMode].fontWeight};
        letter-spacing: ${_BuildingInfoComponent[PR.styleMode].viewBuildingTitleletterSpacing};
    }

    .viewBuildingList {
    }

    .viewBuildingConts ul {
        padding: ${_BuildingInfoComponent[PR.styleMode].padding};
    }

    .viewBuildingConts ul li {
        position: relative;
        padding: ${_BuildingInfoComponent[PR.styleMode].viewBuildingContsPadding};
        line-height: 120%;
        font-weight: 300;
        font-size: 14px;
        display: ${_BuildingInfoComponent[PR.styleMode].viewBuildingContsUlLiDisplay};
        letter-spacing: ${_BuildingInfoComponent[PR.styleMode].viewBuildingContsUlLiLetterSpacing};
    }

    .liDot {
        color: #fff;
        font-size: ${_BuildingInfoComponent[PR.styleMode].liDotFontSize};
    }

    .liDot:before {
        /* content: "○"; */
        content: "${_BuildingInfoComponent[PR.styleMode].liDotBeforeContent}";
        color: #fff;
        font-size: 9px;
        position: absolute;
        left: 0;
        top: 6px;
    }

    .liNoDot {
        color: #fff;
        font-size: 12px;
    }

    .facilityInfoTitle{
        display: block;
        /*width: 94px;*/
        text-align-last: justify;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .facilitySemiclone{
        /* padding-right: 20px;
        padding-left: 20px; */
        padding-right: 10px;
        padding-left: 10px;
    }

    .facilityInfoConts{
        display: block;
        /*width: 150px; */
    }
`;


/**********************************************************************/
// 센서정보창

export const SensorInfoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 5%;
    top: 720px;
    /* width: 320px; */
    width: 320px !important;
    height: 160px !important;
    border-radius: 8px;
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    overflow: hidden;
    border: none;

    /* &::before{
        content: '';
        display: inline-block;
        width: 320px;
        height: 160px;
        background: url(${information_background})no-repeat center center;
        background-size: cover;
        opacity: 0.15;
        position: absolute;
        left: 0;
        top: 0;
    } */

    .sensorInfoTitle{
        display: flex;
        align-items: center;
        height: 44px;
        padding: 12px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        border-radius: 8px 8px 0 0;
        
        > h5{
            color: #B6C6D2 !important;
        }
    }

    .viewBuildingConts {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        height: 116px;
        padding: 12px;
        padding-bottom: 10px;
        box-sizing: border-box;

        &::before{
            content: '';
            display: inline-block;
            width: 320px;
            height: 116px;
            background: url(${infor_background_noTitle})no-repeat center center;
            background-size: cover;
            opacity: 0.15;
            position: absolute;
            left: 0;
            top: 44px;
        }

        > span{
            color: #FFF;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
            text-align: left;
            margin-bottom: 12px;
            padding-left: 4px;
            position: relative;
            z-index: 2;

            &::before{
                display: inline-block;
                content: '';
                background: url(${rectangle_icon})no-repeat center center;
                width: 2px;
                height: 2px;
                color: #fff;
                position: absolute;
                left: 0;
                top: 50%;
            }
        }
    }

    .viewBuildingConts ul {
        padding: 12px 20px;
    }

    .viewBuildingConts ul li {
        position: relative;
        padding: 6px 0 6px 15px;
        line-height: 120%;
        font-weight: 300;
        font-size: 14px;
        display: flex;
        letter-spacing: 0.7px; 
    }

    .liDot {
        color: #fff;
        font-size: 12px;
    }

    .liDot:before {
        /* content: "○"; */
        content: "◆";
        color: #fff;
        font-size: 9px;
        position: absolute;
        left: 0;
        top: 6px;
    }

    .liNoDot {
        color: #fff;
        font-size: 12px;
    }

    .facilityInfoTitle{
        display: block;
        /*width: 94px;*/
        text-align-last: justify;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .facilitySemiclone{
        /* padding-right: 20px;
        padding-left: 20px; */
        padding-right: 10px;
        padding-left: 10px;
    }

    .facilityInfoConts{
        display: block;
        /*width: 150px; */
    }
`;



/**********************************************************************/
// 상황보고

export const _EventDashboardComponent = {
    Hydrogen: {
        positionTop: '80px',
        width: '981px',
        height: '30px',
        lineHeight: '28px',
        fontSize: '14px',
        color: '#FCAAAA !important',
        border: 'solid 1px #FE3333',
        background: '#5D2727',
        eventSideTitleWidth: 'auto',
        eventSideTitlePadding: '0px 10px',
        eventDashboardAlignitems: 'center',
        viewTitleTxtFontWeight: '400',
        viewTitleTxtLetterSpacing: '0px',
    },
}


export const EventDashboardComponent = styled(PopupsCommon)`
    position: absolute;
    margin-left: -450px;
    left: 50%;
    top: ${_EventDashboardComponent[PR.styleMode].positionTop};
    width: ${_EventDashboardComponent[PR.styleMode].width};
    height: ${_EventDashboardComponent[PR.styleMode].height};
    line-height: ${_EventDashboardComponent[PR.styleMode].lineHeight};
    overflow: hidden;
    text-align: center;
    border: ${_EventDashboardComponent[PR.styleMode].border};
    background: ${_EventDashboardComponent[PR.styleMode].background};
    display: flex;
    justify-content: center;
    /* align-items: center; */
    align-items: ${_EventDashboardComponent[PR.styleMode].eventDashboardAlignitems};
    z-index: 2;

    .viewTitleTxt {
        font-size: ${_EventDashboardComponent[PR.styleMode].fontSize};
        /* font-weight: 300; */
        font-weight: ${_EventDashboardComponent[PR.styleMode].viewTitleTxtFontWeight};
        overflow: hidden;
        color: ${_EventDashboardComponent[PR.styleMode].color};
        letter-spacing: ${_EventDashboardComponent[PR.styleMode].viewTitleTxtLetterSpacing};
    }

    .eventSideTitle{
        display: block;
        /* width: 76px; */
        width: ${_EventDashboardComponent[PR.styleMode].eventSideTitleWidth};
        height: 22px;
        line-height: 22px;
        font-size: 14px;
        color: #fff;
        border-radius: 11px;
        background-image: linear-gradient(#FF3333, #801A1A);
        position: absolute;
        left: 27.6px;
        /* padding: '0px 10px'; */
        padding: ${_EventDashboardComponent[PR.styleMode].eventSideTitlePadding};
    }
`;


/**********************************************************************/
// 이벤트 토스트 팝업

export const EventDashboardNewComponent = styled(PopupsCommon)`
    position: absolute;
    margin-left: -350px;
    left: 50%;
    top: 80px;
    width: 600px;
    height: 82px;
    overflow: hidden;
    text-align: center;
    border-radius: 8px;
    background: linear-gradient(180deg, rgba(29, 29, 29, 0.80) 0%, #131313 100%);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.17);
    border: none;
    padding: 20px 20px 20px 72px;
    display: flex;
    align-items: center;
    z-index: 2;

    .eventSideTitle{
        display: inline-block;
        width: 40px;
        height: 40px;
        background: rgba(255, 54, 50, 0.10) url(${alarmBell_icon})no-repeat center center;
        border-radius: 50%;
        border: solid 1px rgba(255, 54, 50, 0.10);
        position: absolute;
        left: 20px;
    }
    
    .viewTitleTxt {
        display: flex;
        flex-direction: column;
        flex: 1;
        text-align: left;
        font-size: 14px;
        font-weight: 400;
        overflow: hidden;
        color: #FCAAAA !important;
        letter-spacing: 0px;

        > span{
            display: flex;
            margin-bottom: 8px;

            &:nth-child(1){
                color: #FFF;
                font-size: 12px;
                font-weight: 500;
            }

            &:nth-child(2){
                color: #FFF;
                font-size: 14px;
                font-weight: 700;
                font-style: normal;
                line-height: 14px;

                > p{
                    color: #FF3632;
                    /* width: 280px; */
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
            }

            &:nth-child(3){
                color: #747D81;
                font-size: 12px;
                font-weight: 500;
                margin-bottom: 0;
            }
        }

        > span:nth-child(2){
            display: flex;
            margin-bottom: 12px;
        }
    }

    .eventClose{
        display: inline-block;
        width: 24px;
        height: 24px;
        background: url(${eventClose})no-repeat center center;
    }
`;



/**********************************************************************/
// 이벤트 알람 발생시 표출되는 창

export const EventFullBoxComponent = styled(PopupsCommon)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: inherit;

    .dangerImage{
        display: inline-block;
        width: 47px;
        height: 42px;
        background: url(${DangerImage}) no-repeat center center;
        margin-bottom: 13px;
    }
    .light1Image{
        display: inline-block;
        width: 442px;
        height: 4px; 
        background: url(${LightLineImage1}) no-repeat center center;
        margin-bottom: 8px;
    }
    .light2Image{
        display: inline-block;
        width: 442px;
        height: 4px; 
        background: url(${LightLineImage2}) no-repeat center center;
        margin-bottom: 11px;
    }
    .eventFullTitle{
        display: block;
        font-size: 40px;
        color: #fff;
        margin-bottom: 11px;
        font-family: Britannic;
        font-weight: 600;
    }
    .eventFullContents{
        display: block;
        font-size: 16px;
        color: #fff;
        margin-bottom: 19px;
        font-family: Bookman Old Style;
        font-weight: 600;
    }
    .eventRedFont{
        color: #FF3939;
    }
    .eventFullBtn{
        display: block;
        width: 69px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        color: #222A31;
        border-radius: 6px; 
        background: linear-gradient(180deg, #FFFFFF, #DBDBDB) no-repeat;
        cursor: pointer;
    }
`;


/**********************************************************************/
// 관제화면에 띄우는 센서정보창 

export const SensorInfoBoxBlue = styled.div`
        /* position: absolute;
        left: 0; */
        display: block;
        width: 95px;
        height: 48px;
        background: url(${SensorInfoBoxBlueImage}) no-repeat;
        padding: 5px 13px; 
        z-index: 99;

    .sensorInfoTitle{
        display: block; 
        height: 14px;
        line-height: 12px; 
        font-size: 12px; 
        font-weight: 500;
        color:  #0085FF;
        border-left: solid 1px  #0085FF;
        padding-left: 5.5px;
        margin-bottom: 10px;
    }
    .sensorInfoContents{
        display: block; 
        font-size: 12px; 
        font-weight: 500;
        color: #fff;
        letter-spacing: 0.6px;
        text-align: right;
    }
`;

export const SensorInfoBoxRed = styled.div`
        position: absolute;
        left: 0;
        top: 50px;
        display: block;
        width: 95px;
        height: 48px;
        background: url(${SensorInfoBoxRedImage}) no-repeat;
        padding: 5px 13px; 
        z-index: 99;

    .sensorInfoTitleR{
        display: block; 
        height: 14px;
        line-height: 12px; 
        font-size: 12px; 
        font-weight: 500;
        color: #FF7070;
        border-left: solid 1px #FF7070;
        padding-left: 5.5px;
        margin-bottom: 10px;
    }
    .sensorInfoContentsR{
        display: block; 
        font-size: 12px; 
        font-weight: 500;
        color: #fff;
        letter-spacing: 0.6px;
        text-align: right;
    }
`;


/**********************************************************************/
// 이벤트 정보

export const _EventComponent = {
    Hydrogen: {
        alarmListMarginTop: '10px',
        dseTitleFontSize: '14px',
        dseTitleFontWeight: '400',
        dseTopThBackground: 'var(--navy-color)',
        dseTopThFontSize: '11px',
        dseTopThBorder: '0.5px dashed #707070',
        dseTopThPadding: '5px',
        dseTbTdSpanRedColor: '#EB4242',
        dseInfoEmSize: '58px',
        dseInfoEmRadius: '0%',
        dseInfoEmBackSize: '100% !important',
        eventIconBoxLiBackground: 'var(--navy-color)',
        eventIconBoxLiBorder: '1px solid #FFFFFF1A',
        eventIconBoxLiBorderRadius: '3px',
        eventIconBoxLiPadding: '3px 3px',
        eventIconBoxEIconHeight: '20px',
        eventIconBoxEIcon1: `url(${wonik_sopIcon}) no-repeat `,
        eventIconBoxEIcon2: `url(${wonik_event_sreenIcon}) no-repeat`,
        eventIconBoxEIcon3: `url(${wonik_event_soundOff}) no-repeat`,
        eventIconBoxEIcon4: `url(${wonik_event_soundIcon}) no-repeat`,
        eventIconBoxEIcon5: `url(${wonik_event_menoIcon}) no-repeat`,
        eventIconBoxEIcon6: `url(${wonik_event_endIcon}) no-repeat`,
        eventIconBoxLiFontSize: '12px',
        eventIconBoxMarginRight: '10px',
        eventIconBoxMarginTop: '20px',
        dseInfoEvtFIRE: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtPSM: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtSVMS: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtEnvironment: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtManufacture: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtBecon: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtPressure: `url(${hydrogenEventPressureIcon}) no-repeat center center`,
        dseInfoEvtTemperature: `url(${hydrogenEventTemperatureIcon}) no-repeat center center`,
        dseInfoEvtFlowRate: `url(${hydrogenEventFlowRateIcon}) no-repeat center center`,
        dseInfoEvtFire: `url(${hydrogenEventFireIcon}) no-repeat center center`,
        dseInfoEvtGas: `url(${hydrogenEventGasIcon}) no-repeat center center`,
        dseInfoEvtShutoff: `url(${hydrogenEventShutoffIcon}) no-repeat center center`,

        eventAlarmActiveIcon: `url(${hydrogenEventAlarmActiveIcon}) no-repeat center center`,
        eventAlarmDisableIcon: `url(${hydrogenEventAlarmDisableIcon}) no-repeat center center`,

        dseInfoPMarginLeft: '15px',
        dseInfoDivPaddingTop: '10px',
        dseTopThLetterSpacing: '0.6px',
        dseTopTdLineHeight: '14px',

        dseInfoPFontWeight: 'bold',
        dseInfoPLetterSpacing: '0.6px',
        scrollTableWidth: '100%',
        dseTbTrBackgroundHover: '#426372',
        dseTbHeight: '245px',
        eventInfoMinHeight: '527px',
        eventInfoWidth: '523px !important',
        eventInfoHeight: '549px !important',
        dseTbTdLastChildBorder: 'dashed 1px #fff'
    },
}

export const EventComponent = styled(PopupsCommon)`
    position: absolute;
    right: 10px;
    top: 130px;
    /* width: 360px; */
    width: ${_EventComponent[PR.styleMode].eventInfoWidth};
    height: ${_EventComponent[PR.styleMode].eventInfoHeight};
    min-height: ${_EventComponent[PR.styleMode].eventInfoMinHeight};
    box-sizing: border-box;

    .viewDashboardEventConts {
        padding: 10px 10px;
        box-sizing: border-box;
    }

    .viewDashboardEventList {
        position: relative;
        clear: both;
        margin-top: 10px;
    }

    .viewDashboardEventcare {
        width: 85px;
        position: absolute;
        left: 0;
        top: 0;
    }

    .viewDashboardEventcare span {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        background: #fff;
        border-radius: 100%;
        margin: 0 auto;
    }

    .viewDashboardEventInfo {
        padding-left: 85px;
    }

    .viewDashboardEventInfo li {
        float: left;
        color: #fff;
        width: 50%;
        height: 30px;
        font-size: 14px;
    }

    .viewDashboardEventInfo .viewDashboardEventBtn {
        clear: both;
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        text-align: center;
        border-radius: 5px;
        background: #6281e6;
    }

    .viewDashboardEventInfo .viewDashboardEventBtn a {
        display: block;
    }

    .viewDashboardEvent table.tblA th {
        font-size: 14px;
        padding-left: 10px;
        padding-right: 10px;
        vertical-align: middle;
    }

    .viewDashboardEvent table.tblA td {
        font-size: 13px;
    }

    .dslContEvent {
        display: flex;
        flex-direction: column;
        padding: ${_PopupsCommon[PR.styleMode].dslContEventPadding};
        /* background: ${_PopupsCommon[PR.styleMode].dslContBackground}; */
        /* height: ${_PopupsCommon[PR.styleMode].dslContHeight}; */
        height: 94%;
    }

    .dslContEvent .alarmList {
        overflow-y: hidden;
        flex: 1;
        /* height: 50%; */
        margin-top: ${_EventComponent[PR.styleMode].alarmListMarginTop};
    }

    .dslContEvent .alarmList .alarmListTop {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        /* border-right: solid 10px transparent; */
    }

    .dslCont .alarmDetail {
        /* height: 172px; */
        overflow-y: hidden;
        margin-top: 4px;

        height: 50%;
        display: inline-flex;
        justify-content: flex-end;
    }

    .dseTitle {
        font-size: ${_EventComponent[PR.styleMode].dseTitleFontSize};
        color: ${_WeatherInfoComponent[PR.styleMode].dslInfoDtH5Color};
        font-weight: ${_EventComponent[PR.styleMode].dseTitleFontWeight};
        margin-bottom: 5px;
        font-family: ${_PopupsCommon[PR.styleMode].fontFamily};
    }

    .dseTop {
        /* border-right: solid 5px transparent; */
        /*border-right: solid 10px rgba(108,108,108,0.5);*/
        font-family: ${_PopupsCommon[PR.styleMode].fontFamily};
    }

    /* .dseTop thead th:first-child {
        border-radius: 5px 0 0 0;
    }

    .dseTop thead th:last-child {
        border-radius: 0 5px 0 0;
    }

    .dseTop thead tr {
        border-radius: 5px 5px 0 0;
    } */

    .dseTop th {
        color: #fff;
        text-align: center;
        font-size: ${_EventComponent[PR.styleMode].dseTopThFontSize};
        border: ${_EventComponent[PR.styleMode].dseTopThBorder};
        border-bottom: none;
        padding: ${_EventComponent[PR.styleMode].dseTopThPadding};
        line-height: 1.2em;
        background: ${_EventComponent[PR.styleMode].dseTopThBackground};
        font-weight: 300;
        letter-spacing: ${_EventComponent[PR.styleMode].dseTopThLetterSpacing};
    }

    .dseTb {
        position: relative;
        min-height: calc(100% - 70px);
        border-bottom: ${_EventComponent[PR.styleMode].dseTopThBorder};
        font-family: ${_PopupsCommon[PR.styleMode].fontFamily};
        border: ${_PopupsCommon[PR.styleMode].dseTbBorder};
        width: ${_PopupsCommon[PR.styleMode].dseTbWidth};
        height: ${_EventComponent[PR.styleMode].dseTbHeight};
    }

    .dseTb td {
        color: #fff;
        text-align: center;
        font-size: ${_EventComponent[PR.styleMode].dseTopThFontSize};
        border: ${_EventComponent[PR.styleMode].dseTopThBorder};
        /* border-bottom: none; */
        padding: ${_EventComponent[PR.styleMode].dseTopThPadding};
        /* line-height: 1.2em; */
        line-height: ${_EventComponent[PR.styleMode].dseTopTdLineHeight};
        font-weight: 300;
        vertical-align: middle;
        position: relative;
        letter-spacing: ${_EventComponent[PR.styleMode].dseTopThLetterSpacing};
    }

    .dseTb td:last-child{
        margin-right:10px;
    }

    .memoText{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .dseTb td span.grn {
        color: #6beb1a;
        font-weight: 500;
    }

    .dseTb td span.red {
        color: ${_EventComponent[PR.styleMode].dseTbTdSpanRedColor};
        font-weight: 500;
    }

    .dseTb tr:nth-last-child(1) {
       /* border-bottom: ${_EventComponent[PR.styleMode].dseTopThBorder}; */
    }

    .dseTb tr:hover {
       /* background: #273040; */
       background: ${_EventComponent[PR.styleMode].dseTbTrBackgroundHover};
    }

    .width_10Pro {
        width: 10%;
    }
    .width_12Pro {
        width: 12%;
    }
    .width_13Pro {
        width: 13%;
    }
    .width_15Pro {
        width: 15%;
    }
    .width_20Pro {
        width: 20%;
    }
    .width_25Pro {
        width: 25%;
    }
    .width_100px {
        width: 100px;
    }

    .scrollTable {
        /* width: calc(100% - 10px); */
        width: ${_EventComponent[PR.styleMode].scrollTableWidth};
        /* height: 240px; */
        border:dashed 1px yellow;
    }

    .eventAct {
        display: inline-block;
        position: absolute;
        background-color: rgb(0 143 255);
        color: #fff;
        width: 15px;
        height: 15px;
        left: 3.5px;
        top: 12px;
        z-index: 1;
        text-align: center;
        padding-top: 1.5px;
        padding-right: 0.5px;
        font-size: 10px;
        border-radius: 50%;
        font-weight: 600;
    }

    /* 테이블 알람 아이콘 */
    .eventAlarmActiveIcon{
        display: inline-block;
        width: 24px;
        height: 26px;
        background: url(${hydrogenEventAlarmActiveIcon}) no-repeat center center;
        background-size: 60%;
    }
    .eventAlarmDisableIcon{
        display: inline-block;
        width: 24px;
        height: 26px;
        background: url(${hydrogenEventAlarmDisableIcon}) no-repeat center center;
        background-size: 60%;
    }

    .dseInfo {
        position: relative;
        padding-left: 60px;
        font-family: ${_PopupsCommon[PR.styleMode].fontFamily};
    }

    .dseInfo em {
        display: block;
        width: ${_EventComponent[PR.styleMode].dseInfoEmSize};
        height: ${_EventComponent[PR.styleMode].dseInfoEmSize};
        border-radius: ${_EventComponent[PR.styleMode].dseInfoEmRadius};
        background-size: ${_EventComponent[PR.styleMode].dseInfoEmBackSize};
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -24px;
        /* background-size: cover; */
        text-indent: -9999px;
        /* -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%; */
    }

    .dseInfo em.evtFIRE {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtFIRE};
    }

    .dseInfo em.evtPSM {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtPSM};
    }

    .dseInfo em.evtSVMS {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtSVMS};
    }

    .dseInfo em.evtETC {
        background: url(${dashboard_event_etc}) no-repeat center
        center;
    }

    .dseInfo em.evtEnvironment {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtEnvironment};
    }

    .dseInfo em.evtManufacture {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtManufacture};
    }

    .dseInfo em.evtBecon {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtBecon};
    }

    /* CheongSim in Wonik */
    .dseInfo em.evtLaser {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtLaser};
    }
    
    .dseInfo em.evtDoor {
        background: ${_EventComponent[PR.styleMode].dseInfoEvtDoor};
    }

    /* hydrogen */
    .dseInfo em.evtPressure {
        background: url(${hydrogenEventPressureIcon}) no-repeat center
        center;
    }
    .dseInfo em.evtTemperature {
        background: url(${hydrogenEventTemperatureIcon}) no-repeat center
        center;
    }
    .dseInfo em.evtFlowRate {
        background: url(${hydrogenEventFlowRateIcon}) no-repeat center
        center;
    }
    .dseInfo em.evtFireH {
        background: url(${hydrogenEventFireIcon}) no-repeat center
        center;
    }
    .dseInfo em.evtGas {
        background: url(${hydrogenEventGasIcon}) no-repeat center
        center;
    }
    .dseInfo em.evtShutoff {
        background: url(${hydrogenEventShutoffIcon}) no-repeat center
        center;
    }

    /* 경기 */
    .dseInfo em.evtEarthquake {
        background: url(${ggEventEarthquakeIcon}) no-repeat center
        center;
    }

    .dseInfo em.evtEmergencyBell {
        background: url(${ggEventEmergencyBellIcon}) no-repeat center
        center;
    }

    .dseInfo em.evtElectric {
        background: url(${ggEventElectricIcon}) no-repeat center
        center;
    }

    .dseInfo em.evtWaterLevel {
        background: url(${ggEventWaterLevelIcon}) no-repeat center
        center;
    }

    .dseInfo em.evtTerror {
        background: url(${ggEventTerrorIcon}) no-repeat center
        center;
    }

    .dseInfo em.evtPSMGas {
        background: url(${ggEventPSMIcon}) no-repeat center
        center;
    }
    
    .dseInfo div {
        padding-top: ${_EventComponent[PR.styleMode].dseInfoDivPaddingTop};
    }

    .dseInfo p {
        font-size: 12px;
        color: #fff;
        line-height: 1.4em;
        max-width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap; /* 0518 */
        margin-left: ${_EventComponent[PR.styleMode].dseInfoPMarginLeft};
        /* font-weight: 'bold';
           letter-spacing: 0.6px;
           margin-left: 15px; */
        font-weight: ${_EventComponent[PR.styleMode].dseInfoPFontWeight};
        /* letter-spacing: ${_EventComponent[PR.styleMode].dseInfoPLetterSpacing}; */
    }

    .dseInfo p span {
        margin-right: 10px;
    }

    .dseInfo p span:last-child {
        margin-right: 0;
    }

    .eventShortCut {
        position: absolute;
        background: #222222;
        color: #fff;
        border: solid 0.5px #737373;
        width: 30px;
        height: 20px;
        left: -5px;
        top: -5px;
        z-index: 1;
        text-align: center;
        padding-top: 2.5%;
        font-size: 10px;
        opacity: 80%;
    }

    .eventIconBox {
        display: flex;
        padding: 5px;
        margin-top: ${_EventComponent[PR.styleMode].eventIconBoxMarginTop};
        width: 100%;
    }

    .eventIconBox li {
        display: block;
        border: ${_EventComponent[PR.styleMode].eventIconBoxLiBorder};
        border-radius: ${_EventComponent[PR.styleMode].eventIconBoxLiBorderRadius};
        /* padding: 7px 3px; */
        padding: ${_EventComponent[PR.styleMode].eventIconBoxLiPadding};
        width: 19%;
        margin-right: ${_EventComponent[PR.styleMode].eventIconBoxMarginRight};
        text-align: center;
        background: ${_EventComponent[PR.styleMode].eventIconBoxLiBackground};
    }

    .eventIconBox li .eIcon1 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon1};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize1};
        background-position: center;
        background-position-y: ${_EventComponent[PR.styleMode].eventIconBoxEIconY1};
    }

    .eventIconBox li .eIcon2 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon2};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize2};
        background-position: center;
        background-position-y: ${_EventComponent[PR.styleMode].eventIconBoxEIconY2};
    }

    .eventIconBox li .eIcon3 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon3};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
    }

    .eventIconBox li .eIcon4 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon4};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
    }

    .eventIconBox li .eIcon5 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon5};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
        background-position-y: ${_EventComponent[PR.styleMode].eventIconBoxEIconY1};
    }

    .eventIconBox li .eIcon6 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon6};
        height: 20px;
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize6};
        background-position: center;
    }

    .eventIconBox li:nth-child(1) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .eventIconBox li:nth-child(2) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .eventIconBox li:nth-child(3) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .eventIconBox li:nth-child(4) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .eventIconBox li:nth-child(5) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .eventIconBox li.on,
    .eventIconBox li:hover {
        background: ${_PopupsCommon[PR.styleMode].mainColor};
        color: #fff;
    }

    .noMemoIconBox {
        display: flex;
        padding: 5px;
        margin-top: ${_EventComponent[PR.styleMode].eventIconBoxMarginTop};
        width: 100%;
        position: relative;
    }

    .noMemoIconBox li {
        display: block;
        border: ${_EventComponent[PR.styleMode].eventIconBoxLiBorder};
        border-radius: ${_EventComponent[PR.styleMode].eventIconBoxLiBorderRadius};
        padding: ${_EventComponent[PR.styleMode].eventIconBoxLiPadding};
        width: 30%;
        margin-left: 5px;
        margin-right: ${_EventComponent[PR.styleMode].eventIconBoxMarginRight};
        text-align: center;
        background: ${_EventComponent[PR.styleMode].eventIconBoxLiBackground};
    }

    .noMemoIconBox li .eIcon1 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon1};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize1};
        background-position: center;
        /* background-position-y: ${_EventComponent[PR.styleMode].eventIconBoxEIconY1}; */
    }

    .noMemoIconBox li .eIcon2 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon2};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize2};
        background-position: center;
        /* background-position-y: ${_EventComponent[PR.styleMode].eventIconBoxEIconY2}; */
    }

    .noMemoIconBox li .eIcon3 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon3};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
    }

    .noMemoIconBox li .eIcon4 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon4};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
    }

    .noMemoIconBox li .eIcon5 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon5};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize3};
        background-position: center;
    }

    .noMemoIconBox li .eIcon6 {
        display: block;
        background: ${_EventComponent[PR.styleMode].eventIconBoxEIcon6};
        height: ${_EventComponent[PR.styleMode].eventIconBoxEIconHeight};
        background-size: ${_EventComponent[PR.styleMode].eventIconBoxEIconSize6};
        background-position: center;
    }

    .noMemoIconBox li:nth-child(1) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .noMemoIconBox li:nth-child(2) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .noMemoIconBox li:nth-child(3) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .noMemoIconBox li:nth-child(4) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .noMemoIconBox li:nth-child(5) a {
        color: #fff;
        font-size: ${_EventComponent[PR.styleMode].eventIconBoxLiFontSize};
    }

    .noMemoIconBox li.on,
    .noMemoIconBox li:hover {
        background: ${_PopupsCommon[PR.styleMode].mainColor};
        color: #fff;
    }

    .hideKey { 
        visibility: hidden; 
    }

    .imgBroadcast {
        display: block;
        position: absolute;
        left: 80px;
        top: 50%;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        cursor: pointer;
    }
`;


/****************************************************/
//이벤트 정보 팝업창
export const EventInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50px;
    width: 320px;
    /* height: 988px !important; */ 
    height: calc(100vh - 50px);
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    border: none;

    /* &::before{
        content: '';
        display: inline-block;
        width: 100%;
        height: 100%;
        background: url(${popup_background_noTitle})no-repeat center center;
        background-size: cover;
        opacity: 0.15;
        position: absolute;
        left: 0;
        top: 48px;
    } */

    &::after{
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url(${popupSide_icon})no-repeat center center;
        position: absolute;
        right: 4.5px;
        bottom: 4.5px;
        cursor: pointer;
        z-index: 3;
    }

    .eventInfoTitle{
        display: flex;
        align-items: center;
        height: 48px;
        padding: 14px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        
        > span{
            color: #B6C6D2;
            font-family: "Spoqa Han Sans Neo";
            font-size: 14px;
            font-weight: 700;
        }
    }

    .dslContEvent{
        padding: 14px 12px;
        position: absolute;
        z-index: 1;
        width: 100%;
        height: calc(100% - 50px);

        &::before{
            content: '';
            display: inline-block;
            width: 100%;
            height: 100%;
            background: url(${popup_background_noTitle})no-repeat center center;
            background-size: cover;
            opacity: 0.15;
            position: absolute;
            left: 0;
            top: 0;
        }

        .dslContBtnBox {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
            position: absolute;
            left: 12px;
            z-index: 1;

            > select{
                display: block;
                width: 172px;
                height: 32px;
                padding: 6px 8px;
                border-radius: 2px;
                background: #131313 url(${selectArrow_icon}) no-repeat 94% 50%;
                color: #fff;
                font-size: 12px;
                font-weight: 400;
                margin-right: 52px;

                > option{
                    background: #131313;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 400;
                }

                &.on{
                    color: #0085ff;
                    border: solid 1px #0085ff;
                    background: #131313 url(${selectArrow_icon_blue}) no-repeat 94% 50%;
                }

                &.disable{
                    color: #1E1E1E;
                    background: #3C4143 url(${selectArrow_icon_disable}) no-repeat 94% 50%;
                }
            }

            > div {

                .mute{
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    background: #131313 url(${noSound_icon})no-repeat center center;
                    border-radius: 2px;
                    margin-right: 8px;

                    &:hover{
                        background: #131313 url(${noSound_hover_icon})no-repeat center center;
                    }

                    &.on{
                        background: #131313 url(${noSound_focus_icon})no-repeat center center;
                    }
                }

                .powerBtn{
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    background: #131313 url(${powerSetting_icon})no-repeat center center;
                    border-radius: 2px;

                    &:hover{
                        background: #131313 url(${powerSetting_hover_icon})no-repeat center center;
                    }

                    &:active{
                        background: #131313 url(${powerSetting_focus_icon})no-repeat center center;
                    }
                }
            }

            [data-tooltip-eventtext]{
                position: relative;
            }

            [data-tooltip-eventtext]:hover:before {
                content:attr(data-tooltip-eventtext);
                position: absolute;
                top: -100%;
                right: -12px;
                height: 32px;
                line-height: 30px;
                text-align: center;
                white-space: nowrap;
                padding: 0px 8px;
                border-radius: 4px;
                background-color: #565B69;
                color: #FFFFFF;
                font-size: 14px;
                z-index: 9999;
            }

            [data-tooltip-eventtext]:hover:after{
                content: " ";
                position: absolute;
                border-right: 5px solid transparent;
                border-left: 5px solid transparent;
                border-top: 5px solid #565B69;
                border-bottom: 5px solid transparent;
                left: 34%;
                top: 0%;
            }
        }

        .eventInfoScroll{
            display: block;
            height: calc(100% - 80px); 
            /* height: calc(100% - 50px); */ 
            overflow-x: hidden;
            overflow-y: auto;
            position: absolute;
            left: 12px;
            top: 60px;
            z-index: 1;

            &::-webkit-scrollbar {
                width: 4px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #1D1D1D;
            }
            &::-webkit-scrollbar-track {
                background-color: #3C4143;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #3C4143;
                border-radius: 2px;
                cursor: pointer;
            }

            .eventInfoBox{
                display: block;
                width: 296px;
                /* height: 192px; */
                border-radius: 4px;
                border: 1px solid #292D2E;
                background: #131313;
                margin-right: 4px;
                margin-bottom: 12px;

                &:hover{
                    border: solid 1px #185183;
                    //border: solid 1px #0085ff;
                    //filter: drop-shadow(0px 0px 2px #0085FF);
                }

                &.on{
                    border: solid 1px #185183;
                    background: #141414;
                    //border: solid 1px #0085ff;
                    //filter: drop-shadow(0px 0px 2px #0085FF);
                }

                .eventInfoTop{
                    display: flex;
                    align-items: center;
                    color: #fff;
                    padding: 16px 12px 0 12px;

                    .eventRedCircle{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${dangerStep2_icon})no-repeat center center;
                        margin-right: 8px;
                    }

                    .eventYellowCircle{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${dangerStep1_icon})no-repeat center center;
                        margin-right: 8px;
                    }

                    .eventGrayCircle{
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${dangerStep_disable})no-repeat center center;
                        margin-right: 8px;
                    }

                    > span:nth-child(2){
                        width: 240px;
                        color: #FFF;
                        text-overflow: ellipsis;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 14px;
                        font-weight: 700;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                /* 
                .eventInfoTop_disable{
                    display: flex;
                    align-items: center;
                    color: #747D81;
                    padding: 16px 12px 0 12px;

                    > span:nth-child(1){
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(${dangerStep2_icon})no-repeat center center;
                        margin-right: 8px;
                    }
        
                    > span:nth-child(2){
                        color: #FFF;
                        text-overflow: ellipsis;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 14px;
                        font-weight: 700;
                    }
                } */

                .eventInfoContents{
                    display: block;
                    margin: 17px 12px 12px 12px;

                    > div{
                        display: flex;
                        align-items: center;
                        color: #FFF;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 12px;
                        font-weight: 400;
                        line-height: 12px;
                        margin-bottom: 8px;
                        padding-left: 4px;
                        position: relative;

                        &::before{
                            content: '';
                            display: inline-block;
                            width: 2px;
                            height: 2px;
                            background: url(${eventBoxLabel_icon})no-repeat center center;
                            position: absolute;
                            left: 0;
                            top: 50%;
                            margin-right: 4px;
                        }

                        > input{
                            display: block;
                            width: 175px;
                            height: 20px;
                            padding: 4px;
                            background: #131313;
                            color: #fff; 
                            border: none;//
                            border-radius: 3px;
                            font-size: 12px;
                            margin-left: 4px;
                            margin-right: 4px;
                            flex: 1;
                        }

                        .memoBox{
                            border: solid 1px #131313;

                            &:hover{
                                .openMemoPen {
                                    display: block;
                                    width: 12px;
                                    height: 12px;
                                    background: url(${memoMode})no-repeat center center;
                                    cursor: pointer;
                                }
                            }
    
                            &.on{
                                border: 1px solid #0085FF;
                            }

                            &.colorOn{
                                border: 1px solid #131313;
                            }
                            &.disable{
                                display: none;
                            }
                        }
                    }

                    .memoArea{
                        display: flex;
                        align-items: center;

                        &:hover{
                            .openMemoPen {
                                display: block;
                                width: 12px;
                                height: 12px;
                                background: url(${memoMode})no-repeat center center;
                                cursor: pointer;
                            }
                        }                        
                    }
                    
                    .memoAreaActive{
                        display: flex;
                        align-items: center;
                    }

                    .inputReadOnly{
                        display: flex;

                        > p{
                            display: block;
                            width: 200px;
                            height: 20px;
                            padding: 4px;
                            background: #131313;
                            color: #fff;
                            border: none;
                            border-radius: 3px;
                            font-size: 12px;
                            margin-left: 4px;
                            margin-right: 4px;
                            flex: 1;
                            ${(props) => props.theme.variables.overText()};
                        }

                        &.disable{
                            display: none;
                        }
                    }

                    .inputActive{
                        display: none;

                        &.on{
                            display: block;
                            border: solid 1px #0085FF;
                            border-radius: 3px;
                            margin-left: 4px;

                            > input{
                                display: block;
                                width: 160px;
                                height: 20px;
                                padding: 4px;
                                background: #131313;
                                color: #fff;
                                border: none;
                                border-radius: 3px;
                                font-size: 12px;
                                margin-left: 4px;
                                margin-right: 4px;
                                flex: 1;
                            }
                        }
                    }                    

                    .memoCheckBox{
                        display: none;

                        &.on{
                            display: flex;
                            align-items: center;
                            position: relative;
                            margin-left: 4px;

                            .memoCheck_icon{
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                background: url(${memoCheck})no-repeat center center;
                                margin-right: 4px;

                                &:hover{
                                    background: url(${memoCheck_active})no-repeat center center;
                                }

                                &.on{
                                    background: url(${memoCheck_active})no-repeat center center;
                                }

                                &.disable{
                                    display: none;
                                }

                                &::after{
                                    display: block;
                                    content: '';
                                    width: 1px;
                                    height: 8px;
                                    background: #fff;
                                    position: absolute;
                                    left: 20px;
                                    top: 4px;
                                }
                            }

                            .memoClose_icon{
                                display: inline-block;
                                width: 16px;
                                height: 16px;
                                background: url(${memoClose})no-repeat center center;
                                margin-left: 4px;

                                &:hover{
                                    background: url(${memoClose_active})no-repeat center center;
                                }

                                &.on{
                                    background: url(${memoClose_active})no-repeat center center;
                                }

                                &.disable{
                                    display: none;
                                }
                            }
                        }

                        &.remove{
                            display: none;
                        }
                    }                    

                    .openMemoPen{
                        /* display: none; */

                        &:hover{
                            display: block;
                            width: 12px;
                            height: 12px;
                            background: url(${memoMode})no-repeat center center;
                        }

                        &.hoverActive{
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${memoMode})no-repeat center center;
                        }

                        &.hoverActive:hover{
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${memoMode_active})no-repeat center center;
                        }

                        &.on{
                            display: inline-block;
                            width: 12px;
                            height: 12px;
                            background: url(${memoMode_active})no-repeat center center;
                        }
                        &.disable{
                            display: none;
                        }
                    }
                }

                .eventInfoButton{
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid #292D2E;
                    padding: 8px 12px;

                    > div {
                        display: flex;

                        > button {
                            display: flex;
                            align-items: center;
                            height: 20px;
                            border-radius: 4px;
                            padding: 4px;
                            padding-left: 18px;
                            color: #fff;
                            font-family: "Spoqa Han Sans Neo";
                            font-size: 12px;
                            font-weight: 400;
                            margin-right: 12px;

                            &:hover{
                                color: #0085ff;
                            }

                            &.on{
                                background: #0085FF;
                                color: #1F2021;

                                &:hover{
                                    background: #0085FF;
                                    color: #fff;
                                }
                            }

                            &.disable{
                                background: #1E1E1E;
                                color: #747D81;
                            }
                        }

                        > .detailInfo {

                            background: #1E1E1E url(${detailInfo_icon}) no-repeat 10% center;

                            &:hover{
                                background: #1E1E1E url(${detailInfo_icon_hover}) no-repeat 10% center;
                            }
                        }

                        > .sopPractice {
                            background: #1E1E1E url(${sopButton_icon})no-repeat 10% center;

                            &:hover{
                                background: #1E1E1E url(${sopButton_hover_icon}) no-repeat 10% center;
                            }
                        }
        
                        > .sopEnd {
                            background: #1E1E1E url(${endButton_icon})no-repeat 10% center;

                            &:hover{
                                background: #1E1E1E url(${endButton_icon_hover}) no-repeat 10% center;
                            }
                        }
                    }

                    > button{
                        display: flex;
                        align-items: center;
                        width: 32px;
                        height: 20px;
                        border-radius: 4px;
                        background: #1E1E1E url(${alarmList_icon})no-repeat 10% center;
                        padding: 4px;
                        padding-left: 18px;
                        color: #fff !important;
                        font-family: "Spoqa Han Sans Neo";
                        font-size: 12px;
                        font-weight: 400;

                        &:hover{
                                width: 32px;
                                height: 20px;
                                background: #1E1E1E url(${alarmList_hover_icon})no-repeat;
                                background-position-x: 4px;
                                background-position-y: 5.4px;
                                color: #0085ff !important;
                        }

                        &.on{
                            background: #0085ff url(${alarmList_icon_active})no-repeat;
                            background-position-x: 4px;
                            background-position-y: 4px;
                            color: #141414 !important;
                        }
                    }
                }

                .eventInfoAlarmList{
                    display: none;
                    /* height: 140px; */
                    color: #747D81 !important;
                    
                    &.on{
                        display: block;
                    }

                    /* .eventInfoTop{
                        border-top: solid 1px rgba(255, 255, 255, 0.10);
                        padding-top: 17px;
                    } */

                    .eventInfoTop_disable{
                        display: flex;
                        align-items: center;
                        color: #747D81;
                        padding: 16px 12px 0 12px;
                        border-top: solid 1px rgba(255, 255, 255, 0.10);

                        > span:nth-child(1){
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background: url(${dangerStep_disable})no-repeat center center;
                            margin-right: 8px;
                        }
            
                        > span:nth-child(2){
                            width: 240px;
                            color: #747D81;
                            text-overflow: ellipsis;
                            font-family: "Spoqa Han Sans Neo";
                            font-size: 14px;
                            font-weight: 700;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;
                        }
                    }

                    .eventInfoContents_disable{
                        display: block;
                        margin: 17px 16px 12px 16px;

                        > div{
                            display: flex;
                            align-items: center;
                            color: #747D81;
                            font-family: "Spoqa Han Sans Neo";
                            font-size: 12px;
                            font-weight: 400;
                            line-height: 12px;
                            margin-bottom: 8px;
                            padding-left: 4px;
                            position: relative;

                            &::before{
                                content: '';
                                display: inline-block;
                                width: 2px;
                                height: 2px;
                                background: url(${eventBoxLabel_icon_disable})no-repeat center center;
                                position: absolute;
                                left: 0;
                                top: 50%;
                                margin-right: 4px;
                            }

                            > input{
                                display: block;
                                width: 175px;
                                height: 20px;
                                padding: 4px;
                                background: #131313;
                                color: #747D81;
                                border: none;
                                border-radius: 3px;
                                font-size: 12px;
                                margin-left: 4px;

                                &:focus{
                                    border: 1px solid #0085FF;
                                }
                            }

                            .memoBox2{
	                            border: solid 1px #131313;

	                            &:hover{
		                            .openMemoPen {
			                            display: block;
			                            width: 12px;
			                            height: 12px;
			                            background: url(${memoMode})no-repeat center center;
			                            cursor: pointer;
		                            }
	                            }

	                            &.on{
		                            border: 1px solid #0085FF;
	                            }

	                            &.colorOn{
		                            border: 1px solid #131313;
	                            }
	                            &.disable{
		                            display: none;
	                            }
                            }
                        }

                        .memoArea{
	                        display: flex;
	                        align-items: center;

	                        &:hover{
		                        .openMemoPen2 {
			                        display: block;
			                        width: 12px;
			                        height: 12px;
			                        background: url(${memoMode})no-repeat center center;
			                        cursor: pointer;
		                        }
	                        }
                        }

                        .memoAreaActive{
	                        display: flex;
	                        align-items: center;
                        }

                        .inputReadOnly2{
	                        display: flex;

	                        > p{
		                        display: block;
		                        width: 200px;
		                        height: 20px;
		                        padding: 4px;
		                        background: #131313;
		                        color: #747D81;
		                        border: none;
		                        border-radius: 3px;
		                        font-size: 12px;
		                        margin-left: 4px;
		                        margin-right: 4px;
		                        flex: 1;
	                        }

	                        &.disable{
		                        display: none;
	                        }
                        }

                        .inputActive2{
	                        display: none;

	                        &.on{
		                        display: block;
		                        border: solid 1px #0085FF;
		                        border-radius: 3px;
		                        margin-left: 4px;

		                        > input{
			                        display: block;
			                        width: 160px;
			                        height: 20px;
			                        padding: 4px;
			                        background: #131313;
			                        color: #fff;
			                        border: none;
			                        border-radius: 3px;
			                        font-size: 12px;
			                        margin-left: 4px;
			                        margin-right: 4px;
			                        flex: 1;
		                        }
	                        }
                        }


                        .memoCheckBox2{
	                        display: none;

	                        &.on{
		                        display: flex;
		                        align-items: center;
		                        position: relative;
		                        margin-left: 4px;

		                        .memoCheck_icon{
			                        display: inline-block;
			                        width: 16px;
			                        height: 16px;
			                        background: url(${memoCheck})no-repeat center center;
			                        margin-right: 4px;

			                        &:hover{
				                        background: url(${memoCheck_active})no-repeat center center;
			                        }

			                        &.on{
				                        background: url(${memoCheck_active})no-repeat center center;
			                        }

			                        &.disable{
				                        display: none;
			                        }

			                        &::after{
				                        display: block;
				                        content: '';
				                        width: 1px;
				                        height: 8px;
				                        background: #fff;
				                        position: absolute;
				                        left: 20px;
				                        top: 4px;
			                        }
		                        }

		                        .memoClose_icon{
			                        display: inline-block;
			                        width: 16px;
			                        height: 16px;
			                        background: url(${memoClose})no-repeat center center;
			                        margin-left: 4px;

			                        &:hover{
				                        background: url(${memoClose_active})no-repeat center center;
			                        }

			                        &.on{
				                        background: url(${memoClose_active})no-repeat center center;
			                        }

			                        &.disable{
				                        display: none;
			                        }
		                        }
	                        }

	                        &.remove{
		                        display: none;
	                        }
                        }

                        .openMemoPen2{
	                        /* display: none; */

	                        &:hover{
		                        display: block;
		                        width: 12px;
		                        height: 12px;
		                        background: url(${memoMode})no-repeat center center;
	                        }

	                        &.hoverActive{
		                        display: inline-block;
		                        width: 12px;
		                        height: 12px;
		                        background: url(${memoMode})no-repeat center center;
	                        }

	                        &.hoverActive:hover{
		                        display: inline-block;
		                        width: 12px;
		                        height: 12px;
		                        background: url(${memoMode_active})no-repeat center center;
	                        }

	                        &.on{
		                        display: inline-block;
		                        width: 12px;
		                        height: 12px;
		                        background: url(${memoMode_active})no-repeat center center;
	                        }
	                        &.disable{
		                        display: none;
	                        }
                        }
                    }


                }

                &.closed {
                    & * {
                        color: #747D81 !important;
                    }

                    .eventInfoContents {
                        > div {
                            &::before{
                                background: #747D81;
                            }
                        }
                    }

                    .eventInfoButton {
                        > div {

                            > button {
                                pointer-events: none;
                                cursor: default;
                            }

                            > button:nth-child(1) {
                                background: #1E1E1E url(${sopButton_icon_disable})no-repeat 10% center;
                            }

                            > button:nth-child(2) {
                                background: #1E1E1E url(${endButton_icon_disable})no-repeat 10% center;
                            }
                        }
                    }
                }
            }
        }
    }
`;



// 이벤트 정보 -> 메모

export const _SensorDetectHistoryMemoComponent = {
    Hydrogen: {
        memoContentsBackground: '#282829',
        memoContentsHeight: 'calc(100% - 76px)',
        memoContentsMargin: '15px 15px',
        memoContentsBorderRadius: '0',
        memoTxtHeight: '240px',
        memoBtnBackground: 'var(--navy-color)',
        memoBtnBackgroundC: 'var(--navy-color)',
        memoBtnColor: '#fff',
        memoBtnBottom: '4px',
        hsMmoRight: '0px',
        hsMmoTop: '50%',
        hsMmoLeft: '50%',
        hsMmoTransform: 'translate(-50%, -50%)',
        hsMmoBackground: '#282829',
        memoBtnFloat: 'right',
        memoBtnLiMargin: '0 2px',
        memoBtnLiWidth: '50px',
        memoBtnLiHeight: '24px',
        memoBtnLiLineHeight: '24px',
        memoBtnLiLineFont: '12px',
        memoBtnLiRadius: '8px',
    },
}

export const SensorDetectHistoryMemoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 380px;
    height: 370px;
    overflow: hidden;
    opacity: 1;
    background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBoxBackground};

    .memoContents {
        display: block;
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsHeight};
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsBackground};
        margin: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsMargin};
        border-radius: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsBorderRadius};
        overflow-y: auto;
    }

    .memoContentsUl {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 6px;

        li {
            width: 100%;
            height: 36px;
            line-height: 36px;
            border-bottom: solid 1px #262D42;

            label {
                margin-left: 10px;
                vertical-align: middle;
                color: #fff;
                font-weight: 500;
            }
        }
    }

    .memoTextarea{
        width: 100%;
    }
    .memoTextarea > textarea{
        display: none;
        resize: none;
        color: #fff;
    
        &.memoOn{
            display: block;
            width: 100%;
            /* height: 80px; */
        }
    }

    .memoTxt {
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoTxtHeight};
        border: solid 1px #ddd;
        margin-top: 10px;
        /* border-radius: 4px; */
    }

    .memoTxt .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    textarea.memoTxt {
        padding: 10px !important;
    }

    #hsMmo {
        position: fixed;
        /* right: 750px; */
        /* top: 300px; */
        right: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoRight};
        top: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoTop};
        left: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoLeft};
        transform: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoTransform};
        z-index: 1;
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoBackground};
        border-radius: 5px;
    }

    .memoBtn {
        float: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnFloat};
        text-align: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnTextAlign};
        padding: 3px 15px 7px;
        display: flex;
        width: 100%;
        justify-content: center;
        position: absolute;
        bottom: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBottom};
    }

    .memoBtn li {
        display: inline-block;
        margin: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiMargin};
        text-align: center;
    }

    .memoBtn li a {
        display: block;
        width: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiWidth};
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiHeight};
        line-height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiLineHeight};
        font-size: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiLineFont};
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBackground};
        color: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnColor};
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiRadius};
    }

    .memoBtn li:first-child a {
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBackgroundC};
        border-color: #ddd;
        color: #fff;
    }

    .memoBtn li a:hover {
        background: ${_PopupsCommon[PR.styleMode].memoMainColor};
        cursor: pointer;
    }
`;



export const SensorDetectHistoryMemoCenterComponent = styled(PopupsCommon)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    overflow: hidden;
    opacity: 1;
    border-radius: 4px;
    border: 1px solid #313644;
    background: #131313;
    box-shadow: 0px 6px 8px 0px rgba(0, 0, 0, 0.16);

    .dslTopHydrogen{
        padding: 15px;
        border-bottom: solid 1px #1E1E1E;

        .dslTitle {
            ${(props) => props.theme.variables.flex('flex-start', 'center')};
            gap: 4px;

            &::before {
                content: '';
                display: inline-block;
                width: 3px;
                height: 3px;
                background-color: var(--title-bar-text-blue-color);
            }
        }

        .dslTopX {
            display: block;
            width: 16px;
            height: 16px;
            text-indent: -9999px;
            position: absolute;
            top: 15px;
            right: 15px;
            background: url(${close_x}) no-repeat center center;
            z-index: 1; 
            cursor: pointer;
        }
    }

    .memoContents {
        display: block;
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsHeight};
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsBackground};
        margin: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsMargin};
        border-radius: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoContentsBorderRadius};
        overflow-y: auto;

        textarea {
            height: 100%;
            cursor: default;
        }

        textarea[readonly] {
            color: #fff;
        }
    }

    .memoContentsUl {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 6px;

        li {
            width: 100%;
            height: 36px;
            line-height: 36px;
            border-bottom: solid 1px #262D42;

            label {
                margin-left: 10px;
                vertical-align: middle;
                color: #fff;
                font-weight: 500;
            }
        }
    }

    .memoTextarea{
        width: 100%;
    }
    .memoTextarea > textarea{
        display: none;
        resize: none;

        &.memoOn{
            display: block;
            width: 100%;
            /* height: 80px; */
        }
    }

    .memoTxt {
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoTxtHeight};
        border: solid 1px #ddd;
        margin-top: 10px;
        /* -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px; */
    }

    .memoTxt .scroll-bar {
        background: rgba(0, 0, 0, 0.2) !important;
    }

    textarea.memoTxt {
        padding: 10px !important;
    }

    #hsMmo {
        position: fixed;
        /* right: 750px; */
        /* top: 300px; */
        right: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoRight};
        top: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoTop};
        left: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoLeft};
        transform: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoTransform};
        z-index: 1;
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].hsMmoBackground};
        border-radius: 5px;
    }

    .memoBtn {
        float: right;
        padding: 3px 15px 7px;
        display: flex;
        width: 100%;
        justify-content: center;
        position: absolute;
        bottom: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBottom};
    } 

    .memoBtn li {
        display: inline-block;
        margin: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiMargin};
        text-align: center;
    }

    .memoBtn li a {
        display: block;
        width: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiWidth};
        height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiHeight};
        line-height: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiLineHeight};
        font-size: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiLineFont};
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBackground};
        color: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnColor};
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnLiRadius};
    }

    .memoBtn li:first-child a {
        background: ${_SensorDetectHistoryMemoComponent[PR.styleMode].memoBtnBackgroundC};
        border-color: #ddd;
        color: #fff;
    }

    .memoBtn li a:hover {
        background: ${_PopupsCommon[PR.styleMode].memoMainColor};
        cursor: pointer;
    }
`;



/**********************************************************************/
// 툴바 (지도옵션)

export const _ToolbarComponent = {
    Hydrogen: {
        buttonIcon: `url(${wonik_dashboard_navigator}) no-repeat center center, linear-gradient(180deg, rgba(83, 152, 255, 1) 0%, rgba(0, 95, 236, 1) 100%)`,
        buttonIconOn: `url(${wonik_dashboard_navigator}) no-repeat center center, linear-gradient(180deg, rgba(83, 152, 255, 1) 0%, rgba(0, 95, 236, 1) 100%)`,
        dsnFloorBackground: 'rgba(14, 22, 45, 0.85)',
        dsnFloorBorder: 'none',
        dsnFloorOnBackground: 'rgba(14, 22, 45, 1)',
        dsnFloorOnColor: 'var(--title-bar-text-blue-color)',
    },
}

export const ToolbarComponent = styled.div`
    & {
        position: fixed;
        top: 80px;
        right: 30px;
        /* right: ${_ToolbarComponent[PR.styleMode].toolbarPositionRight}; */
        z-index: 98;
    }

    & button {
        display: block;
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        position: relative;
        z-index: 1;
        background: ${_ToolbarComponent[PR.styleMode].buttonIcon};
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        box-shadow: inset 0px 2px 4px rgba(255, 255, 255, 0.07), 0px 5px 6px rgba(0, 0, 0, 0.16);
    }

    & button.on {
        background: ${_ToolbarComponent[PR.styleMode].buttonIconOn};
    }

    & > div {
        display: none;
        background: #111928;
        width: 40px;
        position: absolute;
        left: 0;
        top: 20px;
        border-radius: 0px 0px 20px 20px;
        -moz-border-radius: 0px 0px 20px 20px;
        -webkit-border-radius: 0px 0px 20px 20px;
    }

    & > .dsnMenuDiv{
        display: none;
        background: #111928;
        width: 40px;
        position: absolute;
        left: 0;
        top: 20px;
        border-radius: 0px 0px 20px 20px;
        -moz-border-radius: 0px 0px 20px 20px;
        -webkit-border-radius: 0px 0px 20px 20px;
    }

    .dsnMenuHydrogen {
        padding-top: 25px !important;
        padding-bottom: 15px;
        width: 40px;
    }

    .dsnMenuHydrogen li {
    }

    .dsnMenuHydrogen li a {
        display: block;
        height: 40px;
        /*text-indent: -9999px;*/
        cursor: pointer;
        position: relative;
    }

    .dsnMenuHydrogen li:nth-child(1) a {
        background: url(${dashboard_nav_ico01}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(2) a {
        background: url(${dashboard_nav_ico02}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(3) a {
        background: url(${dashboard_nav_ico03}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(4) a {
        background: url(${dashboard_nav_ico04}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li:nth-child(5) a {
        background: url(${dashboard_nav_ico05}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li a.on {
        background: url(${dashboard_nav_ico06_on}) no-repeat center
        center;
    }

    .dsnMenuHydrogen li a.off {
        background: url(${dashboard_nav_ico06_off}) no-repeat center
        center;
    }
    

    .dsnMenu {
        padding-top: 25px;
        padding-bottom: 15px;
    }

    .dsnMenu li {
    }

    .dsnMenu li a {
        display: block;
        height: 40px;
        /*text-indent: -9999px;*/
        cursor: pointer;
        position: relative;
    }

    .dsnMenu li:nth-child(1) a {
        background: url(${dashboard_nav_ico01}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(2) a {
        background: url(${dashboard_nav_ico02}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(3) a {
        background: url(${dashboard_nav_ico03}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(4) a {
        background: url(${dashboard_nav_ico04}) no-repeat center
        center;
    }

    .dsnMenu li:nth-child(5) a {
        background: url(${dashboard_nav_ico05}) no-repeat center
        center;
    }

    .dsnMenu li a.on {
        background: url(${dashboard_nav_ico06_on}) no-repeat center
        center;
    }

    .dsnMenu li a.off {
        background: url(${dashboard_nav_ico06_off}) no-repeat center
        center;
    }

    .dsnMenu li a:before {
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        opacity: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .dsnMenu li a:hover:before {
        margin-right: 45px;
        opacity: 1;
        z-index: 2;
    }

    .dsnMenu li:nth-child(1) a:before {
        content: "초기화면"; 
    }

    .dsnMenu li:nth-child(2) a:before {
        content: "기본뷰로 설정";
    }

    .dsnMenu li:nth-child(3) a:before {
        content: "확대";
    }

    .dsnMenu li:nth-child(4) a:before {
        content: "축소";
    }

    .dsnMenu li:nth-child(5) a:before {
        content: "즉시회전";
    }

    .dsnMenu li a.on:before {
        content: "자동회전ON";
    }

    .dsnMenu li a.off:before {
        content: "자동회전OFF";
    }

    .balloonHome{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 65px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonDefault{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 107px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonIn{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 145px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonOut{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 187px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonRotate{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 226px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .balloonAutoRotate{
        display: block;
        background: rgba(17, 25, 40, 0.7);
        color: #fff;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        font-size: 11px;
        font-family: "dotum", sans-serif;
        position: absolute;
        right: 42px;
        top: 265px;
        margin-top: -12px;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        white-space: nowrap;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
    }

    .dsnBox {
        display: block;
        position: absolute;
        right: 100%;
        top: 30px;
        width: 52px;
        height: 940px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .dsnFloor {
        display: inline-block;
    }

    .dsnFloor li {
        margin-bottom: 5px;
    }

    .dsnFloor li:last-child {
        margin-bottom: 0;
    }

    .dsnFloor li a {
        display: block;
        height: 30px;
        line-height: 28px;
        border: ${_ToolbarComponent[PR.styleMode].dsnFloorBorder};
        color: #fff;
        background: ${_ToolbarComponent[PR.styleMode].dsnFloorBackground};
        width: 50px;
        text-align: center;
        font-size: 13px;
        border-radius: 15px 0px 0px 15px;
        -moz-border-radius: 15px 0px 0px 15px;
        -webkit-border-radius: 15px 0px 0px 15px;
        cursor: pointer;
    }

    .dsnFloor li a.on {
        background: ${_ToolbarComponent[PR.styleMode].dsnFloorOnBackground};
        color: ${_ToolbarComponent[PR.styleMode].dsnFloorOnColor};
    }

    #dsBack2Origin {
        position: fixed;
        bottom: 30px;
        left: 30px;
        z-index: 98;
    }

    #dsBack2Origin button {
        display: block;
        width: 40px;
        height: 40px;
        text-indent: -9999px;
        position: relative;
        z-index: 1;
        background: #2e344d url(${goBackOutdoor}) no-repeat center
        center;
        cursor: pointer;
        border-radius: 50%;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
    }
`;


/**********************************************************************/
// POI 편집모드 (팝업)

export const _EditModeStatusInfoComponent = {
    Hydrogen: {
        edTgtPadding: '20px',
        edTgtH5Color: 'var(--settings-color)',
        edTgtH5FontSize: '16px',
        edTgtH5FontWeight: '400',
        edTgtH5MarginBottom: '10px',
        edgBtnLiMinWidth: '66px',
        edgBtnLiMargin: '0 10px 10px 0',
        edgBtnLiSpanOn: 'transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box',
        edgBtnLiSpanBorder: '1px solid #FFFFFF1A',
        edgBtnLiSpanBorderRadius: '5px',
        edgBtnLiSpanBackground: 'var(--navy-color)',
        edgBtnLiSpanHeight: '28px',
        edgBtnLiSpanLineHeight: '26px',
        edgBtnLiSpanFontSize: '14px',
        edgBtnLiSpanPadding: '0 10px',
        poiModeMarginTop: '3px',
        poiModeWrapDisplay: 'flex',
        poiModeWrapMarginBottom: '15px',
        edCtvHeight: '156.5px',
        edCtvMarginBottom: '10px',
        edCtvDtPadding: '0 0 9.5px 0',
        edCtvDtBorderBottom: '1px dashed #3b3f5c',
        edCtvDtMarginBottom: '0',
        edCtvDtMarginRight: '10px',
        edCtvDtColor: '#fff',
        edCtvDdHeight: '130px',
        edCtvDdPadding: '10px 0',
        edCtvDdUlLiPadding: '10px',
        edCtvDdUlLiPPaddingLeft: '0',
        edCtvDdUlLiPAddedColor: '#EB4242',
        edCtvDdUlLiPSelectedColor: '#5398FF',
    },
}

export const EditModeStatusInfoComponent = styled(PopupsCommon)`
    position: absolute;
    left: 10px;
    top: 245px;
    width: 320px;
    height: 500px;

    .tabcontent {
        padding: 5px;
        font-size: 12px;
        display: none;
    }

    ul.tabs {
        float: left;
        height: 40px;
        width: 100%;
    }
    ul.tabs li {
        width: 50%;
        height: 40px;
        line-height: 38px;
        float: left;
        text-align: center;
        cursor: pointer;
        background: #3b3f5c;
    }
    ul.tabs li:hover {
        background: #2c2f4b;
    }
    ul.tabs li.active {
        background: #39a7de;
    }
    ul.tabs li.active:hover {
        background: #1a89c0;
    }

    .edTgt {
        padding-top: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtPadding};
    }

    .edTgt h5 {
        color: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5Color};
        font-size: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5FontSize};
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5MarginBottom};
        font-weight: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5FontWeight};
    }

    .edgBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        margin: 0 -2px;
    }

    .edgBtn:after {
        content: '';
        display: table;
        clear: both;
    }

    .edgBtn li {
        float: left;
        width: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiWidth};
        min-width: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiMinWidth};
        padding: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiPadding};
        margin: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiMargin};

    }

    .edgBtn li span {
        display: block;
        background: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanBackground};
        color: #fff;
        height: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanHeight};
        line-height: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanLineHeight};
        text-align: center;
        font-size: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanFontSize};
        font-weight: 300;
        cursor: pointer;
        border-radius: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanBorderRadius};
        -moz-border-radius: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanBorderRadius};
        -webkit-border-radius: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanBorderRadius};
        border: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanBorder};
        padding: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanPadding};
    }

    .edgBtn li span.on {
        background: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanOn};
    }

    .edgBtn li span {
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edgBtnLiSpanMarginBottom};
    }

    .poiSensorLi{
        float: left !important;
        margin: 0px 0px 10px 0px !important;
        min-width: auto !important;
    }

    .edgBtn li div{
        display: block;
        width: 30px;
        height: 30px;
    }

    .visibleEditFire {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleFire};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditFire {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableFire};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditEmergencyBell {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleEmergencyBell};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditEmergencyBell {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableEmergencyBell};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditPark {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visiblePark};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditPark {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disablePark};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditLife{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleLife};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditLife{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableLife};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditCardiac{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleCardiac};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditCardiac{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableCardiac};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditRescue{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleRescue};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditRescue{
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableRescue};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .visibleEditCCTV {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].visibleCCTV};
        background-size: ${_StatusInfoComponent[PR.styleMode].iconBackgroundSize};
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .disableEditCCTV {
        display: block;
        cursor: pointer;
        padding-left: 23px;
        background-repeat: no-repeat;
        background-image: ${_StatusInfoComponent[PR.styleMode].disableCCTV};
        background-size: 80%;
        width: 30px;
        height: 30px;
        background-position: center center;
        background-position-y: 5px;
    }

    .poiModeWrap {
        display: ${_EditModeStatusInfoComponent[PR.styleMode].poiModeWrapDisplay};
        flex-wrap: wrap;
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].poiModeWrapMarginBottom};
    }

    .poiMode {
        color: white;
        margin-top: ${_EditModeStatusInfoComponent[PR.styleMode].poiModeMarginTop};
        margin-right: 5px;
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].poiModeMarginBottom};
        display: flex;
        flex-wrap: wrap;
    }

    .poiMode li {
        width: auto;
        display: flex;
        align-items: center;
    }

    .poiMode li input{
        margin-right: 2px;
    }

    .poiModeText {
        margin-right: 10px;
    }

    .poiAddMode{
        color: white;
        display: flex;
        flex-direction: column;
        background: #0E162D;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .poiAddMode li{
        margin-bottom: 10px;
        display: flex;
        align-items: center;
    }

    .poiAddMode li:last-child{
        margin-bottom: 0px;
    }

    .poiAddMode li input{
        margin-right: 7px;
    }

    .poiAddMode li label{
        font-size: 14px;
    }

    .edCtv {
        margin-top: 10px;
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvMarginBottom};
        height: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvHeight};
    }

    .edCtv dt {
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtMarginBottom};
        margin-right: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtMarginRight};
        background: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtBackground};
        padding: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtPadding};
        
        border-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtBorderBottom};
        color: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDtColor};
    }

    .edCtv dt select {
        color: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5Color};
        font-size: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5FontSize};
        font-weight: ${_EditModeStatusInfoComponent[PR.styleMode].edTgtH5FontWeight};
        background: transparent url(${cctv_list_arrow}) 90% 62% no-repeat;
        border: 0;
        height: 16px;
        padding-left: 0;

        option {
            background: #0E162D;
            font-size: 14px;
            color: #fff;
        }
    }

    .edCtv dd {
        padding: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdPadding};
        height: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdHeight};
        background: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdBackground};
    }

    .edCtv dd ul li {
        margin-bottom: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdUlLiPadding};
    }

    .edCtv dd ul li:last-child {
        margin-bottom: 0;
    }

    .edCtv dd ul li p {
        display: inline-block;
        max-width: 100%;
        color: #fff;
        font-size: 12px;
        padding-left: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdUlLiPPaddingLeft};
        font-weight: 300;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    .edCtv dd ul li p.selected {
        color: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdUlLiPSelectedColor};
    }

    .edCtv dd ul li p.added {
        color: ${_EditModeStatusInfoComponent[PR.styleMode].edCtvDdUlLiPAddedColor};
    }
`;


export const _EditModePopupsComponent = {
    Hydrogen: {
        sectionBorder: '2px solid #FFFFFF1A',
        sectionFontSize: '16px',
        sectionBackground: 'rgba(14, 22, 45, .8)',
        headerBackground: 'rgba(255, 255, 255, .1)',
        headerPadding: '11px 64px 10px 20px',
        fontColor: 'var(--white-color)',
        titleColor: 'var(--title-bar-text-blue-color)',
        sectionMainPadding: '20px',
        footerButtonBackground: 'var(--navy-color)',
        footerFontSize: '14px',
        footerPadding: '20px',
        footerButtonLastBackground: `transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box`,
        headerXFontSize: '26px',
        headerXColor: '#fff',
        headerXTop: '2px',
        headerXRight: '11px',
        headerXFontWeight: '500',
        buttonMargin: '10px',
    },
}


export const EditModePopupsComponent = styled.div`
    & {
        display: none;
        z-index: 999;
        opacity: 1;
    }

    & button {
        outline: none;
        cursor: pointer;
        border: 0;
        margin-left: ${_EditModePopupsComponent[PR.styleMode].buttonMargin};
    }

    & > section {
        width: 321px;
        height: 186px;
        margin: 0 auto;
        border-radius: 10px;
        backdrop-filter: blur(3px);
        -webkit-backdrop-filter: blur(3px);
        background-color: ${_EditModePopupsComponent[PR.styleMode].sectionBackground};
        overflow: hidden;
        border: ${_EditModePopupsComponent[PR.styleMode].sectionBorder};
        position: relative;
    }

    & > section > header {
        position: relative;
        padding: ${_EditModePopupsComponent[PR.styleMode].headerPadding};
        background-color: ${_EditModePopupsComponent[PR.styleMode].headerBackground};
        font-weight: 700;
        color: ${_EditModePopupsComponent[PR.styleMode].titleColor};
    }

    & > section > header button {
        position: absolute;
        top: ${_EditModePopupsComponent[PR.styleMode].headerXTop};
        right: ${_EditModePopupsComponent[PR.styleMode].headerXRight};
        width: 30px;
        font-size: ${_EditModePopupsComponent[PR.styleMode].headerXFontSize};
        font-weight: ${_EditModePopupsComponent[PR.styleMode].headerXFontWeight};
        text-align: center;
        color: ${_EditModePopupsComponent[PR.styleMode].headerXColor};
        background-color: transparent;
    }

    & > section > main {
        padding: ${_EditModePopupsComponent[PR.styleMode].sectionMainPadding};
        border-top: ${_EditModePopupsComponent[PR.styleMode].sectionMainBorderTop};
    }

    & > section > main > p {
        margin-bottom: 8px;
    }

    & > section > main > ul {
        color: white;
        display: flex;

        li {
            margin-right: 10px;

            input[type="radio"] + label {
                display: inline;
                vertical-align: middle;
                margin-left: 2px;
                font-weight: 400;
                cursor: pointer;
                font-family: pretendard;
                font-size: 16px;
            }
        }
    }

    & > section > main > div {
        margin-top: 12px;
        
        input[type="text"] {
            width: 221px;
            height: 28px;
            padding-left: 10px;
            margin-left: 10px;
            background: none;
            color: #fff;
            font-size: 14px;
            border: solid 1px var(--white-color);
            border-radius: 5px;
        }
    }

    & > section > footer {
        padding: ${_EditModePopupsComponent[PR.styleMode].footerPadding};
        text-align: right;
        position: absolute;
        bottom: 0;
        right: 0;
    }

    & > section > footer button {
        width: 68px;
        height: 28px;
        padding: 6px 12px;
        color: #fff;
        background-color: ${_EditModePopupsComponent[PR.styleMode].footerButtonBackground};
        border-radius: 5px;
        font-size: ${_EditModePopupsComponent[PR.styleMode].footerFontSize};

        &:last-child {
            background: ${_EditModePopupsComponent[PR.styleMode].footerButtonLastBackground};
        }
    }

    &.openModal {
        display: flex;
        align-items: center;
        color: ${_EditModePopupsComponent[PR.styleMode].fontColor};
        font-size: ${_EditModePopupsComponent[PR.styleMode].sectionFontSize};
    }
`

/**********************************************************************/
// 작업자 현황(솔브레인)

export const WorkerInfoSBComponent = styled(PopupsCommon)`
    position: absolute;
    left: 250px;
    top: 200px;
    width: 390px;
    height: 380px;
    overflow: hidden;
    opacity: 1;

    .workerInfoSBContents{
        padding: 10px;
        height: 100%;
    }

    .dsiSchW {
        background: #3C4255;
        margin-right: 0px;
        padding-right: ${_PopupsCommon[PR.styleMode].dsiSchPaddingRight};
        position: relative;
    }

    .dsiSchW input[type="text"] {
        display: block;
        height: 30px;
        padding-left: 10px;
        background: #0E162D;
        color: #fff;
        font-size: 12px;
        width: 100%;
        border: none;
    }

    .dsiSchW a,
    .dsiSchW button,
    .dsiSchW input[type="submit"] {
        display: block;
        width: 30px;
        height: 30px;
        background: #f00;
        position: absolute;
        right: 0;
        top: 0;
        text-indent: -9999px;
        background: ${_PopupsCommon[PR.styleMode].dsiSchBackgroundImg};
        border-style: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputStyle};
        border-width: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputWidth};
        border-color: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputColor};
        border-radius: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputSublitRadius};
    }

    .workerAlarmText{
        display: flex;
        font-size: 12px;
        color: #E4AD2B;
        margin-top: 15px;
        margin-bottom: 16px;
    }
    .workerIcon{
        display: inline-block;
        width: 14px; 
        height: 10px;
        background-image: url(${yellowHat});
        margin-right: 2px;
    }
    .workerTableBox{
        height: calc(100% - 110px);
        overflow-y: scroll;
    }

    .workerTableTitle{
        display: flex;
        height: 30px;
        line-height: 30px;
        background: #2E394A;
        color: #fff;
    }

    .workerTableTitle span{
        display: block;
        padding: 0px 10px;
        border-right: solid 1px #272E42;
        font-size: 11px;
    }
    .workerTableTitle span:nth-child(1){
        width: 28%;
    }
    .workerTableTitle span:nth-child(2){
        width: 36%;
    }
    .workerTableTitle span:nth-child(3){
        width: 18%;
    }
    .workerTableTitle span:nth-child(4){
        width: 18%;
        border-right: none;
    }

    .workerTableLine{
        display: flex;
        height: 37px;
        line-height: 37px;
        color: #fff;
        border-bottom: solid 1px #394253;

        &.on{
            color: #E4AD2B;
        }
    }

    .workerTableLine span{
        display: block;
        padding: 0px 10px;
        font-size: 11px;
        font-weight: 500;    
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .workerTableLine span:nth-child(1){
        width: 28%;
    }
    .workerTableLine span:nth-child(2){
        width: 36%;
    }
    .workerTableLine span:nth-child(3){
        width: 18%;
    }
    .workerTableLine span:nth-child(4){
        width: 18%;
    }

    .workerTableConts{
        display: none;
        height: 164px;
        background: #fff;
        padding: 10px;

        &.on{
            display: block;
        }
    }
    .tableSubTitle{
        display: flex;
        height: 36px;
        line-height: 36px;
    }

    .tableSubTitle span{
        display: block;
        text-align: center;
        background: #EDEDED;
        font-size: 11px; 
        border-right: solid 1px #fff;
        padding: 0px 10px;
    }

    .tableSubTitle span:nth-child(1){
        width: 20%;
    }
    .tableSubTitle span:nth-child(2){
        width: 50%;
    }
    .tableSubTitle span:nth-child(3){
        width: 30%;
        border-right: none;
    }

    .tableSubTitleB{
        display: flex;
        height: 36px;
        line-height: 36px;
    }

    .tableSubTitleB span{
        display: block;
        text-align: center;
        background: #EDEDED;
        font-size: 11px; 
        border-right: solid 1px #fff;
        padding: 0px 10px;
    }

    .tableSubTitleB span:nth-child(1){
        width: 20%;
    }
    .tableSubTitleB span:nth-child(2){
        width: 20%;
    }
    .tableSubTitleB span:nth-child(3){
        width: 30%;
    }
    .tableSubTitleB span:nth-child(4){
        width: 30%;
        border-right: none;
    }

    .tableSubConts{
        display: flex;
        height: 36px;
        line-height: 36px;
    }
    .tableSubConts span{
        display: block;
        text-align: center;
        border-right: solid 1px #EDEDED;
        padding: 0px 10px;
        font-size: 11px; 
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    
    .tableSubConts span:nth-child(1){
        width: 20%;
    }
    .tableSubConts span:nth-child(2){
        width: 50%;
    }
    .tableSubConts span:nth-child(3){
        width: 30%;
        border-right: none;
    }

    .tableSubContsB{
        display: flex;
        height: 36px;
        line-height: 36px;
    }
    .tableSubContsB span{
        display: block;
        text-align: center;
        border-right: solid 1px #EDEDED;
        font-size: 11px; 
        padding: 0px 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .tableSubContsB span:nth-child(1){
        width: 20%;
    }
    .tableSubContsB span:nth-child(2){
        width: 20%;
    }
    .tableSubContsB span:nth-child(3){
        width: 30%;
    }
    .tableSubContsB span:nth-child(4){
        width: 30%;
        border-right: none;
    }
`;







/**********************************************************************/
// 작업자 정보(원익)

export const WorkerStatusComponent = styled(PopupsCommon)`
    position: absolute;
    left: 10px;
    top: 60px;
    width: 305px;
    height: auto;
    overflow: hidden;
    opacity: 1;

    .worker-status-title {
        margin-top: 20px;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: 400;
        color: #ffd753;
    }

    .worker-status-warp {

        .worker-status-content-wrap {
            color: #ffffff;
            margin-top: 20px;
            padding: 0 10px 20px 10px;
            ${(props) => props.theme.variables.flex()};
            border-bottom: 1px solid #525868;

            .worker-status-content {
                text-align: center;

                div {
                width: 58px;
                height: 58px;
                border-radius: 50%;
                background-color: #ffffff1a;
                margin-bottom: 10px;
                }

                P {
                margin-top: 4px;
                }

                .worker-status-content-icon-people:before {
                content: url(${peopleIcon});
                position: relative;
                top: 17px;
                }

                .worker-status-content-icon-human:before {
                content: url(${humanIcon});
                position: relative;
                top: 14px;
                }

                .worker-status-content-icon-id:before {
                content: url(${identificationIcon});
                position: relative;
                top: 14px;
                }
            }
        }
    }

    .worker-info-wrap {
        .worker-status-title {
            margin-bottom: 8px;
        }

        .worker-info-content-wrap {
            height: calc(100% - 84px);
            margin-bottom: 5px;
            padding-right: 6px;

            .worker-info-content {
                width: 100%;
                height: auto;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                color: #ffffff;
                padding: 8px 10px;
                margin-bottom: 10px;

                .worker-info-content-title {
                    ${(props) => props.theme.variables.flex()};
                    font-size: 14px;
                    font-weight: 400;

                    div {
                        ${(props) => props.theme.variables.flex()};

                        p {
                            color: #5398ff;
                            font-size: 12px;
                            position: relative;
                            top: -2px;

                            &::before {
                                content: "";
                                display: inline-block;
                                width: 16px;
                                height: 14px;
                                background-image: url(${peopleIcon});
                                background-size: contain;
                                margin-right: 6px;
                                position: relative;
                                top: 3px;
                            }
                        }

                        .worker-info-content-title-show {
                            background-image: url(${worker_arrow_white});
                            transition: .3s;
                            width: 11px;
                            height: 7.5px;
                            background-size: contain;
                            background-repeat: no-repeat;
                            margin-left: 8px;
                        }
                    }
                }

                .worker-info-content-title.on {
                    div {
                        .worker-info-content-title-show {
                            transform: rotate(180deg);
                        }
                    }
                }

                .worker-info-content-list-wrap {
                    display: none;

                    &.on {
                        display: block;
                    }
                }

                .worker-info-content-chart {
                    width: 245px;
                }

                .worker-info-content-list {
                    font-size: 12px;

                    &:not(:last-child) {
                        margin-bottom: 9px;
                    }

                    > div {
                        display: none;
                    }

                    .on {
                        display: block;
                    }

                    .list-item-wrap {
                        ${(props) => props.theme.variables.flex()};
                        padding-bottom: 5px;
                        margin-bottom: 5px;
                        border-bottom: 1px dashed #2d3448;
                        cursor: pointer;

                        > div {
                            min-width: 170px;
                            display: inline-flex;
                            margin-left: 10px;
                            justify-content: right;
                            align-items: center;

                            li {
                                margin-left: 17px;

                                &:last-child {
                                    margin-left: 25px;
                                }
                            }
                        }

                        .list-item-area {

                            &::before {
                                content: '';
                                width: 7px;
                                height: 7px;
                                background: url(${depth_arrow_btn}) no-repeat;
                                background-size: contain;
                                display: inline-block;
                                margin-right: 5px;
                                transition: .3s;
                                position: relative;
                                top: -1px;
                            }
                        }
                    }

                    .list-item-wrap.on {
                        .list-item-area {
                            &::before {
                                content: '';
                                transform: rotate(90deg);
                                transition: .3s;
                            }
                        }
                    }



                    .list-item-member {
                        position: relative;
                        top: -2px;
                    }

                    .list-item-visitor {
                        position: relative;
                        top: -1px;
                    }

                    .list-item-member::before {
                        content: "";
                        display: inline-block;
                        background-image: url(${board_human_icon_small_off});
                        background-size: contain;
                        background-repeat: no-repeat;
                        width: 13px;
                        height: 14px;
                        position: relative;
                        top: 2px;
                        margin-right: 6px;
                    }

                    .list-item-visitor::before {
                        content: "";
                        background-image: url(${board_identification_icon_small_off});
                        background-size: contain;
                        background-repeat: no-repeat;
                        display: inline-block;
                        width: 16px;
                        height: 14px;
                        position: relative;
                        top: 1px;
                        margin-right: 6px;
                    }

                    .list-item-none {
                        width: 48px;
                    }

                    .list-item-workerBtn {
                        width: 48px;
                        height: 18px;
                        color: #fff;
                        font-size: 12px;
                        padding: 2px 8px 0 8px;
                        border: 1px solid #D3D5D9;
                        border-radius: 30px;
                    }

                    .list-item-workerBtn-active {
                        width: 48px;
                        height: 18px;
                        color: #fff;
                        font-size: 12px;
                        padding: 2px 8px 0 8px;
                        border-radius: 30px;
                        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                    }

                    .list-item-remainerBtn {
                        width: 48px;
                        height: 18px;
                        color: #fff;
                        font-size: 12px;
                        padding: 2px 8px 0 8px;
                        border: 1px solid #D3D5D9;
                        border-radius: 30px;
                    }

                    .list-item-remainerBtn-active {
                        width: 48px;
                        height: 18px;
                        color: #fff;
                        font-size: 12px;
                        padding: 2px 8px 0 8px;
                        border-radius: 30px;
                        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                    }



                    .list-item-wrap-1depth {
                        ${(props) => props.theme.variables.flex()};
                        margin-bottom: 6px;
                        transition: height 0.3s ease-in-out;

                        &.div {
                            display: none;
                        }

                        .list-item-area-1depth {
                            ${(props) => props.theme.variables.flex()};
                            padding-left: 10px;
                            width: 100%;

                            > span {
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                display: inline-block;
                                flex-grow: 1;
                            }

                            > div {
                                min-width: 170px;
                                display: inline-flex;
                                justify-content: right;
                                align-items: center;

                                li {
                                    margin-left: 17px;

                                    &:last-child {
                                        margin-left: 25px;
                                    }
                                }
                            }
                        }



                        .list-item-area-1depth::before {
                            content: '';
                            width: 7px;
                            height: 7px;
                            background: url(${depth_arrow_btn}) no-repeat;
                            display: inline-block;
                            margin-right: 5px;
                            position: relative;
                            top: -1px;
                            cursor: pointer;
                        }

                        &:last-child {
                            margin-bottom: 15px;
                        }
                    }

                    .worker_status_zone {
                        display: none;

                        &.on {
                            display: block;
                        }
                    }

                    .list-item-wrap-1depth.on {
                        .list-item-area-1depth::before {
                            content: '';
                            transform: rotate(90deg);
                            transition: .3s;
                        }
                    }

                    .list-item-wrap-1depth.active {
                        color: #5398FF;

                        .list-item-area-1depth::before {
                            background: url(${depth_arrow_btn_active}) no-repeat;
                        }

                        .list-item-member::before {
                            background-image: url(${board_human_icon_small_on});
                        }

                        .list-item-visitor::before {
                            background-image: url(${board_identification_icon_small_on});
                        }

                        .list-item-btn {
                            background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
                            border: 0;
                        }
                    }

                    .list-item-wrap-2depth {
                        ${(props) => props.theme.variables.flex()};
                        margin-bottom: 6px;
                        transition: height 0.3s ease-in-out;

                        .list-item-area-2depth {
                            ${(props) => props.theme.variables.flex()};
                            padding-left: 15px;
                            width: 100%;

                            > span {
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                                display: inline-block;
                                flex-grow: 1;
                            }

                            > div {
                                min-width: 170px;
                                display: inline-flex;
                                justify-content: right;
                                align-items: center;
    
                                li {
                                    margin-left: 17px;
    
                                    &:last-child {
                                        margin-left: 25px;
                                    }
                                }
                            }
                        }


                        .list-item-area-2depth::before {
                            content: '·';
                            width: 7px;
                            height: 7px;
                            display: inline-block;
                            margin-right: 5px;
                            position: relative;
                            top: -1px;
                            cursor: pointer;
                        }

                        &:last-child {
                            margin-bottom: 15px;
                        }
                    }

                }
            }
        }
    }
`;

export const WorkerStatusComponentPopup = styled(PopupsCommon)`
    position: absolute;
    left: 350px;
    top: 60px;
    /* min-width: 320px; */ 
    width: 720px;
    height: 420px;
    overflow-y: hidden;
    overflow-x: auto;
    border: 2px solid #ffffff1a;
    border-radius: 10px;
    opacity: 1;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);

    .dslTop {
        padding: 10px 20px;
        position: relative;
    }

    .dslGrd {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .dslTitle {
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        color: #5398ff;
        font-weight: 600;
    }

    .downloadIcon{
        display: inline-block;
        width: 20px;
        height: 16px;
        background: url(${download_icon}) no-repeat center center;
        margin-right: 10px;
        cursor: pointer;
        z-index: 1;
    }

    .messageSend{
        display: inline-block;
        width: 20px;
        height: 16px;
        background: url(${messageSend_icon}) no-repeat center center;
        margin-right: 12px;
        cursor: pointer;
        z-index: 1;
    }

    .dslX {
        display: block;
        width: 16px;
        height: 16px;
        text-indent: -9999px;
        position: absolute;
        right: 10px;
        top: 50%;
        margin-top: -8px;
        background: url(${dashboard_layer_close}) no-repeat center center;
        z-index: 1; /*팝업관련 z-index 최대 1 - K.D.R */
        cursor: pointer;
    }

    .dslCont {
        padding: 10px 10px 20px 20px;
        background: #0e162d;
        height: calc(100% - 28px);
        min-width: 700px;
        overflow-y: auto;
        overflow-x: auto;

        &::-webkit-scrollbar {
        width: 14px;
        background: #0E162D;
        border-radius: 10px; 
        border: 5px solid #0e162d;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(82, 88, 104, 1);
            border-radius: 6px; 
            border-left: 5px solid #0e162d;
            border-right: 5px solid #0e162d;
            border-top: 0;
            border-bottom: 0;
        }

        &::-webkit-scrollbar-track {
            background-color: rgba(0,0,0,0);
        }

        .worker-info-wrap {
            color: #fff;
            font-size: 14px;
            
            tr {
                height: 40px;
                line-height: 40px;
                text-align: center;
            }

            tbody tr:not(:last-child) {
                    border-bottom: 1px dashed #525868;
                }

            thead tr {
                border-bottom: 1px solid #525868;;
            }

            .sos-icon {
                background: url(${board_sos_icon}) no-repeat center center;
            } 
        }
    }
`


/**********************************************************************/
// 작업자 상세정보(원익)
export const WorkerDetailInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 400px;
    left: 426px;
    width: 280px;
    overflow: hidden;
    opacity: 1;

    .dslCont {
        padding: 20px;

        .worker-image {
            width: 77px;
            height: 68px;
            margin: 0 auto;
        }

        .worker-detail-info-wrap {
            color: var(--white-color);
            text-align: center;
            margin-top: 12px;

            .worker-detail-info-top {
                font-size: 14px;
                margin-bottom: 20px;

                .worker-id {
                    margin-bottom: 8px;
                }

                .worker-name {
                    ${props => props.theme.variables.flex('center', 'center')};
                    color: var(--middle-gray-color);
                    margin-bottom: 13px;

                    

                    & > div {
                        ${props => props.theme.variables.flex()};

                        span {
                            padding-left: 10px;
                            margin-left: 10px;
                            display: inline-block;
                            border-left: 1px solid var(--middle-gray-color);
                        }

                        img {
                            width: 12px;
                            height: 12px;
                            margin-left: 6px;
                            cursor: pointer;
                        }
                    }
                }

                .notice-message {
                    color: #EB4242;
                    font-size: 12px;
                    letter-spacing: 0.6px;
                    width: 100%;
                    height: 24px;
                    line-height: 23px;
                    background: #3A4154;
                    border: 1px solid #454C5D;
                    border-radius: 3px;
                    margin-bottom: 10px;
                }

                .notice-time {
                    font-size: 18px;
                    letter-spacing: 0.9px;
                }
            }

            .worker-detail-info-bottom {
                
                li {
                    ${props => props.theme.variables.flex()};
                    padding: 10px 0;
                    font-size: 12px;
                    letter-spacing: 0.6px;
                    border-top: 1px solid #3A4154;

                    &:last-child {
                        padding-bottom: 0;
                    }
                    
                    .alarm-img {
                        width: 16px;
                        height: 16px;
                        object-fit: none;
                    }
                }
            }
        }
    }
`


/**********************************************************************/
// 안전구역 평가(원익)
export const SafetyAreaAssessmentComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    left: 426px;
    width: 423px;
    height: 741px;
    overflow: hidden;
    opacity: 1;

    .gradeBtn{
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(${ GradeBtnImageDisable }) no-repeat center center;
        margin-right: 14px;
        position: relative;
        cursor: pointer;
        z-index: 1;

        &.on{
           background: url(${ GradeBtnImage }) no-repeat center center;
        }
    }

    #gradeSetPopupBox{

    }

    .gradeSetPopupBox{
        display: none;
        position: absolute;
        top: 36px;
        right: 20px;
        z-index: 2;

        &.on{
          display: block;
        }
    }

    .gradeTriangle{
        display: inline-block;
        width: 33px;
        height: 28px;
        background: url(${ GradeTriangle }) no-repeat bottom center;
        position: absolute;
        top: -16px;
        right: 7px;
        z-index: 2;
    }

    .gradeSetPopup{
        display: block;
        /* width: 240px; */
        height: 217px;
        border-radius: 5px;
        background: #0E162D;
        padding: 20px 20px 17px 20px;
    }

    .gradeTitle{
        display:block;
        font-size: 16px;
        color: #5398FF;
    }

    .gradeRefreshBtn{
        display: inline-block;
        width: 17px;
        height: 17px;
        background: url(${ GradeRefreshBtn })no-repeat center center;
        margin-left: 10px;
        cursor: pointer;

    }

    .gradeFlexTitle{
         display: flex;
         height: 24px;
         margin-bottom: 12px;
         align-items: center;
    }

    .gradeFlex{
         display: flex;
         height: 24px;
         line-height: 24px;
         margin-bottom: 12px;
    }

    .gradeFlex p:nth-child(1){
         display: block;
         color: #B3B3B3;
         font-size: 14px;
         margin-right: 11px;

         &.on{
            color: #5398FF;
         }
     }

    .slice{
         display: block;
         color: #B3B3B3;
         font-size: 14px;
         margin: 0px 11px;

         &.on{
            color: #5398FF;
         }
     }

    .gradeInputA{
         display: block;
         width: 80px;
         height: 24px;
         line-height: 24px;
         background: #0E162D url(${ PercentIcon })no-repeat 95% 50%;
         color: #fff;
         border-radius: 3px;
         padding-right: 26px;

         &.on{
            border: solid 1px #5398FF;
            background: #0E162D url(${ PercentIconActive })no-repeat 95% 50%;
         }
    }

    .gradeInputA:focus {
         border: solid 1px #5398FF;
         background: #0E162D url(${ PercentIconActive })no-repeat 95% 50%;
     }

    .gradeInputB{
         display: block;
         width: 80px;
         height: 24px;
         line-height: 24px;
         background: #0E162D url(${ PercentIcon})no-repeat 95% 50%;
         color: #fff;
         border-radius: 3px;
         padding-right: 26px;

         &.on{
            border: solid 1px #5398FF;
            background: #0E162D url(${PercentIconActive})no-repeat 95% 50%;
         }
    }

    .gradeInputB:focus {
         border: solid 1px #5398FF;
         background: #0E162D url(${PercentIconActive })no-repeat 95% 50%;
     }

    .gradeInputC{
         display: block;
         width: 80px;
         height: 24px;
         line-height: 24px;
         background: #0E162D url(${ PercentIcon})no-repeat 95% 50%;
         color: #fff;
         border-radius: 3px;
         padding-right: 26px;

         &.on{
            border: solid 1px #5398FF;
            background: #0E162D url(${PercentIconActive})no-repeat 95% 50%;
         }
    }

    .gradeInputC:focus {
         border: solid 1px #5398FF;
         background: #0E162D url(${PercentIconActive })no-repeat 95% 50%;
     }

    .gradeFlex > input::placeholder{
         color: #F3F3F3;
         font-size: 12px;
         font-weight: 400;
         padding-left: 50px;
    }

    .gradeConfirmBox{
         display: flex;
         justify-content: flex-end;
         padding-top: 8px;
    }

    .gradeConfirmBox > a:nth-child(1){
        color: #fff;
        width: 68px;
        height: 28px;
        line-height: 26px;
        border-radius: 5px;
        border: 1px solid #FFFFFF1A;
        margin-right: 10px;
        text-align: center;
        cursor: pointer;
    }
    .gradeConfirmBox > a:nth-child(2){
        color: #fff;
        width: 68px;
        height: 28px;
        line-height: 26px;
        border-radius: 5px;
        border: 1px solid #FFFFFF1A;
        text-align: center;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        cursor: pointer;
    }


    .dslCont {
        padding: 20px 10px 60px 20px;
        color: var(--white-color);

        h5 {
            color: var(--settings-color);
            font-size: 16px;
            letter-spacing: 0.8px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        li {
            ${props => props.theme.variables.flex()};
            margin-bottom: 12px;

            > span:last-child {
                min-width: 290px;
                width: 100%;
                height: 28px;
                line-height: 27px;
                padding-left: 10px;
                background: #0E162D 0% 0% no-repeat padding-box;
                border: 1px solid #FFFFFF1A;
                border-radius: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                padding-right: 30px;
            }
        }

        .receiver-info-area-wrap {
            font-size: 14px;
            margin-bottom: 0px;
            padding-right: 10px;

            .span-left {
                width: 90px;
            }

            .receiver-info span:last-child {
                position: relative;

                &::after {
                    content: url(${safetyArea_people_icon});
                    position: absolute;
                    right: 16px;
                    cursor: pointer;
                }
            }

            .management-area-info {
                margin-bottom: 10px;

                .scrollbar::-webkit-scrollbar {
                    width: 14px;
                    background: #0E162D;
                    border-radius: 10px; 
                    border: 5px solid #0e162d;
                }

                .scrollbar::-webkit-scrollbar-thumb {
                    background-color: ${_PopupsCommon[PR.styleMode].scrollbarThumbColor};
                    border-radius: 6px;
                    border-left: 5px solid #0e162d;
                    border-right: 5px solid #0e162d;
                    border-top: 0;
                    border-bottom: 0;
                }

                .scrollbar::-webkit-scrollbar-track {
                    background-color: rgba(0,0,0,0);
                }

                .management-area-input {
                    width: 100%;
                    position: relative;
                }

                input[type="text"] {
                    min-width: 290px;
                    width: 100%;
                    height: 28px;
                    background: var(--navy-color);
                    border: 1px solid #FFFFFF1A;
                    border-radius: 5px;
                    color: var(--white-color);
                    padding-left: 10px;
                }

                .area-dropdown-list {
                    display: block;
                    position: absolute;
                    top: 27px;
                    z-index: 2;
                    min-width: 290px;
                    width: 100%;
                    height: 142px;
                    background: var(--navy-color);
                    border: 1px solid #FFFFFF1A;
    
                    li {
                        width: 100%;
                        height: 28px;
                        margin-bottom: 0;
                        padding-left: 9px;
    
                        &:hover {
                            background: rgba(255, 255, 255, 0.22);
                        }
                    }
                }
            }
        }

        .receiverTable{
            display: block;
            /* width: 383px; */
            height: 112px;
            border-radius: 5px;
            border: solid 1px #525868;
            margin-bottom: 20px;
            padding-right: 6px;
            overflow: auto;
        }
 
        .receiverTable tbody{
            display: table;
            width: 100%;
        }

        .receiverTable tr{
            width: 100%;
        }

        .receiverTable tr td:nth-child(1){
            border-right: solid 1px #525868;
            width: 63px;
        }

        .receiverTable th,
        .receiverTable td{
             padding: 5px 8px;
             border-bottom: dashed 1px #525868;
             font-size: 12px;
             font-weight: 400;
             height: 31px;
             letter-spacing: 0.6px;
             vertical-align: middle;
             color: #D3D5D9;
        }


        .item-management-wrap {
            ${props => props.theme.variables.flex('flex-start')};
            font-size: 12px;
            letter-spacing: 0.6px;
            color: #D3D5D9;
            text-align: right;
            margin-bottom: 22px;
            padding-right: 10px;

            h5 {
                margin-bottom: 0;
            }

            a {
                margin-left: 10px;
                cursor: pointer;

                &:hover {
                    text-decoration: underline;
                }
            }

            /* toggle */

            .toggleBtn{
              display: table-row;
              background: #2E3750;
              border-radius: 50px;
              margin-left: 10px;
            }

            .button {
              position: relative;
              top: 50%;
              width: 108px;
              height: 24px;
              overflow: hidden;
            }

            .button.b2 {
              border-radius: 50px;
            }

            .toggleCheckbox {
              position: relative;
              width: 100%;
              height: 100%;
              padding: 0;
              margin: 0;
              opacity: 0;
              cursor: pointer;
              z-index: 3;
            }

            .toggleChange {
              z-index: 2;
            }

            .layer {
              width: 100%;
              background-color: #2E3750;
              transition: 0.3s ease all;
              z-index: 1;
            }


            #button-10 .toggleChange:before,
            #button-10 .toggleChange:after,
            #button-10 .toggleChange span {
              position: absolute;
              top: 0px;
              width: 56px;
              height: 24px;
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              line-height: 1;
              padding: 0px 4px;
              border-radius: 50px;
              transition: 0.3s ease all;
            }

            #button-10 .toggleChange:before {
              content: "";
              left: 0px;
              background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
            }

            #button-10 .toggleChange:after {
              content: "안전";
              right: -6px;
              top: 5px;
              color: #B3B3B3;
            }

            #button-10 .toggleChange span {
              display: inline-block;
              letter-spacing: 0;
              left: 4px;
              top: 5px;
              color: #FFFFFF;
              font-weight: 400;
              z-index: 1;
            }

            #button-10 .toggleCheckbox:checked + .toggleChange span {
              color: #B3B3B3;
            }

            #button-10 .toggleCheckbox:checked + .toggleChange:before {
              /* left: 42px; */
              left: 56px; 
              background-color: #f44336;
            }

            #button-10 .toggleCheckbox:checked + .toggleChange:after {
              color: #fff;
            }

            #button-10 .toggleCheckbox:checked ~ .layer {
              background-color: #2E3750;
            }
        }

        .item-management-right-wrap{
            display: block;
            flex: auto;
        }


        .item-list-wrap {
            max-height: calc(100% - 84px);

           .zoneUIBox{
                display: block;
                background: #0E162D;
                padding: 15px 10px;
                border-radius: 5px;
                margin-bottom: 20px;
                margin-right: 7px;
           }

           .zoneUITitle{
                display: flex;
                align-items: center;
                /* border-left: solid 4px #5398FF; */
                /* padding-left: 8px; */
                color: #5398FF;
                font-size: 14px;
                margin-bottom: 15px;
           }

           .squareBox{
                display: block;
                width: 4px;
                height: 4px;
                background: #5398FF;
                margin-right: 8px;
           }

           .subUITitle{
                display: block;
                height: 34px;
                line-height: 34px; 
                background: #272E42;
                padding-left: 10px;

                > p{
                   color: #FFFFFF;
                   font-size: 12px; 
                }
           }

           .subUIContents{
                 display: block;
                 background: #1A2238;
                 padding: 12px 0px;
                 margin-bottom: 10px;
            }

           .facilityUIBox{
                display: block;
                background: #0E162D;
                padding: 15px 10px;
                border-radius: 5px;
                margin-right: 7px;
           }

           .facilityUITitle{
                display: block;
                border-left: solid 4px #5398FF;
                padding-left: 8px;
                color: #FFFFFF;
                font-size: 14px;
                margin-bottom: 15px;
           }

            li {
                margin-bottom: 10px;
                font-size: 14px;
                position: relative;
                padding-right: 10px;

                &:hover button {
                    display: block;
                }
            }

            input[type="text"] {
                width: 100%;
                height: 28px;
                background: var(--navy-color);
                border: 1px solid #525868;
                color: var(--white-color);
                padding-left: 10px;
                margin-left: 35px;
            }
        
            label {
                display: block;
                position: absolute;
                left: 10px;
                top: 7px;
            }

            button {
                display: none;
                width: 12px;
                height: 12px;
                object-fit: none;
                margin-left: 10px;
                position: absolute;
                right: 20px;
                top: 8px;
            }
        }
    }
`


// 수신자 편집
export const EditReceiverComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    overflow: hidden;
    opacity: 1;
    width: 854px;

    .dslCont {
        /* padding: 20px 20px 67px 20px; */
        padding: ${_PopupsCommon[PR.styleMode].dslContReceiverPadding};
    }

    .dsiSchE {
        background: ${_PopupsCommon[PR.styleMode].dsiSchBackground};
        border: ${_PopupsCommon[PR.styleMode].dsiSchBorder};
        margin-top: ${_PopupsCommon[PR.styleMode].dsiSchMarginTop};
        margin-right: 0px;
        padding-right: ${_PopupsCommon[PR.styleMode].dsiSchPaddingRight};
        position: relative;
        border-radius: 4px;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
    }

    .dsiSchE input[type="text"] {
        display: block;
        height: 30px;
        padding-left: 10px;
        background: none;
        color: #fff;
        font-size: 12px;
        width: 100%;
        border: ${_PopupsCommon[PR.styleMode].dsiSchBorderInput};
        border-radius: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputTextRadius};
    }

    .dsiSchE a,
    .dsiSchE button,
    .dsiSchE input[type="submit"] {
        display: block;
        width: 30px;
        height: 30px;
        background: #f00;
        position: absolute;
        right: 0;
        top: 0;
        text-indent: -9999px;
        background: ${_PopupsCommon[PR.styleMode].dsiSchBackgroundImg};
        border-style: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputStyle};
        border-width: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputWidth};
        border-color: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputColor};
        border-radius: ${_PopupsCommon[PR.styleMode].dsiSchBorderInputSublitRadius};
    }
`

// 항목 불러오기
export const LoadSafetyListComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    overflow: hidden;
    opacity: 1;
    width: 854px;
    height: 458px;

    .dslCont {
        padding: 20px 10px 67px 20px;

        .safety-list-wrap {
            padding-right: 10px;

            .safety-item {
                width: 100%;
                height: 58px;
                background-color: var(--dashboard-color);
                border: 1px solid var(--dark-gray-color);
                border-radius: 5px;
                padding: 1px 20px 0 20px;
                margin-bottom: 10px;
                color: var(--white-color);
                font-size: 16px;
                position: relative;
                z-index: 1;

                ${props => props.theme.variables.flex()};

                .safety-item-id {
                    width: 15%;

                    input {
                        position: relative;
                        top: -1px;
                    }

                    span {
                        margin-left: 8px;
                    }
                }

                .safety-item-name {
                    width: 45%;
                    padding: 0 5px;
                    cursor: pointer;

                    &:hover {
                        color: var(--title-bar-text-blue-color);
                    }
                }

                .safety-item-date {
                    width: 35%;
                    padding: 0 5px;
                }

                .safety-item-delete-btn {
                    width: 5%;
                    text-align: right;

                    button {
                        width: 16px;
                        height: 18px;
                        background: url(${bin_icon}) no-repeat;

                        &:hover {
                            background: url(${bin_icon_hover}) no-repeat;
                        }
                    }
                }
            }

            .safety-item-detail {
                display: none;
                width: 100%;
                background-color: var(--dashboard-color);
                border: 1px solid var(--dark-gray-color);
                border-radius: 0 0 5px 5px;
                color: var(--white-color);
                font-size: 14px;
                padding: 20px;
                position: relative;
                top: -15px;
                z-index: 2;

                .safety-item-detail-wrap {

                    li:not(:last-child) {
                        padding-bottom: 22px;

                    }
                    li > span:first-child {
                        display: inline-block;
                        width: 40px;
                    }
                }
            }

            .safety-item-detail.on {
                display: block;
                -webkit-transition: all 0.5s ease-in-out;
                -moz-transition:all 0.5s ease-in-out;
                -o-transition:all 0.5s ease-in-out;
                transition:all 0.5s ease-in-out;
            }
        }
    }
`

//평가표 관리
export const EvaluationTableComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    overflow: hidden;
    opacity: 1;
    width: 1434px;
    height: 824px;

    .popupBox {
        position: relative;
        width: 1434px;
        height: 823px;
        background: rgba(14, 22, 45, 1);
        border: '1px solid #FFFFFF1A';
        border-radius: 6px;
        padding: 60px 20px 20px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .popupboxLine {
        background-color: rgba(255, 255, 255, 0.1);
        width: 100%;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: '5px 5px 0 0';
    }

    .popupBoxTitle {
        font-size: 16px;
        color: #5398FF;
        font-weight: 600;
        margin-bottom: 15px;
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 0;
        left: 20px;
    }

    .popupBoxX {
        position: absolute;
        right: 20px;
        top: 14px;
        cursor: pointer;
    }
    
    .popupBoxX img {
        width: 12px;
    }

    .popupContent {
        height: calc(100% - 36px);
        
        .menuWrap {
            width: 100%;
            border-bottom: 1px solid #A5A5A5;

            p {
                color: #fff;
                font-size: 14px;
                width: 60px;
                padding: 0 15px 7px 15px;
                border-bottom: 3px solid #5398FF;
                text-align: center;
                position: relative;
                bottom: -2px;
            }
        }

        .evaluationList{
                display: block;
                margin-bottom: 20px;
        }

        .evaluationListUI{
            display: flex;
            color: #FFFFFF;
        }
        .evaluationListUI li{
            height: 31px;
            line-height: 31px;
            text-align: center;
            background: #17203B;
            border-bottom: solid 1px #525868;
            font-size: 12px;
            letter-spacing: 0px;
        }

        /* .evaluationListUI li input[type="checkbox"]{
            display: inline-block;
            vertical-align: middle;
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 2px;
            cursor: pointer;
        }

        .evaluationListUI li input[type="checkbox"]:checked{
            border: solid 1px #707070;
            background: #fff url(${CheckMark}) no-repeat center center;
            background-size: 8px !important;
        } */

        .evaluationCheckbox{
            display: none;

            &.on{
                display: inline-block;
                vertical-align: middle;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 2px;
                cursor: pointer;
            }
         }

        .evaluationCheckbox:checked{
            border: solid 1px #707070;
            background: #fff url(${CheckMark}) no-repeat center center;
            background-size: 8px !important;
         }


        /* .evaluationListTd li input[type="checkbox"]{
            display: inline-block;
            vertical-align: middle;
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 2px;
            cursor: pointer;
        }

        .evaluationListTd li input[type="checkbox"]:checked{
            border: solid 1px #707070;
            background: #fff url(${CheckMark}) no-repeat center center;
            background-size: 8px !important;
        } */

        .qCheckbox{
           display: none;

           &.on{
                display: inline-block;
                vertical-align: middle;
                width: 12px;
                height: 12px;
                background: #fff;
                border-radius: 2px;
                cursor: pointer;
           }
        }

       .qCheckbox:checked{
            border: solid 1px #707070;
            background: #fff url(${CheckMark}) no-repeat center center;
            background-size: 8px !important;
        }



        .evaluationListTd li input[type="text"]{
            display: inline-block;
            vertical-align: middle;
            width: 145px;
            height: 26px;
            /* background: rgba(14, 22, 45, 1); */
            background: none;
            text-align: center;
            cursor: pointer;
            border: none;
            color: #fff;

            &.on{
               border: solid 1px #CCCCCC;
               background: url(${PeopleIcon}) no-repeat 96% 50%;

            } 
        }

        .evaluationListTd li input[type="text"]::placeholder{
            color: #fff;
        }

        .evaluationListTd li > div{
            display: inline-block;
            vertical-align: middle;
            width: 210px;
            height: 26px;
            line-height: 26px;
            /* background: rgba(14, 22, 45, 1); */
            background: none;
            text-align: center;
            cursor: pointer;
            border: none;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            /* padding: 0px 30px 0px 6px; */

            &.on{
               border: solid 1px #CCCCCC;
               background: url(${PeopleIcon}) no-repeat 96% 50%;
            }
         }

        .evaluationlistScrollbar{
            width: calc(100% + 10px);
            height: 650px;
            padding-right: 5px;
            overflow-y: scroll;
        }


       .evaluationListTd{
            display: flex;
            color: #FFFFFF;

            &.on{
              background: #5398FF !important;
              color: #fff;
            }
        }

        .evaluationListTd li{
            height: 44px;
            line-height: 44px;
            text-align: center;
            border-bottom: solid 1px #525868;
            font-size: 12px;
        }

        .evaluationContentWrap{
            display: none;
            border-bottom: solid 1px #525868;
            border: solid 1px #525868;
            height: 415px;
            /* overflow: auto; */

            &.on{
               display: block;
            }
        }

        .evaluationContentWrap > div > p{
            color: #fff;
            padding: 7px 16px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
            
         }

        .evaluationContentWrap > div > p:last-child{
             margin-bottom: 8px;
        }

        .evaluationCTitle{
             display: block;
             height: 34px;
             line-height: 34px;
             color:#5398FF;
             padding-left: 16px;
             margin-bottom: 8px;
             background: #05070F;
        }

        .zoneUIBox{
            display: block;
            background: #0E162D;
            padding: 15px 10px;
            border-radius: 5px;
            margin-right: 7px;
         }

         .zoneUITitle{
            display: flex;
            align-items: center;
            /* border-left: solid 4px #5398FF; */
            /* padding-left: 8px; */
            color: #5398FF;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
         }

         .squareBox{
            display: block;
            width: 4px;
            height: 4px;
            background: #5398FF;
            margin-right: 8px;
         }

         .subUITitle{
            display: block;
            height: 34px;
            line-height: 34px;
            background: #272E42;
            padding-left: 10px;

            > p{
                color: #FFFFFF;
                font-size: 12px;
                font-weight: 200;
                letter-spacing: 0px;
            }
         }

         .subUIContents{
             display: block;
             background: #1A2238;
             /* padding: 12px 0px; */
             margin-bottom: 10px;
         }
         .subUIFlex{
             display: flex;
             height: 38px;
             line-height: 36px; 
             color: #fff;
             font-size: 12px;
             font-weight: 200;
             padding-left: 12px;
         }
         .subUIFlex > span:nth-child(1){
             padding-right: 4px;
         }


        .buttonWrap {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 9px;
            width: 100%;
            position: absolute;
            bottom: 20px;

            &.on{
                display: block;
            } 

            li {
                width: 96px;
                height: 35px;
                border-radius: 4px;
                line-height: 35px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;

                &.cancelBtn {
                    background-color: #000000;
                    color: #A5A5A5;
                }

                &.saveBtn {
                    background-color: #5398ff;
                    color: #fff;
                }
            }
        }
        
        .userList + .buttonWrap {
            bottom: 24px;
            left: 0;
        }
    }
`;


//메일 발송주기 설정
export const SmsSettingComponent = styled.div`
    position: absolute;
    top: 71%;
    left: 46.9%;
    transform: translate(284%, -255%); 
    opacity: 1;

    .smsPopImage{
        display: none; 
        background: url(${PopImage}) no-repeat center center;
        width: 203px;
        height: 201px;
        padding: 38px 30px;

       &.on{
           display: block;
       }
    }

    /* .smsArrow{
        display: inline-block;
        width: 33px;
        height: 28px;
        background: url(${SmsArrow}) no-repeat center center;
        position: absolute;
        right: 10px;
        top: -15px;
        z-index: 1;
    } */

    .smsTitle{
        display: block;
        color: #5398FF;
        font-size: 16px;
        font-weight: SemiBold;
        margin-bottom: 11px;

       &.on{
          display: none;
       }
    }

    .smsTab{
       display: inline-block;
       color: #A5A5A5;
       font-size: 12px;
       font-weight: Medium;
       margin-left: 4px;
    }

    .smsConts {
        display: flex;
        align-items: center;
        height: 14px;
        margin-bottom: 10px;

        &.on{
            display: block;
        }
    }

    .smsConfirmBox{
        display: flex;
        justify-content: flex-end;
        padding-top: 8px;
    }

    .smsConfirmBox > a:nth-child(1){
        color: #fff;
        width: 68px;
        height: 28px;
        line-height: 26px;
        border-radius: 5px;
        border: 1px solid #FFFFFF1A;
        margin-right: 10px;
        text-align: center;
        cursor: pointer;
    }
    .smsConfirmBox > a:nth-child(2){
        color: #fff;
        width: 68px;
        height: 28px;
        line-height: 26px;
        border-radius: 5px;
        border: 1px solid #FFFFFF1A;
        text-align: center;
        background: transparent linear-gradient(180deg, #5398FF 0%, #005FEC 100%) 0% 0% no-repeat padding-box;
        cursor: pointer;
    }

`



/**********************************************************************/
// 안전구역 평가 - 이력데이터(원익)
export const HistoryDataComponent = styled(PopupsCommon)`
    position: absolute;
    top: 60px;
    left: 426px;
    width: 423px;
    height: 741px;
    overflow: hidden;
    opacity: 1;

    .dslCont {
        padding: 20px 10px 60px 20px;
        color: var(--white-color);

        h5 {
            color: var(--settings-color);
            font-size: 16px;
            letter-spacing: 0.8px;
            font-weight: 600;
            margin-bottom: 20px;
        }
   }

   .alarmDetectTitle{
        display: flex; 
        margin-bottom: 17px;
        color: #FFD753;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.8px;
        flex:1;
   }

   .safetyGraphArea{ height: calc(100% - 50px); }

   .alarmDetectLabel{
        display: flex;
        height: 16px;
        justify-content: end;
        align-items: center;
   }

   .alarmLabelLine1{ display: block; width: 8px; height: 2px; background: #FF6453; margin-right: 6px; }
   .labelText1{ display: block; font-size: 12px; color: #FF6453; margin-right: 10px; }

   .alarmLabelLine2{ display: block; width: 8px; height: 2px; background: #4788EA; margin-right: 6px; }
   .labelText2{ display: block; font-size: 12px; color: #4788EA; margin-right: 10px; }

   .alarmLabelLine3{ display: block; width: 8px; height: 2px; background: #53FFA9; margin-right: 6px; }
   .labelText3{ display: block; font-size: 12px; color: #53FFA9; margin-right: 10px; }


   .alarmDetectGraph{
        display: block;
        width: 100%;
        height: calc(100% - 80px);
   }

   .safetyChecklistArea{
        display: block;
        width: 100%;
        height: calc(100% - 50px);
   }

   .safetyChecklistTitle{
        display: block; 
        margin-top: 20px;
        margin-bottom: 10px;
        color: #FFD753;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.8px;
   }

   .safetyChecklistTableBox{
        display: block; 
        height: 396px;
   }

   .safetyChecklistBox{
        display: block;
        /* width: 383px; */
        /* height: 396px; */
        border: solid 1px #525868;
        margin-bottom: 20px;
        margin-right: 10px;
        /* overflow: auto; */
        
   }
   /* .safetyChecklistTable tBody{
        display: table;
        width: 100%;
   }

    .safetyChecklistTable thead tr{
        width: 100%;
        background: #17203B;
    }

    .safetyChecklistTable thead tr th{
        border-right: dashed 1px #525868;
        color: #FFFFFF;
    }

    .safetyChecklistTable tr td:nth-child(1){
        width: 73px;
    }

    .safetyChecklistTable tbody tr{
        height: 34px;
    }

    .safetyChecklistTable th,
    .safetyChecklistTable td{
        padding: 5px 8px;
        border-bottom: solid 1px #525868;
        font-size: 12px;
        font-weight: 400;
        height: 28px;
        letter-spacing: 0.6px;
        vertical-align: middle;
        color: #D3D5D9;
    } */

    .safetyChecklistBoxUl{
        display: flex;
        color: #FFFFFF;
    }

    .safetyChecklistBoxUl li{
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #17203B;
        border-right: dashed 1px #525868;
        border-bottom: solid 1px #525868;
        font-size: 12px;

    }

    .safetyChecklistBoxUl li:last-child{
        border-right: none;
    }

    .safetyChecklistBoxUl_B{
        display: flex;
        color: #FFFFFF;
        border-top: solid 1px #525868; 
        margin-right: 14px;

        &.on{
          background: #5398FF !important;
          color: #fff;
        }
    }

    .safetyChecklistBoxUl_B li{
        height: 34px;
        line-height: 34px;
        text-align: center;
        /* background: #17203B; */
        border-bottom: solid 1px #525868;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding: 0px 10px;
    }

    .safetyChecklistBoxUl_B li:last-child{
        border-right: none;
    }


    /* 임시 */
    .safetyChecklistBoxUl_B_On{
        display: flex;
        background: #5398FF !important;
        color: #fff;
    }

    .safetyChecklistBoxUl_B_On li{
        height: 34px;
        line-height: 34px;
        text-align: center;
        background: #17203B;
        border-bottom: solid 1px #525868;
        font-size: 12px;

    }

    .safetyInspectionContentWrap{
        /* display: none; */
        /* padding: 12px 10px; */
        /* background: #0E162D; */
        display: block;
        margin-right: 14px;
        height: 100%;

        &.on{
           display: block;
           margin-right: 10px;
        }
    }

    .safetyInspectionWrapPadding{
        display: block;
        margin: 10px;
    }
    .safetyInspectionContents{
        display: block;
        height: 100%;
        padding: 10px;
        background: #0E162D;
    }
    .safetyInspectionBox{
        display: flex;
        align-items: center;
        border-bottom: dashed 1px #525868;
        padding-bottom: 10px;
    }
    .safetyInspectionTitle{
        font-size: 14px;
        font-weight: 800;
        color: #5398FF;
        border-left: solid 4px #5398FF;
        padding-left: 8px;
        flex: 1;
    }
    .safetyInspectionName{
        display: block;
        width: 76px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        color: #D3D5D9;
        font-size: 14px;
        border: solid 1px #525868;
        border-radius: 20px;
        letter-spacing: 0px;
    }
    .safetyInspectionFlex{
        display: flex;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .safetyInspectionFlex > p{
        color: #5398FF;
        font-size: 14px;
        margin-left: 8px;
    }
    .safetyInspectionSquare{
        display: block;
        width: 4px;
        height: 4px;
        background: #5398FF;
    }
    .subClassBox{
        /* background: #1A2238; */
    }
    .subClassTitle{
        display: block;
        height: 34px;
        line-height: 32px;
        padding: 0px 10px;
        background: #272E42;
        color: #FFFFFF;
        font-size: 12px;
    }
    .subClassConts{
        padding: 13px 10px;
        background: #1A2238;
        margin-bottom: 10px;
    }
    .subClassConts:last-child{
        padding: 13px 10px;
        background: #1A2238;
        margin-bottom: 20px;
    }

    .subLineBox{
        display: flex;
        justify-content: space-between;
        color: #FFFFFF;
        font-size: 12px;
        font-weight: 200;
        letter-spacing: 0px;
    }
    .subTextBox{
        display: block;
        border: solid 1px #525868;
        height: 28px;
        margin: 10px 0px;
        color: #ffffff;
        padding: 6px 10px;
        font-size: 12px;
        font-weight: 200;
        overflow-y: auto;
    }

    .subTextBox::-webkit-scrollbar {
        width: 5px;
        height: 2px;
    }

    .subTextBox::-webkit-scrollbar-button {
        width: 0;
        height: 2px;
    }

    .subTextBox::-webkit-scrollbar-thumb {
        background-color: 
    }
    .subTextBox::-webkit-scrollbar-track {
        background-color: #0E162D;
        border-radius: 10px;
    }

    .subTextBox::-webkit-scrollbar-thumb {
        background-color: #3C4143;
        border-radius: 17.992px;
        border: 2px solid transparent;
        cursor: pointer;
    }


    .safetyChecklistScrollbar{
        height: 360px;
        width: calc(100% + 16px);
        margin-right: 10px;
    }

    .safetyHistoryZone{
        display: flex;
        padding: 15px 10px;
        align-items: center;
        border-bottom: dashed 1px #525868;
        margin: 10px 10px 0px 10px;
        background: #0E162D;
    }

    .safetyHistoryZone > p{
        font-size: 14px;
        font-weight: 800;
        color: #5398FF;
        border-left: solid 4px #5398FF;
        padding-left: 8px;
        flex: 1;
    }

    .safetyHistoryZone > span{
        display: block;
        width: 76px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        color: #D3D5D9;
        font-size: 14px;
        border: solid 1px #525868;
        border-radius: 20px;
    }

    .safetyHistoryZoneConts{
        color: #D3D5D9;
        display: flex;
        padding: 6px 11px;
        font-size: 12px;
        background: #0E162D;
        margin: 0px 10px;
    }

    .safetyHistoryZoneConts li:nth-child(2){
        flex: 1;
    }

    .facilityZone{
        display: flex;
        padding: 15px 10px;
        align-items: center;
        border-bottom: dashed 1px #525868;
        margin-bottom: 5px;
        margin: 0px 10px 0px 10px;
        background: #0E162D;
    }

    .facilityZone > p{
        font-size: 12px;
        color: #5398FF;
        flex: 1;
    }

    .facilityZone > span{
        display: block;
        width: 68px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        color: #5398FF;
        background: #272E42;
        font-size: 12px;
    }

    .facilityZoneConts{
        color: #D3D5D9;
        display: flex;
        padding: 6px 11px;
        font-size: 12px;
        background: #0E162D;
        margin: 0px 10px;
    }

    .facilityZoneConts li:nth-child(2){
        flex: 1;
    }

    .facilityZoneContsDiv{
        display: block;
        /* height: 68px; */
        background: #0E162D;
        margin: 0px 10px 10px 10px;
    }

    .facilityZoneContsSpan{
        display: inline-block;
        width: calc(100% - 20px);
        height: 68px;
        border: solid 1px #D3D5D9;
        margin: 12px 10px;
        padding: 10px;
        color: #fff;
        overflow: auto;
        font-size:12px;
        font-weight: 200;
        line-height: 16px;
    }
    .safetyInspectArea{

    }

    .sInspectTitle{
        display: block;
        color: #5398FF;
        font-size: 12px;
        font-family: 'Pretendard';
        padding-bottom: 10px;
     }
    .sInspectFlex{
        display: flex;
    }
    .sInspectFlex p:nth-child(1){
        color: #D3D5D9;
        font-size: 12px;
        letter-spacing: 0px;
        padding-bottom: 12px;
        flex: 1;
    }
    .sInspectFlex p:nth-child(2){
        color: #D3D5D9;
        font-size: 12px;
        letter-spacing: 0px;
        padding-bottom: 12px;
        padding-right: 10px;
    }




`


/**********************************************************************/
//이상 탐지(수소충전소)
export const DetectionInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -48%);
    overflow: hidden;
    opacity: 1;
    width: 1400px !important;
    height: calc(100% - 150px) !important;
    max-height: 940px !important;
    border-radius: 8px;
    background: #1E1E1E;
    backdrop-filter: blur(5px);

    .dslTop {
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        padding: 14px;
        ${(props) => props.theme.variables.flex('flex-start', 'center')};

        h5 {
            color: #B6C6D2;
            font-size: 14px;
            font-weight: 700;
        }

        .dslX {
            right: 15px;
        }
    }

    .contents {
        height: calc(100% - 45px);
        ${(props) => props.theme.variables.flex('flex-start', 'stretch')};
        gap: 12px;
        flex-direction: column;
        padding: 12px;

        > div {
            flex: 1 1 0;
            min-height: 0;
        }

        .chartWrap,
        .detailWrap,
        .dataWrap {
            > p {
                padding: 10px 12px;
                border-bottom: 1px solid #292D2E;
                color: #FFF;
                font-size: 14px;
                font-weight: 500;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
            }
        }

        .chartWrap {
            background: #131313;
            border-radius: 4px;
            border: 1px solid #292D2E;

            .filterWrap {
                ${(props) => props.theme.variables.flex('center', 'center')};
                gap: 12px;
                padding: 12px;
                border-bottom: 1px solid #292D2E;

                ul {
                    flex: 1;
                    ${(props) => props.theme.variables.flex('center', 'center')};
                    gap: 12px;

                    li {
                        flex: 1;
                        ${(props) => props.theme.variables.flex('flex-start', 'center')};
                        border-radius: 4px;
                        border: 1px solid #464B4E;
                        background: #131313;

                        > p {
                            width: auto;
                            ${(props) => props.theme.variables.flex('center', 'center')};
                            padding: 8px 20px;
                            background: rgba(182, 198, 210, 0.07);
                            color: #FFF;
                            font-size: 14px;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                        }

                        > select {
                            flex: 1;
                            padding: 0 16px;
                            color: #939393;
                            font-size: 14px !important;
                            line-height: 172%; /* 24.08px */
                            letter-spacing: -0.42px;
                            background: transparent url(${selectArrowIcon}) 93% 50% no-repeat;
                        }
                    }
                }

                button {
                    ${(props) => props.theme.variables.flex('center', 'center')};
                    width: 74px;
                    height: 40px;
                    padding: 0 16px;
                    border-radius: 6px;
                    background: #0085FF;
                }
            }

            .chart {
                position: relative;
                width: 100%;
                height: calc(100% - 112px);
                display: flex;
                flex-direction: column;
            }

            .time {
                ${(props) => props.theme.variables.flex('flex-end', 'center')};
                gap: 12px;
                position: absolute;
                top: 22px;
                right: 36px;
                z-index: 2;
            }

        }

        .infoWrap {
            ${(props) => props.theme.variables.flex('center', 'center')};
            gap: 12px;

            > div {
                height: 100%;
                border-radius: 4px;
                border: 1px solid #292D2E;
                background: #131313;
            }

            .detailWrap {
                flex: 1;

                > div {
                    padding: 12px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    height: calc(100% - 46px);
                    ${(props) => props.theme.variables.scroll()};

                    .head {
                        ${(props) => props.theme.variables.flex('center', 'center')};
                        border-bottom: 2px solid #292D2E;
                        background: rgba(182, 198, 210, 0.07);

                        > li {
                            flex: 1;
                            padding: 4px 12px;
                            color: #FFF;
                            font-size: 12px;
                            font-weight: 500;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                            
                            &:not(:last-child) {
                                border-right: 1px solid #292D2E;
                            }
                        }
                    }

                    .body {
                        border: 1px solid #292D2E;

                        > li {
                            ${(props) => props.theme.variables.flex('center', 'center')};
                            border-bottom: 1px solid #292D2E;

                            > p {
                                flex: 1;
                                padding: 4px 12px;
                                color: #FFF;
                                font-size: 12px;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;

                                &:not(:last-child) {
                                    border-right: 1px solid #292D2E;
                                }
                            }

                            &.on {
                                > p {
                                    color: #FF3632;
                                }
                            }
                        }

                        &.empty {
                            border: 0;

                            > li {
                                border: 0;
                                margin-top: 110px;

                                > p {
                                    text-align: center;
                                    color: #787C87;
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
            }

            .dataWrap {
                flex: 2;

                .diagnosisContent {
                    ${(props) => props.theme.variables.flex('center', 'flex-start')};
                    height: calc(100% - 45px);

                    > div {
                        flex: 1;
                        padding: 12px;
                        height: 100%;
                        
                        p {
                            width: 100%;
                            color: #FFF;
                            font-size: 12px;
                            line-height: 12px; 
                            background: rgba(182, 198, 210, 0.07);
                            padding: 8px 10px;
                            margin-bottom: 12px;

                            &::before {
                                content: '▶';
                                display: inline-block;
                                width: 8px;
                                height: 8px;
                                margin-right: 8px;
                                font-size: 8px;
                            }
                        }
                    }

                    .compareSection {
                        border-right: 1px solid #292D2E;
                        overflow-x: hidden;
                        overflow-y: auto;
                        ${(props) => props.theme.variables.scroll()};
                    }

                    .detailsSection {
                        ${(props) => props.theme.variables.flex('flex-start', 'flex-start')};
                        flex-direction: column;

                        > div {
                            flex: 1;
                            width: 100%;
                        }

                        .diagnosisResult {
                            > div {
                                padding: 0 12px 12px 12px;

                                > span {
                                    color: #FFF;
                                    font-size: 12px;
                                    line-height: 170%; /* 20.4px */
                                    letter-spacing: -0.36px;
                                }
                            }
                        }
                    }
                    
                    .empty {
                        margin-top: 110px;
                        
                        > span {
                            text-align: center;
                            color: #787C87;
                            font-size: 12px;
                            display: block;
                        }
                    }
                }
            }
        }
    }
`

//시뮬레이션(수소충전소)
export const SimulationInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -48%);
    overflow: hidden;
    opacity: 1;
    width: 1400px !important;
    height: calc(100% - 150px) !important;
    max-height: 940px !important;
    border-radius: 8px;
    background: #1E1E1E;
    backdrop-filter: blur(5px);

    [data-tooltip] {
        position: relative;
        z-index: 2;
    }

    [data-tooltip]:before,
    [data-tooltip]:after {
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
    }

    [data-tooltip]:before {
        content: attr(data-tooltip);
        position: absolute;
        top: 50%;
        left: 27px;
        transform: translate(0, -50%);
        padding: 4px 8px;
        white-space: nowrap;
        border-radius: 4px;
        background-color: #565B69;
        color: #ffffff;;
        font-size: 14px;
        font-weight: 500;
        line-height: 172%; /* 24.08px */
        letter-spacing: -0.42px;
    }

    [data-tooltip]:after {
        content: " ";
        position: absolute;
        border-right: 10px solid #565B69;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        transform: translate(0, -50%); 
        top: 50%; 
        left: 20px;
    }
    
    [data-tooltip]:hover:before,
    [data-tooltip]:hover:after {
        visibility: visible;
        opacity: 1;
    }

    .dslTop {
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        padding: 14px;
        ${(props) => props.theme.variables.flex('flex-start', 'center')};

        h5 {
            color: #B6C6D2;
            font-size: 14px;
            font-weight: 700;
        }

        .dslX {
            right: 15px;
        }
    }

    .contents {
        height: calc(100% - 45px);
        padding: 14px;
        ${(props) => props.theme.variables.flex('flex-start', 'stretch')};
        gap: 8px;

        > div {
            height: 100%;
            border-radius: 4px;
            border: 1px solid #292D2E;
            background: #131313;

            p {
                width: 100%;
                color: #FFF;
                font-size: 14px;
                font-weight: 500;
                line-height: 172%; /* 24.08px */
                letter-spacing: -0.42px;
                padding: 11px 12px 10px 12px;
                border-bottom: 1px solid #292D2E;
                ${(props) => props.theme.variables.flex('flex-start', 'center')};
                gap: 8px;

                &::before {
                    content: '';
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                }
            }

            ul {
                ${(props) => props.theme.variables.flex()};
                gap: 14px;
                padding: 0 12px;
                margin-bottom: 14px;

                &:nth-child(2) {
                    margin-top: 12px;
                }

                & * {
                    color: #ffffff;
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }

                > li {
                    flex: 1;

                    > div {
                        &:nth-child(1) {
                            ${(props) => props.theme.variables.flex('flex-start', 'center')};
                            gap: 8px;
                            margin-bottom: 8px;
                        }

                        &:nth-child(2) {
                            position: relative;

                            input, select {
                                width: 100%;
                                border-radius: 4px;
                                border: 1px solid #464B4E;
                                height: 40px;
                                padding: 0 35px 0 16px;
                            }

                            input {
                                background-color: transparent;
                            }

                            select {
                                background: transparent url(${selectArrowIcon}) 93% 50% no-repeat;

                                option {
                                    background-color: #131313;
                                }
                            }

                            > span {
                                position: absolute;
                                top: 50%;
                                right: 16px;
                                transform: translate(0, -50%);
                            }
                        }
                    }
                }
            }

            .selectWrap {
                width: calc(100% - 24px);
                ${(props) => props.theme.variables.flex('flex-start', 'center')};
                border-radius: 4px;
                border: 1px solid #464B4E;
                background: #131313;
                margin: 12px;

                > span {
                    width: auto;
                    ${(props) => props.theme.variables.flex('center', 'center')};
                    padding: 8px 20px;
                    background: rgba(182, 198, 210, 0.07);
                    color: #FFF;
                    font-size: 14px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                }

                > select {
                    flex: 1;
                    padding: 0 16px;
                    color: #939393;
                    font-size: 14px !important;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    background: transparent url(${selectArrowIcon}) 93% 50% no-repeat;

                    option {
                        background-color: #131313;
                    }
                }

            }
        }

        .settingsWrap {
            width: 338px;
            ${(props) => props.theme.variables.flex('space-between', 'stretch')};
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
            position: relative;

            > div {
                > div {
    
                    &:first-child {
                        border-bottom: 1px solid #292D2E;
                    }
    
                    p:before {
                        background: url(${settingIcon}) no-repeat center center;
                    }
                }
            }

            .btnWrap {
                width: 100%;
                ${(props) => props.theme.variables.flex('center', 'center')};
                gap: 8px;
                margin: 20px 0;

                > button {
                    width: 74px;
                    ${(props) => props.theme.variables.flex('center', 'center')};
                    border-radius: 6px;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    padding: 6px 0;
                }

                .reset {
                    border: 1px solid #888C94;
                    background-color: transparent;
                    color: #888C94;
                }

                .confirm {
                    border: 1px solid #0085FF;
                    background: #0085FF;
                    color: #000000;
                }
            }
        }

        .resultWrap {
            flex: 1;

            p:before {
                background: url(${resultIcon}) no-repeat center center;
            }

            .headWrap {
                ${(props) => props.theme.variables.flex('center', 'center')};
                border-bottom: 1px solid #292D2E;
                gap: 12px;
                padding: 12px;

                .selectWrap {
                    flex: 1;
                    margin: 0;

                    > select {
                        background-position-x: 97%;
                    }
                }

                > button {
                    ${(props) => props.theme.variables.flex('center', 'center')};
                    gap: 8px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    padding: 8px 16px;
                    border: 1px solid #0085FF;
                    background: #0085FF;
                    color: #000000;
                    white-space: nowrap;

                    &::before {
                        content: '';
                        display: inline-block;
                        width: 24px;
                        height: 24px;
                        background: url(${downloadIcon}) no-repeat center center;
                    }
                }
            }

            .chartWrap {
                padding: 14px 24px;
                overflow-y: auto;
                overflow-x: hidden;
                height: calc(100% - 114px);

                > div {
                    width: 100%;

                    &:not(:last-child) {
                        margin-bottom: 24px;
                    }

                    .title {
                        color: #FFF;
                        font-size: 14px;
                        letter-spacing: -0.42px;
                        margin-top: 6px;
                        margin-bottom: 18px;
                        ${(props) => props.theme.variables.flex('flex-start', 'center')};

                        &::before {
                            content: '▶';
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            margin-right: 8px;
                            font-size: 8px;
                        }
                    }
                }
            }

            .chargeInfo {

                ul {
                    padding-left: 0;

                    li {
                        border-radius: 4px;
                        border: 1px solid #292D2E;
                        overflow: hidden;
                        ${(props) => props.theme.variables.flex('flex-start', 'center')};
                        
                        span {
                            font-size: 12px;
                            line-height: 170%; /* 20.4px */
                            letter-spacing: -0.36px;
                        }

                        > span {
                            ${(props) => props.theme.variables.flex('center', 'center')};
                            border-right: 1px solid #292D2E;
                            background: rgba(182, 198, 210, 0.07);
                            padding: 8px 0;
                            min-width: 84px;
                            max-width: 138px;
                            flex: 1;
                        }

                        > div {
                            flex: 1;
                            ${(props) => props.theme.variables.flex()};
                            padding: 0 12px;

                            > span {
                                position: static;
                                transform: translate(0, 0);
                            }
                        }
                    }
                }
            }
        }
    }
`;

const glowLoop = keyframes`
    0% {
        box-shadow: 0 0 0 0 #0085FF;
    }
    50% {
        box-shadow: 0 0 15px 0 #0085FF;
    }
    100% {
        box-shadow: 0 0 0 0 #0085FF;
    }
`;

//위험성 평가 예측(수소충전소)
export const AnalysisInfoComponent = styled(PopupsCommon)`
    position: absolute;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -48%);
    overflow: hidden;
    opacity: 1;
    width: 1400px !important;
    height: calc(100% - 150px) !important;
    max-height: 940px !important;
    border-radius: 8px;
    background: #1E1E1E;
    backdrop-filter: blur(5px);

    .dslTop {
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);
        padding: 14px;
        ${(props) => props.theme.variables.flex('flex-start', 'center')};

        h5 {
            color: #B6C6D2;
            font-size: 14px;
            font-weight: 700;
        }

        .dslX {
            right: 15px;
        }
    }

    .contents {
        height: calc(100% - 45px);
        padding: 14px;
        ${(props) => props.theme.variables.flex('center', 'center')};
        gap: 12px;

        > section {
            height: 100%;
            border-radius: 4px;
            border: 1px solid #292D2E;
            background: #131313;

            &:nth-child(1) {
                flex: 0 0 432px;
            }

            &:nth-child(2) {
                flex: 1;
            }
        }

        .searchWrap {
            padding: 12px;

            .menus {
                ${(props) => props.theme.variables.flex('center', 'center')}; 
                margin-bottom: 12px;

                > li {
                    flex: 1;
                    height: 100%;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 172%; /* 27.52px */
                    letter-spacing: -0.48px;
                    padding: 19px 0;
                    text-align: center;
                    cursor: pointer;
                    color: #3C4143;
                    border-bottom: 1px solid #3C4143;
                    white-space: nowrap;
                    
                    &.on {
                        color: #0085FF;
                        border-bottom: 2px solid #0085FF;
                    }
                }
            }

            .options {
                ${(props) => props.theme.variables.flex('center', 'center')};
                flex-direction: column;
                gap: 12px;
                width: 100%;
                margin-bottom: 12px;

                li {
                    width: 100%;
                    ${(props) => props.theme.variables.flex('flex-start', 'center')};
                    border-radius: 4px;
                    border: 1px solid #464B4E;
                    background: #131313;

                    > p {
                        min-width: 120px;
                        max-width: 146px;
                        flex: 1;
                        ${(props) => props.theme.variables.flex('center', 'center')};
                        padding: 8px 20px;
                        background: rgba(182, 198, 210, 0.07);
                        color: #FFF;
                        font-size: 14px;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                    }

                    > select {
                        flex: 1;
                        padding: 0 16px;
                        color: #939393;
                        font-size: 14px !important;
                        line-height: 172%; /* 24.08px */
                        letter-spacing: -0.42px;
                        background: transparent url(${selectArrowIcon}) 93% 50% no-repeat;
                    }
                }
            }

            button {
                ${(props) => props.theme.variables.flex('center', 'center')};
                width: 100%;
                height: 40px;
                padding: 0 16px;
                border-radius: 6px;
                background: #0085FF;
            }
        }

        .resultWrap {
            padding: 12px 0 12px 12px;

            .infos {
                ${(props) => props.theme.variables.flex()};
                margin-bottom: 8px;
                padding-right: 12px;

                p, span {
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 170%;
                    letter-spacing: -0.36px;
                }

                p {
                    color: #FFF;
                }

                span {
                    color: #0085FF;
                }

                > div {
                    ${(props) => props.theme.variables.flex('flex-end', 'center')};
                    gap: 5px;
                }

                .sortBtn {
                    width: 15px;
                    height: 10px;

                    &.az {
                        background: url(${sort_icon})no-repeat center center;
                    }

                    &.za {
                        transform: rotate(180deg);
                        background: url(${sort_icon})no-repeat center center;
                    }
                }
            }

            .cards {
                overflow-y: auto;
                overflow-x: hidden;
                height: calc(100% - 27px);
                padding: 1px 8px 1px 1px;
                ${(props) => props.theme.variables.scroll()};

                > li {
                    width: 100%;
                    padding: 20px;
                    border-radius: 4px;
                    border: 1px solid #292D2E;
                    background: #131313;
                    cursor: pointer;

                    &:not(:last-child) {
                        margin-bottom: 12px;
                    }

                    p {
                        color: #fff;
                        white-space: pre-line;
                    }

                    .head {
                        ${(props) => props.theme.variables.flex('flex-start', 'center')};
                        gap: 8px;
                        margin-bottom: 24px;

                        > p {
                            &.risk {
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: 12px; /* 100% */
                                padding: 4px;
                                border-radius: 2px;
                            }

                            &.name {
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 700;
                                line-height: 14px; /* 100% */
                            }
                        }
                    }

                    .body {
                        > li {
                            ${(props) => props.theme.variables.flex('flex-start', 'center')};
                            gap: 12px;

                            &:not(:last-child) {
                                margin-bottom: 8px;
                            }

                            > p {
                                font-size: 12px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: 170%; /* 20.4px */
                                letter-spacing: -0.36px;

                                &:nth-child(1) {
                                    flex: 0 0 100px;
                                    color: #CECFD2;
                                }

                                &:nth-child(2) {
                                    flex: 1;
                                }
                            }

                            > div {
                                ${(props) => props.theme.variables.flex('flex-start', 'center')};
                                gap: 12px;
                            }
                        }
                    }

                    &.on {
                        box-shadow: 0 0 2px 0 #0085FF;
                    }
                }
            }
        }

        .diagramWrap {
            ${(props) => props.theme.variables.flex('flex-start', 'center')};
            flex-direction: column;

            .title {
                width: 100%;
                padding: 12px;
                border-bottom: 1px solid #292D2E;
                ${(props) => props.theme.variables.flex()};

                > p {
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 172%; /* 24.08px */
                    letter-spacing: -0.42px;
                    color: #FFF;
                }

                > ul {
                    ${(props) => props.theme.variables.flex()};
                    gap: 8px;

                    > li {
                        color: #FFF;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 170%; /* 20.4px */
                        letter-spacing: -0.36px;
                        ${(props) => props.theme.variables.flex('flex-start', 'center')};
                        gap: 4px;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            border-radius: 1px;
                        }

                        &:nth-child(1)::before {
                            background: #0663FF;
                        }

                        &:nth-child(2)::before {
                            background: #29A33B;
                        }

                        &:nth-child(3)::before {
                            background: #F9B716;
                        }

                        &:nth-child(4)::before {
                            background: #F97316;
                        }

                        &:nth-child(5)::before {
                            background: #EF4444;
                        }

                        &:nth-child(6)::before {
                            width: 10px;
                            background: url(${arrow}) no-repeat center center;
                        }
                    }
                }
            }

            .diagram {
                ${(props) => props.theme.variables.flex('center', 'center')};
                flex-direction: column;
                overflow-x: hidden;
                overflow-y: auto;
                flex: 1;
                width: 100%;
                background: url(${grid_bg}) center center;
                position: relative;

                .nodeAnimation {
                    position: absolute;
                    left: -209px;
                    top: 45px;
                    width: 1322px;
                    z-index: 4;
                    display: none;

                    video {
                        width: 100%;
                        height: auto;
                    }
                }

                .nodes {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                    display: block;

                    > img {
                        position: absolute;
                        width: auto;
                        height: auto;
                    }

                    .node1 {
                        top: 216px;
                        left: 317px;
                    }

                    .node2 {
                        top: 159px;
                        left: 386px;
                    }

                    .node3_1 {
                        top: 495px;
                        left: 269px;
                    }

                    .node3_2 {
                        top: 495px;
                        left: 389px;
                    }

                    .node3_3 {
                        top: 495px; 
                        left: 486px;
                    }

                    .node4 {
                        top: 511px;
                        left: 297px;
                    }

                    .node5 {
                        top: 504px;
                        left: 344px;
                    }

                    .node6_1 {
                        top: 507px;
                        left: 544px;
                    }

                    .node6_2 {
                        top: 507px;
                        left: 544px;
                    }

                    .node6_3 {
                        top: 507px;
                        left: 423px;      
                    }

                    .node7 {
                        top: 503px;
                        left: 550px;
                    }

                    .node8 {
                        top: 401px;
                        left: 588px;
                    }

                    .node9 {
                        top: 143px;
                        left: 530px;
                    }

                    .node10 {
                        top: 143px;
                        left: 575px;
                    }

                    .nodeObj {
                        top: 394px;
                        left: 358px;
                    }
                }

                .nameTags {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                    display: block;

                    .tagWrapper {
                        position: absolute; 

                        > .tag {
                            position: absolute;
                            border-radius: 3px;
                            background: #1E1E1E;
                            padding: 4px 8px;
                            color: #FFF;
                            font-size: 14px;
                            font-weight: 500;
                            line-height: 19px;
                            white-space: nowrap;
                            cursor: pointer;
                            z-index: 3;

                            &::before {
                                content: '';
                                display: block;
                                width: 5px;
                                height: 5px;
                                border-radius: 50%;
                                position: absolute;
                            }

                            &::after {
                                content: '';
                                display: block;
                                position: absolute;
                            }

                            &.off {
                                display: block;
                                border: 1px solid #888C94 !important;
                                color: #888C94 !important;

                                &::before {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node1 {
                            top: 247px;
                            left: 208px;

                            > .tag {
                                border: 1px solid #FF7043;

                                &::before {
                                    background: #FF7043;
                                    top: 50%;
                                    right: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 51px;
                                    height: 1px;
                                    background: #FF7043;
                                    top: 50%;
                                    right: -53px;
                                    transform: translate(0, -50%);
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node2 {
                            top: 86px;
                            left: 325px;

                            > .tag {
                                border: 1px solid #C39729;

                                &::before {
                                    background: #C39729;
                                    top: 50%;
                                    right: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 39px;
                                    height: 59px;
                                    border-top: 1px solid #C39729;
                                    border-right: 1px solid #C39729;
                                    top: 13px;
                                    right: -43px;
                                }

                                &.off::after {
                                    border-top: 1px solid #888C94 !important;
                                    border-right: 1px solid #888C94 !important;
                                }
                            }
                        }

                        &.node3_1 {
                            top: 658px;
                            left: 147px;

                            > .tag {
                                border: 1px solid #7C4DFF;

                                &::before {
                                    background: #7C4DFF;
                                    top: 50%;
                                    right: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 50px;
                                    height: 1px;
                                    background: #7C4DFF;
                                    top: 50%;
                                    right: -53px;
                                    transform: translate(0, -50%);
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node3_2 {
                            top: 690px;
                            left: 570px;

                            > .tag {
                                border: 1px solid #7C4DFF;

                                &::before {
                                    background: #7C4DFF;
                                    top: -3px;
                                    left: 50%;
                                    transform: translate(-50%, 0);
                                }

                                &::after {
                                    width: 208px;
                                    height: 14px;
                                    border-top: 1px solid #7C4DFF;
                                    border-right: 1px solid #7C4DFF;
                                    top: -13px;
                                    right: 35px;
                                }

                                &.off::after {
                                    border-top: 1px solid #888C94 !important;
                                    border-right: 1px solid #888C94 !important;
                                }
                            }
                        }

                        &.node3_3 {
                            top: 643px;
                            left: 617px;

                            > .tag {
                                border: 1px solid #7C4DFF;

                                &::before {
                                    background: #7C4DFF;
                                    top: 50%;
                                    left: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 101px;
                                    height: 1px;
                                    background: #7C4DFF;
                                    top: 50%;
                                    left: -104px;
                                    transform: translate(0, -50%);
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node4 {
                            top: 524px;
                            left: 192px;

                            > .tag {
                                border: 1px solid #26C6DA;

                                &::before {
                                    background: #26C6DA;
                                    top: 50%;
                                    right: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 51px;
                                    height: 1px;
                                    background: #26C6DA;
                                    top: 50%;
                                    right: -53px;
                                    transform: translate(0, -50%);
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node5 {
                            top: 484px;
                            left: 192px;

                            > .tag {
                                border: 1px solid #0085FF;

                                &::before {
                                    background: #0085FF;
                                    top: 50%;
                                    right: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 188px;
                                    height: 29px;
                                    border-top: 1px solid #0085FF;
                                    border-right: 1px solid #0085FF;
                                    top: 13px;
                                    right: -191px;
                                }

                                &.off::after {
                                    border-top: 1px solid #888C94 !important;
                                    border-right: 1px solid #888C94 !important;
                                }
                            }
                        }

                        &.node6_1 {
                            top: 543px;
                            left: 617px;

                            > .tag {
                                border: 1px solid #00E676;

                                &::before {
                                    background: #00E676;
                                    top: 50%;
                                    left: -3px;
                                    transform: translate(0, -50%);
                                }

                                &::after {
                                    width: 67px;
                                    height: 1px;
                                    background: #00E676;
                                    top: 50%;
                                    left: -66px;
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node6_2 {
                            top: 573px;
                            left: 617px;

                            > .tag {
                                border: 1px solid #00E676;

                                &::before {
                                    background: #00E676;
                                    top: 50%;
                                    left: -3px;
                                }

                                &::after {
                                    width: 67px;
                                    height: 1px;
                                    background: #00E676;
                                    top: 57%;
                                    left: -66px;
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node6_3 {
                            top: 603px;
                            left: 617px;

                            > .tag {
                                border: 1px solid #00E676;

                                &::before {
                                    background: #00E676;
                                    top: 50%;
                                    left: -3px;
                                }

                                &::after {
                                    width: 67px;
                                    height: 1px;
                                    background: #00E676;
                                    top: 57%;
                                    left: -66px;
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node7 {
                            top: 503px;
                            left: 666px;

                            > .tag {
                                border: 1px solid #9EE600;

                                &::before {
                                    background: #9EE600;
                                    top: 50%;
                                    left: -3px;
                                }

                                &::after {
                                    width: 48px;
                                    height: 1px;
                                    background: #9EE600;
                                    top: 57%;
                                    left: -48px;
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node8 {
                            top: 402px;
                            left: 649px;

                            > .tag {
                                border: 1px solid #4D53FF;

                                &::before {
                                    background: #4D53FF;
                                    top: 50%;
                                    left: -3px;
                                }

                                &::after {
                                    width: 32px;
                                    height: 1px;
                                    background: #4D53FF;
                                    top: 57%;
                                    left: -32px;
                                }

                                &.off::after {
                                    background: #888C94 !important;
                                }
                            }
                        }

                        &.node9 {
                            top: 227px;
                            left: 496px;

                            > .tag {
                                border: 1px solid #E600B5;

                                &::before {
                                    background: #E600B5;
                                    bottom: -3px;
                                    left: 50%;
                                    transform: translate(-50%, 0);
                                }

                                &::after {
                                    width: 27px;
                                    height: 18px;
                                    border-left: 1px solid #E600B5;
                                    border-bottom: 1px solid #E600B5;
                                    top: 28px;
                                    right: 1px;
                                }

                                &.off::after {
                                    border-left: 1px solid #888C94 !important;
                                    border-bottom: 1px solid #888C94 !important;
                                }
                            }
                        }

                        &.node10 {
                            top: 227px;
                            left: 581px;

                            > .tag {
                                border: 1px solid #FF8A80;

                                &::before {
                                    background: #FF8A80;
                                    bottom: -3px;
                                    left: 47%;
                                }

                                &::after {
                                    width: 30px;
                                    height: 18px;
                                    border-right: 1px solid #FF8A80;
                                    border-bottom: 1px solid #FF8A80;
                                    top: 28px;
                                    right: 31px;
                                }

                                &.off::after {
                                    border-right: 1px solid #888C94 !important;
                                    border-bottom: 1px solid #888C94 !important;
                                }
                            }
                        }

                    }
                }

                article {

                    > div {
                        border-radius: 8px;
                        border: 1px dashed rgba(204, 233, 255, 0.30);
                        background: linear-gradient(0deg, #1E1E1E 0%, #1E1E1E 100%), #D9D9D9;
                        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
                        padding: 11px;
                        width: 100%;
                        height: 100%; 
                        position: relative;

                        > img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            /* opacity: .3; */
                        }

                        .nameTag {
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            ${(props) => props.theme.variables.flex('center', 'center')};
                            flex-direction: column;
                            z-index: 8;
                            cursor: default;

                            > div {
                                display: flex;
                                position: relative;

                                > span {
                                    border-radius: 3px;
                                    border: 1px solid #FFF;
                                    background: #1E1E1E;
                                    padding: 4px 8px;
                                    color: #FFF;
                                    font-size: 14px;
                                    font-style: normal;
                                    font-weight: 500;
                                    line-height: 19px;
                                    white-space: nowrap;
                                    z-index: 2;
        
                                    &.off {
                                        display: block;
                                        border: 1px solid #888C94;
                                        color: #888C94;
                                        cursor: default !important;
                                    }
                                }

                                .intensityWrap {
                                    position: absolute;
                                    top: 12px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .risk5 {
        background: #0663FF !important;
    }

    .risk4 {
        background: #29A33B !important;
    }

    .risk3 {
        background: #F9B716 !important;
    }

    .risk2 {
        background: #F97316 !important;
    }

    .risk1 {
        background: #DD3232 !important;
    }

    .riskBorder5 {
        border: 1px dashed #0663FF !important;
    }

    .riskBorder4 {
        border: 1px dashed #29A33B !important;
    }

    .riskBorder3 {
        border: 1px dashed #F9B716 !important;
    }

    .riskBorder2 {
        border: 1px dashed #F97316 !important;
    }

    .riskBorder1 {
        border: 1px dashed #DD3232 !important;
    }

    .animate {
        animation: ${glowLoop} 2s ease-out infinite;
    }

    .damageCircleWrapper {
        position: absolute;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    .damageCircle {
        border-radius: 50%;
        background: rgba(255, 100, 0, 0.3);
        position: absolute;
        transform: translate(-50%, -50%); /* 중심 기준 */
    }

    .intensityWrap {

        &.card {
            position: relative;
            width: 80px;
            height: 80px;
        }

        &.chart {
            position: absolute;

            .circle {
                &:hover {
                    border: 2px solid #fff;
                }
            }
        }

        .circle {
            display: block;
            position: absolute;
            border-radius: 50%;
            inset: 0;


        }

        .c1 { 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #EF4444;
            width: 28.8px;
            height: 28.8px;
            border: 2px solid #EF4444;
        }

        .c2 { 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #F97316; 
            width: 41.6px;
            height: 41.6px;
            border: 2px solid #F97316;
        }

        .c3 { 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #F9B716; 
            width: 54.4px;
            height: 54.4px;
            border: 2px solid #F9B716;
        }

        .c4 { 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #29A33B; 
            width: 67.2px;
            height: 67.2px;
            border: 2px solid #29A33B;
        }

        .c5 { 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            background: #0663FF; 
            width: 80px;
            height: 80px;
            border: 2px solid #0663FF;
        }
    }

    .intensityLegend {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            ${(props) => props.theme.variables.flex('flex-start', 'center')};
            gap: 4px;
            font-size: 12px;
            color: #fff;
            margin: 8px 0;
            letter-spacing: -0.36px;

            .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
            }
        }
    }

    /* tooltip 기본 숨김 */
    .circleTooltip {
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 5px 8px;
        background: rgba(0,0,0,0.65);
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        pointer-events: none;
        transition: opacity 0.15s;
    }


    /* chart 전용: 큰 원형은 중앙 기준으로 절대 배치 */
    .intensityWrap.chart {
        position: absolute;
    }

    .chartTooltip {
        position: absolute;
        transform: translate(-50%, -50%);
        color: #fff;
        white-space: nowrap;
        pointer-events: none;
        z-index: 999;
        color: #FFF;
        text-shadow: 0 0 4px #000;
        font-size: 12px;
        font-weight: 700;
        line-height: 170%; /* 20.4px */
        letter-spacing: -0.36px;
    }




    .facilityNameTags {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9;

        .tagWrapper {
            position: absolute;

            &.m_compressor {
                top: 430px;
                left: 282px;
            }

            &.h_compressor {
                top: 430px;
                left: 508px;
            }

            &.coolingUnit {
                top: 457px;
                left: 588px;
            }

            &.fiba1 {
                top: 559px;
                left: 271px;
            }

            &.fiba2 {
                top: 590px;
                left: 271px;
            }

            &.fiba3 {
                left: 271px;
                top: 621px;
            }

            &.calvera1 {
                top: 708px;
                left: 271px;
            }

            &.calvera2 {
                top: 708px;
                left: 354px;
            }

            &.calvera3 {
                top: 708px;
                left: 437px;
            }

            .tag {
                pointer-events: auto;
                position: relative;
                display: inline-block;
                white-space: nowrap;
                border-radius: 3px;
                border: 1px solid #FFF;
                background: #1E1E1E;
                padding: 4px 8px;
                color: #FFF;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 19px;
                white-space: nowrap;
                cursor: pointer;
                z-index: 2;

                &.off {
                    display: block;
                    border: 1px solid #888C94;
                    color: #888C94;
                    cursor: default !important;
                }
            }
        }


        /* 클릭 시 맨 위로 오도록 */
        .intensityWrap.chart.selected {
            z-index: 99999 !important;
        }
    }

    .facilityItems {
        position: absolute;
        width: 100%;
        height: 100%;

        > section {
            position: absolute;
        }

        .top {
            top: 43px;
            left: 52px;
            ${(props) => props.theme.variables.flex('center', 'flex-end')};
            margin-bottom: 75px;
            padding-right: 205px;

            .first {
                width: 359px;
                height: 80px;
                margin-right: 49px;
            }

            .second {
                width: 91px;
                height: 166px;
                margin-right: 29px;
            }

            .third {
                width: 91px;
                height: 166px;

                .truck {
                    padding: 10px;
                }
            }
        }

        .middle {
            top: 290px;
            left: 270px;
            ${(props) => props.theme.variables.flex('center', 'flex-end')};
            margin-bottom: 39px;

            .first {
                width: 102px;
                height: 234px;
                margin-right: 11px;

                .electrolysis {
                    .nameTag {
                        transform: translate(-50%, -108px);
                    }
                }
            }

            .second {
                width: 102px;
                height: 234px;
                margin-right: 11px;

                .airCompressor {
                    > img {
                        width: 50%;
                        position: relative;
                        top: -10px;
                        left: -4px;
                    }

                    .nameTag {
                        top: 30%;
                    }
                }
            }

            .third {
                width: 102px;
                height: 234px;

                .dispenser {
                    padding: 8px;

                    > img {
                        position: relative;
                        top: -4px;
                    }

                    .nameTag {
                        transform: translate(-50%, -108px);
                    }
                }
            }

            .fourth {
                width: 58px;
                height: 91px;
                position: relative;
                left: -12px;
                bottom: 12px;
            }
        } 

        .bottom {
            top: 564px;
            left: 258px;
            ${(props) => props.theme.variables.flex('flex-start', 'flex-start')};
            flex-direction: column;
            gap: 32px;
            padding-right: 67px;

            .first {
                width: 345px;
                height: 75px;

                .fiba1 {
                    .nameTag {
                        left: 15%;
                        gap: 2px;
                    }
                }
            }

            .second {
                width: 267px;
                height: 94px;

                .calvera {
                    padding: 10px;

                    .nameTag {
                        flex-direction: row;
                        gap: 8px;
                    }
                }
            }
        }

        .pipeObj {
            position: absolute;
            top: 306px;
            left: 261px;
            width: 317px;
            z-index: 3;
        }
    }
`;

// 실시간 위험요인
export const RiskFactorsInfoComponent = styled(PopupsCommon)`
    position: absolute;
    width: 321px !important;
    height: 598px;
    top: 10%;
    left: 10%;
    background: rgba(30, 30, 30, 0.80);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
    border: none;
    z-index: 1;
    opacity: 1;

    &::after {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url(${popupSide_icon})no-repeat center center;
        position: absolute;
        right: 4.5px;
        bottom: 4.5px;
        cursor: pointer;
    }

    .viewDashPopTitle{
        display: flex;
        align-items: center;
        width: 100%;
        height: 48px;
        padding: 14px;
        border-bottom: 1px solid #3C4143;
        background: linear-gradient(98deg, #303030 0%, #1D1D1D 23.63%);

        > span {
            color: #B6C6D2;
            font-size: 14px;
            font-weight: 700;
        }
    }

    .dslCont {
        padding: 12px;
    
        > div {
            width: 100%;
            height: calc(100% - 10px);
            overflow-x: hidden;
            overflow-y: auto;
            ${(props) => props.theme.variables.scroll()};
            border-radius: 4px;
            border: 1px solid #303030;
            background: #1A1A1A;
        }

        .head {
            background: rgba(182, 198, 210, 0.07);
            padding: 12px;

            > p {
                color: #FFF;
                font-size: 14px;
                font-weight: 700;
                line-height: 14px; 
            }
        }

        .body {
            > li {
                ${(props) => props.theme.variables.flex('flex-start', 'center')};
                gap: 12px;
                padding: 12px;

                &:not(:last-child) {
                    border-bottom: 1px dashed #3C4143;
                }

                > p {
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 170%; /* 20.4px */
                    letter-spacing: -0.36px;

                    &:nth-child(1) {
                        flex: 0 0 100px;
                        color: #CECFD2;
                    }

                    &:nth-child(2) {
                        flex: 1;
                        color: #FFF;
                    }
                }
            }
        }
    }
`;
