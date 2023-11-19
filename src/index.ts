import { Assessment } from './assessment';
import { Option } from './model';
import fs from 'fs';
import path from 'path';
import select from '@inquirer/select';

const EXT: string = '.qns';

(async (): Promise<void> => {
  const choices: Array<Option> = fs
    .readdirSync(process.cwd())
    .filter((fileName: string) => fileName.endsWith(EXT) && !fileName.startsWith('~'))
    .map((fileName: string) => ({
      name: `${fileName.substring(0, fileName.lastIndexOf(EXT)).replaceAll('-', ' ')} (NEW)`,
      value: fileName,
    }));

  for (let i: number = choices.length - 1; i >= 0; i--) {
    const choice: Option = choices[i];
    const started: string = `~${choice.value}`;
    if (choice.value[0] !== '~' && fs.existsSync(path.join(process.cwd(), started))) {
      choices.splice(i + 1, 0, {
        name: `${choice.name.substring(0, choice.name.length - 6)} (CONTINUE...)`,
        value: started,
      });
    }
  }

  console.debug(JSON.stringify(choices));

  const fileName: string = await select({
    message: 'Select a collection',
    choices,
  });

  await new Assessment(fileName).start();

  console.info('\nCome back soon!');
})();
