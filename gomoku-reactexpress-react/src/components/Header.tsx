import { useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context'

import style from './Header.module.css'

// Header component used on all of the pages, with some conditional rendering
export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(UserContext)

  // Function to get the actions (buttons) to render in the header
  const getActions = () => {
    // Check if user logged in
    if (user) {
        // Check if the current path is either 'games' or starts with 'game-log/', to remove the 'Previous Games' button from the header on those pages
        const isOnGamePage = location.pathname === '/games' || location.pathname.startsWith('/game-log/');
        return (
            <>
                <button
                    className={style.action}
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                >
                    Logout
                </button>
                {!isOnGamePage && (
                    <button
                        className={style.action}
                        onClick={() => {
                            console.log('Navigating to /Games');
                            navigate('games');
                        }}
                    >
                        Previous Games
                    </button>
                )}
            </>
        );
    } else {
        // If user not logged in, render either the 'Login' or 'Sign Up' button depending on the current path
        return location.pathname !== '/login' ? (
            <button className={style.action} onClick={() => navigate('login')}>
                Login
            </button>
        ) : (
            <button className={style.action} onClick={() => navigate('sign-up')}>
                Sign Up
            </button>
        );
    }
  };
  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link to="/">Gomoku</Link>
        <div className={style.actions}>{getActions()}</div>
      </div>
    </header>
  )
}
