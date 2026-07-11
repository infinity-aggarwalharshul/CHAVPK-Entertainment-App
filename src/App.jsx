import { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  Clock3,
  Film,
  Heart,
  LogOut,
  MoonStar,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import {
  auth,
  isFirebaseConfigured,
  listenToAuth,
  loadUserWatchlist,
  saveUserWatchlist,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from './firebase';

const catalog = [
  {
    id: 1,
    title: 'Neon Skyline',
    genre: 'Sci-fi drama',
    blurb: 'A cyber-artist discovers a hidden city inside the streaming grid.',
    badge: 'New Release',
    accent: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)',
  },
  {
    id: 2,
    title: 'Midnight Echoes',
    genre: 'Thriller',
    blurb: 'An investigative journalist turns every late-night signal into a clue.',
    badge: 'Top Rated',
    accent: 'linear-gradient(135deg, #fb7185 0%, #f59e0b 100%)',
  },
  {
    id: 3,
    title: 'The Golden Hour',
    genre: 'Romance',
    blurb: 'A cinematic love story set across two continents and one impossible deadline.',
    badge: "Editor's Pick",
    accent: 'linear-gradient(135deg, #34d399 0%, #0f766e 100%)',
  },
];

const quickStats = [
  { label: 'Cloud sync', value: 'Live', icon: UploadCloud },
  { label: 'Secure profile', value: 'Protected', icon: ShieldCheck },
  { label: 'Watchlist', value: 'Personal', icon: Heart },
];

function App() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Log in to sync your watchlist with Firebase.');
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const [activeTitle, setActiveTitle] = useState(catalog[0]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return undefined;
    }

    const unsubscribe = listenToAuth((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserWatchlist(currentUser.uid)
          .then((items) => setWatchlist(items))
          .catch(() => setWatchlist([]));
      } else {
        setWatchlist([]);
      }
    });

    return unsubscribe;
  }, []);

  const isOnWatchlist = useMemo(() => {
    return (titleId) => watchlist.some((item) => item.id === titleId);
  }, [watchlist]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setIsBusy(true);
    setMessage('');

    try {
      if (!isFirebaseConfigured || !auth) {
        throw new Error('Add Firebase credentials to enable authentication.');
      }

      if (mode === 'login') {
        await signInWithEmail(email, password);
        setMessage('Welcome back. Your profile is ready.');
      } else {
        await signUpWithEmail(email, password);
        setMessage('Account created. Your watchlist will now sync to the cloud.');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setMessage('Signed out.');
    } catch {
      setMessage('Could not sign out.');
    }
  };

  const toggleWatchlist = async (item) => {
    if (!user) {
      setMessage('Sign in to save this title to your cloud watchlist.');
      return;
    }

    const exists = watchlist.some((entry) => entry.id === item.id);
    const nextList = exists
      ? watchlist.filter((entry) => entry.id !== item.id)
      : [...watchlist, item];

    setWatchlist(nextList);

    try {
      await saveUserWatchlist(user.uid, nextList);
      setMessage(exists ? 'Removed from your cloud library.' : 'Saved to your cloud library.');
    } catch {
      setMessage('Sync failed. Please try again.');
    }
  };

  return (
    <div className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">CH</div>
          <div>
            <p className="eyebrow">Cloud entertainment</p>
            <h1>Chavpk Stream</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="icon-button" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="icon-button" aria-label="Notifications">
            <BellRing size={18} />
          </button>
          <button className="icon-button" aria-label="Night mode">
            <MoonStar size={18} />
          </button>
          {user ? (
            <button className="ghost-button" onClick={handleLogout}>
              <LogOut size={16} />
              Sign out
            </button>
          ) : null}
        </div>
      </header>

      <main className="content-grid">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Now streaming</p>
            <h2>Discover premium stories, create your own library, and sync it safely to the cloud.</h2>
            <p>
              Chavpk Stream blends cinematic discovery, personalized watchlists, and Firebase-powered authentication and storage into one elegant experience.
            </p>
            <div className="hero-actions">
              <button className="primary-button">
                <Play size={18} />
                Watch now
              </button>
              <button className="secondary-button">
                <Sparkles size={18} />
                Explore picks
              </button>
            </div>
            <div className="stats-row">
              {quickStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="stat-pill">
                    <Icon size={16} />
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-image" style={{ background: activeTitle.accent }} />
            <div className="panel-content">
              <p className="eyebrow">Featured premiere</p>
              <h3>{activeTitle.title}</h3>
              <p>{activeTitle.genre}</p>
              <p>{activeTitle.blurb}</p>
            </div>
          </div>
        </section>

        <section className="panel-grid">
          <div className="glass-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Your account</p>
                <h3>{user ? `Welcome back, ${user.email}` : 'Create a secure profile'}</h3>
              </div>
              <div className="status-chip">{isFirebaseConfigured ? 'Firebase ready' : 'Demo mode'}</div>
            </div>

            <form className="auth-form" onSubmit={handleAuth}>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <div className="auth-toggle">
                <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                  Sign in
                </button>
                <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
                  Create account
                </button>
              </div>
              <button className="primary-button full-width" type="submit" disabled={isBusy}>
                {isBusy ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
            <p className="message-text">{message}</p>
          </div>

          <div className="glass-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Watchlist</p>
                <h3>Cloud library</h3>
              </div>
              <div className="status-chip">{watchlist.length} saved</div>
            </div>
            <div className="library-list">
              {catalog.map((item) => {
                const selected = isOnWatchlist(item.id);
                return (
                  <div key={item.id} className="library-item">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.genre}</p>
                    </div>
                    <button className={selected ? 'icon-toggle active' : 'icon-toggle'} onClick={() => toggleWatchlist(item)}>
                      <Heart size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="catalog-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recommended for you</p>
              <h3>Fresh releases</h3>
            </div>
            <button className="ghost-button">View all</button>
          </div>

          <div className="catalog-grid">
            {catalog.map((item) => (
              <article key={item.id} className="movie-card" onMouseEnter={() => setActiveTitle(item)}>
                <div className="movie-preview" style={{ background: item.accent }} />
                <div className="movie-meta">
                  <div className="movie-pill">{item.badge}</div>
                  <h4>{item.title}</h4>
                  <p>{item.genre}</p>
                  <div className="movie-footer">
                    <span><Film size={14} /> Cinematic</span>
                    <span><Clock3 size={14} /> 2h 10m</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
