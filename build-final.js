const fs = require("fs");

function load(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) {
      return fallback;
    }

    return JSON.parse(
      fs.readFileSync(file, "utf8")
    );
  } catch {
    return fallback;
  }
}

function getRankChange(current, previous) {
  if (
    previous === undefined ||
    previous === null
  ) {
    return {
      change: 0,
      direction: "new"
    };
  }

  const diff = previous - current;

  if (diff > 0) {
    return {
      change: diff,
      direction: "up"
    };
  }

  if (diff < 0) {
    return {
      change: Math.abs(diff),
      direction: "down"
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
  const dailyMap = new Map();
  const weeklyMap = new Map();

  for (const item of dailyHistory) {
    const key =
      `${item.country}-${item.type}-${item.track}`;

    dailyMap.set(key, item);
  }

  for (const item of weeklyHistory) {
    const key =
      `${item.country}-${item.type}-${item.track}`;

    weeklyMap.set(key, item);
  }

  return today.map(item => {
    const key =
      `${item.country}-${item.type}-${item.track}`;

    const old =
      item.type === "daily"
        ? dailyMap.get(key)
        : weeklyMap.get(key);

    const rank =
      getRankChange(
        item.rank,
        item.previousRank
      );

    const previousStreams =
      Number(old?.streams ?? 0);

    const currentStreams =
      Number(item.streams ?? 0);

    const streamChange =
      currentStreams -
      previousStreams;

    return {
      ...item,

      songGroup:
        albumMap[item.track]
        || "Other",

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
  dailyHistory,
  weeklyHistory
) {
  const dailyMap = new Map();
  const weeklyMap = new Map();

  for (const item of dailyHistory) {
    const key =
      `${item.country}-${item.type}-${item.artist || item.artists?.join(",")}`;

    dailyMap.set(key, item);
  }

  for (const item of weeklyHistory) {
    const key =
      `${item.country}-${item.type}-${item.artist || item.artists?.join(",")}`;

    weeklyMap.set(key, item);
  }

  return today.map(item => {
    const key =
      `${item.country}-${item.type}-${item.artist || item.artists?.join(",")}`;

    const old =
      item.type === "daily"
        ? dailyMap.get(key)
        : weeklyMap.get(key);

    const rank =
      getRankChange(
        item.rank,
        item.previousRank
      );

    const previousStreams =
      Number(old?.streams ?? 0);

    const currentStreams =
      Number(item.streams ?? 0);

    const streamChange =
      currentStreams -
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
  });
}

function buildAlbum(
  today,
  weeklyHistory
) {
  const weeklyMap =
    new Map();

  for (const item of weeklyHistory) {
    const key =
      `${item.country}-${item.album}`;

    weeklyMap.set(
      key,
      item
    );
  }

  return today.map(item => {
    const key =
      `${item.country}-${item.album}`;

    const old =
      weeklyMap.get(key);

    const rank =
      getRankChange(
        item.rank,
        item.previousRank
      );

    const previousStreams =
      Number(old?.streams ?? 0);

    const currentStreams =
      Number(item.streams ?? 0);

    const streamChange =
      currentStreams -
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
  });
}

/* ===========================
   JIMIN ALBUM MAP
=========================== */

const albumMap = {

  // MUSE
  "Who": "MUSE",
  "Who (Rock Remix)": "MUSE",
  "Who (Acoustic Remix)": "MUSE",
  "Who (Shibuyakei Remix)": "MUSE",
  "Who (Instrumental)": "MUSE",
  "Who (Funky Remix)": "MUSE",
  "Who (Beautiful Mind Remix)": "MUSE",
  "Be Mine": "MUSE",
  "Smeraldo Garden Marching Band (feat. Loco)": "MUSE",
  "Rebirth (Intro)": "MUSE",
  "Interlude : Showtime": "MUSE",

  // FACE
  "Like Crazy": "FACE",
  "Like Crazy (English Version)": "FACE",
  "Like Crazy (Deep House Remix)": "FACE",
  "Like Crazy (UK Garage Remix)": "FACE",
  "Like Crazy (Instrumental)": "FACE",
  "Set Me Free Pt.2": "FACE",
  "Face-off": "FACE",
  "Alone": "FACE",
  "Interlude : Dive": "FACE",
  "Promise": "FACE",

  // Single / OST
  "Closer Than This": "Single",
  "Christmas Love": "Single",
  "With you": "OST",
  "With you - Instrumental": "OST",

  // Angel
  "Angel Pt. 1 (feat. Kodak Black, NLE Choppa, Jimin of BTS, JVKE & Muni Long)": "ANGEL",
  "Angel Pt. 2 (feat. Jimin of BTS & JVKE feat. Charlie Puth)": "ANGEL",
  "Angel Pt. 1 (feat. Jimin of BTS, JVKE & Muni Long) - Track Version": "ANGEL",
  "Angel Pt. 1 (feat. Jimin of BTS, JVKE & Muni Long) - Sped Up": "ANGEL",
  "Angel Pt. 2 - Acoustic Version": "ANGEL",
  "Angel (feat. Muni Long, JVKE, NLE Choppa) (Anniversary Edition)": "ANGEL",
  "Angel Pt. 2 - Sped Up": "ANGEL",

  // Feature
  "VIBE (feat. Jimin of BTS)": "FEATURE",
  "Slow Dance (feat. Sofia Carson)": "FEATURE"
};

const songsData =
  load("data/song.json", {});

const artistsData =
  load("data/artist.json", {});

const albumsData =
  load("data/album.json", {});

/* ===========================
   GLOBAL DATA
=========================== */

const globalData =
  load(
    "data/global.json",
    {}
  );

const globalEntries =
  globalData.entries ?? [];

const yesterdayGlobal =
  load(
    "data/history/yesterday-daily-global.json",
    {}
  )?.entries ?? [];

const previousWeeklyGlobal =
  load(
    "data/history/previous-weekly-global.json",
    {}
  )?.entries ?? [];

/* ===========================
   GLOBAL SPLIT
=========================== */

const globalSongs =
  globalEntries.filter(
    x => x.track
  );

const globalArtists =
  globalEntries.filter(
    x =>
      x.artist ||
      x.artists
  );

const globalAlbums =
  globalEntries.filter(
    x => x.album
  );

/* ===========================
   GLOBAL HISTORY
=========================== */

const yesterdayDailyGlobalSongs =
  yesterdayGlobal.filter(
    x =>
      x.type ===
      "daily"
      &&
      x.track
  );

const previousWeeklyGlobalSongs =
  previousWeeklyGlobal.filter(
    x =>
      x.type ===
      "weekly"
      &&
      x.track
  );

const yesterdayDailyGlobalArtists =
  yesterdayGlobal.filter(
    x =>
      x.type ===
      "daily"
      &&
      (
        x.artist ||
        x.artists
      )
  );

const previousWeeklyGlobalArtists =
  previousWeeklyGlobal.filter(
    x =>
      x.type ===
      "weekly"
      &&
      (
        x.artist ||
        x.artists
      )
  );

const previousWeeklyGlobalAlbums =
  previousWeeklyGlobal.filter(
    x =>
      x.type ===
      "weekly"
      &&
      x.album
  );

/* ===========================
   REGIONAL DATA
=========================== */

const songs =
  songsData.entries ?? [];

const artists =
  artistsData.entries ?? [];

const albums =
  albumsData.entries ?? [];

const yesterdayDailySongs =
  load(
    "data/history/yesterday-daily-song.json",
    {}
  )?.entries ?? [];

const previousWeeklySongs =
  load(
    "data/history/previous-weekly-song.json",
    {}
  )?.entries ?? [];

const yesterdayDailyArtists =
  load(
    "data/history/yesterday-daily-artist.json",
    {}
  )?.entries ?? [];

const previousWeeklyArtists =
  load(
    "data/history/previous-weekly-artist.json",
    {}
  )?.entries ?? [];

const previousWeeklyAlbums =
  load(
    "data/history/previous-weekly-album.json",
    {}
  )?.entries ?? [];

/* ===========================
   BUILD REGIONAL
=========================== */

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

/* ===========================
   BUILD GLOBAL
=========================== */

const enhancedGlobalSongs =
  buildSong(
    globalSongs,
    yesterdayDailyGlobalSongs,
    previousWeeklyGlobalSongs
  );

const enhancedGlobalArtists =
  buildArtist(
    globalArtists,
    yesterdayDailyGlobalArtists,
    previousWeeklyGlobalArtists
  );

const enhancedGlobalAlbums =
  buildAlbum(
    globalAlbums,
    previousWeeklyGlobalAlbums
  );

/* ===========================
   MERGE
=========================== */

const mergedSongs = [
  ...enhancedSongs,
  ...enhancedGlobalSongs
];

const mergedArtists = [
  ...enhancedArtists,
  ...enhancedGlobalArtists
];

const mergedAlbums = [
  ...enhancedAlbums,
  ...enhancedGlobalAlbums
];

const dailySongs =
  mergedSongs.filter(
    x =>
      x.type ===
      "daily"
  );

const weeklySongs =
  mergedSongs.filter(
    x =>
      x.type ===
      "weekly"
  );

const final = {

  album: {
    weeklyLastUpdate:
      albumsData?.weeklyLastUpdate
      ?? null,

    weekly:
      mergedAlbums
  },

  artist: {

    dailyLastUpdate:
      artistsData?.dailyLastUpdate
      ?? null,

    weeklyLastUpdate:
      artistsData?.weeklyLastUpdate
      ?? null,

    daily:
      mergedArtists.filter(
        x =>
          x.type ===
          "daily"
      ),

    weekly:
      mergedArtists.filter(
        x =>
          x.type ===
          "weekly"
      )
  },

  song: {

    dailyLastUpdate:
      songsData?.dailyLastUpdate
      ?? null,

    weeklyLastUpdate:
      songsData?.weeklyLastUpdate
      ?? null,

    daily:
      dailySongs,

    weekly:
      weeklySongs
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
