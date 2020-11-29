interface ILogger {
  log(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

const isDevelopmentMode = process.env.NODE_ENV === "development";

const Logger: ILogger = {
  log(message, optionalParams) {
    if (isDevelopmentMode) console.log(message, optionalParams);
  },

  error(message, optionalParams) {
    console.error(message, optionalParams);
  },
};

export { Logger };
