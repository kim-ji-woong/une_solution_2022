export class JsonManager {
    static makeRequestTemporaryMembers() {
        const json = {
            "requestTemporaryMembers": true
        }

        return JSON.stringify(json);
    }

    static makeMoveRegularMembers(targetTeamID, regularMemberIDs) {
        const json = {
            "targetRegularTeamID": targetTeamID,
            "regularMemberIDs": regularMemberIDs
        }

        return JSON.stringify(json);
    }

    static makeMoveTemporaryMembers(targetTeamID, temporaryMemberIDs) {
        const json = {
            "targetTemporaryTeamID": targetTeamID,
            "temporaryMemberIDs": temporaryMemberIDs
        }

        return JSON.stringify(json);
    }

    static makeMoveRegularTeams(targetParentTeamID, regularTeamIDs) {
        const json = {
            "targetRegularParentTeamID": targetParentTeamID,
            "regularTeamIDs": regularTeamIDs
        }

        return JSON.stringify(json);
    }

    static makeMoveTemporaryTeams(targetParentTeamID, temporaryTeamIDs) {
        const json = {
            "targetTemporaryParentTeamID": targetParentTeamID,
            "temporaryTeamIDs": temporaryTeamIDs
        }

        return JSON.stringify(json);
    }
}