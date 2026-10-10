export type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  uri: string;
  cover: string;
};

export const musicLibrary: MusicTrack[] = [
  {
    id: "track-01",
    title: "Never Gonna Give You Up",
    artist: "Rick Astley",
    uri: "spotify:track:4uLU6hMCjMI75M1A2tKUQC",
    cover: "/images/music/rick-astley.jpg",
  },
  {
    id: "playlist-01",
    title: "My Coding Playlist",
    artist: "My Favorites",
    uri: "spotify:playlist:請替換成你的播放清單ID",
    cover: "/images/music/coding.jpg",
  },
];