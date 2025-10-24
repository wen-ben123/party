// @ts-nocheck
/* eslint-disable */

import i18n from '../../i18n';

// 移除历史保存功能

// 提供运行时保护性默认对象，防止在非完整运行环境（比如编辑器静态检查）时报错。
if (typeof (globalThis as any).gui === 'undefined') {
  (globalThis as any).gui = {
    init: function () {},
    setAttribute: function () {},
    ElementTypes: {},
    Colors: {},
    onClickMessage: function (selector: any, name: any) {
      return {
        action: 'sendMessage',
        messageName: name,
        event: 'click',
        selector: selector,
      };
    },
    xmlElement: function (attributes: any) {
      if (typeof attributes === 'string') return attributes;
      return '';
    },
  };
}

if (typeof (globalThis as any).voxels === 'undefined') {
  (globalThis as any).voxels = {
    setVoxel: function () {},
    getVoxelId: function () {
      return 0;
    },
    name: function () {
      return 'air';
    },
  };
}

// world.storage 可能不存在，添加空实现以避免调用时报错（实际运行时会被引擎提供）
if (typeof (globalThis as any).world !== 'undefined') {
  if (typeof (globalThis as any).world.storage === 'undefined') {
    (globalThis as any).world.storage = {
      getItem: async function () {
        return null;
      },
      setItem: async function () {
        return;
      },
    };
  }
}

if (typeof (globalThis as any).GameRGBColor === 'undefined') {
  (globalThis as any).GameRGBColor = function (
    r: number,
    g: number,
    b: number
  ) {
    return { r, g, b };
  };
}

