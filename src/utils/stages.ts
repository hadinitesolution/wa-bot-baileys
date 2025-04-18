import { RegistrationStage } from 'types/stage';

const LIST_STAGES = [
	'INITIALIZING',
	'CHECK_STATUS',
	'OLD_PATIENT_VERIFY',
	'NEW_PATIENT_BASIC',
	'IDENTITY_FORM',
	'PAYMENT_METHOD',
	'BPJS_REFERRAL',
	'VISIT_SCHEDULE',
	'DOCTOR_SELECTION',
	'CONFIRMATION',
	'DONE',
];

const stagesConverter = (stages: RegistrationStage): number => {
	return LIST_STAGES.findIndex((stage) => stage === stages);
};

const getNextStage = (stages: RegistrationStage): RegistrationStage => {
	const currentStageIndex = LIST_STAGES.findIndex((stage) => stage === stages);
	return LIST_STAGES[currentStageIndex + 1] as RegistrationStage;
};

const getCurrentStage = (stages: RegistrationStage): string | undefined => {
	return LIST_STAGES.find((stage) => stage === stages);
};

export { stagesConverter, getNextStage, getCurrentStage };
