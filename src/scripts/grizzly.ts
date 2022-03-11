import 'phaser';
import * as EasyStar from 'easystarjs';
import Hero from './hero';
import MainMenuScene from './scenes/mainMenuScene';

enum State {
    IDLE,
    FOLLOW
}

export default class Grizzly extends Phaser.GameObjects.Sprite {
    enemyState: State = State.IDLE;

    easystar: EasyStar.js;
    target?: Phaser.Math.Vector2;

    constructor(scene, x, y) {
        super(scene, x, y, 'grizzly-idle-spritesheet', 0);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.anims.create({
            key: 'grizzly-idle-anim',
            frames: this.anims.generateFrameNumbers('grizzly-idle-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-N-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-N-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-S-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-S-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-walk-W-anim',
            frames: this.anims.generateFrameNumbers('grizzly-walk-W-spritesheet', {}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'grizzly-die-anim',
            frames: this.anims.generateFrameNumbers('grizzly-die-spritesheet', {}),
            frameRate: 7,
            repeat: 0
        });

        this.scene.physics.add.overlap(
            (this.scene as MainMenuScene).hero,
            this,
            () => {
                (this.scene as MainMenuScene).hero.die();
            },
            undefined,
            this
        );

        this.easystar = new EasyStar.js();
        this.easystar.setGrid((this.scene as MainMenuScene).worldLayer.layer.data.map((arr) => arr.map((tile) => tile.index)));
        this.easystar.setAcceptableTiles(-1);
        this.easystar.enableDiagonals();
        this.easystar.enableCornerCutting();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, (this.scene as MainMenuScene).hero.x, (this.scene as MainMenuScene).hero.y);
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
            (this.scene as MainMenuScene).map.worldToTileX(this.x),
            (this.scene as MainMenuScene).map.worldToTileY(this.y),
            (this.scene as MainMenuScene).map.worldToTileX((this.scene as MainMenuScene).hero.x),
            (this.scene as MainMenuScene).map.worldToTileY((this.scene as MainMenuScene).hero.y),
            (path) => {
                if (path.length == 0) {
                    this.target = new Phaser.Math.Vector2((this.scene as MainMenuScene).hero.x, (this.scene as MainMenuScene).hero.y);
                    this.enemyState = State.FOLLOW;
                    this.setWalkAnimation();
                    return;
                }
                if (path == null) {
                    this.enemyState = State.IDLE;
                    this.target = undefined;
                    return;
                }
                this.target = new Phaser.Math.Vector2(
                    (this.scene as MainMenuScene).map.tileToWorldX(path[1].x) + 16,
                    (this.scene as MainMenuScene).map.tileToWorldY(path[1].y) + 16
                );
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
            let grizzlyTile = (this.scene as MainMenuScene).map.worldToTileXY(this.x, this.y);
            let targetTile = (this.scene as MainMenuScene).map.worldToTileXY(this.target!.x, this.target!.y);
            if (grizzlyTile.x < targetTile.x) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }
            if (grizzlyTile.y == targetTile.y) {
                this.anims.play('grizzly-walk-W-anim', true);
            } else {
                if (this.y <= this.target!.y) {
                    console.log(this.y, this.target!.y, 'S');
                    this.anims.play('grizzly-walk-S-anim', true);
                } else {
                    console.log(grizzlyTile.y, targetTile.y, 'N');
                    this.anims.play('grizzly-walk-N-anim', true);
                }
            }
        }
    }

    kill() {}
}
