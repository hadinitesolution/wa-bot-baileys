import { AnyMessageContent, proto } from "baileys";

export interface IChat {
	id: string | null | undefined;
	chatId: string;
	isFromMe: boolean;
	isGroup: boolean;
	isPrivate: boolean;
	isStory: boolean;
	isNewsletter: boolean;
	senderId: string;
	isOwner: boolean;
	type: keyof proto.IMessage | undefined;
	body: string;
	text: string;
	isCommand: boolean;
	command: string;
	args: string[];
	replay: (msg: AnyMessageContent) => Promise<any>;
}
