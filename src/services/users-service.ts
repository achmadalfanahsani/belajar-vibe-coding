import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterUserData) {
  // 1. Cek apakah email sudah terdaftar
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email));

  if (existingUsers.length > 0) {
    throw new Error("User already exists");
  }

  // 2. Hash password menggunakan Bun.password
  const hashedPassword = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan ke database
  await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  // 4. Ambil data user yang baru saja dibuat
  const newUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.email, data.email));

  return newUsers[0];
}
