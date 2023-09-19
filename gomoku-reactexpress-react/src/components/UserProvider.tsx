import { useState } from 'react'
import { User, UsersData } from '../types'
import { UserContext } from '../context'
import { useLocalStorage } from '../hooks'


type UserProviderProps = {
  children: React.ReactNode
}

// UserProvider which provides the user context to all children
export default function UserProvider({ children }: UserProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [usersData, setUsersData] = useLocalStorage<UsersData>('users', {});

  // Login function which takes in a username and password and returns true if the login was successful
  const login = (username: string, password: string, immediateUsersData?: UsersData) => {

    // Check if user exists in local storage
    const user = usersData[username] || immediateUsersData?.[username];
    if (!user) {
        return `User with username "${username}" does not exist.`;
    } else if (user.password !== password) {
        return `Incorrect password for username "${username}". Entered: "${password}", Expected: "${user.password}"`;
    } else {
        setCurrentUser({
            _id: username,
            token: 'mock_token',
        });
        return true;
    }
};

  // Register function which takes in a username and password and returns true if the registration was successful
  const register = (username: string, password: string) => {
    
    // Check if username already exists
    if (usersData[username]) {
      return "Username already exists";
    }

    // Add new user to local storage
    const newUsersData = {
      ...usersData,
      [username]: {
        password,
      },
    }
    setUsersData(newUsersData);
    return login(username, password, newUsersData);
  };

  // Logout function which sets the current user to undefined
  const logout = () => {
    setCurrentUser(undefined);
  };

  return (
    <UserContext.Provider value={{ user: currentUser, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}
