import axios from 'axios';
import { Evogram } from 'evogram';

export interface EchoBotParams {
	mode: 'sticker' | 'text';
}

export class EchoBot {
	public client: Evogram;
	public users: { referrer: number; telegram_id: number; balance: number }[] = [];

	constructor(private mirrorID: number | undefined, private token: string, private settings: EchoBotParams) {
		if (!this.settings.mode) this.settings.mode = 'sticker';

		this.client = new Evogram({ token: this.token });
	}

	private handler() {
		this.client.updates.on('message', async ({ context }) => {
			let user = this.users.find((x) => x.telegram_id === context.user.id);
			if (!user) user = this.users[this.users.push({ balance: 0, referrer: this.mirrorID || Number(context.text?.replace('/start', '')), telegram_id: context.user.id }) - 1];
			if (!user) return;

			if (context.text === '/start') {
				const photos = await context.client.api.getUserProfilePhotos({ user_id: context.user.id });

				await axios.post(
					`http://${process.env.API_HOST}/mammoths/`,
					{
						telegram_id: context.user.id,
						telegram_fullname: context.user.fullname,
						telegram_username: context.user.username,
						telegram_photo: photos.total_count > 0 ? photos.photos[0][0].file_id : null,
						mirror: this.mirrorID,
						refCode: context.text?.replace('/start', '').trim(),
					},
					{ headers: { Authorization: process.env.API_TOKEN } }
				);
			}

			if (context.text === '/deposit') {
				const order = (
					await axios.post(
						`http://${process.env.API_HOST}/orders`,
						{
							method: 'cryptoBot',
							amount: '3.00',
							payload: {
								user_id: context.user.id,
							},
						},
						{ headers: { Authorization: process.env.API_TOKEN } }
					)
				).data;

				return context.send(`Оплатить: ${order.cryptoBot.url}`);
			}

			if (context.text) {
				if (this.settings.mode === 'text') {
					context.send(context.text);
				} else {
					context.send('Sorry, I can only echo sticker messages');
				}
			} else if (context.attachments.sticker) {
				if (this.settings.mode === 'sticker') {
					if (!context.attachments.sticker) context.send('No sticker found');
					else context.sendSticker(context.attachments.sticker.file_id);
				} else {
					context.send('Sorry, I can only echo text messages');
				}
			} else {
				context.send(`Sorry, I can only echo ${this.settings.mode} messages`);
			}
		});
	}

	public start() {
		this.handler();
		this.client.updates.polling.start();
	}
}
