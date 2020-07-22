"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("./base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const World_1 = require("../entity/World");
const WorldController_1 = require("../controllers/WorldController");
const types_1 = require("../types");
const UserController_1 = require("../controllers/UserController");
let WorldCommandHandler = class WorldCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(userController, worldController) {
        super();
        this.userController = userController;
        this.worldController = worldController;
    }
    /**
     * Handles the given user command.
     *
     * @param command
     * @param message
     * @param user
     */
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Command to create a new world.
            const createCmd = Subcommands_1.Subcommands.CREATE.isCommand(command);
            if (createCmd != null) {
                return this.createWorld(createCmd.getInput(), command, message, user);
            }
            // Command to switch default worlds.
            const switchCmd = Subcommands_1.Subcommands.SWITCH.isCommand(command);
            if (switchCmd != null) {
                // If the input is null, it means we should remove the default world.
                if (switchCmd.getInput() == null) {
                    return this.removeDefaultWorld(message, user);
                }
                return this.findWorldByName(switchCmd.getInput(), user).then((worlds) => {
                    if (worlds == null) {
                        return message.channel.send("Could not find world with given name like: " + switchCmd.getInput());
                    }
                    return message.channel.send("Found worlds with given name like: " + switchCmd.getInput());
                });
            }
            return undefined;
        });
    }
    findWorldByName(worldName, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.worldController.getByNameAndUser(worldName, user);
        });
    }
    removeDefaultWorld(message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userController.updateDefaultWorld(user, null).then((usr) => {
                if (usr == null) {
                    return message.channel.send("Could not remove default world.");
                }
                return message.channel.send("Removed default world.");
            });
        });
    }
    createWorld(worldName, command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const world = new World_1.World();
            world.name = worldName;
            world.guildId = message.guild.id;
            world.defaultOfUsers = [];
            world.defaultOfUsers.push(user);
            return this.worldController.create(world).then((newWorld) => {
                if (newWorld == null) {
                    return message.channel.send("Could not create world.");
                }
                // Update the user details.
                user.defaultWorld = newWorld;
                if (user.campaignsDMing == null) {
                    user.campaignsDMing = [];
                }
                user.campaignsDMing.push(newWorld);
                // Go and save this.
                this.userController.updateDefaultWorld(user, newWorld).then(() => {
                    return message.channel.send("Created new world: " + newWorld.name);
                });
            });
        });
    }
};
WorldCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserController)),
    __param(1, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [UserController_1.UserController,
        WorldController_1.WorldController])
], WorldCommandHandler);
exports.WorldCommandHandler = WorldCommandHandler;
//# sourceMappingURL=WorldCommandHandler.js.map