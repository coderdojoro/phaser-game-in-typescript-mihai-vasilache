import 'phaser';

import GameScene from './scenes/gameScene';
import House1FirstFloorScene from './scenes/house1FirstFloorScene';
import House1GroundFloorScene from './scenes/house1GroundFloorScene';
import House1Scene from './scenes/house1GroundFloorScene';
import MenuScene from './scenes/menuScene';
import StoreScene from './scenes/storeScene';
import { PhaserNavMeshPlugin } from 'phaser-navmesh';
import VJoyPlugin from 'phaser3-vjoy-plugin';

export const phaserConfiguration = {
    type: Phaser.AUTO,
    backgroundColor: '#008080',
    plugins: {
        scene: [
            {
                key: 'PhaserNavMeshPlugin', // Key to store the plugin class under in cache
                plugin: PhaserNavMeshPlugin, // Class that constructs plugins
                mapping: 'navMeshPlugin', // Property mapping to use for the scene, e.g. this.navMeshPlugin
                start: true
            },
            {
                key: 'VJoyPlugin', // Key to store the plugin class under in cache
                plugin: VJoyPlugin, // Class that constructs plugins
                mapping: 'vjoy', // Property mapping to use for the scene, e.g. this.navMeshPlugin
                start: true
            }
        ]
    },
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
    scene: [MenuScene, GameScene, House1GroundFloorScene, House1FirstFloorScene, StoreScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
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
