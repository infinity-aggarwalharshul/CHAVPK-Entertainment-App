import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Home, Video, PlusSquare, Music, Image as ImageIcon, Wallet, 
  Settings, WifiOff, Camera, MapPin, Mic, Play, Pause, Share2, 
  Heart, MessageCircle, Globe, Zap, Shield, Sparkles, User, RefreshCw,
  Lock, Unlock, CheckCircle, TrendingUp, Search, Edit3, Link as LinkIcon,
  Compass, AlertOctagon, UserX, FileCheck, Maximize, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

// ==========================================
// API & GLOBAL CONFIG
// ==========================================
const apiKey = ""; // API Key provided by the execution environment

const THEME = {
  primary: "text-cyan-400",
  primaryBg: "bg-cyan-400",
  secondary: "text-purple-500",
  secondaryBg: "bg-purple-500",
  glowPrimary: "shadow-[0_0_15px_rgba(34,211,238,0.5)]",
  glowSecondary: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  glass: "bg-gray-900/60 backdrop-blur-xl border border-gray-700/50"
};

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_VIDEOS = [
  { id: 1, title: "Cyberpunk City 2077 - AI Art", author: "Chitra_Creator", views: "2.1M", type: "short", length: "0:59", color: "from-purple-500 to-pink-500", tags: ["#Cyberpunk", "#Art"], seoRank: 1, celebrity: true },
  { id: 2, title: "Tech Hacks 2026", author: "TechVishwa", views: "1.2M", type: "short", length: "0:45", color: "from-blue-500 to-cyan-400", tags: ["#Tech", "#Hacks"], seoRank: 3, celebrity: true },
  { id: 3, title: "Learn Sanskrit in 5 Minutes", author: "AncientIndia", views: "850K", type: "long", length: "4:15", color: "from-amber-400 to-orange-500", tags: ["#Sanskrit", "#India"], seoRank: 2, celebrity: false },
  { id: 4, title: "Mars Colony VR Tour", author: "AstroGamer", views: "3M", type: "short", length: "0:30", color: "from-red-500 to-orange-600", tags: ["#VR", "#Space"], seoRank: 1, celebrity: true },
  { id: 5, title: "Global Crypto Market Analysis", author: "VPK Finance", views: "300K", type: "short", length: "0:55", color: "from-green-400 to-emerald-600", tags: ["#Crypto", "#Finance"], seoRank: 5, celebrity: false },
  { id: 6, title: "Quantum AI Insights & Future", author: "TechVishwa", views: "500K", type: "long", length: "4:50", color: "from-indigo-500 to-blue-600", tags: ["#Quantum", "#AI"], seoRank: 8, celebrity: true },
];

const LANGUAGES = ["English", "Hindi", "Sanskrit", "Spanish", "Mandarin", "French", "Arabic", "Bengali", "Russian", "Japanese"];

