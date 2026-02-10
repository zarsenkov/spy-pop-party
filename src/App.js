import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- НАСТРОЙКИ ИГРЫ (ЛОКАЦИИ) ---
const LOCATIONS = [
  "Орбитальная станция", "Подводная лодка", "Киностудия", 
  "Корпоративная вечеринка", "Театр", "Цирк-шапито", 
  "База террористов", "Отель", "Ресторан"
];

export default function SpyGame() {
  // --- СОСТОЯНИЯ (STATE) ---
  const [screen, setScreen] = useState('setup'); // setup, roles, game
  const [players, setPlayers] = useState(['', '', '']); // Минимум 3 игрока
  const [gameState, setGameState] = useState({
    location: '',
    spyIndex: null,
    revealedIndices: [] // Кто уже посмотрел свою роль
  });
  const [timer, setTimer] = useState(480); // 8 минут на игру
  const [isTimerActive, setIsTimerActive] = useState(false);

  // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      alert("Время вышло! Обсуждайте и голосуйте.");
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // --- ФУНКЦИИ ---

  // Добавление нового игрока
  const addPlayer = () => setPlayers([...players, '']);

  // Удаление игрока
  const removePlayer = (idx) => {
    if (players.length > 3) {
      const newPlayers = players.filter((_, i) => i !== idx);
      setPlayers(newPlayers);
    }
  };

  // Обновление имени игрока
  const updatePlayer = (idx, name) => {
    const newPlayers = [...players];
    newPlayers[idx] = name;
    setPlayers(newPlayers);
  };

  // Старт игры: распределение ролей
  const startGame = () => {
    if (players.some(p => p.trim() === '')) {
      alert("Введите имена всех игроков!");
      return;
    }
    const randomLoc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const randomSpy = Math.floor(Math.random() * players.length);
    
    setGameState({
      location: randomLoc,
      spyIndex: randomSpy,
      revealedIndices: []
    });
    setScreen('roles');
  };

  // Открыть роль для конкретного игрока
  const revealRole = (idx) => {
    if (!gameState.revealedIndices.includes(idx)) {
      const role = idx === gameState.spyIndex ? "ВЫ ШПИОН! 🕵️" : `Локация: ${gameState.location} 📍`;
      alert(`${players[idx]}, твоя роль:\n\n${role}`);
      
      const newRevealed = [...gameState.revealedIndices, idx];
      setGameState(prev => ({ ...prev, revealedIndices: newRevealed }));
      
      // Если все посмотрели роли — запускаем таймер и игру
      if (newRevealed.length === players.length) {
        setScreen('game');
        setIsTimerActive(true);
      }
    }
  };

  // Форматирование времени (00:00)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={styles.app}>
      {/* ЭКРАН 1: НАСТРОЙКА ИГРОКОВ */}
      {screen === 'setup' && (
        <div style={styles.card}>
          <h1 style={styles.title}>🕵️ НАЙДИ ШПИОНА</h1>
          <p>Добавьте игроков (минимум 3):</p>
          {players.map((name, idx) => (
            <div key={idx} style={styles.inputGroup}>
              <input 
                placeholder={`Игрок ${idx + 1}`} 
                value={name} 
                onChange={(e) => updatePlayer(idx, e.target.value)}
                style={styles.input}
              />
              <button onClick={() => removePlayer(idx)} style={styles.btnDanger}>✕</button>
            </div>
          ))}
          <button onClick={addPlayer} style={styles.btnSecondary}>+ Игрок</button>
          <button onClick={startGame} style={styles.btnPrimary}>РАЗДАТЬ РОЛИ</button>
        </div>
      )}

      {/* ЭКРАН 2: РАЗДАЧА РОЛЕЙ */}
      {screen === 'roles' && (
        <div style={styles.card}>
          <h2 style={styles.title}>КТО ЕСТЬ КТО?</h2>
          <p>Передавайте телефон игроку, чтобы он нажал на своё имя:</p>
          <div style={styles.grid}>
            {players.map((name, idx) => (
              <button 
                key={idx} 
                onClick={() => revealRole(idx)}
                disabled={gameState.revealedIndices.includes(idx)}
                style={gameState.revealedIndices.includes(idx) ? styles.btnDisabled : styles.btnRole}
              >
                {name} {gameState.revealedIndices.includes(idx) ? '✅' : '👀'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ЭКРАН 3: ИГРОВОЙ ТАЙМЕР */}
      {screen === 'game' && (
        <div style={styles.card}>
          <h2 style={styles.timer}>{formatTime(timer)}</h2>
          <p>Задавайте вопросы друг другу!</p>
          <div style={styles.infoBox}>
            <p>Шпион не знает локацию.</p>
            <p>Ваша задача: вычислить его до конца времени.</p>
          </div>
          <button onClick={() => { if(window.confirm("Завершить игру?")) setScreen('setup'); }} style={styles.btnDanger}>
            ЗАКОНЧИТЬ ИГРУ
          </button>
        </div>
      )}
    </div>
  );
}

// --- СТИЛИ (CLAYMOPRHISM LIGHT) ---
const styles = {
  app: { padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center' },
  card: { backgroundColor: '#ffffff', borderRadius: '30px', padding: '30px', boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff', maxWidth: '400px', width: '100%', textAlign: 'center' },
  title: { color: '#2d3436', marginBottom: '20px' },
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '10px' },
  input: { flex: 1, padding: '12px', borderRadius: '15px', border: 'none', backgroundColor: '#f0f2f5', boxShadow: 'inset 5px 5px 10px #e0e0e0, inset -5px -5px 10px #ffffff' },
  btnPrimary: { width: '100%', padding: '15px', marginTop: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#6c5ce7', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  btnSecondary: { width: '100%', padding: '12px', borderRadius: '20px', border: 'none', backgroundColor: '#a29bfe', color: 'white', cursor: 'pointer' },
  btnDanger: { padding: '10px', borderRadius: '15px', border: 'none', backgroundColor: '#ff7675', color: 'white', cursor: 'pointer' },
  btnRole: { padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#ffffff', boxShadow: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff', cursor: 'pointer', fontSize: '1.1rem' },
  btnDisabled: { padding: '20px', borderRadius: '20px', border: 'none', backgroundColor: '#dfe6e9', color: '#b2bec3', cursor: 'not-allowed' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' },
  timer: { fontSize: '4rem', color: '#d63031', margin: '20px 0' },
  infoBox: { padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px', margin: '20px 0', fontSize: '0.9rem' }
};
