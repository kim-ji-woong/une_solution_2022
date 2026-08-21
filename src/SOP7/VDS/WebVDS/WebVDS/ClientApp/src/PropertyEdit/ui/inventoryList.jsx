import React, { Component } from 'react';

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';

class InventoryList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pageCount: null,
            pageIndex: 1
        }

        this.maxCountPerPage = 12;
    }

    componentWillUnmount() {
        const state = { ...this.state };
        ProjectResource.deleteObject(state);
    }

    getRackGroupElements() {
        const rackGroups = this.props.rackGroups;
        const options = [];

        if (!rackGroups) {
            return [];
        }

        for (const groupName in rackGroups) {
            const rackGroup = rackGroups[groupName];

            if (options.length === 0) {
                options.push(
                    <option>{ProjectResource.ID.edit.inventoryListDetail.all}</option>
                );
            }

            options.push(<option>{rackGroup.groupName}</option>);
        }

        return options;
    }

    render() {
        return (
            <>
                <div id={edit.ITpropertyPop}>
                  <div>
                   <div>

                {/* <div className={edit.inventListBackground}> */}
                  <div className={edit.inventListPopup}>
                     <div className={edit.inventMenu}>
                        <span className={edit.inventMenuBox}>
                            <span className={edit.inventMenuIcon}></span>
                            <span className={edit.inventMenuTitle}>{ProjectResource.ID.edit.inventoryList}</span>
                        </span>
                        <span className={edit.inventUnderLine}></span>
                        <span className={edit.rackTitle}>{ProjectResource.ID.edit.inventoryListDetail.rack}</span>
                        <span className={edit.propertyTitle}>{ProjectResource.ID.edit.inventoryListDetail.itProperty}</span>
                        <span className={edit.facilitiesTitle}>{ProjectResource.ID.edit.inventoryListDetail.facility}</span>
                        <span className={edit.etcTitle}>{ProjectResource.ID.edit.inventoryListDetail.etc}</span>
                     </div>

                     <div className={edit.inventContents}>
                        <div style={{ display: 'flex' }}>
                            <span className={edit.inventContentsTitle}>{ProjectResource.ID.edit.inventoryListDetail.rackList}</span>
                            <span className={edit.inventContentClose}></span>
                       </div>
                        <span className={edit.zoneSelectBox}>
                            <span className={edit.zoneTitle}>{ProjectResource.ID.edit.inventoryListDetail.area}</span>
                            <select className={edit.zoneSelect}>
                            {
                                this.getRackGroupElements()
                            }
                           </select>
                        </span>

                        <span className={edit.searchBox}>
                          <span className={edit.searchArea}>
                             <span className={edit.searchIcon}></span>
                             <span>
                               <input type="text" />
                               <span className={edit.searchBtn}>{ProjectResource.ID.edit.inventoryListDetail.search}</span>
                             </span>
                          </span>
                          <span className={edit.downArea}>
                            <span className={edit.selectDown}>
                               <p>{ProjectResource.ID.edit.inventoryListDetail.downloadSelection}</p>
                               <span className={edit.downIcon}></span>
                            </span>
                            <span className={edit.dashedLine}></span>
                            <span className={edit.entireDown}>
                               <p>{ProjectResource.ID.edit.inventoryListDetail.downloadAll}</p>
                               <span className={edit.downIcon}></span>
                            </span>
                          </span>
                        </span>

                        <div className={edit.inventTable}>
                          <table>
                            <thead>
                              <tr>
                                <th><input type="checkBox" /></th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.regDate}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.area}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.hostName}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.kind}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.company}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.unit}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.modelName}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.type}</th>
                                <th>{ProjectResource.ID.edit.inventoryListDetail.size}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td> 
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            <tr>
                                <td><input type="checkBox" /></td>
                                <td>23.03.02</td>
                                <td>L-1</td>
                                <td>Rack01</td>
                                <td>서버</td>
                                <td>DELL</td>
                                <td>36</td>
                                <td>R220</td>
                                <td>A타입</td>
                                <td>600*900*1090</td>
                            </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className={edit.pageArea}>
                           <span className={edit.leftArrowIcon}></span>
                            <span className={edit.pageNumBox}>1/5</span>
                           <span className={edit.rightArrowIcon}></span>
                        </div>

                    </div>
                  </div>
                  {/* </div> */}
                </div>
                </div>
            </div>
            </>
        );
    }
}

export default InventoryList;
