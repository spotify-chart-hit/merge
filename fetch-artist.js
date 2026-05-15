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

fs.copyFileSync(

"data/artist.json",

"data/history/yesterday-artist.json"

);

}

fs.writeFileSync(

"data/artist.json",

JSON.stringify(
data,
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

