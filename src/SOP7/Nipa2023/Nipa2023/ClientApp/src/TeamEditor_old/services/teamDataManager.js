export class TeamDataManager {
    static makeTeams(teams) {
        const teamMaps = {};

        for (const team of teams) {
            team.children = [];
            teamMaps[team.id] = team;
        }

        const teamList = [];

        for (const team of teams) {
            if (team.parentTeamID !== null) {
                const parentTeam = teamMaps[team.parentTeamID];

                if (parentTeam) {
                    parentTeam.children.push(team);
                }
            }
            else {
                teamList.push(team);
            }
        }

        return teamList;
    }
}
