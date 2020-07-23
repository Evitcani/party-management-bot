import {PartyFundController} from "./controllers/party/PartyFundController";

export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
    CryptKey: Symbol("CryptKey"),
    DatabaseUrl: Symbol("DatabaseUrl"),
    MessageResponder: Symbol("MessageResponder"),
    PingFinder: Symbol("PingFinder"),
    EncryptionUtility: Symbol("EncryptionUtility"),

    DatabaseService: Symbol("DatabaseService"),
    PartyToGuildService: Symbol("PartyToGuildService"),
    SpecialChannelService: Symbol("SpecialChannelService"),
    UserDefaultPartyService: Symbol("UserDefaultPartyService"),
    UserService: Symbol("UserService"),
    UserToCharacterService: Symbol("UserToCharacterService"),
    UserToGuildService: Symbol("UserToGuildService"),

    BagCommandHandler: Symbol("BagCommandHandler"),
    CharacterCommandHandler: Symbol("CharacterCommandHandler"),
    HelpCommandHandler: Symbol("HelpCommandHandler"),
    PartyFundCommandHandler: Symbol("PartyFundCommandHandler"),
    QuoteCommandHandler: Symbol("QuoteCommandHandler"),
    RegisterUserCommandHandler: Symbol("RegisterUserCommandHandler"),
    SendingCommandHandler: Symbol("SendingCommandHandler"),
    TravelCommandHandler: Symbol("TravelCommandHandler"),
    WhichCommandHandler: Symbol("WhichCommandHandler"),
    WorldCommandHandler: Symbol("WorldCommandHandler"),

    CharacterController: Symbol("CharacterController"),
    NPCController: Symbol("NPCController"),
    PartyController: Symbol("PartyController"),
    PartyFundController: Symbol("PartyFundController"),
    SendingController: Symbol("SendingController"),
    UserController: Symbol("UserController"),
    WorldController: Symbol("WorldController"),
};