// 提供 sleep 的默认实现（如果引擎未提供）
if (typeof (globalThis as any).sleep === 'undefined') {
  (globalThis as any).sleep = function (ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
}

// minimal world stub: 仅在没有引擎提供 world 时使用，避免加载/编辑环境报错
if (typeof (globalThis as any).world === 'undefined') {
  (globalThis as any).world = {
    storage: {
      async getItem(_k: string) {
        return null;
      },
      async setItem(_k: string, _v: any) {
        return;
      },
    },
    onPlayerJoin: function () {},
    onPlayerLeave: function () {},
    onTick: function () {},
    onPress: function () {},
    say: function (msg: any) {
      console.log('[world.say]', msg);
    },
    querySelectorAll: function () {
      return [];
    },
    createEntity: function () {
      return {
        addTag() {},
        position: { copy() {}, set() {} },
        destroy() {},
        onVoxelContact() {},
        int: null,
        meshScale: { x: 0, y: 0, z: 0 },
      };
    },
    Time: Date.now(),
    // 事件处理 helpers
    _events: {},
    addEventListener: function (name: string, cb: any) {
      this._events[name] = this._events[name] || [];
      this._events[name].push(cb);
    },
  };
}

// 玩家历史记录类
// PlayerHistory类已删除

// 全局玩家历史记录相关代码已删除

// 保存玩家历史记录相关函数已删除

//GUI代码
world.onPlayerJoin(({ entity }) => {
  entity.player.enable3DCursor = true;
  entity.skillCold = 0;
  entity.skill = i18n.t('skill.old_shoes.name');
  gui.init(entity, {
    panel: {
      display: true,
      data: `<dialog width="300" percentHeight="100" top="60" right="60" id="" >
            <group percentWidth="100" height="120" y="0">
                <label text="${i18n.t('gui.skill')}" height="35" y="5"  x="10"  percentWidth="100" color="#55f" fontSize="20"></label>
                <label text="" height="25" y="35" x="10" percentWidth="100" color="#a0a" id="positionshowdx"></label>
                <label text="" height="25" y="85" x="10" percentWidth="100" color="#a0a" id="positionshowdz"></label>
            </group>
            <group percentWidth="100" height="120" y="130">
                <label text="${i18n.t('gui.update_announcement')}" height="35" y="5"  x="10"  percentWidth="100" color="#55f" fontSize="20"></label>
                <label text="" height="25" y="50" x="10" percentWidth="100" color="#a0a" id="pointshowx"></label>
                <label text="" height="25" y="60" x="10" percentWidth="100" color="#a0a" id="pointshowy"></label>
                <label text="" height="25" y="90" x="10" percentWidth="100" color="#a0a" id="pointshowz"></label>
            </group>
        </dialog>`,
    },
  });
  var recordY = entity.position.y;
  world.onTick(() => {
    var space = entity.skillCold / 1000;
    var isdown = space <= 0;
    var Ystatus = `${isdown ? i18n.t('gui.skill_status_ready') : i18n.t('gui.skill_status_cooldown', { time: space.toFixed(1) })}`;
    recordY = entity.position.y;
    gui.setAttribute(
      entity,
      '#positionshowdx',
      'text',
      i18n.t('gui.skill_name', { skill: entity.skill })
    );
    gui.setAttribute(
      entity,
      '#positionshowdz',
      'text',
      `${i18n.t('gui.skill_status')}:${Ystatus}`
    );
    gui.setAttribute(
      entity,
      '#pointshowx',
      'text',
      i18n.t('gui.support_modes')
    );
    gui.setAttribute(
      entity,
      '#pointshowy',
      'text',
      i18n.t('gui.game_features')
    );
    gui.setAttribute(
      entity,
      '#pointshowz',
      'text',
      i18n.t('gui.creation_link')
    );
  });
});

/**
 * 常用gui元素类型
 */
gui.ElementTypes = {
  Dialog: 'dialog',
  Group: 'group',
  Label: 'label',
  Button: 'button',
  Image: 'image',
};

/**
 *常用16进制颜色
 */
gui.Colors = {
  Red: '#FF0000',
  Yellow: '#FFFF00',
  Green: '#008000',
  Blue: '#0000FF',
  Indigo: '#00FFFF',
  Black: '#000000',
  White: '#111111',
  Pink: '#FFC0CB',
  Purple: '#800080',
  Grey: '#888888',
};

gui.onClickMessage = function (selector, name) {
  return {
    action: 'sendMessage',
    messageName: name,
    event: 'click',
    selector: selector,
  };
};

gui.xmlElement = function (attributes) {
  if (typeof attributes === 'string') return attributes;
  let type = attributes.type;
  if (!Object.values(gui.ElementTypes).includes(type))
    throw new Error(i18n.t('error.unsupported_element_type', { type }));
  let children = attributes.children;
  delete attributes.type;
  delete attributes.children;
  let element = `<${type}`;
  Object.entries(attributes).forEach(([k, v]) => {
    element += ` ${k}="${v}"`;
  });
  element += '>';
  if (children) {
    children.forEach((label) => {
      element += gui.xmlElement(label);
    });
  }
  element += `</${type}>`;
  return element;
};

//示例代码
console.clear();
gui.GREY = '#aaa';
gui.YELLOW = '#ff5';
gui.RED = '#f55';
gui.GREEN = '#5f5';
gui.BLUE = '#55f';
gui.Purple = '#a0a';

function cleanWorldVoxels() {
  for (let x = 0; x < 128; ) {
    for (let y = 0; y < 120; ) {
      for (let z = 0; z < 128; ) {
        voxels.setVoxel(x, y, z, 'air');
        z++;
      }
      y++;
    }
    x++;
  }
}

async function changeBlock(x, y, z) {
  voxels.setVoxel(x, y, z, 'exclamation_mark');
  await sleep(2500);
  voxels.setVoxel(x, y, z, 'air');
}

// 越上面，消失方块越多的功能
async function randoestroyVoxels(num) {
  world.say(i18n.t('block_cracking'));
  var quan = 0;

  // 1. 收集所有非空气方块
  var levelList = [];
  var levels = [];

  for (let i = 30; i < 90; i++) {
    for (let y = 0; y < 60; y++) {
      for (let q = 30; q < 90; q++) {
        if (voxels.name(voxels.getVoxelId(i, y, q)) !== 'air') {
          if (!levels.includes(y)) {
            levels.push(y);
            levelList[y] = [];
          }
          levelList[y].push({ x: i, y: y, z: q });
        }
      }
    }
  }

  // 2. 计算各层级的权重 - 越高权重越大（越容易被选中）
  var weightedList = [];
  var maxY = Math.max(...levels);

  for (var level in levelList) {
    var y = parseInt(level);
    // 计算权重：越高的层，权重越大
    var weight = (y / maxY) * 3 + 0.1; // 最小0.1，最大3.1

    // 按权重将方块添加到加权列表
    for (var i = 0; i < levelList[level].length; i++) {
      for (var j = 0; j < weight * 5; j++) {
        // 乘以系数5来增强效果
        weightedList.push(levelList[level][i]);
      }
    }
  }

  // 3. 从加权列表中随机选择方块进行碎裂
  while (quan < Math.min(num, weightedList.length)) {
    var randomIndex = Math.floor(Math.random() * weightedList.length);
    var pos = weightedList[randomIndex];

    // 触发碎裂动画
    changeBlock(pos.x, pos.y, pos.z);

    quan++;
  }

  if (quan >= weightedList.length) {
    world.say(i18n.t('game.all_blocks_destroyed'));
  }
}

//创建初始平台
function createVoxelPlatform(y, vox) {
  let xend = 65 + 50;
  let yend = y + 1;
  let zend = 65 + 50;
  for (let x = 65 - 25; x <= xend; x++) {
    for (let z = 65 - 25; z <= zend; z++) {
      let dx = x - 65;
      let dz = z - 65;
      if (Math.round(Math.sqrt(dx * dx + dz * dz)) <= 25) {
        for (let y1 = y; y1 < yend; y1++) {
          voxels.setVoxel(x, y1, z, vox);
        }
      }
    }
  }
}

function reset() {
  createVoxelPlatform(50, 'white_light');
  createVoxelPlatform(40, 'pink_light');
  createVoxelPlatform(30, 'indigo_light');
  createVoxelPlatform(20, 'purple');
  createVoxelPlatform(10, 'yellow_light');
}

//摧毁方块
function explodeVoxel(position) {
  var x1 = position.x - 3;
  var x2 = position.x + 2.5;
  var z1 = position.z - 3;
  var z2 = position.z + 2.5;
  var y1 = position.y - 3;
  var y2 = position.y + 2.5;
  for (let i = x1; i < x2; ) {
    for (let k = y1; k < y2; ) {
      for (let q = z1; q < z2; ) {
        var voxelName = voxels.name(voxels.getVoxelId(i, k, q));
        if (voxelName !== 'air') {
          voxels.setVoxel(i, k, q, 'air');
        }
        q++;
      }
      k++;
    }
    i++;
  }
  // 触发 TNT 回调
  try {
    _callTNTExplosionCallbacks(position, {});
  } catch (e) {
    console.warn('tnt callback call failed', e);
  }
}

// TNT/爆炸回调机制：允许注册函数在每次 explodeVoxel 后被调用（例如触发事件、生成实体等）
const tntExplosionCallbacks: Array<Function> = [];
function onTNTExplode(callback: Function) {
  if (typeof callback === 'function') tntExplosionCallbacks.push(callback);
}

// 调用回调（内部使用）
function _callTNTExplosionCallbacks(position, meta) {
  try {
    for (const cb of tntExplosionCallbacks) {
      try {
        cb(position, meta);
      } catch (e) {
        console.warn('tnt callback error', e);
      }
    }
  } catch (e) {
    console.warn('callTNT callbacks failed', e);
  }
}

//摧毁玩家
function explodePlayer(position) {
  for (const k of world.querySelectorAll('player')) {
    if (k.position.distance(position) <= 8) {
      k.hurt(Math.round(12 / k.position.distance(position)), {
        damageType: i18n.t('damage.tnt_explosion'),
      });
      var direction = k.position.sub(position);
      var dist = direction.mag();
      var speed = 1;
      k.velocity.x = (direction.x * speed) / dist;
      k.velocity.z = (direction.z * speed) / dist;
      k.velocity.y += 1.25;
    }
  }
}

//生成TNT
async function summonTNT() {
  // 创建TNT实体
  const tnt = world.createEntity({
    mesh: 'mesh/TNT.vb',
    meshScale: [0.12, 0.12, 0.12],
    meshEmissive: 0,
    fixed: false,
    collides: true,
    gravity: true,
  });
  tnt.addTag('TNT');
  // 增强位置生成随机性：扩大范围的随机位置 + 带偏移的玩家位置
  const positions = [];

  // 添加20个范围更大、y坐标也随机的位置
  for (let i = 0; i < 20; i++) {
    positions.push({
      x: 20 + Math.random() * 90, // 扩大x范围到20-110
      y: 80 + Math.random() * 60, // y范围随机化到80-140
      z: 20 + Math.random() * 90, // 扩大z范围到20-110
    });
  }

  // 添加带随机偏移的玩家位置（如果有玩家在游戏中）
  for (const player of world.querySelectorAll('player')) {
    if (PlayerInGame.includes(player.player.name)) {
      // 为玩家位置添加±15的随机偏移，避免总是精确落在玩家位置
      positions.push({
        x: player.position.x + (Math.random() * 30 - 15),
        y: 100 + Math.random() * 40, // y坐标也随机化
        z: player.position.z + (Math.random() * 30 - 15),
      });
    }
  }

  // 随机选择一个位置
  tnt.position.copy(positions[Math.floor(Math.random() * positions.length)]);

  // 简化闪烁效果
  tnt.int = setInterval(() => {
    tnt.meshEmissive = tnt.meshEmissive === 0 ? 0.5 : 0;
  }, 1000);

  // 简化爆炸逻辑
  tnt.onVoxelContact(async () => {
    if (tnt.boom) return;
    tnt.boom = true;
    tnt.addTag(i18n.t('tag.about_to_explode'));
    await sleep(2000);

    // 简化放大动画
    for (let i = 0; i < 15; i++) {
      tnt.meshScale.x += 0.003;
      tnt.meshScale.y += 0.003;
      tnt.meshScale.z += 0.003;
      await sleep(15);
    }

    // 执行爆炸
    explodeVoxel(tnt.position);
    explodePlayer(tnt.position);
    tnt.destroy();
  });
}

//重置玩家
function resetPlayer(entity) {
  entity.enableDamage = true;
  entity.maxHp = 100;
  entity.hp = entity.maxHp;
  entity.player.enable3DCursor = true;
  entity.player.runSpeed = 0.3;
  entity.player.walkSpeed = entity.player.runSpeed;
  entity.player.canFly = false;
  entity.player.spectator = false;
  entity.player.invisible = false;
  entity.player.showName = true;
  entity.skillCold = 0;
}

//观战模式玩家
function cleanPlayer(entity) {
  entity.player.canFly = true;
  entity.player.runSpeed = 0.4;
  entity.player.walkSpeed = entity.player.runSpeed;
  entity.player.spectator = true;
  entity.player.invisible = true;
  entity.player.showName = false;
  entity.hp = entity.maxHp;
  entity.skillCold = 0;
}

var PlayerInGame = [];
var isSinglePlayer = false; // 游戏模式标记：true为单人，false为多人
var playerCount = 0; // 修复：定义playerCount变量

world.onPlayerJoin(async ({ entity }) => {
  entity.player.forceRespawn();
  await cleanPlayer(entity);

  // 历史记录功能已删除
});

world.onPlayerLeave(async ({ entity }) => {
  if (PlayerInGame.includes(entity.player.name)) {
    PlayerInGame.splice(PlayerInGame.indexOf(entity.player.name), 1);
    if (PlayerInGame.length > 0) {
      world.say(
        entity.player.name +
          ' ' +
          i18n.t('player_scared') +
          ' ' +
          PlayerInGame.length +
          ' ' +
          i18n.t('game.remaining_players')
      );
    }
  }
});

var skillList = [
  {
    name: i18n.t('skill.old_shoes.name'),
    introduce: i18n.t('skill.old_shoes.introduce'),
    notice: i18n.t('skill.old_shoes.notice'),
    cold: 15000,
    async effect(entity, raycast) {
      // 保存原始跳跃高度
      const originalJumpHeight = entity.player.jumpHeight || 1;

      // 增加速度
      entity.player.runSpeed += 0.4;
      entity.player.walkSpeed = entity.player.runSpeed;
      // 增加跳跃高度
      entity.player.jumpHeight = 2.5; // 默认跳跃高度的2.5倍

      Object.assign(entity, {
        particleRate: 999,
        particleColor: new GameRGBColor(1, 1, 1),
        particleLifetime: 0.3,
        particleSize: [5, 4, 3, 2, 2],
      });

      await sleep(5000);

      // 恢复原始速度
      if (entity.player.runSpeed > 0.4) {
        entity.player.runSpeed -= 0.4;
        entity.player.walkSpeed = entity.player.runSpeed;
      }
      // 恢复原始跳跃高度
      entity.player.jumpHeight = originalJumpHeight;

      entity.player.directMessage(i18n.t('skill.old_shoes.effect_end'));
      Object.assign(entity, {
        particleRate: 0,
      });
    },
  },
  {
    name: i18n.t('skill.heal.name'),
    introduce: i18n.t('skill.heal.introduce'),
    notice: i18n.t('skill.heal.notice'),
    cold: 40000,
    async effect(entity, raycast) {
      entity.hp += 70;
      if (entity.hp > entity.maxHp) {
        entity.hp = entity.maxHp;
      }
    },
  },
  {
    name: i18n.t('skill.dash.name'),
    introduce: i18n.t('skill.dash.introduce'),
    notice: i18n.t('skill.dash.notice'),
    cold: 60000,
    async effect(entity, raycast) {
      if (raycast) {
        var k = raycast.hitPosition;
        var direction = k.sub(entity.position);
        var dist = direction.mag();
        var speed = 2;
        if (raycast.hitEntity && raycast.hitEntity.isPlayer) {
          raycast.hitEntity.velocity.x = (direction.x * speed) / dist;
          raycast.hitEntity.velocity.z = (direction.z * speed) / dist;
          raycast.hitEntity.velocity.y += 1;
          raycast.hitEntity.player.directMessage(
            i18n.t('skill.dash.hit_message', { player: entity.player.name })
          );
        }
        entity.velocity.x = (direction.x * speed) / dist;
        entity.velocity.z = (direction.z * speed) / dist;
        entity.velocity.y = 0;
      }
    },
  },
  {
    name: i18n.t('skill.chorus_fruit.name'),
    introduce: i18n.t('skill.chorus_fruit.introduce'),
    notice: i18n.t('skill.chorus_fruit.notice'),
    cold: 60000,
    async effect(entity, raycast) {
      var list = [];
      for (let i = 35; i < 85; i++) {
        for (let y = 0; y < 60; y++) {
          for (let q = 35; q < 85; q++) {
            var voxelName = voxels.name(voxels.getVoxelId(i, y, q));
            if (voxelName !== 'air') {
              list.push({ x: i, y: y, z: q });
            }
          }
        }
      }
      entity.position.copy(list[Math.floor(Math.random() * list.length)]);
      entity.position.y += 2;
    },
  },
  {
    name: i18n.t('skill.bounce_tnt.name'),
    introduce: i18n.t('skill.bounce_tnt.introduce'),
    notice: i18n.t('skill.bounce_tnt.notice'),
    cold: 60000,
    async effect(entity, raycast) {
      // 弹走TNT
      for (const k of world.querySelectorAll('.TNT')) {
        if (k.position.distance(entity.position) <= 4) {
          var direction = k.position.sub(entity.position);
          var dist = direction.mag();
          var speed = 0.6;
          k.velocity.x = (direction.x * speed) / dist;
          k.velocity.z = (direction.z * speed) / dist;
          k.velocity.y += 1;
        }
      }
      // 弹走蝙蝠
      for (const bat of world.querySelectorAll('.bat')) {
        if (
          bat.position &&
          entity.position &&
          bat.position.distance(entity.position) <= 4
        ) {
          var direction = bat.position.sub(entity.position);
          var dist = direction.mag();
          var speed = 0.8; // 蝙蝠弹得更远一些
          bat.velocity.x = (direction.x * speed) / dist;
          bat.velocity.z = (direction.z * speed) / dist;
          bat.velocity.y += 1.5; // 蝙蝠飞得更高一些
        }
      }
    },
  },

  {
    name: i18n.t('skill.safe_platform.name'),
    introduce: i18n.t('skill.safe_platform.introduce'),
    notice: i18n.t('skill.safe_platform.notice'),
    cold: 114514000,
    async effect(entity, raycast) {
      entity.skillCold = 0;
    },
  },
  {
    name: i18n.t('skill.cat_trap.name'),
    introduce: i18n.t('skill.cat_trap.introduce'),
    notice: i18n.t('skill.cat_trap.notice'),
    cold: 60000,
    async effect(entity, raycast) {
      world.querySelectorAll('player').forEach(async (k) => {
        if (k.position.distance(entity.position) <= 10) {
          if (k == entity) return;
          k.player.directMessage(
            i18n.t('skill.cat_trap.effect_start', {
              player: entity.player.name,
            })
          );
          k.player.cameraFovY = 5;
          await sleep(10000);
          k.player.cameraFovY = 0.25;
          k.player.directMessage(i18n.t('skill.cat_trap.effect_end'));
        }
      });
    },
  },
  {
    name: i18n.t('skill.spider_man.name'),
    introduce: i18n.t('skill.spider_man.introduce'),
    notice: i18n.t('skill.spider_man.notice'),
    cold: 15000,
    async effect(entity, raycast) {
      if (raycast) {
        // 发射蛛丝视觉效果
        entity.player.directMessage(i18n.t('skill.spider_man.shoot_web'));

        // 获取目标位置
        const targetPos = raycast.hitEntity
          ? raycast.hitEntity.position
          : raycast.hitPosition;
        const direction = targetPos.sub(entity.position);
        const dist = direction.mag();

        // 显示蛛丝路径 - 创建从玩家到目标的连续粒子效果
        const steps = Math.ceil(dist * 2); // 根据距离计算粒子数量
        const normalizedDir = direction.div(dist); // 标准化方向向量
        const pullDistanceThreshold = 4; // 碰到玩家的距离阈值

        // 创建一个临时实体作为路径粒子发射器
        const pathEmitter = world.createEntity({
          mesh: 'mesh/white_light.vb', // 使用简单的白色方块作为粒子发射器
          meshScale: [0.1, 0.1, 0.1],
          fixed: false,
          collides: false,
          position: entity.position,
        });

        // 为临时发射器设置高频率粒子
        Object.assign(pathEmitter, {
          particleRate: 999,
          particleColor: new GameRGBColor(0.9, 0.9, 0.9),
          particleLifetime: 0.5,
          particleSize: [3, 2, 1, 0.5, 0.2],
        });

        // 沿路径移动临时发射器
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          const particlePos = entity.position.add(normalizedDir.mul(t * dist));

          // 更新发射器位置
          pathEmitter.position.copy(particlePos);

          // 检查该位置是否有其他玩家
          world.querySelectorAll('player').forEach((otherEntity) => {
            // 只处理其他玩家实体，排除自己
            if (otherEntity !== entity) {
              const playerDist = otherEntity.position.sub(particlePos).mag();

              // 如果玩家在蛛丝路径附近
              if (playerDist <= pullDistanceThreshold) {
                // 计算玩家到发射者的方向
                const pullDirection = entity.position.sub(otherEntity.position);
                const pullDist = pullDirection.mag();

                // 设置被碰到玩家的速度，拉向发射者
                otherEntity.velocity.x = (pullDirection.x * 1.5) / pullDist;
                otherEntity.velocity.z = (pullDirection.z * 1.5) / pullDist;
                otherEntity.velocity.y = Math.max(
                  0.5,
                  (pullDirection.y * 1.5) / pullDist
                );

                // 通知被拉的玩家
                if (otherEntity.player) {
                  otherEntity.player.directMessage(
                    i18n.t('skill.spider_man.pull_message', {
                      player: entity.player.name,
                    })
                  );
                }
              }
            }
          });

          // 短暂延迟确保粒子连续显示
          await sleep(5);
        }

        // 清理临时发射器
        setTimeout(() => {
          pathEmitter.destroy();
        }, 1000);

        // 判断是否击中实体
        if (raycast.hitEntity) {
          // 击中实体，拉拽玩家到实体位置

          // 如果是玩家，通知被击中的玩家并给予向发射者移动的速度
          if (raycast.hitEntity.isPlayer) {
            raycast.hitEntity.player.directMessage(
              i18n.t('skill.spider_man.catch_message', {
                player: entity.player.name,
              })
            );
            // 计算被击中玩家到发射者的方向（反向）
            const pullDirection = entity.position.sub(
              raycast.hitEntity.position
            );
            const pullDist = pullDirection.mag();
            // 给予被击中玩家向发射者移动的速度
            raycast.hitEntity.velocity.x = (pullDirection.x * 1.5) / pullDist;
            raycast.hitEntity.velocity.z = (pullDirection.z * 1.5) / pullDist;
            raycast.hitEntity.velocity.y = Math.max(
              0.3,
              (pullDirection.y * 1.5) / pullDist
            );
          }

          // 设置玩家速度，向实体飞去
          entity.velocity.x = (direction.x * 2) / dist;
          entity.velocity.z = (direction.z * 2) / dist;
          entity.velocity.y = Math.max(0.5, (direction.y * 2) / dist);
        } else {
          // 击中方块或空地，玩家向目标位置弹去

          // 设置玩家速度，向目标弹去
          entity.velocity.x = (direction.x * 1.5) / dist;
          entity.velocity.z = (direction.z * 1.5) / dist;
          entity.velocity.y = Math.max(1, (direction.y * 1.5) / dist + 0.5); // 额外添加y轴速度确保可以弹起
        }

        // 添加玩家周围的蛛丝特效
        Object.assign(entity, {
          particleRate: 50,
          particleColor: new GameRGBColor(0.8, 0.8, 0.8),
          particleLifetime: 0.5,
          particleSize: [3, 2, 1, 0.5, 0.2],
        });

        // 短暂延迟后移除特效
        await sleep(1000);
        Object.assign(entity, { particleRate: 0 });
      } else {
        entity.player.directMessage(i18n.t('skill.spider_man.miss_message'));
      }
    },
  },
  {
    name: i18n.t('skill.self_sustain.name'),
    introduce: i18n.t('skill.self_sustain.introduce'),
    notice: i18n.t('skill.self_sustain.notice'),
    cold: 114514000, // 大冷却值表示被动技能
    async effect(entity, raycast) {
      entity.skillCold = 0; // 被动技能无需冷却
    },
  },
];

