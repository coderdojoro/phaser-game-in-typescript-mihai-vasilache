import 'phaser';
// import * as EasyStar from 'easystarjs';
import Hero from './hero';
import GameScene from '../scenes/gameScene';
import { PhaserNavMesh, PhaserNavMeshPlugin } from 'phaser-navmesh/src';
import { Tilemaps } from 'phaser';

enum State {
    IDLE,
    FOLLOW,
    FREEZE,
    DEAD
}

export default class Grizzly extends Phaser.GameObjects.Sprite {
    enemyState: State = State.IDLE;

    //easystar: EasyStar.js;
    navMesh: PhaserNavMesh;

    //in pixels (adjusted to +- 16 px to the middle of tile)
    target?: Phaser.Math.Vector2;

    heroCollider: Phaser.Physics.Arcade.Collider;

    scene: GameScene;

    debugCircles: Phaser.GameObjects.Arc[] = new Array();

    constructor(scene: GameScene, x, y) {
        super(scene, x, y, 'grizzly-idle-spritesheet', 0);
        this.scene = scene;
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
            this.scene.hero,
            this,
            () => {
                this.scene.hero.kill();
            },
            undefined,
            this
        );

        // this.easystar = new EasyStar.js();
        // this.easystar.setGrid(this.scene.worldLayer.layer.data.map((arr) => arr.map((tile) => tile.index)));
        // this.easystar.setAcceptableTiles(-1);
        // this.easystar.enableDiagonals();
        // this.easystar.enableCornerCutting();

        let plugin = this.scene.plugins.get('PhaserNavMeshPlugin') as PhaserNavMeshPlugin;
        this.navMesh = plugin.buildMeshFromTilemap('mesh', this.scene.worldLayer.layer.tilemapLayer.tilemap);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        console.log('State: ' + State[this.enemyState]);
        if (this.enemyState == State.DEAD || this.enemyState == State.FREEZE) {
            return;
        }

        if (this.enemyState == State.IDLE) {
            let distanceFromPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.scene.hero.x, this.scene.hero.y);
            if (distanceFromPlayer <= 300 && !this.target) {
                this.computeNextTarget();
            }
        }

        if (this.enemyState == State.FOLLOW) {
            let distanceFromTarget = Phaser.Math.Distance.Between(this.target!.x, this.target!.y, this.x, this.y);
            console.log('distancefrom target: ' + distanceFromTarget);
            if (distanceFromTarget < 2) {
                console.log('compyte netxt target...');
                this.computeNextTarget();
            }

            this.scene.physics.moveTo(this, this.target!.x, this.target!.y, 100);
            this.setWalkAnimation();
        }

        if (this.enemyState == State.IDLE) {
            this.anims.play('grizzly-idle-anim', true);
        }
    }

    computeNextTarget() {
        // this.easystar.findPath(
        //     this.scene.map.worldToTileX(this.x),
        //     this.scene.map.worldToTileY(this.y),
        //     this.scene.map.worldToTileX(this.scene.hero.x),
        //     this.scene.map.worldToTileY(this.scene.hero.y),
        //     (path) => {
        let path = this.navMesh.findPath({ x: 0, y: 0 }, { x: 300, y: 400 });
        if (path == null) {
            console.log('enemy BLOCKED!!!!');
            this.enemyState = State.IDLE;
            return;
        }
        // path contains the player and the grizzly tiles: 2 should means that there is nothing between them
        if (path.length <= 2) {
            this.target = new Phaser.Math.Vector2(this.scene.hero.x, this.scene.hero.y);
            console.log('Compute direct to player: ' + this.target.x + ', ' + this.target.y);
            this.enemyState = State.FOLLOW;
            return;
        }

        this.target = new Phaser.Math.Vector2(this.scene.map.tileToWorldX(path[1].x) + 16, this.scene.map.tileToWorldY(path[1].y) + 16);
        console.log('Compute to tile: ' + this.target.x + ', ' + this.target.y);
        this.enemyState = State.FOLLOW;
        // display computed path With red bullets:
        // for (let circle of this.debugCircles) {
        //     circle.destroy();
        // }
        // this.debugCircles = [];
        // for (let point of path) {
        //     let worldXY = this.scene.map.tileToWorldXY(point.x, point.y);
        //     let circle = this.scene.add.circle(worldXY.x + 16, worldXY.y + 16, 5, 0xff0000);
        //     this.debugCircles.push(circle);
        // }
        // }
        // );
        // this.easystar.calculate();
    }

    setWalkAnimation() {
        // if (this.enemyState != State.FOLLOW) {
        //     return;
        // }
        let velocityRadiansAngle = (this.body as Phaser.Physics.Arcade.Body).velocity.angle();
        let velocityDegreeAngle = (velocityRadiansAngle * 180) / Math.PI;

        let direction: string = 'err';
        if (velocityDegreeAngle >= 315 || velocityDegreeAngle <= 45) {
            direction = 'e';
        }
        if (135 <= velocityDegreeAngle && velocityDegreeAngle <= 225) {
            direction = 'w';
        }
        if (45 < velocityDegreeAngle && velocityDegreeAngle < 135) {
            direction = 's';
        }
        if (225 < velocityDegreeAngle && velocityDegreeAngle < 315) {
            direction = 'n';
        }

        if (direction == 'e') {
            this.setFlipX(false);
        } else {
            this.setFlipX(true);
        }

        if (direction == 'e' || direction == 'w') {
            this.anims.play('grizzly-walk-e-anim', true);
        }
        if (direction == 's') {
            this.anims.play('grizzly-walk-s-anim', true);
        }
        if (direction == 'n') {
            this.anims.play('grizzly-walk-n-anim', true);
        }
    }

    // freeze() {
    //     if (this.enemyState == State.DEAD) {
    //         return;
    //     }
    //     this.enemyState = State.FREEZE;
    //     (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    // }

    // kill() {
    //     if (this.enemyState == State.DEAD) {
    //         return;
    //     }
    //     this.enemyState = State.DEAD;
    //     this.anims.play('grizzly-die-anim', true);
    //     (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    //     this.scene.physics.world.removeCollider(this.heroCollider);
    //     this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
    //         this.setActive(false);
    //     });
    //     this.scene.time.delayedCall(30 * 1000, () => this.destroy(), [], this);
    // }
}
