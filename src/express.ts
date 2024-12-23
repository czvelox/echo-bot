import express, { Request, Response } from 'express';
import { EchoBot } from './Client';
import { bots } from '.';

const app = express();
app.use(express.json());

app.post('/startBot', (req: Request, res: Response) => {
	const { token, settings } = req.body;
	const echoBot = new EchoBot(token, settings);
	echoBot.start();

	bots.push(echoBot);

	res.send('Bot started');
});

app.post('/stopBot', (req: Request, res: Response) => {
	const { token } = req.body;

	const index = bots.findIndex((bot) => bot.client.params.token === token);
	if (index === -1) return;

	bots[index].client.updates.polling.stop();
	bots.splice(index, 1);
});

app.listen(3000, () => {
	console.log(`Server is running on http://localhost:3000`);
});
