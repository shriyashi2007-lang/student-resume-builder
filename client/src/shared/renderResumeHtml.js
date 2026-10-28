import { templates, fonts, sectionIds, defaultSettings } from './resumeData.js';
import { templateCss, fontUrl } from './templateCss.js';
export const escapeHtml = (value = '') => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export function safeUrl(value) {try {const url = new URL(String(value)); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';} catch {return '';}}
const e = escapeHtml;
const link = (url, label) => safeUrl(url) ? `<a href="${e(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${e(label)}</a>` : '';
const list = (text) => text ? `<ul>${String(text).split('\n').filter(s => s.trim()).map(s => `<li>${e(s.replace(/^[-•]\s*/, ''))}</li>`).join('')}</ul>` : '';
const date = (value) => value ? e(value) : '';
const skillNames = {languages: 'Languages', frontend: 'Frontend', backend: 'Backend', databases: 'Databases', tools: 'Tools', softSkills: 'People skills'};
export function renderResumeHtml({template = 'ats-classic', settings = {}, data = {}} = {}) {
  template = templates.some(t => t.id === template) ? template : 'ats-classic';
  const font = fonts.includes(settings.font) ? settings.font : defaultSettings.font;
  const size = Math.min(16, Math.max(10, Number(settings.fontSize) || 12));
  const accent = /^#[\da-f]{6}$/i.test(settings.accent) ? settings.accent : defaultSettings.accent;
  const p = data.personal || {};
  const contacts = [p.email && `<span>${e(p.email)}</span>`, p.phone && `<span>${e(p.phone)}</span>`, p.location && `<span>${e(p.location)}</span>`, link(p.linkedin, 'LinkedIn'), link(p.github, 'GitHub'), link(p.portfolio, 'Portfolio')].filter(Boolean).join('');
  const header = `<header class="resume-header"><h1>${e(p.name || 'Your name')}</h1>${p.headline ? `<p class="headline">${e(p.headline)}</p>` : ''}<div class="contacts">${contacts}</div></header>`;
  const section = (id, title, content) => content ? `<section class="resume-section" data-section="${id}"><h2>${title}</h2>${content}</section>` : '';
  const entries = (items, render) => Array.isArray(items) ? items.map(item => `<div class="resume-entry">${render(item)}</div>`).join('') : '';
  const sections = {
    summary: section('summary', 'Profile', p.summary ? `<p>${e(p.summary)}</p>` : ''),
    education: section('education', 'Education', entries(data.education, x => `<div class="entry-heading"><h3>${e([x.degree, x.specialization].filter(Boolean).join(' · '))}</h3><span class="entry-date">${[date(x.startYear), date(x.graduationYear)].filter(Boolean).join(' — ')}</span></div><p class="entry-subtitle">${e(x.college)}</p>${x.grade ? `<p>${e(x.grade)}</p>` : ''}${x.coursework ? `<p class="muted">Coursework: ${e(x.coursework)}</p>` : ''}`)),
    skills: section('skills', 'Skills', Object.entries(data.skills || {}).filter(([key, values]) => skillNames[key] && Array.isArray(values) && values.length).map(([key, values]) => `<div class="skill-group"><strong>${skillNames[key]}: </strong><span class="chips">${template === 'modern-professional' ? values.map(v => `<span class="skill-chip">${e(v)}</span>`).join('') : values.map(e).join(', ')}</span></div>`).join('')),
    projects: section('projects', 'Projects', entries(data.projects, x => `<div class="entry-heading"><h3>${e(x.name)}</h3></div>${x.description ? `<p>${e(x.description)}</p>` : ''}${x.technologies?.length ? `<p class="entry-tech">${x.technologies.map(e).join(' · ')}</p>` : ''}${list(x.achievements)}<div class="entry-links">${link(x.github, 'Source code')}${link(x.live, 'Live project')}</div>`)),
    experience: section('experience', 'Experience', entries(data.experience, x => `<div class="entry-heading"><h3>${e(x.title)}</h3><span class="entry-date">${[date(x.start), x.current ? 'Present' : date(x.end)].filter(Boolean).join(' — ')}</span></div><p class="entry-subtitle">${e([x.company, x.location].filter(Boolean).join(' · '))}</p>${list(x.responsibilities)}${list(x.achievements)}`)),
    certifications: section('certifications', 'Certifications', entries(data.certifications, x => `<div class="entry-heading"><h3>${e(x.name)}</h3><span class="entry-date">${date(x.issueDate)}</span></div><p class="entry-subtitle">${e(x.issuer)}</p><div class="entry-links">${link(x.url, 'Credential')}</div>`)),
    achievements: section('achievements', 'Achievements', entries(data.achievements, x => `<p>${x.category ? `<strong>${e(x.category)}: </strong>` : ''}${e(x.description)}</p>`)),
    extras: section('extras', 'Beyond the resume', `<div class="resume-extras">${data.extras?.languages?.length ? `<p><strong>Languages:</strong> ${data.extras.languages.map(e).join(', ')}</p>` : ''}${data.extras?.interests?.length ? `<p><strong>Interests:</strong> ${data.extras.interests.map(e).join(', ')}</p>` : ''}${data.extras?.extracurriculars ? `<p>${e(data.extras.extracurriculars)}</p>` : ''}</div>`.replace('<div class="resume-extras"></div>', ''))
  };
  const order = [...new Set([...(Array.isArray(settings.sectionOrder) ? settings.sectionOrder : []), ...sectionIds])].filter(id => sectionIds.includes(id) && !settings.hiddenSections?.includes(id));
  const sideIds = ['skills', 'certifications', 'extras'];
  const ordered = ids => order.filter(id => ids.includes(id)).map(id => sections[id]).join('');
  let content = header + order.map(id => sections[id]).join('');
  if (template === 'tech-developer') content = `${header}<div class="resume-columns"><main>${ordered(sectionIds.filter(id => !sideIds.includes(id)))}</main><aside class="resume-sidebar">${ordered(sideIds)}</aside></div>`;
  if (template === 'creative-graduate') content = `<aside class="creative-sidebar">${header}${ordered(sideIds)}</aside><main class="creative-main">${ordered(sectionIds.filter(id => !sideIds.includes(id)))}</main>`;
  return `<article class="resume-document ${template}" style="--resume-font:'${font}';--resume-size:${size}px;--accent:${accent}">${content}</article>`;
}
export function renderResumeDocument(resume) {return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=794"><title>${e(resume?.data?.personal?.name || 'Resume')}</title><link rel="stylesheet" href="${fontUrl}"><style>${templateCss}</style></head><body>${renderResumeHtml(resume)}</body></html>`;}
