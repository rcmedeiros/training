import { Choice } from './choice';
import { I18n } from '../constants';
import { QuestionType } from './question_type';
import { Shuffler } from '../shuffler';

export class Question {
  private readonly _index: number;
  private readonly _statement: string = '';
  private readonly _questionType: QuestionType = QuestionType.SINGLE_CHOICE;
  private readonly _choices: Array<Choice> = [];
  private readonly _bottomChoices: Array<Choice> = [];
  private readonly _correctAnswer: Array<string>;

  public constructor(text: string, index: number) {
    this._index = index;
    const lines: Array<string> = text.split('\n');

    while (lines[0].trim()[0] !== '[') {
      this._statement += `${lines.shift()?.trim()}\n`;
    }

    while (lines.length) {
      const line: string = lines?.shift()?.trim();
      if (line) {
        const choice: Choice = new Choice(line);
        if (choice.text.includes(I18n.OF_THE_ABOVE)) {
          this._bottomChoices.push(choice);
        } else {
          this._choices.push(choice);
        }
      }
    }

    this._correctAnswer = this._choices.concat(this._bottomChoices).filter((c: Choice) => c.isCorrect).map((c: Choice) => c.text);

    if (this._correctAnswer.length > 1 || this._choices.some((c: Choice) => c.text.toLowerCase().includes(I18n.OF_THE_ABOVE))) {
      this._questionType = QuestionType.MULTIPLE_CHOICE;
    }
  }

  public isCorrect(answer: string | Array<string>): boolean {
    const submitted: Array<string> = typeof answer === 'string' ? [answer] : answer;
    return submitted.length === this.correctAnswer.length && submitted.every((a: string) => this.correctAnswer.includes(a));
  }

  public get statement(): string {
    return this._statement;
  }

  public get questionType(): QuestionType {
    return this._questionType;
  }

  public get choices(): Array<Choice> {
    Shuffler.shuffle<Choice>(this._choices);
    return this._choices.concat(this._bottomChoices);
  }

  public get correctAnswer(): Array<string> {
    return this._correctAnswer;
  }

  public get index(): number {
    return this._index;
  }
}
