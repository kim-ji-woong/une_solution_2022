import React, { Component } from 'react';

class TreeNode extends Component {

	constructor(props) {
		super(props);

		this.state = {
		}

		this.props = props;
	}

    onTreeMenu = (e, currentTarget) => {
        e.stopPropagation();

        const target = currentTarget.parentElement;

        if(target.classList.contains('treeLast')) {
            target.classList.toggle('on');
        } 
        else {
            const targetNode = target.children[2];
            target.classList.toggle('on');
            targetNode.classList.toggle('on');
        }
    }

    onSelectedTeam = (team) => {
        this.props.selectedTeam(team);
    }

    render() {
        const teamTreeData = this.props.teamTreeData;

        // 하위 팀이 있으면 하위 노드 반복 출력
        if(teamTreeData.children.length > 0) {
            return (
                <li>
                    <button onClick={(e) => this.onTreeMenu(e, e.currentTarget)} />
                    <h5 onClick={() => this.onSelectedTeam(teamTreeData)}>{teamTreeData.teamName}</h5>
                    <ul>
                        {
                            teamTreeData.children.map((data, index) => (
                                <TreeNode
                                    key={'tree_' + index}
                                    teamTreeData={data}
                                    selectedTeam={this.props.selectedTeam}
                                />
                            ))
                        }
                    </ul>
                </li>
            );
        } else {
            return (
                <li className='treeLast'>
                    <h5 onClick={() => this.onSelectedTeam(teamTreeData)}>{teamTreeData.teamName}</h5>
                </li>
            );
        }
    }
}

export default TreeNode;