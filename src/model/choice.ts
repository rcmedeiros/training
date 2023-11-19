export class Choice {
  private readonly _text: string;
  private readonly _isCorrect: boolean;

  public constructor(text: string) {
    text = text.trim();
    this._isCorrect = text.substring(0, 3).toUpperCase() === '[X]';
    this._text = text.substring(3).trim();
  }

  public get isCorrect(): boolean {
    return this._isCorrect;
  }

  public get text(): string {
    return this._text;
  }
}