// ==========================================
// OFFLINE MAZE GAME COMPONENT (Mobile Ready)
// ==========================================
const OfflineGame = ({ onComplete }) => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameState, setGameState] = useState('playing');
  
  const MAZE_GRID = [
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 0, 0, 2] // 2 is end
  ];

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const move = useCallback((dx, dy) => {
    if (gameState !== 'playing') return;
    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      if (newX >= 0 && newX < 10 && newY >= 0 && newY < 10) {
        if (MAZE_GRID[newY][newX] !== 1) {
          if (MAZE_GRID[newY][newX] === 2) setGameState('won');
          return { x: newX, y: newY };
        }
      }
      return prev;
    });
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Prevent page scrolling on commercial web apps
      }
      switch(e.key) {
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <WifiOff className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
      <h2 className="text-3xl font-bold text-white mb-2">Network Disconnected</h2>
      <p className="text-gray-400 mb-6">Algorithm calibration required. Complete the maze within 30s.</p>
      
      <div className="text-2xl font-mono text-cyan-400 mb-4 font-bold flex items-center gap-2">
        <Zap className="w-6 h-6" /> Time: {timeLeft}s
      </div>

      <div className="grid grid-cols-10 gap-1 bg-gray-900 p-2 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
        {MAZE_GRID.map((row, y) => (
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            let bg = "bg-gray-800";
            if (cell === 1) bg = "bg-cyan-900/50 border border-cyan-500/30";
            if (cell === 2) bg = "bg-purple-600 animate-pulse";
            if (isPlayer) bg = "bg-cyan-400 shadow-[0_0_10px_#00f3ff]";
            return <div key={`${x}-${y}`} className={`w-6 h-6 sm:w-10 sm:h-10 rounded-sm ${bg} transition-colors`} />
          })
        ))}
      </div>
      
      {/* Mobile Touch Controls for Commercial Readiness */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:hidden">
        <div></div>
        <button onClick={() => move(0, -1)} className="p-4 bg-gray-800 rounded-xl active:bg-gray-700 flex items-center justify-center"><ArrowUp className="text-white"/></button>
        <div></div>
        <button onClick={() => move(-1, 0)} className="p-4 bg-gray-800 rounded-xl active:bg-gray-700 flex items-center justify-center"><ArrowLeft className="text-white"/></button>
        <button onClick={() => move(0, 1)} className="p-4 bg-gray-800 rounded-xl active:bg-gray-700 flex items-center justify-center"><ArrowDown className="text-white"/></button>
        <button onClick={() => move(1, 0)} className="p-4 bg-gray-800 rounded-xl active:bg-gray-700 flex items-center justify-center"><ArrowRight className="text-white"/></button>
      </div>

      <div className="mt-6 text-gray-500 text-sm hidden sm:block">Use Arrow Keys to move.</div>
      
      {gameState !== 'playing' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${THEME.glass} p-8 rounded-2xl text-center max-w-md w-full border-t border-cyan-400`}>
            <h3 className={`text-4xl font-bold mb-2 ${gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}>
              {gameState === 'won' ? 'CALIBRATED!' : 'SYSTEM ERROR'}
            </h3>
            <button onClick={() => onComplete()} className={`w-full py-3 rounded-lg font-bold mt-6 ${THEME.primaryBg} text-black`}>Return to System</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN APPLICATION
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isOnline, setIsOnline] = useState(true);
  const [manualOffline, setManualOffline] = useState(false);
  const [language, setLanguage] = useState("English");
  
  // Advanced State
  const [isBanned, setIsBanned] = useState(false);
  const [sharedAudio, setSharedAudio] = useState(null); 
  const [showPermModal, setShowPermModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [creationMode, setCreationMode] = useState(null); 

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectivelyOnline = isOnline && !manualOffline;

  const renderContent = () => {
    if (!effectivelyOnline) return <OfflineGame onComplete={() => setManualOffline(false)} />;

    switch (activeTab) {
      case 'feed': return <FeedTab />;
      case 'explore': return <ExploreTab />;
      case 'create': 
        if (isBanned) return <BannedScreen />;
        return <CreateHub 
                 mode={creationMode} 
                 setMode={setCreationMode} 
                 setShowPermModal={setShowPermModal} 
                 sharedAudio={sharedAudio}
                 setIsBanned={setIsBanned}
               />;
      case 'wallet': return <MonetizationWallet />;
      case 'profile': return <UserProfileDashboard isBanned={isBanned} />;
      default: return <FeedTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]"></div>
      </div>

      {/* TOP NAVBAR */}
      <nav className={`fixed top-0 w-full z-40 ${THEME.glass} border-b-0 border-t-0 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center font-bold text-lg ${THEME.glowPrimary}`}>
              CH
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="font-bold text-xl tracking-wider leading-none">
                <span className="text-white">Chitra</span>
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                 <Lock className="w-3 h-3 text-green-400"/> (चित्र) Visual Masterpiece
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select 
              value={language} onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-800 text-xs text-gray-300 rounded-lg px-2 py-1 border border-gray-700 outline-none focus:border-cyan-400 hidden sm:block"
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            
            <button 
              onClick={() => setManualOffline(!manualOffline)}
              className={`p-2 rounded-full ${!effectivelyOnline ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'} hover:bg-gray-700 transition`}
              aria-label="Toggle Offline Mode"
              title="Toggle Offline Algorithm Mode"
            >
              <WifiOff className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
              aria-label="Settings"
              title="App Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('profile')} 
              aria-label="User Profile"
              className={`w-9 h-9 rounded-full bg-gray-700 overflow-hidden border-2 ${isBanned ? 'border-red-500' : 'border-cyan-500/50 hover:border-cyan-400'} transition cursor-pointer`}
            >
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harshul" alt="User" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="pt-20 pb-28 max-w-7xl mx-auto px-4 relative z-10 min-h-[calc(100vh-5rem)]">
        {renderContent()}
      </main>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 w-full z-40 p-4 pb-6 pointer-events-none">
        <div className={`max-w-lg mx-auto ${THEME.glass} rounded-2xl flex justify-between items-center px-4 sm:px-6 py-3 pointer-events-auto border-t-2 border-cyan-500/30 ${THEME.glowPrimary}`}>
          <NavButton icon={Home} label="Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
          <NavButton icon={Compass} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          
          {!isBanned ? (
            <button onClick={() => { setCreationMode(null); setActiveTab('create'); }} className="relative group -mt-8" aria-label="Create Content">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-white ${THEME.glowPrimary} transform transition group-hover:scale-110`}>
                <PlusSquare className="w-6 h-6" />
              </div>
            </button>
          ) : (
            <div className="relative -mt-8 cursor-not-allowed" aria-label="Banned Creation">
              <div className="w-14 h-14 rounded-full bg-red-900 flex items-center justify-center text-red-500 border border-red-500 opacity-50">
                <UserX className="w-6 h-6" />
              </div>
            </div>
          )}

          <NavButton icon={Wallet} label="Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <NavButton icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </div>

      {/* MODALS */}
      {showPermModal && <PermissionModal onClose={() => setShowPermModal(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${active ? THEME.primary : 'text-gray-400 hover:text-white'}`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

const VideoCard = ({ video }) => (
  <div className={`${THEME.glass} rounded-2xl overflow-hidden group cursor-pointer border-t border-gray-700 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] relative`}>
    {video.seoRank <= 3 && (
      <div className="absolute top-2 left-2 z-10 bg-black/80 backdrop-blur border border-yellow-500/50 px-2 py-1 rounded-lg text-xs font-bold text-yellow-500 flex items-center gap-1 shadow-lg">
        <Search className="w-3 h-3"/> Google #{video.seoRank}
      </div>
    )}
    
    <div className={`${video.type === 'short' ? 'h-96 aspect-[9/16]' : 'h-56 aspect-video'} w-full bg-gradient-to-br ${video.color} relative flex items-center justify-center overflow-hidden`}>
       {video.type === 'short' && (
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
       )}
       
       <Play className="w-12 h-12 text-white/70 group-hover:scale-110 transition-transform relative z-10" />
       
       {video.type === 'long' && (
         <button className="absolute top-2 right-2 bg-black/60 backdrop-blur p-2 rounded-lg z-10 hover:bg-white/20 transition hover:text-cyan-400" title="Full Screen">
           <Maximize className="w-4 h-4"/>
         </button>
       )}

       <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs z-10 font-mono shadow-md">
         {video.type === 'short' ? 'Short' : 'Long'} • {video.length}
       </div>
    </div>

    <div className="p-4">
      <h3 className="font-bold text-lg mb-1 leading-tight">{video.title}</h3>
      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <span className="flex items-center gap-1">
          @{video.author} {video.celebrity && <CheckCircle className="w-3 h-3 text-cyan-400"/>}
        </span>
        <span className="flex items-center gap-1 text-green-400 font-medium" title="AI Verified Organic Traffic">
          <Shield className="w-3 h-3"/> {video.views} views
        </span>
      </div>
      <div className="flex gap-2 mb-3 flex-wrap">
         {video.tags.map(tag => (
           <span key={tag} className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">{tag}</span>
         ))}
      </div>
      <div className="flex gap-4 mt-2 text-gray-400 border-t border-gray-800 pt-3">
        <button className="hover:text-pink-500 flex gap-1 items-center transition" title="100% Organic"><Heart className="w-4 h-4"/> Like</button>
        <button className="hover:text-cyan-400 flex gap-1 items-center transition" title="100% Organic"><MessageCircle className="w-4 h-4"/> Chat</button>
        <button className="hover:text-white flex gap-1 items-center transition" title="100% Organic"><Share2 className="w-4 h-4"/> Share</button>
      </div>
    </div>
  </div>
);

const FeedTab = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Sparkles className="text-purple-400 w-6 h-6" /> 
        For You <span className="text-xs bg-cyan-900/50 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">Shorts Optimized</span>
      </h2>
    </div>
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {MOCK_VIDEOS.map(video => (
        <div key={video.id} className="break-inside-avoid">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  </div>
);

const ExploreTab = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Globe className="text-cyan-400 w-6 h-6" /> 
        Global Discovery <span className="text-xs bg-yellow-900/50 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30">Celebrity Rank</span>
      </h2>
    </div>
    <div className="mb-4 bg-green-900/20 border border-green-500/30 p-3 rounded-lg text-sm text-green-400 flex items-center gap-2">
      <Shield className="w-4 h-4"/> Anti-Bot AI Active: Displaying 100% Organic & Viral Trends
    </div>
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {MOCK_VIDEOS.filter(v => v.celebrity).map(video => (
        <div key={`exp-${video.id}`} className="break-inside-avoid">
          <VideoCard video={video} />
        </div>
      ))}
    </div>
  </div>
);

const CreateHub = ({ mode, setMode, setShowPermModal, sharedAudio, setIsBanned }) => {
  const [analyzing, setAnalyzing] = useState(false);

  const simulatePublish = (shouldFail = false) => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      if (shouldFail) {
        setIsBanned(true);
      } else {
        // Safe alert replacement using standard UI state is preferred, 
        // but since this is a mock publish cycle, we reset state to emulate success.
        alert("Content verified by AI. Successfully published to Chitra!");
        setMode(null);
      }
    }, 2500);
  };

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <RefreshCw className="w-16 h-16 text-cyan-400 animate-spin" />
        <h2 className="text-2xl font-bold">AI Content Moderation Active</h2>
        <p className="text-gray-400 max-w-md text-center">Checking for originality, guidelines, and filtering vulgar/abusive content via NLP...</p>
      </div>
    );
  }

  // Active Creation Modes
  if (mode === 'short' || mode === 'long') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
             {mode === 'short' ? <Video className="text-cyan-400"/> : <Play className="text-purple-400"/>}
             Create {mode === 'short' ? 'Short' : 'Long Form'}
          </h2>
          <button onClick={() => setMode(null)} className="text-gray-400 hover:text-white transition">Cancel</button>
        </div>
        
        <div className="bg-black/50 aspect-[9/16] sm:aspect-video rounded-xl flex items-center justify-center border border-gray-700 relative overflow-hidden">
          <Camera className="w-16 h-16 text-gray-700" />
          <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold animate-pulse flex items-center gap-1 shadow-lg">
             <div className="w-2 h-2 bg-red-500 rounded-full"></div> REC
          </div>
        </div>

        {sharedAudio && mode === 'short' && (
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-cyan-400 font-bold">
               <Music className="w-4 h-4"/> AI Music Track Attached
            </div>
            <audio src={sharedAudio} controls className="h-8 w-full sm:w-48 outline-none" />
          </div>
        )}

        <div className="p-4 bg-gray-800/80 rounded-xl space-y-2 border border-gray-700">
           <h4 className="text-sm font-bold flex items-center gap-2"><FileCheck className="w-4 h-4 text-green-400"/> Pre-Publish AI Check</h4>
           <p className="text-xs text-gray-400 leading-relaxed">Content must be original and adhere to community guidelines. Violations will result in immediate ID banishment.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => simulatePublish(false)} className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold transition shadow-lg text-white">Publish Safely</button>
          <button onClick={() => simulatePublish(true)} className="flex-1 py-3 rounded-xl bg-red-900/50 hover:bg-red-800 text-red-300 font-bold border border-red-800 transition">Test Policy Violation</button>
        </div>
      </div>
    );
  }

  if (mode === 'music') return <MusicAI onUseAudio={(url) => { setSharedAudio(url); setMode('short'); }} />;
  if (mode === 'meme') return <MemeGenerator />;

  // Hub Selection
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 py-4">
      <div className="inline-block p-4 rounded-full bg-cyan-900/30 mb-2 border border-cyan-500/30">
        <Sparkles className="w-12 h-12 text-cyan-400" />
      </div>
      <h1 className="text-4xl font-bold">Chitra Studio Hub</h1>
      <p className="text-gray-400 max-w-xl mx-auto">Originality enforced by AI. SEO Optimized to help you reach Google Celebrity Rankings instantly.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <button onClick={() => { setShowPermModal(true); setTimeout(() => setMode('short'), 2000); }} className={`p-6 rounded-2xl ${THEME.glass} border-cyan-500/50 hover:bg-cyan-900/20 transition text-left group`}>
          <Video className="w-8 h-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">Create Shorts</h3>
          <p className="text-sm text-gray-400 mb-2">Primary focus. Up to 1:00 min vertical video.</p>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded inline-block">Direct AI Music Link</span>
        </button>

        <button onClick={() => { setShowPermModal(true); setTimeout(() => setMode('long'), 2000); }} className={`p-6 rounded-2xl ${THEME.glass} border-purple-500/50 hover:bg-purple-900/20 transition text-left group`}>
          <Play className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">Long Form</h3>
          <p className="text-sm text-gray-400 mb-2">Strict limit: 4 to 5 mins max. High retention.</p>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded inline-block">Quantum DB Storage</span>
        </button>

        <button onClick={() => setMode('music')} className={`p-6 rounded-2xl ${THEME.glass} border-blue-500/50 hover:bg-blue-900/20 transition text-left group`}>
          <Music className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">AI Music Library</h3>
          <p className="text-sm text-gray-400 mb-2">Generate copyright-free tracks for your shorts.</p>
        </button>

        <button onClick={() => setMode('meme')} className={`p-6 rounded-2xl ${THEME.glass} border-pink-500/50 hover:bg-pink-900/20 transition text-left group`}>
          <ImageIcon className="w-8 h-8 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-xl font-bold mb-2">Meme Generator</h3>
          <p className="text-sm text-gray-400 mb-2">Create viral images instantly with Gemini Flash.</p>
        </button>
      </div>
    </div>
  );
};

const BannedScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <AlertOctagon className="w-24 h-24 text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse" />
    <h1 className="text-4xl font-black text-red-500 mb-4">ACCOUNT VANISHED</h1>
    <p className="text-xl text-gray-300 mb-4 font-bold">Policy Violation Detected by NLP AI</p>
    <div className="max-w-lg bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-left space-y-3 shadow-2xl">
       <p className="text-sm text-gray-300">Your content was flagged for one or more of the following:</p>
       <ul className="list-disc list-inside text-sm text-red-300 space-y-1 font-medium">
         <li>Lack of Originality / Heavy Plagiarism</li>
         <li>Abusive, Vulgar, or Inappropriate Content</li>
         <li>Violation of Chitra Global Guidelines</li>
       </ul>
       <p className="text-sm text-gray-300 mt-4 border-t border-red-900 pt-4 leading-relaxed">
         Your ID has been submitted to the internal Security Database. Creation features are permanently locked. You must register a new account and adhere strictly to guidelines.
       </p>
    </div>
  </div>
);

const UserProfileDashboard = ({ isBanned }) => {
  const [dataUnlocked, setDataUnlocked] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`relative rounded-2xl overflow-hidden bg-gray-900 border ${isBanned ? 'border-red-500' : 'border-gray-800'} shadow-xl`}>
        <div className={`h-40 relative ${isBanned ? 'bg-red-900' : 'bg-gradient-to-r from-cyan-900 to-purple-900'}`}>
          {!isBanned && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs flex items-center gap-2 text-green-400 font-medium border border-green-500/30">
               <CheckCircle className="w-4 h-4"/> KYC Verified
            </div>
          )}
        </div>
        
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-12 mb-4">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className={`w-32 h-32 rounded-full border-4 ${isBanned ? 'border-red-500 grayscale' : 'border-gray-900'} relative group bg-gray-800 shadow-xl`}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Harshul" alt="Profile" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                  Harshul {isBanned ? <UserX className="w-5 h-5 text-red-500"/> : <CheckCircle className="w-5 h-5 text-cyan-400"/>}
                </h1>
                <p className={isBanned ? "text-red-400 font-bold" : "text-cyan-400"}>
                  {isBanned ? "ID: BANNED_0x892" : "@Chitra_Creator"}
                </p>
              </div>
            </div>
            {!isBanned && (
              <div className="flex gap-3 mt-4 sm:mt-0">
                 <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"><LinkIcon className="w-5 h-5"/></button>
                 <button className="px-6 py-2 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition">Edit Profile</button>
              </div>
            )}
          </div>

          {!isBanned ? (
            <>
              <div className="inline-block px-3 py-1 bg-purple-900/30 border border-purple-500/50 text-purple-300 text-xs rounded-full mb-4">
                Category: Technology & Sci-Fi Creator
              </div>
              <p className="text-gray-400 text-center sm:text-left max-w-lg mb-6 leading-relaxed">
                Pioneering the AI-Driven Innovations. Creating content that reaches global Google Celebrity Rankings. 🚀
              </p>
              <div className="flex justify-center sm:justify-start gap-8 border-t border-gray-800 pt-6">
                 <div className="text-center"><div className="text-2xl font-bold">1.2M</div><div className="text-sm text-gray-500">Followers</div></div>
                 <div className="text-center"><div className="text-2xl font-bold">45</div><div className="text-sm text-gray-500">Following</div></div>
                 <div className="text-center"><div className="text-2xl font-bold">15.4M</div><div className="text-sm text-gray-500">Likes</div></div>
              </div>
            </>
          ) : (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl mt-4">
               <h3 className="text-red-400 font-bold flex items-center gap-2"><AlertOctagon className="w-5 h-5"/> SECURITY LOCKOUT</h3>
               <p className="text-sm text-red-200 mt-1">This profile has been removed from public visibility and all monetization is frozen.</p>
            </div>
          )}
        </div>
      </div>

      {!isBanned && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${THEME.glass} p-6 rounded-2xl shadow-lg`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                 Private Vault <Shield className="w-5 h-5 text-green-400"/>
              </h3>
              <button onClick={() => setDataUnlocked(!dataUnlocked)} className="text-gray-400 hover:text-white transition p-2 bg-gray-800 rounded-full">
                {dataUnlocked ? <Unlock className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-6 border-b border-gray-700 pb-4">Demographics encrypted & compressed. Only visible to you.</p>
            
            <div className={`space-y-4 transition-all duration-500 ${dataUnlocked ? 'opacity-100' : 'opacity-30 blur-sm pointer-events-none'}`}>
              <div><label className="text-sm text-gray-500 block mb-1">Date of Birth</label><div className="bg-black/30 p-3 rounded font-mono border border-gray-800">14 Aug 2000</div></div>
              <div><label className="text-sm text-gray-500 block mb-1">Gender</label><div className="bg-black/30 p-3 rounded font-mono border border-gray-800">Male</div></div>
              <div><label className="text-sm text-gray-500 block mb-1">Age</label><div className="bg-black/30 p-3 rounded font-mono border border-gray-800">25</div></div>
            </div>
            {!dataUnlocked && (
               <div className="absolute inset-0 flex items-center justify-center -mt-10 pointer-events-none z-10">
                 <span className="bg-gray-900/90 px-4 py-2 rounded text-sm border border-gray-700 shadow-xl font-medium">Click Lock to View</span>
               </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`${THEME.glass} p-6 rounded-2xl h-full shadow-lg`}>
              <h3 className="text-xl font-bold mb-4">Bank & Earning Status</h3>
              <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 shrink-0">
                   <Shield className="w-6 h-6"/>
                 </div>
                 <div>
                   <div className="font-bold text-green-400">KYC Completed Successfully</div>
                   <div className="text-sm text-gray-300">Earnings route directly to bank account.</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsModal = ({ onClose }) => {
  const [is4K, setIs4K] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`${THEME.glass} border border-cyan-500/40 p-6 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.1)]`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5 text-cyan-400"/> App Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center">✕</button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div>
              <h3 className="font-bold text-white">Auto-Upscale Quality</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Automatically extend long-form video quality from 1080p to 2160p (4K UHD) using AI upscaling.</p>
            </div>
            <button 
              onClick={() => setIs4K(!is4K)} 
              className={`w-12 h-6 rounded-full transition-colors relative ${is4K ? 'bg-cyan-500' : 'bg-gray-700'}`}
              aria-label="Toggle 4K Upscaling"
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${is4K ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          
          <div className="flex gap-4 pt-2">
            <button onClick={onClose} className={`w-full py-3 rounded-lg text-black font-bold ${THEME.primaryBg} hover:opacity-90 transition`}>Save & Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PermissionModal = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const handleGrant = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
      setTimeout(() => { onClose(); }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`${THEME.glass} border border-cyan-500/40 p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.1)]`}>
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Hardware Access Required</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="bg-gray-800 p-2 rounded-lg"><Camera className="w-5 h-5 text-cyan-400"/></div>
                <div>Camera & Optimized Storage</div>
              </div>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="bg-gray-800 p-2 rounded-lg"><Mic className="w-5 h-5 text-cyan-400"/></div>
                <div>Microphone (For spatial audio)</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition font-medium">Cancel</button>
              <button onClick={handleGrant} className={`flex-1 py-3 rounded-lg text-black font-bold ${THEME.primaryBg} hover:opacity-90 transition`}>Allow Access</button>
            </div>
          </>
        )}
        {step === 1 && (
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold">Securing Connection...</h3>
          </div>
        )}
        {step === 2 && (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400">Access Granted</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const MemeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const generateMeme = async () => {
    if (!prompt) return;
    if (!apiKey) {
      setErrorMsg("Commercial Mode Error: API Key is required to run the generative AI features.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Generate Background Image
      const imgRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: { prompt: `${prompt}, funny meme background style, highly detailed` }, parameters: { sampleCount: 1 } })
      });
      
      if (!imgRes.ok) throw new Error("Failed to generate image.");
      const imgData = await imgRes.json();
      const imageUrl = imgData.predictions ? `data:image/png;base64,${imgData.predictions[0].bytesBase64Encoded}` : null;

      // 2. Generate Punchy Text using standard text model
      const textRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Write a short, punchy meme caption (max 10 words) about: ${prompt}` }] }] })
      });
      
      if (!textRes.ok) throw new Error("Failed to generate text.");
      const textData = await textRes.json();
      const caption = textData.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/"/g, '') || "WHEN CODE COMPILES";

      if(imageUrl) {
        setResult({ image: imageUrl, caption: caption });
      } else {
        throw new Error("Invalid image data returned.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("AI Generation failed. Ensure API services are active and limits are not exceeded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">AI Meme Generator</h1>
      </div>
      
      {errorMsg && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-xl text-sm flex items-start gap-2">
           <AlertOctagon className="w-5 h-5 shrink-0" /> {errorMsg}
        </div>
      )}

      <div className={`${THEME.glass} p-6 rounded-2xl flex flex-col sm:flex-row gap-4`}>
        <input 
          type="text" placeholder="e.g., When you finally fix that one bug..." 
          className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition"
          value={prompt} onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateMeme()}
        />
        <button 
          onClick={generateMeme} disabled={loading || !prompt}
          className={`px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition ${THEME.glowSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
             <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin"/> Processing</span>
          ) : 'Make it Meme'}
        </button>
      </div>

      {result && result.image && (
        <div className="mt-8 relative max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl group border border-gray-700">
          <img src={result.image} alt="Generated Meme" className="w-full h-auto object-cover" />
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-none">
            <h2 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,1)]" style={{ WebkitTextStroke: '2px black' }}>
              {result.caption}
            </h2>
          </div>
          {/* Download/Share action overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-black/80 backdrop-blur text-white p-2 rounded-lg hover:bg-purple-600 transition" title="Save Image"><ImageIcon className="w-5 h-5"/></button>
          </div>
        </div>
      )}
    </div>
  );
};

const MusicAI = ({ onUseAudio }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const audioRef = useRef(null);

  // Sync actual HTML audio playback with React state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const generateMusic = async () => {
    if (!prompt) return;
    if (!apiKey) {
      setErrorMsg("Commercial Mode Error: API Key required for Text-To-Speech features.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    setAudioUrl(null);
    setIsPlaying(false);
    
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Sing cheerfully: ${prompt}` }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } } }
        })
      });
      
      if (!res.ok) throw new Error("API request failed.");
      
      const data = await res.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setAudioUrl(`data:audio/mp3;base64,${base64Audio}`);
      } else {
         throw new Error("No audio payload returned.");
      }
    } catch(e) { 
      console.error(e); 
      setErrorMsg("Failed to generate track. Ensure API services are active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col items-center text-center pt-4">
        <h1 className="text-3xl font-bold mb-4">World's Largest AI Music Library</h1>
        <p className="text-gray-400 max-w-2xl">Create copyright-free music instantly. Connects directly to Shorts creation.</p>
      </div>
      
      {errorMsg && (
        <div className="max-w-2xl mx-auto bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-xl text-sm flex items-center justify-center gap-2">
           <AlertOctagon className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <div className={`${THEME.glass} p-2 rounded-full flex max-w-2xl mx-auto items-center shadow-lg border border-gray-700/50 focus-within:border-cyan-500 transition-colors`}>
        <input 
          type="text" placeholder="A lo-fi beat with ancient Sanskrit flute..." 
          className="flex-1 bg-transparent border-none px-6 py-4 text-white outline-none w-full"
          value={prompt} onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateMusic()}
        />
        <button 
          onClick={generateMusic} disabled={loading || !prompt}
          className={`px-8 py-3 rounded-full font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition ml-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto"/> : 'Generate'}
        </button>
      </div>

      {(audioUrl || loading) && (
        <div className="max-w-xl mx-auto mt-12 bg-gray-900 border border-gray-700 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              disabled={loading}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition ${isPlaying ? 'bg-cyan-500 text-black' : 'bg-gray-800 hover:bg-gray-700'} ${loading ? 'opacity-50 cursor-wait' : ''}`}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {loading ? <RefreshCw className="w-6 h-6 animate-spin"/> : (isPlaying ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1"/>)}
            </button>
            <div className="flex-1">
              <h3 className="font-bold text-xl">{prompt ? "Custom Generation" : "AI Track"}</h3>
              <p className="text-cyan-400 text-sm font-medium">100% Copyright Free</p>
            </div>
            
            {/* Hidden Audio Element for real playback */}
            {audioUrl && (
              <audio 
                ref={audioRef} 
                src={audioUrl} 
                onEnded={() => setIsPlaying(false)} 
                className="hidden" 
              />
            )}

            {audioUrl && (
              <button 
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  onUseAudio(audioUrl);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-sm font-bold rounded-lg transition shadow-lg shrink-0"
              >
                Use in Short
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const MonetizationWallet = () => (
  <div className="max-w-5xl mx-auto space-y-8 pb-10">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Creator Earnings</h1>
        <p className="text-gray-400">Integrated with The Chitra Pay & Cloud Blockchain</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className={`p-8 rounded-3xl ${THEME.glass} border-t-2 border-green-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition`}>
        <div className="text-xl font-medium text-gray-300 mb-6">INR Wallet</div>
        <div className="text-5xl font-bold mb-2">₹ 2,45,000</div>
        <p className="text-green-400 text-sm mb-8 font-medium">+12% from last month</p>
        <button className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 font-bold transition text-white shadow-lg">Withdraw to Bank</button>
      </div>
      <div className={`p-8 rounded-3xl ${THEME.glass} border-t-2 border-purple-500/50 bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition`}>
        <div className="text-xl font-medium text-gray-300 mb-6">CHC Crypto</div>
        <div className="text-5xl font-bold mb-2 flex items-center gap-2"><Sparkles className="w-8 h-8 text-purple-400"/> 14,500 CHC</div>
        <p className="text-gray-400 text-sm mb-8">~ $8,200.00 USD (Live tracking active)</p>
        <div className="grid grid-cols-2 gap-4">
          <button className="py-4 rounded-xl bg-gray-800 hover:bg-gray-700 font-bold transition shadow-md">Trade</button>
          <button className="py-4 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition shadow-lg text-white">Stake</button>
        </div>
      </div>
    </div>
  </div>
);