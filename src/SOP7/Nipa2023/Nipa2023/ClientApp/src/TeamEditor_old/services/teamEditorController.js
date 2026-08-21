import ProjectResource from "../../Root/resource/id";
import { TeamDataManager } from "./teamDataManager";
import { TeamEditorJsonManager } from "./teamEditorJsonManager";

export class TeamEditorController {
    static async requestTeamList(siteID) {
        try {
            const jsonData = TeamEditorJsonManager.makeRequestTeamList(siteID);

            const res = await fetch(ProjectResource.baseUrl + '/Team/TeamEditor/RequestTeamList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [TeamDataManager.makeTeams(result.teams), ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestTeamList 실패"];
    }

    static async requestTeamMemberList(teamID) {
        try {
            const jsonData = TeamEditorJsonManager.makeRequestTeamMemberList(teamID);

            const res = await fetch(ProjectResource.baseUrl + '/Team/TeamEditor/RequestTeamMemberList', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            if (res.ok) {
                const result = await res.json();

                if (result.success) {
                    return [result.members, ""];
                }
                else {
                    return [null, result.message];
                }
            }
        }
        catch (e) {
            console.log(e);
        }

        return [null, "requestTeamMemberList 실패"];
    }
}
