import axios from 'axios';
const api = axios.create({baseURL: import.meta.env.VITE_API_URL || '/api', withCredentials: true, timeout: 30000});
export async function inspectResume(resume) {const {data} = await api.post('/resumes/inspect', resume); return data;}
export async function downloadGuestPdf(resume) {const response = await api.post('/resumes/pdf', resume, {responseType: 'blob', timeout: 60000}); const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url; link.download = `${(resume.data.personal.name || 'Student_Resume').replace(/[^a-z0-9]+/gi, '_')}.pdf`; link.click(); URL.revokeObjectURL(url);}
export default api;
