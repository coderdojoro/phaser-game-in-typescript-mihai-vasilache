import 'phaser';
import { AreaCollision } from './scripts/scenes/gameScene';
import Hero from './scripts/sprites/hero';

//Scene needs to have the fields:
// hero: Hero;
// heroArea: String | null = null;
// areaObjects: Array<Phaser.Types.Tilemaps.TiledObject>;

export default class AreaCollier {
    scene: any;

    constructor(scene: Phaser.Scene, landingArea: string | null) {
        this.scene = scene;
        this.scene.heroArea = landingArea;
    }

    update() {
        for (let area of this.scene.areaObjects) {
            //debug:
            // let rectangle = this.scene.add.rectangle(area.x!, area.y!, area.width!, area.height!);
            // rectangle.setStrokeStyle(1, 0xff0000, 1);
            // rectangle.setOrigin(0, 0);

            let entities: Array<Phaser.Physics.Arcade.Body> = this.scene.physics.overlapRect(
                area.x!,
                area.y!,
                area.width!,
                area.height!,
                true,
                false
            ) as Array<Phaser.Physics.Arcade.Body>;

            let heroesInArea = entities.filter((entity) => entity.gameObject instanceof Hero);
            let inArea = true;
            if (heroesInArea.length == 0) {
                inArea = false;
            }

            if (inArea == true && (this.scene.heroArea == null || this.scene.heroArea != area.name)) {
                console.log('From ' + this.scene.constructor.name + ' emit ENTER_AREA to ' + area.name);
                this.scene.hero.emit(AreaCollision[AreaCollision.ENTER_AREA], area.name);
                this.scene.heroArea = area.name;
            }
            if (!inArea && this.scene.heroArea == area.name) {
                console.log('From ' + this.scene.constructor.name + ' emit EXIT_AREA to ' + area.name);
                this.scene.hero.emit(AreaCollision[AreaCollision.EXIT_AREA], area.name);
                this.scene.heroArea = null;
            }
        }
    }
}
