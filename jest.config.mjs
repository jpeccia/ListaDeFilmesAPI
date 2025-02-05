import dotenv from "dotenv";
dotenv.config();

export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup.js"],
};
