import React, { Component } from 'react';
import content from "../css/content.module.css";

class PoiInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // 데이터정보
            kind: ""
        }

        this.refBody = React.createRef();
    }

    componentDidMount() {
        this.updatePosition();
    }

    componentDidUpdate() {
        this.updatePosition();
    }

    updatePosition() {
        this.refBody.current.style.left = this.props.clickPos.x + 'px';
        this.refBody.current.style.top = this.props.clickPos.y + 'px';
    }

    makeList(value, withDot, depth, index) {
        const leftPadding = depth !== null && depth !== undefined && depth > 0 ? (depth * 1.8) + 'em' : null;

        if (withDot) {
            if (leftPadding) {
                return <li key={"list_" + index} className={content.liDot} style={{ paddingLeft: leftPadding }}>{value}</li>;
            }
            else {
                return <li key={"list_" + index} className={content.liDot}>{value}</li>;
            }
        }
        else {
            if (leftPadding) {
                return <li key={"list_" + index} className={content.liNoDot} style={{ paddingLeft: leftPadding }}>{value}</li>;
            }
        }

        return <li key={"list_" + index} className={content.liNoDot}>{value}</li>;
    }

    getElements() {
        const poiData = this.props.poiData;
        const list = [];

        if (poiData) {
            list.push(this.makeList(poiData.team, true, 1, 0));
            return [poiData.name, list];
        }

        return ["", list];
    }

    render() {
        const [title, elements] = this.getElements();

        return (
            <div ref={this.refBody} className={content.viewDashboardBoxD}>
                <div className={content.dslTop}>
                    <h5 className={content.dslTitle}>
                        {this.state.kind}정보
                    </h5>
                </div>
                <div className={content.viewConts}>
                    <div className={content.viewTitle}>{title}</div>
                    <ul>
                        {elements}
                    </ul>
                </div>
            </div>
        );
    }
}

export default PoiInfo;