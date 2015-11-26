var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render });
var facing = 'right';

function preload() {
  game.load.image('floor', './assets/images/floor.png', 68,150);
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 34);
  game.load.spritesheet('enemy1', './assets/images/enemy_2.png', 150, 160, 8);
}


function create() {

  // game.physics.startSystem(Phaser.Physics.ARCADE);

  bg = game.add.sprite(0, 0, 'background');

  ground = game.add.sprite(0,0,'floor');
  game.physics.enable(ground, Phaser.Physics.ARCADE);
  ground.body.immovable = true;
  // ground.body.setSize(ground.body.width,68);

  enemy = game.add.sprite(200, 530, 'enemy1');
  game.physics.enable(enemy, Phaser.Physics.ARCADE);
  enemy.body.bounce.y = 0;
  enemy.body.gravity.y = 500;
  enemy.body.collideWorldBounds = true;
  enemy.animations.add('walk', [7,6,5,4,3,2,1,0]);

  hero = game.add.sprite(0,400, 'hero');
  game.physics.enable(hero, Phaser.Physics.ARCADE);
  hero.body.bounce.y = 0;
  hero.body.gravity.y = 500;
  hero.body.collideWorldBounds = true;
  hero.animations.add('walk',[0,1,2,3,4,5,6,7]);
  hero.animations.add('idle',[8,9,10,11,12,13,14]);
  hero.animations.add('jump',[16,17,18,19,20,21,22,23,24,25,26,27,28,29]);
  hero.animations.add('punch',[30,31]);
  hero.animations.add('kick',[32,33]);
  

  game.camera.bounds.width = ground.body.width;
  game.world.setBounds(0, 0, ground.body.width, 768); //695
  game.camera.follow(hero);

}

function heroCollider(player,enemy) {
  console.log(enemy.body.touching);
}

function update() {
  game.physics.arcade.collide(hero, ground);
  // game.physics.arcade.collide(hero, enemy);
  // game.physics.arcade.overlap(hero, enemy, heroCollider);
  hero.body.velocity.x = 0;
  // enemy.body.velocity.x = 0;
  enemy.frame = 7;
   if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
      hero.x -= 4;
      // hero.body.velocity.x = -150;
      hero.animations.play('walk', 10);
      game.camera.x -= 4;
      facing = 'left';
    }
    else if (game.physics.arcade.distanceBetween(hero, enemy) < 50) {
      console.log('distanceBetween');
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
      hero.x += 4;
      // hero.body.velocity.x = +150;
      facing = 'right';
      if(hero.body.onFloor() == false) {

      }
      else {
        hero.animations.play('walk', 10);
      }
    }
     else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && hero.body.onFloor())
    {
      hero.animations.play('jump', 12, true);
      hero.body.velocity.y = -250;
    }
    else if(game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
      hero.animations.play('punch',12,false);
    }
     else if(game.input.keyboard.isDown(Phaser.Keyboard.X)) {
      hero.animations.play('kick',6,false);
    }
     else if(hero.body.onFloor() == false) {
    }
    else {
       if(facing == 'left') {
        hero.animations.play('idle', 10, true);
       }
       if(facing == 'right') {
        hero.animations.play('idle', 10, true);
       }
    }
}

function render() {
  game.debug.cameraInfo(game.camera,32,32);
}