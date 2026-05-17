import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service";

export const usersRoute = new Elysia().post(
  "/api/users",
  async ({ body, set }) => {
    try {
      const newUser = await registerUser(body);
      return {
        status: "success",
        message: "User created successfully",
        data: newUser,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        status: "error",
        message: error.message || "Something went wrong",
        data: null,
      };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
  }
);
