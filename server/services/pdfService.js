import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';
import {renderResumeDocument} from '../shared/renderResumeHtml.js';
let browserPromise;
let active = 0;
const waiting = [];
const acquire = () => active < 2 ? (active++, Promise.resolve()) : new Promise(resolve => waiting.push(resolve));
const release = () => {active--; const next = waiting.shift(); if (next) {active++; next();}};
async function browser() {browserPromise ||= puppeteer.launch({headless: 'shell', timeout: 60000, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu']}); return browserPromise;}
export async function createResumePdf(resume) {
  if (process.platform === 'win32' && process.env.FORCE_CHROMIUM_PDF !== 'true') return createPortablePdf(resume);
  await acquire(); let page;
  try {
    page = await (await browser()).newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', request => {const url = request.url(); const allowed = url.startsWith('data:') || url === 'about:blank' || /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(url); allowed ? request.continue() : request.abort();});
    page.setDefaultTimeout(30000);
    await page.setContent(renderResumeDocument(resume), {waitUntil: 'networkidle0', timeout: 30000});
    await page.evaluate(() => document.fonts.ready);
    return await page.pdf({format: 'A4', preferCSSPageSize: true, printBackground: true, timeout: 30000});
  } finally {if (page) await page.close(); release();}
}
function createPortablePdf(resume) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({size:'A4', margins:{top:44,bottom:44,left:44,right:44}, info:{Title:`${resume.data.personal.name || 'Student'} Resume`,Author:resume.data.personal.name || 'Resumify'}});
    const chunks = []; doc.on('data', chunk => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
    const p = resume.data.personal, accent = resume.settings.accent || '#6352a0';
    const heading = title => {doc.moveDown(.7).fillColor(accent).font('Helvetica-Bold').fontSize(10).text(title.toUpperCase(), {characterSpacing:1.2}); doc.moveDown(.25).strokeColor('#d5d8de').moveTo(doc.x,doc.y).lineTo(551,doc.y).stroke().moveDown(.45).fillColor('#253043');};
    const entry = (title, subtitle, date, body) => {doc.font('Helvetica-Bold').fontSize(10.5).text(title || '', {continued:!!date}); if(date) doc.font('Helvetica').fontSize(8.5).fillColor('#667085').text(date,{align:'right'}); if(subtitle) doc.font('Helvetica').fontSize(9).fillColor('#596477').text(subtitle); if(body) doc.moveDown(.15).font('Helvetica').fontSize(9).fillColor('#253043').text(body,{lineGap:2}); doc.moveDown(.45);};
    doc.fillColor('#192235').font('Helvetica-Bold').fontSize(24).text(p.name || 'Your name'); if(p.headline) doc.fillColor(accent).font('Helvetica').fontSize(12).text(p.headline);
    doc.moveDown(.4).fillColor('#596477').fontSize(8.5).text([p.email,p.phone,p.location,p.linkedin,p.github,p.portfolio].filter(Boolean).join('  •  '));
    const hidden = new Set(resume.settings.hiddenSections || []), order = resume.settings.sectionOrder || [];
    const sections = {
      summary:()=>{if(p.summary){heading('Profile');doc.font('Helvetica').fontSize(9).fillColor('#253043').text(p.summary,{lineGap:2});}},
      education:()=>{if(resume.data.education.length){heading('Education');resume.data.education.forEach(x=>entry([x.degree,x.specialization].filter(Boolean).join(' · '),x.college,[x.startYear,x.graduationYear].filter(Boolean).join(' — '),[x.grade,x.coursework&&`Coursework: ${x.coursework}`].filter(Boolean).join('\n')));}},
      skills:()=>{const groups=Object.entries(resume.data.skills).filter(([,v])=>v.length);if(groups.length){heading('Skills');groups.forEach(([key,v])=>entry(key.replace(/([A-Z])/g,' $1'),'', '',v.join(', ')));}},
      projects:()=>{if(resume.data.projects.length){heading('Projects');resume.data.projects.forEach(x=>entry(x.name,x.technologies?.join(' · '),'',[x.description,x.achievements,[x.github,x.live].filter(Boolean).join(' · ')].filter(Boolean).join('\n')));}},
      experience:()=>{if(resume.data.experience.length){heading('Experience');resume.data.experience.forEach(x=>entry(x.title,[x.company,x.location].filter(Boolean).join(' · '),[x.start,x.current?'Present':x.end].filter(Boolean).join(' — '),[x.responsibilities,x.achievements].filter(Boolean).join('\n')));}},
      certifications:()=>{if(resume.data.certifications.length){heading('Certifications');resume.data.certifications.forEach(x=>entry(x.name,x.issuer,x.issueDate,x.url));}},
      achievements:()=>{if(resume.data.achievements.length){heading('Achievements');resume.data.achievements.forEach(x=>entry(x.category,'','',x.description));}},
      extras:()=>{const x=resume.data.extras;if(x.languages.length||x.interests.length||x.extracurriculars){heading('Beyond the resume');doc.font('Helvetica').fontSize(9).text([x.languages.length&&`Languages: ${x.languages.join(', ')}`,x.interests.length&&`Interests: ${x.interests.join(', ')}`,x.extracurriculars].filter(Boolean).join('\n'));}}
    };
    order.forEach(id=>{if(!hidden.has(id)) sections[id]?.();}); doc.end();
  });
}
export async function closePdfBrowser() {if (browserPromise) {const instance = await browserPromise; browserPromise = undefined; await instance.close();}}
