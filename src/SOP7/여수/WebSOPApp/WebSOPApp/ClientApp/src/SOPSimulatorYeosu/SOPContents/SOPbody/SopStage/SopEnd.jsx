import React, { Component } from 'react';

import { SopEndBox } from "./../../../styled";
import { SopFlexBox } from "./../../../styled";

import { SopFlexBoxS1 } from "./../../../styled";
import { SopFlexBoxS2 } from "./../../../styled";
import { SopFlexBoxS3 } from "./../../../styled";

import { SopStartTitle } from "../../../styled";
import { SopEndTitle } from "../../../styled";
import { SopDisableTitle } from "../../../styled";
import { SopStartBtn } from "../../../styled";
import { SopEndBtn } from "../../../styled";
import { SopCompletion } from "../../../styled";



class SopEnd extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <>
                {/* active ui */}
                {/* <SopEndBox className="active">
                    <SopFlexBoxS1>
                      <SopEndTitle className="active">4.종료</SopEndTitle>
                    </SopFlexBoxS1>
                    <SopFlexBoxS2>
                      <div style={{ padding: '20px 40px' }} >
                         <SopEndBtn className="active">종료</SopEndBtn>
                      </div>
                    </SopFlexBoxS2>
                    <SopFlexBoxS3>
                       <SopCompletion></SopCompletion>
                    </SopFlexBoxS3>
                </SopEndBox> */}

                {/* disable ui */}
                <SopEndBox>
                    <SopFlexBoxS1>
                        <SopEndTitle>4.종료</SopEndTitle>
                    </SopFlexBoxS1>
                    <SopFlexBoxS2>
                        <div style={{ padding: '20px 40px' }} >
                            <SopEndBtn>종료</SopEndBtn>
                        </div>
                    </SopFlexBoxS2>
                    <SopFlexBoxS3>
                        <SopCompletion></SopCompletion>
                    </SopFlexBoxS3>
                </SopEndBox>
            </>
        );
    }
}

export default SopEnd;