import * as THREE from 'three'
import { BLOOM_LAYER } from '../config/renderConfig.jsx'
import { starTypes } from '../config/starDistributions.jsx'
import { STAR_MIN, STAR_MAX} from '../config/renderConfig.jsx';
import { clamp } from '../utils/utils.jsx';
const texture = new THREE.TextureLoader().load('./resources/sprite120.png')
// const material = new THREE.SpriteMaterial({map: texture, color: '#FFFFFF'})
// const materials = starTypes.color.map((color) => new THREE.SpriteMaterial({map: texture, color: color}))
// Create an array of MeshBasicMaterials for the different star types
const materials = starTypes.color.map((color) => new THREE.MeshBasicMaterial({
    color: color, // Set the color from starTypes
    transparent: true, // Optional: enable transparency if needed
    opacity: 1, // Fully opaque; adjust if you want some transparency
}));

// Create an array of SphereGeometries for the different star sizes
const geometries = starTypes.size.map((size) => new THREE.SphereGeometry(0.1, 8, 8));

// const geometry = new THREE.SphereGeometry(1, 8, 8); // 1 is radius, 8 segments for width and height (low-poly)

export class Star {

    constructor(position) {
        this.position = position
        this.starType = this.generateStarType()
        this.obj = null
    }

    

    generateStarType() {
        let num = Math.random() * 100.0
        let pct = starTypes.percentage
        for (let i = 0; i < pct.length; i++) {
            num -= pct[i]
            if (num < 0) {
                return i
            }
        }
        return 0
    }

    updateScale(camera) {
        let dist = this.position.distanceTo(camera.position) / 250

        // update star size
        let starSize = dist * starTypes.size[this.starType]
        starSize = clamp(starSize, STAR_MIN, STAR_MAX)
        this.obj?.scale.copy(new THREE.Vector3(starSize, starSize, starSize))
    }

    toThreeObject(scene) {
        // let star = new THREE.Sprite(materials[this.starType])
        // star.layers.set(BLOOM_LAYER)

        // star.scale.multiplyScalar(starTypes.size[this.starType])
        // // star.scale.multiplyScalar(0.5)
        // star.position.copy(this.position)
        // this.obj = star

        // scene.add(star)

        let star = new THREE.Mesh(geometries[this.starType], materials[this.starType]);
        star.layers.set(BLOOM_LAYER)
        //star.scale.multiplyScalar(starTypes.size[this.starType]);
        star.position.copy(this.position)
        this.obj = star
        scene.add(star)

    }
            
}
