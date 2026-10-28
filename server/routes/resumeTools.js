import {Router} from 'express';
import rateLimit from 'express-rate-limit';
import {z} from 'zod';
import {getCompleteness, getAtsChecks, getWritingSuggestions} from '../shared/resumeInsights.js';
import {createResumePdf} from '../services/pdfService.js';
const router = Router();
const resumeSchema = z.object({title: z.string().max(160).optional(), template: z.enum(['ats-classic','modern-professional','minimal-elegance','tech-developer','creative-graduate']), settings: z.object({font: z.string().max(40), fontSize: z.number().min(10).max(16), accent: z.string().regex(/^#[\da-f]{6}$/i), sectionOrder: z.array(z.string()).max(8), hiddenSections: z.array(z.string()).max(8)}), data: z.object({personal: z.object({name: z.string().max(100), headline: z.string().max(120), email: z.string().max(160), phone: z.string().max(35), location: z.string().max(120), linkedin: z.string().max(500), github: z.string().max(500), portfolio: z.string().max(500), summary: z.string().max(600)}), education: z.array(z.record(z.any())).max(15), skills: z.record(z.array(z.string().max(80)).max(50)), projects: z.array(z.record(z.any())).max(20), experience: z.array(z.record(z.any())).max(20), certifications: z.array(z.record(z.any())).max(20), achievements: z.array(z.record(z.any())).max(30), extras: z.record(z.any())})});
function validate(req, res, next) {const result = resumeSchema.safeParse(req.body); if (!result.success) return res.status(400).json({message:'Please check the resume fields.', issues:result.error.issues.map(x => ({path:x.path.join('.'),message:x.message}))}); req.resume = result.data; next();}
router.post('/inspect', validate, (req,res) => res.json({completeness:getCompleteness(req.resume.data), checks:getAtsChecks(req.resume.data, req.resume.template), writing:getWritingSuggestions(req.resume.data)}));
router.post('/pdf', rateLimit({windowMs: 60_000, limit: 10, standardHeaders: true, legacyHeaders: false}), validate, async (req,res,next) => {try {const pdf = await createResumePdf(req.resume); const name = (req.resume.data.personal.name || 'Student Resume').replace(/[^a-z0-9 _-]/gi,'').trim().replace(/\s+/g,'_'); res.set({'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${name || 'Student_Resume'}.pdf"`,'Content-Length':pdf.length}); res.end(pdf);} catch(error) {next(error);}});
export default router;
export {resumeSchema};
