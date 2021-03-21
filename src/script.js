import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()
const moonTextureDisplaycment = textureLoader.load('./textures/moon_displaycment_map.jpg')
const moonTexture = textureLoader.load('./textures/moon_texture.jpg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 128, 128)

// Materials
const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),
    displacementMap: moonTextureDisplaycment,
    displacementScale: 0.01,
    map: moonTexture,
})

// Mesh
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.6)
pointLight.position.set(10, 3, 3)
scene.add(pointLight)

const orangeLight = new THREE.PointLight(0xf26b2c, 0.7)
orangeLight.position.set(4, 6, 6)
scene.add(orangeLight)

gui.add(pointLight.position, 'x', -10, 10, 1)
gui.add(pointLight.position, 'y', -10, 10, 1)
gui.add(pointLight.position, 'z', -10, 10, 1)
gui.add(pointLight, 'intensity', -0, 1, .1)

gui.add(orangeLight.position, 'x', -10, 10, 1)
gui.add(orangeLight.position, 'y', -10, 10, 1)
gui.add(orangeLight.position, 'z', -10, 10, 1)
gui.add(orangeLight, 'intensity', -0, 1, 0.1)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

window.addEventListener('resize', () => {
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
/* const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true */

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* 
    Interactivity
*/

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - window.innerWidth / 2
    mouseY = e.clientY - window.innerHeight / 2
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
    targetX = mouseX * 0.0001
    targetY = mouseY * 0.0001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.05 * elapsedTime
    sphere.rotation.y += 0.1 * (targetX - sphere.rotation.y)
    sphere.rotation.x += 0.01 * (targetY - sphere.rotation.x)
    sphere.position.z += -0.01 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
