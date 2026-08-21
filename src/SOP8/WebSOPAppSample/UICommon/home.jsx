import React, { Component } from 'react';
import { SdmsController } from './services/sdmsController';
import sensor from './css/sensor.module.css';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: null,
            values: null,
            linkedSop: null,
            errorMessage: null,
            selectedSensorID: null
        }
    }

    componentDidMount() {
    }

    async onClickGetSensor() {
        const [datas, errorMessage] = await SdmsController.requestFireSensors(10);

        if (datas === null)
            console.log(errorMessage);
        else
            this.setState({ mode: "sensors", values: datas, linkedSop: null, errorMessage: null, selectedSensorID: null });
    }

    getSensorElements(sensors) {
        if (!sensors) {
            return <></>
        }

        const sensorCount = sensors.length;
        const sensorElements = [];

        for (let i = 0; i < sensorCount; i++) {
            const _sensor = sensors[i];
            const sensorClassName = _sensor.id === this.state.selectedSensorID ? sensor.selected : "";

            sensorElements.push(
                <tr className={sensorClassName} onClick={() => this.onSelectSensor(_sensor)}>
                    <td style={{ width: "8%" }}>{i + 1}</td>
                    <td style={{ width: "45%" }}>{_sensor.name}</td>
                    <td style={{ width: "27%" }}>{_sensor.positionName}</td>
                    <td style={{ width: "20%" }}>{_sensor.sensorSubType}</td>
                </tr>
            );
        }

        return sensorElements;
    }

    async onSelectSensor(sensor) {
        if (sensor) {
            const [data, errorMessage] = await SdmsController.requestLinkedSop(sensor.id);

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

    getSensors() {
        if (!this.state.values) {
            return <></>
        }

        const sensors = [...this.state.values];
        
        return (
            <div className={sensor.alarmTable}>
                <table>
                    <tr>
                        <th style={{ width: "8%" }}>No</th>
                        <th style={{ width: "45%" }}>센서이름</th>
                        <th style={{ width: "27%" }}>위치</th>
                        <th style={{ width: "20%" }}>센서타입</th>
                    </tr>
                    {
                        this.getSensorElements(sensors)
                    }
                </table>
            </div>
            );
    }

    getValues() {
        if (this.state.mode === null) {
            return <></>
        }
        else if (this.state.mode === "sensors") {
            return this.getSensors();
        }

        return <></>
    }

    getLinkedSop() {
        const errorMessage = this.state.errorMessage;
        const linkedSop = this.state.linkedSop;

        if (errorMessage) {
            return <p className={sensor.errorText}>{errorMessage}</p>
        }
        else if (linkedSop) {
            return <p className={sensor.sopText}>{linkedSop}</p>
        }
        else {
            return <></>
        }
    }

    render() {
        return (
            <div>
                <button onClick={() => this.onClickGetSensor()}>센서</button>
                {
                    this.getValues()
                }
                {
                    this.getLinkedSop()
                }
            </div>
        );
    }
}

export default Home;