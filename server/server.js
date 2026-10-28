import 'dotenv/config';
import app from './app.js';
import {closePdfBrowser} from './services/pdfService.js';
const server = app.listen(process.env.PORT || 5000, () => console.log('Resumify API listening'));
async function shutdown() {server.close(); await closePdfBrowser(); process.exit(0);}
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
