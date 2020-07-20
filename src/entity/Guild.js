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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guild = void 0;
const typeorm_1 = require("typeorm");
const StringUtility_1 = require("../utilities/StringUtility");
let Guild = class Guild {
    purifyInsertUpdate() {
        this.discord_id = StringUtility_1.StringUtility.escapeMySQLInput(this.discord_id);
        this.guild_id = StringUtility_1.StringUtility.escapeMySQLInput(this.guild_id);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], Guild.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Guild.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Guild.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Guild.prototype, "discord_id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Guild.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Guild.prototype, "purifyInsertUpdate", null);
Guild = __decorate([
    typeorm_1.Entity({ name: "user_to_guild" })
], Guild);
exports.Guild = Guild;
//# sourceMappingURL=Guild.js.map