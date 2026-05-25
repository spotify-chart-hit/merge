const fs = require("fs");

const TOKEN =
process.env.GH_TOKEN;

const OWNER =
"spotify-chart-hit";

const REPO =
"artist";

const FILE =
"artist.json";

async function fetchArtist() {

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
`Failed artist 😭 ${response.status}`
);

}

const data =
await response.json();

const chartResponse =
await fetch(

`https://api.github.com/repos/${OWNER}/${REPO}/contents/chart-artist-americas.json`,

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
"data/artist.json"
)

) {

const oldData =
JSON.parse(

fs.readFileSync(
"data/artist.json",
"utf8"
)

);

if (

oldData.dailyLastUpdate
!==

chartDate.daily

) {

fs.writeFileSync(

"data/history/yesterday-daily-artist.json",

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

"data/history/previous-weekly-artist.json",

JSON.stringify(
oldData,
null,
2
)

);

}

}

fs.writeFileSync(

"data/artist.json",

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
"artist downloaded 😍"
);

}

catch (err) {

console.log(
err.message
);

}

}

fetchArtist();
