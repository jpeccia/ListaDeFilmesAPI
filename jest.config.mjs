import dotenv from "dotenv";
dotenv.config();

export default {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
};
