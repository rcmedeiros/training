export class Shuffler {
  public static shuffle<T>(arr: Array<T>): void {
    let i: number = arr.length;
    let j: number;
    let temp: T;
    while (--i > 0) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
  }
}
