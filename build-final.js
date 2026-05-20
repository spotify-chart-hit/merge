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
      `${item.country}-${item.type}-${item.artist}`;

    dailyMap.set(key, item);
  }

  for (const item of weeklyHistory) {
    const key =
      `${item.country}-${item.type}-${item.artist}`;

    weeklyMap.set(key, item);
  }

  return today.map(item => {
    const key =
      `${item.country}-${item.type}-${item.artist}`;

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

const dailySongs =
  enhancedSongs.filter(
    x =>
      x.type ===
      "daily"
  );

const weeklySongs =
  enhancedSongs.filter(
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
      enhancedAlbums
  },

  artist: {

    dailyLastUpdate:
      artistsData?.dailyLastUpdate
      ?? null,

    weeklyLastUpdate:
      artistsData?.weeklyLastUpdate
      ?? null,

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
