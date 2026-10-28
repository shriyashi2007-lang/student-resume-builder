import {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Menu, X, Sun, Moon, ArrowUpRight, Sparkles} from 'lucide-react';
import {useTheme} from '../context/ThemeContext.jsx';
export function Logo() {return <Link to="/" className="logo" aria-label="Resumify home"><span className="logo-mark"><span/><span/><span/><Sparkles size={13}/></span>resumify<span className="logo-period">.</span></Link>;}
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const {theme, toggleTheme} = useTheme();
  return <header className="site-header"><div className="nav-inner container"><Logo/><nav id="main-nav" aria-label="Main navigation" className={open ? 'nav-links is-open' : 'nav-links'}>{[['/', 'Home'], ['/builder', 'Resume Builder'], ['/templates', 'Templates'], ['/resumes', 'My Resumes'], ['/about', 'About']].map(([to, text]) => <NavLink end={to === '/'} key={to} to={to} onClick={() => setOpen(false)}>{text}</NavLink>)}</nav><div className="nav-actions"><button onClick={toggleTheme} className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button><Link className="nav-login" to="/login">Log in</Link><Link className="button button-small button-outline nav-start" to="/register">Get started <ArrowUpRight size={15}/></Link><button className="icon-button mobile-menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button></div></div></header>;
}
