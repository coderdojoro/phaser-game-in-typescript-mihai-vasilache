import 'phaser';
import * as EasyStar from 'easystarjs';
import Hero from './hero';
import GameScene from '../scenes/gameScene';

enum State {
    IDLE,
    FOLLOW,
    FREEZE,
    DEAD
}

export default class Grizzly extends Phaser.GameObjects.Sprite {
    enemyState: State = State.IDLE;

    easystar: EasyStar.js;
    target?: Phaser.Math.Vector2;

    heroCollider: Phaser.Physics.Arcade.Collider;

    constructor(scene, x, y) {
        super(scene, x, y, 'grizzly-idle-spritesheet', 0);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        (this.body as Phaser.Physics.Arcade.Body).setSize(20, 31);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(6, 1);

        this.anims.create({
            key: 'grizzly-idle-anim',
            frames: this.anims.generateFrameNumbers('grizzly-idle-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-n-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-n-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-s-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-s-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-e-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-e-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-die-anim',
            frames: this.anims.generateFrameNumbers('grizzly-die-spritesheet', {}),
            frameRate: 7,
            repeat: 0
        });

        this.heroCollider = this.scene.physics.world.addOverlap(
            (this.scene as GameScene).hero,
            this,
            () => {
                (this.scene as GameScene).hero.kill();
            },
            undefined,
            this
        );

        this.easystar = new EasyStar.js();
        this.easystar.setGrid((this.scene as GameScene).worldLayer.layer.data.map((arr) => arr.map((tile) => tile.index)));
        this.easystar.setAcceptableTiles(-1);
        this.easystar.enableDiagonals();
        this.easystar.enableCornerCutting();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.enemyState == State.DEAD || this.enemyState == State.FREEZE) {
            return;
        }

        let distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, (this.scene as GameScene).hero.x, (this.scene as GameScene).hero.y);
        if (distanceFromPlayer <= 300 && !this.target) {
            this.computeNextTarget();
        }

        if (this.target) {
            let distanceFromTarget = Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y);
            //console.log('distance: ' + distanceFromTarget);
            if (distanceFromTarget < 3) {
                this.computeNextTarget();
            }
        }

        if (this.target) {
            this.scene.physics.moveTo(this, this.target.x, this.target.y, 100);
        }

        if (this.enemyState == State.IDLE) {
            this.anims.play('grizzly-idle-anim', true);
        }
    }

    computeNextTarget() {
        this.easystar.findPath(
            (this.scene as GameScene).map.worldToTileX(this.x),
            (this.scene as GameScene).map.worldToTileY(this.y),
            (this.scene as GameScene).map.worldToTileX((this.scene as GameScene).hero.x),
            (this.scene as GameScene).map.worldToTileY((this.scene as GameScene).hero.y),
            (path) => {
                if (path == null) {
                    this.enemyState = State.IDLE;
                    this.target = undefined;
                    return;
                }
                if (path.length == 0) {
                    this.target = new Phaser.Math.Vector2((this.scene as GameScene).hero.x, (this.scene as GameScene).hero.y);
                    this.enemyState = State.FOLLOW;
                    this.setWalkAnimation();
                    return;
                }
                this.target = new Phaser.Math.Vector2((this.scene as GameScene).map.tileToWorldX(path[1].x) + 16, (this.scene as GameScene).map.tileToWorldY(path[1].y) + 16);
                this.enemyState = State.FOLLOW;
                this.setWalkAnimation();
                // for (let point of path) {
                //     let worldXY = (this.scene as MainMenuScene).map.tileToWorldXY(point.x, point.y);
                //     let circle = this.scene.add.circle(worldXY.x + 16, worldXY.y + 16, 5, 0xff0000);
                // }
            }
        );
        this.easystar.calculate();
    }

    setWalkAnimation() {
        if (this.enemyState == State.FOLLOW) {
            let grizzlyTile = (this.scene as GameScene).map.worldToTileXY(this.x, this.y);
            let targetTile = (this.scene as GameScene).map.worldToTileXY(this.target!.x, this.target!.y);
            if (grizzlyTile.x < targetTile.x) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            if (grizzlyTile.y == targetTile.y) {
                this.anims.play('grizzly-walk-e-anim', true);
            } else {
                if (this.y <= this.target!.y) {
                    this.anims.play('grizzly-walk-s-anim', true);
                } else {
                    this.anims.play('grizzly-walk-n-anim', true);
                }
            }
        }
    }

    freeze() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.FREEZE;
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    }

    kill() {
        if (this.enemyState == State.DEAD) {
            return;
        }
        this.enemyState = State.DEAD;
        this.anims.play('grizzly-die-anim', true);
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        this.scene.physics.world.removeCollider(this.heroCollider);
    }
}
