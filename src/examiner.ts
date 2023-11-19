import { Choice, Question } from './model';
import { FG_GREEN, FG_RED } from './constants';
import checkbox, { Separator as CheckboxSeparator } from '@inquirer/checkbox';
import select, { Separator as SelectSeparator } from '@inquirer/select';

import { QuestionType } from './model';
import confirm from '@inquirer/confirm';

type Option = {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

export type Result = {
  stopTraining: boolean;
  correctAnswer?: boolean;
};

const PAUSE_TRAINING: Option = { name: 'Pause training', value: 'pause' };

export class Examiner {
  private async feedback(question: Question, answer: string | Array<string>): Promise<boolean> {
    let isCorrect: boolean = true;
    console.info('');
    if (question.isCorrect(answer)) {
      console.info(`${FG_GREEN}CORRECT!!!`);
    } else {
      if (question.questionType === QuestionType.SINGLE_CHOICE) {
        console.info(`${FG_RED}INCORRECT. Correct answer is: ${question.correctAnswer[0]}`);
      } else {
        console.info(`${FG_RED}Correct answer are:`);
        question.correctAnswer.forEach((a: string) => {
          console.info(`  ${a}`);
        });
      }
      isCorrect = false;
    }
    console.info('');
    await confirm({ message: '', default: true });
    console.info('\n--------------------------------------------------------------------------------');
    return isCorrect;
  }

  private async getResult(question: Question, answer: string | Array<string>): Promise<Result> {
    if (answer.includes('pause')) return { stopTraining: true };

    return {
      stopTraining: false,
      correctAnswer: await this.feedback(question, answer),
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
      clearPromptOnDone: true,
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
      clearPromptOnDone: true,
    });
    return this.getResult(question, answer);
  }

  public async ask(question: Question): Promise<Result> {
    return question.questionType === QuestionType.SINGLE_CHOICE ? this.askSelect(question) : this.askCheckbox(question);
  }
}
