"use strict";


//var glow = require( './glow.renderer.js' );

var clusters = [];

var l = 0;

var voxelUniverse = Voxelarium.World();
var geometryShader;
var geometryShaderMono;
//var words1 = voxelUniverse.createTextCluster( "Hello World" );

var controlNatural;
var controlOrbit;
var controls;
	var scene;
	var scene2;
	var scene3;
	var camera, renderer;
	var light;
	var geometry, material, mesh = [];
	var frame_target = [];
	var slow_animate = false;
	var frame = 0;

	var tests = [];

var screen = { width:window.innerWidth, height:window.innerHeight };

	//const totalUnit = Math.PI/(2*60);
	//const unit = totalUnit;
	var delay_counter = 60*3;
	//const pause_counter = delay_counter + 120;
	var single_counter = 60;
	var totalUnit = Math.PI/2;
	var unit = totalUnit / single_counter;
	var pause_counter = 120;

	var counter= 0;

	var clock = new THREE.Clock()



function setMode1(){
}


function setMode2() {
}


function setMode3() {
}

function setControls1() {
	controls.disable();
	camera.matrixAutoUpdate = false;
	controls = controlNatural;
	controls.enable();
}
function setControls2() {
	controls.disable();
	camera.matrixAutoUpdate = false;  // current mode doesn't auto update
	controls = controlOrbit;
	controls.enable();
}


var status_line;
	function init() {
		document.getElementById( "controls1").onclick = setControls1;
		document.getElementById( "controls2").onclick = setControls2;

		scene = new THREE.Scene();
		scene2 = new THREE.Scene();
		scene3 = new THREE.Scene();


		camera = Voxelarium.camera;

		camera.matrixAutoUpdate = false;
		camera.position.z = 1500;
		camera.matrixWorldNeedsUpdate = true;

		 geometryShader = new THREE.MeshBasicMaterial();
		 	//Voxelarium.GeometryShader();
		 geometryShaderMono = Voxelarium.GeometryShaderMono();


		 // for phong hello world test....
 		var light = new THREE.PointLight( 0xffFFFF, 1, 10000 );
 		light.position.set( 0, 0, 1000 );
 		scene.add( light );


		 initVoxelarium();

		 if( typeof  CubeTest !== "undefined" ) {
		 	tests.push( CubeTest() ) ;
			tests[tests.length-1].init( scene );
		}

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );

		if ( !renderer.extensions.get('WEBGL_depth_texture') ) {
		          supportsExtension = false;
		          document.querySelector('#error').style.display = 'block';
		          return;
		        }

		glow.makeComposers( scene
			, ()=>{
				clusters.forEach( (cluster)=>{ cluster.SectorList.forEach( (sector)=>{
					sector.solid_geometry.geometry.uniforms.edge_only = 0;
				})})
			}
			, scene2
			, ()=>{
				clusters.forEach( (cluster)=>{ cluster.SectorList.forEach( (sector)=>{
					sector.solid_geometry.geometry.uniforms.edge_only = 1;
				})})
			}
		);

		document.body.appendChild( renderer.domElement );

		controlNatural = new THREE.NaturalControls( camera, renderer.domElement );
		controlNatural.disable();

		controlOrbit = new THREE.OrbitControls( camera, renderer.domElement );
		controlOrbit.enable();

		controls = controlOrbit;

	}

function slowanim() {
	setTimeout( animate, 256 );
}


function render() {
	renderer.clear();
	glow.render();
}

var nFrame = 0;
var nTarget = 60;
var nTarget2 = 120;

function animate() {
	var delta = clock.getDelta();

		controls.update(delta);

		tests.forEach( (test)=>{ test.animate(); } )


		//nFrame++;
		if( nFrame++ < nTarget ) {
			clusters.forEach( (cluster)=>{ cluster.SectorList.forEach( (sector)=>{
				sector.solid_geometry.geometry.uniforms.in_FaceColor = new THREE.Vector4( 0.2 * 1, 0.5* 1,0.05* 1, 1.0 );
				//sector.solid_geometry.geometry.uniforms.in_FaceColor = new THREE.Vector4( 0.3 * (nTarget-nFrame)/nTarget, 0.7* (nTarget-nFrame)/nTarget,0.9* (nTarget-nFrame)/nTarget, 1.0 );
				sector.solid_geometry.geometry.uniforms.in_Color = new THREE.Vector4( 0.01 * (nFrame)/nTarget, 0.4* (nFrame)/nTarget,0.01* (nFrame)/nTarget, 1.0 );
			})})
		} else if( nFrame < nTarget2 ) {
			clusters.forEach( (cluster)=>{ cluster.SectorList.forEach( (sector)=>{
				sector.solid_geometry.geometry.uniforms.in_Color = new THREE.Vector4( 0.01 * (nTarget2-nFrame)/nTarget, 0.4* (nTarget2-nFrame)/nTarget,0.01* (nTarget2-nFrame)/nTarget, 1.0 );
				//sector.solid_geometry.geometry.uniforms.in_FaceColor = new THREE.Vector4( 0.3 * (nFrame-nTarget)/nTarget, 0.7* (nFrame-nTarget)/nTarget,0.9* (nFrame-nTarget)/nTarget, 1.0 );
			})})
		}
		else {
			nFrame = 0;
		}


		//console.log( "tick")
		//if( frame++ > 10 ) return
		if( slow_animate )
			requestAnimationFrame( slowanim );
		else
			requestAnimationFrame( animate );
		//var unit = Math.PI/2; //worst case visible

	render();

}

