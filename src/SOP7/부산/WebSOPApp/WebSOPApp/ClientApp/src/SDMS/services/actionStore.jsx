import { legacy_createStore as createStore } from 'redux';

export default createStore ( function (state, action) {
        if (state === undefined) {
            return {
                isOnMeasureDistance: false,
                offMeasureDistance: false,
                loadingState: false,
                loadingDegree: 0,
                isIndoor: false,
            }
        } else if (action.type === 'IS_ON_MEASURE_DISTANCE') {
            return {
                isOnMeasureDistance: action.isOnMeasureDistance,
                offMeasureDistance: state.offMeasureDistance,
                loadingState: state.loadingState,
                loadingDegree: state.loadingDegree,
                isIndoor: state.isIndoor,
                testInfo: state.testInfo,
                actionType: action.type
            }
        } else if (action.type === 'OFF_MEASURE_DISTANCE') {
            return {
                isOnMeasureDistance: state.isOnMeasureDistance,
                offMeasureDistance: action.offMeasureDistance,
                loadingState: state.loadingState,
                loadingDegree: state.loadingDegree,
                isIndoor: state.isIndoor,
                testInfo: state.testInfo,
                actionType: action.type
            }
        } else if (action.type === 'LOADING_STATE') {
            return {
                isOnMeasureDistance: state.isOnMeasureDistance,
                offMeasureDistance: state.offMeasureDistance,
                loadingState: action.loadingState,
                loadingDegree: state.loadingDegree,
                isIndoor: state.isIndoor,
                testInfo: state.testInfo,
                actionType: action.type
            }
        } else if (action.type === 'SET_LOADING_DEGREE') {
            return {
                isOnMeasureDistance: state.isOnMeasureDistance,
                offMeasureDistance: state.offMeasureDistance,
                loadingState: state.loadingState,
                loadingDegree: action.loadingDegree,
                isIndoor: state.isIndoor,
                testInfo: state.testInfo,
                actionType: action.type
            }
        } else if (action.type === 'SET_IS_INDOOR') {
            return {
                isOnMeasureDistance: state.isOnMeasureDistance,
                offMeasureDistance: state.offMeasureDistance,
                loadingState: state.loadingState,
                loadingDegree: state.loadingDegree,
                isIndoor: action.isIndoor,
                testInfo: state.testInfo,
                actionType: action.type
            }
        } else if (action.type === 'SET_TEST_INFO') {
            return {
                isOnMeasureDistance: state.isOnMeasureDistance,
                offMeasureDistance: state.offMeasureDistance,
                loadingState: state.loadingState,
                loadingDegree: state.loadingDegree,
                isIndoor: state.isIndoor,
                testInfo: action.testInfo,
                actionType: action.type
            }
        }
        
        return state;
    }, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());