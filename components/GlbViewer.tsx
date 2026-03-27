'use client'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'

export default function GlbViewer() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let cancelled = false
    let animId: number
    let doCleanup: (() => void) | undefined

    ;(async () => {
      const THREE = await import('three')
      const { GLTFLoader }    = await import('three/examples/jsm/loaders/GLTFLoader.js')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

      // StrictMode unmounted before imports finished → bail, nothing to clean up
      if (cancelled) return

      const W = el.clientWidth
      const H = el.clientHeight

      // ── Scene ────────────────────────────────────────────────
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#0F0F0F')
      scene.fog = new THREE.FogExp2('#0F0F0F', 0.16)

      // ── Camera ───────────────────────────────────────────────
      const camera = new THREE.PerspectiveCamera(36, W / H, 0.01, 100)
      camera.position.set(0, 0.9, 2.4)

      // ── Renderer ─────────────────────────────────────────────
      // renderer is local — each mount owns its own context, no cross-context disposal
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = false
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.35
      renderer.outputColorSpace = THREE.SRGBColorSpace
      el.appendChild(renderer.domElement)

      // ── Environment (procedural gradient) ────────────────────
      const pmrem = new THREE.PMREMGenerator(renderer)
      pmrem.compileEquirectangularShader()

      const envSize = 256
      const envData = new Uint8Array(envSize * envSize * 4)
      for (let y = 0; y < envSize; y++) {
        for (let x = 0; x < envSize; x++) {
          const t = y / envSize
          const r = Math.round(255 * (0.97 - t * 0.15))
          const g = Math.round(255 * (0.97 - t * 0.08))
          const b = Math.round(255 * (0.97 + t * 0.03))
          const i = (y * envSize + x) * 4
          envData[i] = r; envData[i+1] = g; envData[i+2] = b; envData[i+3] = 255
        }
      }
      const envTex = new THREE.DataTexture(envData, envSize, envSize)
      envTex.mapping = THREE.EquirectangularReflectionMapping
      envTex.needsUpdate = true
      const envMap = pmrem.fromEquirectangular(envTex).texture
      scene.environment = envMap

      // ── Lights ───────────────────────────────────────────────
      scene.add(new THREE.AmbientLight('#f0f4ff', 0.9))

      const key = new THREE.DirectionalLight('#fff5e8', 3.5)
      key.position.set(-3, 6, 4)
      scene.add(key)

      const fill = new THREE.DirectionalLight('#d0e8ff', 1.2)
      fill.position.set(4, 2, -3)
      scene.add(fill)

      const rim = new THREE.PointLight('#ffe0c0', 2.0, 8)
      rim.position.set(0, -1, -3)
      scene.add(rim)

      const top = new THREE.PointLight('#ffffff', 1.0, 6)
      top.position.set(0, 4, 0)
      scene.add(top)

      // ── Controls ─────────────────────────────────────────────
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping  = true
      controls.dampingFactor  = 0.05
      controls.enableZoom     = false
      controls.enablePan      = false
      controls.minPolarAngle  = Math.PI / 8
      controls.maxPolarAngle  = Math.PI / 1.8

      // ── Load GLB ─────────────────────────────────────────────
      const loader = new GLTFLoader()
      loader.load('/model.glb', (gltf) => {
        if (cancelled) return
        const model = gltf.scene
        const box    = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size   = box.getSize(new THREE.Vector3())
        const scale  = 1.30 / Math.max(size.x, size.y, size.z)
        model.scale.setScalar(scale)
        model.position.set(
          -center.x * scale,
          -center.y * scale + size.y * scale * 0.44,
          -center.z * scale
        )
        scene.add(model)
        controls.target.set(0, size.y * scale * 0.35, 0)
        controls.update()
      })

      // ── Auto-rotate ───────────────────────────────────────────
      controls.autoRotate      = true
      controls.autoRotateSpeed = 1.2
      controls.addEventListener('start', () => { controls.autoRotate = false })
      controls.addEventListener('end',   () => {
        setTimeout(() => { controls.autoRotate = true }, 3000)
      })

      // ── Resize ───────────────────────────────────────────────
      const onResize = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      window.addEventListener('resize', onResize)

      // ── Render loop ───────────────────────────────────────────
      const tick = () => {
        animId = requestAnimationFrame(tick)
        controls.update()
        renderer.render(scene, camera)
      }
      tick()

      // ── Cleanup ───────────────────────────────────────────────
      doCleanup = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('resize', onResize)
        controls.dispose()

        // Dispose scene objects on the correct (local) context
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh
          if (!mesh.isMesh) return
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => {
            if (!m) return
            Object.values(m).forEach((v) => {
              if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose()
            })
            m.dispose()
          })
        })

        scene.environment = null
        envMap.dispose()
        envTex.dispose()
        pmrem.dispose()
        renderer.dispose()

        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      }

      if (cancelled) doCleanup()
    })()

    return () => {
      cancelled = true
      doCleanup?.()
    }
  }, [])

  return (
    <section className="w-full border-t border-edi-light bg-edi-black" style={{ height: '90vh' }}>
      <div ref={mountRef} className="w-full h-full" />
    </section>
  )
}