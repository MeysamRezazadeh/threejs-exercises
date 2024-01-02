import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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
camera.position.set(1.5, 2.5, 3)

/*
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const textureLoader = new THREE.TextureLoader()
const texture1 = textureLoader.load('texture/matcaps/1.png')
const texture2 = textureLoader.load('texture/matcaps/2.png')
const texture3 = textureLoader.load('texture/matcaps/3.png')
const texture4 = textureLoader.load('texture/matcaps/4.png')
const texture5 = textureLoader.load('texture/matcaps/5.png')
const texture6 = textureLoader.load('texture/matcaps/6.png')
const texture7 = textureLoader.load('texture/matcaps/7.png')
const texture8 = textureLoader.load('texture/matcaps/8.png')

/*
 * Donats And Text
 */
const parameters = {}
parameters.count = 150
parameters.text = 'Sambyte'
parameters.texture = texture1

let donatGeometry = null
let textGeometry = null
let material = null
let text = null
let donats = null

const generateTextAndDonat = () =>
{
    // Destroy old Text And Donat
    if (donats !== null)
    {
        donatGeometry.dispose()
        textGeometry.dispose()
        material.dispose()
        scene.remove(text)
        scene.remove(donats)
    }

    // Donats
    donats = new THREE.Group()
    scene.add(donats)

    // Geometry
    donatGeometry = new THREE.TorusBufferGeometry( 0.3, 0.2, 20, 45 )

    const rotations = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count * 3; i++)
    {
        rotations[i] = (Math.random() - 0.5) * 10
    }
    donatGeometry.setAttribute(
        'rotation',
        new THREE.BufferAttribute(rotations, 3)
    )

    // Material
    material = new THREE.MeshMatcapMaterial()
    material.matcap = parameters.texture

    // Text
    const fontLoader = new FontLoader()
    fontLoader.load(
        'fonts/helvetiker_regular.typeface.json',
        (font) =>
        {
            textGeometry = new TextGeometry(
                parameters.text,
                {
                    font: font,
                    size: 0.5,
                    height: 0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 10
                }
            )
            textGeometry.center()
            text = new THREE.Mesh(textGeometry, material)
            scene.add(text)
        }
    )

    // Mesh
    for (let i = 0; i < parameters.count; i++)
    {
        const donat = new THREE.Mesh(donatGeometry, material)

        donat.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        )

        const scale = Math.random()
        donat.scale.set(scale, scale, scale)

        donats.add(donat)
    }

}
generateTextAndDonat()


// Add to GUI Debug Panel
gui.add(parameters, 'count').min(100).max(1000).step(10).onFinishChange(generateTextAndDonat).name("Count")
gui.add(parameters, 'text').onFinishChange(generateTextAndDonat).name("Text")
gui.add(parameters, 'texture', {
    Theme1: texture1,
    Theme2: texture2,
    Theme3: texture3,
    Theme4: texture4,
    Theme5: texture5,
    Theme6: texture6,
    Theme7: texture7,
    Theme8: texture8,
}).onFinishChange(generateTextAndDonat).name('Theme');


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

gsap.to(camera.position, {duration: 1, x: - 1, y: 0.75, z: 1.5,})

let animate = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update donats
    for (let i = 0; i < parameters.count; i++)
    {
        if (donats.children[i])
        {
            const x = donats.children[i].position.x
            const y = donats.children[i].position.y
            donats.children[i].rotation.x = elapsedTime * x
            donats.children[i].rotation.y = elapsedTime * y
        }
    }

    renderer.render(scene, camera)
    controls.update();
    requestAnimationFrame(animate)
}
animate()

/*
 * https://github.com/MeysamRezazadeh
 */