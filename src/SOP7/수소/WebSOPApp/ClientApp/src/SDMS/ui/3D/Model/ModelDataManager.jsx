export class ModelDataManager {

    static IndoorModelTag = "_";

    constructor() {
        this.equipments = [];

        // 설비 >> 장비 >> 센서
        // 설비 (ID, 이름, 내부여부)
        let equipment = new EquipmentModel(1, "Electrolyzer", true);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(2, "Compressor", true);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(3, "Dispenser", true);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(4, "Cooling_unit", false);
        this.equipments.push(equipment);
        //equipment = new EquipmentModel(5, "Fiba", false);
        //this.equipments.push(equipment);
        equipment = new EquipmentModel(6, "Valve_cabinet01", true);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(7, "Valve_cabinet02", true);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(8, "Calvera01", false);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(9, "Calvera02", false);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(10, "Calvera03", false);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(11, "UPS_container", false);
        this.equipments.push(equipment);

        equipment = new EquipmentModel(12, "Fiba01", false);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(13, "Fiba02", false);
        this.equipments.push(equipment);
        equipment = new EquipmentModel(14, "Fiba03", false);
        this.equipments.push(equipment);




        this.sensors = [];

        // 센서 (ID, 내부여부, 이름)
        let sensor = new SensorModelInfo(1, true, "QIZA90012");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(2, true, "QIZA90007");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(3, true, "QIZA90008");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(4, true, "PT30088");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(5, true, "FT30026");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(6, true, "FTZA10016");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(7, true, "QIZA90006");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(8, true, "QIZA90010");
        this.sensors.push(sensor);

        sensor = new SensorModelInfo(9, true, "QIZA_H2Une301");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(10, true, "QIZA_O2Une301");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(11, true, "QIZA_H2Une202");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(40, true, "QIZA_H2Une201");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(60, true, "QIZA_H2Une302");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(61, true, "QIZA_O2Une201");
        this.sensors.push(sensor);



        sensor = new SensorModelInfo(12, true, "PT80120");
        this.sensors.push(sensor);


        sensor = new SensorModelInfo(13, true, "PT20330");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(14, true, "PT20350");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(15, true, "PT10208");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(16, true, "TT10210");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(17, true, "TT10260");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(18, true, "PT10260");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(19, true, "PT20118");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(20, true, "TT20120");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(21, true, "TT10314");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(22, true, "PT20312");
        this.sensors.push(sensor);

        sensor = new SensorModelInfo(23, true, "QIZA100108");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(24, true, "QIZA100106");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(25, true, "TT10132");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(41, true, "PV10140");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(42, true, "PV10116");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(43, true, "PT10130");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(44, true, "TT20314");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(45, true, "PV10258");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(46, true, "PV10276");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(47, true, "PV10257");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(48, true, "TT20262");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(49, true, "PV10278");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(50, true, "FT20315");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(51, true, "PV20334");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(52, true, "PV20322");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(53, true, "PV20325");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(54, true, "PV20324");
        this.sensors.push(sensor);

        sensor = new SensorModelInfo(55, true, "QIZA_H2Une101");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(56, true, "QIZA_O2Une101");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(57, true, "QIZA_H2Une102");
        this.sensors.push(sensor);



        sensor = new SensorModelInfo(26, true, "TT20243");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(27, true, "PT20242");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(28, true, "TT20231");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(29, true, "PT20230");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(30, true, "TT20219");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(31, true, "PT20218");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(32, true, "TT20207");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(33, true, "PT20206");
        this.sensors.push(sensor);


        sensor = new SensorModelInfo(34, true, "TT10221");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(35, true, "PT10220");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(36, true, "TT10233");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(37, true, "PT10232");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(38, true, "TT10245");
        this.sensors.push(sensor);
        sensor = new SensorModelInfo(39, true, "PT10244");
        this.sensors.push(sensor);

        sensor = new SensorModelInfo(62, true, "TT20320");
        this.sensors.push(sensor);
    }

    searchEquipment = (modelName) => {
        if (modelName === null || modelName === undefined || modelName === "")
            return null;

        let equipment = this.equipments.find(x => x.outdoorName === modelName);
        if (!equipment)
            equipment = null;

        return equipment;
    }

    searchEquipmentID = (modelID) => {
        if (modelID === null || modelID === undefined)
            return null;

        let equipment = this.equipments.find(x => x.id === modelID);
        if (!equipment)
            equipment = null;

        return equipment;
    }

    searchSensorID = (sensorID) => {
        if (sensorID === null || sensorID === undefined)
            return null;

        let sensor = this.sensors.find(x => x.id === sensorID);
        if (!sensor)
            sensor = null;

        return sensor;
    }

}

class EquipmentModel {
    constructor(id, outdoor, isIndoor) {
        this.id = id;   // Building ID
        this.outdoorName = outdoor;
        this.isIndoor = isIndoor;
    }
}

class SensorModelInfo {
    constructor(id, isIndoor, name) {
        this.id = id;
        this.isIndoor = isIndoor;
    }
}
