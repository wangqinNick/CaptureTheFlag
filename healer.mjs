import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, StructureSpawn, Source, Resource, StructureTower, StructureContainer } from '/game/prototypes';
import { WORK, ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';
import { SmartCreep } from './smartCreep.mjs';


export class Healer extends SmartCreep{
    /**
     * Creates a new smart ranger creep
     * 
     * @param creep     The worker creep 
     * @param state     The word information
     */
    constructor(creep, state) {
        super(creep, state);
    }

    alertMode() {
        // 判断视野内是否有敌人 (视野为3), 若有敌人, 原地轰击
        healNearestFriends();
    }

    /**
     * Heal the nearest friendly creep
     */
    healNearestFriends(type=null) {
        if (this.creep.hits < this.creep.maxHits) {
            this.creep.heal(this.creep);
            return;
        }
        var nearestCreep = this.getNearestFriendlyCreep(type, true);
        if (nearestCreep) {this.creep.rangedHeal(nearestCreep);}
    }
}