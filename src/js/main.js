var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render });
var facing = 'right';
var lock = 0;
Phaser.ScaleManager.pageAlignHorizontally = true;


//TODO enemy idle and taking damage == easy
// enemy disapearing after dead animation is done == medium to hard
// if data.sprite.kill receveis a callback this can be easy
// make enemy see you if you got in his range and make him walk forward
// make him atack you

var events = {
  events: {},
  on: function(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  emit: function(eventName, data) {
    if(this.events[eventName]) {
      this.events[eventName].forEach(function(fn){
        fn(data);
      });
    }
  }
}

events.on('punch', function(data){
  data.health --;
  data.sprite.animations.play('damage', 12);
  if(data.health <= 0) {
    console.log(data.name + ' is dead');
    events.emit('isdead', data);
  }
});

events.on('kick', function(data){
  data.health --;
  data.sprite.animations.play('damage', 12);
  if(data.health <= 0) {
    events.emit('isdead', data);
  }
});

events.on('isdead', function(enemy){
  enemy.isAlive = false;
  return;
});

events.on('iswalking', function(enemy){
  enemy.iswalking = true;
});

function preload() {
  game.load.image('floor', './assets/images/floor.png');
  game.load.image('background', './assets/images/background.png');
  game.load.image('mountain', './assets/images/mountain.png');
  game.load.image('sky', './assets/images/sky.png');
  game.load.image('gate', './assets/images/gate.png');
  game.load.image('post', './assets/images/post.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 35);
  game.load.spritesheet('enemy1', './assets/images/enemy_1.png', 150, 160, 22);
  game.load.spritesheet('police', './assets/images/police.png', 160, 160, 36);
  game.load.spritesheet('boss', './assets/images/boss.png', 400, 280, 23);
}

var Hero = function(game, x, y) {
  this.params = {

    walkRight: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
          target.body.x += 6;
        }
      ]
    },
    walkLeft: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
          target.body.x -= 6;
        }
      ]
    },
    jump: {
      animation: 'jump',
      animationRateFrame: 10,
      actions: [
        function(target) {
          target.stopped = false;
          target.jumping = true;
          setTimeout(function(){
            target.stopped = true;
            target.jumping = false;
          },1000);
          target.body.velocity.y = -250;
        }
      ]
    },
    punch: {
      animation: 'punch',
      animationRateFrame: 10,
      actions: [
        function() {
          enemies.forEach(function(enemy){
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) <= 100) {
              events.emit('punch', enemy); 
            }
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) <= 400) {
              if(enemy.name == 'boss') {
                events.emit('punch', enemy); 
              }
            }           
          })
        }
      ]
    },
    kick: {
      animation: 'kick',
      animationRateFrame: 10,
      actions: [
        function() {
          enemies.forEach(function(enemy){
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) <= 100) {
              events.emit('punch', enemy); 
            }
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) <= 400) {
              if(enemy.name == 'boss') {
                events.emit('punch', enemy); 
              }
            }               
          })
        }
      ]
    },
     idle: {
      animation: 'idle',
      animationRateFrame: 10,
      actions: []
    }
  };

  this.game = game;
  this.name = 'hero';
  this.health = 100;
  this.alive = true;
  this.sprite = game.add.sprite(x,y,'hero');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.anchor.setTo(.5,.5);
  this.sprite.animations.add('walk',[0,1,2,3,4,5,6,7]);
  this.sprite.animations.add('idle',[8,9,10,11,12,13,14]);
  this.sprite.animations.add('jump',[16,17,18,19,20,21,22,23,24,25,26,27,28,29]);
  this.sprite.animations.add('down',[16]);
  this.sprite.animations.add('punch',[30,31]);
  this.sprite.animations.add('kick',[32,33]);
  this.sprite.animations.add('damage',[34,9]);
  this.sprite.facing = 'right';
  this.sprite.stopped = true;
  this.sprite.jumping = false;
  this.actions = function(param, boolean) {
    this.sprite.animations.play(param.animation, param.animationRateFrame, boolean);
    (function(target){
      param.actions.forEach(function(action){
        action(target);
      });
    })(this.sprite);
  }
}

var Fighter = function(game, x, y) { 
  enemies.push(this);   
  this.game = game;
  this.health = 20;
  this.alive = true;
  this.iswalking = false;
  this.sprite = game.add.sprite(x,y,'enemy1');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.animations.add('walk', [7,6,5,4,3,2,1,0]);
  this.sprite.animations.add('damage',[8,0]);
  this.sprite.animations.add('dead',[9,10,11,12,13,14,15,15,15,15,15,15,15,15,15,15]);
  this.sprite.animations.add('idle',[16,17,18,19,20,21]);
  this.deadAnimationTime = 800;
  this.actions = function(param, boolean) {
    this.sprite.animations.play(param.animation, param.animationRateFrame, boolean);
    (function(target){
      param.actions.forEach(function(action){
        action(target);
      });
    })(this.sprite);
  }
}

