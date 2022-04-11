import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import { 
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from '../spotify';
import { 
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  TimeRangeButtons,
} from '../components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [activeRange, setActiveRange] = useState('short');

  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists(`${activeRange}_term`);
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks(`${activeRange}_term`);
      setTopTracks(userTopTracks.data);
    };

    catchErrors(fetchData());
  }, [activeRange]);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <img className="header__img" src={profile.images[0].url} alt="Avatar" />
              )}
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>{playlists.total} Playlist{playlists.total !== 1 ? 's' : ''}</span>
                  )}
                  <span>
                    {profile.followers.total} Follower{profile.followers.total !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>

          {topArtists && topTracks && (
            <main>
              <SectionWrapper>
                <TimeRangeButtons
                   activeRange={activeRange}
                   setActiveRange={setActiveRange}
                />
              </SectionWrapper>

              <SectionWrapper title="Top artists">
                <ArtistsGrid artists={topArtists.items.slice(0, 15)} />
              </SectionWrapper>

              <SectionWrapper title="Top tracks">
                <TrackList tracks={topTracks.items.slice(0, 15)} />
              </SectionWrapper>
            </main>
          )}
        </>
      )}
    </>
  );
}

export default Profile;