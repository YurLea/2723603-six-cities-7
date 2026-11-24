export type AppConfig = {
  port: number;
  dbHost: string;
  mongoUri: string;
  salt: string;
  sessionTtlSeconds: number;
  uploadDirectory: string;
};
