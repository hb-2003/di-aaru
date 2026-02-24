import "reflect-metadata";
import { DataSource, PrimaryGeneratedColumn } from "typeorm"; // PrimaryGeneratedColumn added
import * as dotenv from "dotenv";
import { Product } from "./models/Product";
import { Page } from "./models/Page";
import { PageSection } from "./models/PageSection";
import { Global } from "./models/Global";
import { About } from "./models/About";
import { AboutBlock } from "./models/AboutBlock";
import { Media } from "./models/Media";
import { Article } from "./models/Article";
import { Author } from "./models/Author";
import { Category } from "./models/Category";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  synchronize: process.env.NODE_ENV === "development", // Set to false in production
  logging: process.env.NODE_ENV === "development",
  entities: [
    Product,
    Page,
    PageSection,
    Global,
    About,
    AboutBlock,
    Media,
    Article,
    Author,
    Category,
  ],
  migrations: process.env.NEXT_RUNTIME
    ? [] // Skip migrations in Next.js runtime (Turbopack can't resolve globs)
    : ["src/lib/db/migrations/*.ts"], // Only load via CLI (tsx)
  subscribers: [],
  ssl: process.env.DATABASE_SSL === "true" ? {
    rejectUnauthorized: false
  } : false,
});

let initializationPromise: Promise<DataSource> | null = null;
let initializationError: Error | null = null;
let hasLoggedInitializationError = false;

// Initialize once per process and surface failures consistently.
export const initializeDatabase = async () => {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (initializationError) {
    throw initializationError;
  }

  if (!initializationPromise) {
    initializationPromise = AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
        return AppDataSource;
      })
      .catch((err: unknown) => {
        initializationError = err instanceof Error ? err : new Error(String(err));
        if (!hasLoggedInitializationError) {
          console.error("Error during Data Source initialization", initializationError);
          hasLoggedInitializationError = true;
        }
        throw initializationError;
      });
  }

  return initializationPromise;
};
