import {
	getContentType,
	isJidBroadcast,
	isJidGroup,
	isJidNewsletter,
	isJidUser,
	jidDecode,
	jidNormalizedUser,
} from 'baileys';
import cases from '../cases.js';

export default function messagesUpsert(bot, m) {
	if (!m.message) return;

	m.id = m.key.id;
	m.chatId = m.key.remoteJid;
	m.isFromMe = m.key.fromMe;
	m.isGroup = isJidGroup(m.chatId);
	m.isPrivate = isJidUser(m.chatId);
	m.isStory = isJidBroadcast(m.chatId);
	m.isNewsletter = isJidNewsletter(m.chatId);
	m.senderId = m.isNewsletter
		? ''
		: m.isGroup || m.isStory
		? m.key.participant || jidNormalizedUser(m.participant)
		: m.key.remoteJid;
	m.isOwner = jidDecode(m.senderId).user === global.owner.number;
	m.type = getContentType(m.message);
	m.body =
		m.type === 'conversation'
			? m.message.conversation
			: m.message[m.type].caption ||
			  m.message[m.type].text ||
			  m.message[m.type].singleSelectReply?.selectedRowId ||
			  m.message[m.type].selectedButtonId ||
			  (m.message[m.type].nativeFlowResponseMessage?.paramsJson
					? JSON.parse(m.message[m.type].nativeFlowResponseMessage.paramsJson)
							.id
					: '') ||
			  '';
	m.text =
		m.type === 'conversation'
			? m.message.conversation
			: m.message[m.type].caption ||
			  m.message[m.type].text ||
			  m.message[m.type].contentText ||
			  m.message[m.type].description ||
			  m.message[m.type].title ||
			  m.message[m.type].selectedDisplayText ||
			  '';
	m.isCommand = m.body.trim().startsWith(global.bot.prefix);
	m.command = m.isCommand
		? m.body
				.trim()
				.normalize('NFKC')
				.replace(global.bot.prefix, '')
				.split(' ')[0]
				.toLowerCase()
		: '';
	m.args = m.isCommand
		? m.body
				.trim()
				.replace(/^\S*\b/g, '')
				.split(global.bot.splitArgs)
				.map((arg) => arg.trim())
				.filter((arg) => arg)
		: [];
	m.replay = async (msg) => await bot.sendMessage(m.chatId, { ...msg });

	return cases(bot, m);
}
