import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Ghost, MapPin, Play, RefreshCw, X } from 'lucide-react';

// --- БАЗА ЛОКАЦИЙ ДЛЯ ВЕЧЕРИНКИ ---
const LOCATIONS = ["Аквапарк", "Ночной клуб", "Музей", "Корабль", "Пиццерия", "Луна-парк", "Киностудия", "Отель", "Джунгли", "Орбитальная станция"];

export default function App() {
  const [screen, setScreen] = useState('setup'); // setup, reveal, play
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState('');
  const [spyIndex, setSpyIndex] = useState(null);
  const [location, setLocation] = useState('');
  const [revealingIndex, setRevealingIndex] = useState(0);
  const [isCardOpen, setIsCardOpen] = useState(false);

  // --- ДОБАВИТЬ ИГРОКА ---
  const addPlayer = () => {
    if (name.trim() && players.length < 12) {
      setPlayers([...players, name.trim()]);
      setName('');
    }
  };

  // --- НАЧАТЬ ИГРУ ---
  const initGame = () => {
    if (players.length < 3) return alert("Нужно хотя бы 3 друга!");
    setSpyIndex(Math.floor(Math.random() * players.length));
    setLocation(LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]);
    setScreen('reveal');
  };

  // --- СЛЕДУЮЩИЙ ИГРОК ---
  const nextPlayer = () => {
    if (revealingIndex < players.length - 1) {
      setRevealingIndex(revealingIndex + 1);
      setIsCardOpen(false);
    } else {
      setScreen('play');
    }
  };

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: СБОР КОМАНДЫ */}
        {screen === 'setup' && (
          <motion.div key="1" initial={{scale: 0.8}} animate={{scale: 1}} style={styles.card}>
            <h1 style={styles.header}>SPY<br/><span style={{color: '#FF5E78'}}>PARTY</span></h1>
            <div style={styles.inputWrap}>
              <input 
                style={styles.input} 
                placeholder="ИМЯ..." 
                value={name} 
                onChange={e => setName(e.target.value)}
              />
              <button style={styles.addBtn} onClick={addPlayer}><UserPlus color="white"/></button>
            </div>
            <div style={styles.list}>
              {players.map((p, i) => (
                <div key={i} style={styles.tag}>{p} <X size={14} onClick={() => setPlayers(players.filter((_, idx) => idx !== i))}/></div>
              ))}
            </div>
            {players.length >= 3 && <button className="pop-button" style={styles.mainBtn} onClick={initGame}>ПОЕХАЛИ! <Play fill="white" size={16}/></button>}
          </motion.div>
        )}

        {/* ЭКРАН 2: КТО ТЫ? */}
        {screen === 'reveal' && (
          <motion.div key="2" initial={{x: 100}} animate={{x: 0}} style={styles.card}>
            <p style={styles.infoText}>ПЕРЕДАЙ ТЕЛЕФОН:</p>
            <h2 style={styles.nameTitle}>{players[revealingIndex]}</h2>
            
            <div style={{...styles.secretBox, background: isCardOpen ? '#FFF' : '#2D3436'}} onClick={() => setIsCardOpen(true)}>
              {isCardOpen ? (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                  {revealingIndex === spyIndex ? (
                    <div style={{color: '#FF5E78'}}>
                      <Ghost size={60} />
                      <h3>ТЫ ШПИОН!</h3>
                      <p>Твоя задача: не выдать себя.</p>
                    </div>
                  ) : (
                    <div style={{color: '#00B894'}}>
                      <MapPin size={60} />
                      <h3>ТЫ В ТЕМЕ</h3>
                      <p>Локация: <b>{location}</b></p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <p style={{color: 'white'}}>ТКНИ, ЧТОБЫ УЗНАТЬ</p>
              )}
            </div>

            {isCardOpen && <button className="pop-button" style={styles.mainBtn} onClick={nextPlayer}>ПОНЯЛ, СЛЕДУЮЩИЙ</button>}
          </motion.div>
        )}

        {/* ЭКРАН 3: ИГРА */}
        {screen === 'play' && (
          <motion.div key="3" initial={{y: 50}} animate={{y: 0}} style={styles.card}>
            <h2 style={styles.header}>ИГРА<br/>ИДЕТ!</h2>
            <p style={styles.infoText}>Задавайте друг другу вопросы. <br/> Шпион должен угадать локацию!</p>
            <div style={styles.list}>
               {players.map((p, i) => <div key={i} style={styles.tag}>{p}</div>)}
            </div>
            <button className="pop-button" style={{...styles.mainBtn, background: '#00B894'}} onClick={() => window.location.reload()}>ЗАКОНЧИТЬ <RefreshCw size={16}/></button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// --- СТИЛИ POP-RETRO ---
const styles = {
  container: { height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { background: '#FFF', border: '4px solid #2D3436', boxShadow: '12px 12px 0px #2D3436', width: '100%', maxWidth: '360px', padding: '30px', borderRadius: '40px', textAlign: 'center' },
  header: { fontFamily: 'Rubik Mono One', fontSize: '30px', lineHeight: '1', marginBottom: '20px' },
  inputWrap: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, border: '3px solid #2D3436', borderRadius: '15px', padding: '12px', fontSize: '16px', fontWeight: '900', outline: 'none' },
  addBtn: { background: '#2D3436', border: 'none', borderRadius: '15px', width: '50px', cursor: 'pointer' },
  list: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' },
  tag: { background: '#FFFAED', border: '2px solid #2D3436', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '5px' },
  mainBtn: { width: '100%', border: '4px solid #2D3436', padding: '18px', borderRadius: '20px', color: 'white', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  infoText: { fontSize: '12px', fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginBottom: '10px' },
  nameTitle: { fontSize: '32px', marginBottom: '20px' },
  secretBox: { height: '200px', borderRadius: '30px', border: '4px dashed #2D3436', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', cursor: 'pointer', padding: '20px' }
};
