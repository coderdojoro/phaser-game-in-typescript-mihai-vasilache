import 'phaser';
import TelportScene from './scripts/scenes/telportScene';

export class AreaCollider {
    static update(scene: TelportScene) {
        for (let area of scene.teleportAreas) {
            let rect = new Phaser.Geom.Rectangle(area.x!, area.y!, area.width!, area.height!);
            if (rect.contains(scene.hero.x, scene.hero.y)) {
                AreaCollider.changeSceneAndTeleportPlayer(scene, area);
            }
        }
    }

    static changeSceneAndTeleportPlayer(currentScene: TelportScene, area: Phaser.Types.Tilemaps.TiledObject) {
        let newScene: TelportScene = AreaCollider.changeScene(area, currentScene);

        newScene.events.on(Phaser.Scenes.Events.CREATE, () => {
            let teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject> = newScene.teleportAreas;
            for (let anArea of teleportAreas) {
                console.log('Teleport: ' + anArea.name + ' == ' + area.properties.find((p) => p.name == 'teleportTo').value);
                if (anArea.name == area.properties.find((p) => p.name == 'teleportTo').value) {
                    AreaCollider.movePlayer(newScene, area);
                }
            }
        });

        newScene.events.on(Phaser.Scenes.Events.WAKE, () => {
            AreaCollider.movePlayer(newScene, area);
        });
    }

    private static changeScene(area: Phaser.Types.Tilemaps.TiledObject, currentScene: TelportScene) {
        console.log('Enter area ' + area.name);
        let sceneName: string = area.name.charAt(0).toUpperCase() + area.name.slice(1) + 'Scene';
        console.log('Enter scene: ' + sceneName);
        currentScene.scene.sleep(currentScene); // no update, no render
        currentScene.scene.run(sceneName); //If the given Scene is paused, it will resume it. If sleeping, it will wake it. If not running at all, it will be started.
        currentScene.cameras.main.fadeOut(1000, 0, 0, 0);
        let newScene: TelportScene = currentScene.scene.get(sceneName) as TelportScene;
        newScene.cameras.main.fadeIn();
        return newScene;
    }

    static movePlayer(newScene: TelportScene, area: Phaser.Types.Tilemaps.TiledObject) {
        let teleportAreas: Array<Phaser.Types.Tilemaps.TiledObject> = newScene.teleportAreas;
        for (let anArea of teleportAreas) {
            if (anArea.name == area.properties.find((p) => p.name == 'teleportTo').value) {
                AreaCollider.teleportPlayer(anArea, newScene);
            }
        }
    }

    static teleportPlayer(anArea, newScene) {
        if ((anArea as any).properties.find((p) => p.name == 'exit').value == 'UP') {
            newScene.hero.x = anArea.x! + anArea.width! / 2;
            newScene.hero.y = anArea.y! - 5;
        }
        if ((anArea as any).properties.find((p) => p.name == 'exit').value == 'DOWN') {
            newScene.hero.x = anArea.x! + anArea.width! / 2;
            newScene.hero.y = anArea.y! + anArea.height! + 5;
        }
    }
}
