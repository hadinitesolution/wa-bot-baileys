const RegistrationStage = {
    START: 'start_registration',
    EMAIL_ENTERED: 'email_entered',
    EMAIL_VERIFIED: 'email_verified',
    PASSWORD_CREATED: 'password_created',
    PROFILE_COMPLETED: 'profile_completed',
    REGISTRATION_COMPLETED: 'registration_completed',
  };

  const RegistrationStatus = {
    INITIATED: 'initiated',
    IN_PROGRESS: 'in_progress',
    SUCCESS: 'success',
    FAILED: 'failed',
  };

  module.exports = {
    RegistrationStage,
    RegistrationStatus,
  };
