import VisitCounter from '../models/visitCounter.js';

export async function incrementVisitCount(req, res) {
	try {
		const counter = await VisitCounter.findOneAndUpdate(
			{ counter: 'site-visits' },
			{
				$inc: { count: 1 },
				$setOnInsert: { counter: 'site-visits' }
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			}
		);

		res.json({ count: counter.count });
	} catch (error) {
		console.error('Errore aggiornamento contatore visite:', error);
		res.status(500).json({ error: 'Impossibile aggiornare il contatore delle visite' });
	}
}
