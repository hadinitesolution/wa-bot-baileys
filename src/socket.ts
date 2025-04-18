import {
	isJidUser,
	makeWASocket,
	useMultiFileAuthState,
	WASocket,
} from 'baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import fs from 'fs';
import question from '@utils/question';
import messagesUpsert from '@events/message_upsert.handler.js';
import './config/bot.ts';

(async function start(usePairingCode = true) {
	const session = await useMultiFileAuthState('session');
	const socket: WASocket = makeWASocket({
		printQRInTerminal: !usePairingCode,
		auth: session.state,
		logger: pino({ level: 'silent' }).child({ level: 'silent' }),
		shouldIgnoreJid: (jid) => !isJidUser(jid),
	});

	if (usePairingCode && !socket.user && !socket.authState.creds.registered) {
		if (
			await (async () => {
				return (
					(
						await question('Ingin terhubung menggunakan pairing code? [Y/n]: ')
					).toLowerCase() === 'n'
				);
			})()
		)
			return start(false);
		const waNumber = await question('Masukkan nomor WhatsApp Anda: +');
		const code = await socket.requestPairingCode(waNumber.replace(/\D/g, ''));
		console.log(`\x1b[44;1m\x20PAIRING CODE\x20\x1b[0m\x20${code}`);
	}

	socket.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
		if (connection === 'close') {
			if (lastDisconnect?.error) {
				const { statusCode, error } = (lastDisconnect.error as Boom)?.output
					.payload;

				if (statusCode === 401 && error === 'Unauthorized') {
					await fs.promises.rm('session', {
						recursive: true,
						force: true,
					});
				}
			}

			return start();
		}

		if (connection === 'open') {
			// NOTE: Number Validation
			if (
				global.bot.number &&
				global.bot.number !== socket?.user?.id.split(':')[0]
			) {
				console.log(
					`\x1b[35;1mNomor ini tidak memiliki akses untuk menggunakan script whatsapp bot ini\x1b[0m\n-> SILAHKAN MEMESAN SCRIPT INI KE ${global.owner.name} WA ${global.owner.number}`
				);

				return process.exit();
			}
			console.log(
				'Berhasil terhubung dengan: ' + socket?.user?.id.split(':')[0]
			);
		}
	});

	socket.ev.on('creds.update', session.saveCreds);

	socket.ev.on('messages.upsert', ({ messages }) => {
		if (!messages[0].key.fromMe) return;

		messagesUpsert(socket, messages[0]);
	});
})();
