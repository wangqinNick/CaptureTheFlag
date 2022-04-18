import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, StructureSpawn, Source, Resource, StructureTower, StructureContainer } from '/game/prototypes';
import { WORK, ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';
import { SmartCreep } from './smartCreep.mjs';

export class CreepManager {

    /**
     * 
     * @param {the state information} state 
     */
    constructor(state) {
        this.state = state;
    }



    run() {
        // 留一个近战驻守在自己家
        var defender = findClosestByPath(this.state.myFlag, this.state.myHealers);
        defender.moveTo(this.state.myFlag);

        // 其他人，
        // 情况一，当敌人龟缩时，在河道巡游，并伐木
        if (this.state.isTurtle()) {
            console.log("敌方在龟缩！");
            // 开始巡游河道发育
        } else {

        }
    }


    // 集团警戒
    groupAlert(group) {
        var smartCreep;
        for (var creep of group) {
            smartCreep = new SmartCreep(creep, this.state);
            smartCreep.alertMode();
        }
    }

    // 集团移动
    groupMove(group) {
        
    }
}