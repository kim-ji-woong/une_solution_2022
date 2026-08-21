import React, { Component } from 'react';
import styles from '../../css/infobox.module.css';

class InfoBox extends Component {
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

            let x = posX + InfoBox.paddingPositionX;
            let y = posY + InfoBox.paddingPositionY;

            if (x + rect.width > parentWidth) {
                const x2 = posX - InfoBox.paddingPositionX - rect.width;

                if (x2 >= 0) {
                    x = x2;
                }
            }

            if (y + rect.height > parentHeight) {
                const y2 = posY - InfoBox.paddingPositionY - rect.height;

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
        const properties = [...this.props.data.properties];

        for (const prop of properties) {
            items.push(
                <div className={styles.infoContent1}>
                    <span>{"ㆍ" + prop.name}</span>
                    <span>{prop.value}</span>
                </div>
            );
        }

        return items;
    }

    static getProperties(datas) {
        const properties = [];

        for (const data of datas) {
            const index = data.value.indexOf(':');

            if (index < 0)
                continue;

            const name = data.value.substring(0, index).trim();
            const value = data.value.substring(index + 1).trim();

            properties.push({
                name: name,
                value: value
            });
        }

        return properties;
    }

    render() {
        return (
            <div ref={this.refBody} className={styles.infoBox}>
                <div className={styles.infoFlex}>
                    <div className={styles.infoFlexL}>
                        <span className={styles.infoText1}>{this.props.data.name}</span>
                        <span className={styles.infoText2}>{this.props.data.description}</span>
                    </div>
                    <div className={styles.infoFlexR}>
                        <div className={styles.greenCircle}></div>
                    </div>
                </div>
                <div className={styles.infoContents}>
                    {this.getItems()}
                </div>
            </div>
        );
    }
}

export default InfoBox;