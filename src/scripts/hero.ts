import 'phaser';
import Grizzly from './grizzly';

enum HeroPosition {
    WEST,
    EAST,
    NORTH,
    SOUTH
}
enum HeroState {
    IDLE,
    WALK,
    ATTACK,
    DEAD
}

export default class Hero extends Phaser.GameObjects.Sprite {
    keyLeft: Phaser.Input.Keyboard.Key;
    keyRight: Phaser.Input.Keyboard.Key;
    keyUp: Phaser.Input.Keyboard.Key;
    keyDown: Phaser.Input.Keyboard.Key;
    keyFire: Phaser.Input.Keyboard.Key;

    heroState: HeroState = HeroState.IDLE;
    heroPosition: HeroPosition = HeroPosition.WEST;

    killedEnemies: Array<Grizzly> = [];

    constructor(scene, x, y) {
        super(scene, x, y, 'hero-walk-S-spritesheet', 0);

        this.anims.create({
            key: 'hero-idle-e-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-e-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-e-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-e-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-s-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-s-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-idle-s-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-s-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-idle-n-anim',
            frames: this.anims.generateFrameNumbers('hero-idle-n-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hero-walk-n-anim',
            frames: this.anims.generateFrameNumbers('hero-walk-n-spritesheet', {}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'hero-atk-e-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-e-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-n-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-n-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-atk-s-anim',
            frames: this.anims.generateFrameNumbers('hero-atk-s-spritesheet', {}),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-hitdead-e-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-e-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-hitdead-n-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-n-spritesheet', {}),
            frameRate: 5,
            repeat: 0
        });

        this.anims.create({
            key: 'hero-hitdead-s-anim',
            frames: this.anims.generateFrameNumbers('hero-hitdead-s-spritesheet', {}),
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
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);

        if (this.heroState == HeroState.DEAD) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
            return;
        }

        if (this.keyFire.isDown && this.heroState != HeroState.ATTACK) {
            let cardinalPosition = HeroPosition[this.heroPosition].charAt(0).toLowerCase();
            if (cardinalPosition == 'w') {
                cardinalPosition = 'e';
            }
            this.anims.play('hero-atk-' + cardinalPosition + '-anim');
            this.heroState = HeroState.ATTACK;
            this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                this.heroState = HeroState.IDLE;
                this.anims.play('hero-idle-' + cardinalPosition + '-anim');
            });
        }

        //kill enemy
        if (this.heroState == HeroState.ATTACK) {
            let enemies;
            if (this.heroPosition == HeroPosition.NORTH) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).left - 11, (this.body as Phaser.Physics.Arcade.Body).top - 45, 35, 45);
                // let rectangle = this.scene.add.rectangle(
                //     (this.body as Phaser.Physics.Arcade.Body).left - 11,
                //     (this.body as Phaser.Physics.Arcade.Body).top - 45,
                //     35,
                //     45,
                //     0xeb6434,
                //     0.5
                // );
                // rectangle.setOrigin(0, 0);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).left - 11, (this.body as Phaser.Physics.Arcade.Body).bottom, 35, 45);
                // let rectangle = this.scene.add.rectangle(
                //     (this.body as Phaser.Physics.Arcade.Body).left - 11,
                //     (this.body as Phaser.Physics.Arcade.Body).bottom,
                //     35,
                //     45,
                //     0xeb6434,
                //     0.5
                // );
                // rectangle.setOrigin(0, 0);
            }
            if (this.heroPosition == HeroPosition.WEST) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).right, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35);
                // let rectangle = this.scene.add.rectangle((this.body as Phaser.Physics.Arcade.Body).right, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35, 0xeb6434, 0.5);
                // rectangle.setOrigin(0, 0);
            }
            if (this.heroPosition == HeroPosition.EAST) {
                enemies = this.scene.physics.overlapRect((this.body as Phaser.Physics.Arcade.Body).left - 45, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35);
                // let rectangle = this.scene.add.rectangle((this.body as Phaser.Physics.Arcade.Body).left - 45, (this.body as Phaser.Physics.Arcade.Body).top, 45, 35, 0xeb6434, 0.5);
                // rectangle.setOrigin(0, 0);
            }

            for (let enemy of enemies) {
                if (enemy.gameObject instanceof Grizzly) {
                    enemy.gameObject.freeze();
                    if (!this.killedEnemies.includes(enemy.gameObject)) {
                        this.killedEnemies.push(enemy.gameObject);
                    }
                }
            }

            if (this.listenerCount(Phaser.Animations.Events.ANIMATION_COMPLETE) == 1) {
                this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    for (let enemy of this.killedEnemies) {
                        enemy.kill();
                    }
                    this.killedEnemies = [];
                });
            }
        }

        if (this.heroState == HeroState.ATTACK) {
            return;
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.keyRight.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(175);
            this.setFlipX(false);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.WEST;
        }

        if (this.keyLeft.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityX(-175);
            this.setFlipX(true);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.EAST;
        }

        if (this.keyDown.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.SOUTH;
        }
        if (this.keyUp.isDown) {
            (this.body as Phaser.Physics.Arcade.Body).setVelocityY(-175);
            this.heroState = HeroState.WALK;
            this.heroPosition = HeroPosition.NORTH;
        }

        //hero is idle
        if (this.keyRight.isUp && this.keyLeft.isUp && this.keyDown.isUp && this.keyUp.isUp) {
            this.heroState = HeroState.IDLE;
        }

        //animations
        if (this.heroState == HeroState.IDLE) {
            if (this.heroPosition == HeroPosition.WEST || this.heroPosition == HeroPosition.EAST) {
                this.anims.play('hero-idle-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('hero-idle-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('hero-idle-n-anim', true);
            }
        }
        if (this.heroState == HeroState.WALK) {
            if (this.heroPosition == HeroPosition.WEST || this.heroPosition == HeroPosition.EAST) {
                this.anims.play('hero-walk-e-anim', true);
            }
            if (this.heroPosition == HeroPosition.SOUTH) {
                this.anims.play('hero-walk-s-anim', true);
            }
            if (this.heroPosition == HeroPosition.NORTH) {
                this.anims.play('hero-walk-n-anim', true);
            }
        }

        // Normalize and scale the velocity so that this.hero can't move faster along a diagonal
        (this.body as Phaser.Physics.Arcade.Body).velocity.normalize().scale(175);
    }

    kill() {
        if (this.heroState == HeroState.DEAD) {
            return;
        }

        let cardinalPosition = HeroPosition[this.heroPosition].charAt(0).toLowerCase();
        if (cardinalPosition == 'w') {
            cardinalPosition = 'e';
        }
        this.heroState = HeroState.DEAD;
        this.anims.play('hero-hitdead-' + cardinalPosition + '-anim', true);
    }
}
