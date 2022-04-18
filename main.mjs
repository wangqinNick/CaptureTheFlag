import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, Flag, StructureSpawn, Source, Resource, BodyPart, StructureTower} from '/game/prototypes';
import { ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';
import { State } from './state.mjs';
import { CreepManager } from './creepManager.mjs';


export function loop() {

    // 获取信息
    var currentTick = getTicks();
    var enemyFlag = getObjectsByPrototype(Flag).find(object => !object.my);
    var myFlag = getObjectsByPrototype(Flag).find(object => object.my);
    var myCreeps = getObjectsByPrototype(Creep).filter(object => object.my);
    var enemyCreeps = getObjectsByPrototype(Creep).filter(object => !object.my);
    var mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
    var enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
    var resources = getObjectsByPrototype(BodyPart);
    var myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);
    var enemyTowers = getObjectsByPrototype(StructureTower).filter(i => !i.my);

    // 进一步获取
    var myRangers = myCreeps.filter(creep => creep.body.some(i => i.type == RANGED_ATTACK));
    var enemyRangers = enemyCreeps.filter(creep => creep.body.some(i => i.type == RANGED_ATTACK));
    var myMelees = myCreeps.filter(creep => creep.body.some(i => i.type == ATTACK));
    var enemyMelees = enemyCreeps.filter(creep => creep.body.some(i => i.type == ATTACK));
    var myHealers = myCreeps.filter(creep => creep.body.some(i => i.type == HEAL));
    var enemyHealers = enemyCreeps.filter(creep => creep.body.some(i => i.type == HEAL));

    // 封装进state
    var state = new State(myFlag, enemyFlag, myCreeps, enemyCreeps, myRangers, enemyRangers, myMelees, enemyMelees, myHealers, enemyHealers, myTowers, enemyTowers, resources);

    var creepManager = new CreepManager(state);

    creepManager.run();
}   