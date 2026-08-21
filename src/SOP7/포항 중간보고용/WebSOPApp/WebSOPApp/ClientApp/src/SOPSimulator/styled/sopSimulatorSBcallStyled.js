import styled from 'styled-components';

/**********************************************************************/


export const SopSimulatorSBcallComponent = styled.section`

    .btnList {

        span {
            opacity: .3;
        }


        &:hover {
            color: #fff !important;

            span {
                opacity: 1;
            }
        }
    }

    .isActiveType {
        color: #fff !important;

        span {
            opacity: 1;
        }
    }

    .isShow {

        dt {
            background-color: #1D2023;
            color: ${(props) => props.theme.primary};
        }
    }
`;