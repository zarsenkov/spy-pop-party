import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, UserSearch, Camera } from 'lucide-react';

// --- СПИСОК ЛОКАЦИЙ ---
const LOCATIONS = ["Орбитальная станция", "Овощебаза", "Подводная лодка", "Киностудия", "Партизанский отряд", "Цирк-шапито", "Выставка кошек"];

export default function App() {
  const [playersCount, setPlayersCount] = useState(3); // Кол-во игроков
  const [gameStarted, setGameStarted] = useState(false); // Статус игры
  const [roles, setRoles] = useState([]); // Массив распределенных ролей
  const [currentPlayer, setCurrentPlayer] = useState(0); // Индекс текущего игрока
  const [showRole, setShowRole] = useState(false); // Видимость роли на экране

  // --- ФУНКЦИЯ СТАРТА ИГРЫ ---
  // Перемешивает роли и назначает шпиона
  const startGame = () => {
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const spyIndex = Math.floor(Math.random() * playersCount);
    
    const newRoles = Array.from({ length: playersCount }, (_, i) => 
      i === spyIndex ? "ТЫ ШПИОН" : location
    );
    
    setRoles(newRoles);
    setGameStarted(true);
    setCurrentPlayer(0);
    setShowRole(false);
  };

  // --- СЛЕДУЮЩИЙ ИГРОК ---
  const nextPlayer = () => {
    setShowRole(false);
    if (currentPlayer < playersCount - 1) {
      setCurrentPlayer(currentPlayer + 1);
    } else {
      setGameStarted(false); // Конец раздачи
    }
  };

  // Экран настроек
  if (!gameStarted) {
    return (
      <div className="monitor">
        <div className="info-bar"><span>SYSTEM: READY</span> <Camera size={14}/></div>
        <div className="role-display setup-screen">
          <UserSearch size={48} />
          <h2>КОЛИЧЕСТВО АГЕНТОВ</h2>
          <input 
            type="number" 
            value={playersCount} 
            onChange={(e) => setPlayersCount(Math.max(3, e.target.value))}
          />
          <button onClick={startGame}>ИНИЦИИРОВАТЬ СЕАНС</button>
        </div>
      </div>
    );
  }

  // Экран раздачи ролей
  return (
    <div className="monitor">
      <div className="info-bar">
        <div className="rec-indicator">● REC</div>
        <span>OBJECT: {currentPlayer + 1} / {playersCount}</span>
      </div>

      <div className="role-display">
        {!showRole ? (
          <>
            <div className="role-card">
              <p>ПЕРЕДАЙТЕ ТЕЛЕФОН ИГРОКУ №{currentPlayer + 1}</p>
            </div>
            <button onClick={() => setShowRole(true)}> <Eye size={18}/> ПОСМОТРЕТЬ</button>
          </>
        ) : (
          <>
            <div className="role-card" style={{borderColor: roles[currentPlayer] === "ТЫ ШПИОН" ? "#ff0000" : "#fff"}}>
              <h1 style={{fontSize: '1rem'}}>ВАША ЛОКАЦИЯ:</h1>
              <p style={{fontSize: '1.5rem', fontWeight: 800}}>{roles[currentPlayer]}</p>
            </div>
            <button onClick={nextPlayer}> <EyeOff size={18}/> СКРЫТЬ И ПЕРЕДАТЬ</button>
          </>
        )}
      </div>

      <div className="info-bar" style={{border: 'none', borderTop: '1px solid #333', marginTop: '20px', paddingTop: '10px'}}>
        <span>SECURE_CONNECTION: 100%</span>
        <span> <ShieldCheck size={14}/> </span>
      </div>
    </div>
  );
}
