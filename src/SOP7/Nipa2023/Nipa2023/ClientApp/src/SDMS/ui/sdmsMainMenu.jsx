import { Component } from 'react';

class SDMSMainMenu extends Component {
    static Stink_Sensor = "stink";  // 악취(대기오염)
    static Gas_Sensor = "gas";  // 가스
    static EmergencyBell_Sensor = "emergencyBell";  // 비상벨
    static ThermalImagingCamera_Sensor = "thermalImagingCamera";  // 열화상카메라
    static CCTV_Sensor = "cctv";  // CCTV
    static ZoneName_Sensor = "zoneName";  // 구역명
    static Worker_Sensor = "worker";  // 작업자
}

export default SDMSMainMenu;