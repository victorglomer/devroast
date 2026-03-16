import { db } from "./index";
import { users } from "./schema";

async function seed() {
  await db.insert(users).values({ username: "victorvhvhvh" });
  console.log("Seed completed!");
}

seed();
