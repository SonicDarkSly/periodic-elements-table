import React, { useRef, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";

const Colors = {
  red: 0xff5252,
  white: 0xffffff,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x6dbad8,
  green: 0x46b46b,
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
  const radius = 50 + (baseRadius / 20) * ringNumber * 1.5;
  const ring = createTorus(
    radius,
    baseRadius / 2400,
    20,
    100,
    Math.PI * 2,
    "#00FF00",
    0
  );

  const electrons = [];
  let currentLayer = 0;

  while (electronCount > 0) {
    const electronPerLayer = [2, 8, 18, 32, 50, 72];
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
        r: 12,
        x: posX,
        y: posY,
        color: Colors.green,
        opacity: 0.675,
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
  const electronPerLayer = elementData.electronLayers || [2, 8, 18, 32, 24, 8, 2];
  const valences = [];

  for (let i = 0; i < electronPerLayer.length; i++) {
    const electronsInLayer = Math.min(electronPerLayer[i], electronCount);
    if (electronsInLayer <= 0) break;

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

    if (
      protonCount === undefined ||
      neutronCount === undefined ||
      electronCount === undefined ||
      !elementData
    ) {
      return <div>Chargement des données...</div>;
    }

    const containerRef = useRef(null);
    const scene = useRef(new THREE.Scene());
    const renderer = useRef(null);
    const camera = useRef(null);
    const valences = useRef([]);
    const nucleusRotationSpeed = neutronCount < 70 ? 0.014 : 0.005; // Vitesse de rotation du noyau

    const createAtom = (protonCount, neutronCount, electronCount, elementData) => {
      const nucleus = new THREE.Group();
      
      const protonGeometry = new THREE.SphereGeometry(2, 14, 14);
      const protonMaterial = new THREE.MeshPhongMaterial({ color: Colors.red, transparent: true, opacity: 0.737 });
      
      // position des prontons differente si < 4
      for (let i = 0; i < protonCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;
        
        if (protonCount <= 4) {
          posX = (Math.random() - 0.5) * 1.5;
          posY = (Math.random() - 0.5) * 1.5;
          posZ = (Math.random() - 0.5) * 1.5;
        } else {
          posX = (Math.random() - 0.5) * 6;
          posY = (Math.random() - 0.5) * 6;
          posZ = (Math.random() - 0.4) * 6;
        }
        
        const proton = new THREE.Mesh(protonGeometry, protonMaterial);
        proton.position.set(posX, posY, posZ);
        nucleus.add(proton);
      }
      
      const neutronGeometry = new THREE.SphereGeometry(2, 14, 14);
      const neutronMaterial = new THREE.MeshPhongMaterial({ color: Colors.blue, transparent: true, opacity: 0.773 });
      
      for (let i = 0; i < neutronCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;
        
        // position des neutrons differente si < 4
        if (neutronCount <= 4) {
          posX = (Math.random() - 0.5) * 1.5;
          posY = (Math.random() - 0.5) * 1.5;
          posZ = (Math.random() - 0.5) * 1.5;
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
            v.rotation.y += nucleusRotationSpeed + (i + 1) * 0.012; // Vitesse de rotation différente pour chaque couche
            v.rotation.x += nucleusRotationSpeed + (i + 1) * 0.009;
            v.rotation.z += nucleusRotationSpeed + (i + 1) * 0.005; // vitesse electron sur orbite
          });
      
          nucleus.rotation.x += nucleusRotationSpeed;
          nucleus.rotation.y += nucleusRotationSpeed;
          nucleus.rotation.z += nucleusRotationSpeed;
      
          renderer.current.render(scene.current, camera.current);
        
      }
      

        render();
      
    };

    useEffect(() => {
      if (!camera.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.current = new THREE.OrthographicCamera(
          width / -2,
          width / 2,
          height / 2,
          height / -2,
          -1000,
          1000
        );
        camera.current.position.z = 10;
      }

      if (!renderer.current) {
        renderer.current = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.current.setClearColor(0xececec, 0);
        renderer.current.setSize(window.innerWidth, window.innerHeight);

        if (containerRef.current) {
          containerRef.current.appendChild(renderer.current.domElement);
        }

              const ambientLight = new THREE.AmbientLight(0xFFFFFF);
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
      nucleus.name = 'nucleus';
      scene.current.add(nucleus);

        createAtom(protonCount, neutronCount, electronCount, elementData);
      }
    }, [protonCount, neutronCount, electronCount, elementData]);

    return <div className="test" ref={containerRef}></div>;
  }
);

export default AtomAnimation;