var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var facing = 'right';

function preload() {
  game.load.image('floor', './assets/images/floor.png');
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero2.png', 150, 160, 15);
}


function create() {
  background_position = 0;
  game.world.setBounds(0, 0, 400, 400);
  game.add.sprite(0, 0, 'floor');
  game.add.sprite(0, background_position, 'background');
  hero = game.add.sprite(0,537, 'hero');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
  hero.animations.add('walk',[0,1,2,3,4,5,6,7]);
  hero.animations.add('idle',[8,9,10,11,12,13,14]);
  game.camera.follow(hero);

  cursors = game.input.keyboard.createCursorKeys();
}


function update() {
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
  game.debug.cameraInfo(game.camera, 32, 32);
}