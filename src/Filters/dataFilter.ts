import { ListSetting } from '../Interfaces/listSetting';
import { SpService } from '../Common/spService';
import { Entity } from '../Interfaces/output/entity';

export class DataFilter {
    constructor(private service: SpService) {}

    public async filterLists(listSettings?: ListSetting[]): Promise<Entity[]> {
        if (!listSettings || listSettings.length === 0) {
            return null;
        }
        let lists = await this.service.getLists();
        // let serverRelativeUrl = await this.service.getWebServerRelativeUrl();

        let entities: Entity[] = [];

        lists.forEach(l => {
            entities.push({
                name: l.Title,
                fields: []
            });
        });

        return entities;
    }
}