//获取技能信息
function getSkill(name) {
  var object = Object.values(skillList).find((e) => e.name == name);
  if (object) {
    return object;
  } else {
    return null;
  }
}

world.onPress(async ({ button, entity, raycast }) => {
  if (button == 'action0') {
    //左键释放技能或切换技能
    if (!PlayerInGame.includes(entity.player.name) || !worldInGame) {
      // 赛外 - 切换技能
      var list = [];
      for (let i = 0; i < skillList.length; i++) {
        list.push(skillList[i].name);
      }
      const select = await entity.player.dialog({
        type: 'select',
        content: i18n.t('gui.switch_skill_prompt') + entity.skill,
        options: list,
      });
      if (select) {
        var skill = getSkill(select.value); // 移除 await，因为 getSkill 不是异步函数
        if (skill) {
          // 添加空值检查
          const sel = await entity.player.dialog({
            type: 'select',
            title: select.value,
            content:
              skill.introduce +
              `\n` +
              'CD:' +
              skill.cold / 1000 +
              i18n.t('unit.second') +
              `\n` +
              `注意事项:` +
              skill.notice,
            options: [i18n.t('gui.switch_to_skill')],
          });
          if (sel) {
            entity.skill = select.value;
            entity.player.directMessage(
              i18n.t('gui.switch_skill_success', { skill: select.value })
            );
          }
        }
      }
    } else {
      // 赛内 - 释放技能
      if (entity.skillCold > 0) {
        entity.player.directMessage(
          i18n.t('skill_cooldown', {
            time: (entity.skillCold / 1000).toFixed(1),
          })
        );
        return;
      }
      var skill = getSkill(entity.skill); // 移除 await，因为 getSkill 不是异步函数
      if (skill) {
        entity.skillCold = skill.cold;
        await skill.effect(entity, raycast);
        entity.player.directMessage(
          i18n.t('skill_used', { skill: entity.skill })
        );
      }
    }
  }
  if (button == 'action1') {
    //右键查看时间或加入游戏
    if (!worldInGame) {
      //赛外 - 加入游戏菜单
      const joinOption = await entity.player.dialog({
        type: 'select',
        title: i18n.t('gui.join_game_title'),
        content: i18n.t('gui.join_game_content'),
        options: [i18n.t('gui.join_game_now'), i18n.t('gui.cancel')],
      });

      if (joinOption && joinOption.index === 0) {
        // 立即加入游戏
        if (!PlayerInGame.includes(entity.player.name)) {
          PlayerInGame.push(entity.player.name);
          // 只给自己发送消息，不再广播
          entity.player.directMessage(i18n.t('game.join_success'));
        } else {
          entity.player.directMessage(i18n.t('game.already_joined'));
          return;
        }

        // 删除历史记录功能

        // 首次加入，游戏将在10秒后开始
        if (PlayerInGame.length === 1) {
          world.say(
            i18n.t('game.player_joined_starting', {
              player: entity.player.name,
            })
          );
          isSinglePlayer = true; // 标记为单人游戏

          // 10秒倒计时提醒
          let countdown = 10;
          const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
              world.say(
                i18n.t('game.countdown', {
                  countdown,
                  players: PlayerInGame.length,
                  mode: isSinglePlayer
                    ? i18n.t('game.single_player_mode')
                    : i18n.t('game.multi_player_mode'),
                })
              );
            }
          }, 1000);

          // 设置10秒后开始游戏的定时器
          setTimeout(() => {
            clearInterval(countdownInterval);
            if (!worldInGame) {
              world.say(i18n.t('game.game_started'));
              startGame();
            }
          }, 10000);
        } else {
          // 从单人模式转变为多人模式
          if (isSinglePlayer && PlayerInGame.length > 1) {
            world.say(
              i18n.t('game.multiplayer_started', { player: PlayerInGame[0] })
            );
            isSinglePlayer = false;
          }
          world.say(
            i18n.t('game.player_joined', {
              player: entity.player.name,
              count: PlayerInGame.length,
              mode: isSinglePlayer
                ? i18n.t('game.single_player_mode_simple')
                : i18n.t('game.multi_player_mode_simple'),
            })
          );
        }
      }
    } else {
      // 赛内查看时间信息
      // 计算真实已进行时间（基于全局开始时间戳）
      const now = Date.now();
      const elapsedMs =
        gameStartTime > 0 ? now - gameStartTime : worldTime * 1000;
      const totalSeconds = Math.floor(elapsedMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      // 使用 world.say 在屏幕上方显示赛内信息（不弹对话或私信）
      world.say(
        i18n.t('game.game_info', {
          minutes,
          seconds,
          players: PlayerInGame.length,
          blocks: countBlocks(),
        })
      );
    }
  }
});

