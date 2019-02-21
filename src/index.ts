import { Generator } from './Generator/generator';

Generator.Generate('https://mastaq.sharepoint.com/sites/dev/test', './config.json', {} as any)
  .then((data: any) => {
    console.log(data);
  })
  .catch((err: any) => {
    throw err;
  });
