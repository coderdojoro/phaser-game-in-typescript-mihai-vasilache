import 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('play', 'assets/menu/play.png');
        this.load.image('play-focus', 'assets/menu/play-focus.png');
        this.load.image('title', 'assets/menu/title-bg.png');
    }

    create() {
        //remove the loading screen
        let loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('transparent');
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    // @ts-ignore
                    loadingScreen.remove();
                }
            });
        }

        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor('#008080');

        let screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

        let title = this.add.image(screenCenterX, 50, 'title');
        title.setOrigin(0.5, 0);
        let play = this.add.sprite(screenCenterX, 850, 'play').setInteractive();
        title.setOrigin(0.5, 0);

        play.on(Phaser.Input.Events.POINTER_OVER, () => {
            play.setTexture('play-focus');
        });
        play.on(Phaser.Input.Events.POINTER_OUT, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_DOWN, () => {
            play.setTexture('play');
        });
        play.on(Phaser.Input.Events.POINTER_UP, () => {
            play.setTexture('play-focus');
            this.scene.start('GameScene');
        });
    }
}
