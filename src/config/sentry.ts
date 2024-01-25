type SentryConfigType = {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  release: string;
};

export const generateSentryConfig = (): SentryConfigType => {
  let SENTRY_ENVIRONMENT = 'development';
  let SENTRY_TRACE_SAMPLE_RATE = 1.0;
  switch (import.meta.env.MODE) {
    case 'production':
      SENTRY_ENVIRONMENT = 'production';
      SENTRY_TRACE_SAMPLE_RATE = 0.1;
      break;
    case 'test':
      SENTRY_TRACE_SAMPLE_RATE = 0.0;
      break;
    case 'development':
      SENTRY_TRACE_SAMPLE_RATE = 0.0;
      break;
    default:
  }

  return {
    dsn: (!window.Cypress && import.meta.env.SENTRY_DSN) || '',
    environment: SENTRY_ENVIRONMENT,
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
    release: import.meta.env.APP_VERSION || '',
  };
};
