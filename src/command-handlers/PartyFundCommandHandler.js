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
exports.PartyFundCommandHandler = void 0;
const PartyService_1 = require("../database/PartyService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const MoneyUtility_1 = require("../utilities/MoneyUtility");
const AbstractCommandHandler_1 = require("./base/AbstractCommandHandler");
const FundRelatedClientResponses_1 = require("../documentation/client-responses/FundRelatedClientResponses");
const PartyFundService_1 = require("../database/PartyFundService");
/**
 * Manages the fund related commands.
 */
let PartyFundCommandHandler = class PartyFundCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    constructor(partyService, partyFundService) {
        super();
        this.partyName = "The Seven Wonders";
        this.partyService = partyService;
        this.partyFundService = partyFundService;
    }
    /**
     * Handles the commands related to funds.
     *
     * @param command The command to handle.
     * @param message The message calling this command.
     */
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Figure out which command to use.
            let type = command.getName() == "bank" ? "BANK" : "FUND";
            // If there are no args, assume the user just wants a bank statement.
            if (command.getInput() == null) {
                return this.getFunds(message, type, this.partyName);
            }
            // Now we send the amount off to be processed.
            return this.updateFunds(command, message, type, this.partyName);
        });
    }
    getFunds(message, type, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findFunds(name, type, message).then((fund) => {
                return message.channel.send(MoneyUtility_1.MoneyUtility.formatFundStatement(fund, fund.type));
            });
        });
    }
    ////////////////////////////////////////////////////////////
    ///// FINDING
    ////////////////////////////////////////////////////////////
    /**
     * Finds the fund for the given party of the given type.
     *
     * @param name The name of the party that the fund belongs to.
     * @param type The type of fund to find. Defaults to 'FUND'.
     * @param message The message object that originally sent the command.
     */
    findFunds(name, type, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type == null) {
                type = "FUND";
            }
            return this.partyService.getParty(name).then((res) => {
                return this.partyFundService.getFund(res.id, type).catch((err) => {
                    console.log("Failed to find party fund with given information ::: " + err.message);
                    return err;
                });
            }).catch((err) => {
                console.log("Failed to find party with given name ::: " + err.message);
                return null;
            });
        });
    }
    ////////////////////////////////////////////////////////////
    ///// UPDATING
    ////////////////////////////////////////////////////////////
    updateFunds(command, message, fundType, partyName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process the arguments.
            const newFund = MoneyUtility_1.MoneyUtility.processMoneyArguments(command.getInput().split(" "));
            if (newFund === null) {
                return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
            }
            // Find and then update these funds.
            return this.findFunds(partyName, fundType, message).then((fund) => {
                // Pile everything into copper.
                let newAmtTotal = MoneyUtility_1.MoneyUtility.pileIntoCopper(newFund);
                let oldAmt = MoneyUtility_1.MoneyUtility.pileIntoCopper(fund);
                let newAmt = newAmtTotal + oldAmt;
                if (newAmt < 0) {
                    let newAmtInGold = newAmt / 100;
                    return message.channel.send(FundRelatedClientResponses_1.FundRelatedClientResponses.NOT_ENOUGH_MONEY(oldAmt / 100, newAmtTotal / 100, newAmtInGold));
                }
                const finalFund = MoneyUtility_1.MoneyUtility.copperToFund(newAmt);
                return this.partyFundService.updateFunds(fund.id, finalFund.platinum, finalFund.gold, finalFund.silver, finalFund.copper).then((updatedFund) => {
                    const currentMoney = MoneyUtility_1.MoneyUtility.pileIntoCopper(updatedFund) / 100;
                    return message.channel.send(FundRelatedClientResponses_1.FundRelatedClientResponses.UPDATED_MONEY(currentMoney, oldAmt / 100, newAmtTotal / 100, newAmtTotal < 0));
                });
            });
        });
    }
};
PartyFundCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PartyService)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyFundService)),
    __metadata("design:paramtypes", [PartyService_1.PartyService,
        PartyFundService_1.PartyFundService])
], PartyFundCommandHandler);
exports.PartyFundCommandHandler = PartyFundCommandHandler;
//# sourceMappingURL=PartyFundCommandHandler.js.map