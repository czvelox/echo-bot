import axios from 'axios';
import { EchoBot } from './Client';

import dotenv from 'dotenv';
dotenv.config();

axios.get('http://localhost:3000/bots', { headers: { Authorization: process.env.TOKEN } }).then((response) => {
	response.data.forEach((bot: any) => {
		new EchoBot(bot.token, bot.settings).start();
	});
});
