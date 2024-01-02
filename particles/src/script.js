import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
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
 * GUI Debug
 */
const gui = new dat.GUI()

/*
 * Sizes
 */
const sizes =
{
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
}
)

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
}
)

/*
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 5, 8)

/*
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/*
 * Texture
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture1 = textureLoader.load('textures/particles/1.png')
const particleTexture2 = textureLoader.load('textures/particles/2.png')
const particleTexture3 = textureLoader.load('textures/particles/3.png')
const particleTexture4 = textureLoader.load('textures/particles/4.png')
const particleTexture5 = textureLoader.load('textures/particles/5.png')
const particleTexture6 = textureLoader.load('textures/particles/6.png')
const particleTexture7 = textureLoader.load('textures/particles/7.png')
const particleTexture8 = textureLoader.load('textures/particles/8.png')
const particleTexture9 = textureLoader.load('textures/particles/9.png')
const particleTexture10 = textureLoader.load('textures/particles/10.png')
const particleTexture11 = textureLoader.load('textures/particles/11.png')
const particleTexture12 = textureLoader.load('textures/particles/12.png')
const particleTexture13 = textureLoader.load('textures/particles/13.png')

/*
 * Particles
 */

const parameters = {}
parameters.count = 10000
parameters.size = 0.1
parameters.texture = particleTexture1

let geometry = null
let material = null
let particles = null

const generateParticles = () =>
{
    // Destroy old particles
    if (particles !== null)
    {
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }

    // Geometry
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    for (let i = 0; i < parameters.count * 3; i++)
    {
        positions[i] = (Math.random() - 0.5) * 10
        colors[i] = Math.random()
    }
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    // Material
    material = new THREE.PointsMaterial()
    material.size = parameters.size
    material.sizeAttenuation = true
    material.vertexColors = true
    material.transparent = true
    material.alphaMap = parameters.texture
    material.depthWrite = false
    material.blending = THREE.AdditiveBlending

    // Points
    particles = new THREE.Points(geometry, material)
    scene.add(particles)
}
generateParticles()

// Add to GUI Debug Panel
gui.add(parameters, 'count').min(100).max(100000).step(1000).onFinishChange(generateParticles).name("Count")
gui.add(parameters, 'size').min(0.001).max(0.3).step(0.001).onFinishChange(generateParticles).name("Size")
gui.add(parameters, 'texture', {
    Theme1: particleTexture1,
    Theme2: particleTexture2,
    Theme3: particleTexture3,
    Theme4: particleTexture4,
    Theme5: particleTexture5,
    Theme6: particleTexture6,
    Theme7: particleTexture7,
    Theme8: particleTexture8,
    Theme9: particleTexture9,
    Theme10: particleTexture10,
    Theme11: particleTexture11,
    Theme12: particleTexture12,
    Theme13: particleTexture13,
}).onFinishChange(generateParticles).name('Theme');

/*
 * Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*
 * Animate
 */
const clock = new THREE.Clock()

let animate = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    for (let i = 0; i < parameters.count; i++)
    {
        const i3 = i * 3

        const x = geometry.attributes.position.array[i3]
        geometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
    controls.update();
    requestAnimationFrame(animate)
}
animate()

/*
 * https://github.com/MeysamRezazadeh
 */