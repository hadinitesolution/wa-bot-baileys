declare global {
	var bot: {
		name: string;
		number: string;
		version: string;
		prefix: string;
		splitArgs: string;
		locale: string;
		timezone: string;
		adsUrl: string;
		newsletterJid: string;
		commands: string[];
		setting: string;
		saveSetting: () => string;
	};

	var owner: {
		name: string;
		number: string | undefined;
	};

	var db: {
		user: any[];
		premium: any[];
		group: any[];
		save: (dbName: string) => void;
	};
}

export {};