var Police = function(game, x, y) {
  enemies.push(this);  
  this.game = game;
  this.health = 20;
  this.alive = true;
  this.iswalking = false;
  this.sprite = game.add.sprite(x,y,'police');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
  this.sprite.animations.add('damage',[16,0]);
  this.sprite.animations.add('dead',[16,17,33,18,34,35,19,20,19,20,19,20]);
  this.sprite.animations.add('punch',[21,22,23,24]);
  this.sprite.animations.add('idle',[25,26,27,28,29,29,29,29,29,29,29,29,29,29,31,31,31,32,32,32]);
  this.deadAnimationTime = 1000;
  this.actions = function(param, boolean) {
    this.sprite.animations.play(param.animation, param.animationRateFrame, boolean);
    (function(target){
      param.actions.forEach(function(action){
        action(target);
      });
    })(this.sprite);
  }
}

var Boss = function(game, x, y) { 
  enemies.push(this);   
  this.game = game;
  this.name = 'boss';
  this.health = 50;
  this.alive = true;
  this.iswalking = false;
  this.sprite = game.add.sprite(x,y,'boss');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.animations.add('dead',[0,1,2,3,4,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,9,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11]);
  this.sprite.animations.add('walk', [18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21]);
  this.sprite.animations.add('damage',[22,22,22,22]);
  this.sprite.animations.add('idle',[12,13,14,15,16]);
  this.deadAnimationTime = 2000;
  this.actions = function(param, boolean) {
    this.sprite.animations.play(param.animation, param.animationRateFrame, boolean);
    (function(target){
      param.actions.forEach(function(action){
        action(target);
      });
    })(this.sprite);
  }
}

function create() {

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.add.sprite(0, 0, 'sky');
  mountains = game.add.sprite(0, 0, 'mountain');
  game.physics.enable(mountains, Phaser.Physics.ARCADE);
  bg = game.add.sprite(0, 0, 'background');


  enemies = [];

  enemy1 = new Police(game, 1750, 800);
  enemy2 = new Police(game, 2000, 800);
  enemy3 = new Police(game, 2590, 800);
  enemy4 = new Police(game, 3000, 800);
  enemy5 = new Police(game, 2800, 800);
  enemy6 = new Fighter(game, 3200, 800);
  enemy7 = new Fighter(game, 3700, 800);
  enemy8 = new Fighter(game, 4200, 800);
  boss = new Boss(game, 5100, 800);



  hero = new Hero(game, 0, 400);

  game.add.sprite(1150, 350,'gate');
  game.add.sprite(600, 330,'post');
  game.add.sprite(1400, 330,'post');
  game.add.sprite(2000, 330,'post');
  game.add.sprite(2600, 330,'post');
  game.add.sprite(3200, 330,'post');
  game.add.sprite(3800, 330,'post');
  ground = game.add.sprite(0, 0,'floor');
  game.physics.enable(ground, Phaser.Physics.ARCADE);
  ground.body.immovable = true;
  ground.body.setSize(ground.body.width,68);

  game.camera.bounds.width = ground.body.width;
  game.world.setBounds(0, 0, ground.body.width, 695); //695
  game.camera.follow(hero.sprite);

}


function update() {
  game.physics.arcade.collide(hero, ground);
  enemies.forEach(function(enemy) {
    game.physics.arcade.collide(hero, enemy);
    enemy.sprite.body.velocity.x = 0;
    if(enemy.isAlive == false) {
      enemy.sprite.animations.play('dead', 12, true);
      setTimeout(function(){
        enemy.sprite.kill();
        var index = enemies.indexOf(enemy);
        if(index > -1) {
          enemies.splice(index, 1);
        }
        enemy = null;
      },enemy.deadAnimationTime);
    }
    else if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) <= 250 && game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) >= 100) {
        if (enemy.iswalking) {
          enemy.sprite.animations.play('walk',12);
          enemy.sprite.body.x -= 4;
        }   
        else {
          events.emit('iswalking', enemy);
        }
    } 
    else {
      enemy.iswalking = false;
      enemy.sprite.animations.play('idle',12);
    }    
  });
  hero.sprite.body.velocity.x = 0;
  if(hero.sprite.position.x >= 2600) {
      game.camera.unfollow();
      lock = 1;    
  }
  if(enemies.length <= 4 && lock == 1) {
      game.camera.bounds.width = ground.body.width;
      game.world.setBounds(2600, 0, ground.body.width - 2600, 695); //695
      game.camera.follow(hero.sprite);
    }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    mountains.x -= 0.2;
    if(hero.sprite.facing != 'right') {
      hero.sprite.facing = 'right';
      hero.sprite.scale.x *= -1;
    }
    if(hero.sprite.body.onFloor()) {
      hero.actions(hero.params.walkRight);
    }
    else {
      hero.sprite.body.x += 4;
    }      
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
     if(mountains.x <= 0) {
      mountains.x += 0.2;
     }
    if(hero.sprite.facing != 'left') {
      hero.sprite.facing = 'left';
      hero.sprite.scale.x *= -1;
    }
    if(hero.sprite.body.onFloor()) {
      hero.actions(hero.params.walkLeft);
    }
    else {
      hero.sprite.body.x -= 4;
    }   
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && hero.sprite.body.onFloor())
  {
    hero.actions(hero.params.jump, false);      
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && hero.sprite.body.onFloor())
  {
    hero.sprite.animations.play('down',12);     
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.Z))
  {
    hero.actions(hero.params.punch);
  }
   else if (game.input.keyboard.isDown(Phaser.Keyboard.X))
  {
    hero.actions(hero.params.kick);
  }
  else if(hero.sprite.stopped) {
    hero.actions(hero.params.idle);
  }
}
   

function render() {
  game.debug.cameraInfo(game.camera,32,32);
}