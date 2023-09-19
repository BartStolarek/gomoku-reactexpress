import { Routes, Route, Navigate } from 'react-router-dom'
import { Header, UserProvider, GameProvider } from './components'
import { Home, Login, SignUp, Game, Games, GameLog } from './pages'

import style from './App.module.css'

function App() {
  return (
    <UserProvider>
      <GameProvider>
        <Header />
        <main className={style.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="game" element={<Game />} />
            <Route path="games" element={<Games />} />
            <Route path="game-log/:gameId" element={<GameLog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </GameProvider>
    </UserProvider>
  )
}

export default App
