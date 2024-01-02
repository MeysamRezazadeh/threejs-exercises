import './style.css'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
camera.position.z = 8

/*
 * Aim trainer
 */
const parameters = {}
parameters.text = 'start'

const target = new THREE.Group()
scene.add(target)
// Geometry
const geometry = new THREE.CircleGeometry( 1, 32 )

// Material
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color('#ff6030')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
target.add(mesh)
// Text
let text = null
let textGeometry = null
let textMaterial = null



const changePosition = () =>
{
    if (text !== null)
    {
        textGeometry.dispose()
        textMaterial.dispose()
        target.remove(text)
    }
    console.log(parameters.text)
    const fontLoader = new FontLoader()
    fontLoader.load(
        'fonts/helvetiker_regular.typeface.json',
        (font) =>
        {
            textGeometry = new TextGeometry(
                parameters.text.toString(),
                {
                    font: font,
                    size: 0.3,
                    height: 0,
                    curveSegments: 15,
                    bevelEnabled: true,
                    bevelThickness: 0.01,
                    bevelSize: 0.01,
                    bevelOffset: 0,
                    bevelSegments: 8
                }
            )
            textGeometry.center()
            textMaterial = new THREE.MeshBasicMaterial()
            textMaterial.color = new THREE.Color('#ffffff')
            text = new THREE.Mesh(
                textGeometry, textMaterial
            )
            target.add(text)
        }
    )
    const angle = Math.random() * Math.PI * 2
    const radius = (Math.random() - 0.5) * (sizes.width / sizes.height) * 8
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    target.position.set(x, y, 0)

    const scale = (Math.random() - 0.5) + 1
    target.scale.set(scale, scale, scale)
}
changePosition()

/*
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

/*
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
    {
        mouse.x = (event.clientX / sizes.width * 2 - 1)
        mouse.y = - (event.clientY / sizes.height * 2 - 1)
    }
)
let i = 0
let start = null

window.addEventListener('click', () =>
    {
        if (currentIntersect)
        {
            parameters.text = i + 1
            changePosition()
            if (i === 0)
            {
                start = Date.now()
            }
            if (i === 9)
            {
                const end = Date.now()
                parameters.text = "  Result\n" + (end - start).toString() + " ms"
                i = 0
            }
            else
            {
                i++
            }
        }
    }
)

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

let currentIntersect = null

let animate = () => {
    // Cast a ray
    raycaster.setFromCamera(mouse, camera)

    const objects = [target]
    const intersects = raycaster.intersectObjects(objects)

    for (const object of objects)
    {
        object.children[0].material.color.set('#056405')
    }

    for (const intersect of intersects)
    {
        intersect.object.material.color.set('#860a0a')
    }

    if (intersects.length)
    {
        if (currentIntersect === null)
        {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    }
    else
    {
        if (currentIntersect)
        {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()

/*
 * https://github.com/MeysamRezazadeh
 */