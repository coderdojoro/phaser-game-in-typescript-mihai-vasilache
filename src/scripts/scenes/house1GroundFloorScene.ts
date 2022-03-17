import 'phaser';
import AreaCollier from '../../areaCollider';
import Hero from '../sprites/hero';

export default class House1GroundFloorScene extends Phaser.Scene {
    hero: Hero;

    areaCollider: AreaCollier = new AreaCollier(this, 'game');
    areaObjects: Array<Phaser.Types.Tilemaps.TiledObject>;

    constructor() {
        super({ key: 'House1GroundFloorScene' });
        console.log('letructor');
    }

    preload() {
        this.load.image('interior-tileset1', 'assets/tilesets/interior-tileset1.png');
        this.load.image('interior-tileset2', 'assets/tilesets/interior-tileset2.png');
        this.load.image('interior-bathroom-tileset', 'assets/tilesets/interior-bathroom.png');

        this.load.tilemapTiledJSON('house1GroundFloor', 'assets/tilemaps/house1GroundFloor.json');
    }

    create() {
        let map: Phaser.Tilemaps.Tilemap = this.make.tilemap({ key: 'house1GroundFloor' });

        let interiorTileset1 = map.addTilesetImage('interior1', 'interior-tileset1', 16, 16, 0, 0);
        let interiorTileset2 = map.addTilesetImage('interior2', 'interior-tileset2', 16, 16, 0, 0);
        let interiorBathroomTileset = map.addTilesetImage('bathroom', 'interior-bathroom-tileset', 16, 16, 0, 0);

        let layerOffsetX: number = this.cameras.main.worldView.x + this.cameras.main.width / 2 - map.widthInPixels / 2;
        let layerOffsetY: number = this.cameras.main.worldView.y + this.cameras.main.height / 2 - map.heightInPixels / 2;

        let belowLayer = map.createLayer('Below hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let objectsBelowLayer = map.createLayer('Objects below hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let worldLayer = map.createLayer('World', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let aboveWorldLayer = map.createLayer('Objects above world', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);
        let aboveLayer = map.createLayer('Above hero', [interiorTileset1, interiorTileset2, interiorBathroomTileset], layerOffsetX, layerOffsetY);

        worldLayer.setCollisionBetween(interiorTileset1.firstgid, interiorTileset1.firstgid + interiorTileset1.total, true);
        worldLayer.setCollisionBetween(interiorTileset2.firstgid, interiorTileset2.firstgid + interiorTileset2.total, true);
        worldLayer.setCollisionBetween(interiorBathroomTileset.firstgid, interiorBathroomTileset.firstgid + interiorBathroomTileset.total, true);

        aboveLayer.setDepth(200);

        let spawnPoint: Phaser.Types.Tilemaps.TiledObject = map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

        this.hero = new Hero(this, spawnPoint.x! + layerOffsetX, spawnPoint.y! + layerOffsetY);
        this.hero.setDepth(100);

        this.areaObjects = map.filterObjects('Objects', (obj) => obj.type === 'AREA');
        for (let tiledObject of this.areaObjects) {
            tiledObject.x = tiledObject.x! + layerOffsetX;
            tiledObject.y = tiledObject.y! + layerOffsetY;
        }

        this.physics.add.collider(this.hero, worldLayer);
        this.physics.world.setBoundsCollision(true, true, true, true);

        let camera = this.cameras.main;
        //camera.startFollow(this.hero);
        //camera.setBounds(layerOffsetX, layerOffsetY, map.widthInPixels, map.heightInPixels);
        camera.setZoom(1);
        this.physics.world.setBounds(layerOffsetX, layerOffsetY, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {
        this.areaCollider.update();
    }
}
