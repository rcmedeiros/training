import { Assessment } from './assessment';
import { I18n } from './constants';
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
      name: `${fileName.substring(0, fileName.lastIndexOf(EXT)).replaceAll(/[_-]/g, ' ')} ${I18n.NEW}`,
      value: fileName,
    }));

  for (let i: number = choices.length - 1; i >= 0; i--) {
    const choice: Option = choices[i];
    const started: string = `~${choice.value}`;
    if (choice.value[0] !== '~' && fs.existsSync(path.join(process.cwd(), started))) {
      choices.splice(i, 0, {
        name: `${choice.name.substring(0, choice.name.length - I18n.NEW_LENGTH - 1)} ${I18n.CONTINUE}`,
        value: started,
      });
    }
  }

  const fileName: string = await select({
    message: I18n.SELECT_A_COLLECTION,
    choices,
  });

  await new Assessment(fileName).start();
})();
