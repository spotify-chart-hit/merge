const fs = require("fs");

const TOKEN =
process.env.GH_TOKEN;

const OWNER =
"spotify-chart-hit";

const REPO =
"regional";

const FILE =
"regional.json";

async function fetchRegional() {

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
`Failed regional 😭 ${response.status}`
);

}

const data =
await response.json();

const chartResponse =
await fetch(

`https://api.github.com/repos/${OWNER}/${REPO}/contents/chart-dates-americas.json`,

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
"data/song.json"
)

) {

const oldData =
JSON.parse(

fs.readFileSync(
"data/song.json",
"utf8"
)

);

if (

oldData.dailyLastUpdate
!==

chartDate.daily

) {

fs.writeFileSync(

"data/history/yesterday-daily-song.json",

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

"data/history/previous-weekly-song.json",

JSON.stringify(
oldData,
null,
2
)

);

}

}

fs.writeFileSync(

"data/song.json",

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
"regional downloaded 😍"
);

}

catch (err) {

console.log(
err.message
);

}

}

fetchRegional();
