import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {User} from "../entity/User";
import {Subcommands} from "../documentation/commands/Subcommands";
import {World} from "../entity/World";
import {WorldController} from "../controllers/WorldController";
import {TYPES} from "../types";
import {UserController} from "../controllers/UserController";
import {WorldRelatedClientResponses} from "../documentation/client-responses/WorldRelatedClientResponses";
import {PartyController} from "../controllers/PartyController";

@injectable()
export class WorldCommandHandler extends AbstractUserCommandHandler {
    private partyController: PartyController;
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.partyController = partyController;
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
    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Command to create a new world.
        const createCmd = Subcommands.CREATE.isCommand(command);
        if (createCmd != null) {
            return this.createWorld(createCmd.getInput(), command, message, user);
        }

        // Command to switch default worlds.
        const switchCmd = Subcommands.SWITCH.isCommand(command);
        if (switchCmd != null) {
            // If the input is null, it means we should remove the default world.
            if (switchCmd.getInput() == null) {
                return this.removeDefaultWorld(message, user);
            }

            return this.switchDefaultWorld(switchCmd.getInput(), message, user);
        }

        // Command to add the party to this world.
        const ptCmd = Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
            this.addPartyToWorld(ptCmd.getInput(), message, user);
        }

        return undefined;
    }

    private async addPartyToWorld(partyName: string, message: Message, user: User): Promise<Message | Message[]> {
        let worlds: World[] = [];
        if (user.defaultWorld != null) {
            worlds.push(user.defaultWorld);
        }

        if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
            worlds.push(user.defaultCharacter.party.world);
        }

        if (worlds.length < 1) {
            return message.channel.send("No world to choose from!");
        }

        // No selection needed.
        if (worlds.length == 1) {
            return this.continueAddingPartyToWorld(partyName, message, worlds[0]);
        }

        // Otherwise allow selection.
        return this.worldController.worldSelection(worlds, message).then((world) => {
            if (world == null) {
                return null;
            }

            return this.continueAddingPartyToWorld(partyName, message, world);
        });


    }

    private async continueAddingPartyToWorld(partyName: string, message: Message, world: World): Promise<Message | Message[]> {
        return this.partyController.getByNameAndGuild(partyName, message.guild.id).then((parties) => {
            if (parties == null || parties.length < 1) {
                return message.channel.send("Could not find party with given name like: " + partyName);
            }

            // TODO: Allow user to select party if ambiguous.
            return this.partyController.updatePartyWorld(parties[0], world).then((party) => {
                return message.channel.send(`Party ('${party.name}') added to world: ${world.name}`);
            });
        });
    }

    private async switchDefaultWorld(worldName: string, message: Message, user: User): Promise<Message | Message[]> {
        return this.findWorldByName(worldName, user).then((worlds) => {
            if (worlds == null || worlds.length < 1) {
                return message.channel.send("Could not find world with given name like: " + worldName);
            }

            // Only one result.
            if (worlds.length == 1) {
                return this.userController.updateDefaultWorld(user, worlds[0]).then(() => {
                    return message.channel.send(`Default world switched to '${worlds[0].name}'`);
                });
            }

            return this.worldController.worldSelection(worlds, message).then((world) => {
                if (world == null) {
                    return null;
                }

                return this.userController.updateDefaultWorld(user, world).then(() => {
                    return message.channel.send(`Default world switched to '${world.name}'`);
                });
            });
        });
    }

    private async findWorldByName(worldName: string, user: User): Promise<World[]> {
        return this.worldController.getByNameAndUser(worldName, user);
    }

    private async removeDefaultWorld (message: Message, user: User): Promise<Message | Message[]> {
        return this.userController.updateDefaultWorld(user, null).then((usr) => {
            if (usr == null) {
                return message.channel.send("Could not remove default world.");
            }

            return message.channel.send("Removed default world.");
        })
    }

    public async createWorld(worldName: string, command: Command, message: Message, user: User): Promise<Message | Message[]> {
        const world = new World();
        world.name = worldName;
        world.guildId = message.guild.id;
        return this.worldController.create(world).then((newWorld) => {
            if (newWorld == null) {
                return message.channel.send("Could not create world.");
            }

            return this.userController.addWorld(user, newWorld).then((user) => {
                if (user == null) {
                    return message.channel.send("Could not add the world to the map.");
                }

                // Go and save this.
                return this.userController.updateDefaultWorld(user, newWorld).then(() => {
                    return message.channel.send("Created new world: " + newWorld.name);
                });
            });
        });
    }
}