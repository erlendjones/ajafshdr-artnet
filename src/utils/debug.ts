import chalk from "chalk";
let enabled = true;

export default function (title: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...log: any[]) => {
    if (enabled) {
      const TAG = chalk.yellow(`[${title}]`);
      const unixTimestamp = Date.now();
      // unix timestamp to HH:MM:SS.ms
      const timestamp =
        new Date(unixTimestamp).toISOString().substr(11, 8) +
        "." +
        unixTimestamp.toString().substr(unixTimestamp.toString().length - 3, 3);

      console.log(`${timestamp} ${TAG}`, ...log);
    }
  };
}
