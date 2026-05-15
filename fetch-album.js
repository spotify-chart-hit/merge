const fs = require("fs");

const TOKEN =
process.env.GH_TOKEN;

const OWNER =
"spotify-chart-hit";

const REPO =
"album";

const FILE =
"album.json";

async function fetchAlbum() {

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

`https://api.github.com/repos/${OWNER}/${REPO}/contents/chart-album-americas.json`,

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
`Failed album chart date 😭 ${chartResponse.status}`
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
"data/album.json"
)

) {

fs.copyFileSync(

"data/album.json",

"data/history/yesterday-album.json"

);

}

fs.writeFileSync(

"data/album.json",

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
"album downloaded 😍"
);

}

catch (err) {

console.log(
err.message
);

}

}

fetchAlbum();
