import 'phaser';

enum HeroState {
    IDLE_SOUTH,
    IDLE_NORTH,
    IDLE_EAST,
    IDLE_WEST,

    WALK_SOUTH,
    WALK_NORTH,
    WALK_EAST,
    WALK_WEST,

    ATK_SOUTH,
    ATK_NORTH,
    ATK_EAST,
    ATK_WEST,

    DEAD_SOUTH,
    DEAD_NORTH,
    DEAD_EAST,
    DEAD_WEST
}

export default class Hero extends Phaser.GameObjects.Sprite {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;
    keyFire: Phaser.Input.Keyboard.Key;

    heroState: HeroState = HeroState.IDLE_SOUTH;

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

        this.anims.create({
            key: 'hitdead-E-anim',
            frames: this.anims.generateFrameNumbers('hitdead-E-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hitdead-N-anim',
            frames: this.anims.generateFrameNumbers('hitdead-N-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hitdead-S-anim',
            frames: this.anims.generateFrameNumbers('hitdead-S-spritesheet', {}),
            frameRate: 5,
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
        (this.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
        //this.setScale(1.4);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (HeroState[this.heroState].startsWith('DEAD_')) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            return;
        }

        if (this.keyFire.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        }

        if (
            this.keyFire.isDown &&
            (this.heroState == HeroState.WALK_EAST || this.heroState == HeroState.IDLE_EAST || this.heroState == HeroState.WALK_WEST || this.heroState == HeroState.IDLE_WEST) &&
            !HeroState[this.heroState].startsWith('ATK_')
        ) {
            this.anims.play('hero-atk-heavy-E-anim');
            this.heroState = HeroState.ATK_EAST;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE_EAST;
                this.anims.play('hero-idle-aggro-E-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == HeroState.WALK_NORTH || this.heroState == HeroState.IDLE_NORTH) && !HeroState[this.heroState].startsWith('ATK_')) {
            this.anims.play('hero-atk-heavy-N-anim');
            this.heroState = HeroState.ATK_NORTH;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE_NORTH;
                this.anims.play('hero-idle-aggro-N-anim');
            });
        }

        if (this.keyFire.isDown && (this.heroState == HeroState.WALK_SOUTH || this.heroState == HeroState.IDLE_SOUTH) && !HeroState[this.heroState].startsWith('ATK_')) {
            this.anims.play('hero-atk-heavy-S-anim');
            this.heroState = HeroState.ATK_SOUTH;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE_SOUTH;
                this.anims.play('hero-idle-aggro-S-anim');
            });
        }

        if (HeroState[this.heroState].startsWith('ATK_')) {
            return;
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        let speed = 175;
        if (this.keyLeft.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-speed);
            this.setFlipX(true);
            this.heroState = HeroState.WALK_WEST;
        }
        if (this.keyRight.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(speed);
            this.setFlipX(false);
            this.heroState = HeroState.WALK_EAST;
        }
        if (this.keyUp.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-speed);
            this.heroState = HeroState.WALK_NORTH;
        }
        if (this.keyDown.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(speed);
            this.heroState = HeroState.WALK_SOUTH;
        }

        //hero is idle
        if (this.keyLeft.isUp && this.keyRight.isUp && this.keyDown.isUp && this.keyUp.isUp) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            if (this.heroState == HeroState.WALK_NORTH) {
                this.heroState = HeroState.IDLE_NORTH;
            } else if (this.heroState == HeroState.WALK_SOUTH) {
                this.heroState = HeroState.IDLE_SOUTH;
            } else if (this.heroState == HeroState.WALK_EAST) {
                this.heroState = HeroState.IDLE_EAST;
            } else if (this.heroState == HeroState.WALK_WEST) {
                this.heroState = HeroState.IDLE_WEST;
            }
        }

        //animations
        if (this.heroState == HeroState.IDLE_EAST || this.heroState == HeroState.IDLE_WEST) {
            this.anims.play('hero-idle-aggro-E-anim', true);
        }
        if (this.heroState == HeroState.IDLE_NORTH) {
            this.anims.play('hero-idle-aggro-N-anim', true);
        }
        if (this.heroState == HeroState.IDLE_SOUTH) {
            this.anims.play('hero-idle-aggro-S-anim', true);
        }

        if (this.heroState == HeroState.WALK_WEST || this.heroState == HeroState.WALK_EAST) {
            this.anims.play('hero-walk-aggro-E-anim', true);
        }
        if (this.heroState == HeroState.WALK_NORTH) {
            this.anims.play('hero-walk-aggro-N-anim', true);
        }
        if (this.heroState == HeroState.WALK_SOUTH) {
            this.anims.play('hero-walk-aggro-S-anim', true);
        }

        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        (this.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(speed);
    }

    die() {
        if (HeroState[this.heroState].startsWith('DEAD_')) {
            return;
        }
        if (HeroState[this.heroState].includes('SOUTH')) {
            this.heroState = HeroState.DEAD_SOUTH;
            this.anims.play('hitdead-S-anim', true);
        }
        if (HeroState[this.heroState].includes('NORTH')) {
            this.heroState = HeroState.DEAD_NORTH;
            this.anims.play('hitdead-N-anim', true);
        }
        if (HeroState[this.heroState].includes('EAST')) {
            this.heroState = HeroState.DEAD_EAST;
            this.anims.play('hitdead-E-anim', true);
        }
        if (HeroState[this.heroState].includes('WEST')) {
            this.heroState = HeroState.DEAD_WEST;
            this.anims.play('hitdead-E-anim', true);
        }
    }
}
