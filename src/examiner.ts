import { Choice, Option, Question } from './model';
import { FG_GREEN, FG_RED, I18n } from './constants';
import checkbox, { Separator as CheckboxSeparator } from '@inquirer/checkbox';
import select, { Separator as SelectSeparator } from '@inquirer/select';

import { QuestionType } from './model';
import confirm from '@inquirer/confirm';

export type Result = {
  stopTraining: boolean;
  retryQuestion: boolean;
};

const PAUSE: string = 'pause';
const PAUSE_TRAINING: Option = { name: I18n.PAUSE, value: PAUSE };
const DIVIDER: string = '\n--------------------------------------------------------------------------------';

export class Examiner {
  private async feedback(question: Question, answer: string | Array<string>): Promise<boolean> {
    let retryQuestion: boolean = true;
    console.info('');
    if (question.isCorrect(answer)) {
      console.info(`${FG_GREEN}${I18n.CORRECT}\n`);
      retryQuestion = await confirm({ message: I18n.RETRY_QUESTION, default: false });
    } else {
      if (question.questionType === QuestionType.SINGLE_CHOICE) {
        console.info(`${FG_RED}${I18n.INCORRECT_SINGLE} ${question.correctAnswer[0]}\n`);
      } else {
        console.info(`${FG_RED}${I18n.INCORRECT_MULTIPLE}`);
        question.correctAnswer.forEach((a: string) => {
          console.info(`  ${a}`);
        });
        console.info('');
      }
      await confirm({ message: I18n.RETRY_STATEMENT, default: true });
    }
    console.info(DIVIDER);
    return retryQuestion;
  }

  private async getResult(question: Question, answer: string | Array<string>): Promise<Result> {
    if (answer.includes(PAUSE)) return { stopTraining: true, retryQuestion: true };

    return {
      stopTraining: false,
      retryQuestion: await this.feedback(question, answer),
    };
  }

  private async askSelect(question: Question): Promise<Result> {
    const choices: Array<Option | SelectSeparator> = question.choices.map((choice: Choice) => ({
      name: choice.text,
      value: choice.text,
    }));
    choices.push(new SelectSeparator());
    choices.push(PAUSE_TRAINING);
    const answer: string = await select({
      message: question.statement,
      choices,
      loop: false,
      pageSize: 13,
    });
    return this.getResult(question, answer);
  }

  private async askCheckbox(question: Question): Promise<Result> {
    const choices: Array<Option | CheckboxSeparator> = question.choices.map((choice: Choice) => ({
      name: choice.text,
      value: choice.text,
    }));
    choices.push(new CheckboxSeparator());
    choices.push(PAUSE_TRAINING);
    const answer: Array<string> = await checkbox({
      message: question.statement,
      choices,
      required: true,
      loop: false,
      pageSize: 13,
    });
    return this.getResult(question, answer);
  }

  public async ask(question: Question): Promise<Result> {
    return question.questionType === QuestionType.SINGLE_CHOICE ? this.askSelect(question) : this.askCheckbox(question);
  }
}
