import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import {sampleResume} from '../shared/resumeData.js';
test('Express returns resume insights', async () => {const response = await request(app).post('/api/resumes/inspect').send(sampleResume); assert.equal(response.status,200); assert.ok(response.body.completeness.score > 80); assert.ok(Array.isArray(response.body.checks));});
test('Express rejects malformed resumes', async () => {const response = await request(app).post('/api/resumes/inspect').send({template:'nope'}); assert.equal(response.status,400);});
