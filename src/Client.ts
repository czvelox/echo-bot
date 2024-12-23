import { Evogram } from 'evogram';

export interface EchoBotParams {
	mode: 'sticker' | 'text';
}

export class EchoBot {
	public client: Evogram;

	constructor(
		private token: string,
		private settings: EchoBotParams
	) {
		this.client = new Evogram({ token: this.token });
	}

	private handler() {
		this.client.updates.on('message', ({ context }) => {
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
