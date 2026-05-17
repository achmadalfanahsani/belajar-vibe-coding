import { Elysia, t } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/users-service";

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
  )
  .get(
    "/api/users/current",
    async ({ headers, set }) => {
      try {
        const authorization = headers["authorization"];
        if (!authorization || !authorization.startsWith("Bearer ")) {
          throw new Error("User not found");
        }

        const token = authorization.substring(7);
        const currentUser = await getCurrentUser(token);

        return {
          status: "success",
          message: "User current",
          data: currentUser,
        };
      } catch (error: any) {
        set.status = 401;
        return {
          status: "error",
          message: error.message || "User not found",
          data: null,
        };
      }
    }
  )
  .get(
    "/api/users/logout",
    async ({ headers, set }) => {
      try {
        const authorization = headers["authorization"];
        if (!authorization || !authorization.startsWith("Bearer ")) {
          throw new Error("Token not found");
        }

        const token = authorization.substring(7);
        await logoutUser(token);

        return {
          status: "success",
          message: "Logout success",
          data: null,
        };
      } catch (error: any) {
        set.status = 401;
        return {
          status: "error",
          message: error.message || "Token not found",
          data: null,
        };
      }
    }
  );
