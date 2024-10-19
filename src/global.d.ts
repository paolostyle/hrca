/// <reference types="@solidjs/start/env" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NITRO_DB_URL: string;
    readonly NITRO_UUID_NAMESPACE: string;
  }
}
