import { Assessment } from './assessment';
import fs from 'fs';
import select from '@inquirer/select';

const EXT: string = '.qns';

(async (): Promise<void> => {
  const fileName: string = await select({
    message: 'Select a collection',
    choices: fs
      .readdirSync(process.cwd())
      .filter((fileName: string) => fileName.endsWith(EXT))
      .map((fileName: string) => ({
        name: fileName.substring(0, fileName.lastIndexOf(EXT)).replaceAll('-', ' '),
        value: fileName,
      })),
  });

  const assessment: Assessment = new Assessment(fileName);

  await assessment.start();

  console.info('\nCome back soon!');
})();