// 游戏控制变量
var worldInGame = false;
var worldCold = 150;
var worldNum = 10;
var worldTime = 0;
var gameInterval = null;
var gameStartTime = 0; // 全局游戏开始时间戳（毫秒）
var batInterval = null;
const activeBats: any[] = [];
// 调节TNT生成频率的因子（>1 表示更慢，<1 表示更快）
var tntSlowFactor = 0.01;
// 蝙蝠飞行高度限制（可调）：蝙蝠只会在此区间内生成和飞行
var batMinY = 10;
var batMaxY = 60;

// 召唤一只会飞的蝙蝠，随机移动，撞玩家扣血，撞方块触发爆炸，并有生存时间限制
function summonBat(count = 1) {
  try {
    for (let bidx = 0; bidx < count; bidx++) {
      const bat = world.createEntity({
        mesh: 'mesh/bat.vb',
        meshScale: [0.12, 0.12, 0.12],
        fixed: false,
        collides: true,
        gravity: false,
        position: {
          x: 60 + (Math.random() - 0.5) * 40,
          y: 50 + Math.random() * 10,
          z: 60 + (Math.random() - 0.5) * 40,
        },
      });
      bat.addTag('bat');
      bat.isBat = true;
      bat.velocity = {
        x: (Math.random() - 0.5) * 0.6,
        y: (Math.random() - 0.2) * 0.4,
        z: (Math.random() - 0.5) * 0.6,
      };
      activeBats.push(bat);

      // 设置随机生存时间（30-60秒）
      const lifespan = 30000 + Math.random() * 30000; // 30000-60000毫秒
      bat.lifespanTimer = setTimeout(async () => {
        try {
          if (!bat || bat.destroyed) return;

          // 自爆前的警告效果
          bat.addTag(i18n.t('entity.bat.self_destruct'));

          // 短暂延迟后自爆
          await sleep(500);

          // 执行自爆
          explodeVoxel(bat.position);

          // 清除所有相关定时器并销毁蝙蝠
          if (bat.movementTimer) clearInterval(bat.movementTimer);
          if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
          bat.destroy();
        } catch (e) {
          console.warn(i18n.t('errors.bat_explosion'), e);
        }
      }, lifespan);

      // 每 100ms 微调整体方向并检查碰撞
      const t = setInterval(async () => {
        // 将移动定时器赋值给蝙蝠对象，方便后续管理
        bat.movementTimer = t;
        try {
          if (!bat || bat.destroyed) {
            clearInterval(t);
            return;
          }

          // 微随机方向调整
          bat.velocity.x += (Math.random() - 0.5) * 0.2;
          bat.velocity.y += (Math.random() - 0.5) * 0.1;
          bat.velocity.z += (Math.random() - 0.5) * 0.2;

          // 限制速度
          const maxSpeed = 1.2;
          const mag =
            Math.sqrt(
              bat.velocity.x * bat.velocity.x +
                bat.velocity.y * bat.velocity.y +
                bat.velocity.z * bat.velocity.z
            ) || 1;
          if (mag > maxSpeed) {
            bat.velocity.x = (bat.velocity.x / mag) * maxSpeed;
            bat.velocity.y = (bat.velocity.y / mag) * maxSpeed;
            bat.velocity.z = (bat.velocity.z / mag) * maxSpeed;
          }

          // 简单移动
          if (bat.position && bat.velocity) {
            // 寻找最近的玩家并匹配其高度
            let nearestPlayer = null;
            let nearestDistance = Infinity;

            // 找到最近的非观战玩家
            for (const p of world.querySelectorAll('player')) {
              // 只考虑非观战玩家
              if (
                !p.player.spectator &&
                p.position &&
                p.position.distance &&
                p.position.distance(bat.position) < nearestDistance
              ) {
                nearestDistance = p.position.distance(bat.position);
                nearestPlayer = p;
              }
            }

            // 如果有玩家，调整蝙蝠高度以匹配玩家并朝向玩家
            if (nearestPlayer && nearestPlayer.position) {
              const heightDiff = bat.position.y - nearestPlayer.position.y;

              // 根据高度差调整蝙蝠的垂直速度
              if (Math.abs(heightDiff) > 1) {
                // 只有当高度差大于1格时才调整
                // 向玩家高度靠拢
                bat.velocity.y = -heightDiff * 0.2; // 比例调整，高度差越大，调整越快

                // 限制垂直速度范围，避免过快或过慢
                bat.velocity.y = Math.max(-0.5, Math.min(0.5, bat.velocity.y));
              }

              // 计算蝙蝠朝向最近玩家的角度
              const dx = nearestPlayer.position.x - bat.position.x;
              const dz = nearestPlayer.position.z - bat.position.z;

              // 计算水平方向的角度（y轴旋转）
              // Math.atan2返回弧度值，需要转换为游戏引擎使用的角度值
              const yaw = Math.atan2(dz, dx); // 计算水平旋转角度

              // 设置蝙蝠的朝向
              // 假设实体有rotation属性，其中rotation.y控制水平朝向
              if (bat.rotation) {
                bat.rotation.y = yaw; // 设置水平旋转

                // 可选：根据高度差调整俯仰角（rotation.x）
                if (Math.abs(heightDiff) > 0.5) {
                  const pitch = Math.atan2(
                    heightDiff,
                    Math.sqrt(dx * dx + dz * dz)
                  );
                  bat.rotation.x = pitch; // 设置俯仰角
                }
              }
            }

            // 应用移动
            bat.position.x += bat.velocity.x;
            bat.position.y += bat.velocity.y;
            bat.position.z += bat.velocity.z;
          }

          // 限定飞行边界并在越界时反弹（x,z: 40..80, y: batMinY..batMaxY）
          try {
            const minX = 40,
              maxX = 80,
              minZ = 40,
              maxZ = 80;
            const minY = batMinY,
              maxY = batMaxY;
            if (bat.position.x < minX) {
              bat.position.x = minX;
              bat.velocity.x = -bat.velocity.x * 0.7;
            }
            if (bat.position.x > maxX) {
              bat.position.x = maxX;
              bat.velocity.x = -bat.velocity.x * 0.7;
            }
            if (bat.position.z < minZ) {
              bat.position.z = minZ;
              bat.velocity.z = -bat.velocity.z * 0.7;
            }
            if (bat.position.z > maxZ) {
              bat.position.z = maxZ;
              bat.velocity.z = -bat.velocity.z * 0.7;
            }
            if (bat.position.y < minY) {
              bat.position.y = minY;
              bat.velocity.y = -bat.velocity.y * 0.7;
            }
            if (bat.position.y > maxY) {
              bat.position.y = maxY;
              bat.velocity.y = -bat.velocity.y * 0.7;
            }
          } catch (e) {
            // 忽略边界修正错误
          }
          // 检查与玩家的碰撞与追踪行为
          for (const p of world.querySelectorAll('player')) {
            try {
              // 只考虑非观战玩家
              if (
                !p.player.spectator &&
                p.position &&
                bat.position &&
                p.position.distance
              ) {
                const dist = p.position.distance(bat.position);
                // 当距离玩家6格范围内时，蝙蝠会自爆（爆炸范围覆盖）
                if (dist <= 6.0) {
                  // 自爆前的警告效果
                  bat.addTag(i18n.t('entity.bat.self_destruct'));

                  // 短暂延迟后自爆
                  await sleep(300);

                  // 对玩家造成伤害
                  if (p.hurt)
                    p.hurt(3, { damageType: i18n.t('damage.bat_impact') });
                  // 只给被击中的玩家发送消息，不再广播给所有人
                  p.player.directMessage(i18n.t('game.bat_hit'));

                  // 执行自爆
                  explodeVoxel(bat.position);

                  // 清除生存时间定时器
                  if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
                  bat.destroy();
                  clearInterval(t);
                  break;
                }

                // 若靠近玩家（但未碰撞），蝙蝠会加速追赶
                const interestRadius = 12;
                if (dist <= interestRadius) {
                  const heightDiff = bat.position.y - p.position.y;

                  // 同一高度时冲锋（高度差小于1格）
                  if (Math.abs(heightDiff) < 1) {
                    // 冲锋模式：大幅提高水平速度
                    bat.velocity.x *= 4.0;
                    bat.velocity.z *= 4.0;
                    bat.velocity.y *= 0.5; // 轻微调整垂直速度
                  } else {
                    // 普通加速追赶
                    bat.velocity.x *= 2.5;
                    bat.velocity.z *= 2.5;

                    // 高度控制 - 向玩家高度靠拢
                    // 当高度差大于1格时，调整垂直速度向玩家高度靠拢
                    if (Math.abs(heightDiff) > 1) {
                      // 向玩家高度靠拢的速度，与高度差成正比
                      const heightAdjustment = -heightDiff * 0.3; // 0.3为调整系数，可根据需要调整
                      // 限制调整速度
                      bat.velocity.y = Math.max(
                        -0.6,
                        Math.min(0.6, heightAdjustment)
                      );
                    }
                  }
                  // 保持TNT生成频率，让局势更紧张时TNT更多
                  // 在下一次迭代让速度回落一点，避免指数增长
                  setTimeout(() => {
                    try {
                      // 根据是否进入过冲锋模式调整回落系数
                      const isCharging = Math.abs(heightDiff) < 1;
                      bat.velocity.x *= isCharging ? 0.4 : 0.6; // 冲锋后回落更快
                      bat.velocity.y *= 0.7;
                      bat.velocity.z *= isCharging ? 0.4 : 0.6;
                      // 不调整TNT生成频率，保持高频率
                    } catch (e) {}
                  }, 800);
                }
              }
            } catch (e) {
              // 忽略单个玩家检查错误
            }
          }

          // 检查与方块的接触（四周小范围检测）
          try {
            const bx = Math.round(bat.position.x);
            const by = Math.round(bat.position.y);
            const bz = Math.round(bat.position.z);
            const voxelName = voxels.name(voxels.getVoxelId(bx, by, bz));
            if (voxelName && voxelName !== 'air') {
              // 碰到方块，爆炸并销毁蝙蝠
              explodeVoxel(bat.position);
              // 清除生存时间定时器
              if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
              bat.destroy();
              clearInterval(t);
            }
          } catch (e) {
            // 忽略方块检测错误
          }
        } catch (e) {
          console.warn(i18n.t('errors.bat_interval'), e);
        }
      }, 100);
    }
  } catch (e) {
    console.error(i18n.t('errors.cannot_summon_bat'), e);
  }
}

