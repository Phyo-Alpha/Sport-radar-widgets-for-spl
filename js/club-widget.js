const teamId = 44;
const seasonId = 93741;

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

async function displayClubPlayersRoster() {
    const data = await fetchData(`http://localhost:3000/club-players-info?teamId=${teamId}&seasonId=${seasonId}`);

    if (data === undefined) {
        return;
    }

    const playerInfo = data.competitor.players;
    console.log(playerInfo);

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
        const totalShotsA = a.statistics.shots_blocked + a.statistics.shots_on_target + a.statistics.shots_off_target;
        const totalShotsB = b.statistics.shots_blocked + b.statistics.shots_on_target + b.statistics.shots_off_target;
        return totalShotsB - totalShotsA;
    });

    for (let i = 0; i < 5; i++) {
        const player = playerInfo[i];
        const playerName = player.name;
        const shots_blocked = player.statistics.shots_blocked;
        const shots_on_target = player.statistics.shots_on_target;
        const shots_off_target = player.statistics.shots_off_target;
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
        const shots = player.statistics.shots_on_target + player.statistics.shots_off_target + player.statistics.shots_blocked;
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

displayClubPlayersRoster();
displayPrevMatchData();