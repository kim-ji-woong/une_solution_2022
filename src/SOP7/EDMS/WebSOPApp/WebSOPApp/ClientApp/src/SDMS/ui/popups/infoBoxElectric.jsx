import React, { Component } from 'react';
import styles from '../../css/infobox.module.css';

class InfoBoxElectric extends Component {
    static paddingPositionX = 10;
    static paddingPositionY = 10;

    constructor(props) {
        super(props);

        this.refBody = React.createRef();
    }

    componentDidMount() {
        this.updatePosition();
    }

    componentDidUpdate() {
        this.updatePosition();
    }

    updatePosition() {
        const posX = this.props.data?.x;
        const posY = this.props.data?.y;

        if (posX === 0 || posX) {
            const parentWidth = this.refBody.current.parentElement.offsetWidth;
            const parentHeight = this.refBody.current.parentElement.offsetHeight;
            const rect = this.refBody.current.getBoundingClientRect();

            let x = posX + InfoBoxElectric.paddingPositionX;
            let y = posY + InfoBoxElectric.paddingPositionY;

            if (x + rect.width > parentWidth) {
                const x2 = posX - InfoBoxElectric.paddingPositionX - rect.width;

                if (x2 >= 0) {
                    x = x2;
                }
            }

            if (y + rect.height > parentHeight) {
                const y2 = posY - InfoBoxElectric.paddingPositionY - rect.height;

                if (y2 >= 0) {
                    y = y2;
                }
            }

            this.refBody.current.style.top = y + "px";
            this.refBody.current.style.left = x + "px";
        }
    }

    getItems() {
        const items = [];
        const data = { ...this.props.data };

        items.push(
            <div className={styles.electTitleBox}>
                <span className={styles.electTitle}>{data.sensorName}</span>
                <span className={styles.closeIcon} onClick={() => this.props.closeInfoBox() }></span>
            </div>
        );

        const statusClassName = data.isAlarm ? styles.electRedCircle : styles.electGreenCircle;

        items.push(
            <div className={styles.electTopBox}>
                <span className={statusClassName}></span>
                <span className={styles.electMotionText}>{data.status}</span>
                <span className={styles.electLocation}>설비 위치 : P10_지하 2층 B2S-M1 전기실</span>
            </div>
        );

        if (data.dir) {
            items.push(
                <span className={styles.actLineLong1}></span>
            );

            items.push(
                <div className={styles.electMiddleBox}>
                    <div className={styles.electBlock1}>
                        <span className={styles.splashScreen}></span>
                        <div className={styles.triAction}>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle1}></span>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle2}></span>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle21}></span>
                        </div>
                    </div>
                    <div className={styles.electBlock2}>
                        <div style={{ display: "flex" }}>
                            <span className={styles.splashScreen}></span>
                            <span className={styles.electGrayLine1}></span>
                            <span className={styles.electGrayCircle}></span>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            items.push(
                <span className={styles.actLineLong2}></span>
            );

            items.push(
                <div className={styles.electMiddleBox}>
                    <div className={styles.electBlock1}>
                        <span className={styles.electGrayCircle2}></span>
                        <span className={styles.electGrayLine2}></span>
                    </div>
                    <div className={styles.electBlock2}>
                        <span className={styles.splashScreen}></span>
                        <div className={styles.triAction2}>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle3}></span>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle4}></span>
                            <span style={{ width: "100%" }}></span>
                            <span className={styles.actTriangle41}></span>
                        </div>
                        <span className={styles.splashScreen2}></span>
                    </div>
                </div>
            );
        }

        items.push(
            <div className={styles.electBottomBox}>
                <span className={styles.electText4}>154kV</span>
                <span className={styles.electText2}>P10_지상2층 전기실</span>
                <span className={styles.electText5}>P10_지상8층 전기실</span>
            </div>
        );

        return items;
    }

    render() {
        return (
            <div ref={this.refBody} className={styles.electBox}>
                {
                    this.getItems()
                }
            </div>
        );
    }
}

export default InfoBoxElectric;