// @ts-check
import { clientEnv, clientSchema } from './schema.mjs';

const clientEnvParsed = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        // eslint-disable-next-line no-underscore-dangle
        return `${name}: ${value._errors.join(', ')}\n`;
      return null;
    })
    .filter(Boolean);

if (clientEnvParsed.success === false) {
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(clientEnvParsed.error.format()),
  );
  throw new Error('Invalid environment variables');
}

/**
 * Validate that client-side environment variables are exposed to the client.
 */
Object.keys(clientEnvParsed.data).forEach((key) => {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    console.warn('❌ Invalid public environment variable name:', key);

    throw new Error('Invalid public environment variable name');
  }
});

export const env = clientEnvParsed.data;
