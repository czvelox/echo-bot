import axios from 'axios';
import { EchoBot } from './Client';
import './express';

import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

export const bots: EchoBot[] = [];

axios.get(`http://${process.env.API_HOST}/bots`, { headers: { Authorization: process.env.API_TOKEN } }).then((response) => {
	response.data.forEach((bot: any) => {
		const echoBot = new EchoBot(bot.token, bot.settings);
		echoBot.start();

		bots.push(new EchoBot(bot.token, bot.settings));
	});
});
