"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const bot_1 = require("./bot");
const discord_js_1 = require("discord.js");
const message_responder_1 = require("./services/message-responder");
const ping_finder_1 = require("./services/ping-finder");
const DatabaseService_1 = require("./database/base/DatabaseService");
const PartyFundCommandHandler_1 = require("./command-handlers/PartyFundCommandHandler");
const PartyFundService_1 = require("./database/PartyFundService");
const RegisterCommandHandler_1 = require("./command-handlers/RegisterCommandHandler");
const PartyToGuildService_1 = require("./database/PartyToGuildService");
const UserDefaultPartyService_1 = require("./database/UserDefaultPartyService");
const UserService_1 = require("./database/UserService");
const UserToGuildService_1 = require("./database/UserToGuildService");
const WhichCommandHandler_1 = require("./command-handlers/WhichCommandHandler");
const SpecialChannelService_1 = require("./database/SpecialChannelService");
const HelpCommandHandler_1 = require("./command-handlers/HelpCommandHandler");
const QuoteCommandHandler_1 = require("./command-handlers/QuoteCommandHandler");
const CharacterService_1 = require("./database/CharacterService");
const BagCommandHandler_1 = require("./command-handlers/BagCommandHandler");
const CharacterCommandHandler_1 = require("./command-handlers/CharacterCommandHandler");
const TravelCommandHandler_1 = require("./command-handlers/TravelCommandHandler");
const UserToCharacterService_1 = require("./database/UserToCharacterService");
const PartyController_1 = require("./controllers/PartyController");
const PartyFundController_1 = require("./controllers/PartyFundController");
const CharacterController_1 = require("./controllers/CharacterController");
let container = new inversify_1.Container();
container.bind(types_1.TYPES.Bot).to(bot_1.Bot).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client());
container.bind(types_1.TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind(types_1.TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind(types_1.TYPES.MessageResponder).to(message_responder_1.MessageResponder).inSingletonScope();
container.bind(types_1.TYPES.PingFinder).to(ping_finder_1.PingFinder).inSingletonScope();
container.bind(types_1.TYPES.CharacterService).to(CharacterService_1.CharacterService).inSingletonScope();
container.bind(types_1.TYPES.DatabaseService).to(DatabaseService_1.DatabaseService).inSingletonScope();
container.bind(types_1.TYPES.PartyFundService).to(PartyFundService_1.PartyFundService).inSingletonScope();
container.bind(types_1.TYPES.PartyToGuildService).to(PartyToGuildService_1.PartyToGuildService).inSingletonScope();
container.bind(types_1.TYPES.SpecialChannelService).to(SpecialChannelService_1.SpecialChannelService).inSingletonScope();
container.bind(types_1.TYPES.UserDefaultPartyService).to(UserDefaultPartyService_1.UserDefaultPartyService).inSingletonScope();
container.bind(types_1.TYPES.UserService).to(UserService_1.UserService).inSingletonScope();
container.bind(types_1.TYPES.UserToGuildService).to(UserToGuildService_1.UserToGuildService).inSingletonScope();
container.bind(types_1.TYPES.UserToCharacterService).to(UserToCharacterService_1.UserToCharacterService).inSingletonScope();
container.bind(types_1.TYPES.BagCommandHandler).to(BagCommandHandler_1.BagCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.CharacterCommandHandler).to(CharacterCommandHandler_1.CharacterCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.HelpCommandHandler).to(HelpCommandHandler_1.HelpCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.PartyFundCommandHandler).to(PartyFundCommandHandler_1.PartyFundCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.QuoteCommandHandler).to(QuoteCommandHandler_1.QuoteCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.RegisterUserCommandHandler).to(RegisterCommandHandler_1.RegisterCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.TravelCommandHandler).to(TravelCommandHandler_1.TravelCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.WhichCommandHandler).to(WhichCommandHandler_1.WhichCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.CharacterController).to(CharacterController_1.CharacterController).inSingletonScope();
container.bind(types_1.TYPES.PartyController).to(PartyController_1.PartyController).inSingletonScope();
container.bind(types_1.TYPES.PartyFundController).to(PartyFundController_1.PartyFundController).inSingletonScope();
exports.default = container;
//# sourceMappingURL=inversify.config.js.map