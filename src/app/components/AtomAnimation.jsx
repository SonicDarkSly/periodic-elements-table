import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Colors = {
  red: 0xFF5252,
  white: 0xFFFFFF,
  brown: 0x59332e,
  pink: 0xF5986E,
  brownDark: 0x23190f,
  blue: 0x6DBAD8,
  green: 0x46B46B,
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
  const baseRadius = window.innerWidth > window.innerHeight ? window.innerHeight - 40 / 2 : window.innerWidth - 40 / 2;
  const radius = 50 + (baseRadius / 20) * ringNumber * 1.5;
  const ring = createTorus(radius, baseRadius / 2400, 20, 100, Math.PI * 2, '#00FF00', 0);

  const electrons = [];
  let currentLayer = 0;

  while (electronCount > 0) {
    const electronPerLayer = [2, 8, 18, 32, 50, 72];
    const electronsInLayer = Math.min(electronPerLayer[currentLayer], electronCount);
    const angleIncrement = (Math.PI * 2) / electronsInLayer;
    let angle = Math.random() * angleIncrement;

    for (let i = 0; i < electronsInLayer; i++) {
      const posX = radius * Math.cos(angle);
      const posY = radius * Math.sin(angle);

      angle += angleIncrement;

      const electron = createSphere({ r: 12, x: posX, y: posY, color: Colors.green, opacity: 0.675 });
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
  const electronPerLayer = elementData.electronLayers;
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

const createTorus = (r, tubeD, radialSegs, tubularSegs, arc, color, rotationX) => {
  const geometry = new THREE.TorusGeometry(r, tubeD, radialSegs, tubularSegs, arc);
  const material = new THREE.MeshLambertMaterial({ color: color || '#cdcdcd' });
  const torus = new THREE.Mesh(geometry, material);
  torus.rotation.x = rotationX;

  return torus;
};

const AtomAnimation = React.memo(({ protonCount, neutronCount, electronCount, elementData , animationStarted}) => {
  const containerRef = useRef(null);

  useEffect(() => {

    if (!animationStarted) {
      return; // Si l'animation n'est pas démarrée, ne faites rien
    }

    const scene = new THREE.Scene();
    const width = 600;
    const height = 400;
    const camera = new THREE.OrthographicCamera(width / -1, width / 1, height / 1, height / -1, -500, 500);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xECECEC, 0);
    renderer.setSize(width, height);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambientLight);

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
      scene.add(light);
    });

    function createAtom(protonCount, neutronCount, electronCount, elementData) {
      const nucleus = new THREE.Group();
    
      const protonGeometry = new THREE.SphereGeometry(2, 14, 14);
      const protonMaterial = new THREE.MeshPhongMaterial({ color: Colors.red, transparent: true, opacity: 0.737 });
    
      for (let i = 0; i < protonCount; i++) {
        let posX = 0;
        let posY = 0;
        let posZ = 0;
    
        // Réduire la portée de positionnement aléatoire
        if (protonCount <= 4) {
          posX = (Math.random() - 0.5) * 1.5;
          posY = (Math.random() - 0.5) * 1.5;
          posZ = (Math.random() - 0.5) * 1.5;
        } else {
          posX = (Math.random() - 0.5) * 7;
          posY = (Math.random() - 0.5) * 7;
          posZ = (Math.random() - 0.4) * 7;
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
    
        if (neutronCount <= 4) {
          posX = (Math.random() - 0.5) * 1.5;
          posY = (Math.random() - 0.5) * 1.5;
          posZ = (Math.random() - 0.5) * 1.5;
        } else {
          posX = (Math.random() - 0.5) * 7;
          posY = (Math.random() - 0.5) * 7;
          posZ = (Math.random() - 0.4) * 7;
        }
    
        const neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
        neutron.position.set(posX, posY, posZ);
        nucleus.add(neutron);
      }
    
      nucleus.scale.set(10, 10, 10);
      scene.add(nucleus);
    
      const valences = createValenceLayers(electronCount, elementData);
    
      valences.forEach((v) => {
        scene.add(v);
      });
    
      function render() {
        requestAnimationFrame(render);
    
        const baseRotation = 0.06;
    
        valences.forEach((v, i) => {
          v.rotation.y += baseRotation - i * 0.021;
          v.rotation.x += baseRotation - i * 0.051;
          v.rotation.z += baseRotation - i * 0.031;
        });
    
        nucleus.rotation.x += 0.05;
        nucleus.rotation.y += 0.05;
        nucleus.rotation.z += 0.05; // Ajout d'une rotation supplémentaire pour le noyau
    
        renderer.render(scene, camera);
      }
    
      render();
    }

    createAtom(protonCount, neutronCount, electronCount, elementData);

    containerRef.current.appendChild(renderer.domElement);

    const cleanup = () => {
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [protonCount, neutronCount, electronCount, elementData, animationStarted]);

  return <div ref={containerRef} ></div>;
});

export default AtomAnimation;
