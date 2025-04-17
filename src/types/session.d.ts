export interface PatientAnswer {
	stage: RegistrationStage;
	question: string;
	answer: string | null;
	timestamp: string;
}

export interface PatientSession {
	senderId: string;
	phoneNumber: string;
	currentStage: RegistrationStage;
	statusPasien?: StatusPasien;
	answers: PatientAnswer[];
	retryCount?: number;
	createdAt: string;
	updatedAt: string;
}
