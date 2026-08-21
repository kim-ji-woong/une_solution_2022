
import styled from 'styled-components';
import ProjectResource from '../Root/resource/id';



export const PasswordBox_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PasswordBox.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PasswordBox.yeosu;
    }
    return {};
}

export const _PasswordBox = {
    default: {
        divDisplay: 'block',
        divWidth: '625px',
        divHeight: '188px',
        divBackground: '#fff',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '625px',
        divHeight: '188px',
        divBackground: '#fff',
    }
}


export const PasswordBox = styled.div`
    display:${_PasswordBox[ProjectResource.styleMode].divDisplay};
    width:${_PasswordBox[ProjectResource.styleMode].divWidth};
    height:${_PasswordBox[ProjectResource.styleMode].divHeight};
    background:${_PasswordBox[ProjectResource.styleMode].divBackground};
    border-radius:5px;
    /* padding: 16px; */
`;


/********************************************************************/


export const PasswordBoxTitle_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PasswordBoxTitle.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PasswordBoxTitle.yeosu;
    }
    return {};
}

export const _PasswordBoxTitle = {
    default: {
        divDisplay: 'block',
        divHeight: '56px',
        divColor: '#000000',
        divFontSize: '20px',
        divBackground: '#F5F5F5',
    },
    yeosu: {
        divDisplay: 'block',
        divHeight: '56px',
        divColor: '#000000',
        divFontSize: '20px',
        divBackground: '#F5F5F5',
    }
}


export const PasswordBoxTitle = styled.div`
    display:${_PasswordBoxTitle[ProjectResource.styleMode].divDisplay};
    height:${_PasswordBoxTitle[ProjectResource.styleMode].divHeight};
    color:${_PasswordBoxTitle[ProjectResource.styleMode].divColor};
    font-size:${_PasswordBoxTitle[ProjectResource.styleMode].divFontSize};
    background:${_PasswordBoxTitle[ProjectResource.styleMode].divBackground};
    line-height: 56px;
    font-family:  'Pretendard, Bold';
    font-weight: 800;
    padding-left: 16px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
`;


/********************************************************************/


export const PasswordBoxContents_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PasswordBoxContents.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PasswordBoxContents.yeosu;
    }
    return {};
}

export const _PasswordBoxContents = {
    default: {
        divDisplay: 'block',
        divHeight: '80px',
        divColor: '#000000',
        divFontSize: '20px',
    },
    yeosu: {
        divDisplay: 'block',
        divHeight: '80px',
        divColor: '#000000',
        divFontSize: '20px',
    }
}


export const PasswordBoxContents = styled.div`
    display:${_PasswordBoxContents[ProjectResource.styleMode].divDisplay};
    height:${_PasswordBoxContents[ProjectResource.styleMode].divHeight};
    color:${_PasswordBoxContents[ProjectResource.styleMode].divColor};
    font-size:${_PasswordBoxContents[ProjectResource.styleMode].divFontSize};
    /* margin-bottom: 40px; */
    padding: 16px;
`;


/********************************************************************/


export const PasswordConfig_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PasswordConfig.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PasswordConfig.yeosu;
    }
    return {};
}

export const _PasswordConfig = {
    default: {
        divDisplay: 'block',
        divWidth: '51px',
        divHeight: '32px',
        divBackground: '#19A5FF',
        divFontSize: '20px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '51px',
        divHeight: '32px',
        divBackground: '#19A5FF',
        divFontSize: '20px',
    }
}


export const PasswordConfig = styled.div`
    display:${_PasswordConfig[ProjectResource.styleMode].divDisplay};
    width:${_PasswordConfig[ProjectResource.styleMode].divWidth};
    height:${_PasswordConfig[ProjectResource.styleMode].divHeight};
    background:${_PasswordConfig[ProjectResource.styleMode].divBackground};
    font-size:${_PasswordConfig[ProjectResource.styleMode].divFontSize};
    line-height: 32px;
    border-radius:5px;
    text-align: center;
    color: #fff;
    float: right;
    margin: 0px 16px;
    cursor: pointer;
`;


/********************************************************************/


export const PasswordConfigGray_ = () => {
    if (ProjectResource.styleMode === "default") {
        return _PasswordConfigGray.default;
    } else if (ProjectResource.styleMode === "yeosu") {
        return _PasswordConfigGray.yeosu;
    }
    return {};
}

export const _PasswordConfigGray = {
    default: {
        divDisplay: 'block',
        divWidth: '51px',
        divHeight: '32px',
        divBackground: '#808080',
        divFontSize: '20px',
    },
    yeosu: {
        divDisplay: 'block',
        divWidth: '51px',
        divHeight: '32px',
        divBackground: '#808080',
        divFontSize: '20px',
    }
}


export const PasswordConfigGray = styled.div`
    display:${_PasswordConfigGray[ProjectResource.styleMode].divDisplay};
    width:${_PasswordConfigGray[ProjectResource.styleMode].divWidth};
    height:${_PasswordConfigGray[ProjectResource.styleMode].divHeight};
    background:${_PasswordConfigGray[ProjectResource.styleMode].divBackground};
    font-size:${_PasswordConfigGray[ProjectResource.styleMode].divFontSize};
    line-height: 32px;
    border-radius:5px;
    text-align: center;
    color: #fff;
    float: right;
    margin: 0px 16px;
    cursor: pointer;
`;


/********************************************************************/