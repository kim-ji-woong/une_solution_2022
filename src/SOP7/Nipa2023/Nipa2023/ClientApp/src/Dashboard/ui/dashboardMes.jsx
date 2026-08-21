import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ConfirmDialog from '../../Common/ui/confirmDialog';
import { DashboardMesComponent } from '../styled/dashboardStyled';
import DashboardResource from '../resource/id';
import Clock from './components/clock';
import MesProduct from './components/mesProduct';
import MesQuality from './components/mesQuality';
import MesBuy from './components/mesBuy';
import MesSell from './components/mesSell';
import { SdmsController } from '../../SDMS/services/sdmsController';

import ProjectResource from '../../Root/resource/id';

class dashboardMes extends Component {
    constructor(props) {
        super(props);
		
		this.state = {
            menu: DashboardResource.Menu.Product,

            productDatas: [],
            qualityDatas: [],
            buyDatas: [],
            sellDatas: [],
            buyColors: [],
            sellColors: [],

            confirmMessage: {
                visible: false,
                messages: [""],
                buttons: ["확인"],
                onClose: this.onCloseConfirmDialog,
                onClickButton: null,
                type: null
            },
        }

		this.props = props;

        this.init();
	}

    componentDidMount() {
        // 1분에 한번씩 데이터를 새로 불러옴
        this.mesInterval = setInterval(this.init, 60000);
    }

    componentWillUnmount() {
        // 언마운트 될 때 interval 중지
        clearInterval(this.mesInterval);
    }

    init = async () => {
        const campusID = ProjectResource.campusID;

        if(campusID) {
            const [productDatas, message1] = await SdmsController.requestMESData(campusID, 0);

            if(productDatas) {
                this.setState({ productDatas });
            }
            else {
                this.showConfirmDialog([message1], null, null, 'error');
            }

            const [qualityDatas, message2] = await SdmsController.requestMESData(campusID, 1);

            if(qualityDatas) {
                this.setState({ qualityDatas });
            }
            else {
                this.showConfirmDialog([message2], null, null, 'error');
            }

            const [buyDatas, message3] = await SdmsController.requestMESData(campusID, 2);

            if(buyDatas) {
                this.setState({ buyDatas });
            }
            else {
                this.showConfirmDialog([message3], null, null, 'error');
            }

            const [sellDatas, message4] = await SdmsController.requestMESData(campusID, 3);

            if(sellDatas) {
                this.setState({ sellDatas });
            }
            else {
                this.showConfirmDialog([message4], null, null, 'error');
            }
        }
    }

    showConfirmDialog = (messages, buttons, onClickButton, type) => {
        const confirmMessage = { ...this.state.confirmMessage };
        confirmMessage.visible = true;
        confirmMessage.messages = messages;
		confirmMessage.buttons = buttons;
		confirmMessage.onClickButton = onClickButton;
		confirmMessage.type = type;

        if (!messages) {
            confirmMessage.messages = [""];
        }
        else if (Array.isArray(messages)) {
            confirmMessage.messages = messages;
        }
        else {
            confirmMessage.messages = [messages];
        }

        this.setState({ confirmMessage });
    }

    onCloseConfirmDialog = () => {
		const confirmMessage = { ...this.state.confirmMessage };
		confirmMessage.visible = false;

		this.setState({ confirmMessage });
	}

    onChangeMenu = (menu) => {
        const navMenu = this.state.menu;

        if(navMenu !== menu) {
            this.setState({ menu: menu });
        }
    }

