var Colors = {
    red: 0xFF5252, // Couleur rouge vive pour les protons
    white: 0xFFFFFF,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x6DBAD8, // Couleur bleue vive pour les neutrons
    green: 0x46B46B, // Couleur verte vive pour les électrons
  };
  
  // Create an empty scene
  var scene = new THREE.Scene();
  
  // Create a basic perspective camera
  var width = window.innerWidth;
  var height = window.innerHeight;
  var camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    -1000,
    1000
  );
  
  camera.position.z = 20;
  
  // Create a renderer with Antialiasing
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  
  // Configure renderer clear color
  renderer.setClearColor("#fff", 0);
  
  // Configure renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Append Renderer to DOM
  document.body.appendChild(renderer.domElement);
  
  // Light
  var ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);
  
  var lights = [];
  
  lights[0] = new THREE.PointLight(0xffffff, 0.5, 0);
  lights[0].position.set(200, 0, 0);
  
  lights[1] = new THREE.PointLight(0xffffff, 0.5, 0);
  lights[1].position.set(0, 200, 0);
  
  lights[2] = new THREE.PointLight(0xffffff, 0.5, 0);
  lights[2].position.set(0, 100, 100);
  
  lights[3] = new THREE.AmbientLight(0xffffff, 0.6);
  
  lights.forEach(function(light) {
    scene.add(light);
  });
  
  /*
  Geometry
  */
  function createTorus(r, tubeD, radialSegs, tubularSegs, arc, color, rotationX) {
    var geometry = new THREE.TorusGeometry(r, tubeD, radialSegs, tubularSegs, arc);
    var material = new THREE.MeshLambertMaterial({ color: color || "#cdcdcd" });
    var torus = new THREE.Mesh(geometry, material);
    torus.rotation.x = rotationX;
  
    return torus;
  }
  
  function createLine() {
    var material = new THREE.LineBasicMaterial({
      color: 0x00FF00,
      linewidth: 0.5, // Épaisseur très fine pour les lignes d'orbite
      transparent: true,
      opacity: 0 // Opacité à 0 pour les rendre transparentes
    });
  
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 10, 0),
      new THREE.Vector3(0, -10, 0)
    );
  
    var line = new THREE.Line(geometry, material);
  
    return line;
  }
  
  
  /*
  r
  color
  x
  y
  */
  function createSphere(params) {
    var geometry = new THREE.SphereGeometry(params.r, 14, 14); // Augmentation de la résolution pour un rendu plus fin
    var material = new THREE.MeshPhongMaterial({
      color: params.color || Colors.blue,
      transparent: true,
      opacity: params.opacity || 0.8
    });
    var sphere = new THREE.Mesh(geometry, material);
  
    sphere.position.x = params.x || 0;
    sphere.position.y = params.y || 0;
  
    return sphere;
  }
  
  /* create stuff */
  // modification du rayon des couches electroniques
  const baseRadius = width > height ? height - 40 / 2 : width - 40 / 2;
  
  function createValence(ringNumber, electronCount) {
    var electronPerLayer = [2, 8, 18, 32, 50]; // Capacités maximales des couches électroniques selon les informations scientifiques
  
    var radius = 50 + (baseRadius / 20) * ringNumber * 2.5;
  
    var ring = createTorus(
      radius,
      baseRadius / 2400, // Lignes d'orbites très fines
      20,
      100,
      Math.PI * 2,
      "#00FF00", // Couleur verte pour les lignes d'orbites
      0
    );
  
    var electrons = [];
  
    var currentLayer = 0;
  
    while (electronCount > 0) {
      var electronsInLayer = Math.min(electronPerLayer[currentLayer], electronCount);
  
      var angleIncrement = (Math.PI * 2) / electronsInLayer;
      var angle = Math.random() * angleIncrement; // Ajustement de l'angle d'inclinaison aléatoire pour éviter les superpositions
  
      for (var i = 0; i < electronsInLayer; i++) {
        // Solve for x and y.
        var posX = radius * Math.cos(angle);
        var posY = radius * Math.sin(angle);
  
        angle += angleIncrement;
  
        var electron = createSphere({ r: 12, x: posX, y: posY, color: Colors.green, opacity: 0.675 }); // Couleur verte transparente pour les électrons
        electrons.push(electron);
      }
  
      electronCount -= electronsInLayer;
      currentLayer++;
    }
  
    var group = new THREE.Group();
  
    group.add(ring);
  
    electrons.forEach(function(electron) {
      group.add(electron);
    });
  
    return group;
  }
  
  function createAtom(protonCount, neutronCount, electronCount) {
    var nucleus = new THREE.Group();
  
    // Protons
    var protonGeometry = new THREE.SphereGeometry(2, 14, 14);
    var protonMaterial = new THREE.MeshPhongMaterial({ color: Colors.red, transparent: true, opacity: 0.737 }); // Couleur rouge transparente pour les protons
  
    for (var i = 0; i < protonCount; i++) {
      var proton = new THREE.Mesh(protonGeometry, protonMaterial);
      proton.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.4) * 8); // Augmentation de l'espace entre les protons
      nucleus.add(proton);
    }
  
    // Neutrons
    var neutronGeometry = new THREE.SphereGeometry(2, 14, 14);
    var neutronMaterial = new THREE.MeshPhongMaterial({ color: Colors.blue, transparent: true, opacity: 0.773 }); // Couleur bleue transparente pour les neutrons
  
    for (var i = 0; i < neutronCount; i++) {
      var neutron = new THREE.Mesh(neutronGeometry, neutronMaterial);
      neutron.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.4) * 8); // Augmentation de l'espace entre les neutrons
      nucleus.add(neutron);
    }
  
    // Échelle (scale) du noyau pour l'effet de gonflement x10
    nucleus.scale.set(10, 10, 10);
  
    scene.add(nucleus);
  
    // Création des couches électroniques
    var valences = createValenceLayers(electronCount);
  
    valences.forEach(function(v) {
      scene.add(v);
    });
  
    /*
    Render
    */
    function render() {
      requestAnimationFrame(render);
  
      var baseRotation = 0.06;
  
      valences.forEach(function(v, i) {
        v.rotation.y += baseRotation - i * 0.021;
        v.rotation.x += baseRotation - i * 0.051;
        v.rotation.z += baseRotation - i * 0.031;
      });
  
      nucleus.rotation.x += 0.05;
      nucleus.rotation.y += 0.05;
  
      renderer.render(scene, camera);
    }
  
    render();
  }
  
  // Utilisation : createAtom(protonCount, neutronCount, electronCount);
  createAtom(2, 2, 12); // Exemple avec 2 protons, 2 neutrons et 10 électrons
  
  
  function createValenceLayers(electronCount) {
    var electronPerLayer = [2, 8, 18, 32, 50]; // Capacités maximales des couches électroniques selon les informations scientifiques
    var valences = [];
  
    for (var i = 0; i < electronPerLayer.length; i++) {
      var electronsInLayer = Math.min(electronPerLayer[i], electronCount);
      if (electronsInLayer <= 0) break;
  
      var valence = createValence(i + 1, electronsInLayer);
      valences.push(valence);
  
      electronCount -= electronsInLayer;
    }
  
    return valences;
  }
  
  // Utilisation : createAtom(protonCount, neutronCount, electronCount);
  createAtom(8, 8, 8); // Exemple avec 2 protons, 2 neutrons et 10 électrons
  