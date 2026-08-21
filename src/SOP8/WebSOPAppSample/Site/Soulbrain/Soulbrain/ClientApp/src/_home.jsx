import React from 'react';
import Home from "./home";
import { _SdmsController } from "./services/_sdmsController";
import sensor from './css/sensor.module.css';


class _Home extends Home {
    async onClickGetSensor() {
        const [datas, errorMessage] = await _SdmsController.requestPsmSensors(5);

        if (datas === null)
            console.log(errorMessage);
        else
            this.setState({ mode: "sensors", values: datas, linkedSop: null, errorMessage: null, selectedSensorID: null });
    }

    async onSelectSensor(sensor) {
        if (sensor) {
            const [data, errorMessage] = await _SdmsController.requestPsmLinkedSop(sensor.id);

            if (data) {
                const sopPath = data.disasterCategoryName + " / " + data.subDisasterCategoryName + " / " + data.disasterName;
                this.setState({ selectedSensorID: sensor.id, linkedSop: sopPath, errorMessage: null });
            }
            else {
                if (errorMessage) {
                    this.setState({ selectedSensorID: sensor.id, linkedSop: null, errorMessage: errorMessage });
                }
                else {
                    this.setState({ selectedSensorID: sensor.id, linkedSop: null, errorMessage: null });
                }
            }
        }
        else
            this.setState({ selectedSensorID: null, linkedSop: null, errorMessage: null });
    }

    getLinkedSop() {
        const errorMessage = this.state.errorMessage;
        const linkedSop = this.state.linkedSop;

        if (errorMessage) {
            return <p className={sensor.errorText}>{errorMessage}</p>
        }
        else if (linkedSop) {
            return <p className={sensor.sopText}>{"linkedSop : " + linkedSop}</p>
        }
        else {
            return <></>
        }
    }
}
export default _Home;