// 统计区域内剩余方块数量（性能友好实现：扫描限定区域）
function countBlocks() {
  try {
    let cnt = 0;
    // 与 randoestroyVoxels 使用的区域保持一致，避免全图扫描
    for (let x = 30; x <= 90; x++) {
      for (let y = 0; y < 60; y++) {
        for (let z = 30; z <= 90; z++) {
          try {
            if (voxels.name(voxels.getVoxelId(x, y, z)) !== 'air') cnt++;
          } catch (e) {
            // 忽略单次访问错误，继续
          }
        }
      }
    }
    return cnt;
  } catch (e) {
    console.warn(i18n.t('errors.count_blocks_failed'), e);
    return 0;
  }
}

// 开始游戏函数
async function startGame() {
  // 最终确认游戏模式并更新playerCount
  playerCount = PlayerInGame.length;
  if (playerCount === 1) {
    isSinglePlayer = true;
    world.say(i18n.t('game.confirm_single_player'));
  } else {
    isSinglePlayer = false;
    world.say(i18n.t('game.confirm_multi_player'));
  }

  // 游戏开始，记录全局开始时间
  gameStartTime = Date.now();

  // 游戏开始
  await reset();
  worldCold = 15; // 初始TNT生成间隔（秒）- 下调初始频率
  worldNum = 10; // 初始方块的破碎数量
  worldTime = 0;
  worldInGame = true;

  world.querySelectorAll('player').forEach(async (e) => {
    e.player.cancelDialogs();
    if (PlayerInGame.includes(e.player.name)) {
      e.position.set(45 + Math.random() * 35, 52.5, 45 + Math.random() * 35);
      await resetPlayer(e);
    }
  });

  world.say(
    i18n.t('game.game_start', {
      mode: isSinglePlayer ? i18n.t('game.single') : i18n.t('game.multi'),
    })
  );
  world.querySelectorAll('.TNT').forEach(async (i) => {
    i.destroy();
  });

  // 清理之前的定时器
  if (gameInterval) clearInterval(gameInterval);

  // TNT生成定时器 - 直接使用worldCold作为间隔时间
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(async () => {
    try {
      if (!worldInGame) return;
      summonTNT();
    } catch (e) {
      console.warn(i18n.t('errors.tnt_timer'), e);
    }
  }, worldCold * 1000); // 使用worldCold作为间隔（秒转毫秒）

  // 游戏主循环中会更新worldCold，这里不再需要累加器

  // 每20秒召唤一只蝙蝠（赛内扰乱）
  if (batInterval) clearInterval(batInterval);
  batInterval = setInterval(() => {
    if (worldInGame) {
      const count = Math.floor(Math.random() * 5) + 1; // 1..5
      summonBat(count);
      world.say(i18n.t('game.summon_bats', { count }));
    }
  }, 20000);

  // 游戏主循环
  const maxGameTime = 15 * 60; // 最大游戏时间15分钟

  while (Date.now() - gameStartTime < maxGameTime * 1000) {
    // 检查是否应该提前结束（所有玩家死亡）
    if (PlayerInGame.length === 0) {
      break;
    }

    // 如果是单人游戏且达到5分钟，结束游戏
    if (isSinglePlayer && worldTime >= 300) {
      break;
    }

    // 每15秒增加难度
    if (worldTime % 15 === 0 && worldTime > 0) {
      // 每30秒增加一次方块破碎数量
      if (worldTime % 30 === 0) {
        worldNum = Math.min(30, worldNum + 5); // 增加方块破碎数量
        randoestroyVoxels(worldNum);
      }

      // 每15秒减少2秒TNT生成间隔（频率加快）
      const oldWorldCold = worldCold;
      worldCold = Math.max(3, worldCold - 2); // 最低保持3秒间隔

      // 如果间隔改变了，更新TNT定时器
      if (oldWorldCold !== worldCold && gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(async () => {
          try {
            if (!worldInGame) return;
            summonTNT();
          } catch (e) {
            console.warn(i18n.t('error.tnt_timer'), ':', e);
          }
        }, worldCold * 1000);
      }
    }

    // 每5分钟显示进度
    if (worldTime % 300 === 0 && worldTime > 0) {
      world.say(i18n.t('game.minutes_passed', { minutes: worldTime / 300 }));
    }

    worldTime++;
    // 每5秒检查一次剩余方块，若小于等于阈值则提前结束并判定剩余玩家为胜者
    if (worldTime % 5 === 0) {
      try {
        const remaining = countBlocks();
        if (remaining <= 50) {
          world.say(i18n.t('game.blocks_remaining_end'));
          // 历史记录功能已删除
          break;
        }
      } catch (e) {
        console.warn(i18n.t('errors.checking_blocks'), e);
      }
    }
    await sleep(1000); // 保持1秒间隔
  }

  // 游戏结束
  if (gameInterval) clearInterval(gameInterval);
  if (batInterval) {
    clearInterval(batInterval);
    batInterval = null;
  }
  // 销毁所有残留的蝙蝠实体
  try {
    activeBats.forEach((b) => {
      try {
        if (b && b.destroy) b.destroy();
      } catch (e) {}
    });
    activeBats.length = 0;
  } catch (e) {
    console.warn(i18n.t('errors.cleaning_bats'), e);
  }
  world.querySelectorAll('.TNT').forEach(async (i) => i.destroy());

  // 记录完成情况
  if (PlayerInGame.length === 0) {
    world.say(i18n.t('game.game_over_all_dead'));
  } else {
    if (isSinglePlayer) {
      if (worldTime >= 300) {
        world.say(
          i18n.t('game.single_player_victory', { player: PlayerInGame[0] })
        );
      } else {
        const minutes = Math.floor(worldTime / 60);
        const seconds = worldTime % 60;
        world.say(
          i18n.t('game.single_player_end', {
            player: PlayerInGame[0],
            minutes,
            seconds,
          })
        );
      }
    } else {
      // 多人游戏特殊处理：只剩一人时明确提示胜利
      if (PlayerInGame.length === 1) {
        world.say(
          i18n.t('game.multi_player_victory', { player: PlayerInGame[0] })
        );
      } else {
        world.say(
          i18n.t('game.multi_player_end', { players: PlayerInGame.join(', ') })
        );
      }
    }
  }

  // 历史记录功能已删除

  worldInGame = false;
  world.querySelectorAll('player').forEach(async (e) => {
    e.enableDamage = false;
    if (PlayerInGame.includes(e.player.name)) {
      e.player.forceRespawn();
      cleanPlayer(e);
    }
  });

  PlayerInGame = [];
  isSinglePlayer = false; // 重置游戏模式
  playerCount = 0; // 重置playerCount
  await sleep(2500);
  await cleanWorldVoxels();
  await reset();
}

