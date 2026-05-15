const fs = require("fs");

function load(file, fallback = []) {
  try {

    if (!fs.existsSync(file)) {
      return fallback;
    }

    return JSON.parse(
      fs.readFileSync(file, "utf8")
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

  if (diff > 0) {

    return {
      change: diff,
      direction: "up"
    };

  }

  if (diff < 0) {

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
yesterday
) {

  const yesterdayMap =
  new Map();

  for (
    const item
    of yesterday
  ) {

    const key =
    `${item.country}-${item.type}-${item.track}`;

    yesterdayMap.set(
      key,
      item
    );

  }

  return today.map(item => {

    const key =
    `${item.country}-${item.type}-${item.track}`;

    const old =
    yesterdayMap.get(key);

    const rank =
    getRankChange(
      item.rank,
      old?.rank
    );

    const previousStreams =
    old?.streams
    ?? 0;

    const streamChange =
    (item.streams ?? 0)
    -
    previousStreams;

    return {

      ...item,

      previousRank:
      old?.rank
      ?? null,

      rankChange:
      rank.change,

      direction:
      rank.direction,

      previousStreams,

      streamChange

    };

  });

}

function buildArtist(
today,
yesterday
) {

  const yesterdayMap =
  new Map();

  for (
    const item
    of yesterday
  ) {

    const key =
    `${item.country}-${item.type}-${item.artist}`;

    yesterdayMap.set(
      key,
      item
    );

  }

  return today.map(item => {

    const key =
    `${item.country}-${item.type}-${item.artist}`;

    const old =
    yesterdayMap.get(key);

    const rank =
    getRankChange(
      item.rank,
      old?.rank
    );

    return {

      ...item,

      previousRank:
      old?.rank
      ?? null,

      rankChange:
      rank.change,

      direction:
      rank.direction

    };

  });

}

const songs =
load(
"data/song.json"
);

const artists =
load(
"data/artist.json"
);

const albums =
load(
"data/album.json"
);

const yesterdaySongs =
load(
"data/history/yesterday-song.json"
);

const yesterdayArtists =
load(
"data/history/yesterday-artist.json"
);

const enhancedSongs =
buildSong(
songs,
yesterdaySongs
);

const enhancedArtists =
buildArtist(
artists,
yesterdayArtists
);

const final = {

  album: {

    weeklyLastUpdate:

    albums.find(
      x =>
      x.type ===
      "weekly"
    )
    ?.date
    ??

    null,

    weekly:

    albums.filter(
      x =>
      x.type ===
      "weekly"
    )

  },

  artist: {

    dailyLastUpdate:

    artists.find(
      x =>
      x.type ===
      "daily"
    )
    ?.date
    ??

    null,

    weeklyLastUpdate:

    artists.find(
      x =>
      x.type ===
      "weekly"
    )
    ?.date
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

    songs.find(
      x =>
      x.type ===
      "daily"
    )
    ?.date
    ??

    null,

    weeklyLastUpdate:

    songs.find(
      x =>
      x.type ===
      "weekly"
    )
    ?.date
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

