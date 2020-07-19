import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";

export class CharacterCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }
}