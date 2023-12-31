import React, { useRef, useLayoutEffect } from "react";
import * as THREE from "three";

const Colors = {
  red: "#ff5252",
  white: "#ffffff",
  brown: "#59332e",
  pink: "#f5986e",
  brownDark: "#23190f",
  blue: "#00e5ff", 
  green: "#39e639", 
  valences: "#00fbff",
};

const createSphere = (params) => {
  const geometry = new THREE.SphereGeometry(params.r, 14, 14);
  const material = new THREE.MeshPhongMaterial({
    color: params.color || Colors.blue,
    transparent: true,
    opacity: params.opacity || 0.8,
  });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.x = params.x || 0;
  sphere.position.y = params.y || 0;

  return sphere;
};

const createValence = (ringNumber, electronCount) => {
  const baseRadius =
    window.innerWidth > window.innerHeight
      ? window.innerHeight - 40 / 2
      : window.innerWidth - 40 / 2;
  const radius = 40 + (baseRadius / 20) * ringNumber * 1.3;
  const ring = createTorus(
    radius,
    baseRadius / 2400,
    20,
    100,
    Math.PI * 2,
    Colors.valences, //ligne verte, options utilisateur ?
    0
  );

  const electrons = [];
  let currentLayer = 0;

  while (electronCount > 0) {
    const electronPerLayer = [2, 8, 18, 32, 32, 18, 8];
    const electronsInLayer = Math.min(
      electronPerLayer[currentLayer],
      electronCount
    );
    const angleIncrement = (Math.PI * 2) / electronsInLayer;
    let angle = Math.random() * angleIncrement;

    for (let i = 0; i < electronsInLayer; i++) {
      const posX = radius * Math.cos(angle);
      const posY = radius * Math.sin(angle);

      angle += angleIncrement;

      const electron = createSphere({
        r: 10,
        x: posX,
        y: posY,
        color: Colors.green,
        opacity: 0.800,
      });
      electrons.push(electron);
    }

    electronCount -= electronsInLayer;
    currentLayer++;
  }

  const group = new THREE.Group();
  group.add(ring);

  electrons.forEach((electron) => {
    group.add(electron);
  });

  return group;
};

const createValenceLayers = (electronCount, elementData) => {
  const electronPerLayer = elementData.electronLayers || [];
  const valences = [];

  for (let i = 0; i < electronPerLayer.length; i++) {
    const electronsInLayer = Math.min(electronPerLayer[i], electronCount);
    if (electronsInLayer <= 0) {
      break;
    }

    const valence = createValence(i + 1, electronsInLayer);
    valences.push(valence);

    electronCount -= electronsInLayer;
  }

  return valences;
};

const createTorus = (
  r,
  tubeD,
  radialSegs,
  tubularSegs,
  arc,
  color,
  rotationX
) => {
  const geometry = new THREE.TorusGeometry(
    r,
    tubeD,
    radialSegs,
    tubularSegs,
    arc
  );
  const material = new THREE.MeshLambertMaterial({ color: color || "#cdcdcd" });
  const torus = new THREE.Mesh(geometry, material);
  torus.rotation.x = rotationX;

  return torus;
};

