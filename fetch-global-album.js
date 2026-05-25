const fs = require("fs");

const TOKEN =
process.env.GH_TOKEN;

const OWNER =
"spotify-chart-hit";

const REPO =
"global-album";

const FILE =
"global-album.json";

async function fetchGlobalAlbum() {

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
`Failed album 😭 ${response.status}`
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
"data/global-album.json"
)

) {

const oldData =
JSON.parse(

fs.readFileSync(
"data/global-album.json",
"utf8"
)

);

if (

oldData.weeklyLastUpdate
!==

chartDate.weekly

) {

fs.writeFileSync(

"data/history/previous-weekly-global-album.json",

JSON.stringify(
oldData,
null,
2
)

);

}

}

fs.writeFileSync(

"data/global-album.json",

JSON.stringify({

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
"global album downloaded 😍"
);

}

catch (err) {

console.log(
err.message
);

}

}

fetchGlobalAlbum();
