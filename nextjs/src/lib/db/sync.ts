import "reflect-metadata";
import { AppDataSource } from "./config";

async function sync() {
  try {
    console.log("⏳ Synchronizing database schema...");
    await AppDataSource.initialize();

    // This will create the tables based on the entities
    await AppDataSource.synchronize(false);

    console.log("✅ Database schema synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
    process.exit(1);
  }
}

sync();
