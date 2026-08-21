
import styled from 'styled-components';
import ProjectResource from '../../Root/resource/id';

import teamPlus from '../../TeamEditor/image/teamPlus.png';
import teamArrowDown from '../../TeamEditor/image/teamArrowDown.png';
import teamArrowUp from '../../TeamEditor/image/teamArrowUp.png';
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


export const _TeamSubAside = {
    default: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: 'calc(100% - 100px)',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#252E34',
        divFontSize: '18px',
    },
}

export const TeamSubAside = styled.div`
    display:${_TeamSubAside[ProjectResource.styleMode].divDisplay};
    width:${_TeamSubAside[ProjectResource.styleMode].divWidth};
    height:${_TeamSubAside[ProjectResource.styleMode].divHeight};
    background:${_TeamSubAside[ProjectResource.styleMode].divBackground};
    border-radius: 6px;
    position: absolute;
    left: 0;
    top: 25px;
    bottom: 0;
    margin-left: 30px;

`;


/*teamMenu.jsx***************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

export const _SaRht = {
    default: {
        divDisplay: 'block',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#252E34',
        divFontSize: '18px',
    },
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

export const _SarSel = {
    default: {
        divDisplay: 'flex',
        divWidth: '319px',
        divHeight: '949px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#252E34',
        divFontSize: '18px',
    },
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
         background: #1A1F23;
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
         /*background: url(${ teamArrowDown }) no-repeat;*/
    }

    > button.on:after {
        /*background: url(${ teamArrowUp }) no-repeat;*/
    }
    > ul{
	     position: absolute;
         left: 0;
         right: 0;
         top: 100%;
         z-index: 10;
         background: #1A1F23;
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

export const _SarEdit = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '20px',
        divColor: '#fff',
        divPadding: '0px 18px',
        divBackground: '#252E34',
        divFontSize: '18px',
    },
}

export const SarEdit = styled.div`
    display:${_SarEdit[ProjectResource.styleMode].divDisplay};
    width:${_SarEdit[ProjectResource.styleMode].divWidth};
    height:${_SarEdit[ProjectResource.styleMode].divHeight};
    background: url(${ teamPlus }) no-repeat;
    background-size: 17px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
`;


/*regularMemberPage.jsx********************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

export const _SubCont = {
    default: {
        divDisplay: 'block',

    },
}

export const SubCont = styled.div`
    display:${_SubCont[ProjectResource.styleMode].divDisplay};

    width: 98%;
    height: calc(100% - 60px);
    background: #252E34;
    border-radius: 6px;
    position: relative;
    overflow-y: auto;
    padding: 20px;
    /* margin-left: 360px; */
    top: -15px;

    .subConts{

    }

    &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        border-radius: 3px;
        background-color: #282828;
    }
    &::-webkit-scrollbar-thumb {
        width: 3px;
        border-radius: 3px;
        background: #20DFA8;
    }
    &::-webkit-scrollbar-button{
        width: 0px;
        height: 0px;
    }

    .addPointer tr:last-child{
        border: solid 3px #20DFA8;
    }

`;

/******************************************************************/

export const _ScWrap = {
    default: {
        divDisplay: 'block',

    },
}

export const ScWrap = styled.div`
    display:${_ScWrap[ProjectResource.styleMode].divDisplay};
    height: 96%;

`;

/******************************************************************/

export const _ScCont = {
    default: {
        divDisplay: 'block',

    },
}

export const ScCont = styled.div`
    display:${_ScCont[ProjectResource.styleMode].divDisplay};
    height:96%;
`;

/******************************************************************/

export const _ScTop = {
    default: {
        divDisplay: 'flex',

    },
}

export const ScTop = styled.div`
    display:${_ScTop[ProjectResource.styleMode].divDisplay};
    > h4{
       display: inline-block;
       flex: 1;
       font-size: 24px;
       color:#20DFA8;
    }

`;

/******************************************************************/

export const _SctRht = {
    default: {
        divDisplay: 'flex',

    },
}

export const SctRht = styled.div`
    display:${_SctRht[ProjectResource.styleMode].divDisplay};
    align-items: center;

`;

/******************************************************************/

export const _SctSch = {
    default: {
        divDisplay: 'flex',
        divWidth: '400px',
        divHeight: '31px',

    },
}

export const SctSch = styled.div`
    display:${_SctSch[ProjectResource.styleMode].divDisplay};
    width:${_SctSch[ProjectResource.styleMode].divWidth};
    height:${_SctSch[ProjectResource.styleMode].divHeight};
    padding-right: ${(props) => props.$isEditMode ? '10px' : 0};
    border-right: ${(props) => props.$isEditMode ? '1px dashed #707070' : 'none'};

    > a {
        display: inline-block;
        width: 40px;
        height: 32px;
        background: url(${ teamTableSearch }) no-repeat;
        margin-right: ${(props) => props.$isEditMode ? '6px' : 0};
        cursor: pointer;
    }
`;


/******************************************************************/

export const _SctAdd = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    },
}

export const SctAdd = styled.div`
    display:${_SctAdd[ProjectResource.styleMode].divDisplay};
    width:${_SctAdd[ProjectResource.styleMode].divWidth};
    height:${_SctAdd[ProjectResource.styleMode].divHeight};
    background: url(${ teamTablePlus }) no-repeat;
    margin-left: 20px;
    margin-right: 8px;
    position: relative;
    top: 1px;
    cursor: pointer;
`;


/******************************************************************/

export const _SctDel = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '32px',
        divHeight: '32px',

    },
}

export const SctDel = styled.div`
    display:${_SctDel[ProjectResource.styleMode].divDisplay};
    width:${_SctDel[ProjectResource.styleMode].divWidth};
    height:${_SctDel[ProjectResource.styleMode].divHeight};
    background: url(${ teamTableBin }) no-repeat;
    position: relative;
    top: 1px;
    cursor: pointer;
`;


/*treenode.jsx********************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/
/**********************************************************************/

export const _EditArea = {
    default: {
        divDisplay: 'flex',

    },
}

export const EditArea = styled.div`
    display:${_EditArea[ProjectResource.styleMode].divDisplay};
    position:absolute;
    top: 0;
    right: 10px;
    visibility:visible;

`;


/**********************************************************************/

export const _TreeEdit = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    },
}

export const TreeEdit = styled.div`
    display:${_TreeEdit[ProjectResource.styleMode].divDisplay};
    width:${_TreeEdit[ProjectResource.styleMode].divWidth};
    height:${_TreeEdit[ProjectResource.styleMode].divHeight};
    background: url(${ treeEdit }) no-repeat;
    margin-right: 6px;

`;

/**********************************************************************/

export const _TreeMinus = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '20px',
        divHeight: '19px',

    },
}

export const TreeMinus = styled.div`
    display:${_TreeMinus[ProjectResource.styleMode].divDisplay};
    width:${_TreeMinus[ProjectResource.styleMode].divWidth};
    height:${_TreeMinus[ProjectResource.styleMode].divHeight};
    background: url(${ treeMinus }) no-repeat;
    margin-right: 6px;
`;

/**********************************************************************/

export const _TreePlus = {
    default: {
        divDisplay: 'inline-block',
        divWidth: '19px',
        divHeight: '19px',
    },
}

export const TreePlus = styled.div`
    display:${_TreePlus[ProjectResource.styleMode].divDisplay};
    width:${_TreePlus[ProjectResource.styleMode].divWidth};
    height:${_TreePlus[ProjectResource.styleMode].divHeight};
    background: url(${ treePlus }) no-repeat;
`;