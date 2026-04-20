import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import connectDB from "./database.js";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

await connectDB();

app.use(cors());
app.use(express.json());

const server = new ApolloServer({
  typeDefs,
  resolvers
});

await server.start();

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => {
      const authHeader =
        req.headers.authorization || req.headers.Authorization || "";

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        return { user: null };
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        return { user };
      } catch (error) {
        return { user: null };
      }
    }
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});