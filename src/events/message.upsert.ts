import {
	AnyMessageContent,
	FullJid,
	getContentType,
	isJidBroadcast,
	isJidGroup,
	isJidNewsletter,
	isJidUser,
	jidDecode,
	jidNormalizedUser,
	proto,
	WASocket,
} from "baileys";
import cases from "../cases";
import { IChat } from "types/chat";

const messagesUpsert = (socket: WASocket, m: proto.IWebMessageInfo) => {
	if (!m.message) return;

	const chatId = m.key.remoteJid!;
	const isGroup = isJidGroup(chatId)!;
	const isNewsletter = isJidNewsletter(chatId)!;
	const isStory = isJidBroadcast(chatId)!;
	const senderId = isNewsletter
		? ""
		: isGroup || isStory
		? m.key.participant || jidNormalizedUser(m.participant ?? "")
		: chatId;
	const chatType = getContentType(m.message)!;
	const chatBody =
		chatType === "conversation"
			? m.message.conversation
			: (m.message[chatType as keyof proto.IMessage] as any)?.caption ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.text ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.singleSelectReply
					?.selectedRowId ||
			  (m.message[chatType as keyof proto.IMessage] as any)
					?.selectedButtonId ||
			  ((m.message[chatType as keyof proto.IMessage] as any)
					?.nativeFlowResponseMessage?.paramsJson
					? JSON.parse(
							(m.message[chatType as keyof proto.IMessage] as any)
								?.nativeFlowResponseMessage.paramsJson
					  ).id
					: "") ||
			  "";
	const chatText =
		chatType === "conversation"
			? m.message.conversation
			: (m.message[chatType as keyof proto.IMessage] as any)?.caption ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.text ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.contentText ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.description ||
			  (m.message[chatType as keyof proto.IMessage] as any)?.title ||
			  (m.message[chatType as keyof proto.IMessage] as any)
					?.selectedDisplayText ||
			  "";

	const isCommand = chatBody.trim().startsWith(global.bot.prefix);

	const chatData: IChat = {
		id: m.key.id,
		chatId: chatId,
		isFromMe: m.key.fromMe!,
		isGroup: isGroup,
		isPrivate: isJidUser(chatId)!,
		isStory: isStory,
		isNewsletter: isNewsletter,
		senderId: senderId,
		isOwner: (jidDecode(senderId) as FullJid).user === global.owner.number,
		type: chatType,
		body: chatBody,
		text: chatText,
		isCommand: isCommand,
		command: isCommand
			? chatBody
					.trim()
					.normalize("NFKC")
					.replace(global.bot.prefix, "")
					.split(" ")[0]
					.toLowerCase()
			: "",
		args: isCommand
			? chatBody
					.trim()
					.replace(/^\S*\b/g, "")
					.split(global.bot.splitArgs)
					.map((arg: string) => arg.trim())
					.filter((arg: string) => arg)
			: [],
		replay: async (msg: AnyMessageContent) =>
			await socket.sendMessage(chatId, { ...msg }),
	};

	return cases(chatData);
};

export default messagesUpsert;
