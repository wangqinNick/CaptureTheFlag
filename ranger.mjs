import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, StructureSpawn, Source, Resource, StructureTower, StructureContainer } from '/game/prototypes';
import { WORK, ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';
import { SmartCreep } from './smartCreep.mjs';


export class Ranger extends SmartCreep{
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
        var enemyCreep = this.getNearestEnemyCreep();
        if (enemyCreep) {
            if (getRange(this.creep, enemyCreep) <= 3) {
                this.creep.rangedAttack(enemyCreep);
            } 
        }
    }


    /**
     * 
     * @param {*} sneakyMode 
     */
    attackNearestEnemy(sneakyMode=false, type=null){
        var nearestEnemy = this.getNearestEnemyCreep(type);
        if (sneakyMode) {attackNearestEnemy_sneaky(nearestEnemy);}
        else {attackNearestEnemy_normal(nearestEnemy);}
    }

    /****Below are Helper functions.
     */

    /**
     * （悄悄的）攻击最近的敌人
     */
    attackNearestEnemy_sneaky(enemy) {
        if (enemy) {this.sneakyAttack(enemy);}
    }

    /**
     * （大胆的）攻击最近的敌人
     */
    attackNearestEnemy_normal(enemy) {
        if (enemy) {this.creep.rangedAttack(enemy);}
    }

    /**
     * Sneaky attack the enemy to dodge the melee attack
     * @param {*} enemy The enemy
     */
    sneakyAttack(target) {
        let distance = getRange(this.creep, target);
        if (distance > 3) {                     // 当敌人过远时应该移动
            this.creep.moveTo(target);
        } else if(distance > 2) {               // 距离刚好
            this.creep.rangedAttack(target);
        } else {                                // 距离过近，开始撤退
            if (this.creep.move(turnDiretion(getDirection(target.x - this.creep.x, target.y - this.creep.y))) != OK) {
                this.creep.randomMove();        // 若无法撤退，则随机逃跑
            }
        }
    }
} 

function turnDiretion(direction) {
    switch (direction) {
        case TOP: return BOTTOM;
        case BOTTOM: return TOP;
        case TOP_LEFT: return BOTTOM_RIGHT;
        case BOTTOM_RIGHT: return TOP_LEFT;
        case TOP_RIGHT: return BOTTOM_LEFT;
        case BOTTOM_LEFT: return TOP_RIGHT;
        case LEFT: return RIGHT;
        case RIGHT: return LEFT;
    }
}