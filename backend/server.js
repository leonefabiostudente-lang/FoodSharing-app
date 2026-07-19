import dns from 'dns';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import annunciRouter from './routes/annunci.js';
import visitsRouter from './routes/visits.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();

const corsOptions = {
	origin: [
		'http://localhost:5173',
		'https://antispreco-app.vercel.app',
		'https://foodsharing-app.vercel.app',
		'https://www.viveretropea.com',
		'https://viveretropea.com',
		'https://www.viveretropea.it',
		'https://viveretropea.it'
	],
	credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '8mb' }));

app.use('/api', authRoutes);
app.use('/api/annunci', annunciRouter);
app.use('/api/visits', visitsRouter);

app.get('/api/test', (req, res) => {
	const stato = mongoose.connection.readyState === 1 ? 'connesso' : 'non connesso';
	res.json({ message: 'Backend online!', mongodb: stato });
});

const PORT = process.env.PORT || 5000;

async function start() {
	const uri = process.env.MONGODB_URI;

	if (!uri) {
		console.error('Errore: MONGODB_URI non trovata nelle variabili ambiente');
		process.exit(1);
	}

	try {
		await mongoose.connect(uri);
		console.log('MongoDB connesso');

		app.listen(PORT, () => {
			console.log(`Server in esecuzione su porta ${PORT}`);
		});
	} catch (error) {
		console.error('Errore connessione MongoDB:', error);
		process.exit(1);
	}
}

start();
