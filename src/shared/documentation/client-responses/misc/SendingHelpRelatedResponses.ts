import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {SendingController} from "../../../../backend/controllers/character/SendingController";
import {messageResponse} from "../../messages/MessageResponse";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {WorldDTO} from "mnemoshared/dist/src/dto/model/WorldDTO";
import {SendingDTO} from "mnemoshared/dist/src/dto/model/SendingDTO";
import {EncryptionUtility} from "mnemoshared/dist/src/utilities/EncryptionUtility";
import {NicknameDTO} from "mnemoshared/dist/src/dto/model/NicknameDTO";

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
            .setTitle(messageResponse.sending.error.no_date.title())
            .setDescription(messageResponse.sending.error.no_date.desc(messageContents))
    }

    static MESSAGE_HAS_NO_CONTENT(messageContents: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(messageResponse.sending.error.no_message.title())
            .setDescription(messageResponse.sending.error.no_message.desc(messageContents))
    }

    static CHECK_SENDINGS_FOR_WHICH (character: CharacterDTO, world: WorldDTO): MessageEmbed {
        let name: NicknameDTO = (character.nicknames == null || character.nicknames.length <= 0) ?
            null : character.nicknames[0];

        return BasicEmbed.get()
            .setTitle("Choose the which you'd like to see messages for.")
            .setDescription(`Reply with the given number to decide which you'd like to sendings for.\n` +
                `[\`1\`] (\`World    \`) ${world.name}\n` +
                `[\`2\`] (\`Character\`) ${name.name}\n`);
    }

    static NO_DEFAULT_WORLD_OR_CHARACTER (): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("You have no default world or character.")
            .setDescription("Can't fetch messages for no one or nothing!");
    }

    static PRINT_MESSAGES_FROM_WORLD (messages: SendingDTO[], world: WorldDTO, page: number, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessages(messages, page, true, true, false, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to NPCs in ${world.name}`)
            .setDescription(`Here are the messages sent to NPCs in this world:\n\n${messageStr}`)
            .setFooter(BasicEmbed.getPageFooter(page, SendingController.SENDING_LIMIT, (messages == null? 0 : messages.length)));
    }

    static PRINT_MESSAGES_TO_CHARACTER (messages: SendingDTO[], character: CharacterDTO, page: number, encryptionUtility: EncryptionUtility): MessageEmbed {
        let name: NicknameDTO = (character.nicknames == null || character.nicknames.length <= 0) ?
            null : character.nicknames[0];

        let messageStr = this.processMessages(messages, page, false, true, false, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to ${name.name}`)
            .setDescription(`Here are the messages sent to you:\n\n${messageStr}`)
            .setFooter(BasicEmbed.getPageFooter(page, SendingController.SENDING_LIMIT, (messages == null? 0 : messages.length)));
    }

    static PRINT_MESSAGE_REPLY_TO_PLAYER (message: SendingDTO, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Got a message reply!`)
            .setDescription(`Here is the reply:\n\n${messageStr}`);
    }

    static PRINT_MESSAGE_TO_PLAYER (message: SendingDTO, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Got a new message!`)
            .setDescription(`You can see your unreplied sendings by typing \`$sending\`.\n\n` +
                `Here is the message:\n\n${messageStr}`);
    }

    static PRINT_FINISHED_INFORMING (message: SendingDTO, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Finished informing all users of the reply.`)
            .setDescription(`Here is the message you just sent:\n\n${messageStr}`);
    }

    private static processMessages(messages: SendingDTO[], page: number, includeTo: boolean, includeFrom: boolean, includeReply: boolean, encryptionUtility: EncryptionUtility): string {
        if (!messages || messages.length < 1) {
            return "No messages!";
        }

        let additional = page * SendingController.SENDING_LIMIT;
        let str = "";
        let i, message: SendingDTO;
        for (i = 0; i < messages.length; i++) {
            message = messages[i];
            str += this.processMessage(message, additional + i, includeTo, includeFrom, includeReply, encryptionUtility);
        }

        return str;
    }

    private static processMessage(message: SendingDTO, location: number, includeTo: boolean, includeFrom: boolean, includeReply: boolean, encryptionUtility: EncryptionUtility): string {
        let str = "";
        str += `**[${location}] DATE: ${message.inGameDate.day}/${message.inGameDate.month}/${message.inGameDate.year}**\n`;
        if (includeFrom) {
            let fromName: string = null;
            if (message.fromCharacter &&
                message.fromCharacter.nicknames != null &&
                message.fromCharacter.nicknames.length > 0) {
                fromName = message.fromCharacter.nicknames[0].name;
            }

            str += `> **FROM:** ${fromName} `;
            str += `(*${message.sendingMessageFromUser == null ? "UNKNOWN" : message.sendingMessageFromUser.discord_name}*)\n`;
            str += `> ${encryptionUtility.decrypt(message.content)}\n\n`;
        }
        if (includeTo) {
            let toName: string = null;
            if (message.toCharacter &&
                message.toCharacter.nicknames != null &&
                message.toCharacter.nicknames.length > 0) {
                toName = message.toCharacter.nicknames[0].name;
            }
            str += `> **TO  :** ${toName} `;
            if (includeReply && message.reply != null) {
                str += `(*${message.sendingReplyFromUser == null ? "UNKNOWN" : message.sendingReplyFromUser.discord_name}*)\n`;
                str += `> ${encryptionUtility.decrypt(message.reply)}\n`;
            } else {
                str += `\n`;
            }
        }

        str += `\n`;

        return str;
    }
}