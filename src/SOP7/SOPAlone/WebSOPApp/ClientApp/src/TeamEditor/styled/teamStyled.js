
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import teamPlus from '../../TeamEditor/image/teamPlus.png';
import teamArrowDown from '../../TeamEditor/image/teamArrowDown.png';
import treePlus from '../../TeamEditor/image/treePlus.png';
import treeMinus from '../../TeamEditor/image/treeMinus.png';
import treeEdit from '../../TeamEditor/image/treeEdit.png';

import teamTableSearch from '../../TeamEditor/image/teamTableSearch.png';
import teamTablePlus from '../../TeamEditor/image/teamTablePlus.png';
import teamTableBin from '../../TeamEditor/image/teamTableBin.png';


/*teamEditor.jsx***************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/


export const TeamSubAside_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _TeamSubAside.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _TeamSubAside.Busan;
    }
    return {};
}

export const _TeamSubAside = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: 'calc(100% - 50px)',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: 'calc(100% - 50px)',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    }
}

export const TeamSubAside = styled.div`
    display:${_TeamSubAside[ProjectResource.styleMode].divDisplay};
    width:${_TeamSubAside[ProjectResource.styleMode].divWidth};
    height:${_TeamSubAside[ProjectResource.styleMode].divHeight};
    background:${_TeamSubAside[ProjectResource.styleMode].divBackground};
    border-radius: 6px;
    position: absolute;
    left: 0;
    top: 0px;
    bottom: 0;
    margin-left: 30px;

`;


/*teamMenu.jsx***************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/


export const SaRht_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SaRht.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SaRht.Busan;
    }
    return {};
}

export const _SaRht = {
    Cleannara: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    },
    Busan: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    }
}

export const SaRht = styled.div`
    display:${_SaRht[ProjectResource.styleMode].divDisplay};
    
    float: left;
    width: 319px;
    height: calc(100% - 0px);
    position: relative;
    padding-top: 60px;
    overflow: hidden;

`;


/***************************************************************************/


export const SarSel_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SarSel.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SarSel.Busan;
    }
    return {};
}

export const _SarSel = {
    Cleannara: {
        divDisplay: 'flex',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    },
    Busan: {
        divDisplay: 'flex',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    }
}

export const SarSel = styled.div`
    display:${_SarSel[ProjectResource.styleMode].divDisplay};

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    cursor:pointer;

    > button{
         display: block;
         position: relative;
         width: 100%;
         height: 57px;
         text-align: left;
         background: #343434;
         font-size: 16px;
         font-weight: 700;
         padding-left: 20px;
         border-radius: 6px;
         color: #fff;
    }
    > button:after{
         content: '';
         display: block;
         width: 18px;
         height: 13px;
         position: absolute;
         right: 20px;
         top: 50%;
         margin-top: -5px;
         background: url(${ teamArrowDown }) no-repeat;
    }
    > ul{
	     position: absolute;
         left: 0;
         right: 0;
         top: 100%;
         z-index: 10;
         background: #343434;
         display: none;
    }
    > ul > li{
         border-bottom: dashed 1px #707070;
         color: #fff;
         font-size: 14px;
    }
    > ul > li:last-child{
         border: none;
         border-bottom-left-radius: 6px;
         border-bottom-right-radius: 6px;
    }
    > ul > li > a{
         display: block;
         padding: 15px 20px;
         font-size: 16px;
         /*font-weight: 700;*/
    }
`;

/***************************************************************************/


export const SarEdit_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SarEdit.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SarEdit.Busan;
    }
    return {};
}

export const _SarEdit = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '20px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '20px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#202020',
        divFontSize: '18px',
    }
}

export const SarEdit = styled.div`
    display:${_SarEdit[ProjectResource.styleMode].divDisplay};
    width:${_SarEdit[ProjectResource.styleMode].divWidth};
    height:${_SarEdit[ProjectResource.styleMode].divHeight};
    background: url(${ teamPlus }) no-repeat;
    background-size: 17px;
    position: absolute;
    top: 20px;
    right: 70px;
`;


/*regularMemberPage.jsx********************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/


export const SubCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SubCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SubCont.Busan;
    }
    return {};
}

export const _SubCont = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const SubCont = styled.div`
    display:${_SubCont[ProjectResource.styleMode].divDisplay};

    width: 99%;
    height: calc(100% - 50px);
    background: #202020;
    border-radius: 6px;
    position: relative;
    overflow-y: auto;
    padding: 20px;
    /* margin-left: 360px; */

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #21EA74;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

`;

/******************************************************************/

export const ScWrap_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScWrap.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScWrap.Busan;
    }
    return {};
}

export const _ScWrap = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const ScWrap = styled.div`
    display:${_ScWrap[ProjectResource.styleMode].divDisplay};
    height: 96%;

`;

/******************************************************************/

export const ScCont_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScCont.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScCont.Busan;
    }
    return {};
}

export const _ScCont = {
    Cleannara: {
        divDisplay: 'block',

    },
    Busan: {
        divDisplay: 'block',

    }
}

export const ScCont = styled.div`
    display:${_ScCont[ProjectResource.styleMode].divDisplay};
    height:96%;
