import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, StructureSpawn, Source, Resource, StructureTower, StructureContainer } from '/game/prototypes';
import { WORK, ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';

const DIRECTIONS = [TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT];

export class SmartCreep {

    /**
     * 
     * @param {this creep objecy} creep 
     * @param {the state information} state 
     */
    constructor(creep, state) {
        this.creep = creep;
        this.state = state;
    }

    // 原地本职工作
    alertMode() {

    }


    /**
     * Move randomly (in eight directions).
     */
    randomMove() {
        let i = Math.floor(Math.random() * 8);
        this.creep.move(DIRECTIONS[i]);
    }

    /**
     * Get the nearest enemy.
     * @param {*} type 
     * @returns 
     */
    getNearestEnemyCreep(type=null) {
        var enemies;
        var nearestEnemy;
        if (type == null) {
            enemies = this.state.enemyCreeps.filter(creep => creep.body.some(i => i.type == RANGED_ATTACK || i.type == ATTACK || i.type == HEAL));
        } else {
            enemies = this.state.enemyCreeps.filter(creep => creep.body.some(i => i.type == type));
        }
        if (enemies) {
            nearestEnemy = findClosestByPath(this.creep, enemies);
            return nearestEnemy;
        } else {return null;}
    }

    /**
     * 
     * @param {*} type 
     * @param {*} isInjured 
     * @returns 
     */
    getNearestFriendlyCreep(type=null, isInjured=true) {
        var friends;
        var nearestFriend;
        if (type == null) {
            friends = this.state.myCreep.filter(creep => creep.body.some(i => i.type == RANGED_ATTACK || i.type == ATTACK || i.type == HEAL));
        } else {
            friends = this.state.myCreeps.filter(creep => creep.body.some(i => i.type == type));
        }
        if (friends) {
            if (isInjured) {
                friends = friends.filter(i => i.hits < i.maxHits)
            }
            if (friends) {
                nearestFriend = findClosestByPath(this.creep, friends);
                return nearestFriend;
            }    
        } else {return null;}
    }
}