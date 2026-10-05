import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { registerInitialAdmin } from "../services/admin/adminAuth.service.js";

const required = ["ADMIN_EMAIL", "ADMIN_PASSWORD"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const run = async () => {
  await connectDB();

  const admin = await registerInitialAdmin({
    firstName: process.env.ADMIN_FIRST_NAME || "Niramaya",
    lastName: process.env.ADMIN_LAST_NAME || "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: process.env.ADMIN_ROLE || "super_admin",
  });

  console.log(`Initial admin created: ${admin.email}`);
  process.exit(0);
};

run().catch((error) => {
  console.error("Admin seed failed:", error.message);
  process.exit(1);
});
