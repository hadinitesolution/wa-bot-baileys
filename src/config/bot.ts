import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));

global.bot = {
	name: pkg["author"],
	number: "",
	version: pkg["version"],
	prefix: "./",
	splitArgs: "|",
	locale: "id",
	timezone: "Asia/Makassar",
	adsUrl: "",
	newsletterJid: "",
	commands: await (async () => {
		return [];
	})(),
	setting: JSON.parse(fs.readFileSync("src/config/setting.json", "utf-8")),
	saveSetting: function () {
		fs.writeFileSync(
			"src/config/setting.json",
			JSON.stringify(global.bot.setting)
		);
		return global.bot.setting;
	},
};

global.owner = {
	name: pkg["author"],
	number: process.env.OWNER_CONTACT,
};

global.db = {
	user: [],
	premium: [],
	group: [],
	save: async function (dbName) {},
};
