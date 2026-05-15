const fs = require("fs");

function load(
file,
fallback = []
) {

try {

if (
!fs.existsSync(file)
) {

return fallback;

}

return JSON.parse(

fs.readFileSync(
file,
"utf8"
)

);

}

catch {

return fallback;

}

}

function getRankChange(
current,
previous
) {

if (

previous === undefined
||
previous === null

) {

return {
change: 0,
direction: "new"
};

}

const diff =
previous - current;

if (
diff > 0
) {

return {
change: diff,
direction: "up"
};

}

if (
diff < 0
) {

return {
change:
Math.abs(diff),

direction:
"down"
};

}

return {
change: 0,
direction: "same"
};

}

function buildSong(
today,
dailyHistory,
weeklyHistory
) {

const dailyMap =
new Map();

const weeklyMap =
new Map();

for (
const item
of dailyHistory
) {

const key =

`${item.country}-${item.type}-${item.track}`;

dailyMap.set(
key,
item
);

}

for (
const item
of weeklyHistory
) {

const key =

`${item.country}-${item.type}-${item.track}`;

weeklyMap.set(
key,
item
);

}

return today.map(
item => {

const key =

`${item.country}-${item.type}-${item.track}`;

const old =

item.type ===
"daily"

?

dailyMap.get(key)

:

weeklyMap.get(key);

const rank =
getRankChange(

item.rank,
item.previousRank

);

const previousStreams =

Number(
old?.streams
?? 0
);

const currentStreams =

Number(
item.streams
?? 0
);

const streamChange =

currentStreams
-
previousStreams;

return {

...item,

rankChange:
rank.change,

direction:
rank.direction,

previousStreams,

streamChange

};

}
);

}

function buildArtist(
today,
dailyHistory,
weeklyHistory
) {

const dailyMap =
new Map();

const weeklyMap =
new Map();

for (
const item
of dailyHistory
) {

const key =

`${item.country}-${item.type}-${item.artist}`;

dailyMap.set(
key,
item
);

}

for (
const item
of weeklyHistory
) {

const key =

`${item.country}-${item.type}-${item.artist}`;

weeklyMap.set(
key,
item
);

}

return today.map(
item => {

const key =

`${item.country}-${item.type}-${item.artist}`;

const old =

item.type ===
"daily"

?

dailyMap.get(key)

:

weeklyMap.get(key);

const rank =
getRankChange(

item.rank,
item.previousRank

);

const previousStreams =

Number(
old?.streams
?? 0
);

const currentStreams =

Number(
item.streams
?? 0
);

const streamChange =

currentStreams
-
previousStreams;

return {

...item,

rankChange:
rank.change,

direction:
rank.direction,

previousStreams,

streamChange

};

}
);

}

function buildAlbum(
today,
weeklyHistory
) {

const weeklyMap =
new Map();

for (
const item
of weeklyHistory
) {

const key =

`${item.country}-${item.album}`;

weeklyMap.set(
key,
item
);

}

return today.map(
item => {

const key =

`${item.country}-${item.album}`;

const old =
weeklyMap.get(
key
);

const rank =
getRankChange(

item.rank,
item.previousRank

);

const previousStreams =

Number(
old?.streams
?? 0
);

const currentStreams =

Number(
item.streams
?? 0
);

const streamChange =

currentStreams
-
previousStreams;

return {

...item,

rankChange:
rank.change,

direction:
rank.direction,

previousStreams,

streamChange

};

}
);

}

const songsData =
load(
"data/song.json",
{}
);

const artistsData =
load(
"data/artist.json",
{}
);

const albumsData =
load(
"data/album.json",
{}
);

const songs =
songsData.entries
?? [];

const artists =
artistsData.entries
?? [];

const albums =
albumsData.entries
?? [];

const yesterdayDailySongs =
load(
"data/history/yesterday-daily-song.json",
{}
)
?.entries
?? [];

const previousWeeklySongs =
load(
"data/history/previous-weekly-song.json",
{}
)
?.entries
?? [];

const yesterdayDailyArtists =
load(
"data/history/yesterday-daily-artist.json",
{}
)
?.entries
?? [];

const previousWeeklyArtists =
load(
"data/history/previous-weekly-artist.json",
{}
)
?.entries
?? [];

const previousWeeklyAlbums =
load(
"data/history/previous-weekly-album.json",
{}
)
?.entries
?? [];

const enhancedSongs =
buildSong(
songs,
yesterdayDailySongs,
previousWeeklySongs
);

const enhancedArtists =
buildArtist(
artists,
yesterdayDailyArtists,
previousWeeklyArtists
);

const enhancedAlbums =
buildAlbum(
albums,
previousWeeklyAlbums
);

const final = {

album: {

weeklyLastUpdate:

albumsData
?.weeklyLastUpdate

??

null,

weekly:

enhancedAlbums

},

artist: {

dailyLastUpdate:

artistsData
?.dailyLastUpdate

??

null,

weeklyLastUpdate:

artistsData
?.weeklyLastUpdate

??

null,

daily:

enhancedArtists.filter(
x =>
x.type ===
"daily"
),

weekly:

enhancedArtists.filter(
x =>
x.type ===
"weekly"
)

},

song: {

dailyLastUpdate:

songsData
?.dailyLastUpdate

??

null,

weeklyLastUpdate:

songsData
?.weeklyLastUpdate

??

null,

daily:

enhancedSongs.filter(
x =>
x.type ===
"daily"
),

weekly:

enhancedSongs.filter(
x =>
x.type ===
"weekly"
)

}

};

fs.writeFileSync(

"final.json",

JSON.stringify(
final,
null,
2
)

);

console.log(
"final.json updated 😍"
);
