var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render });
var facing = 'right';


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
    data.alive = false;
    events.emit('isdead', data);
  }
});

events.on('kick', function(data){
  data.health --;
  data.sprite.animations.play('damage', 12);
  data.sprite.animations.play('walk', 2);
  if(data.health <= 0) {
    data.alive = false;
    events.emit('isdead', data);
  }
});

events.on('isdead', function(enemy){
  enemy.sprite.animations.stop();
  enemy.sprite.animations.play('dead',12);
  setTimeout(function(){
    enemy.sprite.kill();
  },3000)
})

function preload() {
  game.load.image('floor', './assets/images/floor.png', 68,150);
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 34);
  game.load.spritesheet('enemy1', './assets/images/enemy_2.png', 150, 160, 22);
}

var Hero = function(game, x, y) {
  this.params = {

    walkRight: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
          if(target.facing != 'right') {
            target.facing = 'right';
            target.scale.x *= -1;
          }
          target.body.x += 4;
        }
      ]
    },
    walkLeft: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
           if(target.facing != 'left') {
            target.facing = 'left';
            target.scale.x *= -1;
          }
          target.body.x -= 4;
        }
      ]
    },
    jump: {
      animation: 'jump',
      animationRateFrame: 10,
      actions: [
        function(target) {
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
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) < 100) {
              events.emit('punch', enemy); 
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
            if (game.physics.arcade.distanceBetween(hero.sprite, enemy.sprite) < 100) {
              events.emit('punch', enemy); 
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
  this.health = 3;
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
  this.sprite.animations.add('punch',[30,31]);
  this.sprite.animations.add('kick',[32,33]);
  this.sprite.facing = 'right';
  this.actions = function(param, boolean) {
    this.sprite.animations.play(param.animation, param.animationRateFrame, boolean);
    (function(target){
      param.actions.forEach(function(action){
        action(target);
      });
    })(this.sprite);
  }
}

var Enemy = function(game, x, y) {  
  this.game = game;
  this.health = 20;
  this.alive = true;
  this.sprite = game.add.sprite(x,y,'enemy1');
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.bounce.y = 0;
  this.sprite.body.gravity.y = 500;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.animations.add('walk', [7,6,5,4,3,2,1,0]);
  this.sprite.animations.add('damage',[8,0]);
  this.sprite.animations.add('dead',[9,10,11,12,13,14,15]);
  this.sprite.animations.add('idle',[16,17,18,19,20,21]);
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

  bg = game.add.sprite(0, 0, 'background');


  enemies = [];

  enemy = new Enemy(game, 300, 800);
  enemy2 = new Enemy(game, 600, 800);
  enemies.push(enemy);
  enemies.push(enemy2);    

  hero = new Hero(game, 0, 400);

  ground = game.add.sprite(0,0,'floor');
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
    // game.physics.arcade.overlap(hero, enemy, heroCollider);
    enemy.sprite.body.velocity.x = 0;
    if(!enemy.isAlive) {
      enemy.sprite.animations.stop();
      console.log('morreu');
    }
    enemy.sprite.animations.play('idle',12);    
  });
  hero.sprite.body.velocity.x = 0;

  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
    hero.actions(hero.params.walkRight);
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
    hero.actions(hero.params.walkLeft);
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && hero.sprite.body.onFloor())
  {
    hero.actions(hero.params.jump, false);
  }
   else if(hero.sprite.body.onFloor() == false) {
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.Z))
  {
    hero.actions(hero.params.punch);
  }
   else if (game.input.keyboard.isDown(Phaser.Keyboard.X))
  {
    hero.actions(hero.params.kick);
  }
  else {
    hero.actions(hero.params.idle);
  }
}
   

function render() {
  game.debug.cameraInfo(game.camera,32,32);
}