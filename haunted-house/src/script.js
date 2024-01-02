import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/*
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

 /*
 * Scene
 */
const scene = new THREE.Scene()

/*
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/*
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog

/*
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 10)

/*
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
 * Background sound
 */
const listener = new THREE.AudioListener()
scene.add(listener)

const sound = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()

audioLoader.load( 'sounds/background.mp3',
    (buffer) => {
        sound.setBuffer(buffer)
        sound.setLoop(true)
        sound.setVolume(0.1)
        sound.play()
    },
)

const soundBtn = document.getElementById("sound")

soundBtn.onclick = () =>
{
    if (soundBtn.innerHTML !== "on")
    {
        soundBtn.innerHTML = "on"
        sound.pause()
    } else
    {
        soundBtn.innerHTML = "off"
        sound.play()
    }
}

/*
 * Texture
 */
const textureLoader = new THREE.TextureLoader()

// Door Textures
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

// Walls Textures
const wallsColorTexture = textureLoader.load('textures/bricks/color.jpg')
const wallsAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const wallsNormalTexture = textureLoader.load('textures/bricks/normal.jpg')
const wallsRoughnessTexture = textureLoader.load('textures/bricks/roughness.jpg')

// Floor Textures
const floorColorTexture = textureLoader.load('textures/grass/color.jpg')
const floorAmbientOcclusionTexture = textureLoader.load('textures/grass/ambientOcclusion.jpg')
const floorNormalTexture = textureLoader.load('textures/grass/normal.jpg')
const floorRoughnessTexture = textureLoader.load('textures/grass/roughness.jpg')

floorColorTexture.repeat.set(8, 8)
floorAmbientOcclusionTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorRoughnessTexture.repeat.set(8, 8)

floorColorTexture.wrapS = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorRoughnessTexture.wrapS = THREE.RepeatWrapping

floorColorTexture.wrapT = THREE.RepeatWrapping
floorAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorRoughnessTexture.wrapT = THREE.RepeatWrapping

/*
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        aoMap: floorAmbientOcclusionTexture,
        normalMap: floorNormalTexture,
        roughnessMap: floorRoughnessTexture,
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/*
 * House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
let wallsWidth = 4
let wallsHeight = 2.5
let wallsDepth = 4
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(wallsWidth, wallsHeight, wallsDepth),
    new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        aoMap: wallsAmbientOcclusionTexture,
        normalMap: wallsNormalTexture,
        roughnessMap: wallsRoughnessTexture,
    })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = wallsHeight / 2
house.add(walls)

// Roof
let roofRadius = 3.5
let roofHeight = 1
let roofRadialSegments = 4
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(roofRadius, roofHeight, roofRadialSegments),
    new THREE.MeshStandardMaterial({ color: 0xb35f45 })
)
roof.position.y = wallsHeight + (roofHeight / 2)
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
let doorWidth = 2
let doorHeight = 2
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(doorWidth + 0.2, doorHeight + 0.2, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
    })
)
door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = doorHeight / 2
door.position.z = (wallsDepth / 2) + 0.01  // "0.01" was added for stopping the "Z-fighting"
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)

house.add(bush1, bush2, bush3, bush4)

/*
 * Graves
 */
const graves = new THREE.Group()
scene.add(graves)

let gravesWidth = 0.6
let gravesHeight = 0.8
let gravesDepth = 0.2
const gravesGeometry = new THREE.BoxBufferGeometry(gravesWidth, gravesHeight, gravesDepth)
const gravesMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' })

for (let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(gravesGeometry, gravesMaterial)
    grave.position.set(x, (gravesHeight / 1.9) - 0.1, z)
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.castShadow = true
    graves.add(grave)
}

/*
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)

// Directional Light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
scene.add(moonLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

/*
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
scene.add(ghost3)

/*
 * Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')

/*
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true

floor.receiveShadow = true

moonLight.shadow.mapSize.width = 256
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 7

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 7

/*
 * Animate
 */
const clock = new THREE.Clock()

let animate = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 3)

    renderer.render(scene, camera)
    controls.update();
    requestAnimationFrame(animate)
}
animate()

/*
 * https://github.com/MeysamRezazadeh
 */