import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
test('health endpoint responds', async () => {const response = await request(app).get('/api/health'); assert.equal(response.status, 200); assert.equal(response.body.service, 'resumify');});
