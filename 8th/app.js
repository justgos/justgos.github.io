$(function() {
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var WIDTH = 16;
  var BIRDS = WIDTH * WIDTH;
  var BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

  var birdPosV = [];
  var birdSpeedV = [];
  var birdColorV = [];
  for (var f = 0; f<BIRDS; f++ ) {
    birdPosV.push(new THREE.Vector3(Math.random() * BOUNDS - BOUNDS_HALF,
          Math.random() * BOUNDS - BOUNDS_HALF,
          Math.random() * BOUNDS - BOUNDS_HALF));
    birdSpeedV.push(0.8 + Math.pow(Math.random(), 2.0) * 2.0);
    var colorShift = Math.random();
    birdColorV.push(new THREE.Color(0.4 + colorShift * 0.4,
                                    0.2 + colorShift * 0.2,
                                    0.4 + colorShift * 0.2));
  }

  // Custom Geometry - using 3 triangles each. No UVs, no normals currently.
  THREE.BirdGeometry = function () {
  	var triangles = BIRDS * 3;
  	var points = triangles * 3;
  	THREE.BufferGeometry.call( this );
  	var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
  	var birdColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
  	var references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
  	var birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );
    var birdPos = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
    var birdSpeed = new THREE.BufferAttribute( new Float32Array( points ), 1 );
    birdPos.dynamic = true;
  	this.addAttribute( 'position', vertices );
  	this.addAttribute( 'birdColor', birdColors );
  	this.addAttribute( 'reference', references );
  	this.addAttribute( 'birdVertex', birdVertex );
    this.addAttribute( 'birdPos', birdPos );
    this.addAttribute( 'birdSpeed', birdSpeed );
  	// this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );
  	var v = 0;
  	function verts_push() {
  		for (var i=0; i < arguments.length; i++) {
  			vertices.array[v++] = arguments[i];
  		}
  	}
  	var wingsSpan = 20;
  	for (var f = 0; f<BIRDS; f++ ) {
  		// Body
  		verts_push(
  			0, -0, -20,
  			0, 4, -20,
  			0, 0, 30
  		);
  		// Left Wing
  		verts_push(
  			0, 0, -15,
  			-wingsSpan, 0, 0,
  			0, 0, 15
  		);
  		// Right Wing
  		verts_push(
  			0, 0, 15,
  			wingsSpan, 0, 0,
  			0, 0, -15
  		);
  	}
  	for( var v = 0; v < triangles * 3; v++ ) {
      if(v % 9 == 0) {
        var bx = Math.random() * BOUNDS - BOUNDS_HALF;
        var by = Math.random() * BOUNDS - BOUNDS_HALF;
        var bz = Math.random() * BOUNDS - BOUNDS_HALF;
      }
  		var i = ~~(v / 3);
  		var x = (i % WIDTH) / WIDTH;
  		var y = ~~(i / WIDTH) / WIDTH;
  		/*var c = new THREE.Color(
  			0x444444 +
  			~~(v / 9) / BIRDS * 0x666666
  		);*/
      var c = birdColorV[Math.floor(v/9)];
  		birdColors.array[ v * 3 + 0 ] = c.r;
  		birdColors.array[ v * 3 + 1 ] = c.g;
  		birdColors.array[ v * 3 + 2 ] = c.b;
  		references.array[ v * 2     ] = x;
  		references.array[ v * 2 + 1 ] = y;
  		birdVertex.array[ v         ] = v % 9;
      birdSpeed.array[ v         ] = birdSpeedV[Math.floor(v/9)];
      birdPos.array[ v * 3 + 0 ] = birdPosV[Math.floor(v/9)].x;
  		birdPos.array[ v * 3 + 1 ] = birdPosV[Math.floor(v/9)].y;
  		birdPos.array[ v * 3 + 2 ] = birdPosV[Math.floor(v/9)].z;
  	}
  	this.scale( 0.2, 0.2, 0.2 );
  };
  THREE.BirdGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
  var container, stats;
  var camera, controls, scene, renderer, geometry, i, h, color;
  var mouseX = 0, mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  var gyroPresent = false;
  /*window.addEventListener("devicemotion", function(event){
      //if(event.rotationRate.alpha || event.rotationRate.beta || event.rotationRate.gamma)
      if(alpha)
          gyroPresent = true;
          console.log(event.rotationRate);
  });*/
  window.addEventListener("deviceorientation", function(event){
      if(event.alpha)
          gyroPresent = true;
  });
  var last = performance.now();
  var gpuCompute;
  var velocityVariable;
  var positionVariable;
  var positionUniforms;
  var velocityUniforms;
  var birdUniforms;
  var sky;
  var skyParams = {
    turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: 0.52, // elevation / inclination
		azimuth: 0.25
  }
  init();
  animate();
  function init() {
  	container = document.createElement( 'div' );
  	document.body.appendChild( container );
  	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000000  );
  	//camera.position.z = 350;
    //controls = new THREE.PointerLockControls( camera );
    controls = new THREE.DeviceOrientationControls( camera );
  	scene = new THREE.Scene();
  	scene.fog = new THREE.Fog( 0xffffff, 100, 1000 );
  	renderer = new THREE.WebGLRenderer();
  	renderer.setClearColor( scene.fog.color );
  	renderer.setPixelRatio( window.devicePixelRatio );
  	renderer.setSize( window.innerWidth, window.innerHeight );
  	container.appendChild( renderer.domElement );
  	//initComputeRenderer();
  	stats = new Stats();
  	container.appendChild( stats.dom );
  	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  	document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  	document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  	//
  	window.addEventListener( 'resize', onWindowResize, false );
  	var effectController = {
  		seperation: 20.0,
  		alignment: 20.0,
  		cohesion: 20.0,
  		freedom: 0.75
  	};

    sky = new THREE.Sky();
		scene.add( sky.mesh )
    sunSphere = new THREE.Mesh(
			new THREE.SphereBufferGeometry( 20000, 16, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xffffff } )
		);
		sunSphere.position.y = - 700000;
		sunSphere.visible = false;
		scene.add( sunSphere );

  	initBirds();
  }
  function initComputeRenderer() {
  			gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
  	var dtPosition = gpuCompute.createTexture();
  	var dtVelocity = gpuCompute.createTexture();
  	fillPositionTexture( dtPosition );
  	fillVelocityTexture( dtVelocity );
  	velocityVariable = gpuCompute.addVariable( "textureVelocity", document.getElementById( 'fragmentShaderVelocity' ).textContent, dtVelocity );
  	positionVariable = gpuCompute.addVariable( "texturePosition", document.getElementById( 'fragmentShaderPosition' ).textContent, dtPosition );
  	gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
  	gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );
  	positionUniforms = positionVariable.material.uniforms;
  	velocityUniforms = velocityVariable.material.uniforms;
  	positionUniforms.time = { value: 0.0 };
  	positionUniforms.delta = { value: 0.0 };
  	velocityUniforms.time = { value: 1.0 };
  	velocityUniforms.delta = { value: 0.0 };
  	velocityUniforms.testing = { value: 1.0 };
  	velocityUniforms.seperationDistance = { value: 1.0 };
  	velocityUniforms.alignmentDistance = { value: 1.0 };
  	velocityUniforms.cohesionDistance = { value: 1.0 };
  	velocityUniforms.freedomFactor = { value: 1.0 };
  	velocityUniforms.predator = { value: new THREE.Vector3() };
  	velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );
  	velocityVariable.wrapS = THREE.RepeatWrapping;
  	velocityVariable.wrapT = THREE.RepeatWrapping;
  	positionVariable.wrapS = THREE.RepeatWrapping;
  	positionVariable.wrapT = THREE.RepeatWrapping;
  	var error = gpuCompute.init();
  	if ( error !== null ) {
  	    console.error( error );
  	}
  }
  var birdMesh;
  function initBirds() {
  	var geometry = new THREE.BirdGeometry();
  	// For Vertex and Fragment
  	birdUniforms = {
  		color: { value: new THREE.Color( 0xff2200 ) },
  		texturePosition: { value: null },
  		textureVelocity: { value: null },
  		time: { value: 1.0 },
  		delta: { value: 0.0 }
  	};
  	// ShaderMaterial
  	var material = new THREE.ShaderMaterial( {
  		uniforms:       birdUniforms,
  		vertexShader:   document.getElementById( 'birdVS' ).textContent,
  		fragmentShader: document.getElementById( 'birdFS' ).textContent,
  		side: THREE.DoubleSide
  	});
  	birdMesh = new THREE.Mesh( geometry, material );
  	birdMesh.rotation.y = Math.PI / 2;
  	birdMesh.matrixAutoUpdate = false;
  	birdMesh.updateMatrix();
  	scene.add(birdMesh);
  }
  function onWindowResize() {
  	windowHalfX = window.innerWidth / 2;
  	windowHalfY = window.innerHeight / 2;
  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  }
  function onDocumentMouseMove( event ) {
  	mouseX = event.clientX - windowHalfX;
  	mouseY = event.clientY - windowHalfY;
  }
  function onDocumentTouchStart( event ) {
  	if ( event.touches.length === 1 ) {
  		event.preventDefault();
  		mouseX = event.touches[ 0 ].pageX - windowHalfX;
  		mouseY = event.touches[ 0 ].pageY - windowHalfY;
  	}
  }
  function onDocumentTouchMove( event ) {
  	if ( event.touches.length === 1 ) {
  		event.preventDefault();
  		mouseX = event.touches[ 0 ].pageX - windowHalfX;
  		mouseY = event.touches[ 0 ].pageY - windowHalfY;
  	}
  }
  //
  function animate() {
  	requestAnimationFrame( animate );
  	render();
  	stats.update();
  }
  function render() {
  	var now = performance.now();
  	var delta = (now - last) / 1000;
  	if (delta > 1) delta = 1; // safety cap on large deltas
  	last = now;

  	birdUniforms.time.value = now;
  	birdUniforms.delta.value = delta;
  	//velocityUniforms.predator.value.set( 0.5 * mouseX / windowHalfX, - 0.5 * mouseY / windowHalfY, 0 );
  	mouseX = 10000;
  	mouseY = 10000;
  	/*gpuCompute.compute();
  	birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
  	birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;*/
    birdPos = birdMesh.geometry.getAttribute('birdPos');
    //console.log(birdPos.array[ 0 ]);
    for( var f = 0; f < BIRDS; f++ ) {
      //birdPosV[f].x += delta * 40.0 * birdSpeed[f];
      birdPosV[f].applyEuler(new THREE.Euler(0, delta * birdSpeedV[f] * -0.07, 0, 'XYZ'));
    }
    for( var v = 0; v < BIRDS * 3 * 3; v++ ) {
      //birdMesh.geometry.attributes.
      //console.log(birdPos.array[ v * 3 + 0 ]);

      birdPos.array[ v * 3 + 0 ] = birdPosV[Math.floor(v/9)].x;
      birdPos.array[ v * 3 + 1 ] = birdPosV[Math.floor(v/9)].y;
      birdPos.array[ v * 3 + 2 ] = birdPosV[Math.floor(v/9)].z;
  		//birdPos.array[ v * 3 + 1 ] += delta;
  		//birdPos.array[ v * 3 + 2 ] += delta;
    }
    //birdMesh.geometry.addAttribute('birdPos', birdPos);
    birdMesh.geometry.attributes.birdPos.needsUpdate = true;
    //scene.add(birdMesh);
    //birdMesh.updateMatrix();
    //console.log(birdMesh)

    skyParams.inclination = Math.max(skyParams.inclination - delta / 200.0, 0);
    var uniforms = sky.uniforms;
		uniforms.turbidity.value = skyParams.turbidity;
		uniforms.rayleigh.value = skyParams.rayleigh;
		uniforms.luminance.value = skyParams.luminance;
		uniforms.mieCoefficient.value = skyParams.mieCoefficient;
		uniforms.mieDirectionalG.value = skyParams.mieDirectionalG;

    var distance = 400000;
    var theta = Math.PI * ( skyParams.inclination - 0.5 );
		var phi = 2 * Math.PI * ( skyParams.azimuth - 0.5 );
		sunSphere.position.x = distance * Math.cos( phi );
		sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
		sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sky.uniforms.sunPosition.value.copy( sunSphere.position );

    if(gyroPresent)
      controls.update();
  	renderer.render( scene, camera );
  }
});
