import { Elysia, t } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

export const usersRoute = new Elysia()
  .post(
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
  )
  .post(
    "/api/users/login",
    async ({ body, set }) => {
      try {
        const result = await loginUser(body);
        return {
          status: "success",
          message: "User logged in successfully",
          data: result,
        };
      } catch (error: any) {
        set.status = 401;
        return {
          status: "error",
          message: error.message || "Invalid credentials",
          data: null,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  );
