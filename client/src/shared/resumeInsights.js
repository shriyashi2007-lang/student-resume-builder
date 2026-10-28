const filled = value => String(value || '').trim().length > 0;
const allSkills = data => Object.values(data?.skills || {}).flat().filter(filled);
const hasItems = value => Array.isArray(value) && value.length > 0;
export function getCompleteness(data = {}) {
  const p = data.personal || {};
  const personalParts = [p.name, p.email, p.phone, p.headline, p.summary, p.location];
  const groups = [
    ['personal', 30, personalParts.filter(filled).length / personalParts.length, 'Add your name, contact details, headline, and summary.', 0],
    ['education', 15, hasItems(data.education) ? 1 : 0, 'Add at least one education entry.', 1],
    ['skills', 15, Math.min(allSkills(data).length / 5, 1), 'Add at least five relevant skills.', 2],
    ['projects', 15, hasItems(data.projects) ? 1 : 0, 'Show a project that proves what you can do.', 3],
    ['experience', 10, hasItems(data.experience) ? 1 : 0, 'Add work, internship, volunteer, or leadership experience.', 4],
    ['certifications', 5, hasItems(data.certifications) ? 1 : 0, 'Add a relevant certification if you have one.', 5],
    ['achievements', 5, hasItems(data.achievements) ? 1 : 0, 'Add an achievement, award, or competition.', 6],
    ['extras', 5, hasItems(data.extras?.languages) || hasItems(data.extras?.interests) || filled(data.extras?.extracurriculars) ? 1 : 0, 'Add languages, interests, or extracurricular activities.', 7]
  ];
  const score = Math.round(groups.reduce((sum, [, weight, ratio]) => sum + weight * ratio, 0));
  return {score, suggestions: groups.filter(([, , ratio]) => ratio < 1).map(([section, , , message, step]) => ({section, message, step}))};
}
const emailValid = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
export function getAtsChecks(data = {}, template = 'ats-classic') {
  const p = data.personal || {}, skills = allSkills(data), checks = [];
  const add = (ok, label, detail, step) => checks.push({ok, label, detail, step});
  add(filled(p.name), 'Name', filled(p.name) ? 'Your name is present.' : 'Add your full name.', 0);
  add(emailValid(p.email), 'Email', emailValid(p.email) ? 'Your email format looks valid.' : 'Add a valid email address.', 0);
  add(filled(p.phone), 'Phone', filled(p.phone) ? 'A phone number is present.' : 'Add a phone number.', 0);
  add(filled(p.summary) && p.summary.length >= 45 && p.summary.length <= 600, 'Professional summary', !filled(p.summary) ? 'Add a concise professional summary.' : p.summary.length < 45 ? 'Add a little more detail to your summary.' : p.summary.length > 600 ? 'Shorten your summary to under 600 characters.' : 'Your summary has a useful length.', 0);
  add(hasItems(data.education), 'Education', hasItems(data.education) ? 'Education is included.' : 'Add your education.', 1);
  add(skills.length >= 5, 'Relevant skills', skills.length >= 5 ? `${skills.length} skills are included.` : 'Add at least five skills.', 2);
  add(hasItems(data.projects), 'Projects', hasItems(data.projects) ? 'Projects demonstrate your work.' : 'Add at least one project.', 3);
  add(filled(p.linkedin) || filled(p.github), 'Professional links', filled(p.linkedin) || filled(p.github) ? 'A LinkedIn or GitHub link is present.' : 'Consider adding LinkedIn or GitHub.', 0);
  const bullets = [...(data.projects || []), ...(data.experience || [])].flatMap(x => [x.achievements, x.responsibilities]).filter(filled).flatMap(x => x.split('\n'));
  add(!bullets.some(x => x.length > 220), 'Concise bullets', bullets.some(x => x.length > 220) ? 'Shorten bullets longer than 220 characters.' : 'Your bullets are concise.', 3);
  const words = JSON.stringify(data).replace(/[^\w\s]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  add(words < 950, 'Resume length', words < 950 ? `About ${words} words — a practical length.` : 'The resume is very long. Remove details that do not support the role.', 0);
  if (template !== 'ats-classic') checks.push({ok: null, label: 'Template note', detail: 'Multi-column templates can parse less reliably than ATS Classic.', step: null});
  return checks;
}
export const writingHelp = {
  actionVerbs: {building: ['Built', 'Developed', 'Engineered', 'Implemented'], improving: ['Improved', 'Optimized', 'Streamlined', 'Reduced'], leading: ['Led', 'Coordinated', 'Mentored', 'Organized'], researching: ['Analyzed', 'Evaluated', 'Investigated', 'Validated']},
  summaries: ['Curious student with hands-on experience building practical projects and a strong foundation in problem solving.', 'Motivated graduate who combines academic learning with collaborative projects and a commitment to continuous improvement.'],
  weakPhrases: {'responsible for': 'Led or managed', 'worked on': 'Built or contributed to', 'helped with': 'Supported or improved'}
};
export function getWritingSuggestions(data = {}) {
  const text = JSON.stringify(data).toLowerCase();
  const weak = Object.entries(writingHelp.weakPhrases).filter(([phrase]) => text.includes(phrase)).map(([phrase, alternative]) => `Replace “${phrase}” with a specific action such as “${alternative}”.`);
  const bullets = [...(data.projects || []), ...(data.experience || [])].flatMap(x => [x.achievements, x.responsibilities]).filter(filled).flatMap(x => x.split('\n')).filter(filled);
  if (bullets.length && bullets.every(b => !/\d/.test(b))) weak.push('Add a measurable result where it is truthful: users reached, time saved, speed improved, or team size.');
  return weak;
}
