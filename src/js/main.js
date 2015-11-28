var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render });
var facing = 'right';

function preload() {
  game.load.image('floor', './assets/images/floor.png', 68,150);
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 34);
  game.load.spritesheet('enemy1', './assets/images/enemy_2.png', 150, 160, 8);
}

var Hero = function(game, x, y) {
  this.params = {

    walkRight: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
          target.body.x += 4;
        }
      ]
    },
    walkLeft: {
      animation: 'walk',
      animationRateFrame: 10,
      actions: [
        function(target) {
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
      actions: []
    },
    kick: {
      animation: 'kick',
      animationRateFrame: 10,
      actions: []
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
  this.sprite.animations.add('walk',[0,1,2,3,4,5,6,7]);
  this.sprite.animations.add('idle',[8,9,10,11,12,13,14]);
  this.sprite.animations.add('jump',[16,17,18,19,20,21,22,23,24,25,26,27,28,29]);
  this.sprite.animations.add('punch',[30,31]);
  this.sprite.animations.add('kick',[32,33]);
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

  ground = game.add.sprite(0,0,'floor');
  game.physics.enable(ground, Phaser.Physics.ARCADE);
  ground.body.immovable = true;
  ground.body.setSize(ground.body.width,68);

  hero = new Hero(game, 0, 400);
  // enemy1 = new Enemy(game,200,530);
  // enemy = game.add.sprite(200, 530, 'enemy1');
  // game.physics.enable(enemy, Phaser.Physics.ARCADE);
  // enemy.body.bounce.y = 0;
  // enemy.body.gravity.y = 500;
  // enemy.body.collideWorldBounds = true;
  // enemy.animations.add('walk', [7,6,5,4,3,2,1,0]);
  

  game.camera.bounds.width = ground.body.width;
  game.world.setBounds(0, 0, ground.body.width, 768); //695
  game.camera.follow(hero.sprite);

}

// function heroCollider(player,enemy) {
//   console.log(enemy.body.touching);
// }

function update() {
  game.physics.arcade.collide(hero, ground);
  // game.physics.arcade.collide(hero, enemy);
  // game.physics.arcade.overlap(hero, enemy, heroCollider);
  hero.sprite.body.velocity.x = 0;
  // enemy.body.velocity.x = 0;
  // enemy.frame = 7;
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