const redis = require("redis");
const Redis = require("ioredis");

const redisClient = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});

const redisClientPublic = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
// const redisChannel = "iot_farm";
// redisClient.subscribe(redisChannel, (err, count) => {
//   if (err) {
//     console.error("Failed to subscribe: %s", err.message);
//   } else {
//     console.log(
//       `Subscribed successfully! This client is currently subscribed to ${count} channels.`
//     );
//   }
// });

module.exports = redisClient;
