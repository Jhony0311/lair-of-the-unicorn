import Raven from 'raven-js';

const sentry_key = 'b1ce26b37bc346b8a3e64b0b28344780';
const sentry_app = '96169';
export const sentry_url = `https://${sentry_key}@app.getsentry.com/${sentry_app}`;

export function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });
  /*eslint no-console:0*/
  window && window.console && console.error && console.error(ex);
}