    render() {
        const navMenu = this.state.menu;
        const colors = ["#2cf1b8", "#ead401", "#88e6ff", "#01f5e2", "#baf051", "#FFC4A3", "#9F9CB6", "#FFCC85", "#A6CBE9", "#FFAE6A", "#32708D", "#F0A85B", "#BAD252", "#FF953F", "#F97645", "#A9908A", "#DF7755", "#EA6C51", "#DDFSAE", "#FFBC66", "#EE8558", "#B7C0DF", "#FFBC43", "#63647F", "#FFC325", "#FFBD6A", "#F4ABB4", "#DDDCE9", "#FFA798", "#FF9CB5", "#E0B0BC", "#FF8FAD", "#DD7C9C", "#F1617D", "#C84557", "#FFB1AB", "#FF8682", "#FFA2A2", "#ED5D47", "#CD4D4D", "#99424F", "#F9F68E", " #CDDA61", "#9EAD7C", "#BAB47C", "#76AF7B", "#AD9762", "#92AD65", "#BACD9D", "#919E7D", "#637F6A", "#2F9E77", "#DBF4E6", "#93E9EC", "#BCE5CB", "#BDB7B4", "#54D6C1", "#BDDCDC", "#1EC2D1", "#749594", "#1E9FAA", "#9AEAEF", "#AEDEF0", "#7BB0DB", "#1E94BE", "#59637F", "#5E869C", "#C89072", "#D5BA99", "#D29999", "#A58E72", "#AF7F6D", "#BC6862", "#916B5F", "#A6615A", "#635A56", "#786965", "#EF9F6D", "#F7F8F0", "#ADBBC0", "#7E878F", "#E4DFD1", "#A49D8F", "#B4BABA", "#CCCBE1", "#AEADCA", "#A889DF", "#6E87B2", "#879384", "#707FA0", "#E6C9E1", "#D885D9", "#C5C4D4", "#B191BD", "#AD7CA4", "#847EA6", "#705E7B"];

        return (
            <>
            <DashboardMesComponent className='UI_Section'>
                <div className='dashboardTop'>
                    <nav>
                        <ul>
                            <li className={navMenu === DashboardResource.Menu.Product ? 'on' : null} onClick={() => this.onChangeMenu(DashboardResource.Menu.Product)}>{DashboardResource.ID.mesMenu.product}</li>
                            <li className={navMenu === DashboardResource.Menu.Quality ? 'on' : null} onClick={() => this.onChangeMenu(DashboardResource.Menu.Quality)}>{DashboardResource.ID.mesMenu.quality}</li>
                            <li className={navMenu === DashboardResource.Menu.Buy ? 'on' : null} onClick={() => this.onChangeMenu(DashboardResource.Menu.Buy)}>{DashboardResource.ID.mesMenu.buy}</li>
                            <li className={navMenu === DashboardResource.Menu.Sell ? 'on' : null} onClick={() => this.onChangeMenu(DashboardResource.Menu.Sell)}>{DashboardResource.ID.mesMenu.sell}</li>
                        </ul>
                    </nav>
                    <Clock />
                </div>
                    {
                        navMenu === DashboardResource.Menu.Product &&
                            <MesProduct 
                                productDatas={this.state.productDatas}
                            />
                    }
                    {
                        navMenu === DashboardResource.Menu.Quality &&
                            <MesQuality
                                qualityDatas={this.state.qualityDatas}
                                colors={colors}
                            />
                    }
                    {
                        navMenu === DashboardResource.Menu.Buy &&
                            <MesBuy
                                buyDatas={this.state.buyDatas}
                                // colors={this.state.buyColors}
                                colors={colors}
                            />
                    }
                    {
                        navMenu === DashboardResource.Menu.Sell &&
                            <MesSell
                                sellDatas={this.state.sellDatas}
                                // colors={this.state.sellColors}
                                colors={colors}
                            />
                    }
            </DashboardMesComponent>
            {
                /* alert창 대신 사용 */
                this.state.confirmMessage.visible &&
                <ConfirmDialog 
                    messages={this.state.confirmMessage.messages} 
                    buttons={this.state.confirmMessage.buttons} 
                    onClose={this.state.confirmMessage.onClose}
                    onClickButton={this.state.confirmMessage.onClickButton}
                    onCloseConfirmDialog={this.onCloseConfirmDialog}
                    type={this.state.confirmMessage.type}
                />
            }
            </>
        );
    }
}

export default withRouter(dashboardMes);