const AtomAnimation = React.memo(
  ({ protonCount, neutronCount, electronCount, elementData }) => {
    const containerRef = useRef(null);
    const scene = useRef(new THREE.Scene());
    const renderer = useRef(null);
    const camera = useRef(null);
    const valences = useRef([]);

    let nucleusRotationSpeed = neutronCount < 70 ? 0.014 : 0.011; // Vitesse de rotation du noyau

    let initialProtonCount;
    let initialNeutronCount;
    let initialElectronCount;
    let initialElementData;

    // Vérification des valeurs
    if (
      protonCount === undefined ||
      neutronCount === undefined ||
      electronCount === undefined ||
      !elementData
    ) {
      initialProtonCount = null;
      initialNeutronCount = null;
      initialElectronCount = null;
      initialElementData = null;
    } else {
      initialProtonCount = protonCount;
      initialNeutronCount = neutronCount;
      initialElectronCount = electronCount;
      initialElementData = elementData;
    }

    const createAtom = (
      protonCount,
      neutronCount,
      electronCount,
      elementData
    ) => {
      const nucleus = new THREE.Group();

      const protonGeometry = new THREE.SphereGeometry(2, 12, 12);
      const protonMaterial = new THREE.MeshPhongMaterial({
        color: Colors.red,
        transparent: true,
        opacity: 0.700,
      });

      // position des prontons differente si < 4
      for (let i = 0; i < protonCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;

        if (protonCount <= 4) {
          posX = (Math.random() - 0.5) * 3;
          posY = (Math.random() - 0.5) * 3;
          posZ = (Math.random() - 0.4) * 3;
        } else {
          posX = (Math.random() - 0.5) * 6;
          posY = (Math.random() - 0.5) * 6;
          posZ = (Math.random() - 0.4) * 6;
        }

        const proton = new THREE.Mesh(protonGeometry, protonMaterial);
        proton.position.set(posX, posY, posZ);
        nucleus.add(proton);
      }

      const neutronGeometry = new THREE.SphereGeometry(2, 12, 12);
      const neutronMaterial = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: 0.800,
      });

      for (let i = 0; i < neutronCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;

        // position des neutrons differente si < 4
        if (neutronCount <= 4) {
          posX = (Math.random() - 0.5) * 3;
          posY = (Math.random() - 0.5) * 3;
          posZ = (Math.random() - 0.4) * 3;
        } else {
          posX = (Math.random() - 0.5) * 6;
          posY = (Math.random() - 0.5) * 6;
          posZ = (Math.random() - 0.4) * 6;
        }

        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
        neutron.position.set(posX, posY, posZ);
        nucleus.add(neutron);
      }

      nucleus.scale.set(10, 10, 10);
      nucleus.rotation.x = Math.random() * Math.PI * 2; // Rotation initiale aléatoire

      scene.current.add(nucleus);

      valences.current = createValenceLayers(electronCount, elementData);
      valences.current.forEach((v) => {
        scene.current.add(v);
      });

      function render() {
        requestAnimationFrame(render);

        valences.current.forEach((v, i) => {
          const rotationSpeedX = nucleusRotationSpeed + (i + 1) * (Math.random() * 0.040); // Rotation aléatoire en X
          const rotationSpeedY = nucleusRotationSpeed + (i + 1) * (Math.random() * 0.047); // Rotation aléatoire en Y
          const rotationSpeedZ = nucleusRotationSpeed + (i + 2) * (Math.random() * 0.052); // Rotation aléatoire en Z
        
          v.rotation.y += rotationSpeedY;
          v.rotation.x += rotationSpeedX;
          v.rotation.z += rotationSpeedZ;
        });
        

        nucleus.rotation.x += nucleusRotationSpeed;
        nucleus.rotation.y += nucleusRotationSpeed;
        nucleus.rotation.z += nucleusRotationSpeed;

        renderer.current.render(scene.current, camera.current);
      }

      render();
    };

    let zoom;
    if (electronCount > 90) {
      zoom = 2;
    } else if (electronCount > 60) {
      zoom = 2;
    } else if (electronCount > 40) {
      zoom = 2.5;
    } else if (electronCount > 17) {
      zoom = 3;
    } else {
      zoom = 4;
    }

    useLayoutEffect(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (!camera.current) {
        camera.current = new THREE.OrthographicCamera(
          width / -1,
          width / 1,
          height / 1,
          height / -1,
          -1000,
          1000
        );
        camera.current.position.z = 10;
      }

      camera.current.zoom = zoom;
      camera.current.updateProjectionMatrix();

      if (!renderer.current) {
        renderer.current = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.current.setClearColor(0x000000, 0);
        renderer.current.setSize(window.innerWidth, window.innerHeight);

        if (containerRef.current) {
          containerRef.current.appendChild(renderer.current.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.current.add(ambientLight);

        const lights = [
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.PointLight(0xffffff, 0.5, 0),
          new THREE.AmbientLight(0xffffff, 0.6),
        ];

        lights[0].position.set(200, 0, 0);
        lights[1].position.set(0, 200, 0);
        lights[2].position.set(0, 100, 100);

        lights.forEach((light) => {
          scene.current.add(light);
        });

        const nucleus = new THREE.Group();
        nucleus.name = "nucleus";
        scene.current.add(nucleus);
      }

      if (
        initialProtonCount !== null &&
        initialNeutronCount !== null &&
        initialElectronCount !== null &&
        initialElementData
      ) {
        createAtom(
          initialProtonCount,
          initialNeutronCount,
          initialElectronCount,
          initialElementData
        );
      }
    }, [protonCount, neutronCount, electronCount, elementData]);

    return <div className="animation" ref={containerRef}></div>;
  }
);

AtomAnimation.displayName = "AtomAnimation";

export default AtomAnimation;