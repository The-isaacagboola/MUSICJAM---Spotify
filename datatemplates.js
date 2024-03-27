const userData = {
  display_name: "Isaac Adeyemi",
  external_urls: {
    spotify: "https://open.spotify.com/user/317s7p7frxfpna6xqln6eehjcg3a",
  },
  href: "https://api.spotify.com/v1/users/317s7p7frxfpna6xqln6eehjcg3a",
  id: "317s7p7frxfpna6xqln6eehjcg3a",
  images: [],
  type: "user",
  uri: "spotify:user:317s7p7frxfpna6xqln6eehjcg3a",
  followers: {
    href: null,
    total: 0,
  },
  country: "NG",
  product: "free",
  explicit_content: {
    filter_enabled: false,
    filter_locked: false,
  },
  email: "isaacadeyemi9@gmail.com",
};

let deleted = `<div role="button" tabindex="0" class="set-playlist" data-trackId=${track.id}>
<img src="${track.album.images[0].url}" alt="song-cover-picture" />
<i class="bi bi-play-circle"></i>
<div class="artist-info" >
  <p>${track.name}</p>
  <p class="grey-text">
    by <span class="song-writer">${track.artists[0].name}</span>
  </p>
</div>
</div> from 304 html for toptracks`;
