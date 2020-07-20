import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Character} from "./Character";
import {PartyFund} from "./PartyFund";

@Entity({name: "parties"})
export class Party {
    @PrimaryColumn("serial")
    id: number;

    @Column("text")
    name: string;

    @OneToMany(type => Character, member => member.party)
    members: Character[];

    @OneToMany(type => PartyFund, fund => fund.party)
    funds: PartyFund[];
}