// 虚空检测和自救平台技能
setInterval(() => {
  world.querySelectorAll('*').forEach((e) => {
    if (e.position.y <= -20 || (e.isPlayer && e.position.y >= 100)) {
      if (e.isPlayer) {
        if (
          worldInGame &&
          e.skill === i18n.t('skill.safe_platform.name') &&
          e.skillCold <= 0
        ) {
          try {
            var skill = getSkill(e.skill);
            if (skill) {
              e.skillCold = skill.cold;

              // 创建5x5平台
              var platformCenterX = Math.floor(Math.random() * 50) + 35;
              var platformCenterZ = Math.floor(Math.random() * 50) + 35;

              for (let x = platformCenterX - 2; x <= platformCenterX + 2; x++) {
                for (
                  let z = platformCenterZ - 2;
                  z <= platformCenterZ + 2;
                  z++
                ) {
                  for (let y = 10; y <= 12; y++) {
                    voxels.setVoxel(x, y, z, 'yellow_light');
                  }
                }
              }

              e.position.set(platformCenterX, 12, platformCenterZ);
              e.player.directMessage(
                i18n.t('game.skill_rescue_platform_triggered')
              );
            } else {
              e.hurt(999, { damageType: i18n.t('game.fell_into_void') });
            }
          } catch (error) {
            console.error('Error in rescue platform:', error);
            e.hurt(999, { damageType: i18n.t('game.fell_into_void') });
          }
        } else {
          e.hurt(999, { damageType: i18n.t('game.blown_into_void') });
        }
      } else {
        e.destroy();
      }
    }

    if (e.isPlayer) {
      e.skillCold = Math.max(0, e.skillCold - 500);

      // 自力更生被动技能：每5秒回复生命值，回复量逐渐增加，最大不超过5点
      if (
        worldInGame &&
        PlayerInGame.includes(e.player.name) &&
        e.skill === i18n.t('skill.self_sustain.name') &&
        e.hp < e.maxHp
      ) {
        // 初始化回复计时器和回复量计数器
        if (!e.regenerationTimer) {
          e.regenerationTimer = 0;
        }
        if (!e.regenerationAmount) {
          e.regenerationAmount = 1; // 初始回复量为1点
        }

        // 增加计时器（每500ms增加500）
        e.regenerationTimer += 500;

        // 每5秒（5000ms）回复生命值
        if (e.regenerationTimer >= 5000) {
          // 回复当前的回复量
          e.hp += e.regenerationAmount;
          if (e.hp > e.maxHp) {
            e.hp = e.maxHp;
          }

          // 回复量每触发一次就增加0.5点，最大不超过5点
          if (e.regenerationAmount < 5) {
            e.regenerationAmount += 0.5;
            // 确保不会超过最大值5
            if (e.regenerationAmount > 5) {
              e.regenerationAmount = 5;
            }
          }

          e.regenerationTimer = 0; // 重置计时器

          // 万圣节主题的视觉反馈 - 橙色和紫色粒子
          Object.assign(e, {
            particleRate: 30,
            particleColor:
              Math.random() > 0.5
                ? new GameRGBColor(1, 0.5, 0)
                : new GameRGBColor(0.8, 0, 0.8), // 橙色或紫色粒子
            particleLifetime: 0.4,
            particleSize: [3, 3, 3, 3, 3],
          });

          // 短暂后清除粒子效果
          setTimeout(() => {
            if (e && !e.destroyed) {
              Object.assign(e, {
                particleRate: 0,
              });
            }
          }, 500);
        }
      }
    }
  });
}, 500);

