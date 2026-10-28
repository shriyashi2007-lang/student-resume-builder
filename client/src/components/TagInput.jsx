import {useState} from 'react';
import {X, Plus} from 'lucide-react';
export default function TagInput({label, value = [], onChange, placeholder, id}) {
  const [draft, setDraft] = useState('');
  const add = () => {const next = draft.trim(); if (next && !value.some(x => x.toLowerCase() === next.toLowerCase())) onChange([...value, next]); setDraft('');};
  return <div className="form-field tag-field"><label htmlFor={id}>{label}</label><div className="tag-editor">{value.map((tag, i) => <span className="tag" key={`${tag}-${i}`}>{tag}<button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((_, index) => index !== i))}><X size={12}/></button></span>)}<input id={id} value={draft} placeholder={value.length ? '' : placeholder} onChange={e => setDraft(e.target.value)} onKeyDown={e => {if (e.key === 'Enter' || e.key === ',') {e.preventDefault(); add();} if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));}}/><button type="button" className="tag-add" aria-label={`Add ${label}`} onClick={add}><Plus size={14}/></button></div><span className="field-help">Type a value, then press Enter.</span></div>;
}
