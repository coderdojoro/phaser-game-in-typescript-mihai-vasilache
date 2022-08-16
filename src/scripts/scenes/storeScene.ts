import 'phaser';
import { AreaCollider } from '../../areaCollider';
import Hero from '../sprites/hero';
import TelportScene from './telportScene';

export default class StoreScene extends TelportScene {
    constructor() {
        super({ key: 'StoreScene' });
    }

    preload() {
        this.load.image('interior-tileset1', 'assets/tilesets/interior-tileset1.png');
        this.load.image('interior-tileset2', 'assets/tilesets/interior-tileset2.png');
        this.load.image('interior-bathroom-tileset', 'assets/tilesets/interior-bathroom.png');

        this.load.tilemapTiledJSON('store', 'assets/tilemaps/store.json');
    }

    create() {
        let map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'store' });

        let interiorTileset1 = map.addTilesetImage('interior1', 'interior-tileset1', 16, 16, 0, 0);
        let interiorTileset2 = map.addTilesetImage('interior2', 'interior-tileset2', 16, 16, 0, 0);
        let interiorBathroomTileset = map.addTilesetImage('bathroom', 'interior-bathroom-tileset', 16, 16, 0, 0);

        let layerOffsetX = this.cameras.main.worldView.x + this.cameras.main.width / 2 - map.widthInPixels / 2;
        let layerOffsetY = this.cameras.main.worldView.y + this.cameras.main.height / 2 - map.heightInPixels / 2;

        let belowLayer = map.createLayer('Below hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let objectsBelowLayer = map.createLayer('Objects below hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let worldLayer = map.createLayer('World', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let aboveWorldLayer = map.createLayer('Objects above world', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let aboveLayer = map.createLayer('Above hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);

        worldLayer.setCollisionBetween(interiorTileset1.firstgid, interiorTileset1.firstgid + interiorTileset1.total, true);
        worldLayer.setCollisionBetween(interiorTileset2.firstgid, interiorTileset2.firstgid + interiorTileset2.total, true);
        worldLayer.setCollisionBetween(interiorBathroomTileset.firstgid, interiorBathroomTileset.firstgid + interiorBathroomTileset.total, true);

        aboveLayer.setDepth(200);

        this.hero = new Hero(this, 0, 0);
        this.hero.setDepth(100);

        this.teleportAreas = map.filterObjects('Objects', (obj) => obj.type === 'TELEPORT_AREA');
        for (let tiledObject of this.teleportAreas) {
            tiledObject.x = tiledObject.x! + layerOffsetX;
            tiledObject.y = tiledObject.y! + layerOffsetY;
        }

        this.physics.add.collider(this.hero, worldLayer);
        this.physics.world.setBoundsCollision(true, true, true, true);

        let camera = this.cameras.main;
        //camera.startFollow(this.hero);
        //camera.setBounds(layerOffsetX, layerOffsetY, map.widthInPixels, map.heightInPixels);
        camera.setZoom(1.6);
        this.physics.world.setBounds(layerOffsetX, layerOffsetY, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
        AreaCollider.update(this);
    }
}
