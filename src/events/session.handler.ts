import fs from 'fs';
import path from 'path';
import { PatientSession } from 'types/session';
import { RegistrationStage } from 'types/stage';

const SESSIONS_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(SESSIONS_DIR)) {
	fs.mkdirSync(SESSIONS_DIR);
}

function getSessionFilePath(senderId: string): string {
	return path.join(SESSIONS_DIR, `${senderId}.json`);
}

function loadSessions(senderId: string): PatientSession | null {
	const filePath = getSessionFilePath(senderId);
	if (fs.existsSync(filePath)) {
		const data = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(data);
	}
	return null;
}

function saveSessions(senderId: string, session: PatientSession): void {
	const filePath = getSessionFilePath(senderId);
	fs.writeFileSync(filePath, JSON.stringify(session, null, 2), 'utf-8');
}

export function incrementRetry(senderId: string): number {
	const session = getSession(senderId);
	session.retryCount = (session.retryCount || 0) + 1;
	session.updatedAt = new Date().toISOString();
	saveSessions(senderId, session);

	return session.retryCount;
}

export function resetRetry(senderId: string) {
	const session = getSession(senderId);
	session.retryCount = 0;
	session.updatedAt = new Date().toISOString();
	saveSessions(senderId, session);
}

export function resetSession(senderId: string): PatientSession {
	const now = new Date().toISOString();
	const phoneNumber = senderId.split('@')[0];
	const session: PatientSession = {
		senderId,
		phoneNumber,
		currentStage: 'INITIALIZING',
		answers: [],
		createdAt: now,
		updatedAt: now,
	};

	saveSessions(senderId, session);
	return session;
}

export function getSession(senderId: string): PatientSession {
	const existing = loadSessions(senderId);
	if (existing) return existing;

	const now = new Date().toISOString();
	const phoneNumber = senderId.split('@')[0];
	const session: PatientSession = {
		senderId,
		phoneNumber: phoneNumber,
		currentStage: 'INITIALIZING',
		answers: [],
		createdAt: now,
		updatedAt: now,
	};

	saveSessions(senderId, session);
	return session;
}

export function hasAnswered(
	senderId: string,
	stage: RegistrationStage
): boolean {
	const session = getSession(senderId);
	return session.answers.some((answer) => answer.stage === stage);
}

export function recordAnswer(
	senderId: string,
	// next: RegistrationStage,
	stage: RegistrationStage,
	// question: string,
	answer: string | null
): PatientSession {
	const now = new Date().toISOString();
	const session = getSession(senderId);

	const answerToUpdate = session.answers.find((a) => a.stage === stage);

	if (answerToUpdate) {
		answerToUpdate.answer = answer;
		answerToUpdate.timestamp = now;
	}

	// session.answers.push({
	// 	stage: next,
	// 	question,
	// 	answer: answer,
	// 	timestamp: now,
	// });

	session.currentStage = stage;
	session.updatedAt = now;

	saveSessions(senderId, session);
	return session;
}

export function initializingQuestion(
	senderId: string,
	next: RegistrationStage,
	stage: RegistrationStage,
	question: string,
	answer: string | null
): PatientSession {
	const now = new Date().toISOString();
	const session = getSession(senderId);

	session.answers.push({
		stage: next,
		question,
		answer: answer,
		timestamp: now,
	});

	session.currentStage = stage;
	session.updatedAt = now;

	saveSessions(senderId, session);
	return session;
}
