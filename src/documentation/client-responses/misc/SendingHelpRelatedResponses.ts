import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../bot";
import {Subcommands} from "../../commands/Subcommands";
import {Character} from "../../../entity/Character";
import {World} from "../../../entity/World";
import {Sending} from "../../../entity/Sending";
import {SendingController} from "../../../controllers/character/SendingController";

/**
 * Helps the sending command if something went wrong.
 */
export class SendingHelpRelatedResponses {
    /**
     * Message to show if the sending has no date.
     *
     * @param messageContents Original contents of the message.
     */
    static MESSAGE_HAS_NO_DATE(messageContents: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Message has no date!`)
            .setDescription(`Message has no date. Add message (in-game) date with ` +
                `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE} [day]/[month]/[year]\`.\n\n` +
                `Here is your original message with the added date parameter:\n` +
                `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE} [day]/[month]/[year]\`\`\``)
    }

    static CHECK_SENDINGS_FOR_WHICH (character: Character, world: World): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("Choose the which you'd like to see messages for.")
            .setDescription(`Reply with the given number to decide which you'd like to sendings for.\n` +
                `[\`1\`] (\`World    \`) ${world.name}\n` +
                `[\`2\`] (\`Character\`) ${character.name}\n`);
    }

    static NO_DEFAULT_WORLD_OR_CHARACTER (): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("You have no default world or character.")
            .setDescription("Can't fetch messages for no one or nothing!");
    }

    static PRINT_MESSAGES_FROM_WORLD (messages: Sending[], world: World, page: number): MessageEmbed {
        let messageStr = this.processMessages(messages, page, true, true);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to NPCs in ${world.name}`)
            .setDescription(`Here are the messages sent to NPCs in this world:\n\n${messageStr}`);
    }

    static PRINT_MESSAGES_TO_CHARACTER (messages: Sending[], character: Character, page: number): MessageEmbed {
        let messageStr = this.processMessages(messages, page, false, true);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to NPCs in ${character.name}`)
            .setDescription(`Here are the messages sent to NPCs in this world:\n\n${messageStr}`);
    }

    private static processMessages(messages: Sending[], page: number, includeTo: boolean, includeFrom: boolean): string {
        let additional = page * SendingController.SENDING_LIMIT;
        let str = "";
        let i, message: Sending;
        for (i = 0; i < messages.length; i++) {
            message = messages[i];
            str += `[\`${additional + i}\`] **GAME DATE:** ${message.inGameDate.day}/${message.inGameDate.month}/${message.inGameDate.year}\n`;
            if (includeFrom) {
                str += `\`FROM:\` ${message.fromPlayer != null ? message.fromPlayer.name : message.fromNpc.name}\n`;
            }
            if (includeTo) {
                str += `\`TO  :\` ${message.toPlayer != null ? message.toPlayer.name : message.toNpc.name}\n`;
            }
            str += `"${message.content}"\n\n`;
        }

        return str;
    }
}