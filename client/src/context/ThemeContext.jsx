import {createContext, useContext, useState, useEffect} from 'react';
const ThemeContext = createContext(null);
export function ThemeProvider({children}) {
  const [theme, setTheme] = useState(() => {try {return localStorage.getItem('resumify-theme') === 'light' ? 'light' : 'dark';} catch {return 'dark';}});
  useEffect(() => {document.documentElement.dataset.theme = theme; try {localStorage.setItem('resumify-theme', theme);} catch {/* Theme remains available for this session. */}}, [theme]);
  return <ThemeContext.Provider value={{theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark')}}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
