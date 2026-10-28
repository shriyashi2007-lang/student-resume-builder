import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {Logo} from './Navbar.jsx';
export default function Footer() {return <footer className="site-footer container"><div><Logo/><p>Made for the potential in you.</p></div><div className="footer-links"><Link to="/templates">Templates</Link><Link to="/about">About</Link><Link to="/builder">Start your next chapter <ArrowUpRight size={14}/></Link></div><p className="footer-note">© {new Date().getFullYear()} Resumify. Make your mark.</p></footer>;}
