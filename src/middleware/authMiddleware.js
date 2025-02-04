import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const expectedAuth = `Basic ${Buffer.from(`${user}:${password}`).toString(
    "base64"
  )}`;

  if (!authHeader || authHeader !== expectedAuth) {
    return res.status(401).json({ mensagem: `Não autorizado` });
  }
  next();
};

export default auth;
