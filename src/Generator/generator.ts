import { AuthConfig } from 'node-sp-auth-config';
import { removeSlashes } from '../Common/utils';
import { Config } from '../Interfaces/config';
import { SpService } from '../Common/spService';
import { DataFilter } from '../Filters/dataFilter';

export class Generator {
    public static async Generate(siteUrl: string, authConfigPath: string, config: Config): Promise<any> {

          let spService = new SpService(authConfigPath, siteUrl);
          let listFilter = new DataFilter(spService);

          let lists = await spService.getLists();
          let webRelativeUrl = await spService.getWebServerRelativeUrl();
          console.log(lists);
    }
}
