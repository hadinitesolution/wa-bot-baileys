import readline from 'readline';

export default function question(text:string = 'question'):Promise<string> {
	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		rl.question(`\x1b[32;1m?\x1b[0m\x20\x1b[1m${text}\x1b[0m`, (answer:string) => {
			rl.close();
			resolve(answer);
		});
	});
}
