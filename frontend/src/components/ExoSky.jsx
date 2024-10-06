import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CompositionShader } from "../shaders/CompositionShader.jsx";
import {
  BASE_LAYER,
  BLOOM_LAYER,
  BLOOM_PARAMS,
  OVERLAY_LAYER,
} from "../config/renderConfig.jsx";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { Star } from "./star.jsx";
import { Galaxy } from "./galaxy.jsx";
import {
  CORE_X_DIST,
  CORE_Y_DIST,
  GALAXY_THICKNESS,
} from "../config/galaxyConfig.jsx";
import { gaussianRandom } from "../utils/utils.jsx";
import { Button } from "@nextui-org/react";

const ExoSky = ({ ra, dec, dist }) => {
  const canvasRef = useRef(null);
  let renderer,
    camera,
    scene,
    orbit,
    baseComposer,
    bloomComposer,
    overlayComposer;
  let raycaster = new THREE.Raycaster();
  raycaster.layers.set(1);
  let mouse = new THREE.Vector2();
  let spheres = [];
  let galaxy; // Declare galaxy variable here

  useEffect(() => {
    const initThree = () => {
      const canvas = canvasRef.current;

      // Event listener for clicks
      canvas.addEventListener("click", onClick, false);

      // Create scene
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0xebe2db, 0.00003);

      // Create camera
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        5000000
      );
      camera.position.set(0, 0, 0); // Start slightly zoomed out along Z-axis
      // camera.up.set(0, 1, 0); // Set the up vector correctly
      camera.lookAt(new THREE.Vector3(0, 1, 0)); // Set an outward direction

      // Initialize orbit controls
      orbit = new OrbitControls(camera, canvas);
      orbit.enableDamping = true;
      orbit.dampingFactor = 0.05;
      orbit.enablePan = false; // Disable panning to lock camera at (0, 0, 0)
      orbit.minDistance = 1; // Minimum zoom level
      orbit.maxDistance = 16384; // Maximum zoom level
      orbit.target.set(0, 0, 0); // Camera will always orbit around (0, 0, 0)
      orbit.update(); // Make sure controls are updated

      // Add sphere as an example
      // const geometry = new THREE.SphereGeometry(0.3, 8, 8);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0xffffff,
      //   opacity: 1,
      //   transparent: false,
      // });
      // const sphere = new THREE.Mesh(geometry, material);
      // sphere.position.set(5, 5, 5);
      // scene.add(sphere);

      // Initialize rendering pipeline
      initRenderPipeline();

      // Create galaxy instance
      console.log("Creating Galaxy");
      galaxy = new Galaxy(scene, ra, dec, dist);
    };

    const onClick = (event) => {
      console.log("Clicked");
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      if (galaxy.stars) {
        console.log(galaxy.stars);
        const starObjects = galaxy.stars.map((star) => star.obj);
        console.log(starObjects);
        const intersects = raycaster.intersectObjects(starObjects);
        console.log(intersects);
        if (intersects.length > 0) {
          window.alert("Star clicked!");
          console.log("Star clicked!");
          console.log(intersects);
        } else {
          console.log("Clicked on empty space.");
        }
      } else {
        console.log("Stars not yet generated.");
      }
    };

    const initRenderPipeline = () => {
      // Set up renderer
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasRef.current,
        logarithmicDepthBuffer: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth * 0.78, window.innerHeight);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.5;

      // Set up rendering passes
      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      );
      bloomPass.threshold = BLOOM_PARAMS.bloomThreshold;
      bloomPass.strength = BLOOM_PARAMS.bloomStrength;
      bloomPass.radius = BLOOM_PARAMS.bloomRadius;

      bloomComposer = new EffectComposer(renderer);
      bloomComposer.renderToScreen = false;
      bloomComposer.addPass(renderScene);
      bloomComposer.addPass(bloomPass);

      overlayComposer = new EffectComposer(renderer);
      overlayComposer.renderToScreen = false;
      overlayComposer.addPass(renderScene);

      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture },
            overlayTexture: { value: overlayComposer.renderTarget2.texture },
          },
          vertexShader: CompositionShader.vertex,
          fragmentShader: CompositionShader.fragment,
          defines: {},
        }),
        "baseTexture"
      );
      finalPass.needsSwap = true;

      baseComposer = new EffectComposer(renderer);
      baseComposer.addPass(renderScene);
      baseComposer.addPass(finalPass);
    };

    const render = () => {
      orbit.update(); // Update the OrbitControls

      // Resize renderer if necessary
      const canvas = renderer.domElement;
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      galaxy?.stars?.forEach((star) => {
        star.updateScale(camera);
      });

      renderPipeline();
      requestAnimationFrame(render);
    };

    const renderPipeline = () => {
      camera.layers.set(BLOOM_LAYER);
      bloomComposer.render();

      camera.layers.set(OVERLAY_LAYER);
      overlayComposer.render();

      camera.layers.set(BASE_LAYER);
      baseComposer.render();
    };

    initThree();

    // Add axes helper
    // let axes = new THREE.AxesHelper(100.0);
    // scene.add(axes);

    // Start rendering
    requestAnimationFrame(render);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("click", onClick, false); // Clean up event listener
      if (renderer) renderer.dispose();
    };
  }, [ra, dec, dist]);


  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      style={{ width: "80%", height: "100%" }}
    >
      {" "}
    </canvas>
  );
};

export default ExoSky;
