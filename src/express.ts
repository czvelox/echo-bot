import express, { Request, Response } from 'express';
import { EchoBot } from './Client';

const app = express();
const port = 3000;

app.post('/startBot', (req: Request, res: Response) => {
	const { token, settings } = req.body;
	new EchoBot(token, settings).start();

	res.send('Bot started');
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
