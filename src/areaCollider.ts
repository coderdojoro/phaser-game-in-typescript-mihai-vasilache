import 'phaser';

export default class AreaCollider {
    static update(scene) {
        for (let area of scene.teleportAreas) {
            //debug:
            // let rectangle = scene.add.rectangle(area.x!, area.y!, area.width!, area.height!);
            // rectangle.setStrokeStyle(1, 0xff0000, 1);
            // rectangle.setOrigin(0, 0);
            let rect = new Phaser.Geom.Rectangle(area.x!, area.y!, area.width!, area.height!);
            if (rect.contains(scene.hero.x, scene.hero.y)) {
                console.log('INSIDE');
                scene.hero.emit('TELEPORT', area);
            }
        }
    }
}
