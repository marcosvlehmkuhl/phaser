var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var facing = 'right';

function preload() {
  game.load.image('floor', './assets/images/floor.png', 68,150);
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 15);
}


function create() {
  game.world.setBounds(0, 0, 1024, 695); //695
  game.add.sprite(0, 0, 'background');
 
  hero = game.add.sprite(0,400, 'hero');
  game.physics.enable(hero, Phaser.Physics.ARCADE);
  hero.body.bounce.y = 0;
  hero.body.gravity.y = 500;
  hero.body.collideWorldBounds = true;
  hero.animations.add('walk',[0,1,2,3,4,5,6,7]);
  hero.animations.add('idle',[8,9,10,11,12,13,14]);
  
  ground = game.add.sprite(0,0,'floor');
  game.physics.enable(ground, Phaser.Physics.ARCADE);
  ground.body.immovable = true;
  
  game.camera.follow(hero);

  cursors = game.input.keyboard.createCursorKeys();
}


function update() {
  game.physics.arcade.collide(hero, ground);
   if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
      hero.x -= 2;
      hero.animations.play('walk', 10, true);
      game.camera.y -= 4
      facing = 'left';
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        hero.x += 2;
        hero.animations.play('walk', 10, true);
        game.camera.y -= 4
        facing = 'right';
    }
     else if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && hero.body.onFloor())
    {
      hero.animations.stop();
      hero.body.velocity.y = -250;
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

function render() {}