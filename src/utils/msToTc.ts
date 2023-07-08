import zeroPad from "zeropad";

export function msToTc(
  duration: number | null,
  padMilliseconds: boolean,
  asFrames: boolean
) {
  if (Number.isNaN(duration) || duration === null) {
    return "00:00:00.00";
  }

  let negativeFlag = false;
  if (duration < 0) {
    negativeFlag = true;
    duration = duration * -1;
  }
  let milliseconds = Math.floor((Math.floor(duration % 1000) / 1000) * 1000);
  const seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (padMilliseconds && !asFrames) {
    milliseconds = zeroPad(milliseconds, 3);
  }
  if (asFrames) {
    milliseconds = zeroPad(Math.floor(milliseconds / 25), 2);
  }

  const hours_str: string = (hours < 10 ? "0" + hours : hours) + "";
  const minutes_str: string = (minutes < 10 ? "0" + minutes : minutes) + "";
  const seconds_str: string = (seconds < 10 ? "0" + seconds : seconds) + "";

  return (
    (negativeFlag ? "-" : "") +
    hours_str +
    ":" +
    minutes_str +
    ":" +
    seconds_str +
    "." +
    milliseconds
  );
}
