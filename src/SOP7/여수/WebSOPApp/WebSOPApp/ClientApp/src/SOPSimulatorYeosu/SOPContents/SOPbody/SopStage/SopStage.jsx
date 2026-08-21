import React, { Component } from 'react';

import { SopStageBox } from "../../../styled";

import SopStart from "./SopStart";
import SopSituation from "./SopSituation";
import SopProcess from "./SopProcess";
import SopEnd from "./SopEnd";

import SopResult from './SopResult';

class SopStage extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <>
                {/* SOP 수행단계 영역 */}
                <SopStageBox>
                    <SopStart />
                    <SopSituation />
                    <SopProcess />
                    <SopEnd />
                </SopStageBox>

                <SopResult style={{ position: 'relative' }}/>
            </>
        );
    }
}

export default SopStage;