`;

/******************************************************************/

export const ScTop_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _ScTop.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _ScTop.Busan;
    }
    return {};
}

export const _ScTop = {
    Cleannara: {
        divDisplay: 'flex',

    },
    Busan: {
        divDisplay: 'flex',

    }
}

export const ScTop = styled.div`
    display:${_ScTop[ProjectResource.styleMode].divDisplay};
    > h4{
       display: inline-block;
       flex: 1;
       font-size: 24px;
       color:#21EA74;
    }

`;

/******************************************************************/

export const SctRht_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SctRht.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SctRht.Busan;
    }
    return {};
}

export const _SctRht = {
    Cleannara: {
        divDisplay: 'flex',

    },
    Busan: {
        divDisplay: 'flex',

    }
}

export const SctRht = styled.div`
    display:${_SctRht[ProjectResource.styleMode].divDisplay};
    align-items: center;

`;

/******************************************************************/

export const SctSch_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SctSch.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SctSch.Busan;
    }
    return {};
}

export const _SctSch = {
    Cleannara: {
        divDisplay: 'flex',
        divWidth: '270px',
        divHeight: '31px',

    },
    Busan: {
        divDisplay: 'flex',
        divWidth: '270px',
        divHeight: '31px',

    }
}

export const SctSch = styled.div`
    display:${_SctSch[ProjectResource.styleMode].divDisplay};
    width:${_SctSch[ProjectResource.styleMode].divWidth};
    height:${_SctSch[ProjectResource.styleMode].divHeight};
    padding-right: 10px;
    border-right: dashed 1px #e5e5e5;

    > a {
        display: inline-block;
        width: 40px;
        height: 32px;
        background: url(${ teamTableSearch }) no-repeat;
        margin-right: 10px;
    }
`;


/******************************************************************/

export const SctAdd_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SctAdd.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SctAdd.Busan;
    }
    return {};
}

export const _SctAdd = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    }
}

export const SctAdd = styled.div`
    display:${_SctAdd[ProjectResource.styleMode].divDisplay};
    width:${_SctAdd[ProjectResource.styleMode].divWidth};
    height:${_SctAdd[ProjectResource.styleMode].divHeight};
    background: url(${ teamTablePlus }) no-repeat;
    margin-left: 20px;
    margin-right: 8px;

`;


/******************************************************************/

export const SctDel_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _SctDel.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _SctDel.Busan;
    }
    return {};
}

export const _SctDel = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    }
}

export const SctDel = styled.div`
    display:${_SctDel[ProjectResource.styleMode].divDisplay};
    width:${_SctDel[ProjectResource.styleMode].divWidth};
    height:${_SctDel[ProjectResource.styleMode].divHeight};
    background: url(${ teamTableBin }) no-repeat;

`;


/*treenode.jsx********************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/


export const EditArea_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _EditArea.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _EditArea.Busan;
    }
    return {};
}

export const _EditArea = {
    Cleannara: {
        divDisplay: 'flex',

    },
    Busan: {
        divDisplay: 'flex',

    }
}

export const EditArea = styled.div`
    display:${_EditArea[ProjectResource.styleMode].divDisplay};
    position:absolute;
    top: 0;
    right: 10px;
    visibility:visible;

`;


/**********************************************************************/

export const TreeEdit_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _TreeEdit.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _TreeEdit.Busan;
    }
    return {};
}

export const _TreeEdit = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    }
}

export const TreeEdit = styled.div`
    display:${_TreeEdit[ProjectResource.styleMode].divDisplay};
    width:${_TreeEdit[ProjectResource.styleMode].divWidth};
    height:${_TreeEdit[ProjectResource.styleMode].divHeight};
    background: url(${ treeEdit }) no-repeat;
    margin-right: 6px;

`;

/**********************************************************************/

export const TreeMinus_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _TreeMinus.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _TreeMinus.Busan;
    }
    return {};
}

export const _TreeMinus = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    }
}

export const TreeMinus = styled.div`
    display:${_TreeMinus[ProjectResource.styleMode].divDisplay};
    width:${_TreeMinus[ProjectResource.styleMode].divWidth};
    height:${_TreeMinus[ProjectResource.styleMode].divHeight};
    background: url(${ treeMinus }) no-repeat;
    margin-right: 6px;
`;

/**********************************************************************/

export const TreePlus_ = () => {
    if (ProjectResource.StyleType === "Cleannara") {
        return _TreePlus.Cleannara;
    } else if (ProjectResource.StyleType === "Busan") {
        return _TreePlus.Busan;
    }
    return {};
}

export const _TreePlus = {
    Cleannara: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '19px',
    },
    Busan: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '19px',
    }
}

export const TreePlus = styled.div`
    display:${_TreePlus[ProjectResource.styleMode].divDisplay};
    width:${_TreePlus[ProjectResource.styleMode].divWidth};
    height:${_TreePlus[ProjectResource.styleMode].divHeight};
    background: url(${ treePlus }) no-repeat;
`;