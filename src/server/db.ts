import { CamelCasePlugin, Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';
import type { HospitalData } from '~/types';

interface Database {
  hospitals: HospitalData;
}

export const db = new Kysely<Database>({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.NITRO_DB_URL),
  }),
  plugins: [new CamelCasePlugin()],
});