// 游戏伤害和历史记录触发
world.onPlayerJoin(async ({ entity }) => {
  entity.onTakeDamage(async ({ damage, damageType }) => {
    entity.player.directMessage(
      i18n.t('game.damage_taken', {
        playerName: entity.player.name,
        damageType,
        damage,
      })
    );
  });

  entity.onDie(async ({ damageType }) => {
    world.say(
      i18n.t('game.player_turned_ghost', {
        player: entity.player.name,
        damageType,
      })
    );
    if (PlayerInGame.includes(entity.player.name)) {
      PlayerInGame.splice(PlayerInGame.indexOf(entity.player.name), 1);
      if (PlayerInGame.length > 0) {
        world.say(
          i18n.t('game.player_ghost_remaining', {
            player: entity.player.name,
            damageType,
            remaining: PlayerInGame.length,
          })
        );
        // 在多人模式下只剩一人时，直接让最后一个人胜利
        if (!isSinglePlayer && PlayerInGame.length === 1) {
          world.say(
            i18n.t('game.multi_player_victory', { player: PlayerInGame[0] })
          );
          // 调用游戏结束函数
          await gameOver();
        }
      }
    }
    cleanPlayer(entity);
    entity.player.forceRespawn();
    await sleep(2500);
    entity.enableDamage = false;
  });
});

