import { Elysia, t } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .get("/", () => "Hello Elysia + Drizzle + MySQL!")
  
  // Get all users
  .get("/users", async () => {
    return await db.select().from(users);
  })
  
  // Create a user
  .post("/users", async ({ body }) => {
    const result = await db.insert(users).values(body);
    return { success: true, id: result[0].insertId };
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      bio: t.Optional(t.String()),
    })
  })
  
  // Get user by ID
  .get("/users/:id", async ({ params: { id } }) => {
    const result = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return result[0] || { error: "User not found" };
  })
  
  // Update user
  .put("/users/:id", async ({ params: { id }, body }) => {
    await db.update(users).set(body).where(eq(users.id, parseInt(id)));
    return { success: true };
  }, {
    body: t.Partial(t.Object({
      name: t.String(),
      email: t.String(),
      bio: t.String(),
    }))
  })
  
  // Delete user
  .delete("/users/:id", async ({ params: { id } }) => {
    await db.delete(users).where(eq(users.id, parseInt(id)));
    return { success: true };
  })

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
