import 'phaser';

import GameScene from './scenes/gameScene';
import MenuScene from './scenes/menuScene';

export const phaserConfiguration = {
    type: Phaser.AUTO,
    backgroundColor: '#008080',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    render: {
        antialiasGL: false,
        pixelArt: true
    },
    scene: [MenuScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true,
            debugShowVelocity: true,
            debugShowBody: true,
            debugShowStaticBody: true
        }
    },
    audio: {
        disableWebAudio: false
    },
    autoFocus: true
};

export let game: Phaser.Game;
window.addEventListener('load', () => {
    game = new Phaser.Game(phaserConfiguration);
});
