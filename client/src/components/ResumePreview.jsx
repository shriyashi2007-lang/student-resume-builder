import {useEffect, useMemo, useRef, useState} from 'react';
import {Minus, Plus, Scan, Printer} from 'lucide-react';
import {renderResumeDocument} from '../shared/renderResumeHtml.js';
export default function ResumePreview({resume, thumbnail = false, hero = false}) {
  const frame = useRef(null), outer = useRef(null);
  const [height, setHeight] = useState(1123), [width, setWidth] = useState(500), [zoom, setZoom] = useState('fit');
  const html = useMemo(() => renderResumeDocument(resume), [resume]);
  useEffect(() => {if (!outer.current) return; const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width)); observer.observe(outer.current); return () => observer.disconnect();}, []);
  useEffect(() => {
    const iframe = frame.current; let observer;
    const measure = () => {const body = iframe?.contentDocument?.body; if (!body) return; const update = () => setHeight(Math.max(1123, body.scrollHeight)); observer?.disconnect(); observer = new ResizeObserver(update); observer.observe(body); update();};
    iframe?.addEventListener('load', measure); measure();
    return () => {observer?.disconnect(); iframe?.removeEventListener('load', measure);};
  }, [html]);
  const scale = thumbnail || hero || zoom === 'fit' ? Math.min((width - (thumbnail || hero ? 0 : 32)) / 794, 1) : zoom / 100;
  const print = () => {frame.current?.contentWindow?.focus(); frame.current?.contentWindow?.print();};
  return <div className={`resume-preview ${thumbnail ? 'thumbnail-preview' : ''} ${hero ? 'hero-preview' : ''}`}>
    {!thumbnail && !hero && <div className="preview-toolbar"><span className="toolbar-label"><span className="status-dot"/> Live preview</span><div className="zoom-controls"><button className="icon-button" aria-label="Zoom out" onClick={() => setZoom(z => Math.max(50, (z === 'fit' ? 100 : z) - 10))}><Minus size={15}/></button><select aria-label="Preview zoom" value={zoom} onChange={e => setZoom(e.target.value === 'fit' ? 'fit' : Number(e.target.value))}><option value="fit">Fit</option>{Array.from({length: 11}, (_, i) => 50 + i * 10).map(n => <option value={n} key={n}>{n}%</option>)}</select><button className="icon-button" aria-label="Zoom in" onClick={() => setZoom(z => Math.min(150, (z === 'fit' ? 100 : z) + 10))}><Plus size={15}/></button><button className="icon-button" aria-label="Fit resume to preview" onClick={() => setZoom('fit')}><Scan size={16}/></button><button className="button button-small button-outline" onClick={print}><Printer size={14}/> Print / PDF</button></div></div>}
    <div className="preview-viewport" ref={outer}><div className="paper-extent" style={{width: 794 * scale, height: height * scale}}><iframe ref={frame} title={thumbnail ? `${resume.template} template preview` : 'Resume preview'} srcDoc={html} sandbox="allow-same-origin allow-modals" scrolling="no" tabIndex={thumbnail || hero ? -1 : 0} style={{width: 794, height, transform: `scale(${scale})`, transformOrigin: 'top left'}}/>{!thumbnail && !hero && Array.from({length: Math.ceil(height / 1123) - 1}, (_, i) => <div key={i} className="page-guide" style={{top: (i + 1) * 1123 * scale}}>A4 page guide {i + 2}</div>)}</div></div>
    {!thumbnail && !hero && <p className="preview-footnote">A4 · {Math.ceil(height / 1123)} page{height > 1123 ? 's' : ''} · Continuous preview; print preview shows final page breaks.</p>}
  </div>;
}
