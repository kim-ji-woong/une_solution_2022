import React, { Component } from 'react';

import { TreeMenuComponent } from '../../styled/teamEditorStyled';
import TreeNode from './treeNode';

class TreeMenu extends Component {

	constructor(props) {
		super(props);

		this.state = {
		}

		this.props = props;
	}

    render() {
		const teamList = this.props.teamList;

        return (
            <TreeMenuComponent>
                <div className={'sarSel'}>
					<h5>조직</h5>
				</div>

				<div className='treeWrap'>
					<ul>
						{
							teamList.map((data, index) => (
								data.children.length > 0 &&
								<TreeNode
									key={'tree_' + index}
									teamTreeData={data}
									selectedTeam={this.props.selectedTeam}
								/>
							))
						}
					</ul>
				</div>
            </TreeMenuComponent>
        );
    }
}

export default TreeMenu;