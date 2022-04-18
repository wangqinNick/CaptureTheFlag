import { getObjectsByPrototype, findClosestByRange, findClosestByPath, findInRange, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, StructureSpawn, Source, Resource, StructureTower, StructureContainer } from '/game/prototypes';
import { WORK, ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';

export class State{
    
    /**
     * 
     * @param {*} myFlag 
     * @param {*} enemyFlag 
     * @param {*} myCreeps 
     * @param {*} enemyCreeps 
     * @param {*} myRangers 
     * @param {*} enemyRangers 
     * @param {*} myMelees 
     * @param {*} enemyMelees 
     * @param {*} myHealers 
     * @param {*} enemyHealers 
     * @param {*} myTowers 
     * @param {*} enemyTowers 
     * @param {*} resources 
     */
    constructor(myFlag, enemyFlag, 
                myCreeps, enemyCreeps,
                myRangers, enemyRangers,
                myMelees, enemyMelees,
                myHealers, enemyHealers,
                myTowers, enemyTowers, 
                resources) {

        this.myFlag = myFlag;
        this.enemyFlag = enemyFlag;
        this.myCreeps = myCreeps;
        this.enemyCreeps = enemyCreeps;
        this.myRangers = myRangers;
        this.enemyRangers = enemyRangers;
        this.myMelees = myMelees;
        this.enemyMelees = enemyMelees;
        this.myHealers = myHealers;
        this.enemyHealers = enemyHealers;
        this.myTowers = myTowers;
        this.enemyTowers = enemyTowers;
        this.resources = resources;
    }

    /**
     * Get the nearest enemy creep to my flag
     */
    getMostDangerourEnemy() {
        let targets = this.enemyCreeps;
        let closestTarget = findClosestByPath(this.myFlag, targets);
        return closestTarget;
    }

    /**
     * 判断敌人是否苟在基地（乌龟流）
     * 当超过12个敌人都在敌方旗子周围10格时，判断为乌龟流
     */
    isTurtle(number=12, distance=10) {
        let targetsInRange = findInRange(this.enemyFlag, this.enemyCreeps, distance);
        if (targetsInRange.length >= number) {return true;} 
        else {return false;}
    }

    // TODO
    /**
     * 
     */
    readEnemyIntention() {
    }


}