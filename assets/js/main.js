(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(1024, 768, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
function preload() {
  game.load.image('floor', './assets/images/floor.png');
  game.load.image('background', './assets/images/background.png');
  game.load.spritesheet('hero', './assets/images/hero.png', 150, 175, 16);
}


function create() {
  background_position = 0;
  game.world.setBounds(0, 0, 400, 400);
  game.add.sprite(0, 0, 'floor');
  game.add.sprite(0, background_position, 'background');
  hero = game.add.sprite(0,535, 'hero');

    //  Here we add a new animation called 'walk'
    //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
  hero.animations.add('left',[0,1,2,3,4,5,6,7]);
  hero.animations.add('right',[8,9,10,11,12,13,14,15]);
  game.camera.follow(hero);

  cursors = game.input.keyboard.createCursorKeys();
    //  And this starts the animation playing by using its key ("walk")
    //  30 is the frame rate (30fps)
    //  true means it will loop when it finishes

}


function update() {
   if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
      hero.x -= 2;
      hero.animations.play('left', 6, true);
      game.camera.y -= 4
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        hero.x += 2;
        hero.animations.play('right', 6, true);
        game.camera.y -= 4
    }
    else {
       hero.animations.stop();
       hero.frame = 8;
    }
}

function render() {
  game.debug.cameraInfo(game.camera, 32, 32);
}
},{}]},{},[1])