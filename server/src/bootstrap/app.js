import app from './express.js';
import loader from './loader.js';

loader(app); // Dynamically loads routes, etc.

export default app;