function initVoxelarium() {

	Voxelarium.TextureAtlas.init( 32, 64 );

  Voxelarium.db.init( ()=>{
//	Voxelarium.Voxels.load( ()=>{
   geometryShader.map = Voxelarium.TextureAtlas.texture;
	 geometryShader.needsUpdate = true;

	 var geometryMaterial = Voxelarium.GeometryBasicBuffer();
			//Voxelarium.GeometryBuffer();
	 geometryMaterial.makeVoxCube(  400, Voxelarium.Voxels.BlackRockType );
	 scene2.add( new THREE.Mesh( geometryMaterial.geometry, geometryShader) );

  var basicMesher = Voxelarium.BasicMesher(  );

	var words1 = voxelUniverse.createTextCluster( "Voxelarium", Voxelarium.Voxels.BlackRockType, basicMesher, Voxelarium.Fonts.TI99 );
	clusters.push( words1 );
	var offset = 300;
	words1.SectorList.forEach( (sector)=>{
		basicMesher.MakeSectorRenderingData( sector );
		scene2.add( sector.THREE_solid = new THREE.Mesh( sector.solid_geometry.geometry, geometryShaderMono ) )
		//sector.THREE_solid.matrix.Translate( -800, +offset, 0 );
		sector.THREE_solid.position.add( new THREE.Vector3(-800, +offset, 0 ));
	})

	var words1 = voxelUniverse.createTextCluster( "Blackvoxel", Voxelarium.Voxels.BlackRockType, basicMesher, Voxelarium.Fonts.TI99 );
	clusters.push( words1 );
	words1.SectorList.forEach( (sector)=>{
		basicMesher.MakeSectorRenderingData( sector );
		scene2.add( sector.THREE_solid = new THREE.Mesh( sector.solid_geometry.geometry, geometryShaderMono ) )
		sector.THREE_solid.position.add( new THREE.Vector3( -800, -1*8*20+offset, 0 ));
	})

	var words1 = voxelUniverse.createTextCluster( "Play Game", Voxelarium.Voxels.BlackRockType, basicMesher, Voxelarium.Fonts.TI99 );
	clusters.push( words1 );
	words1.SectorList.forEach( (sector)=>{
		basicMesher.MakeSectorRenderingData( sector );
		scene2.add( sector.THREE_solid = new THREE.Mesh( sector.solid_geometry.geometry, geometryShaderMono ) )
		sector.solid_geometry.geometry.uniforms.in_FaceColor = new THREE.Vector4( 0.4, 0.8, 1, 1 );
		sector.solid_geometry.geometry.uniforms.edge_only = 0;
		sector.THREE_solid.position.add( new THREE.Vector3( -800, -2*8*20+offset, 0 ));
	})
	var detailsize = 5;
	renderVoxelWords( "Inventory", -800, -n*8*detailsize -3*8*20 -0*8*detailsize +offset, detailsize );
	for( var n = 0; n < 10; n++ ) {
		renderVoxelWords( "Server Name Goes here", -800,-n*8*detailsize -3*8*20-1*8*detailsize+offset, detailsize );
		renderVoxelWords( "Players 0/3", -800 + 25 * 8*detailsize,-n*8*detailsize -3*8*20-1*8*detailsize+offset, detailsize );
		renderVoxelWords( "Ping 333", -800 + (25+12)* 8*detailsize,-n*8*detailsize -3*8*20-1*8*detailsize+offset, detailsize );
	}
	function renderVoxelWords( string, xofs, offset, size ) {
		var words1 = voxelUniverse.createTextCluster( string, Voxelarium.Voxels.BlackRockType, basicMesher, Voxelarium.Fonts.TI99, size );
		clusters.push( words1 );
		words1.SectorList.forEach( (sector)=>{
			basicMesher.MakeSectorRenderingData( sector );
			scene2.add( sector.THREE_solid = new THREE.Mesh( sector.solid_geometry.geometry, geometryShaderMono ) )
			sector.solid_geometry.geometry.uniforms.in_FaceColor = new THREE.Vector4( 0.4, 0.8, 1, 1 );
			sector.solid_geometry.geometry.uniforms.edge_only = 0;
			//sector.THREE_solid.matrix.Translate( xofs, offset, 0 );
			sector.THREE_solid.position.add( new THREE.Vector3(xofs, offset, 0) );
		})

	}
})
}


init();
animate();
