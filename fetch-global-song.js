const fs = require("fs");

const TOKEN =
process.env.GH_TOKEN;

const OWNER =
"spotify-chart-hit";

const REPO =
"X";

const FILE =
"X.json";

async function fetchSong() {

try {

const response =
await fetch(

`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`,

{
headers: {
Authorization:
`token ${TOKEN}`,

Accept:
"application/vnd.github.v3.raw"
}
}

);

if (

response.status !== 200

) {

throw new Error(
`Failed X 😭 ${response.status}`
);

}

const data =
await response.json();

const chartResponse =
await fetch(

`https://api.github.com/repos/${OWNER}/${REPO}/contents/global-chart-dates.json`,

{
headers: {
Authorization:
`token ${TOKEN}`,

Accept:
"application/vnd.github.v3.raw"
}
}

);

if (

chartResponse.status !== 200

) {

throw new Error(
`Failed chart date 😭 ${chartResponse.status}`
);

}

const chartDate =
await chartResponse.json();

fs.mkdirSync(
"data/history",
{
recursive: true
}
);

if (

fs.existsSync(
"data/global-global-song.json"
)

) {

const oldData =
JSON.parse(

fs.readFileSync(
"data/global-global-song.json",
"utf8"
)

);

if (

oldData.dailyLastUpdate
!==

chartDate.daily

) {

fs.writeFileSync(

"data/history/yesterday-daily-global-global-song.json",

JSON.stringify(
oldData,
null,
2
)

);

}

if (

oldData.weeklyLastUpdate
!==

chartDate.weekly

) {

fs.writeFileSync(

"data/history/previous-weekly-global-global-song.json",

JSON.stringify(
oldData,
null,
2
)

);

}

}

fs.writeFileSync(

"data/global-global-song.json",

JSON.stringify({

dailyLastUpdate:
chartDate.daily,

weeklyLastUpdate:
chartDate.weekly,

entries:
data

},
null,
2
)

);

console.log(
"X downloaded 😍"
);

}

catch (err) {

console.log(
err.message
);

}

}

fetchSong();
