import {useEffect} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import {MotionConfig} from 'framer-motion';
import {ThemeProvider} from './context/ThemeContext.jsx';
import {ToastProvider} from './context/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Templates from './pages/Templates.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Builder from './pages/Builder.jsx';
import './styles/tokens.css';
import './styles/global.css';
function AppRoutes() {const {pathname} = useLocation(); useEffect(() => {window.scrollTo(0, 0);}, [pathname]); const builder = pathname.startsWith('/builder'); return <><a className="skip-link" href="#main-content">Skip to content</a><Navbar/><div id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Home/>}/><Route path="/builder" element={<Builder/>}/><Route path="/builder/:id" element={<Builder/>}/><Route path="/templates" element={<Templates/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Routes></div>{!builder && <Footer/>}</>;}
export default function App() {return <MotionConfig reducedMotion="user"><ThemeProvider><ToastProvider><AppRoutes/></ToastProvider></ThemeProvider></MotionConfig>;}
