export class ProgressBar {
  private readonly total: number;
  private current: number = 0;

  private readonly COMPLETE: string = '\u2588';
  private readonly INCOMPLETE: string = '\u2591';
  private percentage: number = 0;

  public constructor(total: number) {
    this.total = total;
  }

  private getBar(): string {
    let result: string = '';

    for (let i = 1; i <= 50; i++) {
      result += this.percentage < i * 2 ? this.INCOMPLETE : this.COMPLETE;
    }

    return result;
  }

  public update(current: number): void {
    this.current = current;
    this.percentage = Math.floor((100 * this.current) / this.total);
  }

  public toString(): string {
    return `${this.getBar()} ${this.percentage}% (${this.current}/${this.total})`;
  }
}
