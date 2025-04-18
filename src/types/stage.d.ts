export type RegistrationStage =
	| 'INITIALIZING'
	| 'CHECK_STATUS'
	| 'OLD_PATIENT_VERIFY'
	| 'NEW_PATIENT_BASIC'
	| 'IDENTITY_FORM'
	| 'PAYMENT_METHOD'
	| 'BPJS_REFERRAL'
	| 'VISIT_SCHEDULE'
	| 'DOCTOR_SELECTION'
	| 'CONFIRMATION'
	| 'DONE';

export type StatusPasien = 'lama' | 'baru';

export interface PatientRegistrationState {
	phoneNumber: string; // WhatsApp number as session ID
	currentStage: RegistrationStage;

	// All form-related data below
	statusPasien?: 'lama' | 'baru';

	// Stage: OLD_PATIENT_VERIFY or NEW_PATIENT_BASIC
	noRekamMedis?: string;
	nik?: string;
	tanggalLahir?: string;
	namaLengkap?: string;
	tempatLahir?: string;

	// Stage: IDENTITY_FORM
	kontak?: string;

	// Stage: PAYMENT_METHOD
	metodePembayaran?: 'umum' | 'asuransi' | 'bpjs';
	nomorBpjs?: string;
	rujukanList?: BPJSRujukan[];
	nomorRujukan?: string;

	// Stage: VISIT_SCHEDULE
	tanggalKunjungan?: string;
	loketAntrian?: string;
	poliAntrian?: string;

	// Stage: DOCTOR_SELECTION
	dokterDipilih?: string;

	// Stage: CONFIRMATION
	isConfirmed?: boolean;

	// System-generated
	nomorAntrian?: string;
}

export interface BPJSRujukan {
	nomor: string;
	asalFaskes: string;
	poliTujuan: string;
	diagnosa: string;
}
