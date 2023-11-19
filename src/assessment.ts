import { Examiner, Result } from './examiner';

import { ProgressBar } from './progress_bar';
import { Question } from './model';
import { RESET } from './constants';
import { Shuffler } from './shuffler';
import fs from 'fs';
import path from 'path';

export class Assessment {
  private readonly questions: Array<Question> = [];
  private readonly total: number;
  public constructor(fileName: string) {
    let content: string = fs.readFileSync(path.join(process.cwd(), fileName)).toString();
    content = content
      .replaceAll('\r\n', '\n')
      .replaceAll('\r', '\n')
      .replaceAll('[]', '[ ]')
      .replaceAll('[ x ]', '[X]')
      .replaceAll('[ X ]', '[X]')
      .replaceAll('[x]', '[X]');

    content.split('\n\n').forEach((question: string) => {
      question = question?.trim();
      if (question) {
        this.questions.push(new Question(question));
      }
    });
    this.total = this.questions.length;
  }

  public async start(): Promise<void> {
    Shuffler.shuffle(this.questions);

    const examiner: Examiner = new Examiner();

    const bar: ProgressBar = new ProgressBar(this.total);
    let next: boolean = true;
    while (next && this.questions.length) {
      process.stdout.write(RESET);
      const question: Question = this.questions.shift();
      console.info(`${bar}\n`);
      const { stopTraining, correctAnswer }: Result = await examiner.ask(question);
      next = !stopTraining;
      if (!correctAnswer) {
        this.questions.splice(Math.floor(Math.random() * (this.questions.length + 1)), 0, question);
      }

      bar.update(this.total - this.questions.length);
      console.clear();
    }
  }
}