// 游戏结束函数
async function gameOver() {
  // 清理游戏定时器
  if (gameInterval) clearInterval(gameInterval);
  if (batInterval) {
    clearInterval(batInterval);
    batInterval = null;
  }

  // 销毁所有残留的蝙蝠实体
  try {
    activeBats.forEach((b) => {
      try {
        if (b && b.destroy) b.destroy();
      } catch (e) {}
    });
    activeBats.length = 0;
  } catch (e) {
    console.warn(i18n.t('error.cleaning_bats'), e);
  }

  // 销毁所有TNT实体
  world.querySelectorAll('.TNT').forEach(async (i) => i.destroy());

  // 重置游戏状态
  worldInGame = false;

  // 重置所有玩家状态
  world.querySelectorAll('player').forEach(async (e) => {
    e.enableDamage = false;
    if (PlayerInGame.includes(e.player.name)) {
      e.player.forceRespawn();
      cleanPlayer(e);
    }
  });

  // 重置游戏数据
  PlayerInGame = [];
  isSinglePlayer = false;
  playerCount = 0;

  // 等待一段时间后清理世界
  await sleep(2500);
  await cleanWorldVoxels();
  await reset();
}

//运行代码
cleanWorldVoxels();
reset();

// 启动提示
world.say(i18n.t('game.welcome'));
