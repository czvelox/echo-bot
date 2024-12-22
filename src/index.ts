import axios from 'axios';
import { EchoBot } from './Client';
import './express';

import dotenv from 'dotenv';
dotenv.config();

axios.get(`http://${process.env.API_HOST}/bots`, { headers: { Authorization: process.env.API_TOKEN } }).then((response) => {
	response.data.forEach((bot: any) => {
		new EchoBot(bot.token, bot.settings).start();
	});
});
