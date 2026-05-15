
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

fs.copyFileSync(

"data/song.json",

"data/history/yesterday-song.json"

);

}

fs.writeFileSync(

"data/song.json",

JSON.stringify(
data,
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

