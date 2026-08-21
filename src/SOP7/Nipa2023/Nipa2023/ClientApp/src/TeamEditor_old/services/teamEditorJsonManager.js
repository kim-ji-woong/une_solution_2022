export class TeamEditorJsonManager {
    static makeRequestTeamList(siteID) {
        const json = {
            "siteID": siteID
        };

        return JSON.stringify(json);
    }

    static makeRequestTeamMemberList(teamID) {
        const json = {
            "teamID": teamID
        };

        return JSON.stringify(json);
    }
}