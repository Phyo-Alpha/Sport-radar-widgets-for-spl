const teamId = 44;
const seasonId = 93741;
const playerId = 1406549;

async function fetchData(url) {

    return fetch(url)
        .then((response) => {
            return response.json();
        })
        .catch((err) => console.error(err));
}


async function displayPrevMatchData() {
    const data = await fetchData(`http://localhost:3000/competitor-summary?teamId=${teamId}`);

    if (data === undefined) {
        return;
    }

    const prevMatchTable = document.querySelector(".prev-matches-table");

    const prevMatchesTableBody = document.createElement("tbody");
    prevMatchesTableBody.classList.add("prev-matches-table-body");
    prevMatchTable.appendChild(prevMatchesTableBody);

    const previousMatches = data.summaries
        .filter(
            (summary) => summary.sport_event_status.match_status === "ended"
        )
        .slice(0, 5);

    previousMatches.forEach((match) => {
        const startTime = match.sport_event.start_time;
        const opposition = match.sport_event.competitors.filter(
            (competitor) => competitor.id !== "sr:competitor:" + teamId
        )[0].name;

        const homeScore = match.sport_event_status.home_score;
        const awayScore = match.sport_event_status.away_score;

        const formattedStartTime = new Date(startTime).toLocaleDateString(
            "en-US",
            {
                month: "numeric",
                day: "2-digit",
                year: "2-digit",
            }
        );

        const matchResult = () => {
            const winnerId = match.sport_event_status.winner_id;
            if (winnerId === "sr:competitor:" + teamId) {
                return "W";
            } else if (winnerId !== "sr:competitor:" + teamId) {
                return "L";
            } else {
                return "D";
            }
        };

        prevMatchesTableBody.innerHTML += `
            
            <tr>
              <td>${formattedStartTime}</td>
              <td>${opposition}</td>
              <td>${matchResult()} ${homeScore}-${awayScore}</td>
            </tr>
          `;
    });
}

