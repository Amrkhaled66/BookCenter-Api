

// "MONGO_URL"
const requiredVars = ["PORT"];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
});

export default {
  MONGO_URL: process.env.MONGO_URL,
  PORT: process.env.PORT ||3000 ,
};
