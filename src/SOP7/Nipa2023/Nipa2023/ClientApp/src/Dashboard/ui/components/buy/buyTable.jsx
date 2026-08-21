import React, { Component } from 'react';

import { BuyTableComponent } from '../../../styled/dashboardStyled';

class BuyTable extends Component {

    getDisplayView = () => {
        const buyDatas = this.props.buyDatas;
        const displayView = [];

        if(!buyDatas) {
            return displayView;
        }
        else {
            let index = 1;
            for(let i = 0; i < buyDatas.length; i++){
                const buyData = buyDatas[i];

                let requestCount = buyData.requestCount.toLocaleString();
                let incomeCount = buyData.incomeCount.toLocaleString();
                let diffCount = buyData.diffCount.toLocaleString();
                let remainCount = buyData.remainCount.toLocaleString();

                displayView.push(
                    <li key={'buyData_' + index}>
                        <ul className='bodyContent'>
                            <li>{index}</li>
                            <li>{buyData.customer}</li>
                            <li>{requestCount === '0' ? '-' : requestCount}</li>
                            <li>{incomeCount === '0' ? '-' : incomeCount}</li>
                            <li>{diffCount === '0' ? '-' : diffCount}</li>
                            <li>{remainCount === '0' ? '-' : remainCount}</li>
                        </ul>
                    </li>
                );
                index++;
            }
            
            return displayView;
        }
    }

    render() {

        const displayView = this.getDisplayView();
        const bodyHeight = displayView.length;

        return (
            <BuyTableComponent className='buyTable' $bodyHeight={bodyHeight}>
                <ul className='head'>
                    <li>NO</li>
                    <li>고객명</li>
                    <li>발주수량</li>
                    <li>입고수량</li>
                    <li>차이수량</li>
                    <li>재고수량</li>
                </ul>
                <ul className='body'>
                    {displayView}
                </ul>
            </BuyTableComponent>
        );
    }
}

export default BuyTable;