async function displayClubPlayersStats() {
    const data = await fetchData(`http://localhost:3000/club-players-stats?teamId=${teamId}&seasonId=${seasonId}`);

    if (data === undefined) {
        return;
    }

    const playerInfo = data.competitor.players;

    const matchesPlayedTableBody = document.querySelector(".matches-played-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.matches_played - a.statistics.matches_played;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const matchesPlayed = player.statistics.matches_played;

        matchesPlayedTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${matchesPlayed}</td>
            </tr>
        `;
    }

    const playerGoalsTableBody = document.querySelector(".player-goals-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.goals_scored - a.statistics.goals_scored;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const goals = player.statistics.goals_scored;

        playerGoalsTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${goals}</td>
            </tr>
        `;
    }

    const playerAssistsTableBody = document.querySelector(".player-assists-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.assists - a.statistics.assists;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const assists = player.statistics.assists;

        playerAssistsTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${assists}</td>
            </tr>
        `;
    }

    const playerShotsTableBody = document.querySelector(".player-shots-table-body");

    playerInfo.sort((a, b) => {
        const totalShotsA = a.statistics.shots_blocked ? a.statistics.shots_blocked : 0 + a.statistics.shots_on_target ? a.statistics.shots_on_target : 0 + a.statistics.shots_off_target ? a.statistics.shots_off_target : 0;
        const totalShotsB = b.statistics.shots_blocked ? b.statistics.shots_blocked : 0 + b.statistics.shots_on_target ? b.statistics.shots_on_target : 0 + b.statistics.shots_off_target ? b.statistics.shots_off_target : 0;
        return totalShotsB - totalShotsA;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const shots_blocked = player.statistics.shots_blocked ? player.statistics.shots_blocked : 0;
        const shots_on_target = player.statistics.shots_on_target ? player.statistics.shots_on_target : 0;
        const shots_off_target = player.statistics.shots_off_target ? player.statistics.shots_off_target : 0;
        const shots_total = shots_on_target + shots_off_target + shots_blocked;

        playerShotsTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${shots_total}</td>
            </tr>
        `;
    }

    const shotsOnTargetTableBody = document.querySelector(".shots-on-target-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.shots_on_target - a.statistics.shots_on_target;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const shots_on_target = player.statistics.shots_on_target;

        shotsOnTargetTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${shots_on_target}</td>
            </tr>
        `;
    }

    const yellowCardsTableBody = document.querySelector(".yellow-cards-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.yellow_cards - a.statistics.yellow_cards;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const yellow_cards = player.statistics.yellow_cards;

        yellowCardsTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${yellow_cards}</td>
            </tr>
        `;
    }

    const redCardsTableBody = document.querySelector(".red-cards-table-body");

    playerInfo.sort((a, b) => {
        return b.statistics.red_cards - a.statistics.red_cards;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const red_cards = player.statistics.red_cards;

        redCardsTableBody.innerHTML += `
            <tr>
                <td>${i + 1}.</td>
                <td>${playerName}</td>
                <td>${red_cards}</td>
            </tr>
        `;
    }

    const playerListTableBody = document.querySelector(".player-list-table-body");

    playerInfo.forEach((player) => {
        const playerName = player.name;
        const matchStarted = player.statistics.matches_played;
        const goals = player.statistics.goals_scored;
        const shots = player.statistics.shots_on_target ? player.statistics.shots_on_target : 0 + player.statistics.shots_off_target ? player.statistics.shots_off_target : 0 + player.statistics.shots_blocked ? player.statistics.shots_blocked : 0;
        const assists = player.statistics.assists;
        const yellow_cards = player.statistics.yellow_cards;
        const red_cards = player.statistics.red_cards;
        const fouls = player.statistics.yellow_cards + player.statistics.red_cards;

        playerListTableBody.innerHTML += `
            <tr>
                <td>${playerName}</td>
                <td>${matchStarted}</td>
                <td>${goals}</td>
                <td>${shots}</td>
                <td>${assists}</td>
                <td>${yellow_cards}</td>
                <td>${red_cards}</td>
                <td>${fouls}</td>
            </tr>
        `;
    })
}

async function displayFullTeamRoaster() {
    const data = await fetchData(`http://localhost:3000/club-squadList?teamId=${teamId}`);

    if (data === undefined) {
        return;
    }

    const squadList = data.players;

    squadList.sort((a, b) => {
        return a.jersey_number - b.jersey_number;
    });

    const squadListTableBody = document.querySelector(".squad-list-table-body");

    squadList.forEach((player) => {
        const playerName = player.name;
        const shirtNumber = player.jersey_number;
        const dateOfBirth = player.date_of_birth;
        const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
        const nationality = player.nationality;
        const position = player.type.toUpperCase();

        squadListTableBody.innerHTML += `
            <tr>
                <td>${shirtNumber}</td>
                <td>${playerName}</td>
                <td>${dateOfBirth}</td>
                <td>${age}</td>
                <td>${nationality}</td>
                <td>${position}</td>
            </tr>
        `;
    })
}

async function displayPlayerInfo() {
    const data = await fetchData(`http://localhost:3000/club-players-stats?teamId=${teamId}&seasonId=${seasonId}`);

    if (data === undefined) {
        return;
    }

    const seasonName = data.season.name;
    const playersInfo = data.competitor.players;
    const teamName = data.competitor.name;

    const targetPlayer = playersInfo.find((player) => player.id === "sr:player:" + playerId);

    const playerStatsTableBody = document.querySelector(".player-stats-table-body");
    const playerStatTitle = document.querySelector(".player-stat-title");

    playerStatTitle.innerHTML = `${targetPlayer.name} STATS`;

    const { assists, cards_given, shots_blocked, shots_off_target, shots_on_target, yellow_cards, red_cards, goals_scored } = targetPlayer.statistics;
    playerStatsTableBody.innerHTML += `
        <tr>
            <td>${seasonName}</td>
            <td>${teamName}</td>
            <td>${goals_scored}</td>
            <td>${(shots_on_target ? shots_on_target : 0) + (shots_off_target ? shots_off_target : 0) + (shots_blocked ? shots_blocked : 0)}</td>
            <td>${assists}</td>
            <td>${cards_given}</td>
            <td>${yellow_cards}</td>
            <td>${goals_scored}</td>
            
        </tr>
    `;
}

async function displayPlayerGameLog() {
    const data = await fetchData(`http://localhost:3000/player-game-log?playerId=${playerId}`);

    if (data === undefined) {
        return;
    }

    const gamelogs = data.summaries;
    const playerGameLogTableBody = document.querySelector(".player-preMatches-stats-table-body");

    const playerGameLogTitle = document.querySelector(".player-gamelog-title");

    gamelogs.forEach((gamelog) => {
        const date = gamelog.sport_event.start_time;

        const formattedDate = new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        });

        const opponent = gamelog.sport_event.competitors.find((competitor) => competitor.id !== "sr:competitor:" + teamId).name;

        const playerStats = gamelog.statistics.totals.competitors.find((competitor) => competitor.id === "sr:competitor:" + teamId).players.find((player) => player.id === "sr:player:" + playerId).statistics;

        const { assists, shots_blocked, shots_off_target, shots_on_target, yellow_cards, red_cards, goals_scored } = playerStats;

        playerGameLogTableBody.innerHTML += `
            <tr>
                <td>${opponent}</td>
                <td>${formattedDate}</td>
                <td>${(shots_on_target ? shots_on_target : 0) + (shots_off_target ? shots_off_target : 0) + (shots_blocked ? shots_blocked : 0)}</td>
                <td>${goals_scored}</td>
                <td>${assists}</td>
                <td>${yellow_cards + red_cards}</td>
                <td>${yellow_cards}</td>
                <td>${red_cards}</td>
            </tr>
        `;
    })
}

displayFullTeamRoaster();
displayClubPlayersStats();
displayPrevMatchData();
displayPlayerInfo();
displayPlayerGameLog();
