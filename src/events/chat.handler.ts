import { IChat } from 'types/chat';
import {
	getSession,
	hasAnswered,
	initializingQuestion,
	recordAnswer,
} from './session.handler';
import { getCurrentStage, getNextStage, stagesConverter } from '@utils/stages';

export function handleIncomingMessage(chat: IChat) {
	if (chat.command) console.log('Upsert Messages Log : ', chat);

	const session = getSession(chat.senderId);

	console.log('Im Running....', stagesConverter(session.currentStage));
	console.log(getNextStage(session.currentStage));
	console.log(getCurrentStage(session.currentStage));

	switch (session.currentStage) {
		case 'INITIALIZING':
			const nextStage = getNextStage(session.currentStage);
			const question = 'Apakah Anda pasien *lama* atau *baru*?';

			if (session.answers.length === 0) {
				initializingQuestion(
					chat.senderId,
					nextStage,
					session.currentStage,
					question,
					null
				);

				chat.replay({
					text: question,
				});

				break;
			} else if (session.answers.length > 0) {
				if (chat.text.toLowerCase().includes('lama')) {
					const question =
						'Silakan masukkan nomor rekam medis atau NIK dan tanggal lahir. format: (Nomor Rekam Medis/NIK)|dd-mm-yyyy';

					if (!hasAnswered(chat.senderId, nextStage)) break;

					recordAnswer(chat.senderId, session.currentStage, 'lama');

					chat.replay({
						text: question,
					});

					initializingQuestion(
						chat.senderId,
						nextStage,
						getNextStage(nextStage),
						question,
						null
					);
				} else if (chat.text.toLowerCase().includes('baru')) {
					const question =
						'Silakan masukkan nama lengkap, tempat lahir, dan tanggal lahir (format: Nama|Tempat Lahir|dd-mm-yyyy):';

					if (!hasAnswered(chat.senderId, nextStage)) break;

					recordAnswer(chat.senderId, session.currentStage, 'lama');

					chat.replay({
						text: question,
					});

					initializingQuestion(
						chat.senderId,
						nextStage,
						getNextStage(nextStage),
						question,
						null
					);
				}

				break;
			}

			break;

		case 'CHECK_STATUS':
			break;
		// if (chat.text.toLowerCase().includes('lama')) {
		// 	recordAnswer(
		// 		chat.senderId,
		// 		'OLD_PATIENT_VERIFY',
		// 		'Status Pasien',
		// 		'lama'
		// 	);

		// 	if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// 	chat.replay({
		// 		text: 'Silakan masukkan nomor rekam medis atau NIK dan tanggal lahir (format: NIK|dd-mm-yyyy):',
		// 	});
		// } else if (chat.text.toLowerCase().includes('baru')) {
		// 	recordAnswer(
		// 		chat.senderId,
		// 		'NEW_PATIENT_BASIC',
		// 		'Status Pasien',
		// 		'baru'
		// 	);

		// 	if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// 	chat.replay({
		// 		text: 'Silakan masukkan nama lengkap, tempat lahir, dan tanggal lahir (format: Nama|Tempat|dd-mm-yyyy):',
		// 	});
		// } else {
		// 	if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// 	chat.replay({
		// 		text: 'Apakah Anda pasien *lama* atau *baru*?',
		// 	});
		// }

		case 'OLD_PATIENT_VERIFY':
			break;

		// recordAnswer(
		// 	chat.senderId,
		// 	'IDENTITY_FORM',
		// 	'Verifikasi Pasien Lama',
		// 	chat.text
		// );

		// if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// chat.replay({
		// 	text: 'Data Anda diverifikasi. Silakan lengkapi data identitas. Masukkan NIK dan Kontak (format: NIK|081234xxxx):',
		// });

		case 'NEW_PATIENT_BASIC':
			break;

		// recordAnswer(
		// 	chat.senderId,
		// 	'IDENTITY_FORM',
		// 	'Data Pasien Baru',
		// 	chat.text
		// );

		// if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// chat.replay({
		// 	text: 'Terima kasih. Sekarang masukkan NIK dan Kontak (format: NIK|081234xxxx):',
		// });

		default:
			break;
		// if (!hasAnswered(chat.senderId, session.currentStage)) break;

		// chat.replay({
		// 	text: 'Silakan mulai ulang dengan mengetik "./mulai".',
		// });
	}
}
