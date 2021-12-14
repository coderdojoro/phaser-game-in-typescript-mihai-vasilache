import 'phaser';

export default class Hero extends Phaser.GameObjects.Sprite {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;
    keyFire: Phaser.Input.Keyboard.Key;

    heroState = 'idle';

    constructor(scene, x, y) {
        super(scene, x, y, 'hero-walk-aggro-S-spritesheet', 0);

        this.anims.create({
            key: 'hero-idle-aggro-E-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-E-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-idle-aggro-N-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-N-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-idle-aggro-S-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-aggro-S-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-E-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-E-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-N-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-N-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-walk-aggro-S-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-aggro-S-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-atk-heavy-E-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-E-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-heavy-N-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-N-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-heavy-S-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-heavy-S-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.keyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyUp = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyDown = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyFire = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setSize(15, 35);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(57, 49);
        this.setScale(1.4);
        this.anims.play('hero-idle-aggro-S-anim');
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.keyFire.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        }

        if (
            this.keyFire.isDown &&
            (this.heroState == 'walk-E' || this.heroState == 'idle-E' || this.heroState == 'walk-W' || this.heroState == 'idle-W') &&
            !this.heroState.startsWith('atk-')
        ) {
            this.anims.play('hero-atk-heavy-E-anim');
            this.heroState = 'atk-E';
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-E';
                this.anims.play('hero-idle-aggro-E-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == 'walk-N' || this.heroState == 'idle-N') && !this.heroState.startsWith('atk-')) {
            this.anims.play('hero-atk-heavy-N-anim');
            this.heroState = 'atk-N';
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-N';
                this.anims.play('hero-idle-aggro-N-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == 'walk-S' || this.heroState == 'idle-S') && !this.heroState.startsWith('atk-')) {
            this.anims.play('hero-atk-heavy-S-anim');
            this.heroState = 'atk-S';
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = 'idle-S';
                this.anims.play('hero-idle-aggro-S-anim');
            });
        }

        if (this.heroState.startsWith('atk-')) {
            return;
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        let speed = 175;
        if (this.keyLeft.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-speed);
            this.setFlipX(true);
            this.heroState = 'walk-W';
        }
        if (this.keyRight.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
            this.setFlipX(false);
            this.heroState = 'walk-E';
        }
        if (this.keyUp.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-speed);
            this.heroState = 'walk-N';
        }
        if (this.keyDown.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(speed);
            this.heroState = 'walk-S';
        }

        //hero is idle
        if (this.keyLeft.isUp && this.keyRight.isUp && this.keyDown.isUp && this.keyUp.isUp) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            if (this.heroState == 'walk-N') {
                this.heroState = 'idle-N';
            } else if (this.heroState == 'walk-S') {
                this.heroState = 'idle-S';
            } else if (this.heroState == 'walk-E') {
                this.heroState = 'idle-E';
            } else if (this.heroState == 'walk-W') {
                this.heroState = 'idle-W';
            }
        }

        //animations
        if (this.heroState == 'idle-E' || this.heroState == 'idle-W') {
            this.anims.play('hero-idle-aggro-E-anim', true);
        }
        if (this.heroState == 'idle-N') {
            this.anims.play('hero-idle-aggro-N-anim', true);
        }
        if (this.heroState == 'idle-S') {
            this.anims.play('hero-idle-aggro-S-anim', true);
        }

        if (this.heroState == 'walk-W' || this.heroState == 'walk-E') {
            this.anims.play('hero-walk-aggro-E-anim', true);
        }
        if (this.heroState == 'walk-N') {
            this.anims.play('hero-walk-aggro-N-anim', true);
        }
        if (this.heroState == 'walk-S') {
            this.anims.play('hero-walk-aggro-S-anim', true);
        }

        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        (this.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(speed);
    }
}
