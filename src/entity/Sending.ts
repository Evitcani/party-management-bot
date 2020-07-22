import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {NonPlayableCharacter} from "./NonPlayableCharacter";
import {Character} from "./Character";
import {Table} from "../documentation/databases/Table";
import {StringUtility} from "../utilities/StringUtility";
import {World} from "./World";

@Entity({name: Table.SENDING})
export class Sending {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({name: "created_date"})
    createdDate: Date;

    @UpdateDateColumn({name: "updated_date"})
    updatedDate: Date;

    @Column({name: "world_id", nullable: true})
    worldId?: string;

    @ManyToOne(type => World, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "world_id"})
    world?: World;

    @Column( {name: "in_game_date"})
    inGameDate: {day: number, month: number, year: number, era: string};

    @Column("text")
    content: string;

    @Column("text", {nullable: true})
    reply?: string;

    @Column({nullable: true, name: "no_reply"})
    noReply?: boolean;

    @Column({nullable: true, name: "no_connection"})
    noConnection?: boolean;

    @Column({nullable: true, name: "is_replied"})
    isReplied?: boolean;

    @Column({name: "to_npc_id", nullable: true})
    toNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_npc_id"})
    toNpc?: NonPlayableCharacter;

    @Column({name: "from_npc_id", nullable: true})
    fromNpcId?: string;

    @ManyToOne(type => NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_npc_id"})
    fromNpc?: NonPlayableCharacter;

    @Column({name: "to_player_id", nullable: true})
    toPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "to_player_id"})
    toPlayer?: Character;

    @Column({name: "from_player_id", nullable: true})
    fromPlayerId?: number;

    @ManyToOne(type => Character, {
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({name: "from_player_id"})
    fromPlayer?: Character;

    @BeforeInsert()
    @BeforeUpdate()
    purifyInsertUpdate() {
        this.inGameDate.era = StringUtility.escapeSQLInput(this.inGameDate.era);
        this.reply = StringUtility.escapeSQLInput(this.reply);
        this.content = StringUtility.escapeSQLInput(this.content);

        // Checks if the message is replied to or not.
        this.isReplied = this.reply != null || this.noConnection || this.noReply;
    }
}