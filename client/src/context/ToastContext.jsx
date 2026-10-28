import {createContext, useContext, useState, useCallback} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {X, CheckCircle2, AlertCircle} from 'lucide-react';
const ToastContext = createContext(null);
export function ToastProvider({children}) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback(id => setToasts(items => items.filter(t => t.id !== id)), []);
  const toast = useCallback((message, type = 'success') => {const id = crypto.randomUUID(); setToasts(t => [...t.slice(-3), {id, message, type}]); setTimeout(() => dismiss(id), 6000);}, [dismiss]);
  return <ToastContext.Provider value={toast}>{children}<div className="toast-stack" aria-live="polite"><AnimatePresence>{toasts.map(t => <motion.div role="status" key={t.id} className={`toast ${t.type}`} initial={{opacity: 0, y: 15}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}}>{t.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}<span>{t.message}</span><button className="icon-button" onClick={() => dismiss(t.id)} aria-label="Dismiss notification"><X size={16}/></button></motion.div>)}</AnimatePresence></div></ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
