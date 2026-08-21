import React from 'react';
import styled, { keyframes } from 'styled-components';


const Loader = ({ size = "24px", borderSize = "4px", baseColor = "#2A2F3D", wheelColor = "#3FADFF", speed = "800" }) => {
    return (
        <LoaderComponent
            $size={size}
            $borderSize={borderSize}
            $baseColor={baseColor}
            $wheelColor={wheelColor}
            $speed={speed}
        >
        </LoaderComponent>
    );
}

export default Loader;


const loaderAnimation = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
`;

const LoaderComponent = styled.div`
    display: block !important;
    height: ${props => props.$size} !important;
    width: ${props => props.$size} !important;
    border: ${props => props.$borderSize} solid ${props => props.$baseColor} !important;
    border-left-color: ${props => props.$wheelColor} !important;
    border-radius: 100% !important;
    animation: ${loaderAnimation} ${props => props.$speed + 'ms'} infinite linear;
`;