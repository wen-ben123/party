// @ts-nocheck
/* eslint-disable */

import i18n from '../../i18n';
//GUI代码
world.onPlayerJoin(({ entity }) => {
  entity.player.enable3DCursor = true;
  entity.skillCold = 0;
  entity.skill = i18n.t('skill.old_shoes.name');
  gui.init(entity, {
    panel: {
      display: true,
      data: `<dialog width="280" percentHeight="100" top="40" right="60" id="" >
            <group percentWidth="100" height="120" y="0">
                <label text="${i18n.t('gui.skill')}" height="30" y="5"  x="10"  percentWidth="100" color="#55f" fontSize="16"></label>
                <label text="" height="25" y="40" x="10" percentWidth="100" color="#a0a" id="positionshowdx" fontSize="14"></label>
                <label text="" height="25" y="70" x="10" percentWidth="100" color="#a0a" id="positionshowdz" fontSize="14"></label>
            </group>
            <group percentWidth="100" height="140" y="120">
                <label text="${i18n.t('gui.update_announcement')}" height="30" y="5"  x="10"  percentWidth="100" color="#55f" fontSize="16"></label>
                <label text="" height="30" y="40" x="10" percentWidth="100" color="#a0a" id="pointshowx" fontSize="12"></label>
                <label text="" height="30" y="75" x="10" percentWidth="100" color="#a0a" id="pointshowy" fontSize="12"></label>
                <label text="" height="30" y="110" x="10" percentWidth="100" color="#a0a" id="pointshowz" fontSize="12"></label>
            </group>
            <group percentWidth="100" height="90" y="260">
                <label text="${i18n.t('gui.game_outside_controls')}" height="25" y="5" x="10" percentWidth="100" color="#55f" fontSize="12"></label>
                <label text="${i18n.t('gui.left_click_switch_skill')}" height="25" y="35" x="10" percentWidth="100" color="#a0a" fontSize="11"></label>
                <label text="${i18n.t('gui.right_click_menu')}" height="25" y="65" x="10" percentWidth="100" color="#a0a" fontSize="11"></label>
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

// cleanWorldVoxels函数已合并到reset函数中

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

//创建可调整半径的平台 🍬
function createVoxelPlatform(
  y,
  vox,
  radius = 25,
  centerX = 65,
  centerZ = 65,
  onlyAir = false
) {
  let xend = centerX + radius;
  let yend = y + 1;
  let zend = centerZ + radius;
  for (let x = centerX - radius; x <= xend; x++) {
    for (let z = centerZ - radius; z <= zend; z++) {
      let dx = x - centerX;
      let dz = z - centerZ;
      if (Math.round(Math.sqrt(dx * dx + dz * dz)) <= radius) {
        for (let y1 = y; y1 < yend; y1++) {
          // 如果设置了onlyAir，只替换空气方块
          if (!onlyAir || voxels.name(voxels.getVoxelId(x, y1, z)) === 'air') {
            voxels.setVoxel(x, y1, z, vox);
          }
        }
      }
    }
  }
}

// 合并清空世界和重置平台功能
function reset(keepVoxels = false) {
  if (!keepVoxels) {
    // 清空所有体素
    for (let x = 0; x < 128; x++) {
      for (let y = 0; y < 120; y++) {
        for (let z = 0; z < 128; z++) {
          voxels.setVoxel(x, y, z, 'air');
        }
      }
    }
  }

  // 创建初始平台
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
}

//摧毁玩家
function explodePlayer(position, isGhostExplosion = false) {
  for (const k of world.querySelectorAll('player')) {
    if (k.position.distance(position) <= 8) {
      const damageAmount = Math.round(12 / k.position.distance(position));

      // 如果是幽灵爆炸，有概率将伤害转为少量治疗
      if (isGhostExplosion && Math.random() < 0.5) {
        // 50%概率治疗
        // 治疗量为伤害量的1/3
        const healAmount = Math.max(1, Math.floor(damageAmount));
        // 直接增加玩家的hp属性 💕
        if (k.hp !== undefined) {
          k.hp += healAmount;
          // 可以选择在这里设置一个上限，如果有的话
          // k.hp = Math.min(k.hp, maxHp);
          // 显示治疗效果 - 只播报给玩家和世界 🌟
          k.player.directMessage(
            i18n.t('damage.heal_message', { amount: healAmount })
          );
          world.say(
            i18n.t('damage.heal_broadcast', {
              playerName: k.player.name,
              amount: healAmount,
            })
          );
        } else {
          console.log('尝试治疗玩家，但hp属性不可用');
        }
      } else {
        // 正常造成伤害，但检查无敌状态
        if (!k.isInvincible) {
          k.hurt(damageAmount, {
            damageType: i18n.t('damage.tnt_explosion'),
          });
        }
      }

      var direction = k.position.sub(position);
      var dist = direction.mag();
      var speed = 1;
      k.velocity.x = (direction.x * speed) / dist;
      k.velocity.z = (direction.z * speed) / dist;
      k.velocity.y += 1.25;
    }
  }
}

// 蝙蝠/幽灵追逐目标函数 🎯
function chaseTarget(entity, targets, maxSpeed = 1.2) {
  if (!entity.position || !entity.velocity) return;

  // 寻找最近的目标
  let nearestTarget = null;
  let nearestDistance = Infinity;

  for (const target of targets) {
    if (
      target.position &&
      target.position.distance(entity.position) < nearestDistance
    ) {
      nearestDistance = target.position.distance(entity.position);
      nearestTarget = target;
    }
  }

  // 如果有目标，调整高度并朝向目标
  if (nearestTarget && nearestTarget.position) {
    const heightDiff = entity.position.y - nearestTarget.position.y;

    // 根据高度差调整垂直速度
    if (Math.abs(heightDiff) > 1) {
      entity.velocity.y = -heightDiff * 0.2;
      entity.velocity.y = Math.max(-0.5, Math.min(0.5, entity.velocity.y));
    }

    // 旋转朝向目标
    rotateTowardsTarget(entity, nearestTarget);
  }
}

// 限制实体移动速度函数 🏃‍♂️
function limitSpeed(entity, maxSpeed) {
  if (!entity.velocity) return;

  const mag =
    Math.sqrt(
      entity.velocity.x * entity.velocity.x +
        entity.velocity.y * entity.velocity.y +
        entity.velocity.z * entity.velocity.z
    ) || 1;

  if (mag > maxSpeed) {
    entity.velocity.x = (entity.velocity.x / mag) * maxSpeed;
    entity.velocity.y = (entity.velocity.y / mag) * maxSpeed;
    entity.velocity.z = (entity.velocity.z / mag) * maxSpeed;
  }
}

// 实体朝向目标旋转函数 🔄
function rotateTowardsTarget(entity, target) {
  if (!entity.position || !target.position) return;

  // 计算朝向目标的角度
  const dx = target.position.x - entity.position.x;
  const dz = target.position.z - entity.position.z;
  const targetYaw = Math.atan2(dz, dx);

  // 计算当前朝向和目标朝向的差值
  let currentYaw = entity.rotation?.y || 0;
  let angleDiff = targetYaw - currentYaw;

  // 处理角度环绕问题
  while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

  // 限制每秒最大旋转角度
  const MAX_ROTATION_PER_FRAME = Math.PI / 40;
  const rotateAmount =
    Math.sign(angleDiff) *
    Math.min(Math.abs(angleDiff), MAX_ROTATION_PER_FRAME);

  // 执行旋转
  if (entity.rotateLocal) {
    entity.rotateLocal({ x: 0, y: 0, z: 0 }, 'Y', rotateAmount);
  } else if (entity.rotation) {
    entity.rotation.y = currentYaw + rotateAmount;
    // 标准化角度值
    if (entity.rotation.y > Math.PI) entity.rotation.y -= 2 * Math.PI;
    if (entity.rotation.y < -Math.PI) entity.rotation.y += 2 * Math.PI;
  }
}

// 实体边界检查和反弹函数 🚧
function checkAndBounceBoundary(entity, minX, maxX, minY, maxY, minZ, maxZ) {
  if (!entity.position || !entity.velocity) return;

  // 计算中心坐标和半径
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const radius = (maxX - minX) / 2;

  // 圆形边界检查（欧拉距离）
  const dx = entity.position.x - centerX;
  const dz = entity.position.z - centerZ;
  const distance = Math.sqrt(dx * dx + dz * dz);

  // 如果距离大于等于半径，进行边界反弹
  if (distance >= radius) {
    // 计算边界上的新位置
    const normalizedDx = dx / distance;
    const normalizedDz = dz / distance;
    entity.position.x = centerX + normalizedDx * radius;
    entity.position.z = centerZ + normalizedDz * radius;

    // 计算反弹方向
    const dotProduct =
      entity.velocity.x * normalizedDx + entity.velocity.z * normalizedDz;
    entity.velocity.x = entity.velocity.x - 2 * dotProduct * normalizedDx;
    entity.velocity.z = entity.velocity.z - 2 * dotProduct * normalizedDz;
    entity.velocity.x *= 0.7; // 能量损失
    entity.velocity.z *= 0.7; // 能量损失
  }

  // Y轴边界仍然使用原来的矩形边界
  if (entity.position.y < minY) {
    entity.position.y = minY;
    entity.velocity.y = -entity.velocity.y * 0.7;
  }
  if (entity.position.y > maxY) {
    entity.position.y = maxY;
    entity.velocity.y = -entity.velocity.y * 0.7;
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
  // 重置玩家状态 💕
  entity.enableDamage = true; // 启用伤害接收
  entity.maxHp = 100; // 设置最大生命值
  entity.hp = entity.maxHp; // 恢复满生命值
  entity.player.enable3DCursor = true; // 启用3D光标
  entity.player.runSpeed = 0.3; // 跑步速度
  entity.player.walkSpeed = entity.player.runSpeed; // 走路速度
  entity.player.canFly = false; // 禁用飞行
  entity.player.spectator = false; // 退出观战模式
  entity.player.invisible = false; // 显示玩家
  entity.player.showName = true; // 显示名字
  entity.skillCold = 0; // 重置技能冷却 🍬
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
        i18n.t('game.player_left_with_remaining', {
          player: entity.player.name,
          count: PlayerInGame.length,
        })
      );
    }
  }
});

var skillList = [
  {
    name: i18n.t('skill.shield_block.name'),
    introduce: i18n.t('skill.shield_block.introduce'),
    notice: i18n.t('skill.shield_block.notice'),
    cold: 25000,
    async effect(entity, raycast) {
      // 开启无敌效果 🛡️✨
      entity.isInvincible = true;

      // 添加视觉效果
      Object.assign(entity, {
        particleRate: 50,
        particleColor: new GameRGBColor(0, 0.8, 1),
        particleLifetime: 0.5,
        particleSize: [4, 3, 2, 1, 0.5],
      });

      // 通知玩家
      entity.player.directMessage(i18n.t('skill.shield_block.activated'));

      // 3秒后移除无敌效果
      await sleep(3000);

      // 关闭无敌效果
      entity.isInvincible = false;

      // 移除视觉效果
      Object.assign(entity, { particleRate: 0 });

      // 通知玩家效果结束
      entity.player.directMessage(i18n.t('skill.shield_block.deactivated'));
    },
  },
  {
    name: i18n.t('skill.old_shoes.name'),
    introduce: i18n.t('skill.old_shoes.introduce'),
    notice: i18n.t('skill.old_shoes.notice'),
    cold: 15000,
    async effect(entity, raycast) {
      // 保存原始跳跃相关参数 🌟
      const originalJumpHeight = entity.player.jumpHeight || 1;
      const originalJumpPower = entity.player.jumpPower || 0.96; // 默认跳跃力度
      const originalJumpSpeedFactor = entity.player.jumpSpeedFactor || 0.85; // 默认跳跃速度
      const originalJumpAccelerationFactor =
        entity.player.jumpAccelerationFactor || 0.55; // 默认跳跃加速率
      const originalDoubleJumpPower = entity.player.doubleJumpPower || 0.9; // 默认二段跳力度

      // 增加速度 ⚡
      entity.player.runSpeed += 0.4;
      entity.player.walkSpeed = entity.player.runSpeed;
      // 增加跳跃高度 🚀
      entity.player.jumpHeight = 2.5; // 默认跳跃高度的2.5倍
      // 增强跳跃相关参数
      entity.player.jumpPower = 1.2; // 增加跳跃力度
      entity.player.jumpSpeedFactor = 1.1; // 增加跳跃速度
      entity.player.jumpAccelerationFactor = 0.7; // 增加跳跃加速率
      entity.player.doubleJumpPower = 1.1; // 增加二段跳力度

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
      // 恢复原始跳跃相关参数
      entity.player.jumpHeight = originalJumpHeight;
      entity.player.jumpPower = originalJumpPower;
      entity.player.jumpSpeedFactor = originalJumpSpeedFactor;
      entity.player.jumpAccelerationFactor = originalJumpAccelerationFactor;
      entity.player.doubleJumpPower = originalDoubleJumpPower;

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
    cold: 30000,
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
    cold: 20000,
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
    cold: 35000,
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
    cold: 25000,
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

      // 驱除所有蝙蝠 🦇💨
      let clearedCount = 0;
      for (let i = activeBats.length - 1; i >= 0; i--) {
        const bat = activeBats[i];
        try {
          if (bat && !bat.destroyed && bat.position) {
            // 添加爆炸前的视觉效果
            Object.assign(bat, {
              particleRate: 100,
              particleColor: new GameRGBColor(1, 1, 0),
              particleLifetime: 0.5,
              particleSize: [5, 4, 3, 2, 1],
            });
            // 延迟执行爆炸和销毁
            setTimeout(() => {
              try {
                if (bat && !bat.destroyed && bat.position) {
                  // 让蝙蝠在原地爆炸
                  explodeVoxel(bat.position);
                  // 清除相关定时器
                  if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
                  if (bat.movementTimer) clearInterval(bat.movementTimer);
                  bat.destroy();
                }
              } catch (e) {}
            }, 300);
            activeBats.splice(i, 1);
            clearedCount++;
          }
        } catch (e) {}
      }

      // 给玩家发送消息，告知已清除的蝙蝠数量
      if (clearedCount > 0) {
        entity.player.directMessage(i18n.t('candy.bats_cleared'));
      }
    },
  },

  {
    name: i18n.t('skill.safe_platform.name'),
    introduce: i18n.t('skill.safe_platform.introduce'),
    notice: i18n.t('skill.safe_platform.notice'),
    cold: 5000,
    async effect(entity, raycast) {
      entity.skillCold = 0;
    },
  },
  {
    name: i18n.t('skill.cat_trap.name'),
    introduce: i18n.t('skill.cat_trap.introduce'),
    notice: i18n.t('skill.cat_trap.notice'),
    cold: 20000,
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
  {
    name: i18n.t('skill.repairman.name'),
    introduce: i18n.t('skill.repairman.introduce'),
    notice: i18n.t('skill.repairman.notice'),
    cold: 25000,
    async effect(entity, raycast) {
      // 创建半径为2的平台
      const centerX = Math.floor(entity.position.x);
      const centerZ = Math.floor(entity.position.z);

      // 修复平台：直接在玩家脚下位置生成 🔧
      // 由于是修复技能，不需要检查是否有非空气方块
      // 限制平台生成高度范围：最低10，最高60 🌟
      const nearestPlatformY = Math.floor(
        Math.max(10, Math.min(60, entity.position.y - 2))
      ); // 在玩家脚下生成平台，限制高度范围

      // 生成平台方块，使用草方块填充，只替换空气方块 🌱
      createVoxelPlatform(nearestPlatformY, 'grass', 5, centerX, centerZ, true);

      // 显示平台创建成功消息
      entity.player.directMessage(i18n.t('skill.repairman.platform_created'));

      // ⚠️ 每次使用扣10血 🩸
      if (entity.hp > 10) {
        // 使用正确的hurt方法减少生命值
        entity.hurt(10, { damageType: i18n.t('skill.repairman.name') });
        entity.player.directMessage(
          i18n.t('skill.repairman.health_deducted', { amount: 10 })
        );
      } else {
        // 血量不足时的提示
        entity.player.directMessage(i18n.t('skill.repairman.low_health'));
      }

      // ⏰ 每次使用增加5秒冷却时间
      const repairmanSkill = skillList.find(
        (skill) => skill.name === i18n.t('skill.repairman.name')
      );
      if (repairmanSkill) {
        repairmanSkill.cold += 5000; // 增加5秒冷却时间
        entity.player.directMessage(
          i18n.t('skill.repairman.cooldown_increased', { amount: 5 })
        );
      }

      // 移除移动恢复提示 🌟
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
        content: i18n.t('gui.switch_skill_prompt_with_name', {
          skill: entity.skill,
        }),
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
              i18n.t('unit.cooldown_seconds', { time: skill.cold / 1000 }) +
              `\n` +
              i18n.t('gui.notice_with_content', { content: skill.notice }),
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
        await skill.effect(entity, raycast); // 先调用 effect，因为 repairman 技能在这里增加冷却时间
        entity.skillCold = skill.cold; // 然后再设置冷却时间，这样就能正确应用增加后的值
        entity.player.directMessage(
          i18n.t('skill_used', { skill: entity.skill })
        );
      }
    }
  }
  if (button == 'action1') {
    //右键查看时间或加入游戏/规则
    if (!worldInGame) {
      //赛外 - 主菜单
      const mainMenuOption = await entity.player.dialog({
        type: 'select',
        title: i18n.t('gui.join_game_title'),
        content: i18n.t('gui.join_game_content'),
        options: [
          i18n.t('gui.join_game_now'),
          i18n.t('gui.view_game_rules'),
          i18n.t('gui.cancel'),
        ],
      });

      // 处理菜单选择
      if (mainMenuOption) {
        // 立即加入游戏
        if (mainMenuOption.index === 0) {
          // 检查是否已加入游戏
          if (!PlayerInGame.includes(entity.player.name)) {
            PlayerInGame.push(entity.player.name);
            // 只给自己发送消息，不再广播
            entity.player.directMessage(i18n.t('game.join_success'));

            // 如果是首次加入，游戏将在10秒后开始
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
                  i18n.t('game.multiplayer_started', {
                    player: PlayerInGame[0],
                  })
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
          } else {
            // 已加入游戏，提示用户
            entity.player.directMessage(i18n.t('game.already_joined'));
          }
        }
        // 查看游戏规则
        else if (mainMenuOption.index === 1) {
          await entity.player.dialog({
            type: 'select',
            title: i18n.t('gui.game_guide_title'),
            content: i18n.t('gui.game_guide_content'),
            options: [i18n.t('gui.close')],
          });
        }
        // 取消操作，不需要处理
        else if (mainMenuOption.index === 2) {
          // 什么都不做
        }
      }
    } else {
      // 赛内查看游戏信息（包含血量）- 只显示给右键点击的玩家 🌟
      // 计算真实已进行时间（基于全局开始时间戳）
      const now = Date.now();
      const elapsedMs =
        gameStartTime > 0 ? now - gameStartTime : worldTime * 1000;
      const totalSeconds = Math.floor(elapsedMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      // 获取血量信息
      const playerHp = entity.hp || 100; // 默认血量为100
      const maxHp = entity.maxHp || 100; // 默认最大血量为100
      const healthPercentage = Math.round((playerHp / maxHp) * 100);

      // 使用 directMessage 只向右键点击的玩家显示信息
      entity.player.directMessage(
        i18n.t('game.game_info_with_health', {
          minutes,
          seconds,
          players: PlayerInGame.length,
          blocks: countBlocks(),
          current: playerHp,
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
var ghostInterval = null; // 幽灵生成定时器
const activeBats: any[] = [];
// 调节TNT生成频率的因子（>1 表示更慢，<1 表示更快）
var tntSlowFactor = 0.01;
// 蝙蝠飞行高度限制（可调）：蝙蝠只会在此区间内生成和飞行
var batMinY = 10;
var batMaxY = 60;
// 糖果相关变量
var candyInterval = null;
const activeCandies: any[] = [];
const CANDY_LIFETIME = 30000; // 糖果持续时间（毫秒）
const CANDY_INTERACT_DISTANCE = 3; // 糖果交互距离
const activeGhosts: any[] = []; // 活跃的幽灵列表 👻

// 生成幽灵函数 - 初始隐身，逐渐显形，碰到玩家会弹飞，最终爆炸 👻
function summonGhost(count = 1) {
  try {
    for (let i = 0; i < count; i++) {
      // 创建幽灵实体
      const ghost = world.createEntity({
        mesh: 'mesh/white.vb', // 使用白色方块作为幽灵模型
        meshScale: [0.12, 0.12, 0.12], // 幽灵形状 - 已经设置为要求的0.12体积 👻
        meshEmissive: 0, // 关闭发光效果，使幽灵不发光 👻
        meshInvisible: false, // 控制幽灵是否隐形，默认显示 👻
        fixed: false,
        collides: true,
        gravity: true, // 给幽灵添加重力 👻
        position: {
          x: 30 + Math.random() * 70,
          y: 25 + Math.random() * 30, // 适当提高生成高度，考虑重力影响
          z: 30 + Math.random() * 70,
        },
      });
      ghost.addTag('ghost');
      ghost.isGhost = true;

      // 设置随机速度
      ghost.velocity = {
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.4,
      };

      // 添加到活跃幽灵列表
      activeGhosts.push(ghost);

      // 初始粒子效果模拟隐身状态
      Object.assign(ghost, {
        particleRate: 10,
        particleColor: new GameRGBColor(0.7, 0.7, 1), // 淡蓝色幽灵粒子
        particleLifetime: 1.5,
        particleSize: [3, 3, 3, 2, 1],
      });

      // 幽灵生命周期管理
      const maxLifetime = 15000 + Math.random() * 15000; // 15-30秒
      let elapsedTime = 0;
      const fadeInDuration = 5000; // 5秒逐渐显形
      const warningDuration = 3000; // 3秒爆炸警告

      const ghostInterval = setInterval(async () => {
        try {
          if (!ghost || ghost.destroyed) {
            clearInterval(ghostInterval);
            return;
          }

          elapsedTime += 100;

          // 1. 移动逻辑
          // 微随机方向调整
          ghost.velocity.x += (Math.random() - 0.5) * 0.1;
          ghost.velocity.y += (Math.random() - 0.5) * 0.05;
          ghost.velocity.z += (Math.random() - 0.5) * 0.1;

          // 限制速度
          const maxSpeed = 0.8;
          const mag =
            Math.sqrt(
              ghost.velocity.x * ghost.velocity.x +
                ghost.velocity.y * ghost.velocity.y +
                ghost.velocity.z * ghost.velocity.z
            ) || 1;
          if (mag > maxSpeed) {
            ghost.velocity.x = (ghost.velocity.x / mag) * maxSpeed;
            ghost.velocity.y = (ghost.velocity.y / mag) * maxSpeed;
            ghost.velocity.z = (ghost.velocity.z / mag) * maxSpeed;
          }

          // 2. 透明度变化逻辑
          if (elapsedTime < fadeInDuration) {
            // 逐渐显形
            const newOpacity = (elapsedTime / fadeInDuration) * 1;
            ghost.opacity = newOpacity;
            // 增加粒子效果表示逐渐显形
            Object.assign(ghost, {
              particleRate: Math.floor(newOpacity * 50) + 10,
              particleColor: new GameRGBColor(0.7, 0.7, 1, newOpacity),
            });
          }

          // 3. 爆炸警告阶段
          if (elapsedTime >= maxLifetime - warningDuration) {
            // 警告阶段：红色粒子效果，更快的移动
            ghost.addTag(i18n.t('entity.ghost.about_to_explode'));
            Object.assign(ghost, {
              particleRate: 100,
              particleColor: new GameRGBColor(1, 0.3, 0.3), // 红色警告粒子
              particleLifetime: 0.5,
              particleSize: [5, 4, 3, 2, 1],
            });
            // 加速移动
            ghost.velocity.x *= 1.5;
            ghost.velocity.y *= 1.5;
            ghost.velocity.z *= 1.5;
          }

          // 4. 检查玩家碰撞 - 任何阶段碰到玩家都会加速爆炸 👻
          for (const player of world.querySelectorAll('player')) {
            if (
              !player.player.spectator &&
              player.position &&
              ghost.position &&
              player.position.distance
            ) {
              const dist = player.position.distance(ghost.position);
              // 玩家碰到幽灵会加速爆炸
              if (dist <= 3.0) {
                // 计算反弹方向
                const direction = player.position.sub(ghost.position);
                const dist = direction.mag() || 1;

                // 弹飞玩家
                player.velocity.x = (direction.x * 1.2) / dist;
                player.velocity.z = (direction.z * 1.2) / dist;
                player.velocity.y += 0.8;

                // 给玩家发送消息
                player.player.directMessage(i18n.t('entity.ghost.bounced'));

                // 幽灵被碰撞后加速爆炸
                clearInterval(ghostInterval);
                await explodeGhost(ghost, true); // 传入true表示加速爆炸
                return;
              }
            }
          }

          // 5. 追逐玩家 - 使用抽象函数实现类似蝙蝠的追逐行为 👻
          const players = world
            .querySelectorAll('player')
            .filter((p) => !p.player.spectator);
          chaseTarget(ghost, players, 0.8);

          // 6. 限制速度 - 使用抽象函数
          limitSpeed(ghost, 0.8);

          // 7. 边界检查与反弹 - 使用抽象函数代替直接实现
          const minX = 40,
            maxX = 80;
          const minZ = 40,
            maxZ = 80;
          const minY = 10,
            maxY = 60; // 与蝙蝠行为保持一致 🚀
          checkAndBounceBoundary(ghost, minX, maxX, minY, maxY, minZ, maxZ);

          // 8. 旋转朝向目标 - 使用抽象函数
          const nearestPlayer = players.reduce((nearest, current) => {
            if (!nearest) return current;
            const nearestDist = nearest.position.distance(ghost.position);
            const currentDist = current.position.distance(ghost.position);
            return currentDist < nearestDist ? current : nearest;
          }, null);

          if (nearestPlayer) {
            rotateTowardsTarget(ghost, nearestPlayer);
          }

          // 6. 生命周期结束，爆炸
          if (elapsedTime >= maxLifetime) {
            clearInterval(ghostInterval);
            await explodeGhost(ghost);
          }
        } catch (e) {
          console.warn(i18n.t('errors.ghost_update'), e);
        }
      }, 100);
    }
  } catch (e) {
    console.warn(i18n.t('errors.summon_ghost'), e);
  }
}

// 幽灵爆炸函数
async function explodeGhost(ghost, accelerated = false) {
  try {
    if (!ghost || ghost.destroyed) return;

    // 爆炸前的视觉效果
    Object.assign(ghost, {
      particleRate: 200,
      particleColor: new GameRGBColor(1, 0, 0),
      particleLifetime: 0.3,
      particleSize: [8, 6, 4, 2, 1],
    });

    // 如果是加速爆炸，减少延迟时间
    let delay = accelerated ? 200 : 500;
    // 确保延迟时间不为负数 🌟
    delay = Math.max(0, delay);
    await sleep(delay);

    // 执行爆炸效果，传递isGhostExplosion参数以启用概率治疗功能
    explodeVoxel(ghost.position);
    explodePlayer(ghost.position, true); // true表示这是幽灵爆炸

    // 从活跃列表中移除
    const index = activeGhosts.indexOf(ghost);
    if (index > -1) {
      activeGhosts.splice(index, 1);
    }

    // 销毁幽灵
    ghost.destroy();
  } catch (e) {
    console.warn(i18n.t('errors.ghost_explosion'), e);
  }
}

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
            // 寻找最近的目标（玩家或替身）并匹配其高度
            let nearestTarget = null;
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
                nearestTarget = p;
              }
            }

            // 如果有目标（玩家或替身），调整蝙蝠高度以匹配目标并朝向目标
            if (nearestTarget && nearestTarget.position) {
              const heightDiff = bat.position.y - nearestTarget.position.y;

              // 根据高度差调整蝙蝠的垂直速度
              if (Math.abs(heightDiff) > 1) {
                // 只有当高度差大于1格时才调整
                // 向目标高度靠拢
                bat.velocity.y = -heightDiff * 0.2; // 比例调整，高度差越大，调整越快

                // 限制垂直速度范围，避免过快或过慢
                bat.velocity.y = Math.max(-0.5, Math.min(0.5, bat.velocity.y));
              }

              // 计算蝙蝠朝向最近目标的角度（提高精度）
              const dx = nearestTarget.position.x - bat.position.x;
              const dz = nearestTarget.position.z - bat.position.z;
              const distance = Math.sqrt(dx * dx + dz * dz);

              // 计算水平方向的旋转角度（弧度）
              const targetYaw = Math.atan2(dz, dx);

              // 计算当前朝向和目标朝向的差值
              let currentYaw = bat.rotation?.y || 0;
              let angleDiff = targetYaw - currentYaw;

              // 更精确地处理角度环绕问题，确保旋转是最短路径
              while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
              while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

              // 限制每秒最大旋转角度为90度（π/2弧度）
              // 假设游戏主循环大约每50ms执行一次，那么每帧最大旋转量为：
              // π/2弧度/秒 ÷ 20帧/秒 = π/40弧度/帧 ≈ 0.0785弧度/帧
              const MAX_ROTATION_PER_FRAME = Math.PI / 40; // 约0.0785弧度/帧

              // 计算旋转量，确保不会超过最大限制
              const rotateAmount =
                Math.sign(angleDiff) *
                Math.min(Math.abs(angleDiff), MAX_ROTATION_PER_FRAME);

              // 使用rotateLocal方法进行精确的水平旋转
              if (bat.rotateLocal) {
                bat.rotateLocal({ x: 0, y: 0, z: 0 }, 'Y', rotateAmount);
              } else if (bat.rotation) {
                // 改进的回退方案：确保旋转后的值在正确范围内
                bat.rotation.y = currentYaw + rotateAmount;
                // 标准化回退后的角度值
                if (bat.rotation.y > Math.PI) bat.rotation.y -= 2 * Math.PI;
                if (bat.rotation.y < -Math.PI) bat.rotation.y += 2 * Math.PI;
              }
            }
            // 应用移动
            bat.position.x += bat.velocity.x;
            bat.position.y += bat.velocity.y;
            bat.position.z += bat.velocity.z;
          }

          // 限定飞行边界并在越界时反弹（使用圆形边界）🎯
          try {
            const minX = 40,
              maxX = 80,
              minZ = 40,
              maxZ = 80;
            const minY = batMinY,
              maxY = batMaxY;

            // 使用与幽灵相同的边界检查函数 🌟
            checkAndBounceBoundary(bat, minX, maxX, minY, maxY, minZ, maxZ);
          } catch (e) {
            // 忽略边界修正错误
          }
          // 检查与目标（玩家或替身）的碰撞与追踪行为
          // 先检查所有玩家
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

                  // 对玩家造成伤害，但检查无敌状态
                  if (p.hurt && !p.isInvincible)
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

          // 再检查所有替身
          for (let i = activeDecoys.length - 1; i >= 0; i--) {
            const decoy = activeDecoys[i];
            try {
              if (
                decoy &&
                !decoy.destroyed &&
                decoy.position &&
                bat.position &&
                decoy.position.distance
              ) {
                const dist = decoy.position.distance(bat.position);
                // 当距离替身4格范围内时，蝙蝠会自爆（距离玩家更远时就会攻击替身，起到吸引效果）
                if (dist <= 4.0) {
                  // 自爆前的警告效果
                  bat.addTag(i18n.t('entity.bat.self_destruct'));

                  // 短暂延迟后自爆
                  await sleep(300);

                  // 对替身造成伤害（实际上是直接销毁替身）
                  if (decoy.destroy) {
                    // 为替身添加爆炸效果
                    explodeVoxel(decoy.position);
                    decoy.destroy();
                    // 从活跃列表中移除
                    activeDecoys.splice(i, 1);
                  }

                  // 执行自爆
                  explodeVoxel(bat.position);

                  // 清除生存时间定时器
                  if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
                  bat.destroy();
                  clearInterval(t);
                  break;
                }

                // 若靠近替身（但未碰撞），蝙蝠会加速追赶
                const interestRadius = 15; // 替身吸引范围更大
                if (dist <= interestRadius) {
                  const heightDiff = bat.position.y - decoy.position.y;

                  // 同一高度时冲锋（高度差小于1格）
                  if (Math.abs(heightDiff) < 1) {
                    // 冲锋模式：大幅提高水平速度
                    bat.velocity.x *= 4.5; // 对替身在速度上更有吸引力
                    bat.velocity.z *= 4.5;
                    bat.velocity.y *= 0.5; // 轻微调整垂直速度
                  } else {
                    // 普通加速追赶
                    bat.velocity.x *= 3.0; // 对替身在速度上更有吸引力
                    bat.velocity.z *= 3.0;

                    // 高度控制 - 向替身高度靠拢
                    if (Math.abs(heightDiff) > 1) {
                      // 向替身高度靠拢的速度，与高度差成正比
                      const heightAdjustment = -heightDiff * 0.4; // 调整系数更大
                      // 限制调整速度
                      bat.velocity.y = Math.max(
                        -0.7,
                        Math.min(0.7, heightAdjustment)
                      );
                    }
                  }
                  // 在下一次迭代让速度回落一点，避免指数增长
                  setTimeout(() => {
                    try {
                      // 根据是否进入过冲锋模式调整回落系数
                      const isCharging = Math.abs(heightDiff) < 1;
                      bat.velocity.x *= isCharging ? 0.4 : 0.6;
                      bat.velocity.y *= 0.7;
                      bat.velocity.z *= isCharging ? 0.4 : 0.6;
                    } catch (e) {}
                  }, 800);
                }
              }
            } catch (e) {
              // 忽略单个替身检查错误
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
          // 静默处理蝙蝠移动错误，不再显示错误提示
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

  world.querySelectorAll('player').forEach((e) => {
    e.player.cancelDialogs();
    if (PlayerInGame.includes(e.player.name)) {
      e.position.set(45 + Math.random() * 35, 52.5, 45 + Math.random() * 35);
      resetPlayer(e);
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

  // 每30秒生成一个糖果
  if (candyInterval) clearInterval(candyInterval);
  candyInterval = setInterval(() => {
    if (worldInGame) {
      summonCandy();
    }
  }, 30000);

  // 每25秒生成幽灵（赛内干扰）
  if (ghostInterval) clearInterval(ghostInterval);
  ghostInterval = setInterval(() => {
    if (worldInGame) {
      const count = Math.floor(Math.random() * 3) + 1; // 1..3个幽灵
      summonGhost(count);
      world.say('👻 幽灵出现了! 小心隐形的威胁...');
    }
  }, 25000);

  // 添加胜利标记变量
  let isVictory = false;

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

    // 移除自动显示进度，玩家可以通过右键自由查看游戏信息

    worldTime++;
    // 每5秒检查一次游戏状态（剩余方块和人数）
    if (worldTime % 5 === 0) {
      try {
        // 检查剩余方块数量
        const remaining = countBlocks();
        if (remaining <= 50) {
          world.say(i18n.t('game.blocks_remaining_end'));
          // 历史记录功能已删除
          break;
        }

        // 检查游戏人数（只在多人模式下有效）
        if (!isSinglePlayer && PlayerInGame.length === 1) {
          isVictory = true;
          world.say(
            i18n.t('game.multi_player_victory', { player: PlayerInGame[0] })
          );
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
  if (PlayerInGame.length === 0 && !isVictory) {
    world.say(i18n.t('game.game_over_all_dead'));
  } else {
    if (isSinglePlayer) {
      if (worldTime >= 300) {
        isVictory = true;
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
        isVictory = true;
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

  await reset();
}

// 虚空检测和自救平台技能
setInterval(() => {
  world.querySelectorAll('*').forEach((e) => {
    if (e.position.y <= -20 || (e.isPlayer && e.position.y >= 100)) {
      if (e.isPlayer) {
        if (worldInGame && e.skill === i18n.t('skill.safe_platform.name')) {
          try {
            var skill = getSkill(e.skill);
            if (skill) {
              // 创建5x5平台（使用createVoxelPlatform函数）
              var platformCenterX = Math.floor(Math.random() * 50) + 35;
              var platformCenterZ = Math.floor(Math.random() * 50) + 35;
              createVoxelPlatform(
                10,
                'yellow_light',
                2,
                platformCenterX,
                platformCenterZ
              );

              e.position.set(platformCenterX, 12, platformCenterZ);
              // 扣除50点生命值
              e.hurt(30, { damageType: '救生平台消耗' });
              e.player.directMessage(
                i18n.t('damage.skill_rescue_platform_triggered')
              );
            } else {
              // 移除虚空伤害的无敌状态检查
              e.hurt(999, { damageType: i18n.t('game.fell_into_void') });
            }
          } catch (error) {
            console.error('Error in rescue platform:', error);
            e.hurt(999, { damageType: i18n.t('game.fell_into_void') });
          }
        } else {
          // 移除虚空伤害的无敌状态检查
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
          isVictory = true;
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
  if (candyInterval) {
    clearInterval(candyInterval);
    candyInterval = null;
  }
  if (ghostInterval) {
    clearInterval(ghostInterval);
    ghostInterval = null;
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

  // 销毁所有残留的糖果实体
  try {
    activeCandies.forEach((c) => {
      try {
        if (c && c.destroy) {
          if (c.lifespanTimer) clearTimeout(c.lifespanTimer);
          if (c.blinkTimer) clearInterval(c.blinkTimer);
          c.destroy();
        }
      } catch (e) {}
    });
    activeCandies.length = 0;
  } catch (e) {
    console.warn(i18n.t('errors.cleaning_candies'), e);
  }

  // 销毁所有残留的幽灵实体
  try {
    activeGhosts.forEach((g) => {
      try {
        if (g && g.destroy) {
          if (g.ghostInterval) clearInterval(g.ghostInterval);
          g.destroy();
        }
      } catch (e) {}
    });
    activeGhosts.length = 0;
  } catch (e) {
    console.warn(i18n.t('errors.ghost_update'), e);
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
  await reset();
}

// 生成糖果函数 - 从空中掉落的糖果 🍬
function summonCandy() {
  try {
    if (!worldInGame) return;

    // 限制糖果数量，避免过多
    if (activeCandies.length >= 5) return;

    // 生成随机的x和z坐标，确保在游戏区域内
    const x = Math.floor(30 + Math.random() * 60);
    const z = Math.floor(30 + Math.random() * 60);
    // 设置较高的y坐标，让糖果从空中掉落
    const y = 80 + Math.random() * 20; // 80-100的高度

    // 创建糖果实体 - 从空中掉落的糖果 🍬
    const candy = world.createEntity({
      mesh: 'mesh/candy.vb', // 假设有糖果模型，如果没有可以使用其他模型代替
      meshScale: [0.15, 0.15, 0.15],
      meshEmissive: 0, // 关闭高光效果
      fixed: false, // 允许移动
      collides: false, // 初始状态下没有碰撞体积 🍬
      gravity: true, // 启用重力，让糖果可以正常掉落
      position: { x, y, z },
    });

    // 随机时间后恢复碰撞体积（0-2秒内随机）🎯
    const enableCollideTime = Math.random() * 2000; // 0-2秒随机
    setTimeout(() => {
      try {
        if (candy && !candy.destroyed) {
          // 恢复碰撞体积
          candy.collides = true;

          // 添加粒子效果表示碰撞体积已激活 ✨
          Object.assign(candy, {
            particleRate: 20,
            particleColor: new GameRGBColor(0.8, 0.8, 1),
            particleLifetime: 0.5,
            particleSize: [2, 2, 2, 1, 1],
          });

          // 短暂后清除粒子效果
          setTimeout(() => {
            if (candy && !candy.destroyed) {
              Object.assign(candy, { particleRate: 0 });
            }
          }, 1000);
        }
      } catch (e) {
        console.warn('启用糖果碰撞体积时出错:', e);
      }
    }, enableCollideTime);

    candy.addTag('candy');
    candy.isCandy = true;

    // 启用互动功能
    candy.enableInteract = true;
    candy.interactHint = i18n.t('candy.interact_hint'); // 设置互动提示文字
    candy.interactRadius = CANDY_INTERACT_DISTANCE; // 设置互动范围

    // 添加到活跃糖果列表
    activeCandies.push(candy);

    // 设置糖果生命周期
    candy.lifespanTimer = setTimeout(() => {
      try {
        if (candy && !candy.destroyed) {
          candy.destroy();
          // 从活跃列表中移除
          const index = activeCandies.indexOf(candy);
          if (index > -1) {
            activeCandies.splice(index, 1);
          }
        }
      } catch (e) {
        console.warn(i18n.t('errors.candy_lifetime'), e);
      }
    }, CANDY_LIFETIME);

    // 不再使用闪烁效果，保持稳定外观
  } catch (e) {
    console.error(i18n.t('errors.summon_candy'), e);
  }
}

// 处理糖果交互
async function handleCandyInteraction(player, candy) {
  try {
    // 显示选项对话框
    const choice = await player.player.dialog({
      type: 'select',
      title: i18n.t('candy.options_title'),
      content: i18n.t('candy.collected'),
      options: [
        i18n.t('candy.heal'),
        i18n.t('candy.clear_bats'),
        i18n.t('candy.repair_terrain'),
      ],
    });

    if (!choice) return; // 如果玩家取消选择

    // 销毁糖果
    candy.destroy();
    // 从活跃列表中移除
    const index = activeCandies.indexOf(candy);
    if (index > -1) {
      activeCandies.splice(index, 1);
    }

    // 根据选择执行相应功能
    switch (choice.index) {
      case 0: // 回血
        player.hp += 50;
        if (player.hp > player.maxHp) {
          player.hp = player.maxHp;
        }
        player.player.directMessage(i18n.t('candy.heal_success'));
        // 向世界广播治疗消息 🌟
        world.say(
          i18n.t('damage.candy_heal_broadcast', {
            playerName: player.player.name,
          })
        );
        // 添加治愈视觉效果
        Object.assign(player, {
          particleRate: 50,
          particleColor: new GameRGBColor(0, 1, 0),
          particleLifetime: 1,
          particleSize: [3, 3, 3, 2, 1],
        });
        setTimeout(() => {
          if (player && !player.destroyed) {
            Object.assign(player, { particleRate: 0 });
          }
        }, 1000);
        break;

      case 1: // 清除场上所有蝙蝠并原地爆炸
        let clearedCount = 0;
        // 清除场上所有蝙蝠
        for (let i = activeBats.length - 1; i >= 0; i--) {
          const bat = activeBats[i];
          try {
            if (bat && !bat.destroyed && bat.position) {
              // 添加爆炸前的视觉效果
              Object.assign(bat, {
                particleRate: 100,
                particleColor: new GameRGBColor(1, 1, 0),
                particleLifetime: 0.5,
                particleSize: [5, 4, 3, 2, 1],
              });
              // 延迟执行爆炸和销毁
              setTimeout(() => {
                try {
                  if (bat && !bat.destroyed && bat.position) {
                    // 让蝙蝠在原地爆炸
                    explodeVoxel(bat.position);
                    // 清除相关定时器
                    if (bat.lifespanTimer) clearTimeout(bat.lifespanTimer);
                    if (bat.movementTimer) clearInterval(bat.movementTimer);
                    bat.destroy();
                  }
                } catch (e) {}
              }, 300);
              activeBats.splice(i, 1);
              clearedCount++;
            }
          } catch (e) {}
        }
        player.player.directMessage(i18n.t('candy.bats_cleared'));
        break;

      case 2: // 修复地面
        player.player.directMessage(i18n.t('candy.terrain_repairing'));
        // 找到玩家脚下最近的地面层并修复
        const playerX = Math.round(player.position.x);
        const playerZ = Math.round(player.position.z);
        let repairY = Math.floor(player.position.y);

        // 向下查找最近的地面
        while (repairY > 0) {
          const voxelName = voxels.name(
            voxels.getVoxelId(playerX, repairY, playerZ)
          );
          if (voxelName && voxelName !== 'air') {
            break;
          }
          repairY--;
        }

        // 修复该层周围的地面（5x5区域）使用createVoxelPlatform函数
        createVoxelPlatform(repairY, 'grass', 2, playerX, playerZ, true);

        // 为每个修复的方块添加效果粒子
        for (let x = playerX - 2; x <= playerX + 2; x++) {
          for (let z = playerZ - 2; z <= playerZ + 2; z++) {
            // 只在需要修复的位置添加粒子效果
            if (voxels.name(voxels.getVoxelId(x, repairY, z)) === 'grass') {
              const repairEffect = world.createEntity({
                mesh: 'mesh/white_light.vb',
                meshScale: [0.1, 0.1, 0.1],
                fixed: true,
                collides: false,
                position: { x: x, y: repairY + 0.5, z: z },
              });
              Object.assign(repairEffect, {
                particleRate: 50,
                particleColor: new GameRGBColor(0.5, 1, 0.5),
                particleLifetime: 0.5,
                particleSize: [3, 2, 1, 0.5, 0.2],
              });
              setTimeout(() => {
                repairEffect.destroy();
              }, 500);
            }
          }
        }
        player.player.directMessage(i18n.t('candy.terrain_repaired'));
        break;
    }
  } catch (e) {
    console.error(i18n.t('errors.candy_interaction'), e);
  }
}

// 使用GameAPI的onInteract事件处理糖果交互
world.onInteract(async ({ entity, targetEntity }) => {
  try {
    // 检查是否为游戏中的玩家和糖果实体
    if (
      worldInGame &&
      PlayerInGame.includes(entity.player.name) &&
      targetEntity.isCandy
    ) {
      // 检查糖果是否在活跃列表中
      const candyIndex = activeCandies.indexOf(targetEntity);
      if (candyIndex > -1 && !targetEntity.destroyed) {
        await handleCandyInteraction(entity, targetEntity);
      }
    }
  } catch (e) {
    console.error(i18n.t('errors.candy_interaction'), e);
  }
});

//运行代码
// 直接调用reset()，它现在包含了清空世界和创建平台的功能
reset();
