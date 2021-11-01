import 'phaser';

declare var game: Phaser.Game;
declare var beforeinstallevent: any;
declare function runningStandalone(): boolean;

export default class MainMenuScene extends Phaser.Scene {
    fpsText: Phaser.GameObjects.Text;
    logo1: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('phaser-logo', 'assets/demoGame/phaser-logo.png');
        this.load.image('logo1', 'assets/demoGame/coder-1.png');
        this.load.image('logo2', 'assets/demoGame/coder-2.png');
        this.load.image('phaser', 'assets/demoGame/phaser-dude.png');
        this.load.image('fps', 'assets/demoGame/fps.png');
        this.load.image('learn-more', 'assets/demoGame/phaser-learn-more.png');

        this.load.spritesheet('dude-spritesheet', 'assets/demoGame/phaser-dude-spritesheet.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('cat-spritesheet', 'assets/demoGame/cat-spritesheet.png', { frameWidth: 500, frameHeight: 400 });
    }

    create() {
        // remove the loading screen
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

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.logo1 = this.physics.add.image(screenCenterX, 250, 'logo1');
        this.logo1.setOrigin(0.5, 0.5);
        this.logo1.setScale(0.3);
        this.logo1.body.setAllowGravity(false);

        const logo2 = this.add.sprite(screenCenterX, 250, 'logo2');
        logo2.setScale(0.3);

        var tween = this.tweens.add({
            targets: this.logo1,
            angle: 360.0,
            duration: 8500,
            repeat: -1
        });

        let learnMoreImg = this.add.image(screenCenterX, 360, 'learn-more');
        learnMoreImg.setOrigin(0.5, 0);
        learnMoreImg.setScale(0.85);

        var txt = this.add.text(screenCenterX, 90, 'Bine ati venit la atelierele CoderDojo!');
        txt.setOrigin(0.5, 1);
        txt.setColor('#c0c0c0');
        txt.setFontFamily('VT323');
        txt.setFontSize(60);

        var txt = this.add.text(screenCenterX, 120, '- Phaser 3 în TypeSript -');
        txt.setOrigin(0.5, 1);
        txt.setColor('#ffffff');
        txt.setFontFamily('VT323');
        txt.setFontSize(40);

        // display the Phaser.VERSION
        let dude = this.physics.add.image(this.cameras.main.width - 265, 40, 'phaser');
        dude.setOrigin(1, 0.5);

        this.add
            .text(this.cameras.main.width - 15, 40, `Phaser v${Phaser.VERSION}`, {
                color: '#f0f0f0',
                fontSize: '40px',
                // fontStyle: 'bold',
                fontFamily: 'VT323'
            })
            .setOrigin(1, 0.5);

        let fps = this.physics.add.image(15, 40, 'fps');
        fps.setOrigin(0, 0.5);

        this.fpsText = this.add.text(90, 40, '', {
            color: '#f0f0f0',
            fontSize: '40px',
            // fontStyle: 'bold',
            fontFamily: 'VT323'
        });
        this.fpsText.setOrigin(0, 0.5);

        this.anims.create({
            key: 'dude-anim',
            frames: this.anims.generateFrameNumbers('dude-spritesheet', {}),
            frameRate: 7,
            repeat: -1
        });
        this.add.sprite(400, 380, 'phaser').play('dude-anim');

        this.anims.create({
            key: 'cat-anim',
            frames: this.anims.generateFrameNumbers('cat-spritesheet', {}),
            frameRate: 7,
            repeat: -1
        });
        this.add.sprite(1600, 400, 'phaser').play('cat-anim');
    }

    update(time, delta) {
        this.fpsText.setText(`fps: ${Math.floor(this.game.loop.actualFps)}`);
    }
}
