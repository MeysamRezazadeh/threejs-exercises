import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/*
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshToonMaterial()
material.color = new THREE.Color('#fefefe')
material.gradientMap = gradientTexture

// Meshes
const meshDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - meshDistance * 0
mesh2.position.y = - meshDistance * 1
mesh3.position.y = - meshDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

const sectionMeshes = [mesh1, mesh2, mesh3]

scene.add(mesh1, mesh2, mesh3)

/*
 * Particles
 */
const count = 200

// Geometry
const particleGeometry = new THREE.BufferGeometry()

const positions = new Float32Array(count * 3)

for (let i = 0; i < count; i++) {
    const i3 = i * 3

    positions[i3    ] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = meshDistance * 0.5 - Math.random() * meshDistance * sectionMeshes.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
}

particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

// Material
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.sizeAttenuation = true
particleMaterial.size = 0.03

// Points
const points = new THREE.Points(particleGeometry, particleMaterial)
scene.add(points)

/*
 * Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/*
 * Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if (newSection !== currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5',
            }
        )
    }
})

/*
 * Mouse
 */
let mouse = {}
mouse.x = 0
mouse.y = 0

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width - 0.5
    mouse.y = event.clientY / sizes.height - 0.5
})

/*
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

let animate = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update camera
    camera.position.y = - scrollY / sizes.height * meshDistance

    const parallaxX = mouse.x * 0.5
    const parallaxY = - mouse.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for (const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()

/*
 * https://github.com/MeysamRezazadeh
 */