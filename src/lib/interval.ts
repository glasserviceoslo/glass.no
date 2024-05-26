export const useInterval = (callback: CallableFunction, interval: number): Interval => {
  return new Interval(callback, interval);
};

class Interval {
  private timer: number | null = null;

  constructor(
    private callback: CallableFunction,
    private interval: number,
  ) {}

  start() {
    this.timer = setInterval(this.callback, this.interval);
  }

  stop() {
    clearInterval(this.timer!);
    this.timer = null;
  }

  restart(interval = 0) {
    this.stop();

    if (interval) {
      this.interval = interval;
    }

    this.start();
  }
}
