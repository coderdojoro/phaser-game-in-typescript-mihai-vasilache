import 'phaser';
import Grizzly from '../grizzly';
import Hero from '../hero';

export default class MainMenuScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap;
    worldLayer: Phaser.Tilemaps.TilemapLayer;
    hero: Hero;

    house1Zone: Phaser.GameObjects.Zone;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('tiles', 'assets/tilesets/ground-tileset.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/town.json');

        this.load.spritesheet('hero-idle-e-spritesheet', 'assets/hero/idle_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-e-spritesheet', 'assets/hero/walk_aggro_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-s-spritesheet', 'assets/hero/walk_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-s-spritesheet', 'assets/hero/idle_aggro_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-idle-n-spritesheet', 'assets/hero/idle_aggro_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-walk-n-spritesheet', 'assets/hero/walk_aggro_N.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('hero-atk-e-spritesheet', 'assets/hero/atk_heavy_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-n-spritesheet', 'assets/hero/atk_heavy_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-atk-s-spritesheet', 'assets/hero/atk_heavy_S.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-e-spritesheet', 'assets/hero/hitdead_E.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-n-spritesheet', 'assets/hero/hitdead_N.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('hero-hitdead-s-spritesheet', 'assets/hero/hitdead_S.png', { frameWidth: 128, frameHeight: 128 });

        this.load.spritesheet('grizzly-idle-spritesheet', 'assets/enemies/grizzly-idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-n-spritesheet', 'assets/enemies/grizzly-north.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-s-spritesheet', 'assets/enemies/grizzly-south.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-walk-e-spritesheet', 'assets/enemies/grizzly-east.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('grizzly-die-spritesheet', 'assets/enemies/grizzly-die.png', { frameWidth: 32, frameHeight: 32 });
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

        this.map = this.make.tilemap({ key: 'map' });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        let tileset = this.map.addTilesetImage('ground', 'tiles', 32, 32, 1, 2);

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        let belowLayer = this.map.createLayer('Below hero', tileset, 0, 0);
        let objectsBelowLayer = this.map.createLayer('Objects below hero', tileset, 0, 0);
        this.worldLayer = this.map.createLayer('World', tileset, 0, 0);
        let aboveLayer = this.map.createLayer('Above hero', tileset, 0, 0);

        this.worldLayer.setCollisionBetween(tileset.firstgid, tileset.firstgid + tileset.total, true);

        // By default, everything gets depth sorted on the screen in the order we created things. Here, we
        // want the "Above this.hero" layer to sit on top of the this.hero, so we explicitly give it a depth.
        // Higher depths will sit on top of lower depth objects.
        aboveLayer.setDepth(200);

        // Object layers in Tiled let you embed extra info into a map - like a spawn point or custom
        // collision shapes. In the tmx file, there's an object layer with a point named "Spawn Point"
        let spawnPoint: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('Objects', (obj) => obj.name === 'Spawn Point');

        this.hero = new Hero(this, spawnPoint.x, spawnPoint.y);
        this.hero.setDepth(100);

        let house1Entry: Phaser.Types.Tilemaps.TiledObject = this.map.findObject('Objects', (obj) => obj.name === 'house1');
        console.log(house1Entry);

        this.house1Zone = this.add.zone(house1Entry.x!, house1Entry.y!, house1Entry.width!, house1Entry.height!);
        this.house1Zone.setOrigin(0, 0);
        this.physics.world.enable(this.house1Zone, Phaser.Physics.Arcade.DYNAMIC_BODY);
        (this.house1Zone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        (this.house1Zone.body as Phaser.Physics.Arcade.Body).moves = false;

        this.physics.add.overlap(this.hero, this.house1Zone);

        // this.house1Zone.on('ENTER_ZONE', () => console.log('ENTER_ZONE'));
        // this.house1Zone.on('LEAVE_ZONE', () => console.log('LEAVE_ZONE'));
        (this.house1Zone.body as Phaser.Physics.Arcade.Body).debugBodyColor = 0xffffff;

        let grizzlyObjects: Phaser.Types.Tilemaps.TiledObject[] = this.map.getObjectLayer('Objects').objects.filter((obj) => obj.name == 'grizzly');
        for (let grizzlyObject of grizzlyObjects) {
            let grizzly = new Grizzly(this, grizzlyObject.x, grizzlyObject.y);
        }

        // Watch the this.hero and worldLayer for collisions, for the duration of the scene:
        this.physics.add.collider(this.hero, this.worldLayer);

        this.physics.world.setBoundsCollision(true, true, true, true);

        const camera = this.cameras.main;
        camera.startFollow(this.hero);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.setZoom(1);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    }

    update(time, delta) {
        var touching: Phaser.Types.Physics.Arcade.ArcadeBodyCollision = (this.house1Zone.body as Phaser.Physics.Arcade.Body).touching;
        var wasTouching: Phaser.Types.Physics.Arcade.ArcadeBodyCollision = (this.house1Zone.body as Phaser.Physics.Arcade.Body).wasTouching;
        var embeded: boolean = (this.house1Zone.body as Phaser.Physics.Arcade.Body).embedded;

        console.log(wasTouching.none);

        if (touching.none && !wasTouching.none) {
            this.house1Zone.emit('LEAVE_ZONE');
        } else if (!touching.none && wasTouching.none) {
            this.house1Zone.emit('ENTER_ZONE');
        }
    }
}
