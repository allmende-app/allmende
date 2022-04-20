import Winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

Winston.addColors(colors);

const format = Winston.format.combine(
  Winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  Winston.format.colorize({ all: true }),
  Winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  new Winston.transports.Console(),
  new Winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new Winston.transports.File({ filename: "logs/all.log" }),
];

export const Logger = Winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
