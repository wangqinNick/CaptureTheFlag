import { getObjectsByPrototype, findClosestByRange, findClosestByPath, getTicks, getRange, getDirection } from '/game/utils';
import { Creep, Flag, StructureSpawn, Source, Resource, BodyPart, StructureTower} from '/game/prototypes';
import { ERR_NOT_IN_RANGE, ATTACK, RANGED_ATTACK, HEAL, TOWER_RANGE, TOP, BOTTOM, LEFT, RIGHT, TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, OK } from '/game/constants';


export function loop() {
    var currentTick = getTicks();

    var enemyFlag = getObjectsByPrototype(Flag).find(object => !object.my);
    var myFlag = getObjectsByPrototype(Flag).find(object => object.my);
    var myCreeps = getObjectsByPrototype(Creep).filter(object => object.my);
    var enemyCreeps = getObjectsByPrototype(Creep).filter(object => !object.my);
    var mySpawn = getObjectsByPrototype(StructureSpawn).find(i => i.my);
    var enemySpawn = getObjectsByPrototype(StructureSpawn).find(i => !i.my);
    var resources = getObjectsByPrototype(BodyPart);
    var myTowers = getObjectsByPrototype(StructureTower).filter(i => i.my);

    const fraction = 94/96;

    // 对我的creeps 分类
    var myRangedCreeps = [];
    var myAttackCreeps = [];
    var myHealCreeps = [];
    // var myRangedCreeps = myCreeps.filter(creep => creep.body.some(i => i.type == RANGED_ATTACK));

    // 正常安排攻击动作
    for (var creep of myCreeps) {
        if(creep.body.some(bodyPart => bodyPart.type == ATTACK)) {
            attackEnemyCreep(creep, enemyCreeps);
            myAttackCreeps.push(creep);
        }
    
        if(creep.body.some(bodyPart => bodyPart.type == HEAL)) {
            healMyCreep(creep, myCreeps);
            myHealCreeps.push(creep);
        }

        if(creep.body.some(bodyPart => bodyPart.type == RANGED_ATTACK)) {
            rangedAttackEnemyCreep(creep, enemyCreeps);
            myHealCreeps.push(creep);
        }
    }

    // for (var myRangedCreep of myRangedCreeps) {
    //     var enemyCreep = findClosestByPath(myRangedCreep, enemyCreeps);
    //     dodgeAttack(myRangedCreep, enemyCreep);
    // }

    if (currentTick > 1500) {
        for (var myCreep of myCreeps) {
            myCreep.moveTo(enemyFlag);
        }
    } else {
        // 先分配任务
        // Tower 攻击最近的敌方目标
        towerAttack(myTowers, enemyCreeps);

        // 距离资源最近的去采矿改造
        if (currentTick > 200) {
            var miningCreeps = [];
            miningCreeps.push(myHealCreeps[0]);
            miningCreeps.push(myHealCreeps[1]);
            removeItemOnce(myCreeps, myHealCreeps[0]);
            removeItemOnce(myCreeps, myHealCreeps[1]);
    
            // console.log("Current avaliable resources amount: " + resources.length + '\n');
    
            for (let i = 0; i  < miningCreeps.length; i++) {
                harvest(miningCreeps[i], resources[i]);
            }
        }
        

        // for (let i = 0; i < resources.length; i++) {
        //     var nearestCreep =  findClosestByPath(resources[i], myCreeps);
        //     console.log("The nearest Creep to resource at " + "(" + resources[i].x, + ", " + resources[i].y + ") is (" + nearestCreep.x + ", " + nearestCreep.y + ")" + '\n')
        //     harvest(nearestCreep, spawn, resources[i]);
            
        // }

        // 再派6个去保护自己的旗
        console.log("Flag:" + myFlag.x + ", " + myFlag.y)
        var pos1 = new Position(myFlag.x-1, myFlag.y-1); // left top corner
        var pos2 = new Position(myFlag.x, myFlag.y-1);  // top
        var pos3 = new Position(myFlag.x-1, myFlag.y);  // left
        var pos4 = new Position(myFlag.x+1, myFlag.y); // right
        var pos5 = new Position(myFlag.x, myFlag.y + 1);  // bottom
        var pos6 = new Position(myFlag.x+1, myFlag.y + 1);  // right bottom corner

        var pos = [pos1, pos2, pos3, pos4, pos5, pos6];
        for (let i = 0; i < 6; i++) {
            var nearestCreep =  findClosestByPath(pos[i], myCreeps);
            nearestCreep.moveTo({x:pos[i].x, y:pos[i].y});
            removeItemOnce(myCreeps, nearestCreep);
        }

        // 剩下的去踩自己的旗

        for (var myCreep of myCreeps) {
            var battleField = {x:fraction * myFlag.x + (1-fraction) * enemyFlag.x, y:fraction * myFlag.y + (1-fraction) * enemyFlag.y};
            myCreep.moveTo(battleField);
        }
    }
    console.log(myCreeps.length)
}

function towerAttack(myTowers, enemyCreeps) {
    for (var tower of myTowers) {
        let target = tower.findClosestByRange(enemyCreeps);
        if (target) {
            if (tower.getRangeTo(target) <= TOWER_RANGE) {
                tower.attack(target);
            }
        }
    }
}

function harvest(harvester, resource) {
    harvester.moveTo(resource);
}


function attackEnemyCreep(attacker, enemyCreeps) {
    var nearestEnemyCreep = findClosestByPath(attacker, enemyCreeps);
    attacker.attack(nearestEnemyCreep);
}

function healMyCreep(healer, myCreeps) {
    var nearestMyCreep = findClosestByPath(healer, myCreeps);
    healer.heal(nearestMyCreep);

   
    var myDamagedCreeps = myCreeps.filter(i => i.hits < i.hitsMax)
    for (var creep of myDamagedCreeps) {
        if (healer.getRangeTo(creep) > 2) {
            removeItemOnce(myDamagedCreeps, creep);
        }
    }

    if (myDamagedCreeps.length > 0) {
        if(healer.heal(myDamagedCreeps[0]) == ERR_NOT_IN_RANGE) {
            healer.moveTo(myDamagedCreeps[0]);
        }
    }
}

function rangedAttackEnemyCreep(rangedAttacker, enemyCreeps) {
    let nearestEnemyCreep = rangedAttacker.findClosestByRange(enemyCreeps);
    // dodgeAttack(rangedAttacker, nearestEnemyCreep);
    rangedAttacker.rangedAttack(nearestEnemyCreep);
}

function captureEnemyFlag(myCreep, enemyFlag) {
    myCreep.moveTo(enemyFlag);
}

function isAlive(creep) {
    if (creep.hits < creep.hitsMax) {
        return true;
    } else {
        return false;
    }
}

// 功能方法
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}
  
  function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}

class Position {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

function dodgeAttack(rangedAttacker, enemyCreep) {
    if (getRange(rangedAttacker, enemyCreep) > 3) {
        rangedAttacker.moveTo(enemyCreep);
    } else if (getRange(rangedAttacker, enemyCreep) > 2) {
        console.log("I am attacking")
        rangedAttacker.rangedAttack(enemyCreep)
    } else {
        if (rangedAttacker.move(turnDiret(getDirection(enemyCreep.x - rangedAttacker.x, enemyCreep.y - rangedAttacker.y))) != OK) {
            rangedAttacker.rangedAttack(enemyCreep);
        }
    }
}

function turnDiret(direction) {
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