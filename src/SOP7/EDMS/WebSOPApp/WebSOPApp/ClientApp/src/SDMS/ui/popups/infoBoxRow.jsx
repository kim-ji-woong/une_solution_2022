import React, { Component } from 'react';
import styles from '../../css/infobox.module.css';

class InfoBoxRow extends Component {
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

            let x = posX + InfoBoxRow.paddingPositionX;
            let y = posY + InfoBoxRow.paddingPositionY;

            if (x + rect.width > parentWidth) {
                const x2 = posX - InfoBoxRow.paddingPositionX - rect.width;

                if (x2 >= 0) {
                    x = x2;
                }
            }

            if (y + rect.height > parentHeight) {
                const y2 = posY - InfoBoxRow.paddingPositionY - rect.height;

                if (y2 >= 0) {
                    y = y2;
                }
            }

            this.refBody.current.style.top = y + "px";
            this.refBody.current.style.left = x + "px";
        }
    }

    getItems() {
        const rowItems = [];
        const propsItems = [...this.props.data.items];

        for (const item of propsItems) {
            if (item.icon) {
                rowItems.push(
                    <div className={styles.rowItem}>
                        <span className={styles.name}>{item.name}</span>
                        <div className={styles.valueIcon}>
                            <span className={this.getValueIconClassName(item)}></span>
                            <span className={this.getValueClassName(item)}>{item.value}</span>
                        </div>
                    </div>
                );
            }
            else {
                rowItems.push(
                    <div className={styles.rowItem}>
                        <span className={styles.name}>{item.name}</span>
                        <span className={this.getValueClassName(item)}>{item.value}</span>
                    </div>
                );
            }
        }

        return rowItems;
    }

    getValueClassName(item) {
        if (item.redValue) {
            return styles.value + " " + styles.red;
        }

        return styles.value;
    }

    getValueIconClassName(item) {
        let iconClassName = "";

        if (item.icon.red) {
            iconClassName = styles.infoBoxRowRedCircle;
        }
        else if (item.icon.green) {
            iconClassName = styles.infoBoxRowGreenCircle;
        }

        return iconClassName;
    }

    render() {
        return (
            <div ref={this.refBody} className={styles.infoBoxRowRoot}>
                <div className={styles.infoBoxRowTitle}>
                    <span className={styles.controlTitle}>{this.props.data.title}</span>
                    <span className={styles.closeIcon} onClick={() => this.props.closeInfoBox()}></span>
                </div>
                <div className={styles.infoBoxRowBody}>
                    {this.getItems()}
                </div>
            </div>
        );
    }
}

export default InfoBoxRow;