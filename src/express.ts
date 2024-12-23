import express, { Request, Response } from 'express';
import { EchoBot } from './Client';

const app = express();
app.use(express.json());

app.post('/startBot', (req: Request, res: Response) => {
	const { token, settings } = req.body;
	new EchoBot(token, settings).start();

	res.send('Bot started');
});

app.listen(3000, () => {
	console.log(`Server is running on http://localhost:3000`);
});
