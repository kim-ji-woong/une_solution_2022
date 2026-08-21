import { Component } from 'react';

class SDMSMainMenu extends Component {
    static Atmosphere_Sensor = "atmospheres";                    // 대기
    static ReductionEquipment_Sensor = "reductionEquipment";    // 저감설비
    static EmissionFacilities_Sensor = "emissionFacilities";    // 배출설비
    static Electricity_Sensor = "electricities";                  // 전력
    static Weather_Sensor = "weathers";                          // 기상
    static KWeather_Sensor = "kWeathers";                        // 케이웨더
    static CCTV_Sensor = "cctv";                                // CCTV
    static ZoneName_Sensor = "zoneName";                        // 구역명

    static Menu_None = 0;
    static Menu_Save_BuildingGroup_Viewport = 1;
    static Menu_Save_Building_Viewport = 2;
    static Menu_Show_Menu_Area = 3;
    static Menu_Debugging = 4;
    static Menu_Move_BuildingName = 5;
    static Menu_Move_Sensor = 6;
    static Menu_Add_Sensors = 7;
    static Menu_Show_Alarm = 8;
    static Menu_Hide_Alarm = 9;
    static Menu_Add_Alarm = 10;
    static Menu_Remove_Alarm = 11;
    static Menu_MoveTo_BuildingGroup = 12;
    static Menu_MoveTo_Building = 13;
    static Menu_MoveTo_POI = 14;
    static Menu_MoveTo_Floor = 15;
    static Menu_Show_Outdoor = 16;
    static Menu_Show_Indoor = 17;
    static Menu_Move_POI = 18;
    static Menu_Move_EquipZoneName = 19;
    static Menu_Refresh = 20;
    static Menu_FakeWall = 21;
    static Menu_EditMode = 22;
    static Menu_ClearSelection = 23;
    static Menu_MoveTo_Facility = 24;
    static Menu_MoveTo_Site = 25;

    static Admin_Menu_Viewport = "뷰포트 설정";
    static Admin_Menu_EtcSensor = "기타센서";
    static Admin_Menu_MovePOI = "POI 이동";

    static Test_Alarm_Level = 0;

    static NO_ALARM = 0;
    // 관심
    static ALARM_1 = 1;
    // 주의
    static ALARM_2 = 2;
    // 경계
    static ALARM_3 = 3;
    // 심각
    static ALARM_4 = 4;
    
    constructor(props) {
        super(props);

    }
    
    
    
}

export default SDMSMainMenu;