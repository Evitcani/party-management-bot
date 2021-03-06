import {injectable} from "inversify";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {CurrentDateDTO} from "mnemoshared/dist/src/dto/model/CurrentDateDTO";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";

@injectable()
export class CurrentDateController extends API<CurrentDateDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    public async getById(id: string): Promise<CurrentDateDTO> {
        return this.get(`/currentDates/${id}`).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get the current date.");
            console.error(err);
            return null;
        });
    }

    public async createNew(currentDate: CurrentDateDTO, party: PartyDTO): Promise<CurrentDateDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(currentDate);
        config.data = data;
        config.params = {
            party_id: party.id
        };

        return this.post(`/currentDates`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
            console.error(err);
            return null;
        });
    }

    public async save(currentDate: CurrentDateDTO): Promise<CurrentDateDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(currentDate);
        config.data = data;

        return this.put(`/currentDates/${currentDate.id}`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to update current date.");
            console.error(err);
            return null;
        });
    }
}