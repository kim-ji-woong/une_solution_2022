import { AccountController } from "../../Account/services/accountController";
import ProjectResource from "../../Root/resource/id";

class UserRightsEditManager {
    constructor(owner) {
        this.owner = owner;
    }

    setUsers(users) {
        this.originUsers = this.copyUsers(users);
        this.updateUsers = {};
        this.deleteUsers = {};
    }

    copyUsers(users) {
        const copyUsers = [];

        for (const user of users) {
            const copyUser = { ...user };
            const dataCenters = [];

            for (const dataCenter of copyUser.dataCenters) {
                dataCenters.push({ ...dataCenter });
            }

            copyUser.dataCenters = dataCenters;
            copyUser.userData = { ...copyUser.userData };
            copyUser.userLevel = { ...copyUser.userLevel };

            copyUsers.push(copyUser);
        }

        return copyUsers;
    }

    updateUser(user) {
        if (user) {
            const originUser = this.getOriginUser(user.id);

            if (originUser.userData.activate === user.userData.activate && this.isSameMemo(originUser, user) && this.isSameDataCenters(originUser, user)) {
                delete this.updateUsers[user.id];
            }
            else {
                this.updateUsers[user.id] = user;
            }
        }
    }

    deleteUser(user) {
        if (user) {
            this.deleteUsers[user.id] = user;
        }
    }

    isSameDataCenters(user1, user2) {
        const len1 = user1.dataCenters.length;
        const len2 = user2.dataCenters.length;

        if (len1 !== len2) {
            return false;
        }

        for (let i = 0; i < len1; i++) {
            const dataCenter = user1.dataCenters[i];
            let find = false;

            for (let j = 0; j < len2; j++) {
                const dataCenter2 = user2.dataCenters[j];

                if (dataCenter.id === dataCenter2.id) {
                    find = true;
                    break;
                }
            }

            if (find === false) {
                return false;
            }
        }

        return true;
    }

    isSameMemo(user1, user2) {
        const isEmptyMemo1 = !user1.userData.memo || user1.userData.memo.trim().length === 0;
        const isEmptyMemo2 = !user2.userData.memo || user2.userData.memo.trim().length === 0;

        if (isEmptyMemo1 === isEmptyMemo2) {
            return true;
        }

        if (user1.userData.memo === user2.userData.memo) {
            return true;
        }

        return false;
    }

    getOriginUser(userID) {
        for (const user of this.originUsers) {
            if (user.id === userID) {
                return user;
            }
        }

        return null;
    }

    isChanged() {
        for (const userID in this.updateUsers) {
            return true;
        }

        for (const userID in this.deleteUsers) {
            return true;
        }

        return false;
    }

    /*findDataCenter(id, dataCenters) {
        for (const dataCenter of dataCenters) {
            if (dataCenter.id === id) {
                return dataCenter;
            }
        }

        return null;
    }*/

    async save() {
        const userDatas = [];

        for (const userID in this.updateUsers) {
            const user = this.updateUsers[userID];
            UserRightsEditManager.addUserData(user, userDatas);

            /*const userDataCenterCount = user.dataCenters.length;

            const addedCenters = [];
            const originDataCenters = [ ...this.owner.state.dataCenters ];

            for (let i = userDataCenterCount - 1; i >= 0; i--) {
                const dataCenter = user.dataCenters[i];

                if (dataCenter.data?.isClone && dataCenter.data?.parentID) {
                    let parentDataCenter = null;

                    for (const center of user.dataCenters) {
                        if (center.id === dataCenter.data.parentID) {
                            parentDataCenter = center;
                            break;
                        }
                    }

                    // 원본에 대한 권한이 없으면 복제본에 대한 권한도 없다.
                    if (!parentDataCenter) {
                        user.dataCenters.splice(i, 1);
                    }
                }
                else if (dataCenter.data?.isClone === false) {
                    // 원본에 대한 권한을 주면 복제본에 대한 권한도 추가한다.
                    for (const dataCenter of originDataCenters) {
                        if (dataCenter.data?.isClone && dataCenter.data?.parentID === dataCenter.id) {
                            if (this.findDataCenter(dataCenter.data.parentID, user.dataCenters) === null) {
                                addedCenters.push(dataCenter);
                            }
                        }
                    }
                }
            }*/
        }

        const [success, errorMessage] = await AccountController.requestUpdateAccountUsers2(userDatas);

        if (success) {
            const newUsers = [];

            for (let i = this.originUsers.length - 1; i >= 0; i--) {
                const user = this.originUsers[i];
                const _user = this.updateUsers[user.id];

                if (_user) {
                    this.originUsers[i] = ProjectResource.makeClone(_user);
                    newUsers.push(ProjectResource.makeClone(_user));
                }
                else {
                    newUsers.push({ ...user });
                }
            }

            this.updateUsers = {};
            this.deleteUsers = {};
            this.owner.setState({ users: newUsers, isChanged: false });
        }
        else {
            this.owner.props.alertMessage(errorMessage, ProjectResource.ID.messageBox.title.error);
        }
    }

    static addUserData(user, userDatas) {
        const userData = {
            userID: user.id,
            activate: user.userData.activate,
            memo: user.userData.memo,
            dataCenterIDs: UserRightsEditManager.getDataCenterIDs(user)
        }

        userDatas.push(userData);
    }

    static getDataCenterIDs(user) {
        const ids = [];

        for (const dataCenter of user.dataCenters) {
            ids.push(dataCenter.id);
        }

        return ids;
    }
}
export default UserRightsEditManager;