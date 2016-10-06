(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @author d3x0r / https://github.com/d3x0r
 */

THREE.NaturalControls = function ( object, domElement ) {

    this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	// 65 /*A*/, 83 /*S*/, 68 /*D*/
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40
        , A:65, S:83, D:68, W:87, SPACE:32, C:67 };

	// internals

	var scope = this;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();



	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.update = function ( tick ) {

    touchUpdate();

    if( phiDelta )
        var a = 3;
        scope.object.matrix.motion.rotation.x = -phiDelta;
        scope.object.matrix.motion.rotation.y = thetaDelta;//, 0 );

        //scope.object.matrix.rotateRelative( -phiDelta, thetaDelta, 0 );
        scope.object.matrixWorldNeedsUpdate = true;

        scope.object.matrix.move( tick );
        scope.object.matrix.rotateRelative( 0, 0, -scope.object.matrix.roll );

        thetaDelta = 0;
		phiDelta = 0;
	};



	function onMouseDown( event ) {
		if ( scope.enabled === false ) return;

		event.preventDefault();

		rotateStart.set( event.clientX, event.clientY );

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

    rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

        rotateDelta.x = 32 * (rotateDelta.x / window.innerWidth)
        rotateDelta.y = 32 * (rotateDelta.y / window.innerHeight)

		scope.rotateLeft( 2 * Math.PI * rotateDelta.x  );
		scope.rotateUp( 2 * Math.PI * rotateDelta.y );

		rotateStart.copy( rotateEnd );

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );


	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;

		switch ( event.keyCode ) {
            case scope.keys.SPACE:
                scope.object.matrix.motion.speed.y = 100;
                break;
            case scope.keys.C:
                scope.object.matrix.motion.speed.y = -100;
                break;
            case scope.keys.A:
                scope.object.matrix.motion.speed.x = -100;
				break;
			case scope.keys.W:
                scope.object.matrix.motion.speed.z = 100;
				break;
			case scope.keys.S:
                scope.object.matrix.motion.speed.z = -100;
				break;
			case scope.keys.D:
                scope.object.matrix.motion.speed.x = 100;
				break;
		}

	}

	function onKeyUp( event ) {

        switch ( event.keyCode ) {
            case scope.keys.SPACE:
                scope.object.matrix.motion.speed.y = 0;
                break;
            case scope.keys.C:
                scope.object.matrix.motion.speed.y = 0;
                break;

            case scope.keys.A:
                scope.object.matrix.motion.speed.x = 0;
				break;
			case scope.keys.W:
                scope.object.matrix.motion.speed.z = 0;
				break;
			case scope.keys.S:
                scope.object.matrix.motion.speed.z = 0;
				break;
			case scope.keys.D:
                scope.object.matrix.motion.speed.x = 0;
				break;
        }
		//switch ( event.keyCode ) {

		//		break;
		//}

	}

var touches = [];

TouchList.prototype.forEach = function(c){ for( var n = 0; n < this.length; n++ ) c(this[n]); }

function touchUpdate() {
  if( touches.length == 1 ){
    var t = touches[0];
    if( t.new )
    {
      rotateStart.set( t.x, t.y );
      t.new = false;
    }
    else {

            rotateEnd.set( t.x, t.y );
      		rotateDelta.subVectors( rotateEnd, rotateStart );

            rotateDelta.x = -2 * (rotateDelta.x / window.innerWidth)
            rotateDelta.y = - 2 * (rotateDelta.y / window.innerHeight)
      		scope.rotateLeft( Math.PI/2 * rotateDelta.x   );
      		scope.rotateUp( Math.PI/2 * rotateDelta.y );
            console.log( rotateDelta )
      		rotateStart.copy( rotateEnd );

    }
  }
}

function onTouchStart( e ) {
  e.preventDefault();
  e.changedTouches.forEach( (touch)=>{
    touches.push( {ID:touch.identifier,
      x : touch.clientX,
      y : touch.clientY,
      new : true
    })
  })
}

function onTouchMove( e ) {
  e.preventDefault();
  e.changedTouches.forEach( (touchChanged)=>{
    var touch = touches.find( (t)=> t.ID === touchChanged.identifier );
    if( touch ) {
      touch.x = touchChanged.clientX;
      touch.y = touchChanged.clientY;
    }
  })
}

function onTouchEnd( e ) {
  e.preventDefault();
  e.changedTouches.forEach( (touchChanged)=>{
    var touchIndex = touches.findIndex( (t)=> t.ID === touchChanged.identifier );
    if( touchIndex >= 0 )
       touches.splice( touchIndex, 1 )
  })
}

    function ignore(event) {
        event.preventDefault();
    }
    this.disable = function() {
    	scope.domElement.removeEventListener( 'contextmenu', ignore, false );
    	scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
    	scope.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
    	scope.domElement.removeEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    	window.removeEventListener( 'keydown', onKeyDown, false );
    	window.removeEventListener( 'keyup', onKeyUp, false );
    }

    this.enable = function() {
    	scope.domElement.addEventListener( 'contextmenu', ignore, false );
    	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
    	scope.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
      scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
      scope.domElement.addEventListener( 'touchmove', onTouchMove, false );
      scope.domElement.addEventListener( 'touchend', onTouchEnd, false );

    	scope.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    	window.addEventListener( 'keydown', onKeyDown, false );
    	window.addEventListener( 'keyup', onKeyUp, false );
    }
    this.enable();

};

//THREE.NaturalCamera.

THREE.NaturalControls.prototype = Object.create( THREE.EventDispatcher.prototype );

},{}],2:[function(require,module,exports){


var casting = {
    reset: function() { this.cubes = 0; },
    material : new THREE.LineBasicMaterial({color:'blue',linewidth:3}),
    geometry : new THREE.BufferGeometry,
    mesh : null,
    addRef : null,
    cubes : 0
};
casting.geometry.dynamic = true;
casting.mesh = new THREE.LineSegments( casting.geometry, casting.material );
 casting.mesh.frustumCulled = false;
 var vertices = new Float32Array( 500 * 3 ); // 3 vertices per point
casting.geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )

casting.addRef = function updateCastMesh( currentRef) {
  {
    var unit = currentRef.cluster.voxelUnitSize;
    var x = currentRef.wx * unit
    var y = currentRef.wy * unit
    var z = currentRef.wz * unit
  }
  var P = [new THREE.Vector3( x, y, z )
    , new THREE.Vector3( x + unit, y, z )
    , new THREE.Vector3( x, y + unit, z )
    , new THREE.Vector3( x + unit, y + unit, z )
    , new THREE.Vector3( x, y, z + unit )
    , new THREE.Vector3( x + unit, y, z + unit )
    , new THREE.Vector3( x, y + unit, z + unit )
    , new THREE.Vector3( x + unit, y + unit, z + unit )
    ]
    var geometry = casting.geometry;
    //    console.log( "add", x, y, z )
    var v = casting.cubes * 24*3;
    vertices[v++] = P[0].x; vertices[v++] = P[0].y; vertices[v++] = P[0].z;
    vertices[v++] = P[1].x; vertices[v++] = P[1].y; vertices[v++] = P[1].z;
    vertices[v++] = P[1].x; vertices[v++] = P[1].y; vertices[v++] = P[1].z;
    vertices[v++] = P[3].x; vertices[v++] = P[3].y; vertices[v++] = P[3].z;
    vertices[v++] = P[3].x; vertices[v++] = P[3].y; vertices[v++] = P[3].z;
    vertices[v++] = P[2].x; vertices[v++] = P[2].y; vertices[v++] = P[2].z;
    vertices[v++] = P[2].x; vertices[v++] = P[2].y; vertices[v++] = P[2].z;
    vertices[v++] = P[0].x; vertices[v++] = P[0].y; vertices[v++] = P[0].z;

    vertices[v++] = P[4].x; vertices[v++] = P[4].y; vertices[v++] = P[4].z;
    vertices[v++] = P[5].x; vertices[v++] = P[5].y; vertices[v++] = P[5].z;
    vertices[v++] = P[5].x; vertices[v++] = P[5].y; vertices[v++] = P[5].z;
    vertices[v++] = P[7].x; vertices[v++] = P[7].y; vertices[v++] = P[7].z;
    vertices[v++] = P[7].x; vertices[v++] = P[7].y; vertices[v++] = P[7].z;
    vertices[v++] = P[6].x; vertices[v++] = P[6].y; vertices[v++] = P[6].z;
    vertices[v++] = P[6].x; vertices[v++] = P[6].y; vertices[v++] = P[6].z;
    vertices[v++] = P[4].x; vertices[v++] = P[4].y; vertices[v++] = P[4].z;

    vertices[v++] = P[0].x; vertices[v++] = P[0].y; vertices[v++] = P[0].z;
    vertices[v++] = P[4].x; vertices[v++] = P[4].y; vertices[v++] = P[4].z;
    vertices[v++] = P[1].x; vertices[v++] = P[1].y; vertices[v++] = P[1].z;
    vertices[v++] = P[5].x; vertices[v++] = P[5].y; vertices[v++] = P[5].z;
    vertices[v++] = P[2].x; vertices[v++] = P[2].y; vertices[v++] = P[2].z;
    vertices[v++] = P[6].x; vertices[v++] = P[6].y; vertices[v++] = P[6].z;
    vertices[v++] = P[3].x; vertices[v++] = P[3].y; vertices[v++] = P[3].z;
    vertices[v++] = P[7].x; vertices[v++] = P[7].y; vertices[v++] = P[7].z;
    this.cubes++;
    geometry.attributes.position.needsUpdate = true
    geometry.verticesNeedUpdate = true;
}



THREE.GameMouse = function ( object, domElement ) {
    this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
    this.casting = casting;
  this.camera = null;
  var scope = this;
  this.mode = 0;
  this.voxelSelector = null;
  this.clusters = null;
  this.mouseRay = { n : THREE.Vector3Zero.clone(), o: new THREE.Vector3().delete() }
  this.mouseClock = new THREE.Clock();
  this.mouseEvents = [];
  this.currentAddType = Voxelarium.Voxels.types[2];

  var mouseButtonCount = 0;
  var mouseScrollX = 0;
  var mouseScrollY = 0;
  var cursorDistance = 650;

  this.setCurrentType = function( type ) {
      this.currentAddType = type;
  }
  this.setMouseRay = function( camera, e ) {
      //#define BEGIN_SCALE 1
      var rect = scope.domElement.getBoundingClientRect();
      const w = rect.right-rect.left;//window.innerWidth;
      const h = rect.bottom-rect.top;//window.innerHeight;
      var x = (((e.clientX-rect.left)-(w/2.0))/w) * 2;
      var y = (((e.clientY-rect.top)-(h/2.0))/h) * 2;
      //console.log( `mouse at ${x}, ${y}` )

      var mouse_ray_slope = camera.matrix.left.clone().multiplyScalar( x*camera.aspect );
      mouse_ray_slope.addScaledVector( camera.matrix.up, -(y) );

      // 0.47 is some magic number for 90 degree FOV
      //mouse_ray_slope.addScaledVector( camera.matrix.forward, -0.47 );
      // 75 degree view and like 3/4 aspect
      //mouse_ray_slope.addScaledVector( camera.matrix.forward, -0.605 );//-Math.sqrt(1 - mouse_ray_slope.length()) );
      mouse_ray_slope.addScaledVector( camera.matrix.backward, -1.304);//0.652 );//-Math.sqrt(1 - mouse_ray_slope.length()) );

      //mouse_ray_slope.unproject( camera );

      //var mouse_ray_target = THREE.Vector3Zero.clone().addScaledVector( THREE.Vector3Forward, 1000 );
      //mouse_ray_target.addScaledVector( THREE.Vector3Left,  camera.aspect*1000*x );
      //mouse_ray_target.addScaledVector( THREE.Vector3Up, -(1000)*y );

      //mouse_ray_origin.applyMatrix4( camera.matrix );
      //mouse_ray_target.applyMatrix4( camera.matrix );

      //var mouse_ray_slope = mouse_ray_target.clone().sub( mouse_ray_origin );
      //mouse_ray_slope.sub(camera.matrix.origin);
  	  mouse_ray_slope.normalize();
      //mouse_ray_origin.delete();
      scope.mouseRay.n.delete();

      scope.mouseRay.n = mouse_ray_slope;
      scope.mouseRay.o = camera.matrix.origin;
  }

  this.update = function() {
    if( !scope.clusters )
      return;
     switch( scope.mode )
     {
     case 0:
        var cluster = scope.clusters[0];
        if( mouseScrollY ) {
            cursorDistance += ( mouseScrollY / 120 ) * cluster.voxelUnitSize;
            mouseScrollY = 0;
        }
        if( scope.mouseRay ) {
            var o = scope.mouseRay.o;
            var result;
            result = rayCast( cluster, scope.mouseRay.o, scope.mouseRay.n )

            if( Voxelarium.selector.currentVoxel )
              Voxelarium.selector.currentVoxel.delete();

            if( result ) {
                Voxelarium.selector.currentAddVoxel = cluster.getVoxelRef( false, result.PredPointedVoxel.x, result.PredPointedVoxel.y, result.PredPointedVoxel.z )
              Voxelarium.selector.currentVoxel = result.ref;
          }
          /* this was another way of getting voxels... raycast is the routine for this now?
            rayCast projects a line through each plane going going out, and is more accurate than this.
            Plus rayCast can return the side of detection. */
          if( false ){

                var vox = o.clone().addScaledVector( scope.mouseRay.n, cursorDistance ).delete()

                var vrTo = Voxelarium.VoxelRef( cluster, null
                    , Math.floor(vox.x/cluster.voxelUnitSize)
                    , Math.floor(vox.y/cluster.voxelUnitSize)
                    , Math.floor(vox.z/cluster.voxelUnitSize) );
                var vrFrom = Voxelarium.VoxelRef( cluster, null
                        , Math.floor(o.x/cluster.voxelUnitSize)
                        , Math.floor(o.y/cluster.voxelUnitSize)
                        , Math.floor(o.z/cluster.voxelUnitSize) );
                //console.log( "things are ", vrTo, vrFrom )
                //this.casting.reset();
                //console.log( "---------- new set ----------- ")
                var ref = vrFrom.forEach( vrTo, false, (ref)=>{
                    //this.casting.addRef( ref );
                  //console.log( `check at `, ref.wx, ref.wy, ref.wz )
                  if( ref.voxelType && !ref.voxelType.properties.Is_PlayerCanPassThrough )
                    return ref;
                  return null;
                })
                //if( ref ) {
                //    this.casting.geometry.computeBoundingSphere();
                //    this.casting.geometry.setDrawRange( 0, (this.casting.cubes-1)*24 );
                //}
                if( ref ) {
                  Voxelarium.selector.currentVoxel = ref;
                } else {
                  Voxelarium.selector.currentVoxel = cluster.getVoxelRef( true, vox.x, vox.y, vox.z );
                }
                vrTo.delete();
                vrFrom.delete();
            }
        }

        if( scope.mouseEvents ) {
            var mEvent = scope.mouseEvents.shift();
            if( mEvent ) {
                if( mEvent.down ) {
                    if( mEvent.button === 0 ) { // left
                        var ref = Voxelarium.selector.currentAddVoxel;
                        if( ref && ref.sector ){
                            ref.sector.setCube( ref.x, ref.y, ref.z, scope.currentAddType )
                            ref.cluster.mesher.SectorUpdateFaceCulling( ref.sector, true )
                            //basicMesher.SectorUpdateFaceCulling_Partial( cluster, sector, Voxelarium.FACEDRAW_Operations.ALL, true )
                            ref.cluster.mesher.MakeSectorRenderingData( ref.sector );
                            Voxelarium.db.world.storeSector( ref.sector );
                        }

                    }
                    if( mEvent.button === 2 ) { // right
                        var ref = Voxelarium.selector.currentVoxel;
                        if( ref && ref.sector ){
                            ref.sector.setCube( ref.x, ref.y, ref.z, Voxelarium.Voxels.Void )
                            ref.cluster.mesher.SectorUpdateFaceCulling( ref.sector, true )
                            //basicMesher.SectorUpdateFaceCulling_Partial( cluster, sector, Voxelarium.FACEDRAW_Operations.ALL, true )
                            ref.cluster.mesher.MakeSectorRenderingData( ref.sector );
                            Voxelarium.db.world.storeSector( ref.sector );
                        }
                    }
                }
            }
        }

        break;
     }
      /*
      scope.object.matrix.rotateRelative( -phiDelta, thetaDelta, 0 );
      scope.object.matrix.rotateRelative( 0, 0, -scope.object.matrix.roll );
      scope.object.matrixWorldNeedsUpdate = true;
      */
  }

function mouseEvent( x, y, b, down ) {
    var ev = { x : x,
        y : y,
        button : b,
        delta : scope.mouseClock.getDelta(),
        down : down
    }

    scope.mouseEvents.push( ev );
}

var ongoingTouches = [];

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}
function onTouchDown(event) {
  event.preventDefault();
  var touches = event.changedTouches;
  for( var i = 0; i < touches.length; i++ ) {
    console.log( `touch ${i}=${touches[i]}`);
    ongoingTouches.push( copyTouch( touches[i] ) );

  }
}

function onTouchUp(event) {
  event.preventDefault();
}

function onTouchMove(event) {
  event.preventDefault();
  var touches = event.changedTouches;
  for( var i = 0; i < touches.length; i++ ) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    if( idx >= 0 ) {
      ongoingTouches.splice( idx, 1, copyTouch( touches[i] ) );
    }
  }
}

function onTouchCancel(event) {
  event.preventDefault();
}



  function onMouseDown(event) {
      if ( scope.enabled === false ) return;
      event.preventDefault();
      mouseEvent( event.clientX, event.clientY, event.button, true );
  }

  function onMouseUp(event) {
      if ( scope.enabled === false ) return;
      event.preventDefault();
      mouseEvent( event.clientX, event.clientY, event.button, false );
  }

    function onMouseMove( event ) {

    	if ( scope.enabled === false ) return;

    	event.preventDefault();

        scope.setMouseRay( camera, event );

    }

    function onMouseWheel( event ) {
        event.preventDefault();
        mouseScrollX += event.wheelDeltaX;
        mouseScrollY += event.wheelDeltaY;
    }

  function ignore(event) {
      event.preventDefault();
  }

  this.disable = function() {
    scope.domElement.removeEventListener( 'contextmenu', ignore, false );
    scope.domElement.removeEventListener( 'touchstart', onTouchDown, false );
    scope.domElement.removeEventListener( 'touchend', onTouchUp, false );
    scope.domElement.removeEventListener( 'touchcancel', onTouchCancel, false );
    scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );
    scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
    scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );
    scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
    scope.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
    scope.domElement.removeEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    //window.removeEventListener( 'keydown', onKeyDown, false );
    //window.removeEventListener( 'keyup', onKeyUp, false );
  }

  this.enable = function() {
    scope.domElement.addEventListener( 'contextmenu', ignore, false );
    scope.domElement.addEventListener( 'touchstart', onTouchDown, false );
    scope.domElement.addEventListener( 'touchend', onTouchUp, false );
    scope.domElement.addEventListener( 'touchcancel', onTouchCancel, false );
    scope.domElement.addEventListener( 'touchmove', onTouchMove, false );
    scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
    scope.domElement.addEventListener( 'mouseup', onMouseUp, false );
    scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
    scope.domElement.addEventListener( 'mousewheel', onMouseWheel, false ); // firefox
    scope.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    //window.addEventListener( 'keydown', onKeyDown, false );
    //window.addEventListener( 'keyup', onKeyUp, false );
  }
  this.enable();


}





function  rayCast(cluster, o, forward )
{
    var Out = null;
  var Delta_h = new THREE.Vector4Pool.new(),Delta_v = new THREE.Vector4Pool.new(),Delta_s = new THREE.Vector4Pool.new();
  var Offset_h = new THREE.Vector4Pool.new(), Offset_v = new THREE.Vector4Pool.new(), Offset_s = new THREE.Vector4Pool.new();
  var Norm_h = new THREE.Vector3Pool.new(), Norm_v = new THREE.Vector3Pool.new(), Norm_s = new THREE.Vector3Pool.new();
  var Collision_h = new THREE.Vector4Pool.new(), Collision_v = new THREE.Vector4Pool.new(), Collision_s = new THREE.Vector4Pool.new();

  var ActualCube_x,ActualCube_y,ActualCube_z;
  var NewCube_x,NewCube_y,NewCube_z;
  var Collide_X, Collide_Y, Collide_Z;
  var i;

  var Norm = forward;

  Collide_X = Collide_Y = Collide_Z = false;

  if (Norm.x >= 0.01 )
  {
    Collide_X = true;
    Delta_h.x = 1.0;
    Delta_h.y = Norm.y / Norm.x;
    Delta_h.z = Norm.z / Norm.x;
    Delta_h.w = 0;
    Delta_h.w = Delta_h.length();

    Collision_h.x = (Math.floor(o.x / cluster.voxelUnitSize) + 1.0)*cluster.voxelUnitSize;
    Collision_h.y = (Collision_h.x - o.x) * Delta_h.y + o.y;
    Collision_h.z = (Collision_h.x - o.x) * Delta_h.z + o.z;
    Collision_h.w = (Collision_h.x - o.x) * Delta_h.w;

    Offset_h.x = cluster.voxelUnitSize;
    Offset_h.y = Delta_h.y * cluster.voxelUnitSize;
    Offset_h.z = Delta_h.z * cluster.voxelUnitSize;
    Offset_h.w = Delta_h.w * cluster.voxelUnitSize;
    Norm_h.x = Offset_h.x/2;// / (cluster.voxelUnitSize/2);
    Norm_h.y = 0 / (cluster.voxelUnitSize/2);
    Norm_h.z = 0 / (cluster.voxelUnitSize/2);
  }
  else if (Norm.x <= -0.01)
  {
    Collide_X = true;

    Delta_h.x = 1.0;
    Delta_h.y = Norm.y / -Norm.x;
    Delta_h.z = Norm.z / -Norm.x;
    Delta_h.w = 0;
    Delta_h.w = Delta_h.length();

    Collision_h.x = (Math.floor(o.x / cluster.voxelUnitSize))*cluster.voxelUnitSize;
    Collision_h.y = (o.x - Collision_h.x) * Delta_h.y + o.y;
    Collision_h.z = (o.x - Collision_h.x) * Delta_h.z + o.z;
    Collision_h.w = (o.x - Collision_h.x) * Delta_h.w;
    Offset_h.x = -cluster.voxelUnitSize;
    Offset_h.y = Delta_h.y * cluster.voxelUnitSize;
    Offset_h.z = Delta_h.z * cluster.voxelUnitSize;
    Offset_h.w = Delta_h.w * cluster.voxelUnitSize;
    Norm_h.x = Offset_h.x/2;// / (cluster.voxelUnitSize/2);
    Norm_h.y = 0 / (cluster.voxelUnitSize/2);
    Norm_h.z = 0 / (cluster.voxelUnitSize/2);
  }

  if (Norm.y >= 0.01 )
  {
    Collide_Y = true;
    Delta_v.x = Norm.x / Norm.y;
    Delta_v.y = 1.0;
    Delta_v.z = Norm.z / Norm.y;
    Delta_v.w = 0;
    Delta_v.w = Delta_v.length();

    Collision_v.y = (Math.floor(o.y / cluster.voxelUnitSize)+1) * cluster.voxelUnitSize;
    var dely = (Collision_v.y - o.y);
    Collision_v.x = dely * Delta_v.x + o.x;
    Collision_v.z = dely * Delta_v.z + o.z;
    Collision_v.w = dely * Delta_v.w;
    Offset_v.y = cluster.voxelUnitSize;
    Offset_v.x = Delta_v.x * cluster.voxelUnitSize;
    Offset_v.z = Delta_v.z * cluster.voxelUnitSize;
    Offset_v.w = Delta_v.w * cluster.voxelUnitSize;
    Norm_v.x = 0 / (cluster.voxelUnitSize/2);
    Norm_v.y = Offset_v.y/2;// / (cluster.voxelUnitSize/2);
    Norm_v.z = 0 / (cluster.voxelUnitSize/2);
  }
  else if (Norm.y <= -0.01)
  {
    Collide_Y = true;
    Delta_v.x = Norm.x / -Norm.y;
    Delta_v.y = 1.0;
    Delta_v.z = Norm.z / -Norm.y;
    Delta_v.w = 0;
    Delta_v.w = Delta_v.length();

    Collision_v.y = (Math.floor(o.y / cluster.voxelUnitSize)) * cluster.voxelUnitSize;
    var dely = (o.y-Collision_v.y );
    Collision_v.x = (dely) * Delta_v.x + o.x;
    Collision_v.z = (dely) * Delta_v.z + o.z;
    Collision_v.w = (dely) * Delta_v.w;

    Offset_v.y = -cluster.voxelUnitSize;
    Offset_v.x = Delta_v.x * cluster.voxelUnitSize;
    Offset_v.z = Delta_v.z * cluster.voxelUnitSize;
    Offset_v.w = Delta_v.w * cluster.voxelUnitSize;
    Norm_v.x = 0 / (cluster.voxelUnitSize/2);
    Norm_v.y = Offset_v.y/2;// / (cluster.voxelUnitSize/2);
    Norm_v.z = 0 / (cluster.voxelUnitSize/2);
  }

  if (Norm.z >= 0.01)
  {
    Collide_Z = true;
    Delta_s.x = Norm.x / Norm.z;
    Delta_s.y = Norm.y / Norm.z;
    Delta_s.z = 1.0;
    Delta_s.w = 0;
    Delta_s.w = Delta_s.length();
    Collision_s.z = (Math.floor(o.z / cluster.voxelUnitSize) + 1.0)*cluster.voxelUnitSize;
    Collision_s.x = (Collision_s.z - o.z) * Delta_s.x + o.x;
    Collision_s.y = (Collision_s.z - o.z) * Delta_s.y + o.y;
    Collision_s.w = (Collision_s.z - o.z) * Delta_s.w;

    Offset_s.x = Delta_s.x * cluster.voxelUnitSize;
    Offset_s.y = Delta_s.y * cluster.voxelUnitSize;
    Offset_s.z = cluster.voxelUnitSize;
    Offset_s.w = Delta_s.w * cluster.voxelUnitSize;
    Norm_s.x = 0 / (cluster.voxelUnitSize/2);
    Norm_s.y = 0 / (cluster.voxelUnitSize/2);
    Norm_s.z = Offset_s.z/2;// / (cluster.voxelUnitSize/2);
  }
  else if (Norm.z <= -0.01)
  {
    Collide_Z = true;
    Delta_s.x = Norm.x / -Norm.z;
    Delta_s.y = Norm.y / -Norm.z;
    Delta_s.z = 1.0;
    Delta_s.w = 0;
    Delta_s.w = Delta_s.length();
    Collision_s.z = (Math.floor(o.z / cluster.voxelUnitSize) )*cluster.voxelUnitSize;
    Collision_s.x = (o.z - Collision_s.z) * Delta_s.x + o.x;
    Collision_s.y = (o.z - Collision_s.z) * Delta_s.y + o.y;
    Collision_s.w = (o.z - Collision_s.z) * Delta_s.w;

    Offset_s.x = Delta_s.x * cluster.voxelUnitSize;
    Offset_s.y = Delta_s.y * cluster.voxelUnitSize;
    Offset_s.z = - cluster.voxelUnitSize;
    Offset_s.w = Delta_s.w * cluster.voxelUnitSize;

    Norm_s.x = 0 / (cluster.voxelUnitSize/2);
    Norm_s.y = 0 / (cluster.voxelUnitSize/2);
    Norm_s.z = Offset_s.z/2;// / (cluster.voxelUnitSize/2);
  }



//  printf("yaw: %04lf pitch: %lf Offset_y:%lf Offset_z:%lf xyz:%lf %lf %lf NXYZ:%lf %lf %lf Dxyz:%lf %lf %lf", yaw,pitch, Delta_h.y, Delta_h.z,x,y,z, Norm_h.x, Norm_h.y, Norm_h.z, Delta_h.x, Delta_h.y, Delta_h.z);
 //printf("Angle (y:%lf p:%lf) XYZ:(%lf %lf %lf) Off(%lf %lf %lf %lf) Coll(%lf %lf %lf %lf) Norm(%lg %lg %lf) :\n", yaw,pitch,x,y,z, Offset_s.x, Offset_s.y, Offset_s.z, Offset_s.w, Collision_s.x, Collision_s.y, Collision_s.z, Collision_s.w, Norm_s.x,Norm_s.y, Norm_s.z);

  var Match_h = 0;
  var Match_s = 0;
  var Match_v = 0;
  var Cycle = 1;
  var MinW = 1000000.0;
  var ref;
  //console.log( '-------------------------');
  for (i=0;i<150;i++)
  {

    // Horizontal X axis.
    if (Collide_X)
    {
      if (Match_h==0 && Collision_h.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_h.x - Norm_h.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_h.y - Norm_h.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_h.z - Norm_h.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_h.x + Norm_h.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_h.y + Norm_h.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_h.z + Norm_h.z) / cluster.voxelUnitSize);
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough)
        {
            //console.log( `x check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}    ${ActualCube_x} ${ActualCube_y} ${ActualCube_z}  ${MinW}  ${Collision_h.w}`)
            Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                    PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                    ref : ref
                    };
          // printf(" MATCH_H: %lf\n",Collision_h.w);
          Match_h = Cycle;
          MinW = Collision_h.w;
        } else if( ref ) ref.delete();
      }
    }

    // Horizontal Z axis.

    if (Collide_Z)
    {
      if (Match_s == 0 && Collision_s.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_s.x - Norm_s.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_s.y - Norm_s.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_s.z - Norm_s.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_s.x + Norm_s.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_s.y + Norm_s.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_s.z + Norm_s.z) / cluster.voxelUnitSize);
        //console.log( `z check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_s.w} `)
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough)
        {
            //console.log( `z check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_s.w} `)
          Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                  PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                  ref : ref
                   };
          // printf(" MATCH_S: %lf\n",Collision_s.w);
          Match_s = Cycle;
          MinW = Collision_s.w;
        } else if( ref ) ref.delete();
      }
    }

    // Vertical Y axis.

    if (Collide_Y)
    {
      if (Match_v==0 && Collision_v.w < MinW)
      {
        ActualCube_x = Math.floor((Collision_v.x - Norm_v.x) / cluster.voxelUnitSize);
        ActualCube_y = Math.floor((Collision_v.y - Norm_v.y) / cluster.voxelUnitSize);
        ActualCube_z = Math.floor((Collision_v.z - Norm_v.z) / cluster.voxelUnitSize);
        NewCube_x = Math.floor((Collision_v.x + Norm_v.x) / cluster.voxelUnitSize);
        NewCube_y = Math.floor((Collision_v.y + Norm_v.y) / cluster.voxelUnitSize);
        NewCube_z = Math.floor((Collision_v.z + Norm_v.z) / cluster.voxelUnitSize);
        if( ( ref = cluster.getVoxelRef( false, NewCube_x, NewCube_y, NewCube_z) ) && ref.sector && !ref.voxelType.properties.Is_PlayerCanPassThrough )
        {
            //console.log( `y check ${NewCube_x}  ${NewCube_y}  ${NewCube_z}  ${MinW}  ${Collision_v.w} `)
          Out = { PredPointedVoxel : new THREE.Vector3( ActualCube_x, ActualCube_y, ActualCube_z ),
                  PointedVoxel : new THREE.Vector3( NewCube_x, NewCube_y, NewCube_z ),
                  ref : ref
                   };
          // printf(" MATCH_V: %lf\n",Collision_v.w);
          Match_v = Cycle;
          MinW = Collision_v.w;
        } else if( ref ) ref.delete();
      }
    }

      //printf(" Match (H:%lf S:%lf V:%lf) \n", Collision_h.w, Collision_s.w, Collision_v.w);
      if (Match_h>0 && (Match_h - Cycle)<-100) return Out;
      if (Match_s>0 && (Match_s - Cycle)<-100) return Out;
      if (Match_v>0 && (Match_v - Cycle)<-100) return Out;

    Collision_h.x += Offset_h.x; Collision_h.y += Offset_h.y; Collision_h.z += Offset_h.z; Collision_h.w += Offset_h.w;
    Collision_v.x += Offset_v.x; Collision_v.y += Offset_v.y; Collision_v.z += Offset_v.z; Collision_v.w += Offset_v.w;
    Collision_s.x += Offset_s.x; Collision_s.y += Offset_s.y; Collision_s.z += Offset_s.z; Collision_s.w += Offset_s.w;
    Cycle ++;
  }
  Delta_h.delete();
  Delta_v.delete();
  Delta_s.delete();
  Offset_h.delete();
  Offset_v.delete();
  Offset_s.delete();
  Norm_h.delete();
  Norm_v.delete();
  Norm_s.delete();
  Collision_h.delete();
  Collision_v.delete();
  Collision_s.delete();

  return Out;
}

},{}],3:[function(require,module,exports){


glow = {

 glowcomposer : null,
 scenecomposer : null,
 finalcomposer : null,

 renderTargetGlow : null,
	renderTarget : null,
        render : null,
    };


var glowcomposer;
var scenecomposer;
var finalcomposer;

var renderTargetGlow;
var	renderTarget;

var finalshader = {
    uniforms: {
        tDiffuse: { type: "t", value: 0, texture: null }, // The base scene buffer
        tGlow: { type: "t", value: 1, texture: null }, // The glow scene buffer
		tDiffuseDepth: { type: "t", value: 0, texture: null }, // The base scene buffer
        tGlowDepth: { type: "t", value: 1, texture: null }, // The glow scene buffer
		cameraNear: { type: 'f', value: 1 },
		cameraFar: { type: 'f', value: 10000 },
    },

    vertexShader: [
        "varying vec2 vUv;",

        "void main() {",

            "vUv = vec2( uv.x, uv.y );",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

        "}"
    ].join(""),

    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform sampler2D tGlow;",
		"uniform sampler2D tDiffuseDepth;",
		"uniform sampler2D tGlowDepth;",
		"uniform float cameraNear;",
 		"uniform float cameraFar;",

        "varying vec2 vUv;",

		"float readDepth (sampler2D depthSampler, vec2 coord) {",
        "  float cameraFarPlusNear = cameraFar + cameraNear;",
        "  float cameraFarMinusNear = cameraFar - cameraNear;",
        "  float cameraCoef = 2.0 * cameraNear;",
        "  return 1.0-(cameraCoef / (cameraFarPlusNear - texture2D(depthSampler, coord).x * cameraFarMinusNear));",
        "}",

        "void main() {",

            "vec4 texel = texture2D( tDiffuse, vUv );",
            "vec4 glow = texture2D( tGlow, vUv );",
			"float texelDepth = readDepth( tDiffuseDepth, vUv );",
			"float glowDepth = readDepth( tGlowDepth, vUv );",
			//"float texelDepth = texture2D(tDiffuseDepth, vUv).x;",
            //"if( (texel.r+texel.g+texel.b)== 0.0 ) ",
			"    gl_FragColor = (texel + vec4(0.5, 0.75, 1.0, 3.0) * glow * 1.0);", // Blend the two buffers together (I colorized and intensified the glow at the same time)
			//"    gl_FragColor +=  vec4(texelDepth, glowDepth, 0, 1.0);", // Blend the two buffers together (I colorized and intensified the glow at the same time)
			//"else gl_FragColor = texel;",
			//"gl_FragColor = texel;",

        "}"
    ].join("")
};

var preGlow;
var preFlat;
var overlay;
var scene;

glow.makeComposers =
function makeComposers( renderer, sceneFlat, preFlatSetup, sceneGlow, preGlowSetup, sceneOver ) {
  scene = sceneFlat;
  glow.renderer = renderer;
	renderer.autoClear = false;

  if( !Voxelarium.Settings.use_basic_material ) {

    overlay = sceneOver;
    preGlow = preGlowSetup;
    preFlat = preFlatSetup;
	// Prepare the glow composer's render target
	var renderTargetParameters = { minFilter: THREE.LinearFilter
			, magFilter: THREE.LinearFilter
			//, format: THREE.RGBFormat
			, stencilBufer: false };
	if( !renderTargetGlow ){
	  renderTargetGlow = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight/*, renderTargetParameters*/ );
	  renderTargetGlow.texture.minFilter = THREE.LinearFilter;
	  renderTargetGlow.texture.magFilter = THREE.LinearFilter;
	  renderTargetGlow.texture.stencilBufer = false;
	  renderTargetGlow.depthTexture = new THREE.DepthTexture( );
		//renderTargetGlow.depthTexture.type = isWebGL2 ? THREE.FloatType : THREE.UnsignedShortType;
	}
	// Prepare the blur shader passes
	var hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
	var vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );

	var bluriness = 1;

	hblur.uniforms[ "h" ].value = bluriness / window.innerWidth;
	//hblur.material.depthTest = false;
	//hblur.material.depthWrite = false;

	vblur.uniforms[ "v" ].value = bluriness / window.innerHeight;
	//vblur.material.depthTest = false;
	//vblur.material.depthWrite = false;

	// Prepare the glow scene render pass
	var renderModelGlow = new THREE.RenderPass( sceneGlow, camera);

	// Create the glow composer
	glowcomposer = new THREE.EffectComposer( renderer, renderTargetGlow );

	// Add all the glow passes
	glowcomposer.addPass( renderModelGlow );
	glowcomposer.addPass( hblur );
	glowcomposer.addPass( vblur );


	// Prepare the base scene render pass
	var renderModel = new THREE.RenderPass( sceneFlat, camera );
	var renderModel2 = new THREE.RenderPass( sceneGlow, camera );
    //var renderModel3 = new THREE.RenderPass( sceneOver, camera );
	renderModel.clear = true;
	renderModel2.clear = false;
    //renderModel3.clear = false;


	// Prepare the composer's render target
	if( !renderTarget ) {
		renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight/*, renderTargetParameters*/ );
		renderTargetGlow.texture.minFilter = THREE.LinearFilter;
		renderTargetGlow.texture.magFilter = THREE.LinearFilter;
		renderTargetGlow.texture.stencilBufer = false;
		renderTarget.depthTexture = new THREE.DepthTexture();
		//renderTarget.depthTexture.type = isWebGL2 ? THREE.FloatType : THREE.UnsignedShortType;
		//renderTarget.depthTexture.type = THREE.FloatType ;//: THREE.UnsignedShortType;
	}
	// Create the composer
//	scenecomposer = new THREE.EffectComposer( renderer, renderTarget );

	// First we need to assign the glow composer's output render target to the tGlow sampler2D of our shader
	// Old Three.js pre-r50
	//finalshader.uniforms[ "tGlow" ].texture = glowcomposer.renderTarget2;
	// New Three.js
	finalshader.uniforms[ "tGlow" ].value = glowcomposer.renderTarget2;
	finalshader.uniforms[ "tGlowDepth" ].value = renderTargetGlow.depthTexture;
	finalshader.uniforms[ "tDiffuseDepth" ].value = renderTarget.depthTexture;
	finalshader.uniforms[ "cameraNear"].value = camera.near;
	finalshader.uniforms[ "cameraFar"].value = camera.far;

	//finalshader.uniforms[ "tDiffuse" ].value = scenecomposer.renderTarget2;
	// Note that the tDiffuse sampler2D will be automatically filled by the EffectComposer

	// Prepare the additive blending pass
	var finalPass = new THREE.ShaderPass( finalshader );
    //finalPass.
	finalPass.needsSwap = false;
	// Make sure the additive blending is rendered to the screen (since it's the last pass)
	finalPass.renderToScreen = true;
    //renderModel3.renderToScreen = true;

	// Create the composer
	finalcomposer = new THREE.EffectComposer( renderer, renderTarget );

	// Add all passes
	finalcomposer.addPass( renderModel );
	finalcomposer.addPass( renderModel2 );
	finalcomposer.addPass( finalPass );
}
    //finalcomposer.addPass( renderModel3 );
}



//exports.render =
glow.render = function glowRender() {
  if( !Voxelarium.Settings.use_basic_material ) {
    preGlow();
    glowcomposer.render();

    preFlat();
	//scenecomposer.render();

	finalshader.uniforms[ "tGlow" ].value = glowcomposer.renderTarget2;
	finalshader.uniforms[ "tGlowDepth" ].value = renderTargetGlow.depthTexture.texture;
	finalshader.uniforms[ "tDiffuseDepth" ].value = renderTarget.depthTexture.texture;
	finalshader.uniforms[ "cameraNear"].value = camera.near;
	finalshader.uniforms[ "cameraFar"].value = camera.far;


    finalcomposer.render();
	   if( overlay )
	     glow.renderer.render( overlay, camera );
  }
  else {
    glow.renderer.render( scene, camera );
    if( overlay )
  	     glow.renderer.render( overlay, camera );

  }
  if( Voxelarium.Settings.VR )
	  effect.submitFrame();

}

},{}],4:[function(require,module,exports){
if (global.GENTLY) require = GENTLY.hijack(require);

var util = require('util'),
    WriteStream = require('fs').WriteStream,
    EventEmitter = require('events').EventEmitter,
    crypto = require('crypto');

function File(properties) {
  EventEmitter.call(this);

  this.size = 0;
  this.path = null;
  this.name = null;
  this.type = null;
  this.hash = null;
  this.lastModifiedDate = null;

  this._writeStream = null;
  
  for (var key in properties) {
    this[key] = properties[key];
  }

  if(typeof this.hash === 'string') {
    this.hash = crypto.createHash(properties.hash);
  } else {
    this.hash = null;
  }
}
module.exports = File;
util.inherits(File, EventEmitter);

File.prototype.open = function() {
  this._writeStream = new WriteStream(this.path);
};

File.prototype.toJSON = function() {
  return {
    size: this.size,
    path: this.path,
    name: this.name,
    type: this.type,
    mtime: this.lastModifiedDate,
    length: this.length,
    filename: this.filename,
    mime: this.mime
  };
};

File.prototype.write = function(buffer, cb) {
  var self = this;
  if (self.hash) {
    self.hash.update(buffer);
  }
  this._writeStream.write(buffer, function() {
    self.lastModifiedDate = new Date();
    self.size += buffer.length;
    self.emit('progress', self.size);
    cb();
  });
};

File.prototype.end = function(cb) {
  var self = this;
  if (self.hash) {
    self.hash = self.hash.digest('hex');
  }
  this._writeStream.end(function() {
    self.emit('end');
    cb();
  });
};

},{"crypto":undefined,"events":undefined,"fs":undefined,"util":undefined}],5:[function(require,module,exports){
if (global.GENTLY) require = GENTLY.hijack(require);

var crypto = require('crypto');
var fs = require('fs');
var util = require('util'),
    path = require('path'),
    File = require('./file'),
    MultipartParser = require('./multipart_parser').MultipartParser,
    QuerystringParser = require('./querystring_parser').QuerystringParser,
    OctetParser       = require('./octet_parser').OctetParser,
    JSONParser = require('./json_parser').JSONParser,
    StringDecoder = require('string_decoder').StringDecoder,
    EventEmitter = require('events').EventEmitter,
    Stream = require('stream').Stream,
    os = require('os');

function IncomingForm(opts) {
  if (!(this instanceof IncomingForm)) return new IncomingForm(opts);
  EventEmitter.call(this);

  opts=opts||{};

  this.error = null;
  this.ended = false;

  this.maxFields = opts.maxFields || 1000;
  this.maxFieldsSize = opts.maxFieldsSize || 2 * 1024 * 1024;
  this.keepExtensions = opts.keepExtensions || false;
  this.uploadDir = opts.uploadDir || os.tmpDir();
  this.encoding = opts.encoding || 'utf-8';
  this.headers = null;
  this.type = null;
  this.hash = opts.hash || false;
  this.multiples = opts.multiples || false;

  this.bytesReceived = null;
  this.bytesExpected = null;

  this._parser = null;
  this._flushing = 0;
  this._fieldsSize = 0;
  this.openedFiles = [];

  return this;
}
util.inherits(IncomingForm, EventEmitter);
exports.IncomingForm = IncomingForm;

IncomingForm.prototype.parse = function(req, cb) {
  this.pause = function() {
    try {
      req.pause();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
    }
    return true;
  };

  this.resume = function() {
    try {
      req.resume();
    } catch (err) {
      // the stream was destroyed
      if (!this.ended) {
        // before it was completed, crash & burn
        this._error(err);
      }
      return false;
    }

    return true;
  };

  // Setup callback first, so we don't miss anything from data events emitted
  // immediately.
  if (cb) {
    var fields = {}, files = {};
    this
      .on('field', function(name, value) {
        fields[name] = value;
      })
      .on('file', function(name, file) {
        if (this.multiples) {
          if (files[name]) {
            if (!Array.isArray(files[name])) {
              files[name] = [files[name]];
            }
            files[name].push(file);
          } else {
            files[name] = file;
          }
        } else {
          files[name] = file;
        }
      })
      .on('error', function(err) {
        cb(err, fields, files);
      })
      .on('end', function() {
        cb(null, fields, files);
      });
  }

  // Parse headers and setup the parser, ready to start listening for data.
  this.writeHeaders(req.headers);

  // Start listening for data.
  var self = this;
  req
    .on('error', function(err) {
      self._error(err);
    })
    .on('aborted', function() {
      self.emit('aborted');
      self._error(new Error('Request aborted'));
    })
    .on('data', function(buffer) {
      self.write(buffer);
    })
    .on('end', function() {
      if (self.error) {
        return;
      }

      var err = self._parser.end();
      if (err) {
        self._error(err);
      }
    });

  return this;
};

IncomingForm.prototype.writeHeaders = function(headers) {
  this.headers = headers;
  this._parseContentLength();
  this._parseContentType();
};

IncomingForm.prototype.write = function(buffer) {
  if (this.error) {
    return;
  }
  if (!this._parser) {
    this._error(new Error('uninitialized parser'));
    return;
  }

  this.bytesReceived += buffer.length;
  this.emit('progress', this.bytesReceived, this.bytesExpected);

  var bytesParsed = this._parser.write(buffer);
  if (bytesParsed !== buffer.length) {
    this._error(new Error('parser error, '+bytesParsed+' of '+buffer.length+' bytes parsed'));
  }

  return bytesParsed;
};

IncomingForm.prototype.pause = function() {
  // this does nothing, unless overwritten in IncomingForm.parse
  return false;
};

IncomingForm.prototype.resume = function() {
  // this does nothing, unless overwritten in IncomingForm.parse
  return false;
};

IncomingForm.prototype.onPart = function(part) {
  // this method can be overwritten by the user
  this.handlePart(part);
};

IncomingForm.prototype.handlePart = function(part) {
  var self = this;

  if (part.filename === undefined) {
    var value = ''
      , decoder = new StringDecoder(this.encoding);

    part.on('data', function(buffer) {
      self._fieldsSize += buffer.length;
      if (self._fieldsSize > self.maxFieldsSize) {
        self._error(new Error('maxFieldsSize exceeded, received '+self._fieldsSize+' bytes of field data'));
        return;
      }
      value += decoder.write(buffer);
    });

    part.on('end', function() {
      self.emit('field', part.name, value);
    });
    return;
  }

  this._flushing++;

  var file = new File({
    path: this._uploadPath(part.filename),
    name: part.filename,
    type: part.mime,
    hash: self.hash
  });

  this.emit('fileBegin', part.name, file);

  file.open();
  this.openedFiles.push(file);

  part.on('data', function(buffer) {
    if (buffer.length == 0) {
      return;
    }
    self.pause();
    file.write(buffer, function() {
      self.resume();
    });
  });

  part.on('end', function() {
    file.end(function() {
      self._flushing--;
      self.emit('file', part.name, file);
      self._maybeEnd();
    });
  });
};

function dummyParser(self) {
  return {
    end: function () {
      self.ended = true;
      self._maybeEnd();
      return null;
    }
  };
}

IncomingForm.prototype._parseContentType = function() {
  if (this.bytesExpected === 0) {
    this._parser = dummyParser(this);
    return;
  }

  if (!this.headers['content-type']) {
    this._error(new Error('bad content-type header, no content-type'));
    return;
  }

  if (this.headers['content-type'].match(/octet-stream/i)) {
    this._initOctetStream();
    return;
  }

  if (this.headers['content-type'].match(/urlencoded/i)) {
    this._initUrlencoded();
    return;
  }

  if (this.headers['content-type'].match(/multipart/i)) {
    var m = this.headers['content-type'].match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (m) {
      this._initMultipart(m[1] || m[2]);
    } else {
      this._error(new Error('bad content-type header, no multipart boundary'));
    }
    return;
  }

  if (this.headers['content-type'].match(/json/i)) {
    this._initJSONencoded();
    return;
  }

  this._error(new Error('bad content-type header, unknown content-type: '+this.headers['content-type']));
};

IncomingForm.prototype._error = function(err) {
  if (this.error || this.ended) {
    return;
  }

  this.error = err;
  this.emit('error', err);

  if (Array.isArray(this.openedFiles)) {
    this.openedFiles.forEach(function(file) {
      file._writeStream.destroy();
      setTimeout(fs.unlink, 0, file.path, function(error) { });
    });
  }
};

IncomingForm.prototype._parseContentLength = function() {
  this.bytesReceived = 0;
  if (this.headers['content-length']) {
    this.bytesExpected = parseInt(this.headers['content-length'], 10);
  } else if (this.headers['transfer-encoding'] === undefined) {
    this.bytesExpected = 0;
  }

  if (this.bytesExpected !== null) {
    this.emit('progress', this.bytesReceived, this.bytesExpected);
  }
};

IncomingForm.prototype._newParser = function() {
  return new MultipartParser();
};

IncomingForm.prototype._initMultipart = function(boundary) {
  this.type = 'multipart';

  var parser = new MultipartParser(),
      self = this,
      headerField,
      headerValue,
      part;

  parser.initWithBoundary(boundary);

  parser.onPartBegin = function() {
    part = new Stream();
    part.readable = true;
    part.headers = {};
    part.name = null;
    part.filename = null;
    part.mime = null;

    part.transferEncoding = 'binary';
    part.transferBuffer = '';

    headerField = '';
    headerValue = '';
  };

  parser.onHeaderField = function(b, start, end) {
    headerField += b.toString(self.encoding, start, end);
  };

  parser.onHeaderValue = function(b, start, end) {
    headerValue += b.toString(self.encoding, start, end);
  };

  parser.onHeaderEnd = function() {
    headerField = headerField.toLowerCase();
    part.headers[headerField] = headerValue;

    var m = headerValue.match(/\bname="([^"]+)"/i);
    if (headerField == 'content-disposition') {
      if (m) {
        part.name = m[1];
      }

      part.filename = self._fileName(headerValue);
    } else if (headerField == 'content-type') {
      part.mime = headerValue;
    } else if (headerField == 'content-transfer-encoding') {
      part.transferEncoding = headerValue.toLowerCase();
    }

    headerField = '';
    headerValue = '';
  };

  parser.onHeadersEnd = function() {
    switch(part.transferEncoding){
      case 'binary':
      case '7bit':
      case '8bit':
      parser.onPartData = function(b, start, end) {
        part.emit('data', b.slice(start, end));
      };

      parser.onPartEnd = function() {
        part.emit('end');
      };
      break;

      case 'base64':
      parser.onPartData = function(b, start, end) {
        part.transferBuffer += b.slice(start, end).toString('ascii');

        /*
        four bytes (chars) in base64 converts to three bytes in binary
        encoding. So we should always work with a number of bytes that
        can be divided by 4, it will result in a number of buytes that
        can be divided vy 3.
        */
        var offset = parseInt(part.transferBuffer.length / 4, 10) * 4;
        part.emit('data', new Buffer(part.transferBuffer.substring(0, offset), 'base64'));
        part.transferBuffer = part.transferBuffer.substring(offset);
      };

      parser.onPartEnd = function() {
        part.emit('data', new Buffer(part.transferBuffer, 'base64'));
        part.emit('end');
      };
      break;

      default:
      return self._error(new Error('unknown transfer-encoding'));
    }

    self.onPart(part);
  };


  parser.onEnd = function() {
    self.ended = true;
    self._maybeEnd();
  };

  this._parser = parser;
};

IncomingForm.prototype._fileName = function(headerValue) {
  var m = headerValue.match(/\bfilename="(.*?)"($|; )/i);
  if (!m) return;

  var filename = m[1].substr(m[1].lastIndexOf('\\') + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#([\d]{4});/g, function(m, code) {
    return String.fromCharCode(code);
  });
  return filename;
};

IncomingForm.prototype._initUrlencoded = function() {
  this.type = 'urlencoded';

  var parser = new QuerystringParser(this.maxFields)
    , self = this;

  parser.onField = function(key, val) {
    self.emit('field', key, val);
  };

  parser.onEnd = function() {
    self.ended = true;
    self._maybeEnd();
  };

  this._parser = parser;
};

IncomingForm.prototype._initOctetStream = function() {
  this.type = 'octet-stream';
  var filename = this.headers['x-file-name'];
  var mime = this.headers['content-type'];

  var file = new File({
    path: this._uploadPath(filename),
    name: filename,
    type: mime
  });

  this.emit('fileBegin', filename, file);
  file.open();

  this._flushing++;

  var self = this;

  self._parser = new OctetParser();

  //Keep track of writes that haven't finished so we don't emit the file before it's done being written
  var outstandingWrites = 0;

  self._parser.on('data', function(buffer){
    self.pause();
    outstandingWrites++;

    file.write(buffer, function() {
      outstandingWrites--;
      self.resume();

      if(self.ended){
        self._parser.emit('doneWritingFile');
      }
    });
  });

  self._parser.on('end', function(){
    self._flushing--;
    self.ended = true;

    var done = function(){
      file.end(function() {
        self.emit('file', 'file', file);
        self._maybeEnd();
      });
    };

    if(outstandingWrites === 0){
      done();
    } else {
      self._parser.once('doneWritingFile', done);
    }
  });
};

IncomingForm.prototype._initJSONencoded = function() {
  this.type = 'json';

  var parser = new JSONParser()
    , self = this;

  if (this.bytesExpected) {
    parser.initWithLength(this.bytesExpected);
  }

  parser.onField = function(key, val) {
    self.emit('field', key, val);
  };

  parser.onEnd = function() {
    self.ended = true;
    self._maybeEnd();
  };

  this._parser = parser;
};

IncomingForm.prototype._uploadPath = function(filename) {
  var name = 'upload_';
  var buf = crypto.randomBytes(16);
  for (var i = 0; i < buf.length; ++i) {
    name += ('0' + buf[i].toString(16)).slice(-2);
  }

  if (this.keepExtensions) {
    var ext = path.extname(filename);
    ext     = ext.replace(/(\.[a-z0-9]+).*/i, '$1');

    name += ext;
  }

  return path.join(this.uploadDir, name);
};

IncomingForm.prototype._maybeEnd = function() {
  if (!this.ended || this._flushing || this.error) {
    return;
  }

  this.emit('end');
};


},{"./file":4,"./json_parser":7,"./multipart_parser":8,"./octet_parser":9,"./querystring_parser":10,"crypto":undefined,"events":undefined,"fs":undefined,"os":undefined,"path":undefined,"stream":undefined,"string_decoder":undefined,"util":undefined}],6:[function(require,module,exports){
var IncomingForm = require('./incoming_form').IncomingForm;
IncomingForm.IncomingForm = IncomingForm;
module.exports = IncomingForm;

},{"./incoming_form":5}],7:[function(require,module,exports){
if (global.GENTLY) require = GENTLY.hijack(require);

var Buffer = require('buffer').Buffer;

function JSONParser() {
  this.data = new Buffer('');
  this.bytesWritten = 0;
}
exports.JSONParser = JSONParser;

JSONParser.prototype.initWithLength = function(length) {
  this.data = new Buffer(length);
};

JSONParser.prototype.write = function(buffer) {
  if (this.data.length >= this.bytesWritten + buffer.length) {
    buffer.copy(this.data, this.bytesWritten);
  } else {
    this.data = Buffer.concat([this.data, buffer]);
  }
  this.bytesWritten += buffer.length;
  return buffer.length;
};

JSONParser.prototype.end = function() {
  try {
    var fields = JSON.parse(this.data.toString('utf8'));
    for (var field in fields) {
      this.onField(field, fields[field]);
    }
  } catch (e) {}
  this.data = null;

  this.onEnd();
};

},{"buffer":undefined}],8:[function(require,module,exports){
var Buffer = require('buffer').Buffer,
    s = 0,
    S =
    { PARSER_UNINITIALIZED: s++,
      START: s++,
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      PART_END: s++,
      END: s++
    },

    f = 1,
    F =
    { PART_BOUNDARY: f,
      LAST_BOUNDARY: f *= 2
    },

    LF = 10,
    CR = 13,
    SPACE = 32,
    HYPHEN = 45,
    COLON = 58,
    A = 97,
    Z = 122,

    lower = function(c) {
      return c | 0x20;
    };

for (s in S) {
  exports[s] = S[s];
}

function MultipartParser() {
  this.boundary = null;
  this.boundaryChars = null;
  this.lookbehind = null;
  this.state = S.PARSER_UNINITIALIZED;

  this.index = null;
  this.flags = 0;
}
exports.MultipartParser = MultipartParser;

MultipartParser.stateToString = function(stateNumber) {
  for (var state in S) {
    var number = S[state];
    if (number === stateNumber) return state;
  }
};

MultipartParser.prototype.initWithBoundary = function(str) {
  this.boundary = new Buffer(str.length+4);
  this.boundary.write('\r\n--', 0);
  this.boundary.write(str, 4);
  this.lookbehind = new Buffer(this.boundary.length+8);
  this.state = S.START;

  this.boundaryChars = {};
  for (var i = 0; i < this.boundary.length; i++) {
    this.boundaryChars[this.boundary[i]] = true;
  }
};

MultipartParser.prototype.write = function(buffer) {
  var self = this,
      i = 0,
      len = buffer.length,
      prevIndex = this.index,
      index = this.index,
      state = this.state,
      flags = this.flags,
      lookbehind = this.lookbehind,
      boundary = this.boundary,
      boundaryChars = this.boundaryChars,
      boundaryLength = this.boundary.length,
      boundaryEnd = boundaryLength - 1,
      bufferLength = buffer.length,
      c,
      cl,

      mark = function(name) {
        self[name+'Mark'] = i;
      },
      clear = function(name) {
        delete self[name+'Mark'];
      },
      callback = function(name, buffer, start, end) {
        if (start !== undefined && start === end) {
          return;
        }

        var callbackSymbol = 'on'+name.substr(0, 1).toUpperCase()+name.substr(1);
        if (callbackSymbol in self) {
          self[callbackSymbol](buffer, start, end);
        }
      },
      dataCallback = function(name, clear) {
        var markSymbol = name+'Mark';
        if (!(markSymbol in self)) {
          return;
        }

        if (!clear) {
          callback(name, buffer, self[markSymbol], buffer.length);
          self[markSymbol] = 0;
        } else {
          callback(name, buffer, self[markSymbol], i);
          delete self[markSymbol];
        }
      };

  for (i = 0; i < len; i++) {
    c = buffer[i];
    switch (state) {
      case S.PARSER_UNINITIALIZED:
        return i;
      case S.START:
        index = 0;
        state = S.START_BOUNDARY;
      case S.START_BOUNDARY:
        if (index == boundary.length - 2) {
          if (c == HYPHEN) {
            flags |= F.LAST_BOUNDARY;
          } else if (c != CR) {
            return i;
          }
          index++;
          break;
        } else if (index - 1 == boundary.length - 2) {
          if (flags & F.LAST_BOUNDARY && c == HYPHEN){
            callback('end');
            state = S.END;
            flags = 0;
          } else if (!(flags & F.LAST_BOUNDARY) && c == LF) {
            index = 0;
            callback('partBegin');
            state = S.HEADER_FIELD_START;
          } else {
            return i;
          }
          break;
        }

        if (c != boundary[index+2]) {
          index = -2;
        }
        if (c == boundary[index+2]) {
          index++;
        }
        break;
      case S.HEADER_FIELD_START:
        state = S.HEADER_FIELD;
        mark('headerField');
        index = 0;
      case S.HEADER_FIELD:
        if (c == CR) {
          clear('headerField');
          state = S.HEADERS_ALMOST_DONE;
          break;
        }

        index++;
        if (c == HYPHEN) {
          break;
        }

        if (c == COLON) {
          if (index == 1) {
            // empty header field
            return i;
          }
          dataCallback('headerField', true);
          state = S.HEADER_VALUE_START;
          break;
        }

        cl = lower(c);
        if (cl < A || cl > Z) {
          return i;
        }
        break;
      case S.HEADER_VALUE_START:
        if (c == SPACE) {
          break;
        }

        mark('headerValue');
        state = S.HEADER_VALUE;
      case S.HEADER_VALUE:
        if (c == CR) {
          dataCallback('headerValue', true);
          callback('headerEnd');
          state = S.HEADER_VALUE_ALMOST_DONE;
        }
        break;
      case S.HEADER_VALUE_ALMOST_DONE:
        if (c != LF) {
          return i;
        }
        state = S.HEADER_FIELD_START;
        break;
      case S.HEADERS_ALMOST_DONE:
        if (c != LF) {
          return i;
        }

        callback('headersEnd');
        state = S.PART_DATA_START;
        break;
      case S.PART_DATA_START:
        state = S.PART_DATA;
        mark('partData');
      case S.PART_DATA:
        prevIndex = index;

        if (index === 0) {
          // boyer-moore derrived algorithm to safely skip non-boundary data
          i += boundaryEnd;
          while (i < bufferLength && !(buffer[i] in boundaryChars)) {
            i += boundaryLength;
          }
          i -= boundaryEnd;
          c = buffer[i];
        }

        if (index < boundary.length) {
          if (boundary[index] == c) {
            if (index === 0) {
              dataCallback('partData', true);
            }
            index++;
          } else {
            index = 0;
          }
        } else if (index == boundary.length) {
          index++;
          if (c == CR) {
            // CR = part boundary
            flags |= F.PART_BOUNDARY;
          } else if (c == HYPHEN) {
            // HYPHEN = end boundary
            flags |= F.LAST_BOUNDARY;
          } else {
            index = 0;
          }
        } else if (index - 1 == boundary.length)  {
          if (flags & F.PART_BOUNDARY) {
            index = 0;
            if (c == LF) {
              // unset the PART_BOUNDARY flag
              flags &= ~F.PART_BOUNDARY;
              callback('partEnd');
              callback('partBegin');
              state = S.HEADER_FIELD_START;
              break;
            }
          } else if (flags & F.LAST_BOUNDARY) {
            if (c == HYPHEN) {
              callback('partEnd');
              callback('end');
              state = S.END;
              flags = 0;
            } else {
              index = 0;
            }
          } else {
            index = 0;
          }
        }

        if (index > 0) {
          // when matching a possible boundary, keep a lookbehind reference
          // in case it turns out to be a false lead
          lookbehind[index-1] = c;
        } else if (prevIndex > 0) {
          // if our boundary turned out to be rubbish, the captured lookbehind
          // belongs to partData
          callback('partData', lookbehind, 0, prevIndex);
          prevIndex = 0;
          mark('partData');

          // reconsider the current character even so it interrupted the sequence
          // it could be the beginning of a new sequence
          i--;
        }

        break;
      case S.END:
        break;
      default:
        return i;
    }
  }

  dataCallback('headerField');
  dataCallback('headerValue');
  dataCallback('partData');

  this.index = index;
  this.state = state;
  this.flags = flags;

  return len;
};

MultipartParser.prototype.end = function() {
  var callback = function(self, name) {
    var callbackSymbol = 'on'+name.substr(0, 1).toUpperCase()+name.substr(1);
    if (callbackSymbol in self) {
      self[callbackSymbol]();
    }
  };
  if ((this.state == S.HEADER_FIELD_START && this.index === 0) ||
      (this.state == S.PART_DATA && this.index == this.boundary.length)) {
    callback(this, 'partEnd');
    callback(this, 'end');
  } else if (this.state != S.END) {
    return new Error('MultipartParser.end(): stream ended unexpectedly: ' + this.explain());
  }
};

MultipartParser.prototype.explain = function() {
  return 'state = ' + MultipartParser.stateToString(this.state);
};

},{"buffer":undefined}],9:[function(require,module,exports){
var EventEmitter = require('events').EventEmitter
	, util = require('util');

function OctetParser(options){
	if(!(this instanceof OctetParser)) return new OctetParser(options);
	EventEmitter.call(this);
}

util.inherits(OctetParser, EventEmitter);

exports.OctetParser = OctetParser;

OctetParser.prototype.write = function(buffer) {
    this.emit('data', buffer);
	return buffer.length;
};

OctetParser.prototype.end = function() {
	this.emit('end');
};

},{"events":undefined,"util":undefined}],10:[function(require,module,exports){
if (global.GENTLY) require = GENTLY.hijack(require);

// This is a buffering parser, not quite as nice as the multipart one.
// If I find time I'll rewrite this to be fully streaming as well
var querystring = require('querystring');

function QuerystringParser(maxKeys) {
  this.maxKeys = maxKeys;
  this.buffer = '';
}
exports.QuerystringParser = QuerystringParser;

QuerystringParser.prototype.write = function(buffer) {
  this.buffer += buffer.toString('ascii');
  return buffer.length;
};

QuerystringParser.prototype.end = function() {
  var fields = querystring.parse(this.buffer, '&', '=', { maxKeys: this.maxKeys });
  for (var field in fields) {
    this.onField(field, fields[field]);
  }
  this.buffer = '';

  this.onEnd();
};


},{"querystring":undefined}],11:[function(require,module,exports){
//console.log("!!!!!!!!!!!!!!!! WARNING THIS IS GUN 0.5 !!!!!!!!!!!!!!!!!!!!!!");
;(function(){

	/* UNBUILD */
	var root;
	if(typeof window !== "undefined"){ root = window }
	if(typeof global !== "undefined"){ root = global }
	root = root || {};
	var console = root.console = root.console || {log: function(){}};
	function require(arg){
		return arg.slice? require[resolve(arg)] : function(mod, path){
			arg(mod = {exports: {}});
			require[resolve(path)] = mod.exports;
		}
		function resolve(path){
			return path.split('/').slice(-1).toString().replace('.js','');
		}
	}
	if(typeof module !== "undefined"){ var common = module }
	/* UNBUILD */

	;require(function(module){
		// Generic javascript utilities.
		var Type = {};
		Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
		Type.bi = {is: function(b){ return (b instanceof Boolean || typeof b == 'boolean') }}
		Type.num = {is: function(n){ return !list_is(n) && ((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }}
		Type.text = {is: function(t){ return (typeof t == 'string') }}
		Type.text.ify = function(t){
			if(Type.text.is(t)){ return t }
			if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
			return (t && t.toString)? t.toString() : t;
		}
		Type.text.random = function(l, c){
			var s = '';
			l = l || 24; // you are not going to make a 0 length random number, so no need to check type
			c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
			while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l-- }
			return s;
		}
		Type.text.match = function(t, o){ var r = false;
			t = t || '';
			o = Type.text.is(o)? {'=': o} : o || {}; // {'~', '=', '*', '<', '>', '+', '-', '?', '!'} // ignore case, exactly equal, anything after, lexically larger, lexically lesser, added in, subtacted from, questionable fuzzy match, and ends with.
			if(Type.obj.has(o,'~')){ t = t.toLowerCase(); o['='] = (o['='] || o['~']).toLowerCase() }
			if(Type.obj.has(o,'=')){ return t === o['='] }
			if(Type.obj.has(o,'*')){ if(t.slice(0, o['*'].length) === o['*']){ r = true; t = t.slice(o['*'].length) } else { return false }}
			if(Type.obj.has(o,'!')){ if(t.slice(-o['!'].length) === o['!']){ r = true } else { return false }}
			if(Type.obj.has(o,'+')){
				if(Type.list.map(Type.list.is(o['+'])? o['+'] : [o['+']], function(m){
					if(t.indexOf(m) >= 0){ r = true } else { return true }
				})){ return false }
			}
			if(Type.obj.has(o,'-')){
				if(Type.list.map(Type.list.is(o['-'])? o['-'] : [o['-']], function(m){
					if(t.indexOf(m) < 0){ r = true } else { return true }
				})){ return false }
			}
			if(Type.obj.has(o,'>')){ if(t > o['>']){ r = true } else { return false }}
			if(Type.obj.has(o,'<')){ if(t < o['<']){ r = true } else { return false }}
			function fuzzy(t,f){ var n = -1, i = 0, c; for(;c = f[i++];){ if(!~(n = t.indexOf(c, n+1))){ return false }} return true } // via http://stackoverflow.com/questions/9206013/javascript-fuzzy-search
			if(Type.obj.has(o,'?')){ if(fuzzy(t, o['?'])){ r = true } else { return false }} // change name!
			return r;
		}
		Type.list = {is: function(l){ return (l instanceof Array) }}
		Type.list.slit = Array.prototype.slice;
		Type.list.sort = function(k){ // creates a new sort function based off some field
			return function(A,B){
				if(!A || !B){ return 0 } A = A[k]; B = B[k];
				if(A < B){ return -1 }else if(A > B){ return 1 }
				else { return 0 }
			}
		}
		Type.list.map = function(l, c, _){ return obj_map(l, c, _) }
		Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
		Type.obj = {is: function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }}
		Type.obj.put = function(o, f, v){ return (o||{})[f] = v, o } 
		Type.obj.has = function(o, f){ return o && Object.prototype.hasOwnProperty.call(o, f) }
		Type.obj.del = function(o, k){
			if(!o){ return }
			o[k] = null;
			delete o[k];
			return o;
		}
		Type.obj.as = function(o, f, v){ return o[f] = o[f] || (arguments.length >= 3? v : {}) }
		Type.obj.ify = function(o){
			if(obj_is(o)){ return o }
			try{o = JSON.parse(o);
			}catch(e){o={}};
			return o;
		}
		;(function(){ var u;
			function map(v,f){
				if(obj_has(this,f) && u !== this[f]){ return }
				this[f] = v;
			}
			Type.obj.to = function(from, to){
				to = to || {};
				obj_map(from, map, to);
				return to;
			}
		}());
		Type.obj.copy = function(o){ // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
			return !o? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
		}
		;(function(){
			function empty(v,i){ var n = this.n;
				if(n && (i === n || (obj_is(n) && obj_has(n, i)))){ return }
				if(i){ return true }
			}
			Type.obj.empty = function(o, n){
				if(!o){ return true }
				return obj_map(o,empty,{n:n})? false : true;
			}
		}());
		;(function(){
			function t(k,v){
				if(2 === arguments.length){
					t.r = t.r || {};
					t.r[k] = v;
					return;
				} t.r = t.r || [];
				t.r.push(k);
			};
			Type.obj.map = function(l, c, _){
				var u, i = 0, x, r, ll, lle, f = fn_is(c);
				t.r = null;
				if(Object.keys && obj_is(l)){
					ll = Object.keys(l); lle = true;
				}
				if(list_is(l) || ll){
					x = (ll || l).length;
					for(;i < x; i++){
						var ii = (i + Type.list.index);
						if(f){
							r = lle? c.call(_ || this, l[ll[i]], ll[i], t) : c.call(_ || this, l[i], ii, t);
							if(r !== u){ return r }
						} else {
							//if(Type.test.is(c,l[i])){ return ii } // should implement deep equality testing!
							if(c === l[lle? ll[i] : i]){ return ll? ll[i] : ii } // use this for now
						}
					}
				} else {
					for(i in l){
						if(f){
							if(obj_has(l,i)){
								r = _? c.call(_, l[i], i, t) : c(l[i], i, t);
								if(r !== u){ return r }
							}
						} else {
							//if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
							if(c === l[i]){ return i } // use this for now
						}
					}
				}
				return f? t.r : Type.list.index? 0 : -1;
			}
		}());
		Type.time = {};
		Type.time.is = function(t){ return t? t instanceof Date : (+new Date().getTime()) }

		var fn_is = Type.fn.is;
		var list_is = Type.list.is;
		var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_map = obj.map;
		module.exports = Type;
	})(require, './type');
		
	;require(function(module){
		// On event emitter generic javascript utility.
		function Scope(){
			function On(tag, arg, as, eas, skip){
				var ctx = this, ons = ctx.ons || (ctx.ons = {}), on = ons[tag] || (ons[tag] = {s: []}), act, mem, O = On.ons;
				if(!arg){
					if(1 === arguments.length){ // Performance drops significantly even though `arguments.length` should be okay to use.
						return on;
					}
				}
				if(arg instanceof Function){
					act = new Act(tag, arg, as, on, ctx);
					if(O && O.event && ctx !== On){
						On.on('event', act);
						if(noop === act.fn){
							return act;
						}
						if(-1 < act.i){ return act }
					}
					on.s.push(act);
					return act;
				}
				var proxy;
				if(O && O.emit && ctx !== On){
					var ev = {tag: tag, arg: arg, on: on, ctx: ctx}, u;
					On.on('emit', ev);
					if(u === ev.arg){ return }
					arg = ev.arg;
					proxy = ev.proxy;
				}
				on.arg = arg;
				on.end = as;
				on.as = eas;
				var i = 0, acts = on.s, l = acts.length, arr = (arg instanceof Array), gap, off, act;
				for(; i < l; i++){ act = acts[i];
					if(skip){
						if(skip === act){
							skip = false;
						}
						continue;
					}
					var tmp = act.tmp = {};
					if(!arr){
						act.fn.call(act.as, arg, proxy||act);
					} else {
						act.fn.apply(act.as, arg.concat(proxy||act));
					}
					if(noop === act.fn){
						off = true;
					}
					if(tmp.halt){
						if(1 === tmp.halt){
							gap = true;
						}
						break;
					}
				}
				if(off){
					var still = [];
					for(i = 0; i < l; i++){ act = acts[i];
						if(noop !== act.fn){
							still.push(act);
						}
					}
					on.s = still;
					if(0 === still.length){
						delete ons[tag];
					}
				}
				if(!gap && as && as instanceof Function){
					as.call(eas, arg);
				}
				return;
			}
			On.on = On;
			On.scope = Scope;
			return On;
		}
		function Act(tag, fn, as, on, ctx){
			this.tag = tag;
			this.fn = fn;
			this.as = as;
			this.on = on;
			this.ctx = ctx;
		}
		Act.chain = Act.prototype;
		Act.chain.stun = function(){
			if(!this.tmp){ this.tmp = {} }
			if(!arguments.length){
				return this.tmp.halt = true;
			}
			var act = this, on = act.on, halt = {
				resume: function(arg){
					/*
						TODO: BUG!
						TODO: BUG!
						TODO: BUG!
						TODO: BUG!
						TODO: BUG!
						Why does our map not get updates?
						Portions do if we do not use .key to save the initial data.
						Which makes me think it relates to pseudo, however it doesn't fully work if I get rid of that.
						Why why why? Probably something to do with map events and memoizing?
					*/
					act.ctx.on(act.tag, (arguments.length?
						1 === arguments.length? arg : Array.prototype.slice.call(arguments)
					: halt.arg), halt.end, halt.as, act);
				}, arg: on.arg,
				end: on.end,
				as: on.as
			};
			act.tmp.halt = 1;
			return halt.resume;
		}
		Act.chain.off = function(){
			this.fn = noop;
		}
		Act.chain.emit = function(arg){
			var act = this, arr = (arg instanceof Array);
			if(!arr){
				act.fn.call(act.as, arg, act);
			} else {
				act.fn.apply(act.as, arg.concat(act));
			}
		}
		function noop(){};
		module.exports = Scope();
	})(require, './on');

	;require(function(module){
		var On = require('./on');
		
		function Chain(create, opt){
			opt = opt || {};
			opt.id = opt.id || '#';
			opt.rid = opt.rid || '@';
			opt.uuid = opt.uuid || function(){
				return (+new Date()) + Math.random();
			};
			var on = On.scope();

			on.stun = function(chain, fn, as){
				var res = function(n){
					if(1 === n){
						at.stun.skip = 1;
						return;
					}
					if(at.stun === stun){
						delete at.stun;	
					}
					off = true;
					var i = 0, q = res.queue, l = q.length, c, v;
					for(i; i < l; i++){ v = q[i];
						c = v[0];
						v = v[1];
						c.on('in', v.get, v);
					}
				}, at = chain._, off, stun = at.stun = function(arg){
					if(off){
						delete this.stun;
						return false;
					}
					if(at.stun.skip){
						return at.stun.skip = false;
					}
					res.queue.push([this, arg]);
					return true;
				}
				res.queue = [];
				return res;
			}

			var ask = on.ask = function(cb, as){
				if(!ask.on){ ask.on = On.scope() }
				var id = opt.uuid();
				if(cb){ ask.on(id, cb, as) }
				return id;
			}
			ask._ = opt.id;
			on.ack = function(at, reply){
				if(!at || !reply || !ask.on){ return }
				var id = at[opt.id] || at;
				ask.on(id, reply);
				return true;
			}
			on.ack._ = opt.rid;
			/*
			on.on('event', function event(act){
				var last = act.on.last, tmp;
				if(last){
					if(last instanceof Array){
						act.fn.apply(act.as, last.concat(act));
					} else {
						act.fn.call(act.as, last, act);
					}
					if(last !== act.on.last){
						event(act);
					}
					return;
				}
			});*/

			on.on('event', function event(act){
				var last = act.on.last, tmp;
				if(last){
					if(act.on.map){
						Gun.obj.map(act.on.map, function(v,f){ // TODO: BUG! Gun is not available in this module.
							//emit(v[0], act, event, v[1]); // below enables more control
							emit(v[1], act, event, v[2]);
						});
					} else {
						emit(last, act, event);
					}
					if(last !== act.on.last){
						event(act);
					}
					return;
				}
			});
			function emit(last, act, event, ev){
				if(last instanceof Array){
					act.fn.apply(act.as, last.concat(ev||act));
				} else {
					act.fn.call(act.as, last, ev||act);
				}
			}

			on.on('emit', function(ev){
				if(ev.on.map){
					/*
					ev.id = ev.id || Gun.text.random(6);
					ev.on.map[ev.id] = ev.arg;
					ev.proxy = ev.arg[1];
					ev.arg = ev.arg[0];
					*/ // below gives more control.
					ev.on.map[ev.arg[0]] = ev.arg;
					ev.proxy = ev.arg[2];
					ev.arg = ev.arg[1];
				}
				ev.on.last = ev.arg;
			});
			return on;
		}
		/*
		function backward(scope, ev){ var tmp;
			if(!scope || !scope.on){ return }
			//if(scope.on('back').length){
			if((tmp = scope.ons) && (tmp = tmp[ev]) && tmp.s.length){
				return scope;
			}
			return backward((scope.back||backward)._, ev);
		}
		*/
		module.exports = Chain;
	})(require, './onify');

	;require(function(module){
		// Generic javascript scheduler utility.
		var Type = require('./type');
		function s(state, cb, time){ // maybe use lru-cache?
			s.time = time || Gun.time.is;
			s.waiting.push({when: state, event: cb || function(){}});
			if(s.soonest < state){ return }
			s.set(state);
		}
		s.waiting = [];
		s.soonest = Infinity;
		s.sort = Type.list.sort('when');
		s.set = function(future){
			if(Infinity <= (s.soonest = future)){ return }
			var now = s.time();
			future = (future <= now)? 0 : (future - now);
			clearTimeout(s.id);
			s.id = setTimeout(s.check, future);
		}
		s.each = function(wait, i, map){
			var ctx = this;
			if(!wait){ return }
			if(wait.when <= ctx.now){
				if(wait.event instanceof Function){
					setTimeout(function(){ wait.event() },0);
				}
			} else {
				ctx.soonest = (ctx.soonest < wait.when)? ctx.soonest : wait.when;
				map(wait);
			}
		}
		s.check = function(){
			var ctx = {now: s.time(), soonest: Infinity};
			s.waiting.sort(s.sort);
			s.waiting = Type.list.map(s.waiting, s.each, ctx) || [];
			s.set(ctx.soonest);
		}
		module.exports = s;
	})(require, './schedule');

	;require(function(module){
		/* Based on the Hypothetical Amnesia Machine thought experiment */
		function HAM(machineState, incomingState, currentState, incomingValue, currentValue){
			if(machineState < incomingState){
				return {defer: true}; // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
			}
			if(incomingState < currentState){
				return {historical: true}; // the incoming value is within the boundary of the machine's state, but not within the range.
				
			}
			if(currentState < incomingState){
				return {converge: true, incoming: true}; // the incoming value is within both the boundary and the range of the machine's state.
				
			}
			if(incomingState === currentState){
				if(incomingValue === currentValue){ // Note: while these are practically the same, the deltas could be technically different
					return {state: true};
				}
				/*
					The following is a naive implementation, but will always work.
					Never change it unless you have specific needs that absolutely require it.
					If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
					As a result, it is highly discouraged to modify despite the fact that it is naive,
					because convergence (data integrity) is generally more important.
					Any difference in this algorithm must be given a new and different name.
				*/
				if(Lexical(incomingValue) < Lexical(currentValue)){ // Lexical only works on simple value types!
					return {converge: true, current: true};
				}
				if(Lexical(currentValue) < Lexical(incomingValue)){ // Lexical only works on simple value types!
					return {converge: true, incoming: true};
				}
			}
			return {err: "you have not properly handled recursion through your data or filtered it as JSON"};
		}
		function Lexical(value){
			// TODO: BUG! HAM should understand a relation (pointer) as a type as well.
			if(typeof value === 'string'){ // Text
				return 'aaaaa'+value;
			}
			if((value - parseFloat(value) + 1) >= 0){ // Numbers (JSON-able)
				return 'aaaa'+value;
			}
			if(true === value){ // Boolean
				return 'aaa';
			}
			if(false === value){ // Boolean
				return 'aa';
			}
			if(null === value){ // Null
				return 'a';
			}
			if(undefined === value){ // Undefined
				return '';
			}
			return ''; // Not supported
		}
		var undefined;
		module.exports = HAM;
	})(require, './HAM');

	;require(function(module){
		var Type = require('./type');
		var Val = {};
		Val.is = function(v){ // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
			var u;
			if(v === u){ return false }
			if(v === null){ return true } // "deletes", nulling out fields.
			if(v === Infinity){ return false } // we want this to be, but JSON does not support it, sad face.
			if(bi_is(v) // by "binary" we mean boolean.
			|| num_is(v)
			|| text_is(v)){ // by "text" we mean strings.
				return true; // simple values are valid.
			}
			return Val.rel.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
		}
		Val.rel = {_: '#'};
		;(function(){
			Val.rel.is = function(v){ // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
				if(v && !v._ && obj_is(v)){ // must be an object.
					var o = {};
					obj_map(v, map, o);
					if(o.id){ // a valid id was found.
						return o.id; // yay! Return it.
					}
				}
				return false; // the value was not a valid soul relation.
			}
			function map(s, f){ var o = this; // map over the object...
				if(o.id){ return o.id = false } // if ID is already defined AND we're still looping through the object, it is considered invalid.
				if(f == _rel && text_is(s)){ // the field should be '#' and have a text value.
					o.id = s; // we found the soul!
				} else {
					return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
				}
			}
		}());
		Val.rel.ify = function(t){ return obj_put({}, _rel, t) } // convert a soul into a relation and return it.
		var _rel = Val.rel._;
		var bi_is = Type.bi.is;
		var num_is = Type.num.is;
		var text_is = Type.text.is;
		var obj = Type.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map;
		module.exports = Val;
	})(require, './val');

	;require(function(module){
		var Type = require('./type');
		var Val = require('./val');
		var Node = {_: '_'};
		Node.soul = function(n, o){ return (n && n._ && n._[o || _soul]) } // convenience function to check to see if there is a soul on a node and return it.
		Node.soul.ify = function(n, o){ // put a soul on an object.
			o = (typeof o === 'string')? {soul: o} : o || {};
			n = n || {}; // make sure it exists.
			n._ = n._ || {}; // make sure meta exists.
			n._[_soul] = o.soul || n._[_soul] || text_random(); // put the soul on it.
			return n;
		}
		;(function(){
			Node.is = function(n, cb, o){ var s; // checks to see if an object is a valid node.
				if(!obj_is(n)){ return false } // must be an object.
				if(s = Node.soul(n)){ // must have a soul on it.
					return !obj_map(n, map, {o:o,n:n,cb:cb});
				}
				return false; // nope! This was not a valid node.
			}
			function map(v, f){ // we invert this because the way we check for this is via a negation.
				if(f === Node._){ return } // skip over the metadata.
				if(!Val.is(v)){ return true } // it is true that this is an invalid node.
				if(this.cb){ this.cb.call(this.o, v, f, this.n) } // optionally callback each field/value.
			}
		}());
		;(function(){
			Node.ify = function(obj, o, as){ // returns a node from a shallow object.
				if(!o){ o = {} }
				else if(typeof o === 'string'){ o = {soul: o} }
				else if(o instanceof Function){ o = {map: o} }
				if(o.map){ o.node = o.map.call(as, obj, u, o.node || {}) }
				if(o.node = Node.soul.ify(o.node || {}, o)){
					obj_map(obj, map, {opt:o,as:as});
				}
				return o.node; // This will only be a valid node if the object wasn't already deep!
			}
			function map(v, f){ var o = this.opt, tmp, u; // iterate over each field/value.
				if(o.map){
					tmp = o.map.call(this.as, v, ''+f, o.node);
					if(u === tmp){
						obj_del(o.node, f);
					} else
					if(o.node){ o.node[f] = tmp }
					return;
				}
				if(Val.is(v)){ 
					o.node[f] = v;
				}
			}
		}());
		var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_map = obj.map;
		var text = Type.text, text_random = text.random;
		var _soul = Val.rel._;
		var u;
		module.exports = Node;
	})(require, './node');

	;require(function(module){
		var Type = require('./type');
		var Node = require('./node');
		function State(){
			var t = time();
			if(last < t){
				n = 0;
				return last = t;
			}
			return last = t + ((n += 1) / d);
		}
		State._ = '>';
		var time = Type.time.is, last = -Infinity, n = 0, d = 1000;
		State.ify = function(n, f, s){ // put a field's state on a node.
			if(!n || !n[N_]){ return } // reject if it is not node-like.
			var tmp = obj_as(n[N_], State._); // grab the states data.
			if(u !== f && num_is(s)){ tmp[f] = s } // add the valid state.
			return n;
		}
		State.is = function(n, f){ // convenience function to get the state on a field on a node and return it.
			var tmp = f && n && n[N_] && n[N_][State._];
			if(!tmp){ return }
			return num_is(tmp[f])? tmp[f] : -Infinity;
		}
		;(function(){
			State.map = function(cb, s, as){ var u; // for use with Node.ify
				var o = obj_is(o = cb || s)? o : null;
				cb = fn_is(cb = cb || s)? cb : null;
				if(o && !cb){
					s = num_is(s)? s : State();
					o[N_] = o[N_] || {};
					obj_map(o, map, {o:o,s:s});
					return o;
				}
				as = as || obj_is(s)? s : u;
				s = num_is(s)? s : State();
				return function(v, f, o, opt){
					if(!cb){
						map.call({o: o, s: s}, v,f);
						return v;
					}
					cb.call(as || this || {}, v, f, o, opt);
					if(obj_has(o,f) && u === o[f]){ return }
					map.call({o: o, s: s}, v,f);
				}
			}
			function map(v,f){
				if(N_ === f){ return }
				State.ify(this.o, f, this.s) ;
			}
		}());
		var obj = Type.obj, obj_as = obj.as, obj_has = obj.has, obj_is = obj.is, obj_map = obj.map;
		var num = Type.num, num_is = num.is;
		var fn = Type.fn, fn_is = fn.is;
		var N_ = Node._, u;
		module.exports = State;
	})(require, './state');

	;require(function(module){
		var Type = require('./type');
		var Val = require('./val');
		var Node = require('./node');
		var Graph = {};
		;(function(){
			Graph.is = function(g, cb, fn, as){ // checks to see if an object is a valid graph.
				if(!g || !obj_is(g) || obj_empty(g)){ return false } // must be an object.
				return !obj_map(g, map, {fn:fn,cb:cb,as:as}); // makes sure it wasn't an empty object.
			}
			function nf(fn){ // optional callback for each node.
				if(fn){ Node.is(nf.n, fn, nf.as) } // where we then have an optional callback for each field/value.
			}
			function map(n, s){ // we invert this because the way we check for this is via a negation.
				if(!n || s !== Node.soul(n) || !Node.is(n, this.fn)){ return true } // it is true that this is an invalid graph.
				if(!fn_is(this.cb)){ return }	
				nf.n = n; nf.as = this.as;	 
				this.cb.call(nf.as, n, s, nf);
			}
		}());
		;(function(){
			Graph.ify = function(obj, env, as){
				var at = {path: [], obj: obj};
				if(!env){
					env = {};
				} else 
				if(typeof env === 'string'){
					env = {soul: env};
				} else
				if(env instanceof Function){
					env.map = env;
				}
				if(env.soul){
					at.rel = Val.rel.ify(env.soul);
				}
				env.graph = env.graph || {};
				env.seen = env.seen || [];
				env.as = env.as || as;
				node(env, at);
				env.root = at.node;
				return env.graph;
			}
			function node(env, at){ var tmp;
				if(tmp = seen(env, at)){ return tmp }
				at.env = env;
				at.soul = soul;
				if(Node.ify(at.obj, map, at)){
					at.rel = at.rel || Val.rel.ify(Node.soul(at.node));
					env.graph[Val.rel.is(at.rel)] = at.node;
				}
				return at;
			}
			function map(v,f,n){
				var at = this, env = at.env, is, tmp;
				if(Node._ === f && obj_has(v,Val.rel._)){
					return n._; // TODO: Bug?
				}
				if(!(is = valid(v,f,n, at,env))){ return }
				if(!f){
					at.node = at.node || n || {};
					if(obj_has(v, Node._)){
						at.node._ = Gun.obj.copy(v._);
					}
					at.node = Node.soul.ify(at.node, Val.rel.is(at.rel));
				}
				if(tmp = env.map){
					tmp.call(env.as || {}, v,f,n, at);
					if(obj_has(n,f)){
						v = n[f];
						if(u === v){
							obj_del(n, f);
							return;
						}
						if(!(is = valid(v,f,n, at,env))){ return }
					}
				}
				if(!f){ return at.node }
				if(true === is){
					return v;
				}
				tmp = node(env, {obj: v, path: at.path.concat(f)});
				if(!tmp.node){ return }
				return tmp.rel; //{'#': Node.soul(tmp.node)};
			}
			function soul(id){ var at = this;
				var prev = Val.rel.is(at.rel), graph = at.env.graph;
				at.rel = at.rel || Val.rel.ify(id);
				at.rel[Val.rel._] = id;
				if(at.node && at.node[Node._]){
					at.node[Node._][Val.rel._] = id;
				}
				if(obj_has(graph, prev)){
					graph[id] = graph[prev];
					obj_del(graph, prev);
				}
			}
			function valid(v,f,n, at,env){ var tmp;
				if(Val.is(v)){ return true }
				if(obj_is(v)){ return 1 }
				if(tmp = env.invalid){
					v = tmp.call(env.as || {}, v,f,n);
					return valid(v,f,n, at,env);
				}
				env.err = "Invalid value at '" + at.path.concat(f).join('.') + "'!";
			}
			function seen(env, at){
				var arr = env.seen, i = arr.length, has;
				while(i--){ has = arr[i];
					if(at.obj === has.obj){ return has }
				}
				arr.push(at);
			}
		}());
		Graph.node = function(node){
			var soul = Node.soul(node);
			if(!soul){ return }
			return obj_put({}, soul, node);
		}
		;(function(){
			Graph.to = function(graph, root, opt){
				if(!graph){ return }
				var obj = {};
				opt = opt || {seen: {}};
				obj_map(graph[root], map, {obj:obj, graph: graph, opt: opt});
				return obj;
			}
			function map(v,f){ var tmp, obj;
				if(Node._ === f){
					if(obj_empty(v, Val.rel._)){
						return;
					}
					this.obj[f] = obj_copy(v);
					return;
				}
				if(!(tmp = Val.rel.is(v))){
					this.obj[f] = v;
					return;
				}
				if(obj = this.opt.seen[tmp]){
					this.obj[f] = obj;
					return;
				}
				this.obj[f] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
			}
		}());
		var fn_is = Type.fn.is;
		var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_has = obj.has, obj_empty = obj.empty, obj_put = obj.put, obj_map = obj.map, obj_copy = obj.copy;
		var u;
		module.exports = Graph;
	})(require, './graph');


	;require(function(module){

		function Gun(o){
			if(!(this instanceof Gun)){ return Gun.create(o) }
			this._ = {gun: this};
		}

		Gun.create = function(o){
			return new Gun().opt(o);
		};

		Gun._ = { // some reserved key words, these are not the only ones.
			meta: '_' // all metadata of the node is stored in the meta property on the node.
			,soul: '#' // a soul is a UUID of a node but it always points to the "latest" data known.
			,field: '.' // a field is a property on a node which points to a value.
			,state: '>' // other than the soul, we store HAM metadata.
			,value: '=' // the primitive value.
		}

		Gun.__ = {
			'_':'meta'
			,'#':'soul'
			,'.':'field'
			,'=':'value'
			,'>':'state'
		}

		Gun.version = 0.4;

		Gun.is = function(gun){ return (gun instanceof Gun) } // check to see if it is a GUN instance.

		var Type = require('./type');
		Type.obj.map(Type, function(v,f){
			Gun[f] = v;
		});
		Gun.HAM = require('./HAM');
		Gun.val = require('./val');
		Gun.node = require('./node');
		Gun.state = require('./state');
		Gun.graph = require('./graph');

		Gun.on = require('./onify')();
		
		/*
		var opt = {chain: 'in', back: 'out', extend: 'root', id: Gun._.soul};
		Gun.chain = require('./chain')(Gun, opt);
		Gun.chain.chain.opt = opt;
		*/
		(Gun.chain = Gun.prototype).chain = function(){
			var chain = new this.constructor(), _;
			_ = chain._ || (chain._ = {});
			_.root = this._.root;
			_.back = this;
			return chain;
		}
		Gun.chain.toJSON = function(){};

		;(function(){

			Gun.chain.opt = function(opt){
				opt = opt || {};
				var gun = this, at = gun._, tmp, u;
				if(!at.root){ root(at) }
				tmp = at.opt = at.opt || {};
				if(text_is(opt)){ opt = {peers: opt} }
				else if(list_is(opt)){ opt = {peers: opt} }
				if(text_is(opt.peers)){ opt.peers = [opt.peers] }
				if(list_is(opt.peers)){ opt.peers = obj_map(opt.peers, function(n,f,m){m(n,{})}) }
				obj_map(opt, function map(v,f){
					if(obj_is(v)){
						tmp = tmp[f] || (tmp[f] = {}); // TODO: Bug? Be careful of falsey values getting overwritten?
						obj_map(v, map);
						return;
					}
					tmp[f] = v;
				});
				Gun.on('opt', at);
				return gun;
			}
			function root(at){
				var gun = at.gun;
				at.root = gun;
				at.graph = {};
				gun.on('in', input, at);
				gun.on('out', output, at);
			}
			function output(at){
				var cat = this, gun = cat.gun, tmp;
				if(at.put){
					cat.on('in', obj_to(at, {gun: cat.gun}));
				}
				if(!at.gun){
					at = Gun.obj.to(at, {gun: gun});
				}
				if(at.put){ Gun.on('put', at) }
				if(at.get){ get(at, cat) }
				Gun.on('out', at);
				if(!cat.back){ return }
				cat.back.on('out', at);
			}
			function get(at, cat){
				var soul = at.get[_soul], node = cat.graph[soul], field = at.get[_field];
				if(node && (!field || obj_has(node, field))){
					// TODO: BUG!!! Shouldn't this ack?????
					if(field){
						node = Gun.obj.put({_: node._}, field, node[field]);
					}
					cat.on('in', {
						'@': at.req? at['#'] : 0, // temporary hack
						put: Gun.graph.node(node) // TODO: BUG! Clone node!
					});
					return;
				}
				Gun.on('get', at);
			}
			function input(at){ var cat = this;
				if(at['@'] || at.err || u === at.put){
					at.gun = at.gun || cat.gun;
					Gun.on.ack(at['@'], at);
					return;
				}
				if(cat.graph){
					Gun.obj.map(at.put, ham, {at: at, cat: this}); // all unions must happen first, sadly.
				}
				Gun.obj.map(at.put, map, {at: at, cat: this});
			}
			function ham(data, key){
				var cat = this.cat, graph = cat.graph;
				graph[key] = Gun.HAM.union(graph[key] || data, data) || graph[key];
			}
			function map(data, key){
				var cat = this.cat, graph = cat.graph, path = cat.path || (cat.path = {}), gun, at;
				gun = path[key] || (path[key] = cat.gun.get(key));
				(at = gun._).change = data;
				if(graph){
					data = graph[key]; // TODO! BUG/PERF! COPY!?
				}
				at.put = data;
				gun.on('in', {
					put: data,
					get: key,
					gun: gun,
					via: this.at
				});
			}
		}());
		var text = Type.text, text_is = text.is, text_random = text.random;
		var list = Type.list, list_is = list.is;
		var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_to = obj.to, obj_map = obj.map;
		var _soul = Gun._.soul, _field = Gun._.field;
		var u;

		console.debug = function(i, s){ return (console.debug.i && i === console.debug.i && console.debug.i++) && console.log.apply(console, arguments), s };

		Gun.log = function(){ return (!Gun.log.off && console.log.apply(console, arguments)), [].slice.call(arguments).join(' ') }
		Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) }

		if(typeof window !== "undefined"){ window.Gun = Gun }
		if(typeof common !== "undefined"){ common.exports = Gun }
		module.exports = Gun;
	})(require, './gun');

	;require(function(module){

		var Gun = require('./gun');
		module.exports = Gun;

		;(function(){
			function meta(v,f){
				if(obj_has(Gun.__, f)){ return }
				obj_put(this._, f, v);
			}
			function map(value, field){
				if(Gun._.meta === field){ return }
				var node = this.node, vertex = this.vertex, union = this.union, machine = this.machine;
				var is = state_is(node, field), cs = state_is(vertex, field);
				if(u === is || u === cs){ return true } // it is true that this is an invalid HAM comparison.
				var iv = rel_is(value) || value, cv = rel_is(vertex[field]) || vertex[field];
				







				// TODO: BUG! Need to compare relation to not relation, and choose the relation if there is a state conflict.








				if(!val_is(iv) && u !== iv){ return true } // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
				if(!val_is(cv) && u !== cv){ return true }  // Undefined is okay since a value might not exist on both nodes. // it is true that this is an invalid HAM comparison.
				var HAM = Gun.HAM(machine, is, cs, iv, cv);
				if(HAM.err){
					console.log(".!HYPOTHETICAL AMNESIA MACHINE ERR!.", HAM.err); // this error should never happen.
					return;
				}
				if(HAM.state || HAM.historical || HAM.current){ // TODO: BUG! Not implemented.
					//opt.lower(vertex, {field: field, value: value, state: is});
					return;
				}
				if(HAM.incoming){
					union[field] = value;
					state_ify(union, field, is);
					return;
				}
				if(HAM.defer){ // TODO: BUG! Not implemented.
					/*upper.wait = true;
					opt.upper.call(state, vertex, field, incoming, ctx.incoming.state); // signals that there are still future modifications.
					Gun.schedule(ctx.incoming.state, function(){
						update(incoming, field);
						if(ctx.incoming.state === upper.max){ (upper.last || function(){})() }
					}, gun.__.opt.state);*/
				}
			}
			Gun.HAM.union = function(vertex, node, opt){
				if(!node || !vertex || !node._ || !vertex._){ return }
				opt = num_is(opt)? {machine: opt} : {machine: (+new Date)};
				opt.union = Gun.obj.copy(vertex);
				opt.vertex = vertex;
				opt.node = node;
				obj_map(node._, meta, opt.union);
				if(obj_map(node, map, opt)){ // if this returns true then something was invalid.
					return;
				}
				return opt.union;
			}
			var Type = Gun;
			var num = Type.num, num_is = num.is;
			var obj = Type.obj, obj_has = obj.has, obj_put = obj.put, obj_map = obj.map;
			var node = Gun.node, node_soul = node.soul, node_is = node.is, node_ify = node.ify;
			var state = Gun.state, state_is = state.is, state_ify = state.ify;
			var val = Gun.val, val_is = val.is, rel_is = val.rel.is;
			var u;
		}());

	})(require, './index');

	;require(function(module){
		var Gun = require('./index');
		var obj = Gun.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map, obj_empty = obj.empty;
		var num = Gun.num, num_is = num.is;
		var _soul = Gun.val.rel._, _field = '.';
		
		;(function(){ var obj = {}, u;
			Gun.chain.Back = function(n, opt){ var tmp;
				if(-1 === n || Infinity === n){
					return this._.root;
				} else
				if(1 === n){
					return this._.back;
				}
				var gun = this, at = gun._;
				if(typeof n === 'string'){
					n = n.split('.');
				}
				if(n instanceof Array){
					var i = 0, l = n.length, tmp = at;
					for(i; i < l; i++){
						tmp = (tmp||obj)[n[i]];
					}
					if(u !== tmp){
						return opt? gun : tmp;
					} else
					if(tmp = at.back){
						return tmp.Back(n, opt);
					}
					return;
				}
				if(n instanceof Function){
					var yes, tmp = {_:{back: gun}};
					while((tmp = tmp._) && (tmp = tmp.back) && !(yes = n(tmp, opt))){}
					return yes;
				}
			}
		}())

		;(function(){

			Gun.chain.put = function(data, cb, opt, as){
				// TODO: BUG! Put probably cannot handle plural chains!
				var gun = this, root = gun.Back(-1), tmp;
				opt = (opt && typeof opt === 'string')? {soul: opt} : opt || {};
				as = as || {opt: opt, soul: opt.soul};
				as.gun = gun;
				as.data = data;
				opt.any = opt.any || cb;
				if(root === gun || as.soul){
					if(!obj_is(as.data)){
						(opt.any||noop).call(opt.as || gun, as.out = {err: Gun.log("No field to put", (typeof as.data), '"' + as.data + '" on!')});
						if(as.res){ as.res() }
						return gun;
					}
					if(!as.soul){
						if(opt.init || as.gun.Back('opt.init')){
							return gun;
						}
					}
					as.gun = gun = root.get(as.soul = as.soul || (as.not = Gun.node.soul(as.data) || (opt.uuid || root.Back('opt.uuid') || Gun.text.random)()));
					as.ref = as.ref || as.gun;
					ify(as);
					return gun;
				}
				if(Gun.is(data)){
					data.any(function(e,d,k,at,ev){
						ev.off();
						var s = Gun.node.soul(d);
						if(!s){Gun.log("Can only save a node, not a property.");return}
						gun.put(Gun.val.rel.ify(s), cb, opt);
					});
					return gun;
				}
				as.ref = as.ref || (root === (tmp = gun.Back(1)))? gun : tmp;
				as.ref.any(any, {as: as, '.': null});
				if(!as.out){
					as.res = as.res || Gun.on.stun(as.ref);
					as.gun._.stun = as.ref._.stun; // TODO: BUG! These stuns need to be attached all the way down, not just one level.
				}
				return gun;
			};

			function ify(as){
				as.batch = batch;
				var opt = as.opt, env = as.env = Gun.state.map(map, opt.state);
				env.soul = as.soul;
				as.graph = Gun.graph.ify(as.data, env, as);
				if(env.err){
					(opt.any||noop).call(opt.as || as.gun, as.out = {err: Gun.log(env.err)});
					if(as.res){ as.res() }
					return;
				}
				as.batch();
			}

			function batch(){ var as = this;
				if(!as.graph || obj_map(as.stun, no)){ return }
				as.ref.on('out', {
					gun: as.ref, put: as.out = as.env.graph, opt: as.opt,
					'#': Gun.on.ask(function(ack, ev){
						if(ack && 0 === ack.ok){ return }
						ev.off(); // One response is good enough for us currently. Later we may want to adjust this.
						if(!as.opt.any){ return }
						as.opt.any.call(as.opt.as || as.gun, ack.err, ack.ok);
					}, as.opt)
				});
				if(as.res){ as.res() }
			} function no(v,f){ if(v){ return true } }

			function map(v,f,n, at){ var as = this;
				if(f || !at.path.length){ return }
				var path = at.path, ref = as.ref, opt = as.opt;
				var i = 0, l = path.length;
				for(i; i < l; i++){
					ref = ref.get(path[i], null, {path: true}); // TODO: API change! We won't need 'path: true' anymore.
				}
				if(as.not || Gun.node.soul(at.obj)){
					at.soul(Gun.node.soul(at.obj) || (as.opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)());
					return;
				}
				(as.stun = as.stun || {})[path] = true;
				if(as.res){
					as.res(1);
				}
				ref.any(soul, {as: {at: at, as: as}, '.': null});
			}

			function soul(at, ev){ var as = this.as, cat = this.at;
				ev.stun(); // TODO: BUG!?
				ev.off();
				cat.soul(Gun.node.soul(cat.obj) || Gun.node.soul(at.put) || Gun.val.rel.is(at.put) || (as.opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)()); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
				as.stun[cat.path] = false;
				as.batch();
			}

			function any(at, ev){ 
				function implicit(at){ // TODO: CLEAN UP!!!!!
					if(!at || !at.get){ return } // TODO: CLEAN UP!!!!!
					as.data = obj_put({}, tmp = at.get, as.data); // TODO: CLEAN UP!!!!!
					at = at.via; // TODO: CLEAN UP!!!!!
					if(!at){ return } // TODO: CLEAN UP!!!!!
					tmp = at.get; // TODO: CLEAN UP!!!!!
					if(!at.via || !at.via.get){ return } // TODO: CLEAN UP!!!!!
					implicit(at);  // TODO: CLEAN UP!!!!!
				} // TODO: CLEAN UP!!!!!
				var as = this;
				if(at.err){ 
					console.log("Please report this as an issue! Put.any.err");
					return 
				}
				var cat = as.ref._, data = at.put, opt = as.opt, root, tmp;
				if(u === data){
					if(opt.init || as.gun.Back('opt.init')){
						return;
					}
					/*
						TODO: THIS WHOLE SECTION NEEDS TO BE CLEANED UP!
						Implicit behavior should be much cleaner. Right now it is hacky.
					*/
					// TODO: BUG!!!!!!! Apparently Gun.node.ify doesn't produce a valid HAM node?
					if(as.ref !== as.gun){ // TODO: CLEAN UP!!!!!
						tmp = as.gun._.get; // TODO: CLEAN UP!!!!!
						if(!tmp){ return } // TODO: CLEAN UP!!!!!
						as.data = obj_put({}, tmp, as.data);
						tmp = u;
					}
					if(as.gun.Back(-1) !== cat.back){
						implicit(at);
					}
					tmp = tmp || at.get;
					any.call(as, {
						put: as.data,
						get: as.not = as.soul = tmp
					}, ev);
					return;
				}
				ev.off(ev.stun());
				if(!as.not && !(as.soul = Gun.node.soul(data))){
					if(as.path && obj_is(as.data)){ // Apparently necessary
						as.soul = (opt.uuid || as.gun.Back('opt.uuid') || Gun.text.random)();
					} else {
						/*
							TODO: CLEAN UP! Is any of this necessary?
						*/
						if(!at.get){
							console.log("Please report this as an issue! Put.any.no.soul");
							return;
						}
						(as.next = as.next || Gun.on.next(as.ref))(function(next){
							// TODO: BUG! Maybe don't go back up 1 because .put already does that if ref isn't already specified?
							(root = as.ref.Back(1)).put(data = obj_put({}, at.get, as.data), opt.any, opt, {
								opt: opt,
								ref: root
							});
							//Gun.obj.to(opt, {
							//	ref: null,
							//	gun: null,
							//	next: null,
							//	data: data
							//}));
							//next(); // TODO: BUG! Needed? Not needed?
						});
						return;
					}
				}
				if(as.ref !== as.gun && !as.not){
					tmp = as.gun._.get;
					if(!tmp){
						console.log("Please report this as an issue! Put.no.get"); // TODO: BUG!??
						return;
					}
					as.data = obj_put({}, tmp, as.data);
				}
				as.ref.put(as.data, opt.any, opt, as);
			}
			var obj = Gun.obj, obj_has = obj.has, obj_put = obj.put;
			var u, noop = function(){};
		}());

		;(function(){
			Gun.chain.get = function(lex, cb, opt){
				if(!opt || !opt.path){ var back = this.Back(-1); } // TODO: CHANGING API! Remove this line!
				var gun, back = back || this, cat = back._;
				var path = cat.path || empty, tmp;
				if(typeof lex === 'string'){
					if(!(gun = path[lex])){
						gun = cache(lex, back);
					}
				} else
				if(!lex && 0 != lex){
					(gun = back.chain())._.err = {err: Gun.log('Invalid get request!', lex)};
					if(cb){ cb.call(gun, gun._.err) }
					return gun;
				} else
				if(num_is(lex)){
					return back.get(''+lex, cb, opt);
				} else
				if(tmp = lex.soul){
					if(!(gun = path[tmp])){
						gun = cache(tmp, back);
					}
					if(tmp = lex.field){
						(opt = opt || {}).path = true;
						return gun.get(tmp, cb, opt);
					}
				} else
				if(tmp = lex[_soul]){
					if(!(gun = path[tmp])){
						gun = cache(tmp, back);
					}
					if(tmp = lex[_field]){
						(opt = opt || {}).path = true;
						return gun.get(tmp, cb, opt);
					}
				}
				if(tmp = cat.stun){
					gun._.stun = gun._.stun || tmp;
				}
				if(cb && cb instanceof Function){
					((opt = opt || {}).gun = opt.gun || gun).any(cb, opt);
				}
				return gun;
			}
			function cache(key, back){
				var cat = back._, path = cat.path, gun = back.chain(), at = gun._;
				if(!path){ path = cat.path = {} }
				path[at.get = key] = gun;
				at.stun = at.stun || cat.stun; // TODO: BUG! Clean up! This is kinda ugly. These need to be attached all the way down regardless of whether a gun chain has been cached or not for the first time. 
				Gun.on('path', at);
				//gun.on('in', input, at); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
				gun.on('out', output, at); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
				return gun;
			}
			function output(at){
				var cat = this, gun = cat.gun, root = gun.Back(-1), put, get, tmp;
				if(!at.gun){
					at.gun = gun;
				}
				console.debug(10, 'out', cat.get, at.get);
				if(at.get && !at.get[_soul]){
					if(typeof at.get === 'string'){ // request for soul!
						if(cat.ask){
							if(cat.ask[at.get]){
								return;
							}
							cat.ask[at.get] = at['#'] || 1;
							cat.on('in', function(tac, ev){ ev.off();
								var tmp = tac.put;
								if(tmp && u !== tmp[at.get] && (tmp = (cat.path||empty)[at.get])){
									tmp = tmp._;
									tmp.change = tac.put[at.get];
									tmp.put = tac.put[at.get];
									// TODO: Could we pass it to input/map function since they already do this?
									tmp.on('in', {
										get: at.get,
										put: tac.put[at.get],
										gun: tmp.gun,
										via: tac
									})
									return;
								}
								if(!(tmp = Gun.node.soul(tmp = tac.put) || Gun.val.rel.is(tmp))){
									tmp = (cat.path||empty)[at.get];
									if(!tmp){ return }
									tmp.on('in', {get: at.get, gun:tmp, via: tac});
									return;
								}
								cat.ask[at.get] = 0;
								tmp = {'#': tmp, '.': at.get};
								tmp = {gun: at.gun, get: tmp};
								tmp['#'] = Gun.on.ask(ack, tmp);
								at.gun.on('out', tmp);
							}).off();
							return;
						}
						cat.ask = obj_put({}, at.get, at['#'] || 1);
						gun.on('in', input, cat);
						if(root === cat.back){
							cat.ask[at.get] = 0;
							tmp = {'#': cat.get, '.': at.get};
							tmp = {gun: at.gun, get: tmp};
							tmp['#'] = Gun.on.ask(ack, tmp);
							at.gun.on('out', tmp);
							return;
						}
						console.debug(7, 'out', cat.get, at.get, cat.ask);
						cat.back.on('out', {
							gun: cat.gun,
							get: cat.get
						});
						return;
					} else
					if(at.get instanceof Function){
						if(!cat.ask){
							var opt = at.opt || {};
							tmp = obj_has(opt, '.'); // TODO: CLEAN UP!
							cat.ask = tmp? {} : {_:1}; // TODO: CLEAN UP!
							gun.on('in', input, cat);
							if(root === cat.back){
								if(cat.ask && cat.ask._){ cat.ask._ = 0 } // TODO: CLEAN UP!
								if(tmp && opt['.']){ cat.ask[opt['.']] = 0 } // TODO: CLEAN UP!
								tmp = tmp? {'#': cat.get, '.': opt['.']} : {'#': cat.get}; // TODO: CLEAN UP!
								tmp = {gun: at.gun, get: tmp};
								tmp['#'] = Gun.on.ask(ack, tmp);
								cat.back.on('out', tmp);
							} else {
								console.debug(6, 'out', cat.get);
								cat.back.on('out', {
									gun: cat.gun,
									get: cat.get
								});
							}
						}
						console.debug(9, 'out', cat.get);
						if(cat.stun && cat.stun(at)){ return }
						gun.on('in', at.get, at);
						return;
					}
				}
				cat.back.on('out', at);
			}
			function input(at, ev){ var cat = this, tmp;
				cat.id = cat.id || Gun.text.random(5); // TOD: BUG! This allows for 1B item entropy in memory. In the future, people might want to expand this to be larger.
				if(at.err){
					console.log("Please report this as an issue! In.err"); // TODO: BUG!
					return;
				}
				console.debug(10, 'input', at, cat.get);
				if(value.call(cat, at, ev)){
					return;
				}
				if(tmp = cat.link){
					if(tmp = tmp.res){
						// TODO: BUG! Ordering of the change set? What if the proxied object has a change but the parent has a happened too. Pretend that the parent changed the field such that it no longer point to the proxy. But in the changeset it might get iterated over last, thus it the update will get triggered here now for the proxy, even though this update is suppose to unsubscribe itself. Or what if this ordering is inconsistent? Or is this just basically impossible from the API's put perspective?
						tmp(cat); // TODO: BUG! What about via? Do we need to clone this?
					}
				}
				obj_map(cat.change, map, {at: at, cat: cat});
			}
			Gun.chain.get.input = input;
			function value(at, ev){
				//var cat = this, is = (u === at.put) || Gun.val.is(at.put), rel = Gun.val.rel.is(at.put), tmp, u;
				var cat = this, put = cat.change, rel, tmp, u;
				if(u === put){
					not(cat, at);
					return true;
				}
				if(!cat.link && Gun.node.soul(put) && (rel = Gun.node.soul(at.put))){
				console.debug(11, 'value', put);
					ask(cat, rel);
					return false;
				}
				if(!(rel = Gun.val.rel.is(put))){
					if(!Gun.val.is(put)){
						return false;
					}
					not(cat, at);
					return true;
				}
				//cat.change = at.put;
				if(cat.link){
					if(rel === cat.link.rel){
						ev.stun();
						tmp = cat.link.ref._;
						cat.change = tmp.change;
						cat.put = at.put = tmp.put; // TODO: BUG! Mutating at event? Needed for certain tests, but is this bad?
						return false;
					}
					not(cat, at);
				}
				tmp = ev.stun(tmp);
				//cat.put = u; // For performance sake, do this now to prevent `.val` from firing.
				tmp = cat.link = {rel: rel, ref: cat.gun.Back(-1).get(rel), res: tmp, as: cat};
				// TODO: BUG???? Below allows subscriptions to happen without the soul itself being subscribed. Will this cause problems? I think it should be okay. Not sure what test is necessary.
				tmp.sub = tmp.ref._.on('in', proxy, tmp); // TODO: BUG! If somebody does `.off` how do we clean up these things from memory?
				if(tmp.ran){ return }
				ask(cat, rel);
				if(!tmp.ran){
					tmp.res(); // This is necessary for things that listen for a soul or relation only.
				}
				return true;
			}
			function map(data, key){ // Map over only the changes on every update.
				if(Gun._.meta === key){ return }
				var cat = this.cat, path = cat.path || {}, gun, at, tmp;
				if(!(gun = path[key])){ return }
				if(cat.put && obj_has(cat.put, key)){ data = cat.put[key] } // But use the actual data.
				(at = gun._).change = cat.change[key];
				at.put = data;
				if(tmp = Gun.val.rel.is(at.put)){ // PERFORMANCE HACK!
					if(tmp = gun.Back(-1).get(tmp)._.put){ // PERFORMANCE HACK!
						at.put = data = tmp; // PERFORMANCE HACK!
					}
				}
				gun.on('in', {
					put: data,
					get: key,
					gun: gun,
					via: this.at
				});
			}
			function not(cat, at){
				var tmp, u;
				tmp = cat.link;
				if(u !== cat.put){ cat.link = null; } // TODO: BUG! This may mean `not` will be fired multiple times until data is found. Is this okay?
				if(null === tmp){ return }
				if(tmp){
					if(tmp.sub){
						tmp.sub.off();
					}
					tmp.sub = false;
				}
				obj_map(cat.ask, function(v,key){
					cat.ask[key] = 1;
					if(!(v = (cat.path||empty)[key])){ return }
					(tmp = v._).put = tmp.change = u;
					v.on('in', {get: key, put: u, gun: v, via: at});
				});
			}
			function ask(cat, soul){
				if(!cat.ask){ return }
				var tmp = cat.ask, lex;
				if(obj_has(tmp, '_')){
					if(!tmp._){ return }
					tmp._ = 0;
					lex = {gun: cat.gun, get: {'#': soul}};
					lex['#'] = Gun.on.ask(ack, lex);
					cat.gun.on('out', lex);
					return;
				}
				// TODO: PERF! Make it so we do not have to iterate through this every time?
				obj_map(tmp, function(v,key){
					if(!v || (cat.put && cat.put[key])){ return } // TODO: This seems like an optimization? But does it have side effects? Probably not without the tmp[key] = 0;
					if(!(v = (cat.path||empty)[key])){ return }
					tmp[key] = 0;
					lex = {gun: v, get: {'#': soul, '.': key}};
					lex['#'] = Gun.on.ask(ack, lex);
					v.on('out', lex);
				});
			}
			function proxy(at, ev){ var link = this;
				link.ran = true;
				if(false === link.sub){ return ev.off() } // will this auto clean itself up?
				link.as.change = link.ref._.change;
				link.as.put = at.put;
				input.call(link.as, at, ev); // TODO: BUG! What about via? Do we need to clone this?
			}
			Gun.chain.any = function(any, opt){
				if(!any){ return this }
				var chain = this, cat = chain._, opt = opt || {}, last = {};//function(){};
				if(opt.change){ opt.change = 1 }
				console.debug(5, 'any');
				chain.on('out', {get: function(at, ev){
						//console.log("any!", at);
						if(!at.gun){ console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%EXPLODE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%', at) }
						var gun = at.gun || chain, cat = gun._;
						var data = cat.put || at.put, tmp;
						if((tmp = at.put) && tmp[Gun.val.rel._] && (tmp = Gun.val.rel.is(tmp))){
							if(null !== opt['.']){
								return;
							}
							at = obj_to(at, {put: data = cat.change = cat.put = Gun.state.ify(Gun.node.ify({}, tmp))});
						}
						// TODO: BUG! Need to use at.put > cat.put for merged cache?
						if(tmp = opt.change){ // TODO: BUG! Opt is outer scope, gun/cat/data might be iterative and thus only inner scope? Aka, we can't use it for all of them. 
							if(1 === tmp){
								opt.change = true;
							} else {
								data = cat.change;
								at = obj_to(at, {put: data});
							}
						}
						var id = cat.id+at.get;
						/*
						if(last[id] == data && obj_has(last, id)){ return }
						last[id] = data; // TODO: PERF! Memory optimizaiton? Can we avoid this.
						*/
					
						if(last.put === data && last.get === id){ return }
						last.get = id;
						last.put = data;
						
						cat.last = data;
						if(opt.as){
							any.call(opt.as, at, ev);
						} else {
							any.call(gun, at.err, data, at.get, cat, ev);
						}
					}, opt: opt
				});
				return chain;
			}
			function ack(at, ev){ var lex = this.get, chain = this.gun;
				var s = lex['#'], f = lex['.'], root = at.gun.Back(-1), gun = root.get(s), tmp;
				if(tmp = at.put){
					if(!f || obj_has(tmp[s], f)){
						ev.off();
						at['@'] = 0;
						return root.on('in', at);
					}
					/*
					if(!tmp[s] && !obj_empty(tmp)){ // TODO: BUG! Seems like it just causes unnecessary data/event to be triggered. Nothing genuinely useful.
						ev.off(); // TODO: BUG!? It isn't matching data by lex means, but it IS a reply?
						at['@'] = 0;
						return root.on('in', at);
					}
					*/
					if(f && gun._.put){
						gun = gun.get(f, null, {path:true});
						if(!chain){
							console.log("Please report this as an issue! ack.chain");
							return;
						}
						chain.on('in', {
							err: at.err,
							get: f,
							gun: chain,
							via: {get:s,via:at}
						});
						return;
					}
				}
				if(gun._.put){
					gun = gun.get(f, null, {path:true});
					gun.on('in', {
						err: at.err,
						get: f,
						gun: gun,
						via: {get:s,via:at}
					});
					return;
				}
				gun.on('in', {
					err: at.err,
					put: at.put? at.put[s] || at.put : at.put,
					get: s,
					gun: gun,
					via: at
				});
			}
			var obj = Gun.obj, obj_has = obj.has, obj_to = obj.to;
			var empty = {}, u;
			var _soul = Gun._.soul, _field = Gun._.field, _sid = Gun.on.ask._, _rid = Gun.on.ack._;
		}());

		;(function(){
			Gun.chain.key = function(index, cb, opt){
				if(!index){
					if(cb){
						cb.call(this, {err: Gun.log('No key!')});
					}
					return this;
				}
				var gun = this;
				if(typeof opt === 'string'){
					console.log("Please report this as an issue! key.opt.string");
					return gun;
				}
				if(gun === gun._.root){if(cb){cb({err: Gun.log("Can't do that on root instance.")})};return gun}
				opt = opt || {};
				opt.key = index;
				opt.any = cb || function(){};
				opt.ref = gun.Back(-1).get(opt.key);
				opt.gun = opt.gun || gun;
				gun.on(key, {as: opt});
				if(!opt.data){
					opt.res = Gun.on.stun(opt.ref);
				}
				return gun;
			}
			function key(at, ev){ var opt = this;
				ev.off();
				opt.soul = Gun.node.soul(at.put);
				if(!opt.soul || opt.key === opt.soul){ return opt.data = {} }
				opt.data = obj_put({}, keyed._, Gun.node.ify(obj_put({}, opt.soul, Gun.val.rel.ify(opt.soul)), '#'+opt.key+'#'))
				if(opt.res){
					opt.res(1);
				}
				opt.ref.put(opt.data, opt.any, {soul: opt.key, key: opt.key});
				if(opt.res){
					opt.res();
				}
			}
			function keyed(f){
				if(!f || !('#' === f[0] && '#' === f[f.length-1])){ return }
				var s = f.slice(1,-1);
				if(!s){ return }
				return s;
			}
			keyed._ = '##';
			Gun.on('path', function(at){
				var gun = at.gun;
				if(gun.Back(-1) !== at.back){ return }
				gun.on('in', pseudo, gun._);
				gun.on('out', normalize, gun._);
			});
			function normalize(at){ var cat = this;
				if(!at.put){
					if(at.get){
						search.call(cat, at);
					}
					return;
				}
				if(at.opt && at.opt.key){ return }
				var put = at.put, graph = cat.gun.Back(-1)._.graph;
				Gun.graph.is(put, function(node, soul){
					if(!Gun.node.is(graph['#'+soul+'#'], function each(rel,id){
						if(id !== Gun.val.rel.is(rel)){ return }
						if(rel = graph['#'+id+'#']){
							Gun.node.is(rel, each);
							return;
						}
						Gun.node.soul.ify(rel = put[id] = Gun.obj.copy(node), id);
					})){ return }
					Gun.obj.del(put, soul);
				});
			}
			function search(at){ var cat = this;
				var tmp;
				if(!Gun.obj.is(at.get)){ return }
				if(cat.pseudo){

				}
				if((tmp = at.opt) && (null === tmp['.'])){
					tmp['.'] = '##';
					return;
				}
				if((tmp = at.get) && Gun.obj.has(tmp, '.')){
					tmp = at['#'];
					at['#'] = Gun.on.ask(proxy);
				}
				var tried = {};
				function proxy(ack, ev){
					ev.off();
					var put = ack.put, lex = at.get;
					if(!cat.pseudo){ return Gun.on.ack(tmp, ack) }
					if(ack.put){
						if(!lex['.']){
							return Gun.on.ack(tmp, ack);
						}
						if(obj_has(ack.put[lex['#']], lex['.'])){
							return Gun.on.ack(tmp, ack);
						}
					}
					Gun.obj.map(cat.seen, function(ref,id){ // TODO: BUG! In-memory versus future?
						if(tried[id]){
							return Gun.on.ack(tmp, ack);
						}
						tried[id] = true;
						ref.on('out', {
							gun: ref,
							get: id = {'#': id, '.': at.get['.']},
							'#': Gun.on.ask(proxy)
						});
					});
				}
			}
			function pseudo(at, ev){ var cat = this;
				if(cat.pseudo){
					ev.stun();
					if(cat.pseudo === at.put){ return }
					cat.change = cat.changed || cat.pseudo;
					cat.on('in', Gun.obj.to(at, {put: cat.put = cat.pseudo}));
					return;
				}
				if(!at.put){ return }
				var rel = Gun.val.rel.is(at.put[keyed._]);
				if(!rel){ return }
				var soul = Gun.node.soul(at.put), resume = ev.stun(resume), root = cat.gun.Back(-1), seen = cat.seen = {};
				cat.pseudo = cat.put = Gun.state.ify(Gun.node.ify({}, soul));
				root.get(rel).on(each, true);
				function each(change){
					Gun.node.is(change, map);
				}
				function map(rel, soul){
					if(soul !== Gun.val.rel.is(rel)){ return }
					if(seen[soul]){ return }
					seen[soul] = root.get(soul).on(on, true);
				}
				function on(put){
					cat.pseudo = Gun.HAM.union(cat.pseudo, put) || cat.pseudo;
					cat.change = cat.changed = put;
					cat.put = cat.pseudo;
					resume({
						gun: cat.gun,
						put: cat.pseudo,
						get: soul
						//via: this.at
					});
				}
			}
			var obj = Gun.obj, obj_has = obj.has;
		}());

		Gun.chain.path = function(field, cb, opt){
			var back = this, gun = back, tmp;
			opt = opt || {}; opt.path = true;
			if(gun === gun._.root){if(cb){cb({err: Gun.log("Can't do that on root instance.")})}return gun}
			if(typeof field === 'string'){
				tmp = field.split(opt.split || '.');
				if(1 === tmp.length){
					return back.get(field, cb, opt);
				}
				field = tmp;
			}
			if(field instanceof Array){
				if(field.length > 1){
					gun = back;
					var i = 0, l = field.length;
					for(i; i < l; i++){
						console.debug(3, 'path', field[i]);
						console.debug(2, 'path', field[i]);
						gun = gun.get(field[i], (i+1 === l)? cb : null, opt);
					}
					gun.back = back; // TODO: API change!
				} else {
					gun = back.get(field[0], cb, opt);
				}
				return gun;
			}
			if(!field && 0 != field){
				return back;
			}
			return back.get(''+field, cb, opt);
		}

		;(function(){
			Gun.chain.on = function(tag, arg, eas, as){
				var gun = this, at = gun._, tmp;
				if(!at.on){ at.on = Gun.on }
				if(typeof tag === 'string'){
					if(!arg){ return at.on(tag) }
					at.on(tag, arg, eas || at, as);
					return gun;
				}
				var opt = arg;
				opt = (true === opt)? {change: true} : opt || {}; 
				opt.ok = tag;
				gun.any(ok, {as: opt, change: opt.change}); // TODO: PERF! Event listener leak!!!????
				return gun;
			}

			function ok(cat, ev){ var opt = this;
				var data = cat.put, tmp; 
				// TODO: BUG! Need to use at.put > cat.put for merged cache?
				if(u === data){ return }
				if(opt.as){
					//console.log("BANANA CREAM PIE", opt);
					opt.ok.call(opt.as, cat, ev);
				} else {
					//console.log("HICADOO DAAH", cat, opt);
					opt.ok.call(cat.gun, data, cat.get, cat, ev);
				}
			}

					//if(obj_empty(value, Gun._.meta) && !(opt && opt.empty)){ // TODO: PERF! Deprecate!???
						
					//} else {
						//console.log("value", value);
						//if(!(value||empty)['#']/* || !val_rel_is(value)*/){ // TODO: Performance hit!???? // TODO: BUG! WE should avoid this. So that way it is usable with gun plugin chains.
							//cb.call(gun, value, at.get); // TODO: BUG! What about stun?
							//return gun;
						//}
					//}

			// TODO: BUG! What about stun?
			Gun.chain.val = function(cb, opt){
				var gun = this, at = gun._, value = at.put;
				if(!at.stun && u !== value){
					cb.call(gun, value, at.get);
					return gun;
				}
				if(cb){
					(opt = opt || {}).ok = cb;
					opt.cat = at;
					console.debug(4, 'val', at);
					gun.any(val, {as: opt});
					opt.async = true;
				}
				return gun;
			}

			function val(at, ev, to){ var opt = this;
				var cat = opt.cat, data = at.put;
				if(u === data){
					return;
				}
				clearTimeout(ev.to);
				if(!to && opt.async){
					ev.to = setTimeout(function(){
						val.call(opt, at, ev, ev.to || 1)
					}, opt.wait || 99);
					return;
				}
				ev.off();
				opt.ok.call(at.gun || opt.gun, data, at.get); // TODO: BUG! opt.gun?
			}

			Gun.chain.off = function(){
				var gun = this, at = gun._, tmp;
				var back = at.back || {}, cat = back._;
				if(!cat){ return }
				if(tmp = cat.path){
					if(tmp[at.get]){
						obj_del(tmp, at.get);
					} else {
						obj_map(tmp, function(path, key){
							if(gun !== path){ return }
							obj_del(tmp, key);
						});
					}
				}
				if((tmp = gun.Back(-1)) === back){
					obj_del(tmp.graph, at.get);
				}
				if(at.ons && (tmp = at.ons['@$'])){
					obj_map(tmp.s, function(ev){
						ev.off();
					});
				}
				return gun;
			}
			var obj = Gun.obj, obj_has = obj.has, obj_del = obj.del, obj_to = obj.to;
			var val_rel_is = Gun.val.rel.is;
			var empty = {}, u;
		}());

		;(function(){
			Gun.chain.not = function(cb, opt, t){
				var gun = this, at = Gun.obj.to(gun._, {not: {not: cb}});
				gun.any(ought, {as: at});
				return gun;
			}
			function ought(cat, ev){ ev.off(); var at = this; // TODO: BUG! Is this correct?
				if(cat.err || cat.put){ return }
				if(!at.not || !at.not.not){ return }
				//ev.stun(); // TODO: BUG? I think this is correct. NOW INCORRECT because as things mutate we might want to retrigger!
				at.not.not.call(at.gun, at.get, function(){ console.log("Please report this bug on https://gitter.im/amark/gun and in the issues."); need.to.implement; });
			}
		}());

		;(function(){
			Gun.chain.map = function(cb, opt, t){
				var gun = this, cat = gun._, chain = cat.map;
				if(!chain){
					chain = cat.map = gun.chain();
					var list = (cat = chain._).list = cat.list || {};
					chain.on('in').map = {};
					chain.on('out', function(at){
						console.debug(8, 'map out', at);
				 		if(at.get instanceof Function){
							chain.on('in', at.get, at);
							return;
						} else {
							console.debug(9, 'map out', at);
							chain.on('in', gun.get.input, at.gun._);
						}
					});
					if(opt !== false){
						gun.on(map, {change: true, as: cat});
						console.debug(1, 'map');
					}
				}
				if(cb){
					chain.on(cb);
				}
				return chain;
			}
			function map(at,ev){
				var cat = this, gun = at.gun || this.back, tac = gun._;
				obj_map(at.put, each, {gun:gun, cat: cat, id: tac.id||at.get});
			}
			function each(v,f){
				if(n_ === f){ return }
				var gun = this.gun, cat = this.cat, id = this.id;
				if(cat.list[id+f]){ return }
				// TODO: BUG! Ghosting!
				cat.list[id+f] = gun.path(f).on(function(v,f,a,ev){
					//cat.on('in',[{gun:this,get:f,put:v},ev]);
					cat.on('in',[id+f,{gun:this,get:f,put:v},ev]);
				});
			}
			var obj_map = Gun.obj.map, noop = function(){}, event = {stun: noop, off: noop}, n_ = Gun.node._;
		}());

		;(function(){
			Gun.chain.init = function(){ // TODO: DEPRECATE?
				(this._.opt = this._.opt || {}).init = true;
				return this.Back(-1).put(Gun.node.ify({}, this._.get), null, this._.get);
			}
		}());

		;(function(){
			Gun.chain.set = function(item, cb, opt){
				var gun = this;
				cb = cb || function(){};
				return item.val(function(node){
					var put = {}, soul = Gun.node.soul(node);
					if(!soul){ return cb.call(gun, {err: Gun.log('Only a node can be linked! Not "' + node + '"!')}) }
					gun.put(Gun.obj.put(put, soul, Gun.val.rel.ify(soul)), cb, opt);
				});
			}
		}());
	})(require, './api');

	;require(function(module){
		if(typeof JSON === 'undefined'){ throw new Error("Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js") } // for old IE use
		if(typeof Gun === 'undefined'){ return } // TODO: localStorage is Browser only. But it would be nice if it could somehow plugin into NodeJS compatible localStorage APIs?
		
		var root, noop = function(){};
		if(typeof window !== 'undefined'){ root = window }
		var store = root.localStorage || {setItem: noop, removeItem: noop, getItem: noop};

		function put(at){ var err, id, opt, root = at.gun._.root;
			(opt = at.opt || {}).prefix = opt.prefix || 'gun/';
			Gun.graph.is(at.put, function(node, soul){
				//try{store.setItem(opt.prefix + soul, Gun.text.ify(node));
				try{store.setItem(opt.prefix + soul, Gun.text.ify(root._.graph[soul]||node));
				}catch(e){ err = e || "localStorage failure" }
			});
			//console.log('@@@@@@@@@@local put!');
			Gun.on.ack(at, {err: err, ok: 0}); // TODO: Reliability! Are we sure we want to have localStorage ack?
		}
		function get(at){
			var gun = at.gun, lex = at.get, soul, data, opt, u;
			//setTimeout(function(){
			(opt = at.opt || {}).prefix = opt.prefix || 'gun/';
			if(!lex || !(soul = lex[Gun._.soul])){ return }
			data = Gun.obj.ify(store.getItem(opt.prefix + soul) || null);
			if(!data){ return } // localStorage isn't trustworthy to say "not found".
			if(Gun.obj.has(lex, '.')){var tmp = data[lex['.']];data = {_: data._};if(u !== tmp){data[lex['.']] = tmp}}
			//console.log('@@@@@@@@@@@@local get', data, at);
			gun.Back(-1).on('in', {'@': at['#'], put: Gun.graph.node(data)});
			//},100);
		}
		Gun.on('put', put);
		Gun.on('get', get);
	})(require, './adapters/localStorage');
	
	;require(function(module){
		function r(base, body, cb, opt){
			var o = base.length? {base: base} : {};
			o.base = opt.base || base;
			o.body = opt.body || body;
			o.headers = opt.headers;
			o.url = opt.url;
			o.out = opt.out;
			cb = cb || function(){};
			if(!o.base){ return }
			r.transport(o, cb);
		}
		r.createServer = function(fn){ r.createServer.s.push(fn) }
		r.createServer.ing = function(req, cb){
			var i = r.createServer.s.length;
			while(i--){ (r.createServer.s[i] || function(){})(req, cb) }
		}
		r.createServer.s = [];
		r.back = 2; r.backoff = 2;
		r.transport = function(opt, cb){
			//Gun.log("TRANSPORT:", opt);
			if(r.ws(opt, cb)){ return }
			r.jsonp(opt, cb);
		}
		r.ws = function(opt, cb, req){
			var ws, WS = window.WebSocket || window.mozWebSocket || window.webkitWebSocket;
			if(!WS){ return }
			if(ws = r.ws.peers[opt.base]){
				req = req || {};
				if(opt.headers){ req.headers = opt.headers }
				if(opt.body){ req.body = opt.body }
				if(opt.url){ req.url = opt.url }
				req.headers = req.headers || {};
				if(!opt.out && !ws.cbs[req.headers['ws-rid']]){
					ws.cbs[req.headers['ws-rid'] = 'WS' + (+ new Date()) + '.' + Math.floor((Math.random()*65535)+1)] = function(err,res){
						if(!res || res.body || res.end){ delete ws.cbs[req.headers['ws-rid']] }
						cb(err,res);
					}
				}
				if(!ws.readyState){ return setTimeout(function(){ r.ws(opt, cb, req) },100), true }
				ws.sending = true;
				ws.send(JSON.stringify(req));
				return true;
			}
			if(ws === false){ return }
			(ws = r.ws.peers[opt.base] = new WS(opt.base.replace('http','ws'))).cbs = {};
			ws.onopen = function(o){ r.back = 2; r.ws(opt, cb) };
			ws.onclose = window.onbeforeunload = function(c){
				if(!ws || !c){ return }
				if(ws.close instanceof Function){ ws.close() }
				if(!ws.sending){
					ws = r.ws.peers[opt.base] = false;
					return r.transport(opt, cb);
				}
				r.each(ws.cbs, function(cb){
					cb({err: "WebSocket disconnected!", code: !ws.sending? -1 : (ws||{}).err || c.code});
				});
				ws = r.ws.peers[opt.base] = null; // this will make the next request try to reconnect
				setTimeout(function(){ // TODO: Have the driver handle this!
					r.ws(opt, function(){}); // opt here is a race condition, is it not? Does this matter?
				}, r.back *= r.backoff);
			};
			ws.onmessage = function(m){ var res;
				if(!m || !m.data){ return }
				try{res = JSON.parse(m.data);
				}catch(e){ return }
				if(!res){ return }
				res.headers = res.headers || {};
				if(res.headers['ws-rid']){ return (ws.cbs[res.headers['ws-rid']]||function(){})(null, res) }
				if(res.body){ r.createServer.ing(res, function(res){ res.out = true; r(opt.base, null, null, res)}) } // emit extra events.
			};
			ws.onerror = function(e){ (ws||{}).err = e };
			return true;
		}
		r.ws.peers = {};
		r.ws.cbs = {};
		r.jsonp = function(opt, cb){
			r.jsonp.ify(opt, function(url){
				if(!url){ return }
				r.jsonp.send(url, function(err, reply){
					cb(err, reply);
					r.jsonp.poll(opt, reply);
				}, opt.jsonp);
			});
		}
		r.jsonp.send = function(url, cb, id){
			var js = document.createElement('script');
			js.src = url;
			js.onerror = function(c){
				(window[js.id]||function(){})(null, {err: "JSONP failed!"});
			}
			window[js.id = id] = function(res, err){
				cb(err, res);
				cb.id = js.id;
				js.parentNode.removeChild(js);
				window[cb.id] = null; // TODO: BUG: This needs to handle chunking!
				try{delete window[cb.id];
				}catch(e){}
			}
			js.async = true;
			document.getElementsByTagName('head')[0].appendChild(js);
			return js;
		}
		r.jsonp.poll = function(opt, res){
			if(!opt || !opt.base || !res || !res.headers || !res.headers.poll){ return }
			(r.jsonp.poll.s = r.jsonp.poll.s || {})[opt.base] = r.jsonp.poll.s[opt.base] || setTimeout(function(){ // TODO: Need to optimize for Chrome's 6 req limit?
				//Gun.log("polling again");
				var o = {base: opt.base, headers: {pull: 1}};
				r.each(opt.headers, function(v,i){ o.headers[i] = v })
				r.jsonp(o, function(err, reply){
					delete r.jsonp.poll.s[opt.base];
					while(reply.body && reply.body.length && reply.body.shift){ // we're assuming an array rather than chunk encoding. :(
						var res = reply.body.shift();
						if(res && res.body){ r.createServer.ing(res, function(){ r(opt.base, null, null, res) }) } // emit extra events.
					}
				});
			}, res.headers.poll);
		}
		r.jsonp.ify = function(opt, cb){
			var uri = encodeURIComponent, q = '?';
			if(opt.url && opt.url.pathname){ q = opt.url.pathname + q; }
			q = opt.base + q;
			r.each((opt.url||{}).query, function(v, i){ q += uri(i) + '=' + uri(v) + '&' });
			if(opt.headers){ q += uri('`') + '=' + uri(JSON.stringify(opt.headers)) + '&' }
			if(r.jsonp.max < q.length){ return cb() }
			q += uri('jsonp') + '=' + uri(opt.jsonp = 'P'+Math.floor((Math.random()*65535)+1));
			if(opt.body){
				q += '&';
				var w = opt.body, wls = function(w,l,s){
					return uri('%') + '=' + uri(w+'-'+(l||w)+'/'+(s||w))  + '&' + uri('$') + '=';
				}
				if(typeof w != 'string'){
					w = JSON.stringify(w);
					q += uri('^') + '=' + uri('json') + '&';
				}
				w = uri(w);
				var i = 0, l = w.length
				, s = r.jsonp.max - (q.length + wls(l.toString()).length);
				if(s < 0){ return cb() }
				while(w){
					cb(q + wls(i, (i = i + s), l) + w.slice(0, i));
					w = w.slice(i);
				}
			} else {
				cb(q);
			}
		}
		r.jsonp.max = 2000;
		r.each = function(obj, cb, as){
			if(!obj || !cb){ return }
			for(var i in obj){
				if(obj.hasOwnProperty(i)){
					cb.call(as, obj[i], i);
				}
			}
		}
		module.exports = r;
	})(require, './polyfill/request');

	;require(function(module){
		P.request = require('./request');
		function P(p){
			if(!P.is(this)){ return new P(p) }
			this.peers = p;
		}
		P.is = function(p){ return (p instanceof P) }
		P.chain = P.prototype;
		function map(peer, url){
			var msg = this.msg;
			var opt = this.opt || {};
			opt.out = true;
			P.request(url, msg, null, opt);
		}
		P.chain.send = function(msg, opt){
			P.request.each(this.peers, map, {msg: msg, opt: opt});
		}
		module.exports = P;
	})(require, './polyfill/peer');

	;require(function(module){
		if(typeof JSON === 'undefined'){ throw new Error("Include JSON first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js") } // for old IE use
		if(typeof Gun === 'undefined'){ return } // TODO: window.Websocket is Browser only. But it would be nice if it could somehow merge it with lib/WSP?
		
		var root, noop = function(){};
		if(typeof window !== 'undefined'){ root = window }

		var Tab = {};
		Tab.on = Gun.on;//Gun.on.create();
		Tab.peers = require('../polyfill/peer');
		Gun.on('get', function(at){
			var gun = at.gun, opt = gun.Back('opt') || {}, peers = opt.peers;
			if(!peers || Gun.obj.empty(peers)){
				//setTimeout(function(){
				Gun.log.once('peers', "Warning! You have no peers to connect to!");
				at.gun.Back(-1).on('in', {'@': at['#']});
				//},100);
				return;
			}
			var msg = {
				'#': at['#'] || Gun.text.random(9), // msg ID
				'$': at.get // msg BODY
			};
			Tab.on(msg['#'], function(err, data){ // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
				if(data){
					at.gun.Back(-1).on('out', {'@': at['#'], err: err, put: data});
				} else {
					at.gun.Back(-1).on('in', {'@': at['#'], err: err, put: data});
				}
			});
			Tab.peers(peers).send(msg, {headers: {'gun-sid': Tab.server.sid}});
		});
		Gun.on('put', function(at){
			if(at['@']){ return }
			var opt = at.gun.Back('opt') || {}, peers = opt.peers;
			if(!peers || Gun.obj.empty(peers)){
				Gun.log.once('peers', "Warning! You have no peers to save to!");
				at.gun.Back(-1).on('in', {'@': at['#']});
				return;
			}
			if(false === opt.websocket || (at.opt && false === at.opt.websocket)){ return }
			var msg = {
				'#': at['#'] || Gun.text.random(9), // msg ID
				'$': at.put // msg BODY
			};
			Tab.on(msg['#'], function(err, ok){ // TODO: ONE? PERF! Clear out listeners, maybe with setTimeout?
				at.gun.Back(-1).on('in', {'@': at['#'], err: err, ok: ok});
			});
			Tab.peers(peers).send(msg, {headers: {'gun-sid': Tab.server.sid}});
		});
		// browser/client side Server!
		Gun.on('opt', function(at){ // TODO: BUG! Does not respect separate instances!!!
			if(Tab.server){ return }
			var gun = at.gun, server = Tab.server = {}, tmp;
			server.sid = Gun.text.random();
			Tab.peers.request.createServer(function(req, res){
				if(!req || !res || !req.body || !req.headers){ return }
				var msg = req.body;
				// AUTH for non-replies.
				if(server.msg(msg['#'])){ return }
				//server.on('network', Gun.obj.copy(req)); // Unless we have WebRTC, not needed.
				if(msg['@']){ // no need to process.
					if(Tab.ons[tmp = msg['@'] || msg['#']]){
						Tab.on(tmp, [msg['!'], msg['$']]);
					}
					return 
				}
				if(msg['$'] && msg['$']['#']){ return server.get(req, res) }
				else { return server.put(req, res) }
			});
			server.get = function(req, cb){
				var body = req.body, lex = body['$'], opt;
				var graph = gun._.root._.graph, node;
				if(!(node = graph[lex['#']])){ return } // Don't reply to data we don't have it in memory. TODO: Add localStorage?
				cb({body: {
					'#': server.msg(),
					'@': body['#'],
					'$': node
				}});
			}
			server.put = function(req, cb){
				var body = req.body, graph = body['$'];
				var __ = gun._.root._;
				if(!(graph = Gun.obj.map(graph, function(node, soul, map){ // filter out what we don't have in memory.
					if(!__.path[soul]){ return }
					map(soul, node);
				}))){ return }
				gun.on('out', {gun: gun, opt: {websocket: false}, put: graph, '#': Gun.on.ask(function(ack, ev){
					if(!ack){ return }
					ev.off();
					return cb({body: {
						'#': server.msg(),
						'@': body['#'],
						'$': ack,
						'!': ack.err
					}});
				})});
			}
			server.msg = function(id){
				if(!id){
					return server.msg.debounce[id = Gun.text.random(9)] = Gun.time.is(), id;
				}
				clearTimeout(server.msg.clear);
				server.msg.clear = setTimeout(function(){
					var now = Gun.time.is();
					Gun.obj.map(server.msg.debounce, function(t,id){
						if((now - t) < (1000 * 60 * 5)){ return }
						Gun.obj.del(server.msg.debounce, id);
					});
				},500);
				if(server.msg.debounce[id]){ 
					return server.msg.debounce[id] = Gun.time.is(), id;
				}
				server.msg.debounce[id] = Gun.time.is();
				return;
			};	
			server.msg.debounce = server.msg.debounce || {};
		});

	})(require, './adapters/wsp');

}());

},{"../polyfill/peer":undefined,"./HAM":undefined,"./graph":undefined,"./gun":11,"./index":12,"./node":undefined,"./on":undefined,"./onify":undefined,"./request":undefined,"./state":undefined,"./type":undefined,"./val":undefined}],12:[function(require,module,exports){
module.exports = require('./lib/server');
},{"./lib/server":16}],13:[function(require,module,exports){
// This was written by the wonderful Forrest Tait
// modified by Mark to be part of core for convenience
// twas not designed for production use
// only simple local development.
var Gun = require('../gun'),
	fs = require('fs'),
	file = {};

// queue writes, adapted from https://github.com/toolness/jsondown/blob/master/jsondown.js
var isWriting = false, queuedWrites = [];
function writeFile(path, disk, at){
	if(isWriting) return queuedWrites.push(at);
	isWriting = true;
	var contents = JSON.stringify(disk, null, 2);
	fs.writeFile(String(path), contents, function(err) {
		var batch = queuedWrites.splice(0);
		isWriting = false;
		at.gun.Back(-1).on('in', {'@': at['#'], err: err, ok: err? false : 1});
		if(!batch.length){ return }
		batch.forEach(function(at){
			at.gun.Back(-1).on('in', {'@': at['#'], err: err, ok: err? false : 1});
		});
	});
}

Gun.on('put', function(at){
	var gun = at.gun, graph = at.put, opt = at.opt || {};
	var __ = gun._.root._;
	Gun.obj.map(graph, function(node, soul){
		file.disk.graph[soul] = __.graph[soul] || graph[soul];
	});
	writeFile(opt.file || file.file, file.disk, at);
});
Gun.on('get', function(at){
	var gun = at.gun, lex = at.get, opt = at.opt;
	if(!lex){return}
	gun.Back(-1).on('in', {'@': at['#'], put: Gun.graph.node(file.disk.graph[lex['#']])});
	//at.cb(null, file.disk.graph[lex['#']]);
});

Gun.on('opt', function(at){
	var gun = at.gun, opts = at.opt;
	if ((opts.file === false) || (opts.s3 && opts.s3.key)) {
		return; // don't use this plugin if S3 is being used.
	}
	console.log("WARNING! This `file.js` module for gun is intended only for local development testing!")
	file.file = opts.file || file.file || 'data.json';
	file.raw = file.raw || (fs.existsSync || require('path').existsSync)(opts.file) ? fs.readFileSync(opts.file).toString() : null;
	file.disk = file.disk || Gun.obj.ify(file.raw || {graph: {}});
	file.disk.graph = file.disk.graph || {};
});

},{"../gun":11,"fs":undefined,"path":undefined}],14:[function(require,module,exports){
var Gun = require('../gun')
,	formidable = require('formidable')
,	url = require('url');
module.exports = function(req, res, next){
	next = next || function(){}; // if not next, and we don't handle it, we should res.end
	if(!req || !res){ return next() }
	if(!req.url){ return next() }
	if(!req.method){ return next() }
	var msg = {};
	msg.url = url.parse(req.url, true);
	msg.method = (req.method||'').toLowerCase();
	msg.headers = req.headers;
	var u, body
	,	form = new formidable.IncomingForm()
	,	post = function(err, body){
		if(u !== body){ msg.body = body }
		next(msg, function(reply){
			if(!res){ return }
			if(!reply){ return res.end() }
			if(Gun.obj.has(reply, 'statusCode') || Gun.obj.has(reply, 'status')){
				res.statusCode = reply.statusCode || reply.status;
			}
			if(reply.headers){
				if(!(res.headersSent || res.headerSent || res._headerSent || res._headersSent)){
					Gun.obj.map(reply.headers, function(val, field){
						if(val !== 0 && !val){ return }
						res.setHeader(field, val);
					});
				}
			}
			if(Gun.obj.has(reply,'chunk') || Gun.obj.has(reply,'write')){
				res.write(Gun.text.ify(reply.chunk || reply.write) || '');
			}
			if(Gun.obj.has(reply,'body') || Gun.obj.has(reply,'end')){
				res.end(Gun.text.ify(reply.body || reply.end) || '');
			}
		});
	}
	form.on('field',function(k,v){
		(body = body || {})[k] = v;
	}).on('file',function(k,v){
		return; // files not supported in gun yet
	}).on('error',function(e){
		if(form.done){ return }
		post(e);
	}).on('end', function(){
		if(form.done){ return }
		post(null, body);
	});
	form.parse(req);
}
},{"../gun":11,"formidable":6,"url":undefined}],15:[function(require,module,exports){
var Gun = require('../gun');
module.exports = function(req, cb){
	if(!req.url || !req.url.query || !req.url.query.jsonp){ return cb }
	cb.jsonp = req.url.query.jsonp;
	delete req.url.query.jsonp;
	Gun.obj.map(Gun.obj.ify(req.url.query['`']), function(val, i){
		req.headers[i] = val;
	});
	delete req.url.query['`'];
	if(req.url.query.$){
		req.body = req.url.query.$;
		if(!Gun.obj.has(req.url.query, '^') || 'json' == req.url.query['^']){
			req.body = Gun.obj.ify(req.body); // TODO: BUG! THIS IS WRONG! This doesn't handle multipart chunking, and will fail!
		}
	}
	delete req.url.query.$;
	delete req.url.query['^'];
	delete req.url.query['%'];
	var reply = {headers:{}};
	return function(res){
		if(!res){ return }
		if(res.headers){
			Gun.obj.map(res.headers, function(val, field){
				reply.headers[field] = val;
			});
		}
		reply.headers['Content-Type'] = "text/javascript";
		if(Gun.obj.has(res,'chunk') && (!reply.body || Gun.list.is(reply.chunks))){
			(reply.chunks = reply.chunks || []).push(res.chunk);
		}
		if(Gun.obj.has(res,'body')){
			reply.body = res.body; // self-reference yourself so on the client we can get the headers and body.
			reply.body = ';'+ cb.jsonp + '(' + Gun.text.ify(reply) + ');'; // javascriptify it! can't believe the client trusts us.
			cb(reply);
		}
	}
}

},{"../gun":11}],16:[function(require,module,exports){
;(function(){
	console.log("Hello wonderful person! :) I'm mark@gunDB.io, message me for help or with hatemail. I want to hear from you! <3");
	var Gun = require('../gun');
	console.log("TODO: MARK! UPDATE S3 DRIVER BEFORE PUBLISHING!")
	//require('./s3');
	require('./wsp');
	require('./file');
	module.exports = Gun;
}());

},{"../gun":11,"./file":13,"./wsp":18}],17:[function(require,module,exports){
var Gun = require('../gun')
,	url = require('url');
module.exports = function(wss, server, opt){
	wss.on('connection', function(ws){
		var req = {};
		ws.upgradeReq = ws.upgradeReq || {};
		req.url = url.parse(ws.upgradeReq.url||'');
		req.method = (ws.upgradeReq.method||'').toLowerCase();
		req.headers = ws.upgradeReq.headers || {};
		//Gun.log("wsReq", req);
		ws.on('message', function(msg){
			msg = Gun.obj.ify(msg);
			msg.url = msg.url || {};
			msg.url.pathname = (req.url.pathname||'') + (msg.url.pathname||'');
			Gun.obj.map(req.url, function(val, i){
				msg.url[i] = msg.url[i] || val; // reattach url
			});
			msg.method = msg.method || msg.body? 'put' : 'get';
			msg.headers = msg.headers || {};
			Gun.obj.map(opt.headers || req.headers, function(val, i){
				msg.headers[i] = msg.headers[i]; // reattach headers
			});
			server.call(ws, msg, function(reply){
				if(!ws || !ws.send || !ws._socket || !ws._socket.writable){ return }
				reply = reply || {};
				if(msg && msg.headers && msg.headers['ws-rid']){
					(reply.headers = reply.headers || {})['ws-rid'] = msg.headers['ws-rid'];
				}
				try{ws.send(Gun.text.ify(reply));
				}catch(e){} // juuuust in case. 
			});
		});
		ws.off = function(m){
			//Gun.log("ws.off", m);
			ws.send = null;
		}
		ws.on('close', ws.off);
		ws.on('error', ws.off);
	});
}

},{"../gun":11,"url":undefined}],18:[function(require,module,exports){
(function (__dirname){
;(function(wsp){
	/*
		TODO: SERVER PUSH!
		TODO: SERVER GET!
		TODO: SERVER PUSH!
		TODO: SERVER GET!
		TODO: SERVER PUSH!
		TODO: SERVER GET!
		TODO: SERVER PUSH!
		TODO: SERVER GET!
		TODO: SERVER PUSH!
		TODO: SERVER GET!
		TODO: SERVER PUSH!
		TODO: SERVER GET!
	*/
	var Gun = require('../gun')
	, formidable = require('formidable')
	, ws = require('ws').Server
	, http = require('./http')
	, url = require('url');
	Gun.on('opt', function(at){
		var gun = at.gun, opt = at.opt;
		gun.__ = at.root._;
		gun.__.opt.ws = opt.ws = gun.__.opt.ws || opt.ws || {};
		function start(server, port, app){
			if(app && app.use){ app.use(gun.wsp.server) }
			server = gun.__.opt.ws.server = gun.__.opt.ws.server || opt.ws.server || server;
			require('./ws')(gun.wsp.ws = gun.wsp.ws || new ws(gun.__.opt.ws), function(req, res){
				var ws = this;
				req.headers['gun-sid'] = ws.sid = ws.sid? ws.sid : req.headers['gun-sid'];
				ws.sub = ws.sub || gun.wsp.on('network', function(msg, ev){
					if(!ws || !ws.send || !ws._socket || !ws._socket.writable){ return ev.off() }
					if(!msg || (msg.headers && msg.headers['gun-sid'] === ws.sid)){ return }
					if(msg && msg.headers){ delete msg.headers['ws-rid'] }
					// TODO: BUG? ^ What if other peers want to ack? Do they use the ws-rid or a gun declared id?
					try{ws.send(Gun.text.ify(msg));
					}catch(e){} // juuuust in case. 
				});
				gun.wsp.wire(req, res);
			}, {headers: {'ws-rid': 1, 'gun-sid': 1}});
			gun.__.opt.ws.port = gun.__.opt.ws.port || opt.ws.port || port || 80;
		}
		var wsp = gun.wsp = gun.wsp || function(server){
			if(!server){ return gun }
			if(Gun.fns.is(server.address)){
				if(server.address()){
					start(server, server.address().port);
					return gun;
				}
			}
			if(Gun.fns.is(server.get) && server.get('port')){
				start(server, server.get('port'));
				return gun;
			}
			var listen = server.listen;
			server.listen = function(port){
				var serve = listen.apply(server, arguments);
				start(serve, port, server);
				return serve;
			}
			return gun;
		}
		gun.wsp.on = gun.wsp.on || Gun.on;
		gun.wsp.regex = gun.wsp.regex || opt.route || opt.path || /^\/gun/i;
		gun.wsp.poll = gun.wsp.poll || opt.poll || 1;
		gun.wsp.pull = gun.wsp.pull || opt.pull || gun.wsp.poll * 1000;
		gun.wsp.server = gun.wsp.server || function(req, res, next){ // http
			next = next || function(){};
			if(!req || !res){ return next(), false }
			if(!req.upgrade){ return next(), false }
			if(!req.url){ return next(), false }
			if(!req.method){ return next(), false }
			var msg = {};
			msg.url = url.parse(req.url, true);
			if(!gun.wsp.regex.test(msg.url.pathname)){ return next(), false } // TODO: BUG! If the option isn't a regex then this will fail!
			if(msg.url.pathname.replace(gun.wsp.regex,'').slice(0,3).toLowerCase() === '.js'){
				res.writeHead(200, {'Content-Type': 'text/javascript'});
				res.end(gun.wsp.js = gun.wsp.js || require('fs').readFileSync(__dirname + '/../gun.js')); // gun server is caching the gun library for the client
				return true;
			}
			return http(req, res, function(req, res){
				if(!req){ return next() }
				var stream, cb = res = require('./jsonp')(req, res);
				if(req.headers && (stream = req.headers['gun-sid'])){
					stream = (gun.wsp.peers = gun.wsp.peers || {})[stream] = gun.wsp.peers[stream] || {sid: stream};
					stream.drain = stream.drain || function(res){
						if(!res || !stream || !stream.queue || !stream.queue.length){ return }
						res({headers: {'gun-sid': stream.sid}, body: stream.queue });
						stream.off = setTimeout(function(){ stream = null }, gun.wsp.pull);
						stream.reply = stream.queue = null;
						return true;
					}
					stream.sub = stream.sub || gun.wsp.on('network', function(req, ev){
						if(!stream){ return ev.off() } // self cleans up after itself!
						if(!req || (req.headers && req.headers['gun-sid'] === stream.sid)){ return }
						(stream.queue = stream.queue || []).push(req);
						stream.drain(stream.reply);
					});
					cb = function(r){ (r.headers||{}).poll = gun.wsp.poll; res(r) }
					clearTimeout(stream.off);
					if(req.headers.pull){
						if(stream.drain(cb)){ return }
						return stream.reply = cb;
					}
				}
				gun.wsp.wire(req, cb);
			}), true;
		}
		if((gun.__.opt.maxSockets = opt.maxSockets || gun.__.opt.maxSockets) !== false){
			require('https').globalAgent.maxSockets = require('http').globalAgent.maxSockets = gun.__.opt.maxSockets || Infinity;
		}
		gun.wsp.msg = gun.wsp.msg || function(id){
			if(!id){
				return gun.wsp.msg.debounce[id = Gun.text.random(9)] = Gun.time.is(), id;
			}
			clearTimeout(gun.wsp.msg.clear);
			gun.wsp.msg.clear = setTimeout(function(){
				var now = Gun.time.is();
				Gun.obj.map(gun.wsp.msg.debounce, function(t,id){
					if((now - t) < (1000 * 60 * 5)){ return }
					Gun.obj.del(gun.wsp.msg.debounce, id);
				});
			},500);
			if(id = gun.wsp.msg.debounce[id]){ 
				return gun.wsp.msg.debounce[id] = Gun.time.is(), id;
			}
			gun.wsp.msg.debounce[id] = Gun.time.is();
			return;
		};
		gun.wsp.msg.debounce = gun.wsp.msg.debounce || {};
		gun.wsp.wire = gun.wsp.wire || (function(){
			// all streams, technically PATCH but implemented as PUT or POST, are forwarded to other trusted peers
			// except for the ones that are listed in the message as having already been sending to.
			// all states, implemented with GET, are replied to the source that asked for it.
			function tran(req, res){
				if(!req || !res || !req.body || !req.headers){ return }
				if(req.url){ req.url = url.format(req.url) }
				var msg = req.body;
				// AUTH for non-replies.
				if(gun.wsp.msg(msg['#'])){ return }
				gun.wsp.on('network', Gun.obj.copy(req));
				if(msg['@']){ return } // no need to process.
				if(msg['$'] && msg['$']['#']){ return tran.get(req, res) }
				//if(Gun.is.lex(msg['$'])){ return tran.get(req, res) }
				else { return tran.put(req, res) }
				cb({body: {hello: 'world'}});
				// TODO: BUG! server put should push.
			}
			tran.get = function(req, cb){
				var body = req.body, lex = body['$'], reply = {headers: {'Content-Type': tran.json}}, opt;
				gun.on('out', {gun: gun, get: lex, req: 1, '#': Gun.on.ask(function(at, ev){
					ev.off();
					var graph = at.put;
					return cb({headers: reply.headers, body: {
						'#': gun.wsp.msg(),
						'@': body['#'],
						'$': graph,
						'!': at.err
					}});
					return;
					if(Gun.obj.empty(node)){
						return cb({headers: reply.headers, body: node});
					} // we're out of stuff!
					/*
					(function(chunks){ // FEATURE! Stream chunks if the nodes are large!
						var max = 10, count = 0, soul = Gun.is.node.soul(node);
						if(Object.keys(node).length > max){
							var n = Gun.is.node.soul.ify({}, soul);
							Gun.obj.map(node, function(val, field){
								if(!(++count % max)){
									cb({headers: reply.headers, chunk: n}); // send node chunks
									n = Gun.is.node.soul.ify({}, soul);
								}
								Gun.is.node.state.ify([n, node], field, val);
							});
							if(count % max){ // finish off the last chunk
								cb({headers: reply.headers, chunk: n});
							}
						} else {
							cb({headers: reply.headers, chunk: node}); // send full node
						}
					}([]));
					*/
					cb({headers: reply.headers, chunk: node }); // Use this if you don't want streaming chunks feature.
				})});
			}
			tran.put = function(req, cb){
				//console.log("tran.put", req);
				// NOTE: It is highly recommended you do your own PUT/POSTs through your own API that then saves to gun manually.
				// This will give you much more fine-grain control over security, transactions, and what not.
				var body = req.body, graph = body['$'], reply = {headers: {'Content-Type': tran.json}}, opt;
				gun.on('out', {gun: gun, put: graph, '#': Gun.on.ask(function(ack, ev){
				//Gun.on('put', {gun: gun, put: graph, '#': Gun.on.ask(function(ack, ev){
					ev.off();
					return cb({headers: reply.headers, body: {
						'#': gun.wsp.msg(),
						'@': body['#'],
						'$': ack,
						'!': ack.err
					}});
				})});
				return;
				if(Gun.is.graph(req.body)){
					if(req.err = Gun.union(gun, req.body, function(err, ctx){ // TODO: BUG? Probably should give me ctx.graph
						if(err){ return cb({headers: reply.headers, body: {err: err || "Union failed."}}) }
						var ctx = ctx || {}; ctx.graph = {};
						Gun.is.graph(req.body, function(node, soul){
							ctx.graph[soul] = gun.__.graph[soul];
						});
						(gun.__.opt.wire.put || function(g,cb){cb("No save.")})(ctx.graph, function(err, ok){
							if(err){ return cb({headers: reply.headers, body: {err: err || "Failed."}}) } // TODO: err should already be an error object?
							cb({headers: reply.headers, body: {ok: ok || "Persisted."}});
							//console.log("tran.put <------------------------", ok);
						});
					}).err){ cb({headers: reply.headers, body: {err: req.err || "Union failed."}}) }
				} else {
					cb({headers: reply.headers, body: {err: "Not a valid graph!"}});
				}
			}
			gun.wsp.on('network', function(req){
				// TODO: MARK! You should move the networking events to here, not in WSS only.
			});
			tran.json = 'application/json';
			return tran;
		}());
		if(opt.server){
			wsp(opt.server);
		}
	});
}({}));

}).call(this,"/javascript\\Voxelarium.js\\node_modules\\gun\\lib")
},{"../gun":11,"./http":14,"./jsonp":15,"./ws":17,"formidable":6,"fs":undefined,"http":undefined,"https":undefined,"url":undefined,"ws":21}],19:[function(require,module,exports){
/*!
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');

function Options(defaults) {
  var internalValues = {};
  var values = this.value = {};
  Object.keys(defaults).forEach(function(key) {
    internalValues[key] = defaults[key];
    Object.defineProperty(values, key, {
      get: function() { return internalValues[key]; },
      configurable: false,
      enumerable: true
    });
  });
  this.reset = function() {
    Object.keys(defaults).forEach(function(key) {
      internalValues[key] = defaults[key];
    });
    return this;
  };
  this.merge = function(options, required) {
    options = options || {};
    if (Object.prototype.toString.call(required) === '[object Array]') {
      var missing = [];
      for (var i = 0, l = required.length; i < l; ++i) {
        var key = required[i];
        if (!(key in options)) {
          missing.push(key);
        }
      }
      if (missing.length > 0) {
        if (missing.length > 1) {
          throw new Error('options ' +
            missing.slice(0, missing.length - 1).join(', ') + ' and ' +
            missing[missing.length - 1] + ' must be defined');
        }
        else throw new Error('option ' + missing[0] + ' must be defined');
      }
    }
    Object.keys(options).forEach(function(key) {
      if (key in internalValues) {
        internalValues[key] = options[key];
      }
    });
    return this;
  };
  this.copy = function(keys) {
    var obj = {};
    Object.keys(defaults).forEach(function(key) {
      if (keys.indexOf(key) !== -1) {
        obj[key] = values[key];
      }
    });
    return obj;
  };
  this.read = function(filename, cb) {
    if (typeof cb == 'function') {
      var self = this;
      fs.readFile(filename, function(error, data) {
        if (error) return cb(error);
        var conf = JSON.parse(data);
        self.merge(conf);
        cb();
      });
    }
    else {
      var conf = JSON.parse(fs.readFileSync(filename));
      this.merge(conf);
    }
    return this;
  };
  this.isDefined = function(key) {
    return typeof values[key] != 'undefined';
  };
  this.isDefinedAndNonNull = function(key) {
    return typeof values[key] != 'undefined' && values[key] !== null;
  };
  Object.freeze(values);
  Object.freeze(this);
}

module.exports = Options;

},{"fs":undefined}],20:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty;

/**
 * An auto incrementing id which we can use to create "unique" Ultron instances
 * so we can track the event emitters that are added through the Ultron
 * interface.
 *
 * @type {Number}
 * @private
 */
var id = 0;

/**
 * Ultron is high-intelligence robot. It gathers intelligence so it can start improving
 * upon his rudimentary design. It will learn from your EventEmitting patterns
 * and exterminate them.
 *
 * @constructor
 * @param {EventEmitter} ee EventEmitter instance we need to wrap.
 * @api public
 */
function Ultron(ee) {
  if (!(this instanceof Ultron)) return new Ultron(ee);

  this.id = id++;
  this.ee = ee;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.on = function on(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.on(event, fn, context);

  return this;
};
/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.once = function once(event, fn, context) {
  fn.__ultron = this.id;
  this.ee.once(event, fn, context);

  return this;
};

/**
 * Remove the listeners we assigned for the given event.
 *
 * @returns {Ultron}
 * @api public
 */
Ultron.prototype.remove = function remove() {
  var args = arguments
    , event;

  //
  // When no event names are provided we assume that we need to clear all the
  // events that were assigned through us.
  //
  if (args.length === 1 && 'string' === typeof args[0]) {
    args = args[0].split(/[, ]+/);
  } else if (!args.length) {
    args = [];

    for (event in this.ee._events) {
      if (has.call(this.ee._events, event)) args.push(event);
    }
  }

  for (var i = 0; i < args.length; i++) {
    var listeners = this.ee.listeners(args[i]);

    for (var j = 0; j < listeners.length; j++) {
      event = listeners[j];

      //
      // Once listeners have a `listener` property that stores the real listener
      // in the EventEmitter that ships with Node.js.
      //
      if (event.listener) {
        if (event.listener.__ultron !== this.id) continue;
        delete event.listener.__ultron;
      } else {
        if (event.__ultron !== this.id) continue;
        delete event.__ultron;
      }

      this.ee.removeListener(args[i], event);
    }
  }

  return this;
};

/**
 * Destroy the Ultron instance, remove all listeners and release all references.
 *
 * @returns {Boolean}
 * @api public
 */
Ultron.prototype.destroy = function destroy() {
  if (!this.ee) return false;

  this.remove();
  this.ee = null;

  return true;
};

//
// Expose the module.
//
module.exports = Ultron;

},{}],21:[function(require,module,exports){
'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var WS = module.exports = require('./lib/WebSocket');

WS.Server = require('./lib/WebSocketServer');
WS.Sender = require('./lib/Sender');
WS.Receiver = require('./lib/Receiver');

/**
 * Create a new WebSocket server.
 *
 * @param {Object} options Server options
 * @param {Function} fn Optional connection listener.
 * @returns {WS.Server}
 * @api public
 */
WS.createServer = function createServer(options, fn) {
  var server = new WS.Server(options);

  if (typeof fn === 'function') {
    server.on('connection', fn);
  }

  return server;
};

/**
 * Create a new WebSocket connection.
 *
 * @param {String} address The URL/address we need to connect to.
 * @param {Function} fn Open listener.
 * @returns {WS}
 * @api public
 */
WS.connect = WS.createConnection = function connect(address, fn) {
  var client = new WS(address);

  if (typeof fn === 'function') {
    client.on('open', fn);
  }

  return client;
};

},{"./lib/Receiver":29,"./lib/Sender":31,"./lib/WebSocket":34,"./lib/WebSocketServer":35}],22:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var util = require('util');

function BufferPool(initialSize, growStrategy, shrinkStrategy) {
  if (this instanceof BufferPool === false) {
    throw new TypeError("Classes can't be function-called");
  }

  if (typeof initialSize === 'function') {
    shrinkStrategy = growStrategy;
    growStrategy = initialSize;
    initialSize = 0;
  }
  else if (typeof initialSize === 'undefined') {
    initialSize = 0;
  }
  this._growStrategy = (growStrategy || function(db, size) {
    return db.used + size;
  }).bind(null, this);
  this._shrinkStrategy = (shrinkStrategy || function(db) {
    return initialSize;
  }).bind(null, this);
  this._buffer = initialSize ? new Buffer(initialSize) : null;
  this._offset = 0;
  this._used = 0;
  this._changeFactor = 0;
  this.__defineGetter__('size', function(){
    return this._buffer == null ? 0 : this._buffer.length;
  });
  this.__defineGetter__('used', function(){
    return this._used;
  });
}

BufferPool.prototype.get = function(length) {
  if (this._buffer == null || this._offset + length > this._buffer.length) {
    var newBuf = new Buffer(this._growStrategy(length));
    this._buffer = newBuf;
    this._offset = 0;
  }
  this._used += length;
  var buf = this._buffer.slice(this._offset, this._offset + length);
  this._offset += length;
  return buf;
}

BufferPool.prototype.reset = function(forceNewBuffer) {
  var len = this._shrinkStrategy();
  if (len < this.size) this._changeFactor -= 1;
  if (forceNewBuffer || this._changeFactor < -2) {
    this._changeFactor = 0;
    this._buffer = len ? new Buffer(len) : null;
  }
  this._offset = 0;
  this._used = 0;
}

module.exports = BufferPool;

},{"util":undefined}],23:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

module.exports.BufferUtil = {
  merge: function(mergedBuffer, buffers) {
    var offset = 0;
    for (var i = 0, l = buffers.length; i < l; ++i) {
      var buf = buffers[i];
      buf.copy(mergedBuffer, offset);
      offset += buf.length;
    }
  },
  mask: function(source, mask, output, offset, length) {
    var maskNum = mask.readUInt32LE(0, true);
    var i = 0;
    for (; i < length - 3; i += 4) {
      var num = maskNum ^ source.readUInt32LE(i, true);
      if (num < 0) num = 4294967296 + num;
      output.writeUInt32LE(num, offset + i, true);
    }
    switch (length % 4) {
      case 3: output[offset + i + 2] = source[i + 2] ^ mask[2];
      case 2: output[offset + i + 1] = source[i + 1] ^ mask[1];
      case 1: output[offset + i] = source[i] ^ mask[0];
      case 0:;
    }
  },
  unmask: function(data, mask) {
    var maskNum = mask.readUInt32LE(0, true);
    var length = data.length;
    var i = 0;
    for (; i < length - 3; i += 4) {
      var num = maskNum ^ data.readUInt32LE(i, true);
      if (num < 0) num = 4294967296 + num;
      data.writeUInt32LE(num, i, true);
    }
    switch (length % 4) {
      case 3: data[i + 2] = data[i + 2] ^ mask[2];
      case 2: data[i + 1] = data[i + 1] ^ mask[1];
      case 1: data[i] = data[i] ^ mask[0];
      case 0:;
    }
  }
}

},{}],24:[function(require,module,exports){
'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

try {
  module.exports = require('bufferutil');
} catch (e) {
  module.exports = require('./BufferUtil.fallback');
}

},{"./BufferUtil.fallback":23,"bufferutil":undefined}],25:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

module.exports = {
  isValidErrorCode: function(code) {
    return (code >= 1000 && code <= 1011 && code != 1004 && code != 1005 && code != 1006) ||
         (code >= 3000 && code <= 4999);
  },
  1000: 'normal',
  1001: 'going away',
  1002: 'protocol error',
  1003: 'unsupported data',
  1004: 'reserved',
  1005: 'reserved for extensions',
  1006: 'reserved for extensions',
  1007: 'inconsistent or invalid data',
  1008: 'policy violation',
  1009: 'message too big',
  1010: 'extension handshake missing',
  1011: 'an unexpected condition prevented the request from being fulfilled',
};
},{}],26:[function(require,module,exports){

var util = require('util');

/**
 * Module exports.
 */

exports.parse = parse;
exports.format = format;

/**
 * Parse extensions header value
 */

function parse(value) {
  value = value || '';

  var extensions = {};

  value.split(',').forEach(function(v) {
    var params = v.split(';');
    var token = params.shift().trim();
    var paramsList = extensions[token] = extensions[token] || [];
    var parsedParams = {};

    params.forEach(function(param) {
      var parts = param.trim().split('=');
      var key = parts[0];
      var value = parts[1];
      if (typeof value === 'undefined') {
        value = true;
      } else {
        // unquote value
        if (value[0] === '"') {
          value = value.slice(1);
        }
        if (value[value.length - 1] === '"') {
          value = value.slice(0, value.length - 1);
        }
      }
      (parsedParams[key] = parsedParams[key] || []).push(value);
    });

    paramsList.push(parsedParams);
  });

  return extensions;
}

/**
 * Format extensions header value
 */

function format(value) {
  return Object.keys(value).map(function(token) {
    var paramsList = value[token];
    if (!util.isArray(paramsList)) {
      paramsList = [paramsList];
    }
    return paramsList.map(function(params) {
      return [token].concat(Object.keys(params).map(function(k) {
        var p = params[k];
        if (!util.isArray(p)) p = [p];
        return p.map(function(v) {
          return v === true ? k : k + '=' + v;
        }).join('; ');
      })).join('; ');
    }).join(', ');
  }).join(', ');
}

},{"util":undefined}],27:[function(require,module,exports){

var zlib = require('zlib');

var AVAILABLE_WINDOW_BITS = [8, 9, 10, 11, 12, 13, 14, 15];
var DEFAULT_WINDOW_BITS = 15;
var DEFAULT_MEM_LEVEL = 8;

PerMessageDeflate.extensionName = 'permessage-deflate';

/**
 * Per-message Compression Extensions implementation
 */

function PerMessageDeflate(options, isServer) {
  if (this instanceof PerMessageDeflate === false) {
    throw new TypeError("Classes can't be function-called");
  }

  this._options = options || {};
  this._isServer = !!isServer;
  this._inflate = null;
  this._deflate = null;
  this.params = null;
}

/**
 * Create extension parameters offer
 *
 * @api public
 */

PerMessageDeflate.prototype.offer = function() {
  var params = {};
  if (this._options.serverNoContextTakeover) {
    params.server_no_context_takeover = true;
  }
  if (this._options.clientNoContextTakeover) {
    params.client_no_context_takeover = true;
  }
  if (this._options.serverMaxWindowBits) {
    params.server_max_window_bits = this._options.serverMaxWindowBits;
  }
  if (this._options.clientMaxWindowBits) {
    params.client_max_window_bits = this._options.clientMaxWindowBits;
  } else if (this._options.clientMaxWindowBits == null) {
    params.client_max_window_bits = true;
  }
  return params;
};

/**
 * Accept extension offer
 *
 * @api public
 */

PerMessageDeflate.prototype.accept = function(paramsList) {
  paramsList = this.normalizeParams(paramsList);

  var params;
  if (this._isServer) {
    params = this.acceptAsServer(paramsList);
  } else {
    params = this.acceptAsClient(paramsList);
  }

  this.params = params;
  return params;
};

/**
 * Releases all resources used by the extension
 *
 * @api public
 */

PerMessageDeflate.prototype.cleanup = function() {
  if (this._inflate) {
    if (this._inflate.writeInProgress) {
      this._inflate.pendingClose = true;
    } else {
      if (this._inflate.close) this._inflate.close();
      this._inflate = null;
    }
  }
  if (this._deflate) {
    if (this._deflate.writeInProgress) {
      this._deflate.pendingClose = true;
    } else {
      if (this._deflate.close) this._deflate.close();
      this._deflate = null;
    }
  }
};

/**
 * Accept extension offer from client
 *
 * @api private
 */

PerMessageDeflate.prototype.acceptAsServer = function(paramsList) {
  var accepted = {};
  var result = paramsList.some(function(params) {
    accepted = {};
    if (this._options.serverNoContextTakeover === false && params.server_no_context_takeover) {
      return;
    }
    if (this._options.serverMaxWindowBits === false && params.server_max_window_bits) {
      return;
    }
    if (typeof this._options.serverMaxWindowBits === 'number' &&
        typeof params.server_max_window_bits === 'number' &&
        this._options.serverMaxWindowBits > params.server_max_window_bits) {
      return;
    }
    if (typeof this._options.clientMaxWindowBits === 'number' && !params.client_max_window_bits) {
      return;
    }

    if (this._options.serverNoContextTakeover || params.server_no_context_takeover) {
      accepted.server_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover) {
      accepted.client_no_context_takeover = true;
    }
    if (this._options.clientNoContextTakeover !== false && params.client_no_context_takeover) {
      accepted.client_no_context_takeover = true;
    }
    if (typeof this._options.serverMaxWindowBits === 'number') {
      accepted.server_max_window_bits = this._options.serverMaxWindowBits;
    } else if (typeof params.server_max_window_bits === 'number') {
      accepted.server_max_window_bits = params.server_max_window_bits;
    }
    if (typeof this._options.clientMaxWindowBits === 'number') {
      accepted.client_max_window_bits = this._options.clientMaxWindowBits;
    } else if (this._options.clientMaxWindowBits !== false && typeof params.client_max_window_bits === 'number') {
      accepted.client_max_window_bits = params.client_max_window_bits;
    }
    return true;
  }, this);

  if (!result) {
    throw new Error('Doesn\'t support the offered configuration');
  }

  return accepted;
};

/**
 * Accept extension response from server
 *
 * @api privaye
 */

PerMessageDeflate.prototype.acceptAsClient = function(paramsList) {
  var params = paramsList[0];
  if (this._options.clientNoContextTakeover != null) {
    if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
      throw new Error('Invalid value for "client_no_context_takeover"');
    }
  }
  if (this._options.clientMaxWindowBits != null) {
    if (this._options.clientMaxWindowBits === false && params.client_max_window_bits) {
      throw new Error('Invalid value for "client_max_window_bits"');
    }
    if (typeof this._options.clientMaxWindowBits === 'number' &&
        (!params.client_max_window_bits || params.client_max_window_bits > this._options.clientMaxWindowBits)) {
      throw new Error('Invalid value for "client_max_window_bits"');
    }
  }
  return params;
};

/**
 * Normalize extensions parameters
 *
 * @api private
 */

PerMessageDeflate.prototype.normalizeParams = function(paramsList) {
  return paramsList.map(function(params) {
    Object.keys(params).forEach(function(key) {
      var value = params[key];
      if (value.length > 1) {
        throw new Error('Multiple extension parameters for ' + key);
      }

      value = value[0];

      switch (key) {
      case 'server_no_context_takeover':
      case 'client_no_context_takeover':
        if (value !== true) {
          throw new Error('invalid extension parameter value for ' + key + ' (' + value + ')');
        }
        params[key] = true;
        break;
      case 'server_max_window_bits':
      case 'client_max_window_bits':
        if (typeof value === 'string') {
          value = parseInt(value, 10);
          if (!~AVAILABLE_WINDOW_BITS.indexOf(value)) {
            throw new Error('invalid extension parameter value for ' + key + ' (' + value + ')');
          }
        }
        if (!this._isServer && value === true) {
          throw new Error('Missing extension parameter value for ' + key);
        }
        params[key] = value;
        break;
      default:
        throw new Error('Not defined extension parameter (' + key + ')');
      }
    }, this);
    return params;
  }, this);
};

/**
 * Decompress message
 *
 * @api public
 */

PerMessageDeflate.prototype.decompress = function (data, fin, callback) {
  var endpoint = this._isServer ? 'client' : 'server';

  if (!this._inflate) {
    var maxWindowBits = this.params[endpoint + '_max_window_bits'];
    this._inflate = zlib.createInflateRaw({
      windowBits: 'number' === typeof maxWindowBits ? maxWindowBits : DEFAULT_WINDOW_BITS
    });
  }
  this._inflate.writeInProgress = true;

  var self = this;
  var buffers = [];

  this._inflate.on('error', onError).on('data', onData);
  this._inflate.write(data);
  if (fin) {
    this._inflate.write(new Buffer([0x00, 0x00, 0xff, 0xff]));
  }
  this._inflate.flush(function() {
    cleanup();
    callback(null, Buffer.concat(buffers));
  });

  function onError(err) {
    cleanup();
    callback(err);
  }

  function onData(data) {
    buffers.push(data);
  }

  function cleanup() {
    if (!self._inflate) return;
    self._inflate.removeListener('error', onError);
    self._inflate.removeListener('data', onData);
    self._inflate.writeInProgress = false;
    if ((fin && self.params[endpoint + '_no_context_takeover']) || self._inflate.pendingClose) {
      if (self._inflate.close) self._inflate.close();
      self._inflate = null;
    }
  }
};

/**
 * Compress message
 *
 * @api public
 */

PerMessageDeflate.prototype.compress = function (data, fin, callback) {
  var endpoint = this._isServer ? 'server' : 'client';

  if (!this._deflate) {
    var maxWindowBits = this.params[endpoint + '_max_window_bits'];
    this._deflate = zlib.createDeflateRaw({
      flush: zlib.Z_SYNC_FLUSH,
      windowBits: 'number' === typeof maxWindowBits ? maxWindowBits : DEFAULT_WINDOW_BITS,
      memLevel: this._options.memLevel || DEFAULT_MEM_LEVEL
    });
  }
  this._deflate.writeInProgress = true;

  var self = this;
  var buffers = [];

  this._deflate.on('error', onError).on('data', onData);
  this._deflate.write(data);
  this._deflate.flush(function() {
    cleanup();
    var data = Buffer.concat(buffers);
    if (fin) {
      data = data.slice(0, data.length - 4);
    }
    callback(null, data);
  });

  function onError(err) {
    cleanup();
    callback(err);
  }

  function onData(data) {
    buffers.push(data);
  }

  function cleanup() {
    if (!self._deflate) return;
    self._deflate.removeListener('error', onError);
    self._deflate.removeListener('data', onData);
    self._deflate.writeInProgress = false;
    if ((fin && self.params[endpoint + '_no_context_takeover']) || self._deflate.pendingClose) {
      if (self._deflate.close) self._deflate.close();
      self._deflate = null;
    }
  }
};

module.exports = PerMessageDeflate;

},{"zlib":undefined}],28:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var util = require('util');

/**
 * State constants
 */

var EMPTY = 0
  , BODY = 1;
var BINARYLENGTH = 2
  , BINARYBODY = 3;

/**
 * Hixie Receiver implementation
 */

function Receiver () {
  if (this instanceof Receiver === false) {
    throw new TypeError("Classes can't be function-called");
  }

  this.state = EMPTY;
  this.buffers = [];
  this.messageEnd = -1;
  this.spanLength = 0;
  this.dead = false;

  this.onerror = function() {};
  this.ontext = function() {};
  this.onbinary = function() {};
  this.onclose = function() {};
  this.onping = function() {};
  this.onpong = function() {};
}

module.exports = Receiver;

/**
 * Add new data to the parser.
 *
 * @api public
 */

Receiver.prototype.add = function(data) {
  var self = this;
  function doAdd() {
    if (self.state === EMPTY) {
      if (data.length == 2 && data[0] == 0xFF && data[1] == 0x00) {
        self.reset();
        self.onclose();
        return;
      }
      if (data[0] === 0x80) {
        self.messageEnd = 0;
        self.state = BINARYLENGTH;
        data = data.slice(1);
      } else {

      if (data[0] !== 0x00) {
        self.error('payload must start with 0x00 byte', true);
        return;
      }
      data = data.slice(1);
      self.state = BODY;

      }
    }
    if (self.state === BINARYLENGTH) {
      var i = 0;
      while ((i < data.length) && (data[i] & 0x80)) {
        self.messageEnd = 128 * self.messageEnd + (data[i] & 0x7f);
        ++i;
      }
      if (i < data.length) {
        self.messageEnd = 128 * self.messageEnd + (data[i] & 0x7f);
        self.state = BINARYBODY;
        ++i;
      }
      if (i > 0)
        data = data.slice(i);
    }
    if (self.state === BINARYBODY) {
      var dataleft = self.messageEnd - self.spanLength;
      if (data.length >= dataleft) {
        // consume the whole buffer to finish the frame
        self.buffers.push(data);
        self.spanLength += dataleft;
        self.messageEnd = dataleft;
        return self.parse();
      }
      // frame's not done even if we consume it all
      self.buffers.push(data);
      self.spanLength += data.length;
      return;
    }
    self.buffers.push(data);
    if ((self.messageEnd = bufferIndex(data, 0xFF)) != -1) {
      self.spanLength += self.messageEnd;
      return self.parse();
    }
    else self.spanLength += data.length;
  }
  while(data) data = doAdd();
};

/**
 * Releases all resources used by the receiver.
 *
 * @api public
 */

Receiver.prototype.cleanup = function() {
  this.dead = true;
  this.state = EMPTY;
  this.buffers = [];
};

/**
 * Process buffered data.
 *
 * @api public
 */

Receiver.prototype.parse = function() {
  var output = new Buffer(this.spanLength);
  var outputIndex = 0;
  for (var bi = 0, bl = this.buffers.length; bi < bl - 1; ++bi) {
    var buffer = this.buffers[bi];
    buffer.copy(output, outputIndex);
    outputIndex += buffer.length;
  }
  var lastBuffer = this.buffers[this.buffers.length - 1];
  if (this.messageEnd > 0) lastBuffer.copy(output, outputIndex, 0, this.messageEnd);
  if (this.state !== BODY) --this.messageEnd;
  var tail = null;
  if (this.messageEnd < lastBuffer.length - 1) {
    tail = lastBuffer.slice(this.messageEnd + 1);
  }
  this.reset();
  this.ontext(output.toString('utf8'));
  return tail;
};

/**
 * Handles an error
 *
 * @api private
 */

Receiver.prototype.error = function (reason, terminate) {
  this.reset();
  this.onerror(reason, terminate);
  return this;
};

/**
 * Reset parser state
 *
 * @api private
 */

Receiver.prototype.reset = function (reason) {
  if (this.dead) return;
  this.state = EMPTY;
  this.buffers = [];
  this.messageEnd = -1;
  this.spanLength = 0;
};

/**
 * Internal api
 */

function bufferIndex(buffer, byte) {
  for (var i = 0, l = buffer.length; i < l; ++i) {
    if (buffer[i] === byte) return i;
  }
  return -1;
}

},{"util":undefined}],29:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var util = require('util')
  , Validation = require('./Validation').Validation
  , ErrorCodes = require('./ErrorCodes')
  , BufferPool = require('./BufferPool')
  , bufferUtil = require('./BufferUtil').BufferUtil
  , PerMessageDeflate = require('./PerMessageDeflate');

/**
 * HyBi Receiver implementation
 */

function Receiver (extensions) {
  if (this instanceof Receiver === false) {
    throw new TypeError("Classes can't be function-called");
  }

  // memory pool for fragmented messages
  var fragmentedPoolPrevUsed = -1;
  this.fragmentedBufferPool = new BufferPool(1024, function(db, length) {
    return db.used + length;
  }, function(db) {
    return fragmentedPoolPrevUsed = fragmentedPoolPrevUsed >= 0 ?
      Math.ceil((fragmentedPoolPrevUsed + db.used) / 2) :
      db.used;
  });

  // memory pool for unfragmented messages
  var unfragmentedPoolPrevUsed = -1;
  this.unfragmentedBufferPool = new BufferPool(1024, function(db, length) {
    return db.used + length;
  }, function(db) {
    return unfragmentedPoolPrevUsed = unfragmentedPoolPrevUsed >= 0 ?
      Math.ceil((unfragmentedPoolPrevUsed + db.used) / 2) :
      db.used;
  });

  this.extensions = extensions || {};
  this.state = {
    activeFragmentedOperation: null,
    lastFragment: false,
    masked: false,
    opcode: 0,
    fragmentedOperation: false
  };
  this.overflow = [];
  this.headerBuffer = new Buffer(10);
  this.expectOffset = 0;
  this.expectBuffer = null;
  this.expectHandler = null;
  this.currentMessage = [];
  this.messageHandlers = [];
  this.expectHeader(2, this.processPacket);
  this.dead = false;
  this.processing = false;

  this.onerror = function() {};
  this.ontext = function() {};
  this.onbinary = function() {};
  this.onclose = function() {};
  this.onping = function() {};
  this.onpong = function() {};
}

module.exports = Receiver;

/**
 * Add new data to the parser.
 *
 * @api public
 */

Receiver.prototype.add = function(data) {
  var dataLength = data.length;
  if (dataLength == 0) return;
  if (this.expectBuffer == null) {
    this.overflow.push(data);
    return;
  }
  var toRead = Math.min(dataLength, this.expectBuffer.length - this.expectOffset);
  fastCopy(toRead, data, this.expectBuffer, this.expectOffset);
  this.expectOffset += toRead;
  if (toRead < dataLength) {
    this.overflow.push(data.slice(toRead));
  }
  while (this.expectBuffer && this.expectOffset == this.expectBuffer.length) {
    var bufferForHandler = this.expectBuffer;
    this.expectBuffer = null;
    this.expectOffset = 0;
    this.expectHandler.call(this, bufferForHandler);
  }
};

/**
 * Releases all resources used by the receiver.
 *
 * @api public
 */

Receiver.prototype.cleanup = function() {
  this.dead = true;
  this.overflow = null;
  this.headerBuffer = null;
  this.expectBuffer = null;
  this.expectHandler = null;
  this.unfragmentedBufferPool = null;
  this.fragmentedBufferPool = null;
  this.state = null;
  this.currentMessage = null;
  this.onerror = null;
  this.ontext = null;
  this.onbinary = null;
  this.onclose = null;
  this.onping = null;
  this.onpong = null;
};

/**
 * Waits for a certain amount of header bytes to be available, then fires a callback.
 *
 * @api private
 */

Receiver.prototype.expectHeader = function(length, handler) {
  if (length == 0) {
    handler(null);
    return;
  }
  this.expectBuffer = this.headerBuffer.slice(this.expectOffset, this.expectOffset + length);
  this.expectHandler = handler;
  var toRead = length;
  while (toRead > 0 && this.overflow.length > 0) {
    var fromOverflow = this.overflow.pop();
    if (toRead < fromOverflow.length) this.overflow.push(fromOverflow.slice(toRead));
    var read = Math.min(fromOverflow.length, toRead);
    fastCopy(read, fromOverflow, this.expectBuffer, this.expectOffset);
    this.expectOffset += read;
    toRead -= read;
  }
};

/**
 * Waits for a certain amount of data bytes to be available, then fires a callback.
 *
 * @api private
 */

Receiver.prototype.expectData = function(length, handler) {
  if (length == 0) {
    handler(null);
    return;
  }
  this.expectBuffer = this.allocateFromPool(length, this.state.fragmentedOperation);
  this.expectHandler = handler;
  var toRead = length;
  while (toRead > 0 && this.overflow.length > 0) {
    var fromOverflow = this.overflow.pop();
    if (toRead < fromOverflow.length) this.overflow.push(fromOverflow.slice(toRead));
    var read = Math.min(fromOverflow.length, toRead);
    fastCopy(read, fromOverflow, this.expectBuffer, this.expectOffset);
    this.expectOffset += read;
    toRead -= read;
  }
};

/**
 * Allocates memory from the buffer pool.
 *
 * @api private
 */

Receiver.prototype.allocateFromPool = function(length, isFragmented) {
  return (isFragmented ? this.fragmentedBufferPool : this.unfragmentedBufferPool).get(length);
};

/**
 * Start processing a new packet.
 *
 * @api private
 */

Receiver.prototype.processPacket = function (data) {
  if (this.extensions[PerMessageDeflate.extensionName]) {
    if ((data[0] & 0x30) != 0) {
      this.error('reserved fields (2, 3) must be empty', 1002);
      return;
    }
  } else {
    if ((data[0] & 0x70) != 0) {
      this.error('reserved fields must be empty', 1002);
      return;
    }
  }
  this.state.lastFragment = (data[0] & 0x80) == 0x80;
  this.state.masked = (data[1] & 0x80) == 0x80;
  var compressed = (data[0] & 0x40) == 0x40;
  var opcode = data[0] & 0xf;
  if (opcode === 0) {
    if (compressed) {
      this.error('continuation frame cannot have the Per-message Compressed bits', 1002);
      return;
    }
    // continuation frame
    this.state.fragmentedOperation = true;
    this.state.opcode = this.state.activeFragmentedOperation;
    if (!(this.state.opcode == 1 || this.state.opcode == 2)) {
      this.error('continuation frame cannot follow current opcode', 1002);
      return;
    }
  }
  else {
    if (opcode < 3 && this.state.activeFragmentedOperation != null) {
      this.error('data frames after the initial data frame must have opcode 0', 1002);
      return;
    }
    if (opcode >= 8 && compressed) {
      this.error('control frames cannot have the Per-message Compressed bits', 1002);
      return;
    }
    this.state.compressed = compressed;
    this.state.opcode = opcode;
    if (this.state.lastFragment === false) {
      this.state.fragmentedOperation = true;
      this.state.activeFragmentedOperation = opcode;
    }
    else this.state.fragmentedOperation = false;
  }
  var handler = opcodes[this.state.opcode];
  if (typeof handler == 'undefined') this.error('no handler for opcode ' + this.state.opcode, 1002);
  else {
    handler.start.call(this, data);
  }
};

/**
 * Endprocessing a packet.
 *
 * @api private
 */

Receiver.prototype.endPacket = function() {
  if (!this.state.fragmentedOperation) this.unfragmentedBufferPool.reset(true);
  else if (this.state.lastFragment) this.fragmentedBufferPool.reset(true);
  this.expectOffset = 0;
  this.expectBuffer = null;
  this.expectHandler = null;
  if (this.state.lastFragment && this.state.opcode === this.state.activeFragmentedOperation) {
    // end current fragmented operation
    this.state.activeFragmentedOperation = null;
  }
  this.state.lastFragment = false;
  this.state.opcode = this.state.activeFragmentedOperation != null ? this.state.activeFragmentedOperation : 0;
  this.state.masked = false;
  this.expectHeader(2, this.processPacket);
};

/**
 * Reset the parser state.
 *
 * @api private
 */

Receiver.prototype.reset = function() {
  if (this.dead) return;
  this.state = {
    activeFragmentedOperation: null,
    lastFragment: false,
    masked: false,
    opcode: 0,
    fragmentedOperation: false
  };
  this.fragmentedBufferPool.reset(true);
  this.unfragmentedBufferPool.reset(true);
  this.expectOffset = 0;
  this.expectBuffer = null;
  this.expectHandler = null;
  this.overflow = [];
  this.currentMessage = [];
  this.messageHandlers = [];
};

/**
 * Unmask received data.
 *
 * @api private
 */

Receiver.prototype.unmask = function (mask, buf, binary) {
  if (mask != null && buf != null) bufferUtil.unmask(buf, mask);
  if (binary) return buf;
  return buf != null ? buf.toString('utf8') : '';
};

/**
 * Concatenates a list of buffers.
 *
 * @api private
 */

Receiver.prototype.concatBuffers = function(buffers) {
  var length = 0;
  for (var i = 0, l = buffers.length; i < l; ++i) length += buffers[i].length;
  var mergedBuffer = new Buffer(length);
  bufferUtil.merge(mergedBuffer, buffers);
  return mergedBuffer;
};

/**
 * Handles an error
 *
 * @api private
 */

Receiver.prototype.error = function (reason, protocolErrorCode) {
  this.reset();
  this.onerror(reason, protocolErrorCode);
  return this;
};

/**
 * Execute message handler buffers
 *
 * @api private
 */

Receiver.prototype.flush = function() {
  if (this.processing || this.dead) return;

  var handler = this.messageHandlers.shift();
  if (!handler) return;

  this.processing = true;
  var self = this;

  handler(function() {
    self.processing = false;
    self.flush();
  });
};

/**
 * Apply extensions to message
 *
 * @api private
 */

Receiver.prototype.applyExtensions = function(messageBuffer, fin, compressed, callback) {
  var self = this;
  if (compressed) {
    this.extensions[PerMessageDeflate.extensionName].decompress(messageBuffer, fin, function(err, buffer) {
      if (self.dead) return;
      if (err) {
        callback(new Error('invalid compressed data'));
        return;
      }
      callback(null, buffer);
    });
  } else {
    callback(null, messageBuffer);
  }
};

/**
 * Buffer utilities
 */

function readUInt16BE(start) {
  return (this[start]<<8) +
         this[start+1];
}

function readUInt32BE(start) {
  return (this[start]<<24) +
         (this[start+1]<<16) +
         (this[start+2]<<8) +
         this[start+3];
}

function fastCopy(length, srcBuffer, dstBuffer, dstOffset) {
  switch (length) {
    default: srcBuffer.copy(dstBuffer, dstOffset, 0, length); break;
    case 16: dstBuffer[dstOffset+15] = srcBuffer[15];
    case 15: dstBuffer[dstOffset+14] = srcBuffer[14];
    case 14: dstBuffer[dstOffset+13] = srcBuffer[13];
    case 13: dstBuffer[dstOffset+12] = srcBuffer[12];
    case 12: dstBuffer[dstOffset+11] = srcBuffer[11];
    case 11: dstBuffer[dstOffset+10] = srcBuffer[10];
    case 10: dstBuffer[dstOffset+9] = srcBuffer[9];
    case 9: dstBuffer[dstOffset+8] = srcBuffer[8];
    case 8: dstBuffer[dstOffset+7] = srcBuffer[7];
    case 7: dstBuffer[dstOffset+6] = srcBuffer[6];
    case 6: dstBuffer[dstOffset+5] = srcBuffer[5];
    case 5: dstBuffer[dstOffset+4] = srcBuffer[4];
    case 4: dstBuffer[dstOffset+3] = srcBuffer[3];
    case 3: dstBuffer[dstOffset+2] = srcBuffer[2];
    case 2: dstBuffer[dstOffset+1] = srcBuffer[1];
    case 1: dstBuffer[dstOffset] = srcBuffer[0];
  }
}

function clone(obj) {
  var cloned = {};
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      cloned[k] = obj[k];
    }
  }
  return cloned;
}

/**
 * Opcode handlers
 */

var opcodes = {
  // text
  '1': {
    start: function(data) {
      var self = this;
      // decode length
      var firstLength = data[1] & 0x7f;
      if (firstLength < 126) {
        opcodes['1'].getData.call(self, firstLength);
      }
      else if (firstLength == 126) {
        self.expectHeader(2, function(data) {
          opcodes['1'].getData.call(self, readUInt16BE.call(data, 0));
        });
      }
      else if (firstLength == 127) {
        self.expectHeader(8, function(data) {
          if (readUInt32BE.call(data, 0) != 0) {
            self.error('packets with length spanning more than 32 bit is currently not supported', 1008);
            return;
          }
          opcodes['1'].getData.call(self, readUInt32BE.call(data, 4));
        });
      }
    },
    getData: function(length) {
      var self = this;
      if (self.state.masked) {
        self.expectHeader(4, function(data) {
          var mask = data;
          self.expectData(length, function(data) {
            opcodes['1'].finish.call(self, mask, data);
          });
        });
      }
      else {
        self.expectData(length, function(data) {
          opcodes['1'].finish.call(self, null, data);
        });
      }
    },
    finish: function(mask, data) {
      var self = this;
      var packet = this.unmask(mask, data, true) || new Buffer(0);
      var state = clone(this.state);
      this.messageHandlers.push(function(callback) {
        self.applyExtensions(packet, state.lastFragment, state.compressed, function(err, buffer) {
          if (err) return self.error(err.message, 1007);
          if (buffer != null) self.currentMessage.push(buffer);

          if (state.lastFragment) {
            var messageBuffer = self.concatBuffers(self.currentMessage);
            self.currentMessage = [];
            if (!Validation.isValidUTF8(messageBuffer)) {
              self.error('invalid utf8 sequence', 1007);
              return;
            }
            self.ontext(messageBuffer.toString('utf8'), {masked: state.masked, buffer: messageBuffer});
          }
          callback();
        });
      });
      this.flush();
      this.endPacket();
    }
  },
  // binary
  '2': {
    start: function(data) {
      var self = this;
      // decode length
      var firstLength = data[1] & 0x7f;
      if (firstLength < 126) {
        opcodes['2'].getData.call(self, firstLength);
      }
      else if (firstLength == 126) {
        self.expectHeader(2, function(data) {
          opcodes['2'].getData.call(self, readUInt16BE.call(data, 0));
        });
      }
      else if (firstLength == 127) {
        self.expectHeader(8, function(data) {
          if (readUInt32BE.call(data, 0) != 0) {
            self.error('packets with length spanning more than 32 bit is currently not supported', 1008);
            return;
          }
          opcodes['2'].getData.call(self, readUInt32BE.call(data, 4, true));
        });
      }
    },
    getData: function(length) {
      var self = this;
      if (self.state.masked) {
        self.expectHeader(4, function(data) {
          var mask = data;
          self.expectData(length, function(data) {
            opcodes['2'].finish.call(self, mask, data);
          });
        });
      }
      else {
        self.expectData(length, function(data) {
          opcodes['2'].finish.call(self, null, data);
        });
      }
    },
    finish: function(mask, data) {
      var self = this;
      var packet = this.unmask(mask, data, true) || new Buffer(0);
      var state = clone(this.state);
      this.messageHandlers.push(function(callback) {
        self.applyExtensions(packet, state.lastFragment, state.compressed, function(err, buffer) {
          if (err) return self.error(err.message, 1007);
          if (buffer != null) self.currentMessage.push(buffer);
          if (state.lastFragment) {
            var messageBuffer = self.concatBuffers(self.currentMessage);
            self.currentMessage = [];
            self.onbinary(messageBuffer, {masked: state.masked, buffer: messageBuffer});
          }
          callback();
        });
      });
      this.flush();
      this.endPacket();
    }
  },
  // close
  '8': {
    start: function(data) {
      var self = this;
      if (self.state.lastFragment == false) {
        self.error('fragmented close is not supported', 1002);
        return;
      }

      // decode length
      var firstLength = data[1] & 0x7f;
      if (firstLength < 126) {
        opcodes['8'].getData.call(self, firstLength);
      }
      else {
        self.error('control frames cannot have more than 125 bytes of data', 1002);
      }
    },
    getData: function(length) {
      var self = this;
      if (self.state.masked) {
        self.expectHeader(4, function(data) {
          var mask = data;
          self.expectData(length, function(data) {
            opcodes['8'].finish.call(self, mask, data);
          });
        });
      }
      else {
        self.expectData(length, function(data) {
          opcodes['8'].finish.call(self, null, data);
        });
      }
    },
    finish: function(mask, data) {
      var self = this;
      data = self.unmask(mask, data, true);

      var state = clone(this.state);
      this.messageHandlers.push(function() {
        if (data && data.length == 1) {
          self.error('close packets with data must be at least two bytes long', 1002);
          return;
        }
        var code = data && data.length > 1 ? readUInt16BE.call(data, 0) : 1000;
        if (!ErrorCodes.isValidErrorCode(code)) {
          self.error('invalid error code', 1002);
          return;
        }
        var message = '';
        if (data && data.length > 2) {
          var messageBuffer = data.slice(2);
          if (!Validation.isValidUTF8(messageBuffer)) {
            self.error('invalid utf8 sequence', 1007);
            return;
          }
          message = messageBuffer.toString('utf8');
        }
        self.onclose(code, message, {masked: state.masked});
        self.reset();
      });
      this.flush();
    },
  },
  // ping
  '9': {
    start: function(data) {
      var self = this;
      if (self.state.lastFragment == false) {
        self.error('fragmented ping is not supported', 1002);
        return;
      }

      // decode length
      var firstLength = data[1] & 0x7f;
      if (firstLength < 126) {
        opcodes['9'].getData.call(self, firstLength);
      }
      else {
        self.error('control frames cannot have more than 125 bytes of data', 1002);
      }
    },
    getData: function(length) {
      var self = this;
      if (self.state.masked) {
        self.expectHeader(4, function(data) {
          var mask = data;
          self.expectData(length, function(data) {
            opcodes['9'].finish.call(self, mask, data);
          });
        });
      }
      else {
        self.expectData(length, function(data) {
          opcodes['9'].finish.call(self, null, data);
        });
      }
    },
    finish: function(mask, data) {
      var self = this;
      data = this.unmask(mask, data, true);
      var state = clone(this.state);
      this.messageHandlers.push(function(callback) {
        self.onping(data, {masked: state.masked, binary: true});
        callback();
      });
      this.flush();
      this.endPacket();
    }
  },
  // pong
  '10': {
    start: function(data) {
      var self = this;
      if (self.state.lastFragment == false) {
        self.error('fragmented pong is not supported', 1002);
        return;
      }

      // decode length
      var firstLength = data[1] & 0x7f;
      if (firstLength < 126) {
        opcodes['10'].getData.call(self, firstLength);
      }
      else {
        self.error('control frames cannot have more than 125 bytes of data', 1002);
      }
    },
    getData: function(length) {
      var self = this;
      if (this.state.masked) {
        this.expectHeader(4, function(data) {
          var mask = data;
          self.expectData(length, function(data) {
            opcodes['10'].finish.call(self, mask, data);
          });
        });
      }
      else {
        this.expectData(length, function(data) {
          opcodes['10'].finish.call(self, null, data);
        });
      }
    },
    finish: function(mask, data) {
      var self = this;
      data = self.unmask(mask, data, true);
      var state = clone(this.state);
      this.messageHandlers.push(function(callback) {
        self.onpong(data, {masked: state.masked, binary: true});
        callback();
      });
      this.flush();
      this.endPacket();
    }
  }
}

},{"./BufferPool":22,"./BufferUtil":24,"./ErrorCodes":25,"./PerMessageDeflate":27,"./Validation":33,"util":undefined}],30:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var events = require('events')
  , util = require('util')
  , EventEmitter = events.EventEmitter;

/**
 * Hixie Sender implementation
 */

function Sender(socket) {
  if (this instanceof Sender === false) {
    throw new TypeError("Classes can't be function-called");
  }

  events.EventEmitter.call(this);

  this.socket = socket;
  this.continuationFrame = false;
  this.isClosed = false;
}

module.exports = Sender;

/**
 * Inherits from EventEmitter.
 */

util.inherits(Sender, events.EventEmitter);

/**
 * Frames and writes data.
 *
 * @api public
 */

Sender.prototype.send = function(data, options, cb) {
  if (this.isClosed) return;

  var isString = typeof data == 'string'
    , length = isString ? Buffer.byteLength(data) : data.length
    , lengthbytes = (length > 127) ? 2 : 1 // assume less than 2**14 bytes
    , writeStartMarker = this.continuationFrame == false
    , writeEndMarker = !options || !(typeof options.fin != 'undefined' && !options.fin)
    , buffer = new Buffer((writeStartMarker ? ((options && options.binary) ? (1 + lengthbytes) : 1) : 0) + length + ((writeEndMarker && !(options && options.binary)) ? 1 : 0))
    , offset = writeStartMarker ? 1 : 0;

  if (writeStartMarker) {
    if (options && options.binary) {
      buffer.write('\x80', 'binary');
      // assume length less than 2**14 bytes
      if (lengthbytes > 1)
        buffer.write(String.fromCharCode(128+length/128), offset++, 'binary');
      buffer.write(String.fromCharCode(length&0x7f), offset++, 'binary');
    } else
      buffer.write('\x00', 'binary');
  }

  if (isString) buffer.write(data, offset, 'utf8');
  else data.copy(buffer, offset, 0);

  if (writeEndMarker) {
    if (options && options.binary) {
      // sending binary, not writing end marker
    } else
      buffer.write('\xff', offset + length, 'binary');
    this.continuationFrame = false;
  }
  else this.continuationFrame = true;

  try {
    this.socket.write(buffer, 'binary', cb);
  } catch (e) {
    this.error(e.toString());
  }
};

/**
 * Sends a close instruction to the remote party.
 *
 * @api public
 */

Sender.prototype.close = function(code, data, mask, cb) {
  if (this.isClosed) return;
  this.isClosed = true;
  try {
    if (this.continuationFrame) this.socket.write(new Buffer([0xff], 'binary'));
    this.socket.write(new Buffer([0xff, 0x00]), 'binary', cb);
  } catch (e) {
    this.error(e.toString());
  }
};

/**
 * Sends a ping message to the remote party. Not available for hixie.
 *
 * @api public
 */

Sender.prototype.ping = function(data, options) {};

/**
 * Sends a pong message to the remote party. Not available for hixie.
 *
 * @api public
 */

Sender.prototype.pong = function(data, options) {};

/**
 * Handles an error
 *
 * @api private
 */

Sender.prototype.error = function (reason) {
  this.emit('error', reason);
  return this;
};

},{"events":undefined,"util":undefined}],31:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var events = require('events')
  , util = require('util')
  , EventEmitter = events.EventEmitter
  , ErrorCodes = require('./ErrorCodes')
  , bufferUtil = require('./BufferUtil').BufferUtil
  , PerMessageDeflate = require('./PerMessageDeflate');

/**
 * HyBi Sender implementation
 */

function Sender(socket, extensions) {
  if (this instanceof Sender === false) {
    throw new TypeError("Classes can't be function-called");
  }

  events.EventEmitter.call(this);

  this._socket = socket;
  this.extensions = extensions || {};
  this.firstFragment = true;
  this.compress = false;
  this.messageHandlers = [];
  this.processing = false;
}

/**
 * Inherits from EventEmitter.
 */

util.inherits(Sender, events.EventEmitter);

/**
 * Sends a close instruction to the remote party.
 *
 * @api public
 */

Sender.prototype.close = function(code, data, mask, cb) {
  if (typeof code !== 'undefined') {
    if (typeof code !== 'number' ||
      !ErrorCodes.isValidErrorCode(code)) throw new Error('first argument must be a valid error code number');
  }
  code = code || 1000;
  var dataBuffer = new Buffer(2 + (data ? Buffer.byteLength(data) : 0));
  writeUInt16BE.call(dataBuffer, code, 0);
  if (dataBuffer.length > 2) dataBuffer.write(data, 2);

  var self = this;
  this.messageHandlers.push(function(callback) {
    self.frameAndSend(0x8, dataBuffer, true, mask);
    callback();
    if (typeof cb == 'function') cb();
  });
  this.flush();
};

/**
 * Sends a ping message to the remote party.
 *
 * @api public
 */

Sender.prototype.ping = function(data, options) {
  var mask = options && options.mask;
  var self = this;
  this.messageHandlers.push(function(callback) {
    self.frameAndSend(0x9, data || '', true, mask);
    callback();
  });
  this.flush();
};

/**
 * Sends a pong message to the remote party.
 *
 * @api public
 */

Sender.prototype.pong = function(data, options) {
  var mask = options && options.mask;
  var self = this;
  this.messageHandlers.push(function(callback) {
    self.frameAndSend(0xa, data || '', true, mask);
    callback();
  });
  this.flush();
};

/**
 * Sends text or binary data to the remote party.
 *
 * @api public
 */

Sender.prototype.send = function(data, options, cb) {
  var finalFragment = options && options.fin === false ? false : true;
  var mask = options && options.mask;
  var compress = options && options.compress;
  var opcode = options && options.binary ? 2 : 1;
  if (this.firstFragment === false) {
    opcode = 0;
    compress = false;
  } else {
    this.firstFragment = false;
    this.compress = compress;
  }
  if (finalFragment) this.firstFragment = true

  var compressFragment = this.compress;

  var self = this;
  this.messageHandlers.push(function(callback) {
    self.applyExtensions(data, finalFragment, compressFragment, function(err, data) {
      if (err) {
        if (typeof cb == 'function') cb(err);
        else self.emit('error', err);
        return;
      }
      self.frameAndSend(opcode, data, finalFragment, mask, compress, cb);
      callback();
    });
  });
  this.flush();
};

/**
 * Frames and sends a piece of data according to the HyBi WebSocket protocol.
 *
 * @api private
 */

Sender.prototype.frameAndSend = function(opcode, data, finalFragment, maskData, compressed, cb) {
  var canModifyData = false;

  if (!data) {
    try {
      this._socket.write(new Buffer([opcode | (finalFragment ? 0x80 : 0), 0 | (maskData ? 0x80 : 0)].concat(maskData ? [0, 0, 0, 0] : [])), 'binary', cb);
    }
    catch (e) {
      if (typeof cb == 'function') cb(e);
      else this.emit('error', e);
    }
    return;
  }

  if (!Buffer.isBuffer(data)) {
    canModifyData = true;
    if (data && (typeof data.byteLength !== 'undefined' || typeof data.buffer !== 'undefined')) {
      data = getArrayBuffer(data);
    } else {
      //
      // If people want to send a number, this would allocate the number in
      // bytes as memory size instead of storing the number as buffer value. So
      // we need to transform it to string in order to prevent possible
      // vulnerabilities / memory attacks.
      //
      if (typeof data === 'number') data = data.toString();

      data = new Buffer(data);
    }
  }

  var dataLength = data.length
    , dataOffset = maskData ? 6 : 2
    , secondByte = dataLength;

  if (dataLength >= 65536) {
    dataOffset += 8;
    secondByte = 127;
  }
  else if (dataLength > 125) {
    dataOffset += 2;
    secondByte = 126;
  }

  var mergeBuffers = dataLength < 32768 || (maskData && !canModifyData);
  var totalLength = mergeBuffers ? dataLength + dataOffset : dataOffset;
  var outputBuffer = new Buffer(totalLength);
  outputBuffer[0] = finalFragment ? opcode | 0x80 : opcode;
  if (compressed) outputBuffer[0] |= 0x40;

  switch (secondByte) {
    case 126:
      writeUInt16BE.call(outputBuffer, dataLength, 2);
      break;
    case 127:
      writeUInt32BE.call(outputBuffer, 0, 2);
      writeUInt32BE.call(outputBuffer, dataLength, 6);
  }

  if (maskData) {
    outputBuffer[1] = secondByte | 0x80;
    var mask = this._randomMask || (this._randomMask = getRandomMask());
    outputBuffer[dataOffset - 4] = mask[0];
    outputBuffer[dataOffset - 3] = mask[1];
    outputBuffer[dataOffset - 2] = mask[2];
    outputBuffer[dataOffset - 1] = mask[3];
    if (mergeBuffers) {
      bufferUtil.mask(data, mask, outputBuffer, dataOffset, dataLength);
      try {
        this._socket.write(outputBuffer, 'binary', cb);
      }
      catch (e) {
        if (typeof cb == 'function') cb(e);
        else this.emit('error', e);
      }
    }
    else {
      bufferUtil.mask(data, mask, data, 0, dataLength);
      try {
        this._socket.write(outputBuffer, 'binary');
        this._socket.write(data, 'binary', cb);
      }
      catch (e) {
        if (typeof cb == 'function') cb(e);
        else this.emit('error', e);
      }
    }
  }
  else {
    outputBuffer[1] = secondByte;
    if (mergeBuffers) {
      data.copy(outputBuffer, dataOffset);
      try {
        this._socket.write(outputBuffer, 'binary', cb);
      }
      catch (e) {
        if (typeof cb == 'function') cb(e);
        else this.emit('error', e);
      }
    }
    else {
      try {
        this._socket.write(outputBuffer, 'binary');
        this._socket.write(data, 'binary', cb);
      }
      catch (e) {
        if (typeof cb == 'function') cb(e);
        else this.emit('error', e);
      }
    }
  }
};

/**
 * Execute message handler buffers
 *
 * @api private
 */

Sender.prototype.flush = function() {
  if (this.processing) return;

  var handler = this.messageHandlers.shift();
  if (!handler) return;

  this.processing = true;

  var self = this;

  handler(function() {
    self.processing = false;
    self.flush();
  });
};

/**
 * Apply extensions to message
 *
 * @api private
 */

Sender.prototype.applyExtensions = function(data, fin, compress, callback) {
  if (compress && data) {
    if ((data.buffer || data) instanceof ArrayBuffer) {
      data = getArrayBuffer(data);
    }
    this.extensions[PerMessageDeflate.extensionName].compress(data, fin, callback);
  } else {
    callback(null, data);
  }
};

module.exports = Sender;

function writeUInt16BE(value, offset) {
  this[offset] = (value & 0xff00)>>8;
  this[offset+1] = value & 0xff;
}

function writeUInt32BE(value, offset) {
  this[offset] = (value & 0xff000000)>>24;
  this[offset+1] = (value & 0xff0000)>>16;
  this[offset+2] = (value & 0xff00)>>8;
  this[offset+3] = value & 0xff;
}

function getArrayBuffer(data) {
  // data is either an ArrayBuffer or ArrayBufferView.
  var array = new Uint8Array(data.buffer || data)
    , l = data.byteLength || data.length
    , o = data.byteOffset || 0
    , buffer = new Buffer(l);
  for (var i = 0; i < l; ++i) {
    buffer[i] = array[o+i];
  }
  return buffer;
}

function getRandomMask() {
  return new Buffer([
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    ~~(Math.random() * 255),
    ~~(Math.random() * 255)
  ]);
}

},{"./BufferUtil":24,"./ErrorCodes":25,"./PerMessageDeflate":27,"events":undefined,"util":undefined}],32:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */
 
module.exports.Validation = {
  isValidUTF8: function(buffer) {
    return true;
  }
};


},{}],33:[function(require,module,exports){
'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

try {
  module.exports = require('utf-8-validate');
} catch (e) {
  module.exports = require('./Validation.fallback');
}

},{"./Validation.fallback":32,"utf-8-validate":undefined}],34:[function(require,module,exports){
'use strict';

/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var url = require('url')
  , util = require('util')
  , http = require('http')
  , https = require('https')
  , crypto = require('crypto')
  , stream = require('stream')
  , Ultron = require('ultron')
  , Options = require('options')
  , Sender = require('./Sender')
  , Receiver = require('./Receiver')
  , SenderHixie = require('./Sender.hixie')
  , ReceiverHixie = require('./Receiver.hixie')
  , Extensions = require('./Extensions')
  , PerMessageDeflate = require('./PerMessageDeflate')
  , EventEmitter = require('events').EventEmitter;

/**
 * Constants
 */

// Default protocol version

var protocolVersion = 13;

// Close timeout

var closeTimeout = 30 * 1000; // Allow 30 seconds to terminate the connection cleanly

/**
 * WebSocket implementation
 *
 * @constructor
 * @param {String} address Connection address.
 * @param {String|Array} protocols WebSocket protocols.
 * @param {Object} options Additional connection options.
 * @api public
 */
function WebSocket(address, protocols, options) {
  if (this instanceof WebSocket === false) {
    return new WebSocket(address, protocols, options);
  }

  EventEmitter.call(this);

  if (protocols && !Array.isArray(protocols) && 'object' === typeof protocols) {
    // accept the "options" Object as the 2nd argument
    options = protocols;
    protocols = null;
  }

  if ('string' === typeof protocols) {
    protocols = [ protocols ];
  }

  if (!Array.isArray(protocols)) {
    protocols = [];
  }

  this._socket = null;
  this._ultron = null;
  this._closeReceived = false;
  this.bytesReceived = 0;
  this.readyState = null;
  this.supports = {};
  this.extensions = {};

  if (Array.isArray(address)) {
    initAsServerClient.apply(this, address.concat(options));
  } else {
    initAsClient.apply(this, [address, protocols, options]);
  }
}

/**
 * Inherits from EventEmitter.
 */
util.inherits(WebSocket, EventEmitter);

/**
 * Ready States
 */
["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function each(state, index) {
    WebSocket.prototype[state] = WebSocket[state] = index;
});

/**
 * Gracefully closes the connection, after sending a description message to the server
 *
 * @param {Object} data to be sent to the server
 * @api public
 */
WebSocket.prototype.close = function close(code, data) {
  if (this.readyState === WebSocket.CLOSED) return;

  if (this.readyState === WebSocket.CONNECTING) {
    this.readyState = WebSocket.CLOSED;
    return;
  }

  if (this.readyState === WebSocket.CLOSING) {
    if (this._closeReceived && this._isServer) {
      this.terminate();
    }
    return;
  }

  var self = this;
  try {
    this.readyState = WebSocket.CLOSING;
    this._closeCode = code;
    this._closeMessage = data;
    var mask = !this._isServer;
    this._sender.close(code, data, mask, function(err) {
      if (err) self.emit('error', err);

      if (self._closeReceived && self._isServer) {
        self.terminate();
      } else {
        // ensure that the connection is cleaned up even when no response of closing handshake.
        clearTimeout(self._closeTimer);
        self._closeTimer = setTimeout(cleanupWebsocketResources.bind(self, true), closeTimeout);
      }
    });
  } catch (e) {
    this.emit('error', e);
  }
};

/**
 * Pause the client stream
 *
 * @api public
 */
WebSocket.prototype.pause = function pauser() {
  if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

  return this._socket.pause();
};

/**
 * Sends a ping
 *
 * @param {Object} data to be sent to the server
 * @param {Object} Members - mask: boolean, binary: boolean
 * @param {boolean} dontFailWhenClosed indicates whether or not to throw if the connection isnt open
 * @api public
 */
WebSocket.prototype.ping = function ping(data, options, dontFailWhenClosed) {
  if (this.readyState !== WebSocket.OPEN) {
    if (dontFailWhenClosed === true) return;
    throw new Error('not opened');
  }

  options = options || {};

  if (typeof options.mask === 'undefined') options.mask = !this._isServer;

  this._sender.ping(data, options);
};

/**
 * Sends a pong
 *
 * @param {Object} data to be sent to the server
 * @param {Object} Members - mask: boolean, binary: boolean
 * @param {boolean} dontFailWhenClosed indicates whether or not to throw if the connection isnt open
 * @api public
 */
WebSocket.prototype.pong = function(data, options, dontFailWhenClosed) {
  if (this.readyState !== WebSocket.OPEN) {
    if (dontFailWhenClosed === true) return;
    throw new Error('not opened');
  }

  options = options || {};

  if (typeof options.mask === 'undefined') options.mask = !this._isServer;

  this._sender.pong(data, options);
};

/**
 * Resume the client stream
 *
 * @api public
 */
WebSocket.prototype.resume = function resume() {
  if (this.readyState !== WebSocket.OPEN) throw new Error('not opened');

  return this._socket.resume();
};

/**
 * Sends a piece of data
 *
 * @param {Object} data to be sent to the server
 * @param {Object} Members - mask: boolean, binary: boolean, compress: boolean
 * @param {function} Optional callback which is executed after the send completes
 * @api public
 */

WebSocket.prototype.send = function send(data, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (this.readyState !== WebSocket.OPEN) {
    if (typeof cb === 'function') cb(new Error('not opened'));
    else throw new Error('not opened');
    return;
  }

  if (!data) data = '';
  if (this._queue) {
    var self = this;
    this._queue.push(function() { self.send(data, options, cb); });
    return;
  }

  options = options || {};
  options.fin = true;

  if (typeof options.binary === 'undefined') {
    options.binary = (data instanceof ArrayBuffer || data instanceof Buffer ||
      data instanceof Uint8Array ||
      data instanceof Uint16Array ||
      data instanceof Uint32Array ||
      data instanceof Int8Array ||
      data instanceof Int16Array ||
      data instanceof Int32Array ||
      data instanceof Float32Array ||
      data instanceof Float64Array);
  }

  if (typeof options.mask === 'undefined') options.mask = !this._isServer;
  if (typeof options.compress === 'undefined') options.compress = true;
  if (!this.extensions[PerMessageDeflate.extensionName]) {
    options.compress = false;
  }

  var readable = typeof stream.Readable === 'function'
    ? stream.Readable
    : stream.Stream;

  if (data instanceof readable) {
    startQueue(this);
    var self = this;

    sendStream(this, data, options, function send(error) {
      process.nextTick(function tock() {
        executeQueueSends(self);
      });

      if (typeof cb === 'function') cb(error);
    });
  } else {
    this._sender.send(data, options, cb);
  }
};

/**
 * Streams data through calls to a user supplied function
 *
 * @param {Object} Members - mask: boolean, binary: boolean, compress: boolean
 * @param {function} 'function (error, send)' which is executed on successive ticks of which send is 'function (data, final)'.
 * @api public
 */
WebSocket.prototype.stream = function stream(options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  var self = this;

  if (typeof cb !== 'function') throw new Error('callback must be provided');

  if (this.readyState !== WebSocket.OPEN) {
    if (typeof cb === 'function') cb(new Error('not opened'));
    else throw new Error('not opened');
    return;
  }

  if (this._queue) {
    this._queue.push(function () { self.stream(options, cb); });
    return;
  }

  options = options || {};

  if (typeof options.mask === 'undefined') options.mask = !this._isServer;
  if (typeof options.compress === 'undefined') options.compress = true;
  if (!this.extensions[PerMessageDeflate.extensionName]) {
    options.compress = false;
  }

  startQueue(this);

  function send(data, final) {
    try {
      if (self.readyState !== WebSocket.OPEN) throw new Error('not opened');
      options.fin = final === true;
      self._sender.send(data, options);
      if (!final) process.nextTick(cb.bind(null, null, send));
      else executeQueueSends(self);
    } catch (e) {
      if (typeof cb === 'function') cb(e);
      else {
        delete self._queue;
        self.emit('error', e);
      }
    }
  }

  process.nextTick(cb.bind(null, null, send));
};

/**
 * Immediately shuts down the connection
 *
 * @api public
 */
WebSocket.prototype.terminate = function terminate() {
  if (this.readyState === WebSocket.CLOSED) return;

  if (this._socket) {
    this.readyState = WebSocket.CLOSING;

    // End the connection
    try { this._socket.end(); }
    catch (e) {
      // Socket error during end() call, so just destroy it right now
      cleanupWebsocketResources.call(this, true);
      return;
    }

    // Add a timeout to ensure that the connection is completely
    // cleaned up within 30 seconds, even if the clean close procedure
    // fails for whatever reason
    // First cleanup any pre-existing timeout from an earlier "terminate" call,
    // if one exists.  Otherwise terminate calls in quick succession will leak timeouts
    // and hold the program open for `closeTimout` time.
    if (this._closeTimer) { clearTimeout(this._closeTimer); }
    this._closeTimer = setTimeout(cleanupWebsocketResources.bind(this, true), closeTimeout);
  } else if (this.readyState === WebSocket.CONNECTING) {
    cleanupWebsocketResources.call(this, true);
  }
};

/**
 * Expose bufferedAmount
 *
 * @api public
 */
Object.defineProperty(WebSocket.prototype, 'bufferedAmount', {
  get: function get() {
    var amount = 0;
    if (this._socket) {
      amount = this._socket.bufferSize || 0;
    }
    return amount;
  }
});

/**
 * Emulates the W3C Browser based WebSocket interface using function members.
 *
 * @see http://dev.w3.org/html5/websockets/#the-websocket-interface
 * @api public
 */
['open', 'error', 'close', 'message'].forEach(function(method) {
  Object.defineProperty(WebSocket.prototype, 'on' + method, {
    /**
     * Returns the current listener
     *
     * @returns {Mixed} the set function or undefined
     * @api public
     */
    get: function get() {
      var listener = this.listeners(method)[0];
      return listener ? (listener._listener ? listener._listener : listener) : undefined;
    },

    /**
     * Start listening for events
     *
     * @param {Function} listener the listener
     * @returns {Mixed} the set function or undefined
     * @api public
     */
    set: function set(listener) {
      this.removeAllListeners(method);
      this.addEventListener(method, listener);
    }
  });
});

/**
 * Emulates the W3C Browser based WebSocket interface using addEventListener.
 *
 * @see https://developer.mozilla.org/en/DOM/element.addEventListener
 * @see http://dev.w3.org/html5/websockets/#the-websocket-interface
 * @api public
 */
WebSocket.prototype.addEventListener = function(method, listener) {
  var target = this;

  function onMessage (data, flags) {
    listener.call(target, new MessageEvent(data, !!flags.binary, target));
  }

  function onClose (code, message) {
    listener.call(target, new CloseEvent(code, message, target));
  }

  function onError (event) {
    event.type = 'error';
    event.target = target;
    listener.call(target, event);
  }

  function onOpen () {
    listener.call(target, new OpenEvent(target));
  }

  if (typeof listener === 'function') {
    if (method === 'message') {
      // store a reference so we can return the original function from the
      // addEventListener hook
      onMessage._listener = listener;
      this.on(method, onMessage);
    } else if (method === 'close') {
      // store a reference so we can return the original function from the
      // addEventListener hook
      onClose._listener = listener;
      this.on(method, onClose);
    } else if (method === 'error') {
      // store a reference so we can return the original function from the
      // addEventListener hook
      onError._listener = listener;
      this.on(method, onError);
    } else if (method === 'open') {
      // store a reference so we can return the original function from the
      // addEventListener hook
      onOpen._listener = listener;
      this.on(method, onOpen);
    } else {
      this.on(method, listener);
    }
  }
};

module.exports = WebSocket;
module.exports.buildHostHeader = buildHostHeader

/**
 * W3C MessageEvent
 *
 * @see http://www.w3.org/TR/html5/comms.html
 * @constructor
 * @api private
 */
function MessageEvent(dataArg, isBinary, target) {
  this.type = 'message';
  this.data = dataArg;
  this.target = target;
  this.binary = isBinary; // non-standard.
}

/**
 * W3C CloseEvent
 *
 * @see http://www.w3.org/TR/html5/comms.html
 * @constructor
 * @api private
 */
function CloseEvent(code, reason, target) {
  this.type = 'close';
  this.wasClean = (typeof code === 'undefined' || code === 1000);
  this.code = code;
  this.reason = reason;
  this.target = target;
}

/**
 * W3C OpenEvent
 *
 * @see http://www.w3.org/TR/html5/comms.html
 * @constructor
 * @api private
 */
function OpenEvent(target) {
  this.type = 'open';
  this.target = target;
}

// Append port number to Host header, only if specified in the url
// and non-default
function buildHostHeader(isSecure, hostname, port) {
  var headerHost = hostname;
  if (hostname) {
    if ((isSecure && (port != 443)) || (!isSecure && (port != 80))){
      headerHost = headerHost + ':' + port;
    }
  }
  return headerHost;
}

/**
 * Entirely private apis,
 * which may or may not be bound to a sepcific WebSocket instance.
 */
function initAsServerClient(req, socket, upgradeHead, options) {
  options = new Options({
    protocolVersion: protocolVersion,
    protocol: null,
    extensions: {}
  }).merge(options);

  // expose state properties
  this.protocol = options.value.protocol;
  this.protocolVersion = options.value.protocolVersion;
  this.extensions = options.value.extensions;
  this.supports.binary = (this.protocolVersion !== 'hixie-76');
  this.upgradeReq = req;
  this.readyState = WebSocket.CONNECTING;
  this._isServer = true;

  // establish connection
  if (options.value.protocolVersion === 'hixie-76') {
    establishConnection.call(this, ReceiverHixie, SenderHixie, socket, upgradeHead);
  } else {
    establishConnection.call(this, Receiver, Sender, socket, upgradeHead);
  }
}

function initAsClient(address, protocols, options) {
  options = new Options({
    origin: null,
    protocolVersion: protocolVersion,
    host: null,
    headers: null,
    protocol: protocols.join(','),
    agent: null,

    // ssl-related options
    pfx: null,
    key: null,
    passphrase: null,
    cert: null,
    ca: null,
    ciphers: null,
    rejectUnauthorized: null,
    perMessageDeflate: true,
    localAddress: null
  }).merge(options);

  if (options.value.protocolVersion !== 8 && options.value.protocolVersion !== 13) {
    throw new Error('unsupported protocol version');
  }

  // verify URL and establish http class
  var serverUrl = url.parse(address);
  var isUnixSocket = serverUrl.protocol === 'ws+unix:';
  if (!serverUrl.host && !isUnixSocket) throw new Error('invalid url');
  var isSecure = serverUrl.protocol === 'wss:' || serverUrl.protocol === 'https:';
  var httpObj = isSecure ? https : http;
  var port = serverUrl.port || (isSecure ? 443 : 80);
  var auth = serverUrl.auth;

  // prepare extensions
  var extensionsOffer = {};
  var perMessageDeflate;
  if (options.value.perMessageDeflate) {
    perMessageDeflate = new PerMessageDeflate(typeof options.value.perMessageDeflate !== true ? options.value.perMessageDeflate : {}, false);
    extensionsOffer[PerMessageDeflate.extensionName] = perMessageDeflate.offer();
  }

  // expose state properties
  this._isServer = false;
  this.url = address;
  this.protocolVersion = options.value.protocolVersion;
  this.supports.binary = (this.protocolVersion !== 'hixie-76');

  // begin handshake
  var key = new Buffer(options.value.protocolVersion + '-' + Date.now()).toString('base64');
  var shasum = crypto.createHash('sha1');
  shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
  var expectedServerKey = shasum.digest('base64');

  var agent = options.value.agent;

  var headerHost = buildHostHeader(isSecure, serverUrl.hostname, port)

  var requestOptions = {
    port: port,
    host: serverUrl.hostname,
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
      'Host': headerHost,
      'Sec-WebSocket-Version': options.value.protocolVersion,
      'Sec-WebSocket-Key': key
    }
  };

  // If we have basic auth.
  if (auth) {
    requestOptions.headers.Authorization = 'Basic ' + new Buffer(auth).toString('base64');
  }

  if (options.value.protocol) {
    requestOptions.headers['Sec-WebSocket-Protocol'] = options.value.protocol;
  }

  if (options.value.host) {
    requestOptions.headers.Host = options.value.host;
  }

  if (options.value.headers) {
    for (var header in options.value.headers) {
       if (options.value.headers.hasOwnProperty(header)) {
        requestOptions.headers[header] = options.value.headers[header];
       }
    }
  }

  if (Object.keys(extensionsOffer).length) {
    requestOptions.headers['Sec-WebSocket-Extensions'] = Extensions.format(extensionsOffer);
  }

  if (options.isDefinedAndNonNull('pfx')
   || options.isDefinedAndNonNull('key')
   || options.isDefinedAndNonNull('passphrase')
   || options.isDefinedAndNonNull('cert')
   || options.isDefinedAndNonNull('ca')
   || options.isDefinedAndNonNull('ciphers')
   || options.isDefinedAndNonNull('rejectUnauthorized')) {

    if (options.isDefinedAndNonNull('pfx')) requestOptions.pfx = options.value.pfx;
    if (options.isDefinedAndNonNull('key')) requestOptions.key = options.value.key;
    if (options.isDefinedAndNonNull('passphrase')) requestOptions.passphrase = options.value.passphrase;
    if (options.isDefinedAndNonNull('cert')) requestOptions.cert = options.value.cert;
    if (options.isDefinedAndNonNull('ca')) requestOptions.ca = options.value.ca;
    if (options.isDefinedAndNonNull('ciphers')) requestOptions.ciphers = options.value.ciphers;
    if (options.isDefinedAndNonNull('rejectUnauthorized')) requestOptions.rejectUnauthorized = options.value.rejectUnauthorized;

    if (!agent) {
        // global agent ignores client side certificates
        agent = new httpObj.Agent(requestOptions);
    }
  }

  requestOptions.path = serverUrl.path || '/';

  if (agent) {
    requestOptions.agent = agent;
  }

  if (isUnixSocket) {
    requestOptions.socketPath = serverUrl.pathname;
  }

  if (options.value.localAddress) {
    requestOptions.localAddress = options.value.localAddress;
  }

  if (options.value.origin) {
    if (options.value.protocolVersion < 13) requestOptions.headers['Sec-WebSocket-Origin'] = options.value.origin;
    else requestOptions.headers.Origin = options.value.origin;
  }

  var self = this;
  var req = httpObj.request(requestOptions);

  req.on('error', function onerror(error) {
    self.emit('error', error);
    cleanupWebsocketResources.call(self, error);
  });

  req.once('response', function response(res) {
    var error;

    if (!self.emit('unexpected-response', req, res)) {
      error = new Error('unexpected server response (' + res.statusCode + ')');
      req.abort();
      self.emit('error', error);
    }

    cleanupWebsocketResources.call(self, error);
  });

  req.once('upgrade', function upgrade(res, socket, upgradeHead) {
    if (self.readyState === WebSocket.CLOSED) {
      // client closed before server accepted connection
      self.emit('close');
      self.removeAllListeners();
      socket.end();
      return;
    }

    var serverKey = res.headers['sec-websocket-accept'];
    if (typeof serverKey === 'undefined' || serverKey !== expectedServerKey) {
      self.emit('error', 'invalid server key');
      self.removeAllListeners();
      socket.end();
      return;
    }

    var serverProt = res.headers['sec-websocket-protocol'];
    var protList = (options.value.protocol || "").split(/, */);
    var protError = null;

    if (!options.value.protocol && serverProt) {
      protError = 'server sent a subprotocol even though none requested';
    } else if (options.value.protocol && !serverProt) {
      protError = 'server sent no subprotocol even though requested';
    } else if (serverProt && protList.indexOf(serverProt) === -1) {
      protError = 'server responded with an invalid protocol';
    }

    if (protError) {
      self.emit('error', protError);
      self.removeAllListeners();
      socket.end();
      return;
    } else if (serverProt) {
      self.protocol = serverProt;
    }

    var serverExtensions = Extensions.parse(res.headers['sec-websocket-extensions']);
    if (perMessageDeflate && serverExtensions[PerMessageDeflate.extensionName]) {
      try {
        perMessageDeflate.accept(serverExtensions[PerMessageDeflate.extensionName]);
      } catch (err) {
        self.emit('error', 'invalid extension parameter');
        self.removeAllListeners();
        socket.end();
        return;
      }
      self.extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
    }

    establishConnection.call(self, Receiver, Sender, socket, upgradeHead);

    // perform cleanup on http resources
    req.removeAllListeners();
    req = null;
    agent = null;
  });

  req.end();
  this.readyState = WebSocket.CONNECTING;
}

function establishConnection(ReceiverClass, SenderClass, socket, upgradeHead) {
  var ultron = this._ultron = new Ultron(socket)
    , called = false
    , self = this;

  socket.setTimeout(0);
  socket.setNoDelay(true);

  this._receiver = new ReceiverClass(this.extensions);
  this._socket = socket;

  // socket cleanup handlers
  ultron.on('end', cleanupWebsocketResources.bind(this));
  ultron.on('close', cleanupWebsocketResources.bind(this));
  ultron.on('error', cleanupWebsocketResources.bind(this));

  // ensure that the upgradeHead is added to the receiver
  function firstHandler(data) {
    if (called || self.readyState === WebSocket.CLOSED) return;

    called = true;
    socket.removeListener('data', firstHandler);
    ultron.on('data', realHandler);

    if (upgradeHead && upgradeHead.length > 0) {
      realHandler(upgradeHead);
      upgradeHead = null;
    }

    if (data) realHandler(data);
  }

  // subsequent packets are pushed straight to the receiver
  function realHandler(data) {
    self.bytesReceived += data.length;
    self._receiver.add(data);
  }

  ultron.on('data', firstHandler);

  // if data was passed along with the http upgrade,
  // this will schedule a push of that on to the receiver.
  // this has to be done on next tick, since the caller
  // hasn't had a chance to set event handlers on this client
  // object yet.
  process.nextTick(firstHandler);

  // receiver event handlers
  self._receiver.ontext = function ontext(data, flags) {
    flags = flags || {};

    self.emit('message', data, flags);
  };

  self._receiver.onbinary = function onbinary(data, flags) {
    flags = flags || {};

    flags.binary = true;
    self.emit('message', data, flags);
  };

  self._receiver.onping = function onping(data, flags) {
    flags = flags || {};

    self.pong(data, {
      mask: !self._isServer,
      binary: flags.binary === true
    }, true);

    self.emit('ping', data, flags);
  };

  self._receiver.onpong = function onpong(data, flags) {
    self.emit('pong', data, flags || {});
  };

  self._receiver.onclose = function onclose(code, data, flags) {
    flags = flags || {};

    self._closeReceived = true;
    self.close(code, data);
  };

  self._receiver.onerror = function onerror(reason, errorCode) {
    // close the connection when the receiver reports a HyBi error code
    self.close(typeof errorCode !== 'undefined' ? errorCode : 1002, '');
    self.emit('error', reason, errorCode);
  };

  // finalize the client
  this._sender = new SenderClass(socket, this.extensions);
  this._sender.on('error', function onerror(error) {
    self.close(1002, '');
    self.emit('error', error);
  });

  this.readyState = WebSocket.OPEN;
  this.emit('open');
}

function startQueue(instance) {
  instance._queue = instance._queue || [];
}

function executeQueueSends(instance) {
  var queue = instance._queue;
  if (typeof queue === 'undefined') return;

  delete instance._queue;
  for (var i = 0, l = queue.length; i < l; ++i) {
    queue[i]();
  }
}

function sendStream(instance, stream, options, cb) {
  stream.on('data', function incoming(data) {
    if (instance.readyState !== WebSocket.OPEN) {
      if (typeof cb === 'function') cb(new Error('not opened'));
      else {
        delete instance._queue;
        instance.emit('error', new Error('not opened'));
      }
      return;
    }

    options.fin = false;
    instance._sender.send(data, options);
  });

  stream.on('end', function end() {
    if (instance.readyState !== WebSocket.OPEN) {
      if (typeof cb === 'function') cb(new Error('not opened'));
      else {
        delete instance._queue;
        instance.emit('error', new Error('not opened'));
      }
      return;
    }

    options.fin = true;
    instance._sender.send(null, options);

    if (typeof cb === 'function') cb(null);
  });
}

function cleanupWebsocketResources(error) {
  if (this.readyState === WebSocket.CLOSED) return;

  var emitClose = this.readyState !== WebSocket.CONNECTING;
  this.readyState = WebSocket.CLOSED;

  clearTimeout(this._closeTimer);
  this._closeTimer = null;

  if (emitClose) {
    // If the connection was closed abnormally (with an error), or if
    // the close control frame was not received then the close code
    // must default to 1006.
    if (error || !this._closeReceived) {
      this._closeCode = 1006;
    }
    this.emit('close', this._closeCode || 1000, this._closeMessage || '');
  }

  if (this._socket) {
    if (this._ultron) this._ultron.destroy();
    this._socket.on('error', function onerror() {
      try { this.destroy(); }
      catch (e) {}
    });

    try {
      if (!error) this._socket.end();
      else this._socket.destroy();
    } catch (e) { /* Ignore termination errors */ }

    this._socket = null;
    this._ultron = null;
  }

  if (this._sender) {
    this._sender.removeAllListeners();
    this._sender = null;
  }

  if (this._receiver) {
    this._receiver.cleanup();
    this._receiver = null;
  }

  if (this.extensions[PerMessageDeflate.extensionName]) {
    this.extensions[PerMessageDeflate.extensionName].cleanup();
  }

  this.extensions = null;

  this.removeAllListeners();
  this.on('error', function onerror() {}); // catch all errors after this
  delete this._queue;
}

},{"./Extensions":26,"./PerMessageDeflate":27,"./Receiver":29,"./Receiver.hixie":28,"./Sender":31,"./Sender.hixie":30,"crypto":undefined,"events":undefined,"http":undefined,"https":undefined,"options":19,"stream":undefined,"ultron":20,"url":undefined,"util":undefined}],35:[function(require,module,exports){
/*!
 * ws: a node.js websocket client
 * Copyright(c) 2011 Einar Otto Stangvik <einaros@gmail.com>
 * MIT Licensed
 */

var util = require('util')
  , events = require('events')
  , http = require('http')
  , crypto = require('crypto')
  , Options = require('options')
  , WebSocket = require('./WebSocket')
  , Extensions = require('./Extensions')
  , PerMessageDeflate = require('./PerMessageDeflate')
  , tls = require('tls')
  , url = require('url');

/**
 * WebSocket Server implementation
 */

function WebSocketServer(options, callback) {
  if (this instanceof WebSocketServer === false) {
    return new WebSocketServer(options, callback);
  }

  events.EventEmitter.call(this);

  options = new Options({
    host: '0.0.0.0',
    port: null,
    server: null,
    verifyClient: null,
    handleProtocols: null,
    path: null,
    noServer: false,
    disableHixie: false,
    clientTracking: true,
    perMessageDeflate: true
  }).merge(options);

  if (!options.isDefinedAndNonNull('port') && !options.isDefinedAndNonNull('server') && !options.value.noServer) {
    throw new TypeError('`port` or a `server` must be provided');
  }

  var self = this;

  if (options.isDefinedAndNonNull('port')) {
    this._server = http.createServer(function (req, res) {
      var body = http.STATUS_CODES[426];
      res.writeHead(426, {
        'Content-Length': body.length,
        'Content-Type': 'text/plain'
      });
      res.end(body);
    });
    this._server.allowHalfOpen = false;
    this._server.listen(options.value.port, options.value.host, callback);
    this._closeServer = function() { if (self._server) self._server.close(); };
  }
  else if (options.value.server) {
    this._server = options.value.server;
    if (options.value.path) {
      // take note of the path, to avoid collisions when multiple websocket servers are
      // listening on the same http server
      if (this._server._webSocketPaths && options.value.server._webSocketPaths[options.value.path]) {
        throw new Error('two instances of WebSocketServer cannot listen on the same http server path');
      }
      if (typeof this._server._webSocketPaths !== 'object') {
        this._server._webSocketPaths = {};
      }
      this._server._webSocketPaths[options.value.path] = 1;
    }
  }
  if (this._server) this._server.once('listening', function() { self.emit('listening'); });

  if (typeof this._server != 'undefined') {
    this._server.on('error', function(error) {
      self.emit('error', error)
    });
    this._server.on('upgrade', function(req, socket, upgradeHead) {
      //copy upgradeHead to avoid retention of large slab buffers used in node core
      var head = new Buffer(upgradeHead.length);
      upgradeHead.copy(head);

      self.handleUpgrade(req, socket, head, function(client) {
        self.emit('connection'+req.url, client);
        self.emit('connection', client);
      });
    });
  }

  this.options = options.value;
  this.path = options.value.path;
  this.clients = [];
}

/**
 * Inherits from EventEmitter.
 */

util.inherits(WebSocketServer, events.EventEmitter);

/**
 * Immediately shuts down the connection.
 *
 * @api public
 */

WebSocketServer.prototype.close = function(callback) {
  // terminate all associated clients
  var error = null;
  try {
    for (var i = 0, l = this.clients.length; i < l; ++i) {
      this.clients[i].terminate();
    }
  }
  catch (e) {
    error = e;
  }

  // remove path descriptor, if any
  if (this.path && this._server._webSocketPaths) {
    delete this._server._webSocketPaths[this.path];
    if (Object.keys(this._server._webSocketPaths).length == 0) {
      delete this._server._webSocketPaths;
    }
  }

  // close the http server if it was internally created
  try {
    if (typeof this._closeServer !== 'undefined') {
      this._closeServer();
    }
  }
  finally {
    delete this._server;
  }
  if(callback)
    callback(error);
  else if(error)
    throw error;
}

/**
 * Handle a HTTP Upgrade request.
 *
 * @api public
 */

WebSocketServer.prototype.handleUpgrade = function(req, socket, upgradeHead, cb) {
  // check for wrong path
  if (this.options.path) {
    var u = url.parse(req.url);
    if (u && u.pathname !== this.options.path) return;
  }

  if (typeof req.headers.upgrade === 'undefined' || req.headers.upgrade.toLowerCase() !== 'websocket') {
    abortConnection(socket, 400, 'Bad Request');
    return;
  }

  if (req.headers['sec-websocket-key1']) handleHixieUpgrade.apply(this, arguments);
  else handleHybiUpgrade.apply(this, arguments);
}

module.exports = WebSocketServer;

/**
 * Entirely private apis,
 * which may or may not be bound to a sepcific WebSocket instance.
 */

function handleHybiUpgrade(req, socket, upgradeHead, cb) {
  // handle premature socket errors
  var errorHandler = function() {
    try { socket.destroy(); } catch (e) {}
  }
  socket.on('error', errorHandler);

  // verify key presence
  if (!req.headers['sec-websocket-key']) {
    abortConnection(socket, 400, 'Bad Request');
    return;
  }

  // verify version
  var version = parseInt(req.headers['sec-websocket-version']);
  if ([8, 13].indexOf(version) === -1) {
    abortConnection(socket, 400, 'Bad Request');
    return;
  }

  // verify protocol
  var protocols = req.headers['sec-websocket-protocol'];

  // verify client
  var origin = version < 13 ?
    req.headers['sec-websocket-origin'] :
    req.headers['origin'];

  // handle extensions offer
  var extensionsOffer = Extensions.parse(req.headers['sec-websocket-extensions']);

  // handler to call when the connection sequence completes
  var self = this;
  var completeHybiUpgrade2 = function(protocol) {

    // calc key
    var key = req.headers['sec-websocket-key'];
    var shasum = crypto.createHash('sha1');
    shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
    key = shasum.digest('base64');

    var headers = [
        'HTTP/1.1 101 Switching Protocols'
      , 'Upgrade: websocket'
      , 'Connection: Upgrade'
      , 'Sec-WebSocket-Accept: ' + key
    ];

    if (typeof protocol != 'undefined') {
      headers.push('Sec-WebSocket-Protocol: ' + protocol);
    }

    var extensions = {};
    try {
      extensions = acceptExtensions.call(self, extensionsOffer);
    } catch (err) {
      abortConnection(socket, 400, 'Bad Request');
      return;
    }

    if (Object.keys(extensions).length) {
      var serverExtensions = {};
      Object.keys(extensions).forEach(function(token) {
        serverExtensions[token] = [extensions[token].params]
      });
      headers.push('Sec-WebSocket-Extensions: ' + Extensions.format(serverExtensions));
    }

    // allows external modification/inspection of handshake headers
    self.emit('headers', headers);

    socket.setTimeout(0);
    socket.setNoDelay(true);
    try {
      socket.write(headers.concat('', '').join('\r\n'));
    }
    catch (e) {
      // if the upgrade write fails, shut the connection down hard
      try { socket.destroy(); } catch (e) {}
      return;
    }

    var client = new WebSocket([req, socket, upgradeHead], {
      protocolVersion: version,
      protocol: protocol,
      extensions: extensions
    });

    if (self.options.clientTracking) {
      self.clients.push(client);
      client.on('close', function() {
        var index = self.clients.indexOf(client);
        if (index != -1) {
          self.clients.splice(index, 1);
        }
      });
    }

    // signal upgrade complete
    socket.removeListener('error', errorHandler);
    cb(client);
  }

  // optionally call external protocol selection handler before
  // calling completeHybiUpgrade2
  var completeHybiUpgrade1 = function() {
    // choose from the sub-protocols
    if (typeof self.options.handleProtocols == 'function') {
        var protList = (protocols || "").split(/, */);
        var callbackCalled = false;
        var res = self.options.handleProtocols(protList, function(result, protocol) {
          callbackCalled = true;
          if (!result) abortConnection(socket, 401, 'Unauthorized');
          else completeHybiUpgrade2(protocol);
        });
        if (!callbackCalled) {
            // the handleProtocols handler never called our callback
            abortConnection(socket, 501, 'Could not process protocols');
        }
        return;
    } else {
        if (typeof protocols !== 'undefined') {
            completeHybiUpgrade2(protocols.split(/, */)[0]);
        }
        else {
            completeHybiUpgrade2();
        }
    }
  }

  // optionally call external client verification handler
  if (typeof this.options.verifyClient == 'function') {
    var info = {
      origin: origin,
      secure: typeof req.connection.authorized !== 'undefined' || typeof req.connection.encrypted !== 'undefined',
      req: req
    };
    if (this.options.verifyClient.length == 2) {
      this.options.verifyClient(info, function(result, code, name) {
        if (typeof code === 'undefined') code = 401;
        if (typeof name === 'undefined') name = http.STATUS_CODES[code];

        if (!result) abortConnection(socket, code, name);
        else completeHybiUpgrade1();
      });
      return;
    }
    else if (!this.options.verifyClient(info)) {
      abortConnection(socket, 401, 'Unauthorized');
      return;
    }
  }

  completeHybiUpgrade1();
}

function handleHixieUpgrade(req, socket, upgradeHead, cb) {
  // handle premature socket errors
  var errorHandler = function() {
    try { socket.destroy(); } catch (e) {}
  }
  socket.on('error', errorHandler);

  // bail if options prevent hixie
  if (this.options.disableHixie) {
    abortConnection(socket, 401, 'Hixie support disabled');
    return;
  }

  // verify key presence
  if (!req.headers['sec-websocket-key2']) {
    abortConnection(socket, 400, 'Bad Request');
    return;
  }

  var origin = req.headers['origin']
    , self = this;

  // setup handshake completion to run after client has been verified
  var onClientVerified = function() {
    var wshost;
    if (!req.headers['x-forwarded-host'])
        wshost = req.headers.host;
    else
        wshost = req.headers['x-forwarded-host'];
    var location = ((req.headers['x-forwarded-proto'] === 'https' || socket.encrypted) ? 'wss' : 'ws') + '://' + wshost + req.url
      , protocol = req.headers['sec-websocket-protocol'];

    // handshake completion code to run once nonce has been successfully retrieved
    var completeHandshake = function(nonce, rest) {
      // calculate key
      var k1 = req.headers['sec-websocket-key1']
        , k2 = req.headers['sec-websocket-key2']
        , md5 = crypto.createHash('md5');

      [k1, k2].forEach(function (k) {
        var n = parseInt(k.replace(/[^\d]/g, ''))
          , spaces = k.replace(/[^ ]/g, '').length;
        if (spaces === 0 || n % spaces !== 0){
          abortConnection(socket, 400, 'Bad Request');
          return;
        }
        n /= spaces;
        md5.update(String.fromCharCode(
          n >> 24 & 0xFF,
          n >> 16 & 0xFF,
          n >> 8  & 0xFF,
          n       & 0xFF));
      });
      md5.update(nonce.toString('binary'));

      var headers = [
          'HTTP/1.1 101 Switching Protocols'
        , 'Upgrade: WebSocket'
        , 'Connection: Upgrade'
        , 'Sec-WebSocket-Location: ' + location
      ];
      if (typeof protocol != 'undefined') headers.push('Sec-WebSocket-Protocol: ' + protocol);
      if (typeof origin != 'undefined') headers.push('Sec-WebSocket-Origin: ' + origin);

      socket.setTimeout(0);
      socket.setNoDelay(true);
      try {
        // merge header and hash buffer
        var headerBuffer = new Buffer(headers.concat('', '').join('\r\n'));
        var hashBuffer = new Buffer(md5.digest('binary'), 'binary');
        var handshakeBuffer = new Buffer(headerBuffer.length + hashBuffer.length);
        headerBuffer.copy(handshakeBuffer, 0);
        hashBuffer.copy(handshakeBuffer, headerBuffer.length);

        // do a single write, which - upon success - causes a new client websocket to be setup
        socket.write(handshakeBuffer, 'binary', function(err) {
          if (err) return; // do not create client if an error happens
          var client = new WebSocket([req, socket, rest], {
            protocolVersion: 'hixie-76',
            protocol: protocol
          });
          if (self.options.clientTracking) {
            self.clients.push(client);
            client.on('close', function() {
              var index = self.clients.indexOf(client);
              if (index != -1) {
                self.clients.splice(index, 1);
              }
            });
          }

          // signal upgrade complete
          socket.removeListener('error', errorHandler);
          cb(client);
        });
      }
      catch (e) {
        try { socket.destroy(); } catch (e) {}
        return;
      }
    }

    // retrieve nonce
    var nonceLength = 8;
    if (upgradeHead && upgradeHead.length >= nonceLength) {
      var nonce = upgradeHead.slice(0, nonceLength);
      var rest = upgradeHead.length > nonceLength ? upgradeHead.slice(nonceLength) : null;
      completeHandshake.call(self, nonce, rest);
    }
    else {
      // nonce not present in upgradeHead, so we must wait for enough data
      // data to arrive before continuing
      var nonce = new Buffer(nonceLength);
      upgradeHead.copy(nonce, 0);
      var received = upgradeHead.length;
      var rest = null;
      var handler = function (data) {
        var toRead = Math.min(data.length, nonceLength - received);
        if (toRead === 0) return;
        data.copy(nonce, received, 0, toRead);
        received += toRead;
        if (received == nonceLength) {
          socket.removeListener('data', handler);
          if (toRead < data.length) rest = data.slice(toRead);
          completeHandshake.call(self, nonce, rest);
        }
      }
      socket.on('data', handler);
    }
  }

  // verify client
  if (typeof this.options.verifyClient == 'function') {
    var info = {
      origin: origin,
      secure: typeof req.connection.authorized !== 'undefined' || typeof req.connection.encrypted !== 'undefined',
      req: req
    };
    if (this.options.verifyClient.length == 2) {
      var self = this;
      this.options.verifyClient(info, function(result, code, name) {
        if (typeof code === 'undefined') code = 401;
        if (typeof name === 'undefined') name = http.STATUS_CODES[code];

        if (!result) abortConnection(socket, code, name);
        else onClientVerified.apply(self);
      });
      return;
    }
    else if (!this.options.verifyClient(info)) {
      abortConnection(socket, 401, 'Unauthorized');
      return;
    }
  }

  // no client verification required
  onClientVerified();
}

function acceptExtensions(offer) {
  var extensions = {};
  var options = this.options.perMessageDeflate;
  if (options && offer[PerMessageDeflate.extensionName]) {
    var perMessageDeflate = new PerMessageDeflate(options !== true ? options : {}, true);
    perMessageDeflate.accept(offer[PerMessageDeflate.extensionName]);
    extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
  }
  return extensions;
}

function abortConnection(socket, code, name) {
  try {
    var response = [
      'HTTP/1.1 ' + code + ' ' + name,
      'Content-type: text/html'
    ];
    socket.write(response.concat('', '').join('\r\n'));
  }
  catch (e) { /* ignore errors - we've aborted this connection */ }
  finally {
    // ensure that an early aborted connection is shut down completely
    try { socket.destroy(); } catch (e) {}
  }
}

},{"./Extensions":26,"./PerMessageDeflate":27,"./WebSocket":34,"crypto":undefined,"events":undefined,"http":undefined,"options":19,"tls":undefined,"url":undefined,"util":undefined}],36:[function(require,module,exports){
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @contributor d3x0r / http://github.com/d3x0r  - add enable/disable to allow disconnecting these events
 */

THREE.OrbitControls = function ( object, clusterLookAt, domElement ) {
	// mode 1, is limited
	this.mode = 2;
	this.object = object;
	this.cluster = clusterLookAt;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 0.10;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.userPan = true;
	this.userPanSpeed = 2.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	// 65 /*A*/, 83 /*S*/, 68 /*D*/
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40, ROTATE: 65, ZOOM: 83, PAN: 68 };

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	var lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.pan = function ( distance ) {

		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( scope.userPanSpeed );

		this.object.position.add( distance );
		this.center.add( distance );

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		if( this.mode == 2 ) {
			if( phiDelta || thetaDelta ) {
				this.object.matrix.rotateRelative( -phiDelta, thetaDelta, 0 );
				this.object.matrix.rotateRelative( 0, 0, -this.object.matrix.roll )
				var tmp = this.center.clone().addScaledVector( this.object.matrix.backward, offset.length() *(scale) );
				this.object.matrix.origin.copy( tmp );
				this.object.matrixWorldNeedsUpdate = true;
			}
		} else {
			theta += thetaDelta;
			phi += phiDelta;

			// restrict phi to be between desired limits
			phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

			// restrict phi to be betwee EPS and PI-EPS
			phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

			var radius = offset.length() * scale;

			// restrict radius to be between desired limits
			radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

			offset.x = radius * Math.sin( phi ) * Math.sin( theta );
			offset.y = radius * Math.cos( phi );
			offset.z = radius * Math.sin( phi ) * Math.cos( theta );

			position.copy( this.center ).add( offset );

	        //console.log( "update lookAt?", thetaDelta, phiDelta)

			this.object.lookAt( this.center );

	        this.object.matrixWorldNeedsUpdate = true;
		}
		thetaDelta = 0;
		phiDelta = 0;
		scale = 1;

		if ( lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.userZoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		event.preventDefault();

		if ( state === STATE.NONE )
		{
			if ( event.button === 0 )
				state = STATE.ROTATE;
			if ( event.button === 1 )
				state = STATE.ZOOM;
			if ( event.button === 2 )
				state = STATE.PAN;
		}


		if ( state === STATE.ROTATE ) {

			//state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( state === STATE.ZOOM ) {

			//state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		} else if ( state === STATE.PAN ) {

			//state = STATE.PAN;

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();



		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );

		} else if ( state === STATE.PAN ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;

		switch ( event.keyCode ) {

			/*case scope.keys.UP:
				scope.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
			*/
			case scope.keys.ROTATE:
				state = STATE.ROTATE;
				break;
			case scope.keys.ZOOM:
				state = STATE.ZOOM;
				break;
			case scope.keys.PAN:
				state = STATE.PAN;
				break;

		}

	}

	function onKeyUp( event ) {

		switch ( event.keyCode ) {

			case scope.keys.ROTATE:
			case scope.keys.ZOOM:
			case scope.keys.PAN:
				state = STATE.NONE;
				break;
		}

	}

	var ongoingTouches = [];

	function copyTouch(touch) {
	  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
	}
	function ongoingTouchIndexById(idToFind) {
	  for (var i = 0; i < ongoingTouches.length; i++) {
	    var id = ongoingTouches[i].identifier;

	    if (id == idToFind) {
	      return i;
	    }
	  }
	  return -1;    // not found
	}
	function onTouchDown(event) {
	  event.preventDefault();
	  var touches = event.changedTouches;
	  for( var i = 0; i < touches.length; i++ ) {

			if ( scope.enabled === false ) return;
			if ( scope.userRotate === false ) return;

			event.preventDefault();

			if ( state === STATE.NONE )
			{
				if ( event.button === 0 )
					state = STATE.ROTATE;
				if ( event.button === 1 )
					state = STATE.ZOOM;
				if ( event.button === 2 )
					state = STATE.PAN;
			}


			if ( state === STATE.ROTATE ) {
				rotateStart.set( touches[0].pageX, touches[0].pageY );
			} else if ( state === STATE.ZOOM ) {
				//state = STATE.ZOOM;
				zoomStart.set( touches[0].pageX, touches[0].pageY );
			} else if ( state === STATE.PAN ) {
				//state = STATE.PAN;
			}


	    console.log( `touch ${i}=${touches[i]}`);
	    ongoingTouches.push( copyTouch( touches[i] ) );

	  }
	}

	function onTouchUp(event) {
	  event.preventDefault();
		var touches = event.changedTouches;
	  for( var i = 0; i < touches.length; i++ ) {
	    var idx = ongoingTouchIndexById(touches[i].identifier);
	    if( idx >= 0 ) {
				ongoingTouches.splice(idx, 1);  // remove it; we're done
			}
		}
	}

	function onTouchMove(event) {
	  event.preventDefault();
	  var touches = event.changedTouches;
	  for( var i = 0; i < touches.length; i++ ) {
	    var idx = ongoingTouchIndexById(touches[i].identifier);
			console.log( `got touch ${idx}` );
	    if( idx >= 0 ) {

				if ( scope.enabled === false ) return;

				if ( state === STATE.ROTATE ) {

					rotateEnd.set( touches[i].pageX, touches[i].pageY );
					rotateDelta.subVectors( rotateEnd, rotateStart );

					scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
					scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

					rotateStart.copy( rotateEnd );

				} else if ( state === STATE.ZOOM ) {

					zoomEnd.set( event.clientX, event.clientY );
					zoomDelta.subVectors( zoomEnd, zoomStart );

					if ( zoomDelta.y > 0 ) {

						scope.zoomIn();

					} else {

						scope.zoomOut();

					}

					zoomStart.copy( zoomEnd );

				} else if ( state === STATE.PAN ) {

					var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
					var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

					scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

				}



				ongoingTouches[idx].pageX = touches[i].pageX;
				ongoingTouches[idx].pageY = touches[i].pageY;
	      //ongoingTouches.splice( idx, 1, copyTouch( touches[i] ) );
	    }
	  }
	}

	function onTouchCancel(event) {
	  event.preventDefault();
		  console.log("touchcancel.");
		  var touches = event.changedTouches;

		  for (var i = 0; i < touches.length; i++) {
				var idx = ongoingTouchIndexById(touches[i].identifier);
		    if( idx >= 0 ) {
		    	ongoingTouches.splice(i, 1);  // remove it; we're done
				}
		  }
		}




    function ignore(event) {
        event.preventDefault();
    }
    this.disable = function() {
    	scope.domElement.removeEventListener( 'contextmenu', ignore, false );
			scope.domElement.removeEventListener( 'touchstart', onTouchDown, false );
	    scope.domElement.removeEventListener( 'touchend', onTouchUp, false );
	    scope.domElement.removeEventListener( 'touchcancel', onTouchCancel, false );
	    scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );
    	scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
    	scope.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
    	scope.domElement.removeEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    	window.removeEventListener( 'keydown', onKeyDown, false );
    	window.removeEventListener( 'keyup', onKeyUp, false );
    }

    this.enable = function() {
    	scope.domElement.addEventListener( 'contextmenu', ignore, false );
			scope.domElement.addEventListener( 'touchstart', onTouchDown, false );
	    scope.domElement.addEventListener( 'touchend', onTouchUp, false );
	    scope.domElement.addEventListener( 'touchcancel', onTouchCancel, false );
	    scope.domElement.addEventListener( 'touchmove', onTouchMove, false );
    	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
    	scope.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
    	scope.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
    	window.addEventListener( 'keydown', onKeyDown, false );
    	window.addEventListener( 'keyup', onKeyUp, false );
			Voxelarium.camera.matrixAutoUpdate = false;
    }
    this.enable();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

},{}],37:[function(require,module,exports){


var bit_masks = [];
for( var mask = 0, n = 0; n <= 32; n++ )
{
    bit_masks[n] = mask;
    mask = ( mask << 1 ) | 1;
}


Voxelarium.BitStream = function( base_buffer )
{
    var stream =
	{
		storage : base_buffer || new ArrayBuffer(512 /*available*/),
		available : ( base_buffer && base_buffer.byteLength ) || 512,
        used : 0,
		used_bits : 0,

		getBytes : function(  ) {
			return { data : stream.storage, bytes_used : stream.used + 1 };
		},

		expand : function()
		{
			var new_size = stream.available * 2;
			var new_storage = new ArrayBuffer(new_size);
            for( var n = 0; n < stream.available; n++ )
                new_storage[n] = stream.storage[n];
			stream.storage = new_storage;
			stream.available = new_size;

		},

		seek : function( position )
		{
			if( (position >> 3) >= stream.available )
				throw new Error( "attempt to seek beyond end of data" );

			stream.used = position >> 3;
			stream.used_bits = position & 0x7;
		},

		write : function( value, bits )
		{
			if( bits > 64 )
				throw new Error( "Attempt to write more bits than data passed" );
			var tmp;
			if( stream.used == stream.available ) Expand();
			tmp = stream.storage[stream.used] || 0;
			tmp |= (value << stream.used_bits)&0xFF;
			stream.storage[stream.used] = tmp;
			var bit_counter = 8 - stream.used_bits;
			stream.used_bits += bits;
			while( stream.used_bits >= 8 )
			{
				stream.used_bits -= 8;
				stream.used++;
				if( stream.used == stream.available ) stream.expand();
				if( stream.used_bits > 0 )
				{
					tmp = 0;
					stream.storage[stream.used] = ( value >> ( bit_counter ) ) & 0xFF;
				}
			}
		},


		read : function( bits )
		{
			if( bits > 64 )
				throw new error( "Attempt to read more bits than data passed" );
			var tmp;
			//if( stream.used == stream.available )
			//	throw new Error( "No more data" );
			tmp = stream.storage[stream.used];
			var result = ( tmp >> stream.used_bits );
			var bit_counter = 8 - stream.used_bits;
			stream.used_bits += bits;
			while( stream.used_bits >= 8 )
			{
				stream.used_bits -= 8;
				stream.used++;
				if( stream.used_bits > 0 )
				{
					tmp = stream.storage[stream.used];
					result |= ( tmp << ( bit_counter ) ) & 0xFF;
					stream.bit_counter += 8;
				}
			}
			result &= bit_masks[bits];
            return result;
		}
	}
    return stream;
}



Voxelarium.BitStream.GetMinBitsNeededForValue = function( value )
{
    var n;
   for( n = 1; n <= 32; n++ ) {
       if( ( ( value & bit_masks[n] ) ^ value ) == 0 )
            break;
   }
   return n;
}

},{}],38:[function(require,module,exports){

require( "./constants.js");
require( "./reactor.js" );

Voxelarium.Cluster = function( x, y, z, props ) {
    var cluster = {
        mesher : null,
        WorkingFullSector : null,
        WorkingEmptySector: null,

        SectorList : [],

        sectorSizeX : x || 32,
        sectorSizeY : y || 32,
        sectorSizeZ : z || 32,
        sectorSize : 0, // filled in later

        voxelUnitSize : props && props.unitSize || 20,

        sectorHashSize_x : 8,
        sectorHashSize_y : 8,
        sectorHashSize_z : 8,
        TableSize : 0,//SectorHashSize_x * SectorHashSize_y * SectorHashSize_z,
        SectorTable : new Array( 8*8*8 ),

        pivot : new THREE.Vector3(),
        location : new THREE.Matrix4(),
        UniverseNum : 0,
        lookupTables : null
        ,createSector : function( x, y, z ) {
            var sector = Voxelarium.Sector( this, x, y, z );
            this.SectorList.push( sector );

            var hashOfs;
            sector.next = this.SectorTable[ hashOfs = ( x % this.sectorHashSize_x
                                + ( y % this.sectorHashSize_y ) * ( this.sectorHashSize_x )
                                + ( z % this.sectorHashSize_z ) * (this.sectorHashSize_y*this.sectorHashSize_x) ) ];
            if( sector.next )
                sector.next.pred = sector;
            this.SectorTable[hashOfs] = sector;

			var n;
			for( n = 0; n < 6; n++ )
			{
				var near_sec = this.getSector( x + Voxelarium.NormalBasePosition[n].x
												  , y + Voxelarium.NormalBasePosition[n].y
												  , z + Voxelarium.NormalBasePosition[n].z
                                                  , true );
				if( near_sec != null )
				{
					sector.near_sectors[n] = near_sec;
					near_sec.near_sectors[n ^ 1] = sector;
				}
			}
            return sector;
        }

        ,getVoxelRef : function( is3dSpaceCoords, x, y, z ) {
            if( is3dSpaceCoords ) {
              x = Math.floor( x / this.voxelUnitSize );
              y = Math.floor( y / this.voxelUnitSize );
              z = Math.floor( z / this.voxelUnitSize );
            }
            var sx = Math.floor( x / this.sectorSizeX );
            var sy = Math.floor( y / this.sectorSizeY );
            var sz = Math.floor( z / this.sectorSizeZ );
            //if( !is3dSpaceCoords) {
              //console.log( `Get ${sx} ${sy} ${sz}`)
            //}
            var sector = cluster.getSector( sx, sy, sz, true );
            if( sector ) {
                return sector.getVoxelRef( x % this.sectorSizeX, y % this.sectorSizeY, z % this.sectorSizeZ);
            } else {
                // pass world coordinates, since there's no sector to give a base position
                return Voxelarium.VoxelRef( cluster, null, x, y, z );
            }
            return null;
        }
        , setCube : function( x, y, z, cube ){
            var sx = x / this.sectorSizeX;
            var sy = y / this.sectorSizeY;
            var sz = z / this.sectorSizeZ;
            var subx = ( sx % 1 ) * this.sectorSizeX;
            var suby = ( sy % 1 ) * this.sectorSizeY;
            var subz = ( sz % 1 ) * this.sectorSizeZ;
            var wx = Math.floor( sx );
            var wy = Math.floor( sy );
            var wz = Math.floor( sz );
            var sector = this.getSector( wx, wy, wz );

            sector.setCube( subx, suby, subz, cube );
        }
        , getSector : function( x, y, z, do_not_create ) {
            var base;
            base = this.SectorTable[ x % this.sectorHashSize_x
                                + ( y % this.sectorHashSize_y ) * ( this.sectorHashSize_x )
                                + ( z % this.sectorHashSize_z ) * ( this.sectorHashSize_y*this.sectorHashSize_x) ];
            while( base
                && ( ( base.pos.x !== x )
                    || ( base.pos.y !== y )
                    || ( base.pos.z !== z ) ) )
                base = base.next;
            if( !do_not_create )
                if( !base )
                    base = this.createSector( x, y, z )
            return base;
        }
        , getGeometryBuffer : null
    }

    cluster.TableSize = cluster.sectorHashSize_x * cluster.sectorHashSize_y * cluster.sectorHashSize_z;
    cluster.sectorSize = cluster.sectorSizeX * cluster.sectorSizeY * cluster.sectorSizeZ;
    cluster.lookupTables = InitStatics( cluster.sectorSizeX, cluster.sectorSizeY, cluster.sectorSizeZ )

    cluster.SectorTable = new Array( cluster.TableSize );
    // maybe reactor is universal?
    cluster.reactor = Voxelarium.Reactor( cluster );

    Object.defineProperties( cluster
        , { 'sectorSizeX' : {writeable:false}
            , 'sectorSizeY' : {writeable:false}
            , 'sectorSizeZ' : {writeable:false}
            , 'sectorSize' : {writeable:false}
            , 'sectorHashSize_x' : {writeable:false}
            , 'sectorHashSize_y' : {writeable:false}
            , 'sectorHashSize_z' : {writeable:false}
            , 'TableSize' : {writeable:false}
            , 'voxelUnitSize' : {writeable:false}
            , 'lookupTables' : {writeable:false}
            , 'SectorTable' : {writeable:false}
            , 'reactor' : {writeable:false}
        } )


    cluster.WorkingFullSector = Voxelarium.Sector( cluster );
    cluster.WorkingFullSector.Pos_y = -1;
    cluster.WorkingFullSector.MakeSector( Voxelarium.Voxels.types[1] );
    cluster.WorkingEmptySector= Voxelarium.Sector( cluster );
    cluster.WorkingEmptySector.Pos_y = 0;
    cluster.WorkingEmptySector.MakeSector( Voxelarium.Voxels.types[0] );


    return cluster;
}

var SectorTables = []; // cache of lookup tables
function InitStatics( x,y,z)
		{
			var tables = SectorTables.find( (tab)=>{ return( tab.x==x && tab.y==y && tab.z == z ) });
			if( !tables )
			{
				tables = {
					x: x,
					y: y,
					z: z,
					tableX : new Array( x+2 ),
					tableY : new Array( y+2 ),
					tableZ : new Array( z+2 ),
					ofTableX : new Array( x+2 ),
					ofTableY : new Array( y+2 ),
					ofTableZ : new Array( z+2 )
				}
				//tables.tableX.forEach( (elem)=>{elem=0})
				//console.log( "tableX init is ", tables.tableX)
				tables.tableX[0] = 1;
				tables.tableX[x + 1] = 2;
				tables.tableZ[0] = 3;
				tables.tableZ[y + 1] = 6;
				tables.tableY[0] = 9;
				tables.tableY[z + 1] = 18;
                n = 0;
                tables.ofTableX[n] = ( ( ( n == 0 ) ? ( x - 1 ) : ( n == ( x + 1 ) ) ? 0 : ( n - 1 ) ) * y );
                tables.ofTableY[n] = ( ( ( n == 0 ) ? ( y - 1 ) : ( n == ( y + 1 ) ) ? 0 : ( n - 1 ) ) );
                tables.ofTableZ[n] = ( ( ( n == 0 ) ? ( z - 1 ) : ( n == ( z + 1 ) ) ? 0 : ( n - 1 ) ) * y * z );
                n = x+1;
                tables.ofTableX[n] = ( ( ( n == 0 ) ? ( x - 1 ) : ( n == ( x + 1 ) ) ? 0 : ( n - 1 ) ) * y );
                tables.ofTableY[n] = ( ( ( n == 0 ) ? ( y - 1 ) : ( n == ( y + 1 ) ) ? 0 : ( n - 1 ) ) );
                tables.ofTableZ[n] = ( ( ( n == 0 ) ? ( z - 1 ) : ( n == ( z + 1 ) ) ? 0 : ( n - 1 ) ) * y * z );
        for(  n = 1; n < x + 1; n++ ) {
					tables.ofTableX[n] = ( ( ( n == 0 ) ? ( x - 1 ) : ( n == ( x + 1 ) ) ? 0 : ( n - 1 ) ) * y );
                    tables.tableX[n] = 0;
        }
				for( var n = 1; n < y + 1; n++ ){
					tables.ofTableY[n] = ( ( ( n == 0 ) ? ( y - 1 ) : ( n == ( y + 1 ) ) ? 0 : ( n - 1 ) ) );
                    tables.tableY[n] = 0;
        }
				for(  n = 1; n < z + 1; n++ ) {
					tables.ofTableZ[n] = ( ( ( n == 0 ) ? ( z - 1 ) : ( n == ( z + 1 ) ) ? 0 : ( n - 1 ) ) * y * z );
          tables.tableZ[n] = 0;
        }
				SectorTables.push( tables );
			}
            Object.defineProperties( tables
                , { "x" : { writable:false}
                ,  "y" : { writable:false}
                ,  "z" : { writable:false}
                ,  "tableX" : { writable:false}
                ,  "tableY" : { writable:false}
                ,  "tableZ" : { writable:false}
                ,  "ofTableX" : { writable:false}
                ,  "ofTableY" : { writable:false}
                ,  "ofTableZ" : { writable:false}
            });
            Object.freeze( tables.tableX );
            Object.freeze( tables.tableY );
            Object.freeze( tables.tableZ );
            Object.freeze( tables.ofTableX );
            Object.freeze( tables.ofTableY );
            Object.freeze( tables.ofTableZ );
			return tables;
		}

},{"./constants.js":39,"./reactor.js":49}],39:[function(require,module,exports){

Voxelarium.D = function( valname, value ) {
    if( typeof valname == "object" ) {
        Object.keys(valname).forEach( (key)=>{
            Object.defineProperty(Voxelarium, key, { value:valname[key], writable: false })
        })
    } else
        Object.defineProperty(Voxelarium, valname, { writable: false })
}
Voxelarium.Enum = function( valname, value ) {
    if( typeof valname == "object" ) {
        Object.keys(valname).forEach( (key)=>{
            Object.defineProperty(Voxelarium, key, { value:valname[key], writable: false })
            Object.keys(valname[key]).forEach( (evalue)=>{
                Object.defineProperty(Voxelarium[key], evalue, { value:valname[key][evalue], writable: false })

            })
        })
    } else
        Object.defineProperty(Voxelarium, valname, { writable: false })
}


Voxelarium.D( {
        ZVOXEL_DRAWINFO_VOID : 0,
//public const int ZVOXEL_DRAWINFO_NOTVOID = 1;
    ZVOXEL_DRAWINFO_DRAWFULLVOXELOPACITY : 1,
  ZVOXEL_DRAWINFO_DRAWTRANSPARENTRENDERING : 2,
  ZVOXEL_DRAWINFO_SPECIALRENDERING : 8,
  ZVOXEL_DRAWINFO_SHADER : 16,
  ZVOXEL_DRAWINFO_DECAL : 32,  // image is used over shader output
})
Voxelarium.D( {
    ZVOXEL_DRAWINFO_CULLINGBITS : ( /*ZVOXEL_DRAWINFO_NOTVOID |*/ Voxelarium.ZVOXEL_DRAWINFO_DRAWFULLVOXELOPACITY | Voxelarium.ZVOXEL_DRAWINFO_DRAWTRANSPARENTRENDERING )
});


Voxelarium.Enum( {
    FACEDRAW_Operations : {
			LEFT : 0x00001
		, RIGHT : 0x00002
		, AHEAD : 0x00004
		, BEHIND : 0x00008
		, ABOVE : 0x00010
		, BELOW : 0x00020
		, LEFT_HAS_ABOVE : 0x00000400
		, LEFT_HAS_BELOW : 0x00000800
		, LEFT_HAS_AHEAD : 0x00001000
		, LEFT_HAS_BEHIND : 0x00002000
		, RIGHT_HAS_ABOVE : 0x00004000
		, RIGHT_HAS_BELOW : 0x00008000
		, RIGHT_HAS_AHEAD : 0x00010000
		, RIGHT_HAS_BEHIND : 0x00020000
		, ABOVE_HAS_LEFT : 0x00000400//LEFT_HAS_ABOVE
		, ABOVE_HAS_RIGHT : 0x00004000//RIGHT_HAS_ABOVE
		, ABOVE_HAS_AHEAD : 0x00040000
		, ABOVE_HAS_BEHIND : 0x00080000
		, BELOW_HAS_LEFT : 0x00000800//LEFT_HAS_BELOW
		, BELOW_HAS_RIGHT : 0x00008000//RIGHT_HAS_BELOW
		, BELOW_HAS_AHEAD : 0x00100000
		, BELOW_HAS_BEHIND : 0x00200000
		, AHEAD_HAS_LEFT : 0x00001000//LEFT_HAS_AHEAD
		, AHEAD_HAS_RIGHT : 0x00100000//RIGHT_HAS_AHEAD
		, AHEAD_HAS_ABOVE : 0x00040000//ABOVE_HAS_AHEAD
		, AHEAD_HAS_BELOW : 0x00100000//BELOW_HAS_AHEAD
		, BEHIND_HAS_LEFT : 0x00002000//LEFT_HAS_BEHIND
		, BEHIND_HAS_RIGHT : 0x00020000//RIGHT_HAS_BEHIND
		, BEHIND_HAS_ABOVE : 0x00080000//ABOVE_HAS_BEHIND
		, BEHIND_HAS_BELOW : 0x00200000//BELOW_HAS_BEHIND
		, ALL : ( 1|2|4|8|16|32 /* LEFT | RIGHT | AHEAD | BEHIND | ABOVE | BELOW */ )
		, NONE : 0x00000
		, FLANK : ( 1|2|4|8 /* LEFT | RIGHT | AHEAD | BEHIND */ )
		, UD : ( 16|32 /*ABOVE | BELOW*/ )
		, ALL_BITS : 0x3FFFFF
    }});


Voxelarium.Enum( { RelativeVoxelOrds : {
	INCENTER :0
   , LEFT     :1
   , RIGHT :2
   , INFRONT :3
   , AHEAD : 3 //RelativeVoxelOrds.INFRONT
   , BEHIND  :4
   , ABOVE   :5
   , BELOW   :6

   , LEFT_ABOVE :7
   , ABOVE_LEFT : 7//RelativeVoxelOrds.LEFT_ABOVE
   , RIGHT_ABOVE :8
   , ABOVE_RIGHT : 8//RelativeVoxelOrds.RIGHT_ABOVE

   , INFRONT_ABOVE :9
   , AHEAD_ABOVE : 9// RelativeVoxelOrds.INFRONT_ABOVE
   , ABOVE_AHEAD : 9//RelativeVoxelOrds.INFRONT_ABOVE

   , BEHIND_ABOVE  :10
   , ABOVE_BEHIND : 10//RelativeVoxelOrds.BEHIND_ABOVE

   , LEFT_AHEAD   :11
   , AHEAD_LEFT : 11//RelativeVoxelOrds.LEFT_AHEAD

   , RIGHT_AHEAD   :12
   , AHEAD_RIGHT : 12//RelativeVoxelOrds.RIGHT_AHEAD

   , LEFT_BELOW :13
   , BELOW_LEFT : 13//RelativeVoxelOrds.LEFT_BELOW
   , RIGHT_BELOW :14
   , BELOW_RIGHT : 14//RelativeVoxelOrds.RIGHT_BELOW
   , INFRONT_BELOW :15
   , AHEAD_BELOW : 15//RelativeVoxelOrds.INFRONT_BELOW
   , BELOW_AHEAD : 15//RelativeVoxelOrds.INFRONT_BELOW
   , BEHIND_BELOW  :16
   , BELOW_BEHIND : 16//RelativeVoxelOrds.BEHIND_BELOW

   , LEFT_BEHIND   :17
   , BEHIND_LEFT : 17//RelativeVoxelOrds.LEFT_BEHIND
   , BEHIND_RIGHT   :18
   , RIGHT_BEHIND : 18//RelativeVoxelOrds.BEHIND_RIGHT


   , LEFT_AHEAD_ABOVE   : 19
   , RIGHT_AHEAD_ABOVE  : 20
   , LEFT_AHEAD_BELOW   : 21
   , RIGHT_AHEAD_BELOW  : 22
   , LEFT_BEHIND_ABOVE  : 23
   , RIGHT_BEHIND_ABOVE : 24
   , LEFT_BEHIND_BELOW  : 25
   , RIGHT_BEHIND_BELOW : 26

   , LEFT_ABOVE_AHEAD : 19//RelativeVoxelOrds.LEFT_AHEAD_ABOVE   //: 19
   , RIGHT_ABOVE_AHEAD : 20//RelativeVoxelOrds.RIGHT_AHEAD_ABOVE  // : 20
   , LEFT_BELOW_AHEAD : 21//RelativeVoxelOrds.LEFT_AHEAD_BELOW     //: 21
   , RIGHT_BELOW_AHEAD : 22//RelativeVoxelOrds.RIGHT_AHEAD_BELOW   //: 22
   , LEFT_ABOVE_BEHIND : 23//RelativeVoxelOrds.LEFT_BEHIND_ABOVE  //: 23
   , RIGHT_ABOVE_BEHIND : 24//RelativeVoxelOrds.RIGHT_BEHIND_ABOVE// : 24
   , LEFT_BELOW_BEHIND : 25//RelativeVoxelOrds.LEFT_BEHIND_BELOW  //: 25
   , RIGHT_BELOW_BEHIND : 26//RelativeVoxelOrds.RIGHT_BEHIND_BELOW// : 26

   , ABOVE_AHEAD_LEFT : 19//RelativeVoxelOrds.LEFT_AHEAD_ABOVE   //: 19
   , ABOVE_AHEAD_RIGHT : 20//RelativeVoxelOrds.RIGHT_AHEAD_ABOVE  // : 20
   , BELOW_AHEAD_LEFT : 21//RelativeVoxelOrds.LEFT_AHEAD_BELOW    // : 21
   , BELOW_AHEAD_RIGHT : 22//RelativeVoxelOrds.RIGHT_AHEAD_BELOW  // : 22
   , ABOVE_BEHIND_LEFT : 23//RelativeVoxelOrds.LEFT_BEHIND_ABOVE  //: 23
   , ABOVE_BEHIND_RIGHT : 24//RelativeVoxelOrds.RIGHT_BEHIND_ABOVE //: 24
   , BELOW_BEHIND_LEFT : 25//RelativeVoxelOrds.LEFT_BEHIND_BELOW  //: 25
   , BELOW_BEHIND_RIGHT : 26//RelativeVoxelOrds.RIGHT_BEHIND_BELOW// : 26

   , AHEAD_ABOVE_LEFT : 19//RelativeVoxelOrds.LEFT_AHEAD_ABOVE   //: 19
   , AHEAD_ABOVE_RIGHT : 20//RelativeVoxelOrds.RIGHT_AHEAD_ABOVE //  : 20
   , AHEAD_BELOW_LEFT : 21//RelativeVoxelOrds.LEFT_AHEAD_BELOW   //  : 21
   , BEHIND_ABOVE_LEFT : 22//RelativeVoxelOrds.LEFT_BEHIND_ABOVE // : 23
   , AHEAD_BELOW_RIGHT : 23//RelativeVoxelOrds.RIGHT_AHEAD_BELOW //  : 22
   , BEHIND_ABOVE_RIGHT : 24//RelativeVoxelOrds.RIGHT_BEHIND_ABOVE //: 24
   , BEHIND_BELOW_LEFT : 25//RelativeVoxelOrds.LEFT_BEHIND_BELOW  //: 25
   , BEHIND_BELOW_RIGHT : 26//RelativeVoxelOrds.RIGHT_BEHIND_BELOW //: 26

   , ABOVE_LEFT_AHEAD : 19//RelativeVoxelOrds.LEFT_AHEAD_ABOVE  // : 19
   , ABOVE_RIGHT_AHEAD : 20//RelativeVoxelOrds.RIGHT_AHEAD_ABOVE //  : 20
   , BELOW_LEFT_AHEAD : 21//RelativeVoxelOrds.LEFT_AHEAD_BELOW    // : 21
   , BELOW_RIGHT_AHEAD : 22//RelativeVoxelOrds.RIGHT_AHEAD_BELOW  // : 22
   , ABOVE_LEFT_BEHIND : 23//RelativeVoxelOrds.LEFT_BEHIND_ABOVE  //: 23
   , ABOVE_RIGHT_BEHIND : 24//RelativeVoxelOrds.RIGHT_BEHIND_ABOVE //: 24
   , BELOW_LEFT_BEHIND : 25//RelativeVoxelOrds.LEFT_BEHIND_BELOW  //: 25
   , BELOW_RIGHT_BEHIND : 26//RelativeVoxelOrds.RIGHT_BEHIND_BELOW //: 26

   , AHEAD_LEFT_ABOVE : 19//RelativeVoxelOrds.LEFT_AHEAD_ABOVE  // : 19
   , AHEAD_RIGHT_ABOVE : 20//RelativeVoxelOrds.RIGHT_AHEAD_ABOVE //  : 20
   , AHEAD_LEFT_BELOW : 21//RelativeVoxelOrds.LEFT_AHEAD_BELOW   //  : 21
   , AHEAD_RIGHT_BELOW : 22//RelativeVoxelOrds.RIGHT_AHEAD_BELOW //  : 22
   , BEHIND_LEFT_ABOVE : 23//RelativeVoxelOrds.LEFT_BEHIND_ABOVE // : 23
   , BEHIND_RIGHT_ABOVE : 24//RelativeVoxelOrds.RIGHT_BEHIND_ABOVE //: 24
   , BEHIND_LEFT_BELOW : 25//RelativeVoxelOrds.LEFT_BEHIND_BELOW  //: 25
   , BEHIND_RIGHT_BELOW : 26//RelativeVoxelOrds.RIGHT_BEHIND_BELOW //: 26
}})


const IntFaceStateTable = [
          [ // State 0: Clear = no FullOpaque = no TranspRend = no
            0 , // Clear = 1 FullOpaque = 0 TranspRend = 0
            0 , // Clear = 0 FullOpaque = 1 TranspRend = 0
            0 , // Clear = 0 FullOpaque = 0 TranspRend = 1
            0 , // Clear = 0 FullOpaque = 1 TranspRend = 1
          ] ,
          [ // State 2: Clear = no FullOpaque = yes TranspRend = no
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 1 FullOpaque = 0 TranspRend = 0
            0 , // Clear = 0 FullOpaque = 1 TranspRend = 0
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 0 TranspRend = 1
            0 , // Clear = 0 FullOpaque = 1 TranspRend = 1
            ],
          [ // State 4 : Clear = no FullOpaque = no TranspRend = yes
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 1 FullOpaque = 0 TranspRend = 0
            0  , // Clear = 0 FullOpaque = 1 TranspRend = 0
            0 , // Clear = 0 FullOpaque = 0 TranspRend = 1
            0 , // Clear = 0 FullOpaque = 1 TranspRend = 1
          ],
          null/*new VoxelSector.FACEDRAW_Operations[]{ // State 5: Clear = yes FullOpaque = yes TranspRend = yes
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 1 FullOpaque = 0 TranspRend = 0
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 0
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 0 TranspRend = 1
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 1
          }*/,
      ];

      Voxelarium.IntFaceStateTable = IntFaceStateTable;

const ExtFaceStateTable = [
          [ // State 0: Clear = no FullOpaque = no TranspRend = no
            0 , // Clear = 1 FullOpaque = 0 TranspRend = 0
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 0
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 0 TranspRend = 1
            Voxelarium.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 1
        ],
          [ // State 2: Clear = no FullOpaque = yes TranspRend = no
            0  , // Clear = 0 FullOpaque = 0 TranspRend = 0
            0  , // Clear = 0 FullOpaque = 1 TranspRend = 0
            0  , // Clear = 0 FullOpaque = 0 TranspRend = 1
            0  , // Clear = 1 FullOpaque = 1 TranspRend = 1
        ],
          [ // State 4 : Clear = no FullOpaque = no TranspRend = yes
            0 , // Clear = 1
            Voxelarium.FACEDRAW_Operations.ALL_BITS  , // Clear = 0 FullOpaque = 1 TranspRend = 0
            0  , // FullOpaque = 0 TranspRend = 1
            0  , // FullOpaque = 1 TranspRend = 1
          ],
         null/* new VoxelSector.FACEDRAW_Operations[8]{ // State 7: Clear = yes FullOpaque = yes TranspRend = yes
            0   , // Clear = 1 FullOpaque = 0 TranspRend = 0
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 0
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 0 TranspRend = 1
            VoxelSector.FACEDRAW_Operations.ALL_BITS , // Clear = 0 FullOpaque = 1 TranspRend = 1
          }*/
      ];
      Voxelarium.ExtFaceStateTable = ExtFaceStateTable;

function ZBlocPosN( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
}

    const NormalBasePosition = Voxelarium.NormalBasePosition = [
          new ZBlocPosN ( -1, 0, 0 )
          , new ZBlocPosN ( 1, 0, 0 )
          , new ZBlocPosN( 0, 0, 1 )
          , new ZBlocPosN( 0, 0, -1 )
          , new ZBlocPosN( 0, 1, 0 )
          , new ZBlocPosN( 0, -1, 0 ) ];


},{}],40:[function(require,module,exports){
var font = {
height:8, baseline:0, chars:65536, flags:64, name:"TI99.js", characters:[null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:1,w:7,ofs:2,asc:7,dsc:1,data:new Uint8Array([1,1,1,1,1,0,1]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:5,data:new Uint8Array([5,5,5]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([10,10,31,10,31,10,10]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,21,5,14,20,21,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([3,19,8,4,2,25,24]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([2,5,5,2,21,9,22]) }
,{sz:2,w:7,ofs:2,asc:7,dsc:5,data:new Uint8Array([2,2,1]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([4,2,1,1,1,2,4]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([1,2,4,4,4,2,1]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:2,data:new Uint8Array([10,4,31,4,10]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:2,data:new Uint8Array([4,4,31,4,4]) }
,{sz:2,w:7,ofs:1,asc:3,dsc:1,data:new Uint8Array([3,2,1]) }
,{sz:5,w:7,ofs:0,asc:4,dsc:4,data:new Uint8Array([31]) }
,{sz:2,w:7,ofs:1,asc:2,dsc:1,data:new Uint8Array([3,3]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:2,data:new Uint8Array([16,8,4,2,1]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,17,17,17,17,14]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([2,3,2,2,2,2,7]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,16,8,4,2,31]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,16,12,16,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([8,12,10,9,31,8,8]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,1,15,16,16,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([12,2,1,15,17,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,16,8,4,2,2,2]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,17,14,17,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,17,30,16,8,6]) }
,{sz:2,w:7,ofs:1,asc:6,dsc:2,data:new Uint8Array([3,3,0,3,3]) }
,{sz:2,w:7,ofs:1,asc:6,dsc:1,data:new Uint8Array([3,3,0,3,2,1]) }
,{sz:4,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([8,4,2,1,2,4,8]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:3,data:new Uint8Array([31,0,31]) }
,{sz:4,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([1,2,4,8,4,2,1]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,16,8,4,0,4]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,29,21,29,1,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,17,31,17,17,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([15,18,18,14,18,18,15]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,1,1,1,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([15,18,18,18,18,18,15]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,1,1,15,1,1,31]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,1,1,15,1,1,1]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,1,29,17,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,17,31,17,17,17]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([7,2,2,2,2,2,7]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([16,16,16,16,16,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,9,5,3,5,9,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([1,1,1,1,1,1,31]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,27,21,21,17,17,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,19,19,21,25,25,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,17,17,17,17,17,31]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([15,17,17,15,1,1,1]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,17,17,21,9,22]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([15,17,17,15,5,9,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([14,17,1,14,16,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,4,4,4,4,4,4]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,17,17,17,17,14]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,17,10,10,4,4]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,17,21,21,21,10]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,10,4,10,17,17]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([17,17,10,4,4,4,4]) }
,{sz:5,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([31,16,8,4,2,1,31]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([7,1,1,1,1,1,7]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:2,data:new Uint8Array([1,2,4,8,16]) }
,{sz:3,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([7,4,4,4,4,4,7]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:4,data:new Uint8Array([4,10,17]) }
,{sz:5,w:7,ofs:0,asc:1,dsc:1,data:new Uint8Array([31]) }
,{sz:3,w:7,ofs:1,asc:6,dsc:4,data:new Uint8Array([1,2,4]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([14,17,31,17,17]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([15,18,14,18,15]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([30,1,1,1,30]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([15,18,18,18,15]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([31,1,15,1,31]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([31,1,15,1,1]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([30,1,29,17,14]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,17,31,17,17]) }
,{sz:3,w:7,ofs:1,asc:5,dsc:1,data:new Uint8Array([7,2,2,2,7]) }
,{sz:4,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([8,8,8,9,6]) }
,{sz:4,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([9,5,3,5,9]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([1,1,1,1,31]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,27,21,17,17]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,19,21,25,17]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([31,17,17,17,31]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([15,17,15,1,1]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([14,17,21,9,22]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([15,17,15,9,17]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([30,1,14,16,15]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([31,4,4,4,4]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,17,17,17,14]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,17,10,10,4]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,17,21,21,10]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,10,4,10,17]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([17,10,4,4,4]) }
,{sz:5,w:7,ofs:0,asc:5,dsc:1,data:new Uint8Array([31,8,4,2,31]) }
,{sz:4,w:7,ofs:0,asc:7,dsc:1,data:new Uint8Array([12,2,2,1,2,2,12]) }
,{sz:1,w:7,ofs:2,asc:7,dsc:1,data:new Uint8Array([1,1,1,0,1,1,1]) }
,{sz:4,w:7,ofs:1,asc:7,dsc:1,data:new Uint8Array([3,4,4,8,4,4,3]) }
,{sz:5,w:7,ofs:0,asc:6,dsc:4,data:new Uint8Array([2,21,8]) }
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,null
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:0,w:7,ofs:0,asc:0,dsc:0}
,{sz:5,w:7,ofs:0,asc:4,dsc:4,data:new Uint8Array([31]) }
] };

Voxelarium.Fonts.TI99 = font;

},{}],41:[function(require,module,exports){

if( Number(THREE.REVISION) >= 76 ) {
	var count_is_getter = false;
  Object.freeze( count_is_getter );
}
else {
	var count_is_getter = true;
  Object.freeze( count_is_getter );
}

const attribs = [ { name:"position",
                    bytes:4,
                    size:3,
                    normalize:false,
                    buftype:Float32Array },
                  { name:"uv",
                    bytes:4,
                    size:2,
                    normalize:false,
                    buftype:Float32Array },
                  { name:"color",
                    bytes:4,
                    size:4,
                    normalize:false,
                    buftype:Float32Array },
                  { name:"normal",
                    bytes:4,
                    size:3,
                    normalize:false,
                    buftype:Float32Array },

//, "in_FaceColor", "in_Modulous"
//, "in_Pow"
//, "in_flat_color", "in_use_texture", "in_decal_texture"
];


Voxelarium.GeometryBasicBuffer = function () {
    var buffer = {};
     buffer.geometry = new THREE.BufferGeometry();

     buffer.geometry.uniforms = {
             edge_only : false,
     	};

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    buffer.position = new Float32Array( [] );
    buffer.uv = new Float32Array( [] );
    buffer.color = new Float32Array( [] );
    buffer.normal = new Float32Array( [] );
    /*
    buffer.in_FaceColor = new Uint8Array( [] );
    buffer.in_Pow = new Uint8Array( [] );
    buffer.in_use_texture = new Uint8Array( [] );
    buffer.in_flat_color = new Uint8Array( [] );
    buffer.in_decal_texture = new Uint8Array( [] );
    buffer.in_Modulous = new Int8Array( [] );
    */
    buffer.available = 0;
    buffer.used = 0;

    buffer.clear = function() {
        this.used = 0;
    }

    attribs.forEach( (att)=>{
      buffer.geometry.addAttribute( att.name, new THREE.BufferAttribute( buffer[att.name], att.size, att.normalize ))
    })


     buffer.expand = function() {
         var newbuf;
         this.available = ( this.available + 1 ) * 2;

          attribs.forEach( (attrib)=>{
            newbuf =   new attrib.buftype( new ArrayBuffer( this.available * ( attrib.bytes * attrib.size ) ) );
            newbuf.set( buffer[attrib.name] );
            buffer[attrib.name] = newbuf;
          })
     };

     buffer.markDirty = function () {
        this.geometry.drawRange.count = this.used;
         attribs.forEach( (attrib)=>{
             var attribu = this.geometry.getAttribute(attrib.name);
             attribu.needsUpdate = true;
             attribu.array = buffer[attrib.name];
             if( !count_is_getter )
                attribu.count = this.used;
         })
         //console.log( "dirty", this.geometry.attributes );
     }

     buffer.addPoint = function( v, t, tBase, c, fc, n, p, ut, flat, dt, mod ) {
         if( this.used >= this.available )
            this.expand();
            const u2 = this.used * 2;
            const u3 = this.used * 3;
            const u4 = this.used * 4;
        if( t ) {
            this.uv[u2+0] = t[tBase+0];
            this.uv[u2+1] = t[tBase+1];
        }
        else {
            this.uv[u2+0] = 0;
            this.uv[u2+1] = 0;
        }
        this.position[u3 + 0 ] = v.x;
        this.position[u3 + 1 ] = v.y;
        this.position[u3 + 2 ] = v.z;

          this.color[u4 + 0 ] = 1;
          this.color[u4 + 1 ] = 1;
          this.color[u4 + 2 ] = 1;
          this.color[u4 + 3 ] = 1;

        this.normal[u3 + 0] = n?n.x:0;
        this.normal[u3 + 1] = n?n.y:0;
        this.normal[u3 + 2] = n?n.z:1;

        /*
        if( fc ) {
        this.in_FaceColor[u4 + 0 ] = fc.x*255;
        this.in_FaceColor[u4 + 1 ] = fc.y*255;
        this.in_FaceColor[u4 + 2 ] = fc.z*255;
        this.in_FaceColor[u4 + 3 ] = fc.w*255; }

        this.in_Pow[ this.used ] = p;
        this.in_use_texture[ this.used ] = ut;
        this.in_flat_color[this.used] = flat;
        this.in_decal_texture[this.used] = dt;
        this.in_Modulous[this.used * 2 + 0] = mod[0];
        this.in_Modulous[this.used * 2 + 1] = mod[1];
*/
        this.used++;
    };

     //buffer.

     buffer.AddQuad = function( norm, P1,P2,P3,P4,faceColor,color,pow ) {

         const min = 0;
         const max = 1;
         this.addPoint( P1, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,min] );
         this.addPoint( P2, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( P3, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
         this.addPoint( P2, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( P4, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,max] );
         this.addPoint( P3, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
     }
     buffer.AddQuadTexture = function( norm, P1,P2,P3,P4,textureCoords ) {
         const min = 0;
         const max = 1;
         this.addPoint( P1, textureCoords.uv_array, 0, white, undefined, norm, undefined, 255, false, false, [min,min] );
         this.addPoint( P2, textureCoords.uv_array, 2, white, undefined, norm, undefined, 255, false, false, [max,min] );
         this.addPoint( P3, textureCoords.uv_array, 4, white, undefined, norm, undefined, 255, false, false, [min,max] );
         this.addPoint( P2, textureCoords.uv_array, 2, white, undefined, norm, undefined, 255, false, false, [max,min] );
         this.addPoint( P4, textureCoords.uv_array, 6, white, undefined, norm, undefined, 255, false, false, [max,max] );
         this.addPoint( P3, textureCoords.uv_array, 4, white, undefined, norm, undefined, 255, false, false, [min,max] );
     }
     buffer.addSimpleQuad = function( quad, color, faceColor, norm, pow ) {
         var min = 0;
         var max = 1;
         this.addPoint( quad[0], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,min] );
         this.addPoint( quad[1], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( quad[2], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
         this.addPoint( quad[1], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( quad[3], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,max] );
         this.addPoint( quad[2], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
     }
     const white = new THREE.Vector4( 0.5, 0.5, 0.5, 1 );
     buffer.addSimpleQuadTex = function( quad, uvs, norm, pow ) {
         var min = 0;
         var max = 1.0;
         this.addPoint( quad[0], uvs, 0, white, white, norm, pow, 255, false, false, [min,min] );
         this.addPoint( quad[1], uvs, 2, white, white, norm, pow, 255, false, false, [max,min] );
         this.addPoint( quad[2], uvs, 4, white, white, norm, pow, 255, false, false, [min,max] );
         this.addPoint( quad[1], uvs, 2, white, white, norm, pow, 255, false, false, [max,min] );
         this.addPoint( quad[3], uvs, 6, white, white, norm, pow, 255, false, false, [max,max] );
         this.addPoint( quad[2], uvs, 4, white, white, norm, pow, 255, false, false, [min,max] );
     }

     buffer.makeVoxCube = function( size, voxelType ) {
        var v1 = new THREE.Vector3(1,1,1);
        var v2 = new THREE.Vector3(-1,1,1);
        var v3 = new THREE.Vector3(1,-1,1);
        var v4 = new THREE.Vector3(-1,-1,1);
        var v5 = new THREE.Vector3(1,1,-1);
        var v6 = new THREE.Vector3(-1,1,-1);
        var v7 = new THREE.Vector3(1,-1,-1);
        var v8 = new THREE.Vector3(-1,-1,-1);
        var quad;
        if( voxelType && voxelType.image ) {
            var in_uvs = voxelType.textureCoords.uvs;
            var uvs = voxelType.textureCoords.uv_array;
            buffer.addSimpleQuadTex( quad=[v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size),v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size)]
                , uvs
                , THREE.Vector3Forward
                , 200 )
                //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();

            buffer.addSimpleQuadTex( quad = [v6.clone().multiplyScalar(size),v5.clone().multiplyScalar(size),v8.clone().multiplyScalar(size),v7.clone().multiplyScalar(size)]
                , voxelType.textureCoords.uvs
                , THREE.Vector3Backward
                , 200 )
                //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v5.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Up
                    , 200 )
                  //  quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Down
                    , 200 )
                    //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v5.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v3.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Right
                    , 200 )
                    //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v2.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Left
                    , 200 )
                    //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();

        }else {
        buffer.addSimpleQuad( quad=[v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size),v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size)]
            , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0.2, 0.0, 1, 1.0 )
            , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Forward
            , 200 )
            //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v6.clone().multiplyScalar(size),v5.clone().multiplyScalar(size),v8.clone().multiplyScalar(size),v7.clone().multiplyScalar(size)]
            , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0.2, 1, 0, 1.0 )
            , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Backward
            , 200 )
            //quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v5.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 0.0, 0, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Up
                , 200 )
          //      quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0, 1, 1, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Down
                , 200 )
            //    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v5.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v3.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 0.0, 1, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Right
                , 200 )
            //    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v2.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 1, 0, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Left
                , 200 )
          //      quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        }
        this.markDirty(  );
     }

     //var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
     //var mesh = new THREE.Mesh( geometry, material );
     return buffer;
}




function updatePosition() {
    buffer.geometry.attributes.position.needsUpdate = true;
}

},{}],42:[function(require,module,exports){

const attribs = ["position","uv"
,"in_Color", "in_FaceColor", "in_Modulous"
,"normal", "in_Pow", "in_flat_color", "in_use_texture", "in_decal_texture"
];
const attrib_bytes =     [4,4,1,1,1,4,4,1,1,1]
const attrib_sizes =     [3,2,4,4,2,3,1,1,1,1]
const attrib_normalize = [false,false,true,true,0,0,0,0,1,0]
const attrib_buftype = [Float32Array,Float32Array
    ,Uint8Array,Uint8Array,Uint8Array
    ,Float32Array,Float32Array,Uint8Array,Uint8Array, Uint8Array]

Voxelarium.GeometryBuffer = function () {
    var buffer = {};
     buffer.geometry = new THREE.BufferGeometry();

     buffer.geometry.uniforms = {
             edge_only : false,
     	};

    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    buffer.position = new Float32Array( [] );
    buffer.uv = new Float32Array( [] );
    buffer.in_Color = new Uint8Array( [] );
    buffer.in_FaceColor = new Uint8Array( [] );
    buffer.normal = new Float32Array( [] );
    buffer.in_Pow = new Float32Array( [] );
    buffer.in_use_texture = new Uint8Array( [] );
    buffer.in_flat_color = new Uint8Array( [] );
    buffer.in_decal_texture = new Uint8Array( [] );
    buffer.in_Modulous = new Int8Array( [] );
    buffer.available = 0;
    buffer.used = 0;

    buffer.clear = function() {
        this.used = 0;
    }

    attribs.forEach( (att,index)=>{
      buffer.geometry.addAttribute( att, new THREE.BufferAttribute( buffer[att], attrib_sizes[index], attrib_normalize[index] ))
    })


     buffer.expand = function() {
         var newbuf;
         this.available = ( this.available + 1 ) * 2;

          attribs.forEach( (att,index)=>{
            newbuf =   new attrib_buftype[index]( new ArrayBuffer( this.available * ( attrib_bytes[index] * attrib_sizes[index] ) ) );
            newbuf.set( buffer[att] );
            buffer[att] = newbuf;
          })
     };

     buffer.markDirty = function () {

         attribs.forEach( (att)=>{
             var attrib = this.geometry.getAttribute(att);
             attrib.needsUpdate = true;
             attrib.array = buffer[att];
             attrib.count = buffer.used;
         })
         //console.log( "dirty", this.geometry.attributes );
     }

     buffer.addPoint = function( v, t, tBase, c, fc, n, p, ut, flat, dt, mod ) {
         if( this.used >= this.available )
            this.expand();
            const u2 = this.used * 2;
            const u3 = this.used * 3;
            const u4 = this.used * 4;
        if( t ) {
            this.uv[u2+0] = t[tBase+0];
            this.uv[u2+1] = t[tBase+1];
        }
        else {
            this.uv[u2+0] = 0;
            this.uv[u2+1] = 0;
        }
        this.position[u3 + 0 ] = v.x;
        this.position[u3 + 1 ] = v.y;
        this.position[u3 + 2 ] = v.z;
        if( c ) {
        this.in_Color[u4 + 0 ] = c.x*255;
        this.in_Color[u4 + 1 ] = c.y*255;
        this.in_Color[u4 + 2 ] = c.z*255;
        this.in_Color[u4 + 3 ] = c.w*255; }

        if( fc ) {
        this.in_FaceColor[u4 + 0 ] = fc.x*255;
        this.in_FaceColor[u4 + 1 ] = fc.y*255;
        this.in_FaceColor[u4 + 2 ] = fc.z*255;
        this.in_FaceColor[u4 + 3 ] = fc.w*255; }

        this.normal[u3 + 0] = n?n.x:0;
        this.normal[u3 + 1] = n?n.y:0;
        this.normal[u3 + 2] = n?n.z:1;

        this.in_Pow[ this.used ] = p;
        this.in_use_texture[ this.used ] = ut;
        this.in_flat_color[this.used] = flat;
        this.in_decal_texture[this.used] = dt;
        this.in_Modulous[this.used * 2 + 0] = mod[0];
        this.in_Modulous[this.used * 2 + 1] = mod[1];

        this.used++;
    };

     //buffer.

     buffer.AddQuad = function( norm, P1,P2,P3,P4,faceColor,color,pow ) {

         const min = 0;
         const max = 1;
         this.addPoint( P1, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,min] );
         this.addPoint( P2, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( P3, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
         this.addPoint( P2, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( P4, undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,max] );
         this.addPoint( P3, undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
     }
     buffer.AddQuadTexture = function( norm, P1,P2,P3,P4,textureCoords ) {
         const min = 0;
         const max = 1;
         this.addPoint( P1, textureCoords.uv_array, 0, undefined, undefined, norm, undefined, 255, false, false, [min,min] );
         this.addPoint( P2, textureCoords.uv_array, 2, undefined, undefined, norm, undefined, 255, false, false, [max,min] );
         this.addPoint( P3, textureCoords.uv_array, 4, undefined, undefined, norm, undefined, 255, false, false, [min,max] );
         this.addPoint( P2, textureCoords.uv_array, 2, undefined, undefined, norm, undefined, 255, false, false, [max,min] );
         this.addPoint( P4, textureCoords.uv_array, 6, undefined, undefined, norm, undefined, 255, false, false, [max,max] );
         this.addPoint( P3, textureCoords.uv_array, 4, undefined, undefined, norm, undefined, 255, false, false, [min,max] );
     }
     buffer.addSimpleQuad = function( quad, color, faceColor, norm, pow ) {
         var min = 0;
         var max = 1;
         this.addPoint( quad[0], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,min] );
         this.addPoint( quad[1], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( quad[2], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
         this.addPoint( quad[1], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,min] );
         this.addPoint( quad[3], undefined, undefined, color, faceColor, norm, pow, false, false, false, [max,max] );
         this.addPoint( quad[2], undefined, undefined, color, faceColor, norm, pow, false, false, false, [min,max] );
     }
     const white = new THREE.Vector4( 0.5, 0, 0, 1 );
     buffer.addSimpleQuadTex = function( quad, uvs, norm, pow ) {
         var min = 0;
         var max = 1.0;
         this.addPoint( quad[0], uvs, 0, white, white, norm, pow, 255, false, false, [min,min] );
         this.addPoint( quad[1], uvs, 2, white, white, norm, pow, 255, false, false, [max,min] );
         this.addPoint( quad[2], uvs, 4, white, white, norm, pow, 255, false, false, [min,max] );
         this.addPoint( quad[1], uvs, 2, white, white, norm, pow, 255, false, false, [max,min] );
         this.addPoint( quad[3], uvs, 6, white, white, norm, pow, 255, false, false, [max,max] );
         this.addPoint( quad[2], uvs, 4, white, white, norm, pow, 255, false, false, [min,max] );
     }

     buffer.makeVoxCube = function( size, voxelType ) {
        var v1 = new THREE.Vector3(1,1,1);
        var v2 = new THREE.Vector3(-1,1,1);
        var v3 = new THREE.Vector3(1,-1,1);
        var v4 = new THREE.Vector3(-1,-1,1);
        var v5 = new THREE.Vector3(1,1,-1);
        var v6 = new THREE.Vector3(-1,1,-1);
        var v7 = new THREE.Vector3(1,-1,-1);
        var v8 = new THREE.Vector3(-1,-1,-1);
        var quad;
        if( voxelType && voxelType.image
				   && (( voxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_SHADER ) == 0 )
           ) {
            var in_uvs = voxelType.textureCoords.uvs;
            var uvs = voxelType.textureCoords.uv_array;
            buffer.addSimpleQuadTex( quad=[v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size),v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size)]
                , uvs
                , THREE.Vector3Forward
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();

            buffer.addSimpleQuadTex( quad = [v6.clone().multiplyScalar(size),v5.clone().multiplyScalar(size),v8.clone().multiplyScalar(size),v7.clone().multiplyScalar(size)]
                , voxelType.textureCoords.uvs
                , THREE.Vector3Backward
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v5.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Up
                    , 200 )
                    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Down
                    , 200 )
                    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v5.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v3.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Right
                    , 200 )
                    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
            buffer.addSimpleQuadTex( quad = [v2.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                    , voxelType.textureCoords.uvs
                    , THREE.Vector3Left
                    , 200 )
                    quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();

        }else {
        buffer.addSimpleQuad( quad=[v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size),v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size)]
            , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0.2, 0.0, 1, 1.0 )
            , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Forward
            , 200 )
            quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v6.clone().multiplyScalar(size),v5.clone().multiplyScalar(size),v8.clone().multiplyScalar(size),v7.clone().multiplyScalar(size)]
            , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0.2, 1, 0, 1.0 )
            , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Backward
            , 200 )
            quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v5.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 0.0, 0, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Up
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 0, 1, 1, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Down
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v5.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v3.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 0.0, 1, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Right
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        buffer.addSimpleQuad( quad = [v2.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , voxelType && voxelType.properties.EdgeColor || new THREE.Vector4( 1, 1, 0, 1.0 )
                , voxelType && voxelType.properties.FaceColor || new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Left
                , 200 )
                quad[0].delete(); quad[1].delete(); quad[2].delete(); quad[3].delete();
        }
        this.markDirty(  );
     }

     //var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
     //var mesh = new THREE.Mesh( geometry, material );
     return buffer;
}




function updatePosition() {
    buffer.geometry.attributes.position.needsUpdate = true;
}

},{}],43:[function(require,module,exports){


Voxelarium.GeometryBufferMono = function () {
    var buffer = {};
     buffer.geometry = new THREE.BufferGeometry();
     buffer.geometry.uniforms = {
             in_Color : new THREE.Vector4(1,0,0,1),
             in_FaceColor : new THREE.Vector4(0,1,0,1),
             in_Pow : 20.0 ,
             edge_only : true,
     	};
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    buffer.position = new Float32Array( [] );
    buffer.in_Texture = new Float32Array( [] );
    //buffer.in_Color = new Uint8Array( [] );
    //buffer.in_FaceColor = new Uint8Array( [] );
    buffer.in_Normal = new Float32Array( [] );
    //buffer.in_Pow = new Uint8Array( [] );
    buffer.in_use_texture = new Uint8Array( [] );
    buffer.in_flat_color = new Uint8Array( [] );
    buffer.in_decal_texture = new Uint8Array( [] );
    buffer.in_Modulous = new Int8Array( [] );
    buffer.available = 0;
    buffer.used = 0;

    buffer.clear = function() {
        this.used = 0;
    }
/*
    attribute vec4 vPosition;
    attribute vec2 in_Texture;
    attribute  vec4 in_Color;
    attribute  vec4 in_FaceColor;
    attribute vec3 in_Normal;
    attribute  float in_Pow;

    attribute  float in_use_texture;
    attribute  float in_flat_color;
    attribute  float in_decal_texture;

    attribute  vec2 in_Modulous;
*/
//buffer.geometry
    buffer.geometry.addAttribute( 'position', new THREE.BufferAttribute( buffer.position, 3 ) );
     buffer.geometry.addAttribute( 'in_Texture', new THREE.BufferAttribute( buffer.in_Texture, 2 ) );
     //buffer.geometry.addAttribute( 'in_Color', new THREE.BufferAttribute( buffer.in_Color, 4,true ) );
     //buffer.geometry.addAttribute( 'in_FaceColor', new THREE.BufferAttribute( buffer.in_FaceColor, 4, true ) );
     buffer.geometry.addAttribute( 'in_Normal', new THREE.BufferAttribute( buffer.in_Normal, 3 ) );
     //buffer.geometry.addAttribute( 'in_Pow', new THREE.BufferAttribute( buffer.in_Pow, 1 ) );
     buffer.geometry.addAttribute( 'in_use_texture', new THREE.BufferAttribute( buffer.in_use_texture, 1 ) );
     buffer.geometry.addAttribute( 'in_flat_color', new THREE.BufferAttribute( buffer.in_flat_color, 1 ) );
     buffer.geometry.addAttribute( 'in_decal_texture', new THREE.BufferAttribute( buffer.in_decal_texture, 1 ) );
     buffer.geometry.addAttribute( 'in_Modulous', new THREE.BufferAttribute( buffer.in_Modulous, 2, false ) );



     buffer.expand = function() {
         var newbuf;
         this.available = ( this.available + 1 ) * 2;

         newbuf =   new Float32Array( new ArrayBuffer( this.available * ( 4 * 3 ) ) );
         newbuf.set( buffer.position );
         buffer.position = newbuf;

         newbuf =   new Float32Array( new ArrayBuffer( this.available * ( 4 * 2 ) ) );
         newbuf.set( buffer.in_Texture );
         buffer.in_Texture = newbuf;

         newbuf =   new Float32Array( new ArrayBuffer( this.available * ( 4 * 3 ) ) );
         newbuf.set( buffer.in_Normal );
         buffer.in_Normal = newbuf;

         newbuf =   new Uint8Array( new ArrayBuffer( this.available * ( 1 * 1 ) ) );
         newbuf.set( buffer.in_use_texture );
         buffer.in_use_texture = newbuf;

         newbuf =   new Uint8Array( new ArrayBuffer( this.available * ( 1 * 1 ) ) );
         newbuf.set( buffer.in_flat_color );
         buffer.in_flat_color = newbuf;

         newbuf =   new Uint8Array( new ArrayBuffer( this.available * ( 1 * 1 ) ) );
         newbuf.set( buffer.in_decal_texture );
         buffer.in_decal_texture = newbuf;

         newbuf =   new Int8Array( new ArrayBuffer( this.available * ( 4 * 2 ) ) );
         newbuf.set( buffer.in_Modulous );
         buffer.in_Modulous = newbuf;

     };

     buffer.markDirty = function () {
         ["position","in_Texture"
         ,"in_Modulous"
         ,"in_Normal", "in_flat_color", "in_use_texture", "in_decal_texture"
     ].forEach( (att)=>{
             var attrib = this.geometry.getAttribute(att);
             attrib.needsUpdate = true;
             attrib.array = buffer[att];
         })

         this.geometry.attributes.position.needsUpdate = true;
         this.geometry.attributes.in_Texture.needsUpdate = true;
         this.geometry.attributes.in_Normal.needsUpdate = true;
         this.geometry.attributes.in_use_texture.needsUpdate = true;
         this.geometry.attributes.in_flat_color.needsUpdate = true;
         this.geometry.attributes.in_decal_texture.needsUpdate = true;
         this.geometry.attributes.in_Modulous.needsUpdate = true;
     }

     buffer.addPoint = function( v, n, ut, flat, dt, mod ) {
         if( this.used >= this.available )
            this.expand();
            const u3 = this.used * 3;
            const u4 = this.used * 4;
        this.position[u3 + 0 ] = v.x;
        this.position[u3 + 1 ] = v.y;
        this.position[u3 + 2 ] = v.z;


        this.in_Normal[u3 + 0] = n?n.x:0;
        this.in_Normal[u3 + 1] = n?n.y:0;
        this.in_Normal[u3 + 2] = n?n.z:1;

        this.in_use_texture[ this.used ] = ut;
        this.in_flat_color[this.used] = flat;
        this.in_decal_texture[this.used] = dt;
        this.in_Modulous[this.used * 2 + 0] = mod[0];
        this.in_Modulous[this.used * 2 + 1] = mod[1];

        this.used++;
    };

     //buffer.

     buffer.AddQuad = function( norm, P1,P2,P3,P4 ) {

         const min = 0;
         const max = 1;
         this.addPoint( P1, norm, false, false, false, [min,min] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P4,  norm, false, false, false, [max,max] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
     }
     buffer.AddQuadTexture = function( norm, P1,P2,P3,P4,textureCoords ) {
         const min = 0;
         const max = 1;
         this.addPoint( P1, norm, false, false, false, [min,min] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P4,  norm, false, false, false, [max,max] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
     }
     const white = new THREE.Vector4( 0.5, 0.5, 0, 1 );
     buffer.addSimpleQuadTex = function( quad, uvs, norm, pow ) {
         var min = 0;
         var max = 1.0;
         this.addPoint( P1, norm, false, false, false, [min,min] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
         this.addPoint( P2,  norm, false, false, false, [max,min] );
         this.addPoint( P4,  norm, false, false, false, [max,max] );
         this.addPoint( P3,  norm, false, false, false, [min,max] );
     }
     buffer.addSimpleQuad = function( quad, norm ) {
         var min = -2;
         var max = 2;
         this.addPoint( quad[0], undefined, norm, false, false, false, [min,min] );
         this.addPoint( quad[1], undefined, norm, false, false, false, [max,min] );
         this.addPoint( quad[2], undefined, norm, false, false, false, [min,max] );
         this.addPoint( quad[1], undefined, norm, false, false, false, [max,min] );
         this.addPoint( quad[3], undefined, norm, false, false, false, [max,max] );
         this.addPoint( quad[2], undefined, norm, false, false, false, [min,max] );
     }

     buffer.makeVoxCube = function(size) {
        var v1 = new THREE.Vector3(1,1,1);
        var v2 = new THREE.Vector3(-1,1,1);
        var v3 = new THREE.Vector3(1,-1,1);
        var v4 = new THREE.Vector3(-1,-1,1);
        var v5 = new THREE.Vector3(1,1,-1);
        var v6 = new THREE.Vector3(-1,1,-1);
        var v7 = new THREE.Vector3(1,-1,-1);
        var v8 = new THREE.Vector3(-1,-1,-1);
        buffer.addSimpleQuad( [v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size),v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size)]
            , new THREE.Vector4( 0.2, 0.0, 1, 1.0 ), new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Forward
            , 200 )
        buffer.addSimpleQuad( [v6.clone().multiplyScalar(size),v5.clone().multiplyScalar(size),v8.clone().multiplyScalar(size),v7.clone().multiplyScalar(size)]
            , new THREE.Vector4( 0.2, 1, 0, 1.0 ), new THREE.Vector4( 0, 0, 0, 0.5 )
            , THREE.Vector3Backward
            , 200 )
        buffer.addSimpleQuad( [v5.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v2.clone().multiplyScalar(size)]
                , new THREE.Vector4( 1, 0.0, 0, 1.0 ), new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Up
                , 200 )
        buffer.addSimpleQuad( [v3.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , new THREE.Vector4( 0, 1, 1, 1.0 ), new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Down
                , 200 )
        buffer.addSimpleQuad( [v5.clone().multiplyScalar(size),v1.clone().multiplyScalar(size),v7.clone().multiplyScalar(size),v3.clone().multiplyScalar(size)]
                , new THREE.Vector4( 1, 0.0, 1, 1.0 ), new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Right
                , 200 )
        buffer.addSimpleQuad( [v2.clone().multiplyScalar(size),v6.clone().multiplyScalar(size),v4.clone().multiplyScalar(size),v8.clone().multiplyScalar(size)]
                , new THREE.Vector4( 1, 1, 0, 1.0 )
                , new THREE.Vector4( 0, 0, 0, 0.5 )
                , THREE.Vector3Left
                , 200 )
        this.markDirty(  );
     }

     //var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
     //var mesh = new THREE.Mesh( geometry, material );
     return buffer;
}




function updatePosition() {
    buffer.geometry.attributes.position.needsUpdate = true;
}

},{}],44:[function(require,module,exports){


Voxelarium.GeometryShader = function() {
    return new THREE.ShaderMaterial( {

	uniforms: {
        edge_only : { type: "f", value : 0 },
        map : { type : "t", value : null }
	},
    transparent : true,
     blending: THREE.NormalBlending,
	vertexShader: `
    #define USE_MAP

    #include <common>
    #include <uv_pars_vertex>
    #include <uv2_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    attribute  vec4 in_Color;
    attribute  vec4 in_FaceColor;
    attribute  float in_Pow;

    attribute  float in_use_texture;
    attribute  float in_flat_color;
    attribute  float in_decal_texture;

    attribute  vec2 in_Modulous;
    varying vec4 ex_Color;
    varying vec2 ex_texCoord;
    varying float ex_Dot;
    varying  float ex_Pow;
    varying  float ex_Pow2;
    varying float vDepth;
    varying float ex_use_texture;
    varying float ex_flat_color;
    varying float ex_decal_texture;
    varying vec4 ex_FaceColor;
    #define EPSILON 1e-6

    varying  vec2 ex_Modulous;

    varying vec4 fe_normal, light_dir, eye_vec, lookat;
    //const float PI =  3.14159265;

    void main() {

    	#include <uv_vertex>
    	#include <uv2_vertex>
    	#include <color_vertex>
    	#include <skinbase_vertex>

    	#ifdef USE_ENVMAP

    	#include <beginnormal_vertex>
    	#include <morphnormal_vertex>
    	#include <skinnormal_vertex>
    	#include <defaultnormal_vertex>

    	#endif

    	#include <begin_vertex>
    	#include <morphtarget_vertex>
    	#include <skinning_vertex>

        #include <project_vertex>
/*

        {
        	vec4 ambient, diffuse, specular;
        	float NdotL, RdotV;

        	//fe_normal = vec4(gl_NormalMatrix * gl_Normal, 0.0);

        	vec4 vVertex = modelViewMatrix * vec4( transformed, 1.0 );

        	//light_dir = gl_LightSource[0].position - vVertex;

        	eye_vec = -vVertex;

        	vec4 temp_pos = projectionMatrix * vVertex;

        	float dist = length(eye_vec);
        	lookat = eye_vec - temp_pos;
        	vec4 dir = temp_pos - eye_vec;
        	vec4 center = normalize(-eye_vec);
        	vec4 proj = dot(temp_pos, normalize(-lookat)) * normalize(-lookat);

        	vec4 c = temp_pos - proj;

        	float magnitude = 1.0-acos(dot(normalize(-eye_vec), normalize(temp_pos)));

        	c = length(c) * magnitude * normalize(c);

        	vec4 dir2 = normalize(c-lookat);

        	dir2 = (dir2 * dist);

        	gl_Position.xyz = dir2.xyz;
        	gl_Position.w = temp_pos.w;

        }
*/
    	#include <logdepthbuf_vertex>

    	#include <worldpos_vertex>
    	#include <clipping_planes_vertex>
    	#include <envmap_vertex>


{
        ex_texCoord = uv;
        ex_Color = in_Color;
        ex_FaceColor = in_FaceColor;

        //normal = normalMatrix * normal;

        //dottmp = dot( normal, vec3( 0.0, 1.0, 0.0 ) );
        //dottmpright = dot( normal, vec3( 1.0, 0.0, 0.0 ) );

        ex_Pow = in_Pow;// * (/*sqrt/(1.0-dottmpright*dottmpright));
        ex_Pow2 = in_Pow;// * (/*sqrt/(1.0-dottmp*dottmp));

        ex_use_texture = in_use_texture;
        ex_flat_color = in_flat_color;
        ex_Modulous = in_Modulous;
}

    }
    `,
fragmentShader:`
    uniform vec3 diffuse;
    uniform float opacity;

    #ifndef FLAT_SHADED

    	varying vec3 vNormal;

    #endif
    #define USE_MAP

    #include <common>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <uv2_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <aomap_pars_fragment>
    #include <envmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>

    varying vec2 ex_texCoord;
    varying vec4 ex_Color;

    varying float ex_Pow;
    varying float ex_Pow2;
    varying float ex_use_texture;
    varying float ex_flat_color;
    varying vec2 ex_Modulous;
    varying vec4 ex_FaceColor;
    //uniform sampler2D tex;
    uniform float edge_only;

    uniform float logDepthBufFC;
    varying float vFragDepth;

    void main() {

    	#include <clipping_planes_fragment>

    	vec4 diffuseColor = vec4( diffuse, opacity );

    	#include <logdepthbuf_fragment>
    	#include <map_fragment>
    	#include <color_fragment>
    	#include <alphamap_fragment>
    	#include <alphatest_fragment>
    	#include <specularmap_fragment>



        //if(2.0 > 1.0)
        {
                if( ex_use_texture > 0.5 )
                {
                    if( edge_only > 0.5 )
                        diffuseColor = vec4(1.0);
                    else
                        diffuseColor = vec4( texture2D( map, ex_texCoord ).rgb, 1.0 );
                      //  diffuseColor = vec4( ex_texCoord, texture2D( map, ex_texCoord ).r, 1.0 );
                    //diffuseColor =vec4(ex_texCoord.x,ex_texCoord.y,0,1);// ex_Color;
                }
                else if( ex_flat_color > 0.5 )
                {
                    diffuseColor =vec4(1,0,1,1);// ex_Color;
                }
                else
                {
                    float a = mod(ex_Modulous.x +0.5, 1.0 )-0.5;
                    float b = mod(ex_Modulous.y +0.5, 1.0 )-0.5;

                    float g;
                    float h;
                    vec3 white;
                    a = 4.0*(0.25-a*a);
                    b = 4.0*(0.25-b*b);
                    a = pow( abs(a), ex_Pow );
                    b = pow( abs(b), ex_Pow2 );

                 //g = pow( ( max(a,b)),in_Pow);
                    //h = pow( ( a*b),in_Pow/4);
                    g = min(1.0,b+a);
                    h = max((b+a)-1.0,0.0)/3.0;
                    white = vec3(1.0,1.0,1.0) * max(ex_Color.r,max(ex_Color.g,ex_Color.b));
                    //	diffuseColor = vec4( h * white + (g * ex_Color.rgb), ex_Color.a ) ;
                    //  diffuseColor = vec4( g * ex_Color.rgb, ex_Color.a ) ;
                    if( edge_only > 0.5 )
                         diffuseColor = vec4( h* ( white - ex_FaceColor.rgb )+ (g* ex_Color.rgb), (g * ex_Color.a) ) ;
                    else
                         diffuseColor = vec4( ex_FaceColor.a*(1.0-g)*ex_FaceColor.rgb + h* ( white - ex_FaceColor.rgb ) + (g* ex_Color.rgb), (1.0-g)*ex_FaceColor.a + (g * ex_Color.a) ) ;
                    //diffuseColor = vec4( (1.0-g)*ex_FaceColor.rgb + h* ( white - ex_FaceColor.rgb )+ (g* ex_Color.rgb), (1.0-g)*ex_FaceColor.a + (g * ex_Color.a) ) ;
                    //diffuseColor = vec4(g,h,1,1);
                    //diffuseColor = ex_Color;
                }
        }


    	ReflectedLight reflectedLight;
    	reflectedLight.directDiffuse = vec3( 0.0 );
    	reflectedLight.directSpecular = vec3( 0.0 );
    	reflectedLight.indirectDiffuse = diffuseColor.rgb;
    	reflectedLight.indirectSpecular = vec3( 0.0 );

    	#include <aomap_fragment>

    	vec3 outgoingLight = reflectedLight.indirectDiffuse;

    	#include <envmap_fragment>

    	gl_FragColor = diffuseColor;//vec4( outgoingLight, diffuseColor.a );

    	#include <premultiplied_alpha_fragment>
    	#include <tonemapping_fragment>
    	#include <encodings_fragment>
    	#include <fog_fragment>

    }
    `
} );

/*
#if !MORE_ROUNDED
              g = sqrt((a*a+b*b)/2);
              h = pow(g,200.0) * 0.5;  // up to 600 even works...
              g = pow( ( max(a,b)),400);
              h = (g+h);
              gl_FragColor = vec4( h * in_Color.rgb, in_Color.a ) ;
#else
*/

}

},{}],45:[function(require,module,exports){


Voxelarium.GeometryShaderMono = function() {
    return new THREE.ShaderMaterial( {

	uniforms: {
        in_Color : { value : new THREE.Vector3() },
        in_FaceColor : { value : new THREE.Vector3() },
        in_Pow : { value : 0.0 },
        edge_only : { value : 0 },
	},
    transparent : true,
     blending: THREE.NormalBlending,
	vertexShader: `
                //attribute vec4 position;
                uniform mat3 rotation;
    			attribute vec2 in_Texture;
    			uniform  vec4 in_Color;
    			uniform  vec4 in_FaceColor;
    			attribute vec3 in_Normal;
    			uniform  float in_Pow;
                attribute  float in_use_texture;
    			attribute  float in_flat_color;
    			attribute  float in_decal_texture;

        		attribute  vec2 in_Modulous;
    			varying vec4 ex_Color;
    			varying vec2 ex_texCoord;
    			varying float ex_Dot;
    			varying  float ex_Pow;
                varying  float ex_Pow2;
    			float ex_use_texture;
    			float ex_flat_color;
    			float ex_decal_texture;
    			varying vec4 ex_FaceColor;

    			varying  vec2 ex_Modulous;
    			void main(void) {
    				vec3 normal;
    				float dottmp;
                    float dottmpright;
    			    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    				ex_texCoord = in_Texture/32768.0;
    				ex_Color = in_Color;
    				ex_FaceColor = in_FaceColor;

    				normal = normalMatrix * in_Normal;

    				dottmp = dot( normal, vec3( 0.0, 1.0, 0.0 ) );
                    dottmpright = dot( normal, vec3( 1.0, 0.0, 0.0 ) );

    				ex_Pow = in_Pow;// * (/*sqrt*/(1.0-dottmpright*dottmpright));
                    ex_Pow2 = in_Pow;// * (/*sqrt*/(1.0-dottmp*dottmp));

    				ex_use_texture = in_use_texture;
    				ex_flat_color = in_flat_color;
    				ex_Modulous = in_Modulous;
    			}
    `,//.replace(/[^\x00-\x7F]/g, ""),
	fragmentShader:`
    			varying vec2 ex_texCoord;
    			varying vec4 ex_Color;

                varying float ex_Pow;
                varying float ex_Pow2;
    			float ex_use_texture;
    			float ex_flat_color;
    			varying vec2 ex_Modulous;
    			varying vec4 ex_FaceColor;
                uniform  float edge_only;
    			uniform sampler2D tex;
    			void main(void) {
    			  if( ex_use_texture > 0.5 )
    				{
    					gl_FragColor = ex_Color * texture2D( tex, ex_texCoord );
                        gl_FragColor =vec4(1,0,0,1);// ex_Color;
    				}
    				else if( ex_flat_color > 0.5 )
    				{
    					gl_FragColor =vec4(1,0,1,1);// ex_Color;
    				}
    				else
    				{
                        float a = mod(ex_Modulous.x +0.5, 1.0 )-0.5;
        				float b = mod(ex_Modulous.y +0.5, 1.0 )-0.5;

        				float g;
        				float h;
        				vec3 white;
        				a = 4.0*(0.25-a*a);
        				b = 4.0*(0.25-b*b);
        				a = pow( a, ex_Pow );
        				b = pow( b, ex_Pow2 );

        			 //g = pow( ( max(a,b)),in_Pow);
        				//h = pow( ( a*b),in_Pow/4);
        				g = min(1.0,b+a);
        				h = max((b+a)-1.0,0.0)/3.0;
        				white = vec3(1.0,1.0,1.0) * max(ex_Color.r,max(ex_Color.g,ex_Color.b));
        			//	gl_FragColor = vec4( h * white + (g * ex_Color.rgb), ex_Color.a ) ;
        			//  gl_FragColor = vec4( g * ex_Color.rgb, ex_Color.a ) ;
                    if( edge_only > 0.5 )
                        gl_FragColor = vec4( h* ( white - ex_FaceColor.rgb )+ (g* ex_Color.rgb), (g * ex_Color.a) ) ;
                    else
        			    gl_FragColor = vec4( ex_FaceColor.a*(1.0-g)*ex_FaceColor.rgb + h* ( white - ex_FaceColor.rgb )+ (g* ex_Color.rgb), (1.0-g)*ex_FaceColor.a + (g * ex_Color.a) ) ;
                    //    gl_FragColor = vec4( ex_FaceColor.a*(1.0-g)*ex_FaceColor.rgb +  (g* ex_Color.rgb), (1.0-g)*ex_FaceColor.a + (g * ex_Color.a) ) ;
    			}
            }
            `,//.replace(/[^\x00-\x7F]/g, "")

} );

/*
#if !MORE_ROUNDED
              g = sqrt((a*a+b*b)/2);
              h = pow(g,200.0) * 0.5;  // up to 600 even works...
              g = pow( ( max(a,b)),400);
              h = (g+h);
              gl_FragColor = vec4( h * in_Color.rgb, in_Color.a ) ;
#else
*/

}

},{}],46:[function(require,module,exports){
"use strict";
var voxels = require( "./voxels.js")


Voxelarium.BasicMesher = function(  ) {
    var mesher = {
		Culler : function( cluster ) {
            var culler = {
              cluster : cluster,
    			cullSector : function( sector, internal_faces, interesting_faces ) {
    				if( internal_faces )
    					Render_Basic.SectorUpdateFaceCulling( sector, false );
    				else
    					Render_Basic.SectorUpdateFaceCulling_Partial( sector, interesting_faces, false );
    			},

    			cullSingleVoxel : function ( _Sector, offset ) {

    				var Offset = new Array(19);//uint[19];
    				var VoxelState = new Array(19);
    				var Voxel;
    				var sector = new Array(19);

    				var ExtFaceState;
    				var IntFaceState;

    				if( !( sector[Voxelarium.RelativeVoxelOrds.INCENTER] = _Sector ) ) return;
    				Offset[Voxelarium.RelativeVoxelOrds.INCENTER] = offset;
                    var cluster = _Sector.cluster;
    				Offset[Voxelarium.RelativeVoxelOrds.LEFT] = offset - ( 1 * cluster.sectorSizeY );
    				Offset[Voxelarium.RelativeVoxelOrds.RIGHT] = offset + ( 1 * cluster.sectorSizeY );
    				Offset[Voxelarium.RelativeVoxelOrds.AHEAD] = offset + ( 1 * cluster.sectorSizeX * cluster.sectorSizeY );
    				Offset[Voxelarium.RelativeVoxelOrds.BEHIND] = offset - ( 1 * cluster.sectorSizeX * cluster.sectorSizeY );
    				Offset[Voxelarium.RelativeVoxelOrds.ABOVE] = offset + ( 1 );
    				Offset[Voxelarium.RelativeVoxelOrds.BELOW] = offset - ( 1 );

    				if( 0 == ( ( offset / cluster.sectorSizeY ) % cluster.sectorSizeX ) )
    				{
    					if( !( sector[Voxelarium.RelativeVoxelOrds.LEFT] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.LEFT] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.LEFT] += ( cluster.sectorSizeX * cluster.sectorSizeY );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.LEFT] = _Sector;

    				if( (cluster.sectorSizeX-1) == ( ( offset / cluster.sectorSizeY ) % cluster.sectorSizeX ) )
    				{
    					if( null == ( sector[Voxelarium.RelativeVoxelOrds.RIGHT] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.RIGHT] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.RIGHT] -= ( cluster.sectorSizeX * cluster.sectorSizeY );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.RIGHT] = _Sector;

    				if( (cluster.sectorSizeZ-1) == ( ( offset / cluster.sectorSizeY ) % cluster.sectorSizeX ) )
    				{
    					if( null == ( sector[Voxelarium.RelativeVoxelOrds.AHEAD] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.INFRONT - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.AHEAD] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.AHEAD] -= ( cluster.sectorSizeX * cluster.sectorSizeY * cluster.sectorSizeZ );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.AHEAD] = _Sector;

    				if( 0 == ( ( offset / ( cluster.sectorSizeY * cluster.sectorSizeX ) ) % cluster.sectroSizeZ ) )
    				{
    					if( null == ( sector[Voxelarium.RelativeVoxelOrds.BEHIND] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.BEHIND] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.BEHIND] += ( cluster.sectorSizeX * cluster.sectorSizeY * cluster.sectorSizeZ );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.BEHIND] = _Sector;

    				if( (cluster.sectorSizeY-1) == ( offset % cluster.sectorSizeY ) )
    				{
    					if( null == ( sector[Voxelarium.RelativeVoxelOrds.ABOVE] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.ABOVE] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.ABOVE] -= ( cluster.sectorSizeY );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.ABOVE] = _Sector;

    				if( 0 == ( offset % cluster.sectorSizeY ) )
    				{
    					if( null == ( sector[Voxelarium.RelativeVoxelOrds.BELOW] = _Sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1] ) )
    						sector[Voxelarium.RelativeVoxelOrds.BELOW] = VoxelWorld.WorkingFullSector;
    					Offset[Voxelarium.RelativeVoxelOrds.BELOW] += ( cluster.sectorSizeY );
    				}
    				else
    					sector[Voxelarium.RelativeVoxelOrds.BELOW] = _Sector;

    				// Computing absolute memory pointer of blocks
    				for( var i = 0; i < 7; i++ )
    				{
    					sector[i].data.sleepState.clear( Offset[i] );
    					sector[i].Flag_IsActiveVoxels = true;

    					//Voxel_Address[i] = sector[i].Data.Data[Offset[i]];
    					VoxelType = ( sector[i].data.data[Offset[i]] );
    					if( ( VoxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_DRAWFULLVOXELOPACITY ) != 0 )
    						sector[i].Flag_Render_Dirty = true;
    					if( ( VoxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_DRAWTRANSPARENTRENDERING ) != 0 )
    						sector[i].Flag_Render_Dirty_Transparent = true;
    					VoxelState[i] = ( VoxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS );
    				}

    				VoxelType = _Sector.data.data[Offset[Voxelarium.RelativeVoxelOrds.INCENTER]];

    				// Getting case subtables.

    				ExtFaceState = Voxelarium.ExtFaceStateTable[VoxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
    				IntFaceState = Voxelarium.IntFaceStateTable[VoxelType.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];

    				// Computing face culling for center main stored voxel.

    				FaceCulling[Offset[Voxelarium.RelativeVoxelOrds.INCENTER]]
    												= (( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.LEFT]] & Voxelarium.FACEDRAW_Operations.LEFT )
    													   | ( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.RIGHT]] & Voxelarium.FACEDRAW_Operations.RIGHT )
    													   | ( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.INFRONT]] & Voxelarium.FACEDRAW_Operations.AHEAD )
    													   | ( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.BEHIND]] & Voxelarium.FACEDRAW_Operations.BEHIND )
    													   | ( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.ABOVE]] & Voxelarium.FACEDRAW_Operations.ABOVE )
    													   | ( IntFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.BELOW]] & Voxelarium.FACEDRAW_Operations.BELOW ))
    													   ;

    				// Computing face culling for nearboring voxels faces touching center voxel.
    				{
    					var Culler;
    					var Culling;
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.LEFT].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;

    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.LEFT];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.RIGHT ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.LEFT]] & Voxelarium.FACEDRAW_Operations.RIGHT ) );
    						Culling[ofs] = val;

    					}
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.RIGHT].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;
    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.RIGHT];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.LEFT ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.RIGHT]] & Voxelarium.FACEDRAW_Operations.LEFT ) );
    						Culling[ofs] = val;
    					}
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.AHEAD].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;
    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.AHEAD];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.BEHIND ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.AHEAD]] & Voxelarium.FACEDRAW_Operations.BEHIND ) );
    						Culling[ofs] = val;
    					}
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.BEHIND].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;
    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.BEHIND];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.AHEAD ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.BEHIND]] & Voxelarium.FACEDRAW_Operations.AHEAD ) );
    						Culling[ofs] = val;
    					}
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.ABOVE].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;
    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.ABOVE];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.BELOW ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.ABOVE]] & Voxelarium.FACEDRAW_Operations.BELOW ) );
    						Culling[ofs] = val;
    					}
    					if( ( Culler = sector[Voxelarium.RelativeVoxelOrds.BELOW].Culler ) != null )
    					{
    						Culling = Culler.FaceCulling;
    						var ofs = Offset[Voxelarium.RelativeVoxelOrds.BELOW];
    						var val = ( ( Culling[ofs] & ( ~Voxelarium.FACEDRAW_Operations.ABOVE ) )
    							| ( ExtFaceState[VoxelState[Voxelarium.RelativeVoxelOrds.BELOW]] & Voxelarium.FACEDRAW_Operations.ABOVE ) );
    						Culling[ofs] = val;
    					}
    				}
    				// printf("State[Center]:%x [Left]%x [Right]%x [INFRONT]%x [BEHIND]%x [ABOVE]%x [BELOW]%x\n",VoxelState[Voxelarium.RelativeVoxelOrds.INCENTER],VoxelState[Voxelarium.RelativeVoxelOrds.LEFT],VoxelState[Voxelarium.RelativeVoxelOrds.RIGHT],VoxelState[Voxelarium.RelativeVoxelOrds.INFRONT],VoxelState[Voxelarium.RelativeVoxelOrds.BEHIND],VoxelState[Voxelarium.RelativeVoxelOrds.ABOVE],VoxelState[Voxelarium.RelativeVoxelOrds.BELOW]);
    			},

    			cullSingleVoxel2 : function( x, y, z ) {
    				var sector = cluster.getSector( x / cluster.sectorSizeX, y / cluster.sectorSizeY, z / cluster.sectorSizeZ );
    				var offset = ( ( ( x % cluster.sectorSizeX ) * cluster.sectorSizeY )
    								+ ( y % cluster.sectorSizeY )
    								+ ( ( z % cluster.sectorSizeZ ) << ( cluster.sectorSizeY + cluster.sectorSizeX ) ) );
    				CullSingleVoxel( sector, offset );
    			}
            }

            culler.FaceCulling = new Array(cluster.sectorSize);
            var n;
            for( n = 0; n < cluster.sectorSize; n++ )
                culler.FaceCulling[n] = 0xFF;
            return culler;
        }
        , sectorTable : new Array(27)
		, SectorDataTable : new Array(27)
		, BlocMatrix : [new Array(9),new Array(9),new Array(9)]

    , initCulling : function( sector ) {
      var tmp = sector.data.FaceCulling = new Array( sector.cluster.sectorSize );
      for( var n = 0; n < tmp.length; n++ )
        tmp[n] = 0xFF;
    }
		,SectorUpdateFaceCulling : function ( sector, isolated )
		{
			var MissingSector;
      var cluster = sector.cluster;
			var tmpp;
			var i;
      var sectorTable = this.sectorTable;
      var SectorDataTable = this.SectorDataTable;
      var BlocMatrix = this.BlocMatrix;

			if( isolated ) MissingSector = cluster.WorkingEmptySector;
			else MissingSector = cluster.WorkingFullSector;

			// (Voxelarium.FACEDRAW_Operations.ABOVE | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.BEHIND);
			for( i = 0; i < 27; i++ ) sectorTable[i] = MissingSector;
			sectorTable[0] = sector; if( sectorTable[0] == null ) { return; }
			sectorTable[1] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1]; if( sectorTable[1] == null ) { sectorTable[1] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.LEFT; }
			sectorTable[2] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1]; if( sectorTable[2] == null ) { sectorTable[2] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.RIGHT; }
			sectorTable[3] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1]; if( sectorTable[3] == null ) { sectorTable[3] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.BEHIND; }
			sectorTable[6] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1]; if( sectorTable[6] == null ) { sectorTable[6] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.AHEAD; }
			sectorTable[9] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1]; if( sectorTable[9] == null ) { sectorTable[9] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.BELOW; }
			sectorTable[18] = sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1]; if( sectorTable[18] == null ) { sectorTable[18] = MissingSector; sectorTable[0].PartialCulling |= Voxelarium.FACEDRAW_Operations.ABOVE; }
			for( i = 0; i < 27; i++ ) SectorDataTable[i] = sectorTable[i].data.data;


			var xc, yc, zc;
			var xp, yp, zp;
			var xpp, ypp, zpp;
			var info;

      const tables = sector.cluster.lookupTables;
			//sectorTable[0].Flag_Void_Regular = true;
			//sectorTable[0].Flag_Void_Transparent = true;

			for( xc = 0; xc < cluster.sectorSizeX; xc++ )
			{
				xp = xc + 1; xpp = xc + 2;
				for( zc = 0; zc < cluster.sectorSizeZ; zc++ )
				{
					zp = zc + 1; zpp = zc + 2;

					// Prefetching the bloc matrix (only 2 rows)
					//    BlocMatrix[1][0] = SectorDataTable[(VoxelSector.tables.tableX[xc ]+tables.tableY[0]+tables.tableZ[zc ])][tables.ofTableX[xc]+tables.ofTableY[0]+tables.ofTableZ[zc]];
					BlocMatrix[1][1] = SectorDataTable[( tables.tableX[xp] + tables.tableY[0] + tables.tableZ[zc] )][tables.ofTableX[xp] + tables.ofTableY[0] + tables.ofTableZ[zc]];
					//    BlocMatrix[1][2] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[0]+tables.tableZ[zc ])][tables.ofTableX[xpp]+tables.ofTableY[0]+tables.ofTableZ[zc ]]
					BlocMatrix[1][3] = SectorDataTable[( tables.tableX[xc] + tables.tableY[0] + tables.tableZ[zp] )][tables.ofTableX[xc] + tables.ofTableY[0] + tables.ofTableZ[zp]];
					BlocMatrix[1][4] = SectorDataTable[( tables.tableX[xp] + tables.tableY[0] + tables.tableZ[zp] )][tables.ofTableX[xp] + tables.ofTableY[0] + tables.ofTableZ[zp]];
					BlocMatrix[1][5] = SectorDataTable[( tables.tableX[xpp] + tables.tableY[0] + tables.tableZ[zp] )][tables.ofTableX[xpp] + tables.ofTableY[0] + tables.ofTableZ[zp]];
					//    BlocMatrix[1][6] = SectorDataTable[(tables.tableX[xc ]+tables.tableY[0]+tables.tableZ[zpp])][tables.ofTableX[xc ]+tables.ofTableY[0]+tables.ofTableZ[zpp]]
					BlocMatrix[1][7] = SectorDataTable[( tables.tableX[xp] + tables.tableY[0] + tables.tableZ[zpp] )][tables.ofTableX[xp] + tables.ofTableY[0] + tables.ofTableZ[zpp]];
					//    BlocMatrix[1][8] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[0]+tables.tableZ[zpp])][tables.ofTableX[xpp]+tables.ofTableY[0]+tables.ofTableZ[zpp]]

					//    BlocMatrix[2][0] = SectorDataTable[(tables.tableX[xc ]+tables.tableY[1]+tables.tableZ[zc ])][tables.ofTableX[xc ]+tables.ofTableY[1]+tables.ofTableZ[zc ]]
					BlocMatrix[2][1] = SectorDataTable[( tables.tableX[xp] + tables.tableY[1] + tables.tableZ[zc] )][tables.ofTableX[xp] + tables.ofTableY[1] + tables.ofTableZ[zc]];
					//    BlocMatrix[2][2] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[1]+tables.tableZ[zc ])][tables.ofTableX[xpp]+tables.ofTableY[1]+tables.ofTableZ[zc ]]
					BlocMatrix[2][3] = SectorDataTable[( tables.tableX[xc] + tables.tableY[1] + tables.tableZ[zp] )][tables.ofTableX[xc] + tables.ofTableY[1] + tables.ofTableZ[zp]];
					BlocMatrix[2][4] = SectorDataTable[( tables.tableX[xp] + tables.tableY[1] + tables.tableZ[zp] )][tables.ofTableX[xp] + tables.ofTableY[1] + tables.ofTableZ[zp]];
					BlocMatrix[2][5] = SectorDataTable[( tables.tableX[xpp] + tables.tableY[1] + tables.tableZ[zp] )][tables.ofTableX[xpp] + tables.ofTableY[1] + tables.ofTableZ[zp]];
					//    BlocMatrix[2][6] = SectorDataTable[(tables.tableX[xc ]+tables.tableY[1]+tables.tableZ[zpp])][tables.ofTableX[xc ]+tables.ofTableY[1]+tables.ofTableZ[zpp]]
					BlocMatrix[2][7] = SectorDataTable[( tables.tableX[xp] + tables.tableY[1] + tables.tableZ[zpp] )][tables.ofTableX[xp] + tables.ofTableY[1] + tables.ofTableZ[zpp]];
					//    BlocMatrix[2][8] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[1]+tables.tableZ[zpp])][tables.ofTableX[xpp]+tables.ofTableY[1]+tables.ofTableZ[zpp]]

					for( yc = 0; yc < cluster.sectorSizeY; yc++ )
					{
						yp = yc + 1; ypp = yc + 2;

						// Scrolling bloc matrix by exchangingypp references.
						tmpp = BlocMatrix[0];
						BlocMatrix[0] = BlocMatrix[1];
						BlocMatrix[1] = BlocMatrix[2];
						BlocMatrix[2] = tmpp;

						// Fetching a new bloc of data slice;
                        var hereOfs;

						//      BlocMatrix[2][0] = SectorDataTable[(tables.tableX[xc ]+tables.tableY[ypp]+tables.tableZ[zc ])].Data;    [tables.ofTableX[xc ]+tables.ofTableY[ypp]+tables.ofTableZ[zc ]]
						BlocMatrix[2][1] = SectorDataTable[( tables.tableX[xp] + tables.tableY[ypp] + tables.tableZ[zc] )][tables.ofTableX[xp] + tables.ofTableY[ypp] + tables.ofTableZ[zc]];
						//      BlocMatrix[2][2] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[ypp]+tables.tableZ[zc ])].Data;	   [tables.ofTableX[xpp]+tables.ofTableY[ypp]+tables.ofTableZ[zc ]]
						BlocMatrix[2][3] = SectorDataTable[( tables.tableX[xc] + tables.tableY[ypp] + tables.tableZ[zp] )][tables.ofTableX[xc] + tables.ofTableY[ypp] + tables.ofTableZ[zp]];
						BlocMatrix[2][4] = SectorDataTable[( tables.tableX[xp] + tables.tableY[ypp] + tables.tableZ[zp] )][tables.ofTableX[xp] + tables.ofTableY[ypp] + tables.ofTableZ[zp]];
						BlocMatrix[2][5] = SectorDataTable[( tables.tableX[xpp] + tables.tableY[ypp] + tables.tableZ[zp] )][tables.ofTableX[xpp] + tables.ofTableY[ypp] + tables.ofTableZ[zp]];
                        if( !BlocMatrix[2][5] ){
                            console.log( "voxel in sector has become undefined.")
                            return;
                            //debugger
                        }
						//      BlocMatrix[2][6] = SectorDataTable[(tables.tableX[xc ]+tables.tableY[ypp]+tables.tableZ[zpp])].Data;	   [tables.ofTableX[xc ]+tables.ofTableY[ypp]+tables.ofTableZ[zpp]]
						BlocMatrix[2][7] = SectorDataTable[( tables.tableX[xp] + tables.tableY[ypp] + tables.tableZ[zpp] )][tables.ofTableX[xp] + tables.ofTableY[ypp] + tables.ofTableZ[zpp]];
						//      BlocMatrix[2][8] = SectorDataTable[(tables.tableX[xpp]+tables.tableY[ypp]+tables.tableZ[zpp])].Data;	   [tables.ofTableX[xpp]+tables.ofTableY[ypp]+tables.ofTableZ[zpp]]

						// Compute face culling info
						info = 0;
						if( BlocMatrix[1][4] )
						{
                            let MainVoxelDrawInfo = BlocMatrix[1][4].properties.DrawInfo;
							let SubTable = Voxelarium.IntFaceStateTable[MainVoxelDrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];

							info |= ( ( SubTable[BlocMatrix[1][1].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.BEHIND );
							info |= ( ( SubTable[BlocMatrix[1][7].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.AHEAD );
							info |= ( ( SubTable[BlocMatrix[1][3].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.LEFT );
							info |= ( ( SubTable[BlocMatrix[1][5].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.RIGHT );
							info |= ( ( SubTable[BlocMatrix[0][4].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.BELOW );
							info |= ( ( SubTable[BlocMatrix[2][4].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS] ) & Voxelarium.FACEDRAW_Operations.ABOVE );
						}

						// Write face culling info to face culling table
                        sector.data.FaceCulling[tables.ofTableX[xp] + tables.ofTableY[yp] + tables.ofTableZ[zp]] = info;
					}
				}
			}

		}


		,SectorUpdateFaceCulling_Partial : function ( cluster, sector
					, FacesToDraw, Isolated )
		{
			var MissingSector;
			var Sector_In, Sector_Out;
			var i;
			var CuledFaces;
			var Off_Ip, Off_In, Off_Op, Off_Out, Off_Aux;
			var VoxelData_In, VoxelData_Out;
			var VoxelFC_In;
			var x, y, z;
			var FaceState;
			//extern ushort IntFaceStateTable[][8];

			x = sector.pos.x;
			y = sector.pos.y;
			z = sector.pos.z;

			if( Isolated ) MissingSector = cluster.WorkingEmptySector;
			else MissingSector = cluster.WorkingFullSector;

			Sector_In = sector; if( Sector_In == null ) return ( 0 );
			Sector_Out = null;  // again a redundant assignment
			CuledFaces = 0;

			// Top Side
      VoxelFC_In = Sector_In.data.FaceCulling;
      VoxelData_In = Sector_In.data;

			if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.ABOVE ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1])
           || ( Sector_Out = MissingSector ) )  )
				{
					VoxelData_Out = Sector_Out.data;

					for( Off_Ip = cluster.sectorSizeY - 1, Off_Op = 0;
						Off_Ip < ( cluster.sectorSizeY * cluster.sectorSizeX );
						Off_Ip += cluster.sectorSizeY,
						Off_Op += cluster.sectorSizeY ) // x (0..15)
					{
						for( Off_Aux = 0;
							Off_Aux < ( cluster.sectorSizeX * cluster.sectorSizeY * cluster.sectorSizeZ );
							Off_Aux += ( cluster.sectorSizeX * cluster.sectorSizeY ) ) // z (0..15)
						{
							Off_In = Off_Ip + Off_Aux;
							Off_Out = Off_Op + Off_Aux;
							FaceState = Voxelarium.IntFaceStateTable[VoxelData_In.data[Off_In].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][VoxelData_Out.data[Off_Out].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
							if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.ABOVE;
							else VoxelFC_In[Off_In] &= ( ( ~Voxelarium.FACEDRAW_Operations.ABOVE ) & 0xFF );
						}
					}
					CuledFaces |= Voxelarium.FACEDRAW_Operations.ABOVE;
				}
			// Bottom Side

			if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.BELOW ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1]) || ( Sector_Out = MissingSector)) != null )
				{
					VoxelData_Out = Sector_Out.data;

					for( Off_Ip = 0, Off_Op = cluster.sectorSizeY - 1;
						 Off_Ip < ( cluster.sectorSizeY * cluster.sectorSizeZ );
						 Off_Ip += cluster.sectorSizeY,
						 Off_Op += cluster.sectorSizeY ) // x (0..15)
					{
						for( Off_Aux = 0;
							 Off_Aux < ( cluster.sectorSizeX * cluster.sectorSizeY * cluster.sectorSizeZ );
							 Off_Aux += ( cluster.sectorSizeX * cluster.sectorSizeY ) ) // z (0..15)
						{
							Off_In = Off_Ip + Off_Aux;
							Off_Out = Off_Op + Off_Aux;
							Voxel_In = VoxelData_In.data[Off_In];
							Voxel_Out = VoxelData_Out.data[Off_Out];
							//ZVoxelType * VtIn =  VoxelTypeTable[ Voxel_In ];
							//ZVoxelType * VtOut = VoxelTypeTable[ Voxel_Out ];


							FaceState = Voxelarium.IntFaceStateTable[Voxel_In.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][Voxel_Out.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];

							//FaceState = IntFaceStateTable[ VoxelTypeTable[ VoxelData_In.Data[Off_In] ].DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS ][ VoxelTypeTable[ VoxelData_Out.Data[Off_Out] ].DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS ];
							if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.BELOW;
							else VoxelFC_In[Off_In] &= ( ~Voxelarium.FACEDRAW_Operations.BELOW & 0xFF );
						}
					}
					CuledFaces |= Voxelarium.FACEDRAW_Operations.BELOW;
				}
					// Left Side

					if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.LEFT ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1]) || ( Sector_Out = MissingSector)) != null )
				{
					VoxelData_Out = Sector_Out.data;
					// VoxelData_In[63]=1;
					// VoxelData_In[63 + cluster.sectorSizeY*15 ]=14; // x
					// VoxelData_In[63 + cluster.sectorSizeY * cluster.sectorSizeX * 15] = 13; // z

					for( Off_Ip = 0, Off_Op = (cluster.sectorSizeY * ( cluster.sectorSizeX - 1 ));
						Off_Ip < ( cluster.sectorSizeY * cluster.sectorSizeX * cluster.sectorSizeZ );
						Off_Ip += ( cluster.sectorSizeY * cluster.sectorSizeX ),
						Off_Op += ( cluster.sectorSizeY * cluster.sectorSizeX ) ) // z (0..15)
					{
						for( Off_Aux = 0; Off_Aux < cluster.sectorSizeY; Off_Aux++ ) // y (0..63)
						{
							Off_In = Off_Ip + Off_Aux;
							Off_Out = Off_Op + Off_Aux;
							//VoxelData_In[Off_In]=1; VoxelData_Out[Off_Out]=14;
							FaceState = Voxelarium.IntFaceStateTable[VoxelData_In.data[Off_In].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][VoxelData_Out.data[Off_Out].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
							if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.LEFT;
							else VoxelFC_In[Off_In] &= ( ~Voxelarium.FACEDRAW_Operations.LEFT & 0xFF );
						}
					}
					CuledFaces |= Voxelarium.FACEDRAW_Operations.LEFT;
				}

			// Right Side

			if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.RIGHT ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1]) || ( Sector_Out = MissingSector)) != null )
				{
					VoxelData_Out = Sector_Out.data;

					for( Off_Ip = ( cluster.sectorSizeY * ( cluster.sectorSizeX - 1 )), Off_Op = 0;
						Off_Op < ( cluster.sectorSizeY * cluster.sectorSizeX * cluster.sectorSizeZ );
						Off_Ip += ( cluster.sectorSizeY * cluster.sectorSizeX ), Off_Op += ( cluster.sectorSizeY * cluster.sectorSizeX ) ) // z (0..15)
					{
						for( Off_Aux = 0; Off_Aux < cluster.sectorSizeY; Off_Aux++ ) // y (0..63)
						{
							Off_In = Off_Ip + Off_Aux;
							Off_Out = Off_Op + Off_Aux;
							FaceState = Voxelarium.IntFaceStateTable[VoxelData_In.data[Off_In].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][VoxelData_Out.data[Off_Out].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
							if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.RIGHT; else VoxelFC_In[Off_In] &= ( ~Voxelarium.FACEDRAW_Operations.RIGHT & 0xFF );
						}
					}
					CuledFaces |= Voxelarium.FACEDRAW_Operations.RIGHT;
				}

			// Front Side

			if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.AHEAD ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1]) || ( Sector_Out = MissingSector)) != null )
				{
					VoxelData_Out = Sector_Out.data;

					for( Off_Ip = ( cluster.sectorSizeY * cluster.sectorSizeX * ( cluster.sectorSizeZ - 1 ) ), Off_Op = 0;
						Off_Op < ( cluster.sectorSizeY * cluster.sectorSizeX );
						Off_Ip += cluster.sectorSizeY, Off_Op += cluster.sectorSizeY ) // x (0..15)
					{
						for( Off_Aux = 0; Off_Aux < cluster.sectorSizeY; Off_Aux++ ) // y (0..63)
						{
							Off_In = Off_Ip + Off_Aux;
							Off_Out = Off_Op + Off_Aux;
							FaceState = Voxelarium.IntFaceStateTable[VoxelData_In.data[Off_In].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][VoxelData_Out.data[Off_Out].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
							if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.AHEAD;
							else VoxelFC_In[Off_In] &= ( ~Voxelarium.FACEDRAW_Operations.AHEAD & 0xFF );
						}
					}
					CuledFaces |= Voxelarium.FACEDRAW_Operations.AHEAD;
				}

			// Back Side

			if( ( FacesToDraw & Voxelarium.FACEDRAW_Operations.BEHIND ) != 0 )
				if( ( ( Sector_Out = sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1] ) || ( Sector_Out = MissingSector ) ) != null )
						{
							VoxelData_Out = Sector_Out.data;

							for( Off_Ip = 0, Off_Op = ( cluster.sectorSizeY * cluster.sectorSizeX * ( cluster.sectorSizeZ - 1 ) );
								Off_Ip < ( cluster.sectorSizeY * cluster.sectorSizeX );
								Off_Ip += cluster.sectorSizeY, Off_Op += cluster.sectorSizeY ) // x (0..15)
							{
								for( Off_Aux = 0; Off_Aux < cluster.sectorSizeY; Off_Aux++ ) // y (0..63)
								{
									Off_In = Off_Ip + Off_Aux;
									Off_Out = Off_Op + Off_Aux;
									FaceState = Voxelarium.IntFaceStateTable[VoxelData_In.data[Off_In].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS][VoxelData_Out.data[Off_Out].properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_CULLINGBITS];
									if( FaceState != 0 ) VoxelFC_In[Off_In] |= Voxelarium.FACEDRAW_Operations.BEHIND; else VoxelFC_In[Off_In] &= ( ~Voxelarium.FACEDRAW_Operations.BEHIND & 0xFF );
								}
							}
							CuledFaces |= Voxelarium.FACEDRAW_Operations.BEHIND;
						}

			//sector.PartialCulling ^= CuledFaces & ( Voxelarium.FACEDRAW_Operations.ABOVE | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.BEHIND );
			//sector.PartialCulling &= ( Voxelarium.FACEDRAW_Operations.ABOVE | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.BEHIND );
			if( CuledFaces != 0 )
			{
				//Log.log( "sector {0} {1} {2} is dirty", sector.pos.x, sector.pos.y, sector.pos.z );
				Sector_Out.Flag_Render_Dirty = true;
        Sector_In.Flag_Render_Dirty = true;
			}

			return ( CuledFaces );
		}

		, UpdateCulling : function ( Location, ImportanceFactor )
		{
			if( Location.sector == null )
			{
				return;
			}
			Location.sector.cluster.culler.CullSingleVoxel( Location.sector, Location.Offset );

			Location.sector.Flag_IsModified |= ImportanceFactor;
		}

		, SetVoxel_WithCullingUpdate : function ( VoxelType
							, ImportanceFactor
							, CreateExtension
							, Location )
		{
			if( !Location.sector )
				return false;

			// Delete Old voxel extended informations if any
			var Voxel = Location.sector.data.data[Location.Offset];
			var OtherInfos = Location.sector.data.otherInfos[Location.Offset];

			if( OtherInfos )
			{
				if( VoxelType.properties.Is_HasAllocatedMemoryExtension ) Voxel.deleteVoxelExtension( otherInfos );
			}

			// Storing Extension
			if( VoxelType.createVoxelExtension )
				Location.sector.Data.OtherInfos[Location.Offset] = VoxelType.createVoxelExtension();

			// Storing Voxel

			Location.sector.data.data[Location.Offset] = VoxelType;

			if( VoxelType.properties.Is_Active )
				Location.sector.Flag_IsActiveVoxels = true;

			UpdateCulling( Location, ImportanceFactor );
			return ( true );
		}

		, MakeSectorRenderingData : function ( sector )
		{
			var face = new THREE.Vector4( 255, 0, 0, 255 ), edge = new THREE.Vector4( 0, 0, 0, 255 );
			var power = 400;
			var x, y, z;
			var ofs;
			var info;
			var cube;
			/* build sector geometry */
      var cluster = sector.cluster;
			var Offset;
			var cubx, cuby, cubz;
			var Sector_Display_x, Sector_Display_y, Sector_Display_z;
			var Draw;
            var P0,P1,P2,P3,P4,P5,P6,P7;

            if( !sector.solid_geometry ) {
                sector.solid_geometry = cluster.getGeometryBuffer();
                sector.Flag_Render_Dirty = true;
            }
            if( !sector.data.FaceCulling )
            {
                sector.culler = cluster.mesher.culler;
                this.initCulling( sector );
              }
			// Display list creation or reuse.
			if( sector.Flag_Render_Dirty )
			{
				var geometry = sector.solid_geometry;
				var voxelSize = cluster.voxelUnitSize;
				var FaceCulling = sector.data.FaceCulling;
				//Log.log( "Is Dirty Building sector {0} {1} {2}", sector.pos.x, sector.pos.y, sector.pos.z );
				Sector_Display_x = ( sector.pos.x * cluster.sectorSizeX * voxelSize );
				Sector_Display_y = ( sector.pos.y * cluster.sectorSizeY * voxelSize );
				Sector_Display_z = ( sector.pos.z * cluster.sectorSizeZ * voxelSize );

				sector.Flag_Void_Regular = true;
				sector.Flag_Void_Transparent = true;
				sector.Flag_Void_Custom = true;
                //sector.physics.Empty = true;
				{
					geometry.clear();
					/*
					Log.log( "sector is {6} {7} {8} near l{0} r{1} ab{2} bl{3} bh{4} ah{5}"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT-1] != null ) ? "Yes" : "no"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1] != null ) ? "Yes" : "no"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1] != null ) ? "Yes" : "no"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1] != null ) ? "Yes" : "no"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1] != null ) ? "Yes" : "no"
						, ( sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1] != null ) ? "Yes" : "no"
						, sector.pos.x, sector.pos.y, sector.pos.z
						);
					*/
          sector.data.data.forEach( (voxel,Offset)=>
					{
                        if( geometry.available > 256000 ){
                            debugger;
                            return;
                        }
                        if( !voxel ) return;
						{
							{
								info = FaceCulling[Offset];

								if( voxel && info != Voxelarium.FACEDRAW_Operations.NONE )
								{
                                    if( voxel.properties.DrawInfo === Voxelarium.ZVOXEL_DRAWINFO_VOID )
                                        Draw = false;
									else if( voxel.properties.Draw_TransparentRendering )
										{ Draw = false; sector.Flag_Void_Transparent = false; }
									else
										{ Draw = true; sector.Flag_Void_Regular = false; }
								}
								else
									Draw = false;

								if( Draw )
								{
									var box = voxel.TextureCoords;
									var face_is_shaded;

									if( !Voxelarium.Settings.use_basic_material &&
                      ( voxel.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_SHADER ) != 0 )
									{
										face = voxel.properties.FaceColor;
										edge = voxel.properties.EdgeColor;
										power = voxel.properties.EdgePower;
										face_is_shaded = true;
									}
									else 
                   {
                    cube = voxel;
	                  face_is_shaded = false; // uses texture instead of algorithm
                  }


									if( info != 0 )
									{
										//Log.log( "Set sector {0} {1} {2} offset {3}   {4:x}", sector.pos.x, sector.pos.y, sector.pos.z, Offset, info );
										//sector.physics.SetVoxel( Offset );
									}
									else
									{
										//sector.physics.ClearVoxel( Offset );
										//continue;
									}


                  cubx = Sector_Display_x + voxelSize * ( Math.floor( Offset / cluster.sectorSizeY ) % cluster.sectorSizeX );
									cuby = Sector_Display_y + voxelSize * ( ( Offset ) % cluster.sectorSizeY );
									cubz = Sector_Display_z + voxelSize * ( Math.floor( Offset / (cluster.sectorSizeX * cluster.sectorSizeY ) ) % cluster.sectorSizeZ );
									//cubx = ( x * voxelSize + Sector_Display_x );
									//cuby = ( y * voxelSize + Sector_Display_y );
									//cubz = ( z * voxelSize + Sector_Display_z );

									if( 0 != ( voxel.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_SPECIALRENDERING ))
									{ /*VoxelTypeTable[cube].SpecialRender( cubx, cuby, cubz ); */
										console.log( "Need to add custom pass for special render" );
										return;//continue;
									}

									P0 = new THREE.Vector3( cubx, cuby, cubz );
									P1 = new THREE.Vector3( cubx + voxelSize, cuby, cubz );
									P2 = new THREE.Vector3( cubx + voxelSize,cuby, cubz + voxelSize );
									P3 = new THREE.Vector3( cubx, cuby, cubz + voxelSize );
									P4 = new THREE.Vector3( cubx, cuby + voxelSize, cubz );
									P5 = new THREE.Vector3( cubx + voxelSize, cuby + voxelSize, cubz );
									P6 = new THREE.Vector3( cubx + voxelSize, cuby + voxelSize, cubz + voxelSize );
									P7 = new THREE.Vector3( cubx, cuby + voxelSize, cubz + voxelSize );

									//Left
									if( ( info & Voxelarium.FACEDRAW_Operations.LEFT ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P4 , P0, P3, P7 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.LEFT], P3, P7, P0, P4, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.LEFT], P3, P7, P0, P4, voxel.textureCoords );
									}

									// Right
									if( ( info & Voxelarium.FACEDRAW_Operations.RIGHT ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P5, P6, P2, P1 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.RIGHT], P1, P5, P2, P6, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.RIGHT], P1, P5, P2, P6, voxel.textureCoords );
									}
									//Front
									if( ( info & Voxelarium.FACEDRAW_Operations.BEHIND ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P0, P4, P5, P1 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.BEHIND], P0, P4, P1, P5, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.BEHIND], P0, P4, P1, P5, voxel.textureCoords );
									}

									//Back
									if( ( info & Voxelarium.FACEDRAW_Operations.AHEAD ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P2, P6, P3, P7 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.AHEAD], P2, P6, P3, P7, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.AHEAD], P2, P6, P3, P7, voxel.textureCoords );
									}

									// Top
									if( ( info & Voxelarium.FACEDRAW_Operations.ABOVE ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P4, P7, P5, P6 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.ABOVE], P4, P7, P5, P6, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.ABOVE], P4, P7, P5, P6, voxel.textureCoords );
									}

									// Bottom
									if( ( info & Voxelarium.FACEDRAW_Operations.BELOW ) != 0 )
									{
										//Log.log( "Add {0} {1} {2} {3}", P0, P1, P3, P2 );
										if( face_is_shaded )
											geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.BELOW], P3, P0, P2, P1, face, edge, power );
										else
											geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.BELOW], P3, P0, P2, P1, voxel.textureCoords );
									}
								}
								//else
								//	sector.physics.ClearVoxel( Offset );
							}
						}
					});
				}
        geometry.markDirty();
				sector.Flag_Render_Dirty = false;
			}
		}

        , fixed_lists : false

		, MakeSectorRenderingData_Sorted : function ( sector, viewed_as
											, centerX, centerY, centerZ )
		{
			if( sector.Flag_Void_Transparent )
				return;

			if( !fixed_lists )
			{
				for( var n = 19; n < 27; n++ )
					for( var m = 0; m < 3; m++ )
						OrderedFaces[n][m] = 0;
				fixed_lists = true;
			}

            var face = new THREE.Vector4( 256, 0, 0, 256 ), edge = new THREE.Vector4( 0, 0, 0, 256 );
			var power = 400;
			var x, y, z;
			var info;
			var sorted_draw_info = sorted_draw_infos[viewed_as];
			var cube, prevcube;
			/* build sector geometry */

			var Offset;
			var cubx, cuby, cubz;
			var Sector_Display_x, Sector_Display_y, Sector_Display_z;
			var Draw;

			var P0, P1, P2, P3, P4, P5, P6, P7;

			//Log.log( "Building sector {0} {1} {2}", sector.pos.x, sector.pos.y, sector.pos.z );
			// Display list creation or reuse.
			var geometry = sector.transparent_geometry;
			var voxelSize = sector.cluster.voxelUnitSize;
			var FaceCulling = sector.data.FaceCulling;
			Sector_Display_x = ( sector.pos.x * sector.Size_x * voxelSize );
			Sector_Display_y = ( sector.pos.y * sector.Size_y * voxelSize );
			Sector_Display_z = ( sector.pos.z * sector.Size_z * voxelSize );

			var SectorIndexes = SortedSectorIndexes[viewed_as];
			/*
			if( geometry.transparent_render_sorting != viewed_as )
			{
				geometry.transparent_render_sorting = viewed_as;
				sector.Flag_Render_Dirty_Transparent = true;
				geometry.sortedX = -1;
			}
			if( viewed_as == Voxelarium.RelativeVoxelOrds.INCENTER )
			{
				if( center_sorted_x != centerX
					|| center_sorted_y != centerY
					|| center_sorted_z != centerZ )
				{
					sector.Flag_Render_Dirty_Transparent = true;
					BuildSortListInSector( centerX, centerY, centerZ );
				}
			}
			*/
			if( sector.Flag_Render_Dirty_Transparent )
			{
				//Log.log( "Regnerate Alpha Geometry {0} {1} {2}", sector.pos.x, sector.pos.y, sector.pos.z );
				{
					var face_is_shaded = true;
					var view_order_list = null;
					geometry.Clear();

					prevcube = 0;
					for( var OffsetIndex = 0; OffsetIndex < VoxelSector.ZVOXELBLOCKCOUNT; OffsetIndex++ )
					{
						{
							{
								Offset = SectorIndexes[OffsetIndex];

								cube = sector.data.data[Offset];
								info = FaceCulling[Offset];// & (Voxelarium.FACEDRAW_Operations.ALL_BITS);// sorted_draw_info;
								//info = (Voxelarium.FACEDRAW_Operations)FaceCulling[Offset] & sorted_draw_info;

								if( cube && ( info )!= Voxelarium.FACEDRAW_Operations.NONE )
								{
									Draw = cube.properties.Draw_TransparentRendering;
								}
								else
									Draw = false;

								if( Draw )
								{
									var box;
									if( prevcube !== cube )
									{
										box = voxel.textureCoords;
										if( ( cube.properties.DrawInfo & Voxelarium.ZVOXEL_DRAWINFO_SHADER ) != 0 )
										{
											face = cube.properties.FaceColor;
											edge = cube.properties.EdgeColor;
											power = cube.properties.EdgePower;
											face_is_shaded = true;
										}
										else
											face_is_shaded = false;
									}
									prevcube = cube;

									cubx = ( Offset / cluster.sectorSizeY ) % cluster.sectorSizeX;
									cuby = ( Offset ) % cluster.sectorSizeY;
									cubz = ( Offset / (cluster.sectorSizeX * cluster.sectorSizeY ) ) % cluster.sectorSizeZ;

									P0.X = cubx; P0.Y = cuby; P0.Z = cubz;
									P1.X = cubx + voxelSize; P1.Y = cuby; P1.Z = cubz;
									P2.X = cubx + voxelSize; P2.Y = cuby; P2.Z = cubz + voxelSize;
									P3.X = cubx; P3.Y = cuby; P3.Z = cubz + voxelSize;
									P4.X = cubx; P4.Y = cuby + voxelSize; P4.Z = cubz;
									P5.X = cubx + voxelSize; P5.Y = cuby + voxelSize; P5.Z = cubz;
									P6.X = cubx + voxelSize; P6.Y = cuby + voxelSize; P6.Z = cubz + voxelSize;
									P7.X = cubx; P7.Y = cuby + voxelSize; P7.Z = cubz + voxelSize;


									if( viewed_as < 1 )
									{
										if( cubx < centerX )
											if( cuby < centerY )
												if( cubz < centerZ )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD];
											else
												if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD];
										else
											if( cuby < centerY )
											if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD];
										else
												if( cubz < centerZ )
											view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND];
										else
											view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD];
									}
									else if( viewed_as < 7 )
									{
										switch( viewed_as )
										{
										case Voxelarium.RelativeVoxelOrds.LEFT:
											if( cuby < centerY )
												if( cubz < centerZ )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD];
											else
												if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD];
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT:
											if( cuby < centerY )
												if( cubz < centerZ )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD];
											else
												if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD];
											break;
										case Voxelarium.RelativeVoxelOrds.AHEAD:
											if( cuby < centerY )
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD];
											else
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD];
											break;
										case Voxelarium.RelativeVoxelOrds.BEHIND:
											if( cuby < centerY )
												if( cubz < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND];
											else
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND];
											break;
										case Voxelarium.RelativeVoxelOrds.ABOVE:
											if( cubz < centerZ )
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND];
											else
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD];
											break;
										case Voxelarium.RelativeVoxelOrds.BELOW:
											if( cubz < centerZ )
												if( cubz < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND];
											else
												if( cubx < centerX )
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD];
												else
													view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD];
											break;
										}
									}
									else if( viewed_as < 19 )
									{
										switch( viewed_as )
										{
										case Voxelarium.RelativeVoxelOrds.LEFT_AHEAD:
											if( cuby < centerY )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD:
											if( cuby < centerY )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.LEFT_BEHIND:
											if( cuby < centerY )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND:
											if( cuby < centerY )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD:
											if( cubx < centerX )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_ABOVE];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.BELOW_AHEAD:
											if( cubx < centerX )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_BELOW];
											break;
										case Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND:
											if( cubx < centerX )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_ABOVE];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.BELOW_BEHIND:
											if( cubx < centerX )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_BELOW];
											break;
										case Voxelarium.RelativeVoxelOrds.LEFT_ABOVE:
											if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_ABOVE];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.LEFT_BELOW:
											if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_BEHIND_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD_BELOW];
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE:
											if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_ABOVE];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_ABOVE];
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT_BELOW:
											if( cubz < centerZ )
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND_BELOW];
											else
												view_order_list = OrderedFaces[Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD_BELOW];
											break;
										}
									}
									else
										view_order_list = OrderedFaces[viewed_as];
									for( var f = 0; f < 6; f++ )
									{
										switch( view_order_list[f] )
										{
										case Voxelarium.RelativeVoxelOrds.LEFT:
											//Left
											if( ( info & Voxelarium.FACEDRAW_Operations.LEFT ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P4 , P0, P3, P7 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.LEFT], P3, P7, P0, P4, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.LEFT], P3, P7, P0, P4, voxel.textureCoords );
											}
											break;
										case Voxelarium.RelativeVoxelOrds.RIGHT:

											// Right
											if( ( info & Voxelarium.FACEDRAW_Operations.RIGHT ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P5, P6, P2, P1 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.RIGHT], P1, P5, P2, P6, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.RIGHT], P1, P5, P2, P6, voxel.textureCoords );
											}
											break;
										case Voxelarium.RelativeVoxelOrds.BEHIND:
											//Front
											if( ( info & Voxelarium.FACEDRAW_Operations.BEHIND ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P0, P4, P5, P1 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.BEHIND], P0, P4, P1, P5, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.BEHIND], P0, P4, P1, P5, voxel.textureCoords );
											}
											break;
										case Voxelarium.RelativeVoxelOrds.AHEAD:
											//Back
											if( ( info & Voxelarium.FACEDRAW_Operations.AHEAD ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P2, P6, P3, P7 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.AHEAD], P2, P6, P3, P7, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.AHEAD], P2, P6, P3, P7, voxel.textureCoords );
											}
											break;
										case Voxelarium.RelativeVoxelOrds.ABOVE:
											// Top
											if( ( info & Voxelarium.FACEDRAW_Operations.ABOVE ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P4, P7, P5, P6 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.ABOVE], P4, P7, P5, P6, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.ABOVE], P4, P7, P5, P6, voxel.textureCoords );
											}
											break;
										case Voxelarium.RelativeVoxelOrds.BELOW:
											// Bottom
											if( ( info & Voxelarium.FACEDRAW_Operations.BELOW ) != 0 )
											{
												//Log.log( "Add {0} {1} {2} {3}", P0, P1, P3, P2 );
												if( face_is_shaded )
													geometry.AddQuad( normals[Voxelarium.RelativeVoxelOrds.BELOW], P3, P0, P2, P1, face, edge, power );
												else
													geometry.AddQuadTexture( normals[Voxelarium.RelativeVoxelOrds.BELOW], P3, P0, P2, P1, voxel.textureCoords );
											}
											break;
										}
									}
								}
							}
						}
					}
				}
                geometry.markDirty();

				sector.Flag_Render_Dirty_Transparent = false;
			}
		}



		, sorted_draw_infos : new Array( 27)
        , SortedSectorIndexes : new Array(27) //ushort[27][];
		, center_sorted_x : -1
        , center_sorted_y : 0
        , center_sorted_z : 0

		/// <summary>
		/// Build the INCENTER order list.
		/// </summary>
		/// <param name="x">voxel position of viewpoint</param>
		/// <param name="y">voxel position of viewpoint</param>
		/// <param name="z">voxel position of viewpoint</param>
		, BuildSortListInSector : function ( cluster, eye_x, eye_y, eye_z )
		{
			var x, y, z;
			var tmpx, tmpy, tmpz;
			var d;
			var val;
			if( center_sorted_x != eye_x || center_sorted_y != eye_y || center_sorted_z != eye_z )
			{
				var n;
				center_sorted_x = eye_x;
				center_sorted_y = eye_y;
				center_sorted_z = eye_z;
				// x, y, z po
				sorter.Clear();
				for( x = 0; x < cluster.sectorSizeX; x++ )
					for( y = 0; y < cluster.sectorSizeY; y++ )
						for( z = 0; z < cluster.sectorSizeZ; z++ )
						{
							val = (ushort)( x * cluster.sectorSizeY + y + z * cluster.sectorSizeX * cluster.sectorSizeY );
							tmpx = x - eye_x;
							tmpy = y - eye_y;
							tmpz = z - eye_z;
							d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
							sorter.Add( d, val );
						}

				var Indexes;
				Indexes = SortedSectorIndexes[0];
				n = VoxelSector.ZVOXELBLOCKCOUNT;
                sorter.forEach( (index)=>{
					// retrieved closest to furthest so... reverse storing it.
					Indexes[--n] = index;
                })
			}
		}


		, BuildSortList : function (  )
		{
			var x, y, z;
			var tmpx, tmpy, tmpz;
			var d;
			var val;
			var binaryOutput = new ushort[VoxelSector.ZVOXELBLOCKCOUNT];
			var binaryOutputIndex = 0;

            var sorter = Voxelarium.sorters[cluster.sectorSize];
            if( !sorter )
                sorter = Voxelarium.sorters[cluster.sectorSize] = Voxelarium.SortingTree( cluster.sectorSize );
			//start_steps += 27;
			sorter.AutoBalance = true;

			var i;
			for( i = Voxelarium.RelativeVoxelOrds.INCENTER;
						i <= Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT_BELOW; i++ )
			{
				var Indexes;
				var n, m;
				var xval, zval;
				Indexes = SortedSectorIndexes[i] = new ushort[VoxelSector.ZVOXELBLOCKCOUNT];
				n = 0;
				m = VoxelSector.ZVOXELBLOCKCOUNT - 1;
				sorter.Clear();
				switch( i )
				{
					case Voxelarium.RelativeVoxelOrds.INCENTER:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL;
						// no information; this one has to be done custom.
						break;
					case Voxelarium.RelativeVoxelOrds.LEFT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.LEFT;
						//for( n = 0; n < VoxelSector.ZVOXELBLOCKCOUNT; n++ )
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)(zval + y); //(ushort)( binaryOutput[n] );
									//x = ( val >> VoxelSector.ZVOXELBLOCSHIFT_Y ) & VoxelSector.ZVOXELBLOCMASK_X;
									//y = ( val  ) & VoxelSector.ZVOXELBLOCMASK_Y;
									//z = ( val >> ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) & VoxelSector.ZVOXELBLOCMASK_Z;
									tmpx = cluster.sectorSizeX - x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									//Log.log("Add {0} {1} {2}  {3}", x, y, z, d);
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.RIGHT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.RIGHT;
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.ABOVE;
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.BELOW;
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = cluster.sectorSizeY - y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.AHEAD;
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ Voxelarium.FACEDRAW_Operations.BEHIND;
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;

					case Voxelarium.RelativeVoxelOrds.LEFT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ (Voxelarium.FACEDRAW_Operations.LEFT|Voxelarium.FACEDRAW_Operations.AHEAD);
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.RIGHT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.AHEAD );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.LEFT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.BEHIND );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.RIGHT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.BEHIND );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y - ( cluster.sectorSizeY / 2 );
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;

					case Voxelarium.RelativeVoxelOrds.ABOVE_LEFT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_RIGHT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.BEHIND | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									val = (ushort)( x * cluster.sectorSizeY + y + z * cluster.sectorSizeX * cluster.sectorSizeY );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;

					case Voxelarium.RelativeVoxelOrds.ABOVE_LEFT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_RIGHT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_LEFT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.BEHIND |Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									val = (ushort)( x * cluster.sectorSizeY + y + z * cluster.sectorSizeX * cluster.sectorSizeY );
									tmpx = cluster.sectorSizeX - x;
									tmpy = y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.ABOVE_RIGHT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.BEHIND |Voxelarium.FACEDRAW_Operations.ABOVE );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;

					case Voxelarium.RelativeVoxelOrds.BELOW_LEFT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.BELOW );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_RIGHT:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.BELOW );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = z - ( cluster.sectorSizeZ / 2 );
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.BEHIND | Voxelarium.FACEDRAW_Operations.BELOW );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = cluster.sectorSizeY - y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.AHEAD | Voxelarium.FACEDRAW_Operations.BELOW );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x - ( cluster.sectorSizeX / 2 );
									tmpy = cluster.sectorSizeY - y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;

					case Voxelarium.RelativeVoxelOrds.BELOW_LEFT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.AHEAD );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_RIGHT_AHEAD:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.AHEAD );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_LEFT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.LEFT | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.BEHIND );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = cluster.sectorSizeX - x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
					case Voxelarium.RelativeVoxelOrds.BELOW_RIGHT_BEHIND:
						sorted_draw_infos[i] = Voxelarium.FACEDRAW_Operations.ALL ^ ( Voxelarium.FACEDRAW_Operations.RIGHT | Voxelarium.FACEDRAW_Operations.BELOW | Voxelarium.FACEDRAW_Operations.BEHIND );
						for( x = 0; x < cluster.sectorSizeX; x++ )
						{
							xval = x * cluster.sectorSizeY;
							for( z = 0; z < cluster.sectorSizeZ; z++ )
							{
								zval = xval + z * cluster.sectorSizeX * cluster.sectorSizeY;
								for( y = 0; y < cluster.sectorSizeY; y++ )
								{
									val = (ushort)( zval + y );
									tmpx = x;
									tmpy = cluster.sectorSizeY - y;
									tmpz = cluster.sectorSizeZ - z;
									d = ( tmpx * tmpx ) + ( tmpy * tmpy ) + ( tmpz * tmpz );
									sorter.Add( d, val );
								}
							}
						}
						break;
				}

				n = VoxelSector.ZVOXELBLOCKCOUNT;
				sorcer.forEach( ()=>
    				{
    					// retrieved closest to furthest so... reverse storing it.
    					//Log.log( "index is {0} {1} {2}"
    					//	, ( index >> VoxelSector.ZVOXELBLOCSHIFT_Y ) & VoxelSector.ZVOXELBLOCMASK_X
    					//	, index & VoxelSector.ZVOXELBLOCMASK_Y
    					//	, ( index >> ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) & VoxelSector.ZVOXELBLOCMASK_Z );
    					Indexes[--n] = index;
    				} );
				start_percent = ( ++start_step * 100 ) / start_steps;


				// strong test to make sure every offset is represented once.
				// paranoid debugging.
				/*
				if( i != Voxelarium.RelativeVoxelOrds.INCENTER )
				{
					int ofs, check;
					for( ofs = 0; ofs < VoxelSector.ZVOXELBLOCKCOUNT; ofs++ )
					{
						for( check = 0; check < VoxelSector.ZVOXELBLOCKCOUNT; check++ )
						{
							if( Indexes[check] == ofs )
								break;
						}
						if( check == VoxelSector.ZVOXELBLOCKCOUNT )
							Debugger.Break();
					}
				}
				*/
			}
		}
    }

    return mesher;
}

const normals = [ THREE.Vector3Zero
        , THREE.Vector3Left
        , THREE.Vector3Right
        , THREE.Vector3Ahead
        , THREE.Vector3Behind
        , THREE.Vector3Above
        , THREE.Vector3Below ];


Voxelarium.OrderedFaces = [
    // CENTER
          null
    // LEFT 1
        , null
    // RIGHT 2
        , null
    // AHEAD 3
        , null
    // BEHIND 4
        , null
    // ABOVE 5
        , null
    // BELOW 6
        , null
    // LEFT_ABOVE  7
        , null
    // RIGHT_ABOVE 8
        , null
    // AHEAD_ABOVE 9
        , null
    // BEHIND_ABOVE  10
        , null
    // LEFT_AHEAD 11
        , null
    // RIGHT_AHEAD 12
        , null
    // LEFT_BELOW 13
        , null
    //RIGHT_BELOW //14
        , null
    //INFRONT_BELOW //15
        , null
    //BEHIND_BELOW  //16
        , null
    //LEFT_BEHIND   //17
        , null
    //BEHIND_RIGHT   //18
        , null
    // LEFT_AHEAD_ABOVE   // 19
        , [ Voxelarium.RelativeVoxelOrds.LEFT, Voxelarium.RelativeVoxelOrds.AHEAD,Voxelarium.RelativeVoxelOrds.ABOVE,Voxelarium.RelativeVoxelOrds.BELOW,Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.RIGHT ]
    // RIGHT_AHEAD_ABOVE  // 20
        , [ Voxelarium.RelativeVoxelOrds.RIGHT, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.LEFT ]
    // LEFT_AHEAD_BELOW   // 21
        , [ Voxelarium.RelativeVoxelOrds.LEFT, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.RIGHT ]
    // RIGHT_AHEAD_BELOW  // 22
        , [ Voxelarium.RelativeVoxelOrds.RIGHT, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.LEFT ]
    // LEFT_BEHIND_ABOVE  // 23
        , [ Voxelarium.RelativeVoxelOrds.LEFT, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.RIGHT ]
    // RIGHT_BEHIND_ABOVE // 24
        , [ Voxelarium.RelativeVoxelOrds.RIGHT, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.LEFT ]
    // LEFT_BEHIND_BELOW  // 25
        , [ Voxelarium.RelativeVoxelOrds.LEFT, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.RIGHT ]
    // RIGHT_BEHIND_BELOW // 26
        , [ Voxelarium.RelativeVoxelOrds.RIGHT, Voxelarium.RelativeVoxelOrds.BEHIND, Voxelarium.RelativeVoxelOrds.BELOW, Voxelarium.RelativeVoxelOrds.ABOVE, Voxelarium.RelativeVoxelOrds.AHEAD, Voxelarium.RelativeVoxelOrds.LEFT ]
    ];

Voxelarium.mesher = { sorters : [] }

},{"./voxels.js":68}],47:[function(require,module,exports){

require( "./packedboolarray.js" )
Voxelarium.ModificationTracker = function(size) {
    return {
        lastCycle : -1,
        cycle : 0,
        modified : Voxelarium.PackedBoolArray( size ),
        clear : function(){ this.lastCycle = this.cycle; modified.clear(); },
        setCycle : function(cycle) { this.cycle = cycle },
        get : function( offset ) { if( this.lastCycle != this.cycle ) return false; return this.modified.get(offset); },
        set : function( offset ) { if( this.lastCycle != this.cycle ) this.clear();  this.modified.set(offset); }
    }
}

},{"./packedboolarray.js":48}],48:[function(require,module,exports){


//FastBit_Array_32k


Voxelarium.PackedBoolArray = function ( size ){
    if( !size )
        size = 32*32*32;
    var pba = {
        _bits : new ArrayBuffer( Math.floor( ( size + 31 ) /32 ) * 4 ),
        bits : null,
        get : function( bit ) { return ( this.bits[bit>>5] & 1 << ( bit & 0x1f ) ) !== 0; },
        set : function( bit ) { this.bits[bit>>5] |= 1 << ( bit & 0x1f ); },
        clear : function( bit ) { this.bits[bit>>5] &= ~(1 << ( bit & 0x1f )) },
        clearAll : function() { for( var n = 0; n < bits.length; n++) bits[n] = 0; }
    };
    pba.bits = new Uint32Array( pba._bits );
    return pba;

}

},{}],49:[function(require,module,exports){

Voxelarium.Reactor = function( world ) {
    var reactor = {
     StepOne : true,
     CycleNum : 0,
     world: world,

    processSectors : function ( world, LastLoopTime )
    {
        var x, y, z;

        var LowActivityTrigger;

        //Log.log( "Begin Reaction Processing" );
        var Sectors_processed = 0;
        var Voxels_Processed = 0;

        reactor.cycle++;

        if( !reactor.stepOne ) return;

        world.sectors.forEach( (Sector)=>{

            Sectors_processed++;

            LowActivityTrigger = Sector.Flag_IsActiveLowRefresh
                && ( ( ( CycleNum ) & Sector.LowRefresh_Mask ) == 0 );
            Sector.ModifTracker.SetActualCycleNum( CycleNum );
            if( Sector.Flag_IsActiveVoxels | LowActivityTrigger )
            {
                for( x = 0; x <= 6; x++ )
                {
                    if( Sector.near_sectors[x] != null )
                        Sector.near_sectors[x].ModifTracker.SetActualCycleNum( CycleNum );
                }

                var Extension = Sector.data.otherInfos;
                var VoxelP = Sector.data.data;

                var zofs, xofs;
                var IsActiveVoxels = false;
                MainOffset = 0;
                var RSx = Sector.Pos_x * Sector.size_x;
                var RSy = Sector.Pos_y * Sector.size_y;
                var RSz = Sector.Pos_z * Sector.size_z;
                var vref = {
                    world : world,
                    sector : Sector,
                }
                var sleep = Sector.data.sleepState;
                Sector.data.data.forEach( (voxel, MainOfset)=>{
                    if( sleep.get( MainOffset ) )
                        return;

                    vref.VoxelExtension = Extension[MainOffset];
                    vref.Type = VoxelP[MainOffset]
                    if( vref.Type.properties.Is_Active )
                    {

                        if( !Sector.ModifTracker.Get( MainOffset ) ) // If voxel is already processed, don't process it once more in the same cycle.
                        {
                            Voxels_Processed++;
                            vref.wx = RSx + ( vref.x = x );
                            vref.wy = RSy + ( vref.y = y );
                            vref.wz = RSz + ( vref.z = z );
                            vref.offset = MainOffset;
                            Sector.ModifTracker.Set(SecondaryOffset[i]);
                            try
                            {
                                if( vref.Type.React( vref, LastLoopTime ) )
                                    IsActiveVoxels = true;
                                else
                                    vref.Sector.data.sleepState.set( vref.offset );

                            }
                            catch( err )
                            {
                                console.log( "Voxel Reaction Exception : ", err );
                            }
                        }
                    }
                    else
                        sleep.set( MainOffset );
                    Sector.Flag_IsActiveVoxels = IsActiveVoxels;
                })
            }
        })
        //StepOne = false;
        //Log.log( "Finish Reaction Processing {0} {1} ", Sectors_processed, Voxels_Processed );
    }

    }
    return reactor;
}

},{}],50:[function(require,module,exports){
"use strict";

require( "./packedboolarray.js")
require( "./modtracker.js")



Voxelarium.Sector = function( cluster, x, y, z ) {

	var newSector = {
        next : null,
		pred : null,

		GlobalList_Next : null,
		GlobalList_Pred : null,

		near_sectors : new Array(27), // can index with relativeOrds-1 (self is not in this array)

		handle_x : 0, handle_y:0, handle_z : 0, // used in Genesis templates; 'origin' of this sector
		pos : new THREE.Vector3( x, y, z ),

		// Version control : Added for handling better world evolution.
		ZoneType : 0,     // The type of the zone.
		ZoneVersion : 0,  // The version of the generator used for this zone.
		GeneratorVersion : 0, // Main generator version. Updated at world change.
		RingNum : 0,

		cluster : cluster,

		data : { data : new Array( cluster.sectorSize )
				, sleepState : Voxelarium.PackedBoolArray( cluster.sectorSize )
            	, otherInfos : []
							, FaceCulling : null
            	},
		ModifTracker : Voxelarium.ModificationTracker( cluster.sectorSize ),

        mesher : null,

		THREE_solid : null,
        solid_geometry : null,
		transparent_geometry: null,
		custom_geometry: null,
		cachedString : null,

		enableGeometry : function() {
			this.solid_geometry = Voxelarium.GeometryBuffer();
			this.transparent_geometry = Voxelarium.GeometryBuffer();
			//this.custom_geometry = Voxelarium.GeometryBuffer();
		},

		getOffset : function( x, y, z ) {
			return cluster.lookupTables.ofTableX[x+1] + cluster.lookupTables.ofTableY[y+1] + cluster.lookupTables.ofTableZ[z+1];

			var offset;
			offset = ( y % this.cluster.sectorSizeY )
				+ ( ( x % this.cluster.sectorSizeX ) * this.cluster.sectorSizeY )
				+ ( ( z % this.cluster.sectorSizeZ ) * ( this.cluster.sectorSizeY * this.cluster.sectorSizeX ) );
			return offset;
		},

		setCube : function( x, y, z, CubeValue ) {
			var offset = this.getOffset( x, y, z );
			this.data.data[offset] = CubeValue;

			if( CubeValue && CubeValue.extension )
				this.data.otherInfos[offset] = CubeValue.extension();
			else
				this.data.otherInfos[offset] = null;
			this.Flag_Render_Dirty = true;
		},

		getCube : function( x, y, z ) {
			var offset = getOffset( x, y, z );
			return ( newSector.data.data[Offset] );
		},

		MakeSector : function( type ) {
			var x, y, z;
			var Cnt;
			if( type ) Cnt = type;
			else if( this.Pos_y < 0 ) { Cnt = Voxelarium.Voxels.types[0]; this.Flag_Void_Regular = false; this.Flag_Void_Transparent = true; }
			else { Cnt = null; this.Flag_Void_Regular = true; this.Flag_Void_Transparent = true; }
			for( z = 0; z < this.cluster.sectorSizeX; z++ )
			{
				for( y = 0; y < this.cluster.sectorSizeY; y++ )
				{
					for( x = 0; x < this.cluster.sectorSizeZ; x++ )
					{
						newSector.setCube( x, y, z, Cnt );
					}
				}
			}
		},

		getVoxelRef : function(x,y,z) {
			if( x < 0 ) x += this.cluster.sectorSizeX;
			if( y < 0 ) y += this.cluster.sectorSizeY;
			if( z < 0 ) z += this.cluster.sectorSizeZ;
			 return makeVoxelRef( this.cluster, this, x, y, z ); },

		stringify : function() {
			var v = v|| VoxelCompressor();
			var data = v.CompressVoxelData( this.data.data );
			var n = 0;
			var string = "";
			//var sv = new StringView( data.data );
			//var testString = sv.toString();
			//var testString2 = '\u0008\u0000\u0000\u0001\u0002\u0033\u00ef'
			for( n = 0; n < data.bytes_used; n++ ) {
				var val = data.data[n];
				if( !val )
					string += "\\0";
				else {
					var out = String.fromCodePoint( val );
					if( out === "\\" )
						string += "\\/";
					else if( out === "/" )
						string += "\\|";
					else
						string += out;
				}
			}

			var array = new ArrayBuffer(string.length);
			var escape = false;
			var out = 0;
			for( n = 0; n < string.length; n++ )
				{ var val = string.codePointAt( n );
					if( escape ) {
						if( val === 48 )
							val = 0;
						escape = false;
					}else {
						if( val == 92 ) {
							escape = true;
							continue;
						}
					}
					array[out++] = val;
					//console.log( val )
				 };
				 //console.log( "Buffer was", data.data );
				 //console.log( "which became", string );

				 {
					 var test_out = [];
					 console.log( "decoding string just encoded to see if it's valid;if failed, debugger; will trigger")
                                         var a = JSON.stringify(string);
					 var xfer = JSON.parse( a );
					 if( xfer !== string )
					 	debugger;
					 decodeString( string, test_out );
					 if( test_out.length === data.data.length ) {
						 for( var n = 0; n < test_out.length; n++ ) {
							 if( test_out[n] !== data.data[n] )
							 	debugger;

						 }
					 }
				 }
			 this.cachedString = string;
			return string;
		},

		decode : function( string ) {
			console.log( "decode", string );
			if( string === this.cachedString )
				return; // already have this as the thing.
			this.cachedString = string;
			decodeString( string, this.data.data )
			this.Flag_Render_Dirty = true;
			this.cluster.mesher.SectorUpdateFaceCulling( this, true )
			//basicMesher.SectorUpdateFaceCulling_Partial( cluster, sector, Voxelarium.FACEDRAW_Operations.ALL, true )
			this.cluster.mesher.MakeSectorRenderingData( this );

			}



    }

function decodeString( string, into ){
	var bytes = 0;
			for( var n = 0; n < string.length; n++ ){
				if( string[n] === '\\' ) {
					continue;
				} else bytes++;
			}

			var buffer = new ArrayBuffer(bytes);
			bytes = 0;
			for( var n = 0; n < string.length; n++ ){
				if( string[n] === '\\' ) {
					if( string[n+1] === '0' )
						buffer[bytes++] = 0;
					else if( string[n+1] === '/' )
						buffer[bytes++] = '\\';
					else if( string[n+1] === '|' )
						buffer[bytes++] = '/';
					else
						throw new Error( "Invalid encoding" );
					n++;
					continue;
				}
				else
					buffer[bytes++] = string.codePointAt( n );
			}


			var v = v|| VoxelCompressor();
			var data = v.DecompressVoxelData( buffer, into );

		}


    return newSector;
}


function VoxelCompressor() {
		/*
						{
						VoxelDataCompressor vdc = new VoxelDataCompressor();
						ushort[] decompress = new ushort[32 * 32 * 32];
						byte[] data;
						int bytes;
						vdc.CompressVoxelData( Sector.Data.Data, out data, out bytes );
						Log.log( "compressed sector is {0}", bytes, 0 );
						vdc.DecompressVoxelData( data, decompress );
						{
							int n;
							for( n = 0; n < 32 * 32 * 32; n++ )
								if( decompress[n] != Sector.Data.Data[n] )
								{
									int a = 3;
								}
						}
					}

		*/

			/// <summary>
			/// Handles compressing and decompressing ushort array that is the sector content
			/// </summary>
	var vc = {

			WriteCubes : function( stream, bits, count, index )
			{
				// 1 count 2 bits = 3   vs 9
				// 1 count 3 bits = 4   vs 10
				// 1 count  4 bits  = 5     vs 11
				// 1 count  5 bits  = 6     vs 12
				// 1 count  6 bits  = 7     vs 13
				// 1 count  7 bits  = 8     vs 14

				// 2 count 2 bits = 6   vs 9
				// 2 count 3 bits = 8   vs 10
				// 2 count  4 bits  = 10    vs 11
				// 2 count  5 bits  = 12    vs 12
				// 2 count  6 bits  = 14    vs 13
				// 2 count  7 bits  = 16    vs 14

				// 3 count 2 bits = 9   vs 9
				// 3 count 3 bits = 12  vs 10
				// 3 count  4 bits  = 15    vs 11
				// 3 count  5 bits  = 18    vs 12
				// 3 count  6 bits  = 21    vs 13
				// 3 count  7 bits  = 24    vs 14


				if( ( (bits +1) * count ) <= ( 7 + bits ) )
				{
					for( var n = 0; n < count; n++ )
					{
						stream.write( 0, 1 );
						stream.write( index, bits );
					}
				}
				else
				{
					stream.write( 1, 1 );
					//Log.log( "Write count {0}", count );
					/*
					if( ( count & 0x8000 ) != 0 )
					{
						stream.Write( ( ( count >> 15 ) & 0x1F ) | 0x20, 7 );
						stream.Write( ( ( count >> 10 ) & 0x1F ) | 0x20, 7 );
						stream.Write( ( ( count >> 5 ) & 0x1F ) | 0x20, 7 );
						stream.Write( ( ( count  ) & 0x1F ), 7 );
					}
					else */
					count -= 2; // always at least 1, and then this value always starts at atleast 2; and very small delta sets can be 3, but typically 2.
					if( ( count & 0xFC00 ) != 0 )
					{
						stream.write( ( ( count >> 10 ) & 0x1F ) | 0x20, 6 );
						stream.write( ( ( count >> 5 ) & 0x1F ) | 0x20, 6 );
						stream.write( ( ( count ) & 0x1F ), 6 );
					}
					else if( ( count & 0xFFE0 ) != 0 )
					{
						stream.write( ( ( count >> 5 ) & 0x1F ) | 0x20, 6 );
						stream.write( ( ( count ) & 0x1F ) , 6 );
					}
					else
					{
						stream.write( ( ( count ) & 0x1F ), 6 );
					}
					//stream.Write( count, 16 );
					stream.write( index, bits );
				}

			},

			CompressVoxelData : function( data )
			{
				var stream = Voxelarium.BitStream();
				var len = data.length;
				var n;
				var types = [];

				for( n = 0; n < len; n++ )
				{
					var vox = Voxelarium.Voxels.getIndex( data[n] )
					if( types.findIndex( (v) => v===vox ) < 0 )
						types.push( vox );
				}

				var bits = Voxelarium.BitStream.GetMinBitsNeededForValue( types.length - 1 ); // 4 is 0,1,2,3; needs only 2 bits...
				//bits = (bits + 7 ) & 0xf8;
				stream.seek( 16 ); // seek bit count
				stream.write( bits, 8 );
				stream.write( types.length-1, bits );
				types.forEach( (type)=>{
					stream.write( type, 16 ); } );
				var prior_cube = 0xFFFF, cube;
				var index = 0;
				var count = 0;
	            for( n = 0; n < len; n++ )
				{
					var cube = Voxelarium.Voxels.getIndex( data[n] )
					if( prior_cube != cube )
					{
						if( count > 0 )
							vc.WriteCubes( stream, bits, count, index );
						index = types.findIndex( (v)=>(v=== cube ) );
						prior_cube = cube;
						count = 1;
					}
					else
						count++;
				}
				vc.WriteCubes( stream, bits, count, index );

				var result = stream.getBytes();
				result.data[0] = (( result.bytes_used ) & 0xFF);
				result.data[1] = ( ( result.bytes_used ) >> 8);
				// already compressed as can be.
				if( result.bytes_used < 20 )
					return result;

				/* can gzip the stream at this point too and save 10-20% more */
				/*
				MemoryStream final_stream = new MemoryStream();
				final_stream.Seek( 2, SeekOrigin.Begin );
				//DeflateStream gz_stream = new DeflateStream( final_stream, CompressionMode.Compress );
				//GZipStream gz_stream = new GZipStream( final_stream, CompressionMode.Compress );
				GZipStream gz_stream = new GZipStream( final_stream, CompressionLevel.Fastest );
				//for( n = 2; n < bytes_used; n++ )
				//	gz_stream.WriteByte( result[n] );
				gz_stream.Write( result, 2, bytes_used - 2 );
				gz_stream.Close();
				result = final_stream.ToArray();//.GetBuffer();
				Log.log( "Compressed another {0}%", (float)( 100.0f * (float)( bytes_used - result.Length ) / ( bytes_used - 2 ) ) );
				// store old length so we know how much to request decompressing.
				result[0] = (byte)( ( bytes_used ) & 0xFF );
				result[1] = (byte)( ( bytes_used ) >> 8 );
				bytes_used = result.Length;// (int)final_stream.Length;
				gz_stream.Dispose();
				*/
				return result;
			},

			DecompressVoxelData : function(  data, result )
			{
				var stream;
				var DataBytes;
				{
					stream = Voxelarium.BitStream( data );
					stream.seek( 16 ); // seek by bit position
				}
				var types = [];

				var bits;
				var TypeCount;
				bits = stream.read( 8);
				TypeCount = stream.read( bits );
				TypeCount++; // always at least one.
				var n;
				for( n = 0; n < TypeCount; n++ )
				{
					var val;
					val = stream.read( 16 );
					var assertVal;
					assertVal = Voxelarium.Voxels.types[val];
					if( assertVal )
						types.push( assertVal );
					else
						types.push( Voxelarium.Voxels.Void );
				}

				var outpos = 0;
				do
				{
					var vox;
					var val;
					var count;
					val = stream.read( 1 );
					if( val == 0 )
					{
						val = stream.read( bits );
						vox = types[val];
						if( !vox ) debugger;
						result[outpos++] = vox;
					}
					else
					{
						var count_tmp;
						count_tmp = stream.read( 6  );
						count = count_tmp & 0x1F;
						if( ( count_tmp & 0x20 ) != 0 )
						{
							count <<= 5;
							count_tmp = stream.read( 6 );
							count |= count_tmp & 0x1F;
							if( ( count_tmp & 0x20 ) != 0 )
							{
								count <<= 5;
								count_tmp = stream.read( 6 );
								count |= count_tmp & 0x1F;
							}
						}
						count += 2;
						//stream.Read( 16, out count );
						//Log.log( "Read count {0}", count );
						val = stream.read( bits );
						vox = types[val];
						if( !vox ) {
							vox = types[0];
							debugger;
						}
						//console.log( "Set vox to ", vox )
						for( n = 0; n < count; n++ )
							result[outpos++] = vox;
					}
				} while( outpos < result.length );

			}

		}
	return vc;
}

function NearVoxelRef() {
	var result = {
	 sector:this,
	 voxelType:null,
	 offset:0,
	 voxelExtension:null
 	}
	result.voxelType = this.data.data[result.offset];
	result.voxelExtension = this.data.otherInfos[result.offset];
	 return result;
}

function VoxelRef( x, y, z ) {
}

var refPool = [];

Voxelarium.VoxelRef = makeVoxelRef


function makeVoxelRef( cluster, sector, x, y, z )
{
	var result;
	result = refPool.pop();
	if( !result ) {
		result = { sector : sector
				, offset : 0
				, x : x, y : y, z : z
			 	, wx : sector?(sector.pos.x * cluster.sectorSizeX + x):x
				, wy : sector?(sector.pos.y * cluster.sectorSizeY + y):y
				, wz : sector?(sector.pos.z * cluster.sectorSizeZ + z):z
				, voxelType : null
				, cluster : cluster
				, voxelExtension : null
				, forEach : forEach
				, delete : function() { refPool.push( this ); }
				, clone : function() { return this.sector.getVoxelRef( this.x, this.y, this.z ) }
				, getNearVoxel : GetVoxelRef
				 }
		Object.seal( result );
	}
	else {
		result.sector = sector;
		result.offset = 0;
		result.x = x;
		result.y = y;
		result.z = z;
		result.wx = sector?(sector.pos.x * cluster.sectorSizeX + x):x
		result.wy = sector?(sector.pos.y * cluster.sectorSizeY + y):y
		result.wz = sector?(sector.pos.z * cluster.sectorSizeZ + z):z
		result.voxelType = null;
		result.cluster = cluster;
		result.voxelExtension = null;
	}
    if( sector ) {
		// wx coords will still be accurate even if the sub-range and origin sector move now.
		if( result.x < 0 ) { result.x += cluster.sectorSizeX; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT] || result.sector ) }
		if( result.y < 0 ) { result.y += cluster.sectorSizeY; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW] || result.sector ) }
		if( result.z < 0 ) { result.z += cluster.sectorSizeZ; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD] || result.sector ) }
		if( result.x >= cluster.sectorSizeX ) { result.x -= cluster.sectorSizeX; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT] || result.sector ) }
		if( result.y >= cluster.sectorSizeY ) { result.y += cluster.sectorSizeY; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE] || result.sector ) }
		if( result.z >= cluster.sectorSizeZ ) { result.z += cluster.sectorSizeZ; result.sector = ( result.sector && result.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND] || result.sector ) }

		result.offset = ( result.x * cluster.sectorSizeY )  + result.y + ( result.z * ( cluster.sectorSizeY * cluster.sectorSizeX ) );
		  result.voxelType = sector.data.data[result.offset]
		  if( !result.voxelType )
		  	return null;
		  result.voxelExtension = sector.data.otherInfos[result.offset];
    }
	return result;
}

	function forEach( voxelRef2, not_zero, callback )
	{
		var voxelRef1 = this;
		//if( voxelRef1.sector == null || voxelRef2.sector == null )
		//	return not_zero ? 1 : 0;
		if( voxelRef1.cluster !== voxelRef2.cluster )
			return not_zero ? 1 : 0;
		var cluster = voxelRef1.cluster;

		var v1x = voxelRef1.wx;
		var v1y = voxelRef1.wy;
		var v1z = voxelRef1.wz;
		var v2x = voxelRef2.wx;
		var v2y = voxelRef2.wy;
		var v2z = voxelRef2.wz;
		var del_x = v2x - v1x;
		var del_y = v2y - v1y;
		var del_z = v2z - v1z;
		var abs_x = del_x < 0 ? -del_x : del_x;
		var abs_y = del_y < 0 ? -del_y : del_y;
		var abs_z = del_z < 0 ? -del_z : del_z;
		// cannot use iterate if either end is undefined.
		if( del_x != 0 )
		{
			if( del_y != 0 )
			{
				if( del_z != 0 )
				{
					if( abs_x > abs_y || ( abs_z > abs_y ) )
					{
						if( abs_z > abs_x )
						{
							// z is longest path
							var erry = -abs_z / 2;
							var errx = -abs_z / 2;
							var incy = del_y < 0 ? -1 : 1;
							var incx = del_x < 0 ? -1 : 1;
							var incz = del_z < 0 ? -1 : 1;
							{
								var x = v1x;
								var y = v1y;
								for( var z = v1z + incz; z != v2z; z += incz )
								{
									errx += abs_x;
									if( errx > 0 )
									{
										errx -= abs_z;
										x += incx;
									}
									erry += abs_y;
									if( erry > 0 )
									{
										erry -= abs_z;
										y += incy;
									}
									{
										let v = cluster.getVoxelRef( false, x, y, z );
										if( v ) {
											let val = callback( v );
											if( val !== v ) v.delete();
											if( ( !not_zero && val ) || ( not_zero && !val ) )
												return val;
										}
									}
								}
							}
						}
						else
						{
							// x is longest.
							var erry = -abs_x / 2;
							var errz = -abs_x / 2;
							var incy = del_y < 0 ? -1 : 1;
							var incx = del_x < 0 ? -1 : 1;
							var incz = del_z < 0 ? -1 : 1;
							{
								var y = v1y;
								var z = v1z;
								for( var x = v1x + incx; x != v2x; x += incx )
								{
									errz += abs_z;
									if( errz > 0 )
									{
										errz -= abs_x;
										z += incz;
									}
									erry += abs_y;
									if( erry > 0 )
									{
										erry -= abs_x;
										y += incy;
									}
									{
										let v = cluster.getVoxelRef( false, x, y, z );
										if( v ) {
											let val = callback( v );
											if( val !== v ) v.delete();
											if( ( !not_zero && val ) || ( not_zero && !val ) )
												return val;
										}
									}
								}
							}
						}
					}
					else
					{
						// y is longest.
						var errx = -abs_y / 2;
						var errz = -abs_y / 2;
						var incy = del_y < 0 ? -1 : 1;
						var incx = del_x < 0 ? -1 : 1;
						var incz = del_z < 0 ? -1 : 1;
						{
							var x = v1x;
							var z = v1z;
							for( var y = v1y + incy; y != v2y; y += incy )
							{
								errx += abs_x;
								if( errx > 0 )
								{
									errx -= abs_y;
									x += incx;
								}
								errz += abs_z;
								if( errz > 0 )
								{
									errz -= abs_y;
									z += incz;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
				}
				else
				{
					// z is constant
					if( abs_x > abs_y )
					{
						// x is longest
						var erry = -abs_x / 2;
						var incy = del_y < 0 ? -1 : 1;
						var incx = del_x < 0 ? -1 : 1;
						{
							var y = v1y;
							var z = v1z;
							for( var x = v1x + incx; x != v2x; x += incx )
							{
								erry += abs_y;
								if( erry > 0 )
								{
									erry -= abs_x;
									y += incy;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
					else
					{
						// y is longest.
						var errx = -abs_y / 2;
						var incy = del_y < 0 ? -1 : 1;
						var incx = del_x < 0 ? -1 : 1;
						{
							var x = v1x;
							var z = v1z;
							for( var y = v1y + incy; y != v2y; y += incy )
							{
								errx += abs_x;
								if( errx > 0 )
								{
									errx -= abs_y;
									x += incx;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
				}
			}
			else
			{
				if( del_z != 0 )
				{
					if( abs_x > abs_z )
					{
						// x is longest.
						var errz = -abs_x / 2;
						var incx = del_x < 0 ? -1 : 1;
						var incz = del_z < 0 ? -1 : 1;
						{
							var y = v1y;
							var z = v1z;
							for( var x = v1x + incx; x != v2x; x += incx )
							{
								errz += abs_z;
								if( errz > 0 )
								{
									errz -= abs_x;
									z += incz;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
					else
					{
						// z is longest path
						var errx = -abs_z / 2;
						var incx = del_x < 0 ? -1 : 1;
						var incz = del_z < 0 ? -1 : 1;
						{
							var x = v1x;
							var y = v1y;
							for( var z = v1z + incz; z != v2z; z += incz )
							{
								errx += abs_x;
								if( errx > 0 )
								{
									errx -= abs_z;
									x += incx;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
				}
				else
				{
					// x is only changing.
					var incx = del_x < 0 ? -1 : 1;
					for( var x = v1x + incx; x != v2x; x += incx )
					{
						let v = cluster.getVoxelRef( false, x, y, z );
						if( v ) {
							let val = callback( v );
							if( val !== v ) v.delete();
							if( ( !not_zero && val ) || ( not_zero && !val ) )
								return val;
						}
					}
				}
			}
		}
		else
		{
			if( del_y != 0 )
			{
				if( del_z != 0 )
				{
					if( abs_y > abs_z )
					{
						// y is longest.
						var errz = -abs_y / 2;
						var incy = del_y < 0 ? -1 : 1;
						var incz = del_z < 0 ? -1 : 1;
						{
							var x = v1x;
							var z = v1z;
							for( var y = v1y + incy; y != v2y; y += incy )
							{
								errz += abs_z;
								if( errz > 0 )
								{
									errz -= abs_y;
									z += incz;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
					else
					{
						// z is longest path
						var erry = -abs_z / 2;
						var incy = del_y < 0 ? -1 : 1;
						var incz = del_z < 0 ? -1 : 1;
						{
							var x = v1x;
							var y = v1y;
							for( var z = v1z + incz; z != v2z; z += incz )
							{
								erry += abs_y;
								if( erry > 0 )
								{
									erry -= abs_z;
									y += incy;
								}
								{
									let v = cluster.getVoxelRef( false, x, y, z );
									if( v ) {
										let val = callback( v );
										if( val !== v ) v.delete();
										if( ( !not_zero && val ) || ( not_zero && !val ) )
											return val;
									}
								}
							}
						}
					}
				}
				else
				{
					// no del_x, no del_z
					// y is only changing.
					var incy = del_y < 0 ? -1 : 1;
					for( var y = v1y + incy; y != v2y; y += incy )
					{
						let v = cluster.getVoxelRef( false, x, y, z );
						if( v ) {
							let val = callback( v );
							if( val !== v ) v.delete();
							if( ( !not_zero && val ) || ( not_zero && !val ) )
								return val;
						}
					}
				}
			}
			else
			{
				// no del_x, no del_y...
				if( del_z != 0 )
				{
					if( del_z > 0 )
						for( var z = v1z + 1; z < v2z; z++ )
						{
							let v = cluster.getVoxelRef( false, x, y, z );
							if( v ) {
								let val = callback( v );
								if( val !== v ) v.delete();
								if( ( !not_zero && val ) || ( not_zero && !val ) )
									return val;
							}
						}
					else
						for( var z = v2z + 1; z < v1z; z++ )
						{
							let v = cluster.getVoxelRef( false, x, y, z );
							if( v ) {
								let val = callback( v );
								if( val !== v ) v.delete();
								if( ( !not_zero && val ) || ( not_zero && !val ) )
									return val;
							}
						}

				}
				else
				{
					// no delta diff, nothing to do.
				}
			}
		}
		return not_zero ? 1 : 0;
	}

	function GetVoxelRefs( nearOnly )
	{
		var result = {
			ResultSectors : new Array(nearOnly ? 7 : 19),
			ResultOffsets : new Array(nearOnly ? 7 : 19)
		}
		GetVoxelRefs( ResultSectors, ResultOffsets, nearOnly );
	}

	function GetVoxelRef( direction )
	{
		that = this.clone();
		switch( direction )
		{
		default:
			throw new Error( "Creating voxel ref " + direction + " is not implemented " );
			break;
		case Voxelarium.RelativeVoxelOrds.LEFT:
			that.wx--;
			if( that.x > 0 )
			{
				that.x--;
				that.Offset -= that.sector.Size_y;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.x = (byte)( that.sector.Size_x - 1 );
					that.Offset += that.sector.Size_y * ( that.sector.Size_x - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.RIGHT:
			that.wx++;
			if( that.x < (that.sector.Size_x-1 ) )
			{
				that.x++;
				that.Offset += that.sector.Size_y;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.x = 0;
					that.Offset -= that.sector.Size_y * ( that.sector.Size_x - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BEHIND:
			that.wz--;
			if( that.z > 0 )
			{
				that.z--;
				that.Offset -= that.sector.Size_y*that.sector.Size_x;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.z = (byte)( that.sector.Size_z - 1 );
					that.Offset += ( that.sector.Size_x * that.sector.Size_y * ( that.sector.Size_z - 2 ) );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.AHEAD:
			that.wz++;
			if( that.z < ( that.sector.Size_z - 1 ) )
			{
				that.z++;
				that.Offset += that.sector.Size_y*that.sector.Size_x;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.z = 0;
					that.Offset -= ( that.sector.Size_x * that.sector.Size_y * ( that.sector.Size_z - 2 ) );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BELOW:
			that.wy--;
			if( that.y > 0 )
			{
				that.y--;
				that.Offset--;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.y = (byte)( that.sector.Size_y - 1 );
					that.Offset += ( that.sector.Size_y - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.ABOVE:
			that.wy++;
			if( that.y < ( that.sector.Size_y - 1 ) )
			{
				that.y++;
				that.Offset++;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.y = 0;
					that.Offset -= ( that.sector.Size_y - 2 );
				}
			}
			break;
		}
		if( that.sector != null )
		{
			that.Type = that.sector.data.data[that.offset];
			that.VoxelExtension = that.sector.data.otherInfos[that.offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
		return that;
	}

	function GetNearVoxelRef( direction )
	{
		var that = GetNearVoxelRef( )
		var cluster = this.sector.cluster;
		that.sector = this.sector;
		that.Offset = this.Offset;
		switch( direction )
		{
		default:
			throw new NotImplementedException( "Creating voxel ref " + direction + " is not implemented " );
			break;
		case Voxelarium.RelativeVoxelOrds.LEFT:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != 0 )
				that.Offset -= that.sector.Size_y;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
			}
			break;
		case Voxelarium.RelativeVoxelOrds.RIGHT:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y )
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BEHIND:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != 0 )
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
			}
			break;
		case Voxelarium.RelativeVoxelOrds.AHEAD:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) )
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BELOW:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != 0 )
				that.Offset--;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
			}
			break;
		case Voxelarium.RelativeVoxelOrds.ABOVE:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != VoxelSector.ZVOXELBLOCMASK_Y )
				that.Offset++;
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
			}
			break;
		}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}


	function GetNearLeftVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != 0 )
				that.Offset -= that.sector.Size_y;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				if( that.sector != null )
					that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearRightVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y )
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				if( that.sector != null )
					that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearAheadVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) )
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
				if( that.sector != null )
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearBehindVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != 0 )
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
				if( that.sector != null )
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearAboveVoxelRef( that,  self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != VoxelSector.ZVOXELBLOCMASK_Y )
				that.Offset++;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
				if( that.sector != null )
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearBelowVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != 0 )
				that.Offset--;
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
				if( that.sector != null )
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
			}
		if( that.sector != null )
		{
			that.Type = self.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}



	function GetNearVoxelRef( that,  self, direction )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
		switch( direction )
		{
		default:
			throw new NotImplementedException( "Creating voxel ref " + direction + " is not implemented " );
			break;
		case Voxelarium.RelativeVoxelOrds.LEFT:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != 0 )
			{
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.RIGHT:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y )
			{
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BEHIND:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != 0 )
			{
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.AHEAD:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) )
			{
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.BELOW:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != 0 )
			{
				that.Offset--;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
				}
			}
			break;
		case Voxelarium.RelativeVoxelOrds.ABOVE:
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != VoxelSector.ZVOXELBLOCMASK_Y )
			{
				that.Offset++;
			}
			else
			{
				that.sector = self.sector.near_sectors[direction - 1];
				if( that.sector != null )
				{
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
				}
			}
			break;
		}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearLeftVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != 0 )
			{
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				if( that.sector != null )
				{
					that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearRightVoxelRef( that,self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y ) ) != VoxelSector.ZVOXELBLOCMASK_X << VoxelSector.ZVOXELBLOCSHIFT_Y )
			{
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				if( that.sector != null )
				{
					that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_X - 2 );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearAheadVoxelRef( that,self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) )
			{
				that.Offset += VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
				if( that.sector != null )
				{
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearBehindVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) ) ) != 0 )
			{
				that.Offset -= VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
				if( that.sector != null )
				{
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_X * VoxelSector.ZVOXELBLOCSIZE_Y * ( VoxelSector.ZVOXELBLOCSIZE_Z - 2 ) );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearAboveVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != VoxelSector.ZVOXELBLOCMASK_Y )
			{
				that.Offset++;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
				if( that.sector != null )
				{
					that.Offset -= ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetNearBelowVoxelRef( that, self )
	{
		that.sector = self.sector;
		that.Offset = self.Offset;
			if( ( that.Offset & ( VoxelSector.ZVOXELBLOCMASK_Y ) ) != 0 )
			{
				that.Offset--;
			}
			else
			{
				that.sector = self.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
				if( that.sector != null )
				{
					that.Offset += ( VoxelSector.ZVOXELBLOCSIZE_Y - 2 );
				}
			}
		if( that.sector != null )
		{
			that.Type = self.sector.VoxelTypeManager.VoxelTable[that.sector.Data.Data[that.Offset]];
			that.VoxelExtension = that.sector.Data.OtherInfos[that.Offset];
		}
		else
		{
			that.Type = null;
			that.VoxelExtension = null;
		}
	}

	function GetVoxelRefs( nearOnly )
	{
		if( nearOnly )
		{
			var result = new array(7);
			//result[0] = this;
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.LEFT]   , this, Voxelarium.RelativeVoxelOrds.LEFT );
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.RIGHT]  , this, Voxelarium.RelativeVoxelOrds.RIGHT );
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.AHEAD]  , this, Voxelarium.RelativeVoxelOrds.AHEAD );
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.BEHIND] , this, Voxelarium.RelativeVoxelOrds.BEHIND );
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.ABOVE]  , this, Voxelarium.RelativeVoxelOrds.ABOVE );
			GetNearVoxelRef(  result[Voxelarium.RelativeVoxelOrds.BELOW]  , this, Voxelarium.RelativeVoxelOrds.BELOW );
		}
		else
		{
			var result = new VoxelRef[27];
		}
		return result;

	}

	function GetVoxelRefs( ResultSectors,  ResultOffsets,  nearOnly )
	{
		//ResultSectors = new VoxelSector[nearOnly ? 7 : 19];
		//ResultOffsets = new uint[nearOnly ? 7 : 19];

		ResultSectors[Voxelarium.RelativeVoxelOrds.INCENTER] = this.sector;
		var origin = this.Offset.clonse();//( this.x <<VoxelSector.ZVOXELBLOCSHIFT_Y ) + this.y + ( this.z << (VoxelSector.ZVOXELBLOCSHIFT_X +VoxelSector.ZVOXELBLOCSHIFT_Y ) );
		{
			var input = VoxelSector.RelativeVoxelOffsets_Unwrapped;
			var n;
			var idx = 0;
			ResultOffsets[idx] = origin + input[idx]; idx++;
			ResultOffsets[idx] = origin + input[idx]; idx++; //1
			ResultOffsets[idx] = origin + input[idx]; idx++; //2
			ResultOffsets[idx] = origin + input[idx]; idx++; //3
			ResultOffsets[idx] = origin + input[idx]; idx++; //4
			ResultOffsets[idx] = origin + input[idx]; idx++; //5
			ResultOffsets[idx] = origin + input[idx]; idx++; //6
			if( !nearOnly ) for( n = 0; n < 20; n++ ) { ResultOffsets[idx] = origin + input[idx]; idx++; }

			if( this.x == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT]
						= this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector;
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.LEFT - 1, 0]] += ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.LEFT - 1, n]] += ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else if( this.x == ( VoxelSector.ZVOXELBLOCSIZE_X - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.RIGHT - 1, 0]] -= ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.RIGHT - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
			}
			else
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector;
			}
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BELOW - 1, 0]] += ( VoxelSector.ZVOXELBLOCSIZE_Y );
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BELOW - 1, n]] += ( VoxelSector.ZVOXELBLOCSIZE_Y );
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.ABOVE - 1, 0]] -= ( VoxelSector.ZVOXELBLOCSIZE_Y );
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.ABOVE - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_Y );
			}
			else
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
			}

			if( this.z == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BEHIND - 1, 0]] += ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BEHIND - 1, n]] += ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;
				ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.AHEAD - 1, 0]] -= ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
				if( !nearOnly ) for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.AHEAD - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
			}
			else
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;
			}

			// test to make sure resulting offsets are within range.
			//for( n = 0; n < 27; n++ ) if( ResultOffsets[n] & 0xFFFF8000 ) DebugBreak();
		}
		if( nearOnly )
			return;

		if( this.x == 0 )
		{
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else //----------------------------------------------
				{
					// left bound, top bound, front nobound
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector;
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;

					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else //----------------------------------------------
			{
				// left bound, above/below unbound
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] != null ? ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1] : null;
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					// left bound, y unbound z unbound
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
		}
		else if( this.x == ( VoxelSector.ZVOXELBLOCSIZE_X - 1 ) )
		{
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
		}
		else //---------------------------------------------------------
		{
			// left/right unbound... left and right should never be terms of equality
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
			}
			else  //----------------------------------------------
			{
				// x not on bound, y not on bound.
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
			}
		}
	}

	// result set is only 9 (3x3 face)
	function GetVoxelRefs(  ResultSectors,  ResultOffsets, faceOnly )
	{
		var result = {
			ResultSectors : new Array(27),
			ResultOffsets : new Array(27)
		}

		ResultSectors[Voxelarium.RelativeVoxelOrds.INCENTER] = this.sector;
		var origin = ( this.x << VoxelSector.ZVOXELBLOCSHIFT_Y ) + this.y + ( this.z << ( VoxelSector.ZVOXELBLOCSHIFT_X + VoxelSector.ZVOXELBLOCSHIFT_Y ) );
		{
			var input = VoxelSector.RelativeVoxelOffsets_Unwrapped;
			var n;
			for( n = 0; n < 9; n++ )
				ResultOffsets[n] = (uint)(origin + VoxelSector.RelativeVoxelOffsets_Unwrapped[VoxelSector.VoxelFaceGroups[faceOnly, n]]);

			switch( faceOnly )
			{
				case Voxelarium.RelativeVoxelOrds.LEFT:
					if( this.x == 0 )
					{
						for( n = 0; n < 9; n++ )
						{
							ResultSectors[n] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector;
							ResultOffsets[n] += ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
						}
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector;
					}
					break;
				case Voxelarium.RelativeVoxelOrds.RIGHT:
					if( this.x == ( VoxelSector.ZVOXELBLOCSIZE_X - 1 ) )
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
						for( n = 0; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.RIGHT - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_X ) * VoxelSector.ZVOXELBLOCSIZE_Y;
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT] = this.sector;
					}
					break;
				case Voxelarium.RelativeVoxelOrds.ABOVE:
					if( this.y == 0 )
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
						ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BELOW - 1, 0]] += ( VoxelSector.ZVOXELBLOCSIZE_Y );
						for( n = 0; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BELOW - 1, n]] += ( VoxelSector.ZVOXELBLOCSIZE_Y );
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
					}
					break;
				case Voxelarium.RelativeVoxelOrds.BELOW:
					if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
						ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.ABOVE - 1, 0]] -= ( VoxelSector.ZVOXELBLOCSIZE_Y );
						for( n = 0; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.ABOVE - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_Y );
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
					}
					break;
				case Voxelarium.RelativeVoxelOrds.BEHIND:
					if( this.z == 0 )
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
						ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BEHIND - 1, 0]] += ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
						for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.BEHIND - 1, n]] += ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;
					}
					break;
				case Voxelarium.RelativeVoxelOrds.AHEAD:
					if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1]; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;
						ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.AHEAD - 1, 0]] -= ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
						for( n = 1; n < 9; n++ ) ResultOffsets[VoxelSector.VoxelFaceGroups[Voxelarium.RelativeVoxelOrds.AHEAD - 1, n]] -= ( VoxelSector.ZVOXELBLOCSIZE_Z ) * VoxelSector.ZVOXELBLOCSIZE_Y * VoxelSector.ZVOXELBLOCSIZE_X;
					}
					else
					{
						ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector; ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;
					}
					break;
			}
			// test to make sure resulting offsets are within range.
			//for( n = 0; n < 27; n++ ) if( ResultOffsets[n] & 0xFFFF8000 ) DebugBreak();
		}


		if( this.x == 0 )
		{
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else //----------------------------------------------
				{
					// left bound, top bound, front nobound
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD] = this.sector;
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND] = this.sector;

					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else //----------------------------------------------
			{
				// left bound, above/below unbound
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.LEFT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					// left bound, y unbound z unbound
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
		}
		else if( this.x == ( VoxelSector.ZVOXELBLOCSIZE_X - 1 ) )
		{
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.BELOW - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE] = this.sector.near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW] = this.sector;
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.ABOVE - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
			else
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD].near_sectors[Voxelarium.RelativeVoxelOrds.RIGHT - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW];
				}
			}
		}
		else //---------------------------------------------------------
		{
			// left/right unbound... left and right should never be terms of equality
			if( this.y == 0 )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW].near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
			}
			else if( this.y == ( VoxelSector.ZVOXELBLOCSIZE_Y - 1 ) )
			{
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				if( this.z == 0 )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.BEHIND - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];

				}
				else if( this.z == ( VoxelSector.ZVOXELBLOCSIZE_Z - 1 ) )
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE].near_sectors[Voxelarium.RelativeVoxelOrds.AHEAD - 1];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				}
				else
				{
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
					ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW];
				}
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND];
			}
			else  //----------------------------------------------
			{
				// x not on bound, y not on bound.
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW] = ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT];

				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_LEFT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND_RIGHT] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];

				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_AHEAD] = ResultSectors[Voxelarium.RelativeVoxelOrds.AHEAD];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.LEFT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_ABOVE_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
				ResultSectors[Voxelarium.RelativeVoxelOrds.RIGHT_BELOW_BEHIND] = ResultSectors[Voxelarium.RelativeVoxelOrds.BEHIND];
			}
		}
	}

},{"./modtracker.js":47,"./packedboolarray.js":48}],51:[function(require,module,exports){


Voxelarium.SortingTree = function(Capacity){
    var sorter = {
		/// <summary>
		/// storage type for Sorting Tree
		/// </summary>

		storage : [],
		root : -1,
		used : 0,
        autoBalance : false,
        clear : function() { this.root = -1; this.used = 0; },
        add : Add,
        balance : Balance,
        forEach : foreach
    };

	storage = [];
    for( var n = 0; n < Capacit; n++ )
        storage.push( { key : 0, value : null,
                 lesser : 0, greater : 0, parent : 0, children : 0
            } );

    return sorter;
}

function DumpTree( current, level ) {
	if( current == -1 ) {
		if( root == -1 )
			return;
		console.log( "Start Tree Dump" );
		DumpTree( root, level + 1 );
	} else {
		if( this.storage[current].lesser != -1 ) {
			DumpTree( this.storage[current].lesser, level + 1 );
		}
		console.log( "Cur: " + current + " Par: " + this.storage[current].parent
			+ " Les: " + this.storage[current].lesser
			+ " Grt: " + this.storage[current].greater
			+ " Lev: " + level + " cld: " + this.storage[current].children + "  Key: " + this.storage[current].key + " val: " + this.storage[current].value );
		if( this.storage[current].greater != -1 ) {
			DumpTree( this.storage[current].greater, level + 1 );
		}
	}
}


function RotateLeft( node, node_id )
{
	if( node.parent == -1 )
	{
		root = node.greater;
		this.storage[root].parent = -1;
	}
	else
	{
		if( this.storage[node.parent].lesser == node_id )
			this.storage[node.parent].lesser = node.greater;
		else
			this.storage[node.parent].greater = node.greater;
		this.storage[node.greater].parent = node.parent;
	}
	node.children -= ( this.storage[node.greater].children + 1 );
	node.parent = node.greater;
	var temp = this.storage[node.greater].lesser;
	node.greater = temp;
	this.storage[node.parent].lesser = node_id;
	if( temp >= 0 )
	{
		this.storage[temp].parent = node_id;
		this.storage[node.parent].children -= ( this.storage[temp].children + 1 );
		node.children += ( this.storage[temp].children + 1 );
	}
	this.storage[node.parent].children += ( node.children + 1 );
}

function RotateRight( node, node_id )
{
	if( node.parent == -1 )
	{
		root = node.lesser;
		this.storage[root].parent = -1;
	}
	else
	{
		if( this.storage[node.parent].lesser == node_id )
			this.storage[node.parent].lesser = node.lesser;
		else
			this.storage[node.parent].greater = node.lesser;
		this.storage[node.lesser].parent = node.parent;
	}
	node.children -= ( this.storage[node.lesser].children + 1 );
	node.parent = node.lesser;
	var temp = this.storage[node.lesser].greater;
	node.lesser = temp;
	this.storage[node.parent].greater = node_id;  // actually oldnode.lesser
	if( temp >= 0 )
	{
		this.storage[temp].parent = node_id;
		this.storage[node.parent].children -= ( this.storage[temp].children + 1 );
		node.children += ( this.storage[temp].children + 1 );
	}
	this.storage[node.parent].children += ( node.children + 1 );
}

function Balance( node, node_id )
{
	if( !this.AutoBalance ) return;
    var left_children = node.lesser == -1 ? 0 : ( this.storage[node.lesser].children + 1 );
	var right_children = node.greater == -1 ? 0 : ( this.storage[node.greater].children + 1 );
	if( left_children == 0 )
	{
		if( right_children > 1 )
            RotateLeft( node, node_id );
	}
	else if( right_children == 0 )
	{
		if( left_children > 1 )
		{
			RotateRight( node, node_id );
		}
	}
	else if( right_children > ( left_children * 3 ) )
	{
		RotateLeft( node, node_id );
		Balance( storage[node.lesser], node.lesser );
	}
	else if( left_children > ( right_children * 3 ) )
	{
		RotateRight( node, node_id );
		Balance( storage[node.greater], node.greater );
	}
}

function addNode( node,  parent_id, K,  V ) {
	node.key = K;
	node.value = V;
	node.lesser = -1;
	node.greater = -1;
	node.parent = parent_id;
	node.children = 0;
}


function ScanAdd( node, node_id, K, V )
{
	if( K < node.key )
	{
		if( node.lesser == -1 )
		{
			node.children++;
			this.addNode( storage[used], node_id, K, V );
			node.lesser = used;
			used++;
		}
		else
		{
			node.children++;
			ScanAdd( storage[node.lesser], node.lesser, K, V );
			Balance( node, node_id );
		}
	}
	else if( K >= node.key )
	{
		if( node.greater == -1 )
		{
			node.children++;
			this.addNode( storage[used], node_id, K, V );
			node.greater = used;
			used++;
		}
		else
		{
			node.children++;
			ScanAdd( storage[node.greater], node.greater, K, V );
			Balance( node, node_id );
		}
	}
}

function Add( K, V )
{
	if( root == -1 )
	{
		root = 0;
		this.addNode( this.storage[root], -1, K, V );
		used++;
	}
	else
		ScanAdd( this.storage[root], root, K, V );
}


function foreach( callback ) {
    var current = -1;

	var next;
    while( true ) {
		if( current == -1 )
		{
			current = Tree.root;
			if( current == -1 )
				return false;
			while( ( next = Tree.storage[current].lesser ) != -1 )
				current = next;
            callback( this.storage[current].value );
            continue;
		}
		else if( ( next = Tree.storage[current].greater ) != -1 )
		{
			current = next;
			while( ( next = Tree.storage[current].lesser ) != -1 )
				current = next;
            callback( this.storage[current].value );
            continue;
		}

		else while( ( next = Tree.storage[current].parent ) != -1 )
		{
			// came from lesser, so this is next larger.
			if( Tree.storage[next].lesser == current )
			{
				current = next;
                callback( this.storage[current].value );
                continue;
			}
			else
				current = next;
		}
        break;
    }
}

},{}],52:[function(require,module,exports){
"use strict";

Voxelarium.TextureAtlas = {
    texture : null,
    texture_count : 0,
    texture_size : 0,
    renderTarget : null,
    canvas : null,
    context : null,
    texture : null,
    x_ofs : 0,
    y_ofs : 0,
    init : function( count, size ) {
        this.texture_count = count;
        this.texture_size = size;
        this.canvas = document.createElement('canvas');
        this.canvas.width = 2048;
        this.canvas.height = 2048;
    	this.context = this.canvas.getContext('2d');
        this.context.fillStyle="clear";
        this.context.fillRect(0,0,2048,2048);
        //this.context.clearRect(20,20,100,50);
        this.texture = new THREE.Texture(this.canvas)
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;
    	//this.texture.needsUpdate = true;

    },
    add : function( image )
   {
       var coords = {
           uvs : new Array(8),
           uv_array : null,
           coord : { position : { x : 0, y : 0 }, size : {x : 0,y:0 } }
       }
       if( this.y_ofs >= 32 )
       {
           for(  var n = 0; n < 8; n++ )
               uvs[n] = 0;
           coords.coord.position.x = 0;
           coords.coord.position.y = 0;
           coords.coord.size.x = 0;
           coords.coord.size.y = 0;
           return coords;
       }
       var scalar = 1.0 / ( this.texture_count);
       //Log.log( "output texture to atlas... {0} {1}", x_ofs, y_ofs );
       coords.coord.position.x = ( scalar ) * this.x_ofs;
       coords.coord.position.y = ( scalar ) * this.y_ofs;
       coords.coord.size.x = ( scalar );
       coords.coord.size.y = ( scalar );

       coords.uvs[0 * 2 + 0] = ( scalar ) * this.x_ofs;
       coords.uvs[0 * 2 + 1] = 1-(( scalar ) * this.y_ofs);
       coords.uvs[1 * 2 + 0] = coords.uvs[0 * 2 + 0] + ( scalar );
       coords.uvs[1 * 2 + 1] = coords.uvs[0 * 2 + 1];
       coords.uvs[2 * 2 + 0] = coords.uvs[0 * 2 + 0];
       coords.uvs[2 * 2 + 1] = (coords.uvs[0 * 2 + 1] - ( scalar ));
       coords.uvs[3 * 2 + 0] = coords.uvs[1 * 2 + 0];
       coords.uvs[3 * 2 + 1] = coords.uvs[2 * 2 + 1];

       var in_uvs = coords.uvs;
       coords.uv_array = [in_uvs[1*2+0]
                   ,in_uvs[1*2+1]
                   ,in_uvs[0*2+0]
                   ,in_uvs[0*2+1]
                   ,in_uvs[3*2+0]
                   ,in_uvs[3*2+1]
                   ,in_uvs[2*2+0]
                   ,in_uvs[2*2+1]
               ];


       this.context.drawImage( image, this.texture_size * this.x_ofs, this.texture_size * this.y_ofs, this.texture_size, this.texture_size )

       this.texture.needsUpdate = true;

       this.x_ofs++;
       if( this.x_ofs == this.texture_count )
       {
           this.x_ofs = 0;
           this.y_ofs++;
       }
       return coords;
   }
}

},{}],53:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.RenderableObject = function () {

	this.id = 0;

	this.object = null;
	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableFace = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.normalModel = new THREE.Vector3();

	this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	this.vertexNormalsLength = 0;

	this.color = new THREE.Color();
	this.material = null;
	this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ];

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableVertex = function () {

	this.position = new THREE.Vector3();
	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

};

//

THREE.RenderableLine = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.vertexColors = [ new THREE.Color(), new THREE.Color() ];
	this.material = null;

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableSprite = function () {

	this.id = 0;

	this.object = null;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.rotation = 0;
	this.scale = new THREE.Vector2();

	this.material = null;
	this.renderOrder = 0;

};

//

THREE.Projector = function () {

	var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
	_vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
	_face, _faceCount, _facePool = [], _facePoolLength = 0,
	_line, _lineCount, _linePool = [], _linePoolLength = 0,
	_sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

	_renderData = { objects: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
	_boundingBox = new THREE.Box3(),
	_points3 = new Array( 3 ),
	_points4 = new Array( 4 ),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_modelMatrix,
	_modelViewProjectionMatrix = new THREE.Matrix4(),

	_normalMatrix = new THREE.Matrix3(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4();

	//

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

	//

	var RenderList = function () {

		var normals = [];
		var uvs = [];

		var object = null;
		var material = null;

		var normalMatrix = new THREE.Matrix3();

		function setObject( value ) {

			object = value;
			material = object.material;

			normalMatrix.getNormalMatrix( object.matrixWorld );

			normals.length = 0;
			uvs.length = 0;

		}

		function projectVertex( vertex ) {

			var position = vertex.position;
			var positionWorld = vertex.positionWorld;
			var positionScreen = vertex.positionScreen;

			positionWorld.copy( position ).applyMatrix4( _modelMatrix );
			positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

			var invW = 1 / positionScreen.w;

			positionScreen.x *= invW;
			positionScreen.y *= invW;
			positionScreen.z *= invW;

			vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
					 positionScreen.y >= - 1 && positionScreen.y <= 1 &&
					 positionScreen.z >= - 1 && positionScreen.z <= 1;

		}

		function pushVertex( x, y, z ) {

			_vertex = getNextVertexInPool();
			_vertex.position.set( x, y, z );

			projectVertex( _vertex );

		}

		function pushNormal( x, y, z ) {

			normals.push( x, y, z );

		}

		function pushUv( x, y ) {

			uvs.push( x, y );

		}

		function checkTriangleVisibility( v1, v2, v3 ) {

			if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

			_points3[ 0 ] = v1.positionScreen;
			_points3[ 1 ] = v2.positionScreen;
			_points3[ 2 ] = v3.positionScreen;

			return _clipBox.intersectsBox( _boundingBox.setFromPoints( _points3 ) );

		}

		function checkBackfaceCulling( v1, v2, v3 ) {

			return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
				    ( v2.positionScreen.y - v1.positionScreen.y ) -
				    ( v3.positionScreen.y - v1.positionScreen.y ) *
				    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

		}

		function pushLine( a, b ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];

			_line = getNextLineInPool();

			_line.id = object.id;
			_line.v1.copy( v1 );
			_line.v2.copy( v2 );
			_line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;
			_line.renderOrder = object.renderOrder;

			_line.material = object.material;

			_renderData.elements.push( _line );

		}

		function pushTriangle( a, b, c ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];
			var v3 = _vertexPool[ c ];

			if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

			if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

				_face = getNextFaceInPool();

				_face.id = object.id;
				_face.v1.copy( v1 );
				_face.v2.copy( v2 );
				_face.v3.copy( v3 );
				_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
				_face.renderOrder = object.renderOrder;

				// use first vertex normal as face normal

				_face.normalModel.fromArray( normals, a * 3 );
				_face.normalModel.applyMatrix3( normalMatrix ).normalize();

				for ( var i = 0; i < 3; i ++ ) {

					var normal = _face.vertexNormalsModel[ i ];
					normal.fromArray( normals, arguments[ i ] * 3 );
					normal.applyMatrix3( normalMatrix ).normalize();

					var uv = _face.uvs[ i ];
					uv.fromArray( uvs, arguments[ i ] * 2 );

				}

				_face.vertexNormalsLength = 3;

				_face.material = object.material;

				_renderData.elements.push( _face );

			}

		}

		return {
			setObject: setObject,
			projectVertex: projectVertex,
			checkTriangleVisibility: checkTriangleVisibility,
			checkBackfaceCulling: checkBackfaceCulling,
			pushVertex: pushVertex,
			pushNormal: pushNormal,
			pushUv: pushUv,
			pushLine: pushLine,
			pushTriangle: pushTriangle
		}

	};

	var renderList = new RenderList();

	this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

		_faceCount = 0;
		_lineCount = 0;
		_spriteCount = 0;

		_renderData.elements.length = 0;

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_frustum.setFromMatrix( _viewProjectionMatrix );

		//

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.lights.length = 0;

		function addObject( object ) {

			_object = getNextObjectInPool();
			_object.id = object.id;
			_object.object = object;

			_vector3.setFromMatrixPosition( object.matrixWorld );
			_vector3.applyProjection( _viewProjectionMatrix );
			_object.z = _vector3.z;
			_object.renderOrder = object.renderOrder;

			_renderData.objects.push( _object );

		}

		scene.traverseVisible( function ( object ) {

			if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsObject( object ) === false ) return;

				addObject( object );

			} else if ( object instanceof THREE.Sprite ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsSprite( object ) === false ) return;

				addObject( object );

			}

		} );

		if ( sortObjects === true ) {

			_renderData.objects.sort( painterSort );

		}

		//

		for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

			var object = _renderData.objects[ o ].object;
			var geometry = object.geometry;

			renderList.setObject( object );

			_modelMatrix = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;
					var groups = geometry.groups;

					if ( attributes.position === undefined ) continue;

					var positions = attributes.position.array;

					for ( var i = 0, l = positions.length; i < l; i += 3 ) {

						renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

					}

					if ( attributes.normal !== undefined ) {

						var normals = attributes.normal.array;

						for ( var i = 0, l = normals.length; i < l; i += 3 ) {

							renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

						}

					}

					if ( attributes.uv !== undefined ) {

						var uvs = attributes.uv.array;

						for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

							renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

						}

					}

					if ( geometry.index !== null ) {

						var indices = geometry.index.array;

						if ( groups.length > 0 ) {

							for ( var o = 0; o < groups.length; o ++ ) {

								var group = groups[ o ];

								for ( var i = group.start, l = group.start + group.count; i < l; i += 3 ) {

									renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

								}

							}

						} else {

							for ( var i = 0, l = indices.length; i < l; i += 3 ) {

								renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

							}

						}

					} else {

						for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

							renderList.pushTriangle( i, i + 1, i + 2 );

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

					_normalMatrix.getNormalMatrix( _modelMatrix );

					var material = object.material;

					var isFaceMaterial = material instanceof THREE.MultiMaterial;
					var objectMaterials = isFaceMaterial === true ? object.material : null;

					for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

						var vertex = vertices[ v ];

						_vector3.copy( vertex );

						if ( material.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = object.morphTargetInfluences;

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var target = morphTargets[ t ];
								var targetVertex = target.vertices[ v ];

								_vector3.x += ( targetVertex.x - vertex.x ) * influence;
								_vector3.y += ( targetVertex.y - vertex.y ) * influence;
								_vector3.z += ( targetVertex.z - vertex.z ) * influence;

							}

						}

						renderList.pushVertex( _vector3.x, _vector3.y, _vector3.z );

					}

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];

						material = isFaceMaterial === true
							 ? objectMaterials.materials[ face.materialIndex ]
							 : object.material;

						if ( material === undefined ) continue;

						var side = material.side;

						var v1 = _vertexPool[ face.a ];
						var v2 = _vertexPool[ face.b ];
						var v3 = _vertexPool[ face.c ];

						if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

						var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

						if ( side !== THREE.DoubleSide ) {

							if ( side === THREE.FrontSide && visible === false ) continue;
							if ( side === THREE.BackSide && visible === true ) continue;

						}

						_face = getNextFaceInPool();

						_face.id = object.id;
						_face.v1.copy( v1 );
						_face.v2.copy( v2 );
						_face.v3.copy( v3 );

						_face.normalModel.copy( face.normal );

						if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

							_face.normalModel.negate();

						}

						_face.normalModel.applyMatrix3( _normalMatrix ).normalize();

						var faceVertexNormals = face.vertexNormals;

						for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

							var normalModel = _face.vertexNormalsModel[ n ];
							normalModel.copy( faceVertexNormals[ n ] );

							if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

								normalModel.negate();

							}

							normalModel.applyMatrix3( _normalMatrix ).normalize();

						}

						_face.vertexNormalsLength = faceVertexNormals.length;

						var vertexUvs = faceVertexUvs[ f ];

						if ( vertexUvs !== undefined ) {

							for ( var u = 0; u < 3; u ++ ) {

								_face.uvs[ u ].copy( vertexUvs[ u ] );

							}

						}

						_face.color = face.color;
						_face.material = material;

						_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
						_face.renderOrder = object.renderOrder;

						_renderData.elements.push( _face );

					}

				}

			} else if ( object instanceof THREE.Line ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;

					if ( attributes.position !== undefined ) {

						var positions = attributes.position.array;

						for ( var i = 0, l = positions.length; i < l; i += 3 ) {

							renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

						}

						if ( geometry.index !== null ) {

							var indices = geometry.index.array;

							for ( var i = 0, l = indices.length; i < l; i += 2 ) {

								renderList.pushLine( indices[ i ], indices[ i + 1 ] );

							}

						} else {

							var step = object instanceof THREE.LineSegments ? 2 : 1;

							for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

								renderList.pushLine( i, i + 1 );

							}

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					_modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

					var vertices = object.geometry.vertices;

					if ( vertices.length === 0 ) continue;

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

					var step = object instanceof THREE.LineSegments ? 2 : 1;

					for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

						v1 = getNextVertexInPool();
						v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

						if ( ( v + 1 ) % step > 0 ) continue;

						v2 = _vertexPool[ _vertexCount - 2 ];

						_clippedVertex1PositionScreen.copy( v1.positionScreen );
						_clippedVertex2PositionScreen.copy( v2.positionScreen );

						if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

							// Perform the perspective divide
							_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
							_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

							_line = getNextLineInPool();

							_line.id = object.id;
							_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
							_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

							_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );
							_line.renderOrder = object.renderOrder;

							_line.material = object.material;

							if ( object.material.vertexColors === THREE.VertexColors ) {

								_line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
								_line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

							}

							_renderData.elements.push( _line );

						}

					}

				}

			} else if ( object instanceof THREE.Sprite ) {

				_vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
				_vector4.applyMatrix4( _viewProjectionMatrix );

				var invW = 1 / _vector4.w;

				_vector4.z *= invW;

				if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

					_sprite = getNextSpriteInPool();
					_sprite.id = object.id;
					_sprite.x = _vector4.x * invW;
					_sprite.y = _vector4.y * invW;
					_sprite.z = _vector4.z;
					_sprite.renderOrder = object.renderOrder;
					_sprite.object = object;

					_sprite.rotation = object.rotation;

					_sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
					_sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

					_sprite.material = object.material;

					_renderData.elements.push( _sprite );

				}

			}

		}

		if ( sortElements === true ) {

			_renderData.elements.sort( painterSort );

		}

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		if ( _objectCount === _objectPoolLength ) {

			var object = new THREE.RenderableObject();
			_objectPool.push( object );
			_objectPoolLength ++;
			_objectCount ++;
			return object;

		}

		return _objectPool[ _objectCount ++ ];

	}

	function getNextVertexInPool() {

		if ( _vertexCount === _vertexPoolLength ) {

			var vertex = new THREE.RenderableVertex();
			_vertexPool.push( vertex );
			_vertexPoolLength ++;
			_vertexCount ++;
			return vertex;

		}

		return _vertexPool[ _vertexCount ++ ];

	}

	function getNextFaceInPool() {

		if ( _faceCount === _facePoolLength ) {

			var face = new THREE.RenderableFace();
			_facePool.push( face );
			_facePoolLength ++;
			_faceCount ++;
			return face;

		}

		return _facePool[ _faceCount ++ ];


	}

	function getNextLineInPool() {

		if ( _lineCount === _linePoolLength ) {

			var line = new THREE.RenderableLine();
			_linePool.push( line );
			_linePoolLength ++;
			_lineCount ++;
			return line;

		}

		return _linePool[ _lineCount ++ ];

	}

	function getNextSpriteInPool() {

		if ( _spriteCount === _spritePoolLength ) {

			var sprite = new THREE.RenderableSprite();
			_spritePool.push( sprite );
			_spritePoolLength ++;
			_spriteCount ++;
			return sprite;

		}

		return _spritePool[ _spriteCount ++ ];

	}

	//

	function painterSort( a, b ) {

		if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else if ( a.id !== b.id ) {

			return a.id - b.id;

		} else {

			return 0;

		}

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerp( s2, alpha1 );
				s2.lerp( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};

},{}],54:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.BloomPass = function ( strength, kernelSize, sigma, resolution ) {

	THREE.Pass.call( this );

	strength = ( strength !== undefined ) ? strength : 1;
	kernelSize = ( kernelSize !== undefined ) ? kernelSize : 25;
	sigma = ( sigma !== undefined ) ? sigma : 4.0;
	resolution = ( resolution !== undefined ) ? resolution : 256;

	// render targets

	var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };

	this.renderTargetX = new THREE.WebGLRenderTarget( resolution, resolution, pars );
	this.renderTargetY = new THREE.WebGLRenderTarget( resolution, resolution, pars );

	// copy material

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.CopyShader" );

	var copyShader = THREE.CopyShader;

	this.copyUniforms = THREE.UniformsUtils.clone( copyShader.uniforms );

	this.copyUniforms[ "opacity" ].value = strength;

	this.materialCopy = new THREE.ShaderMaterial( {

		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		transparent: true

	} );

	// convolution material

	if ( THREE.ConvolutionShader === undefined )
		console.error( "THREE.BloomPass relies on THREE.ConvolutionShader" );

	var convolutionShader = THREE.ConvolutionShader;

	this.convolutionUniforms = THREE.UniformsUtils.clone( convolutionShader.uniforms );

	this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurX;
	this.convolutionUniforms[ "cKernel" ].value = THREE.ConvolutionShader.buildKernel( sigma );

	this.materialConvolution = new THREE.ShaderMaterial( {

		uniforms: this.convolutionUniforms,
		vertexShader:  convolutionShader.vertexShader,
		fragmentShader: convolutionShader.fragmentShader,
		defines: {
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed( 1 ),
			"KERNEL_SIZE_INT": kernelSize.toFixed( 0 )
		}

	} );

	this.needsSwap = false;

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.BloomPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.BloomPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( maskActive ) renderer.context.disable( renderer.context.STENCIL_TEST );

		// Render quad with blured scene into texture (convolution pass 1)

		this.quad.material = this.materialConvolution;

		this.convolutionUniforms[ "tDiffuse" ].value = readBuffer.texture;
		this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurX;

		renderer.render( this.scene, this.camera, this.renderTargetX, true );


		// Render quad with blured scene into texture (convolution pass 2)

		this.convolutionUniforms[ "tDiffuse" ].value = this.renderTargetX.texture;
		this.convolutionUniforms[ "uImageIncrement" ].value = THREE.BloomPass.blurY;

		renderer.render( this.scene, this.camera, this.renderTargetY, true );

		// Render original scene with superimposed blur to texture

		this.quad.material = this.materialCopy;

		this.copyUniforms[ "tDiffuse" ].value = this.renderTargetY.texture;

		if ( maskActive ) renderer.context.enable( renderer.context.STENCIL_TEST );

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

	}

} );

THREE.BloomPass.blurX = new THREE.Vector2( 0.001953125, 0.0 );
THREE.BloomPass.blurY = new THREE.Vector2( 0.0, 0.001953125 );

},{}],55:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ClearPass = function ( clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.needsSwap = false;

	this.clearColor = ( clearColor !== undefined ) ? clearColor : 0x000000;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

};

THREE.ClearPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ClearPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var oldClearColor, oldClearAlpha;

		if ( this.clearColor ) {

			oldClearColor = renderer.getClearColor().getHex();
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.setRenderTarget( this.renderToScreen ? null : readBuffer );
		renderer.clear();

		if ( this.clearColor ) {

			renderer.setClearColor( oldClearColor, oldClearAlpha );

		}

	}

} );

},{}],56:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};
		var size = renderer.getSize();
		renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

Object.assign( THREE.EffectComposer.prototype, {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

		var size = this.renderer.getSize();
		pass.setSize( size.width, size.height );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( THREE.MaskPass !== undefined ) {

				if ( pass instanceof THREE.MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof THREE.ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			var size = this.renderer.getSize();

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( size.width, size.height );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );

		for ( var i = 0; i < this.passes.length; i ++ ) {

			this.passes[i].setSize( width, height );

		}

	}

} );


THREE.Pass = function () {

	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass indicates to swap read and write buffer after rendering
	this.needsSwap = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen
	this.renderToScreen = false;

};

Object.assign( THREE.Pass.prototype, {

	setSize: function( width, height ) {},

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		console.error( "THREE.Pass: .render() must be implemented in derived pass." );

	}

} );

},{}],57:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.clear = true;
	this.needsSwap = false;

	this.inverse = false;

};

THREE.MaskPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.MaskPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var context = renderer.context;
		var state = renderer.state;

		// don't update color or depth

		state.buffers.color.setMask( false );
		state.buffers.depth.setMask( false );

		// lock buffers

		state.buffers.color.setLocked( true );
		state.buffers.depth.setLocked( true );

		// set up stencil

		var writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		state.buffers.stencil.setTest( true );
		state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
		state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
		state.buffers.stencil.setClear( clearValue );

		// draw into the stencil buffer

		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		// unlock color and depth buffer for subsequent rendering

		state.buffers.color.setLocked( false );
		state.buffers.depth.setLocked( false );

		// only render where stencil is set to 1

		state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );

	}

} );


THREE.ClearMaskPass = function () {

	THREE.Pass.call( this );

	this.needsSwap = false;

};

THREE.ClearMaskPass.prototype = Object.create( THREE.Pass.prototype );

Object.assign( THREE.ClearMaskPass.prototype, {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		renderer.state.buffers.stencil.setTest( false );

	}

} );

},{}],58:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

	this.clear = true;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.RenderPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		this.scene.overrideMaterial = this.overrideMaterial;

		var oldClearColor, oldClearAlpha;

		if ( this.clearColor ) {

			oldClearColor = renderer.getClearColor().getHex();
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( oldClearColor, oldClearAlpha );

		}

		this.scene.overrideMaterial = null;
		renderer.autoClear = oldAutoClear;
	}

} );

},{}],59:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

},{}],60:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.TexturePass = function ( map, opacity ) {

	THREE.Pass.call( this );

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.TexturePass relies on THREE.CopyShader" );

	var shader = THREE.CopyShader;

	this.map = map;
	this.opacity = ( opacity !== undefined ) ? opacity : 1.0;

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		depthTest: false,
		depthWrite: false

	} );

	this.needsSwap = false;

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.TexturePass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.TexturePass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		this.quad.material = this.material;

		this.uniforms[ "opacity" ].value = this.opacity;
		this.uniforms[ "tDiffuse" ].value = this.map;
		this.material.transparent = ( this.opacity < 1.0 );

		renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

		renderer.autoClear = oldAutoClear;
	}

} );

},{}],61:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity":  { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};

},{}],62:[function(require,module,exports){
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.HorizontalBlurShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"h":        { value: 1.0 / 512.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float h;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};

},{}],63:[function(require,module,exports){
/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.VerticalBlurShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"v":        { value: 1.0 / 512.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float v;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};

},{}],64:[function(require,module,exports){


exports.drawCharacter = function drawCharacter( cluster, pos, v, c, font ) {
    var pchar;
    if( pchar = font.characters[c] ) {
        var data  = pchar.data;
		// background may have an alpha value -
		// but we should still assume that black is transparent...
		var size = pchar.sz;
		var width = pchar.w;
		if( ( font.flags & 3 ) == 0/*FONT_FLAG_MONO*/ )
		{
			var CharDatax = CharData1;
			var inc = Math.floor( (pchar.sz+7)/8 );
		}
		else if( ( font.flags & 3 ) == 1/*FONT_FLAG_2BIT*/ )
		{
			var CharDatax = CharData2;
			var inc = Math.floor((pchar.sz+3)/4);
		}
		else if( ( font.flags & 3 ) == 3 || ( font.flags & 3 )  == 2 )
		{
			var CharDatax = CharData8;
			var inc = (char.sz);
		}

        if( ( font.flags & 3 ) == 0 ) {
            return drawMonoChar( cluster, pos, v, pchar, font, CharDatax, inc );
        }
    }
}

//---------------------------------------------------------------------------
function CharData8( bits, ofs, bit ) { return bits[ofs+bit]; }
//---------------------------------------------------------------------------
function CharData2( bits, ofs, bit ) { return (bits[ofs+bit>>2] >> (2*(bit&3)))&3; }
//---------------------------------------------------------------------------
function CharData1( bits, ofs, bit ) { return (bits[ofs+(bit>>3)] >> (bit&7))&1; }


function drawMonoChar( cluster, pos, v, pchar, font, CharDatax, inc ) {
    var line_target;
    var y = pos.y + ( font.baseline + pchar.asc );
    var x = pos.x + ( pchar.ofs );
    var line = 0;//UseFont.baseline - pchar.ascent;
    var dOfs = 0;
    var line_target =  pchar.asc - pchar.dsc;//(UseFont.baseline - pchar.asc) + ( UseFont.baseline - pchar.descent );
    var data  = pchar.data;
    var size = pchar.sz;
    for(;
         line <= line_target;
         line++ )
    {
        for( var bit = 0; bit < size; bit++ )
        {
            var chardata = CharDatax( data, dOfs, bit );
            if( chardata )
                cluster.setCube( x + bit, y - line, 0, v );
        }
        dOfs += inc;
    }
    return pchar.w;
}

},{}],65:[function(require,module,exports){


var currentRef;
var currentAddRef;

var selector = Voxelarium.selector = {

    get currentVoxel () {
        return currentRef;
    },
    set currentVoxel (ref) {
        currentRef = ref;
    },
    get currentAddVoxel () {
        return currentAddRef;
    },
    set currentAddVoxel (ref) {
        currentAddRef = ref;
    },
    material : new THREE.LineBasicMaterial({ color:'white'
        ,vertexColors: THREE.VertexColors
        ,linewidth:1 /* windows == 1 always */
        }),
    geometry : new THREE.Geometry(),
    mesh : null,
    meshGlow : null,
};
selector.material.depthWrite = false;
selector.material.depthTest = false;

selector.mesh = new THREE.LineSegments( selector.geometry, selector.material );
selector.meshGlow = new THREE.LineSegments( selector.geometry, selector.material );


Voxelarium.selector.update = function() {
    var color = new THREE.Color( 0.8, 0, 0 );
    var unit = currentRef?currentRef.cluster.voxelUnitSize:10;
    var x = 0
    var y = 0
    var z = 0
    var geometry = selector.geometry;
    geometry.vertices.length = 0;
    geometry.colors.length = 0;
    for( var n = 0; n < 2; n++ ) {
        if( n == 0 ) {
            if( !currentRef )
            {
                //return;
              }
              else {
                unit = currentRef.cluster.voxelUnitSize;
                x = currentRef.wx * unit
                y = currentRef.wy * unit
                z = currentRef.wz * unit
              }
          }else{
              //color.delete();
              color = new THREE.Color( 0, 0.8, 0 );
              if( !currentAddRef )
              {
                  //return;
                }
                else {
                  x = currentAddRef.wx * unit
                  y = currentAddRef.wy * unit
                  z = currentAddRef.wz * unit
                }

          }
    var P = [new THREE.Vector3( x, y, z )
        , new THREE.Vector3( x + unit, y, z )
        , new THREE.Vector3( x, y + unit, z )
        , new THREE.Vector3( x + unit, y + unit, z )
        , new THREE.Vector3( x, y, z + unit )
        , new THREE.Vector3( x + unit, y, z + unit )
        , new THREE.Vector3( x, y + unit, z + unit )
        , new THREE.Vector3( x + unit, y + unit, z + unit )
        ]
    geometry.colors.push( color );
    geometry.vertices.push( P[0] );
    geometry.colors.push( color );
    geometry.vertices.push( P[1] );
    geometry.colors.push( color );
    geometry.vertices.push( P[1] );
    geometry.colors.push( color );
    geometry.vertices.push( P[3] );
    geometry.colors.push( color );
    geometry.vertices.push( P[3] );
    geometry.colors.push( color );
    geometry.vertices.push( P[2] );
    geometry.colors.push( color );
    geometry.vertices.push( P[2] );
    geometry.colors.push( color );
    geometry.vertices.push( P[0] );

    geometry.colors.push( color );
    geometry.vertices.push( P[4] );
    geometry.colors.push( color );
    geometry.vertices.push( P[5] );
    geometry.colors.push( color );
    geometry.vertices.push( P[5] );
    geometry.colors.push( color );
    geometry.vertices.push( P[7] );
    geometry.colors.push( color );
    geometry.vertices.push( P[7] );
    geometry.colors.push( color );
    geometry.vertices.push( P[6] );
    geometry.colors.push( color );
    geometry.vertices.push( P[6] );
    geometry.colors.push( color );
    geometry.vertices.push( P[4] );

    geometry.colors.push( color );
    geometry.vertices.push( P[0] );
    geometry.colors.push( color );
    geometry.vertices.push( P[4] );
    geometry.colors.push( color );
    geometry.vertices.push( P[1] );
    geometry.colors.push( color );
    geometry.vertices.push( P[5] );
    geometry.colors.push( color );
    geometry.vertices.push( P[2] );
    geometry.colors.push( color );
    geometry.vertices.push( P[6] );
    geometry.colors.push( color );
    geometry.vertices.push( P[3] );
    geometry.colors.push( color );
    geometry.vertices.push( P[7] );

    }
    //color.delete();
    geometry.computeBoundingSphere();
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
}

},{}],66:[function(require,module,exports){
"use strict";

var types = Voxelarium.Voxels;

var keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40
	, A:65, S:83, D:68, W:87, SPACE:32, C:67
    , I : 73, ESCAPE : 27 };


function InventoryItem ( voxelType ) {
    var item = {
        voxelType : voxelType,  // voxel type
        THREE_solid : null,
        geometry : Voxelarium.Settings.use_basic_material
					? Voxelarium.GeometryBasicBuffer()
					: Voxelarium.GeometryBuffer() ,

    }
    item.geometry.makeVoxCube( 0.25, voxelType );

    return item;
}

Voxelarium.Inventory = function( geometryShader,domElement ) {
    var domElement = ( domElement !== undefined ) ? domElement : document;
    var inventory = {
         raycaster : new THREE.Raycaster(),
        items : [],
        enabled : false,
        build_vertical : true,
        THREE_solid : new THREE.Object3D(),
         x_max : 15, y_max : 12,
         x_inc : 0.75, y_inc : 0.75,
         mouseRay : { n : THREE.Vector3Zero.clone(), o: new THREE.Vector3().delete() },
         last_intersects : null,
         deactivates : [],
         //mouseClock : new THREE.Clock();

        updatePositions : function() {
            var x = 0, y = 0;
            inventory.items.forEach( (item)=>{
                if( y >= this.y_max || x >= this.x_max ) {
                    item.THREE_solid.visible = false;
                  return;
                }
                item.THREE_solid.visible = true;
                item.THREE_solid.matrix.origin.set( x, y, 0 );
                if( this.build_vertical ) {
                    y += this.y_inc;
                    if( y >= this.y_max ) {
                      y = 0;
                      x += this.x_inc;
                    }
                }else {
                    x += this.x_inc;
                    if( x >= this.x_max ) {
                      x = 0;
                      y += this.y_inc;
                    }
                }
            })
        },
        activate : function(  inactiveCallback ) {
            domElement.addEventListener( 'contextmenu', ignore, false );
        	domElement.addEventListener( 'mousedown', onMouseDown, false );
        	domElement.addEventListener( 'mousewheel', onMouseWheel, false );
            domElement.addEventListener( 'mousemove', onMouseMove, false );
            domElement.addEventListener( 'mouseup', onMouseUp, false );
            window.addEventListener( 'keydown', onKeyDown, false );
            window.addEventListener( 'keyup', onKeyUp, false );
            inventory.THREE_solid.visible = true;
            inventory.enabled = true;
            if( inactiveCallback )
                inventory.deactivates.push( inactiveCallback )
        },
        deactivate : function( ) {
            domElement.removeEventListener( 'contextmenu', ignore, false );
            domElement.removeEventListener( 'mousedown', onMouseDown, false );
            domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
            //domElement.removeEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
            domElement.removeEventListener( 'mousemove', onMouseMove, false );
            domElement.removeEventListener( 'mouseup', onMouseUp, false );
            window.removeEventListener( 'keydown', onKeyDown, false );
            window.removeEventListener( 'keyup', onKeyUp, false );

            inventory.THREE_solid.visible = false;
            inventory.enabled = false;
            if( inventory.deactivates.length ) {
                inventory.deactivates.forEach( (cb)=>cb() );
                inventory.deactivates.length = 0;
            }

        },
        animate : function( camera, tick ) {
            if( !camera )return;
            if( !inventory.enabled) return;
            var o;
			var inventoryO;
            var f;

            ( inventoryO = this.THREE_solid.matrix.origin/*position*/  ).copy( camera.matrix.origin );
            //f = camera.matrix.forward

			o = inventory.raycaster.ray.origin.clone();
			f = inventory.raycaster.ray.direction;

            o.addScaledVector( f, 11 );

			var tmpdel = f.dot( camera.matrix.forward.delete() );
			inventoryO.addScaledVector( camera.matrix.forward.delete(),  11 / tmpdel );

            var m = this.THREE_solid.matrix;
            var away = camera.matrix.origin.clone().addScaledVector( o, 2 )
            m.lookAt( o, camera.matrix.origin, camera.matrix.up )
            m.rotateOrtho( Math.PI, 0, 2 );
            //var d = camera.matrix.down;
            inventoryO.addScaledVector( m.down.delete(), (this.y_max-this.y_inc)/2 );
            inventoryO.addScaledVector( m.right.delete(), (this.x_max-this.x_inc)/2 );


			//inventoryO.copy( o );

            this.THREE_solid.matrixWorldNeedsUpdate = true;

            inventory.last_intersects = inventory.raycaster.intersectObjects( inventory.THREE_solid.children );
            inventory.selector.currentVoxel = null;
            for ( var i = 0; i < inventory.last_intersects.length; i++ ) {
                if( inventory.last_intersects[i].object !== inventory.selector.THREE_solid ) {
                    inventory.selector.currentVoxel = inventory.last_intersects[i];
                    break;
                }
                //inventory.selector.currentVoxel = intersects[i];
                //inventory.selector.currentVoxel = intersects[i].object.item
                //intersects[ i ].object.material.color.set( 0xff0000 );

            }
            var obj;
            if( inventory.selector.currentVoxel ) {
                obj = inventory.selector.currentVoxel.object;
                obj.matrix.motion.rotation.x = 0.50;
                obj.matrix.motion.rotation.y = 1.50;
                obj.matrix.motion.rotation.z = 2.30;
                //obj.matrix.motion.torque.x = 0.25;
                obj.matrix.move(tick);
                obj.matrixWorldNeedsUpdate = true;

            }
            updateSelector();
            //if( inventory.selector.currentVoxel )
            //    inventory.selector.currentVoxel.object.visible = false;
            //for ( var i = 0; i < inventory.last_intersects.length; i++ ) {
                //console.log( inventory.last_intersects[i])
        		//intersects[ i ].object.material.color.set( 0xff0000 );

        	//}
        }
    }
    types.types.forEach( (voxel)=>{
        var item;
        inventory.items.push( item = InventoryItem( voxel ) );
        inventory.THREE_solid.add( item.THREE_solid = new THREE.Mesh( item.geometry.geometry, geometryShader ) );
        item.THREE_solid.frustumCulled = false;
        item.THREE_solid.item = item;
        item.THREE_solid.matrixAutoUpdate = false;
    })
    inventory.updatePositions();
    inventory.THREE_solid.matrixAutoUpdate = false;
    inventory.THREE_solid.visible = false;
    var currentRef;
    var currentAddRef;

    inventory.selector = {

        get currentVoxel () {
            return currentRef;
        },
        set currentVoxel (ref) {
            currentRef = ref;
        },
        get currentAddVoxel () {
            return currentAddRef;
        },
        set currentAddVoxel (ref) {
            currentAddRef = ref;
        },
        material : new THREE.LineBasicMaterial({ color:'white'
            //,vertexColors: THREE.VertexColors
            ,linewidth:1 /* windows == 1 always */
            }),
        geometry : new THREE.Geometry(),
        THREE_solid : null,
        meshGlow : null,
    };
    inventory.selector.material.depthWrite = false;
    inventory.selector.material.depthTest = false;

    inventory.selector.THREE_solid = new THREE.LineSegments( inventory.selector.geometry, inventory.selector.material );
    inventory.selector.meshGlow = new THREE.LineSegments( inventory.selector.geometry, inventory.selector.material );
    inventory.selector.THREE_solid.frustumCulled = false;

    inventory.THREE_solid.add( inventory.selector.THREE_solid );


    function updateSelector() {
        var color = new THREE.Color( 0.8, 0, 0 );
        var unit = 0.8;
        var x = 0
        var y = 0
        var z = 0
        var geometry = inventory.selector.geometry;
        geometry.vertices.length = 0;
        geometry.colors.length = 0;
        if( !currentRef ){
            geometry.computeBoundingSphere();
            geometry.verticesNeedUpdate = true;
            geometry.colorsNeedUpdate = true;

            return;
        }
        var origin = currentRef.object.matrix.origin;
        //console.log( `inventory at ${origin.x} ${origin.y} ${origin.z}`)
        for( var n = 0; n < 1; n++ ) {
            x = origin.x  - unit/2 - 0.1
            y = origin.y  - unit/2 - 0.1
            z = origin.z  - unit/2 - 0.1
          unit += 0.2;
        var P = [new THREE.Vector3( x, y, z )
            , new THREE.Vector3( x + unit, y, z )
            , new THREE.Vector3( x, y + unit, z )
            , new THREE.Vector3( x + unit, y + unit, z )
            , new THREE.Vector3( x, y, z + unit )
            , new THREE.Vector3( x + unit, y, z + unit )
            , new THREE.Vector3( x, y + unit, z + unit )
            , new THREE.Vector3( x + unit, y + unit, z + unit )
            ]
        geometry.colors.push( color );
        geometry.vertices.push( P[0] );
        geometry.colors.push( color );
        geometry.vertices.push( P[1] );
        geometry.colors.push( color );
        geometry.vertices.push( P[1] );
        geometry.colors.push( color );
        geometry.vertices.push( P[3] );
        geometry.colors.push( color );
        geometry.vertices.push( P[3] );
        geometry.colors.push( color );
        geometry.vertices.push( P[2] );
        geometry.colors.push( color );
        geometry.vertices.push( P[2] );
        geometry.colors.push( color );
        geometry.vertices.push( P[0] );

        geometry.colors.push( color );
        geometry.vertices.push( P[4] );
        geometry.colors.push( color );
        geometry.vertices.push( P[5] );
        geometry.colors.push( color );
        geometry.vertices.push( P[5] );
        geometry.colors.push( color );
        geometry.vertices.push( P[7] );
        geometry.colors.push( color );
        geometry.vertices.push( P[7] );
        geometry.colors.push( color );
        geometry.vertices.push( P[6] );
        geometry.colors.push( color );
        geometry.vertices.push( P[6] );
        geometry.colors.push( color );
        geometry.vertices.push( P[4] );

        geometry.colors.push( color );
        geometry.vertices.push( P[0] );
        geometry.colors.push( color );
        geometry.vertices.push( P[4] );
        geometry.colors.push( color );
        geometry.vertices.push( P[1] );
        geometry.colors.push( color );
        geometry.vertices.push( P[5] );
        geometry.colors.push( color );
        geometry.vertices.push( P[2] );
        geometry.colors.push( color );
        geometry.vertices.push( P[6] );
        geometry.colors.push( color );
        geometry.vertices.push( P[3] );
        geometry.colors.push( color );
        geometry.vertices.push( P[7] );

        }
        //color.delete();
        geometry.computeBoundingSphere();
        geometry.verticesNeedUpdate = true;
        geometry.colorsNeedUpdate = true;
    }


    return inventory;


     function setMouseRay( camera, e ) {
        var rect = domElement.getBoundingClientRect();
        const w = rect.right-rect.left;//window.innerWidth;
        const h = rect.bottom-rect.top;//window.innerHeight;
        var x = (((e.clientX-rect.left)-(w/2.0))/w) * 2;
        var y = (((e.clientY-rect.top)-(h/2.0))/h) * 2;
        //console.log( `mouse at ${x}, ${y}` )

        inventory.raycaster.setFromCamera( {x:x,y:-y}, camera );

    }


      function onMouseDown(event) {
          if ( inventory.enabled === false ) return;
          event.preventDefault();
          if( inventory.selector.currentVoxel ) {
              controlGame.setCurrentType( inventory.selector.currentVoxel.object.item.voxelType );

              inventory.deactivate();
          }
          //inventory.last_intersects = inventory.raycaster.intersectObjects( inventory.THREE_solid.children );
          for ( var i = 0; i < inventory.last_intersects.length; i++ ) {
              if( inventory.last_intersects[i].object !== inventory.selector.THREE_solid ) {
                  inventory.selector.currentVoxel = inventory.last_intersects[i];
                  break;
              }
              //inventory.selector.currentVoxel = intersects[i];
              //inventory.selector.currentVoxel = intersects[i].object.item
              //intersects[ i ].object.material.color.set( 0xff0000 );

          }

      }

      function onMouseUp(event) {
          if ( inventory.enabled === false ) return;
          event.preventDefault();
      }

        function onMouseMove( event ) {
        	if ( inventory.enabled === false ) return;
        	event.preventDefault();
            setMouseRay( camera, event );
        }

        function onMouseWheel( event ) {
            event.preventDefault();
            mouseScrollX += event.wheelDeltaX;
            mouseScrollY += event.wheelDeltaY;
        }

      function ignore(event) {
          event.preventDefault();
      }

      function onKeyDown( event ) {


      	switch ( event.keyCode ) {
            case keys.ESCAPE:
      		case keys.I:
      			inventory.deactivate();
      			break;
      	}

      }

      function onKeyUp( event ) {

      	switch ( event.keyCode ) {
      	}
      }


}

},{}],67:[function(require,module,exports){

//var Gun = require( "gun" );
var Gun = require( "../node_modules/gun/gun.js" );

var db = {};
Voxelarium.db = db;

//Voxelarium.db = db;

//global = Gun({prefix: 'global/', peers: ['https://localhost:8080/gun']})
//local = Gun({prefix: 'local/'}).


db.globalDb = Gun( {prefix: 'global/', peers: [`ws://${location.host}/gun`]} ).get( "Voxelarium" );
//db.globalDb = Gun( location.origin + '/gun' ).get( "Voxelarium" );
//db.globalDb = Gun( {prefix: 'global/', peers: [`https://${location.origin}/gun`]} ).get( "Voxelarium" );
db.localDb = Gun( {prefix: 'local/'}).get( "org.d3x0r.voxelarium.local" );
//db.localDb = db.globalDb.path( "local" );

db.world = {
    db : null, //db.globalDb
    cluster : null,
    loadSector : loadSector,
    storeSector : storeSector,
    getPath : getPath,
    listeners : [],
}

db.player = { local: db.localDb.path( "player" )
        , global : null // have to wait for player ID before
        , _quat: new THREE.Quaternion()
        , _origin : new THREE.Vector3()
        , quat: new THREE.Quaternion()
        , origin : new THREE.Vector3()
        , positionUpdate : false
        , inventory : []
        , id : null
        , world_id : null
    }

function sectorUpdated( sector, stuff ) {
  var x, y, z;
  var base_x = ( sector.pos.x >> 2 ) * 4;
  var base_y = ( sector.pos.y >> 2 ) * 4;
  var base_z = ( sector.pos.z >> 2 ) * 4;
  console.log( "Got sector update event", stuff)
  for( x = 0; x <= 3; x++ )
    for( y = 0; y <= 3; y++ )
      for( z = 0; z <= 3; z++ ) {
        var key = `${x}${y}${z}`
        var val;
        if( val = stuff[key] ) {
          var sector = db.world.cluster.getSector( base_x + x, base_y + y, base_z + z, true )
          if( sector )
            if( sector.cachedString !== val ) {
              console.log( "new sector string - need decode.")
              sector.decode( val )
            }
        }
      }

}

function addListener( sector ) {
  var where = getZonePath(sector);
  if( db.world.listeners.findIndex( (val)=>where===val ) < 0 ) {
    db.world.listeners.push( where );
    db.world.db.path( where ).on( (data)=>{ sectorUpdated(sector,data) }, { delta: true } )
    return false;
  }
}
function getZonePath( sector ) {
  return `sector.${sector.pos.x>>2}.${sector.pos.y>>2}.${sector.pos.z>>2}`
}
function getPath( sector ) {
  return `${getZonePath(sector)}.${sector.pos.x&3}${sector.pos.y&3}${sector.pos.z&3}`
}
//db.player = db.globalDb.get( "player" );

function playerPositionChange( data ) {
    var lastq = db.player.quat
    var q = db.player._quat.set( data.qx,data.qy,data.qz,data.qw)
    var lasto = db.player.origin
    var o = db.player._origin.set( data.ox, data.oy, data.oz );
    if( q.x != lastq.x ||
        q.y != lastq.y ||
        q.z != lastq.z ||
        q.w != lastq.w
    ) {
        var a = ( q.x - lastq.x );
        var b = ( q.y - lastq.y );
        var c = ( q.z - lastq.z );

        if( a*a+b*b+c*c > 0.001 )
        {
            db.player.positionUpdate = true; // skip next animate update
            Voxelarium.camera.matrix.makeRotationFromQuaternion( db.player._quat );
            Voxelarium.camera.matrixWorldNeedsUpdate = true;
        }
    }
    if( o.x != lasto.x ||
        o.y != lasto.y ||
        o.z != lasto.z
            ) {
        var a = ( o.x - lasto.x );
        var b = ( o.y - lasto.y );
        var c = ( o.z - lasto.z );

        if( a*a+b*b+c*c > 0.001 )
        {
            db.player.positionUpdate = true; // skip next animate update
            Voxelarium.camera.position.copy( o );
            Voxelarium.camera.matrixWorldNeedsUpdate = true;
        }
    }
    //console.log( "data : ", data);
}


function setupEvents( cb ) {
    //db.player.local.path("position").on( playerPositionChange );
    db.player.global.path("position").on( playerPositionChange );
    loadWorld( cb );
}

function loadVoxels(cb, val){
  var count = val.voxelTypeCount;
  //console.log( "have " , count )
  db.world.voxelInfo.path( "voxelTypes" ).map( (data,field)=>{
      var t = Voxelarium.Voxels.types[Number(field)];
      if( t ) return;
      //console.log( "reloading ", field, data.ID)
      t = Voxelarium.Voxels.types[data.ID] = eval( data.code );

      if( data.texture ) {
        count++;
        ( t.image = new Image() ).src = t.textureData = data.texture;

          t.image.onload = ()=> {
             //console.log( "Wait until load to setup coords")
             t.textureCoords = Voxelarium.TextureAtlas.add( t.image )
             //console.log( "pending ", count );
             if( !--count ) { console.log( "ZERO!" ); cb(); }
          }

      }
      if( !--count ) cb();
  });
}


function initialVoxelTypeLoad(branch,cb) {
    console.log( "Loading initial voxels...")
    Voxelarium.Voxels.load( ()=>{
        var voxelTypes = {};
        var n = 0;
        Voxelarium.Voxels.types.forEach( (type)=>{
            if( !type.ID ) return;
            n++;
            voxelTypes[ type.ID ] = { ID:type.ID, code: type.codeData, texture : type.textureData};
        });
        branch.put( { voxelTypes : voxelTypes, voxelTypeCount : n } );
        cb();
    });
}

function loadWorld( cb ) {
    ( db.world.voxelInfo = db.world.db.path( "voxelInfo" ) )
        .not( function(){
          console.log( "No VoxelInfo; load default");
            initialVoxelTypeLoad(db.world.voxelInfo,cb)
         }).val( (val)=>{
            console.log( "skip a beat and load the voxels....")
           setTimeout(
               ()=>{ loadVoxels(cb,val) }
             )
        } );
}

function doDefaultInit( data ) {
    if( !db.player.id ) {
        console.log( "do default init... pick a player ID and give him an initial world_id")
        db.player.id = new Date().getTime();
        db.player.world_id = 0;
        console.log( "put local.id=player.id")
        db.player.local.path("id").put( db.player.id )
        console.log( "put local.world_id=player.world_id")
        db.player.local.path("world_id").put( db.player.world_id )
        console.log( "done putting world_id")
    }else {
        console.log( "skipped redundant init")
    }
    // the val() in init will fire here; so global gets initialized in normal path...
}

function doDefaultInitTrigger() {
    console.log( "put init=true")
	  db.player.local.path( "init" ).put( true );
    console.log( "local put init has finished for inital Db Kick;" );
}

function doDefaultGlobalInitTrigger() {
    console.log( " kick global?")
    db.player.global.path( "init" ).put( true );
    console.log( "global put init has finished for inital Db Kick")

}

function playerConnect( val, field ) {
  console.log( "player has connected", val, field );
}

var defaultTimeout;
var defaultGlobalTimeout;
db.init = function( cb ) {
    // defaultTimeout = setTimeout( doDefaultInitTrigger, 250 );
    db.player.local.path("id").not( doDefaultInit ).val( (data)=>{
        console.log( "value is ", data)
        //clearTimeout( defaultTimeout );
        db.player.id = data;
        db.globalDb.path( "player" ).map( playerConnect );
        db.player.global = db.globalDb.path( "player" ).path( data );
        console.log( "going to request world_id...")
        db.player.local.path("world_id").val( (data)=> {
            console.log( "received world_id")
          db.player.world_id = data;
          db.world.db = db.globalDb.path( "world" ).path( db.player.world_id );
          db.player.global.map().val( playerConnect );
          db.player.global.path("position").on( playerPositionChange );
          loadWorld( cb );
        } );
        console.log( "requested world id - done with val callback")
    })
    //db.player.local.path("id").put( new Date().getTime() )
}

db.animate = function() {
    //db.player.put( {position:Voxelarium.camera.position} )
    if( !db.player.global )
        return;
    var m = Voxelarium.camera.matrix;
    var oldq = db.player._quat
    var newq = db.player.quat.setFromRotationMatrix( m );
    var oldo = db.player._origin
    var newo = db.player.origin.copy( m.origin );


    if( oldq.x !== newq.x ||
        oldq.y !== newq.y ||
        oldq.z !== newq.z ||
        oldq.w !== newq.w ||
        oldo.x !== newo.x ||
        oldo.y !== newo.y ||
        oldo.z !== newo.z )
    {
        var a = ( oldo.x - newo.x );
        var b = ( oldo.y - newo.y );
        var c = ( oldo.z - newo.z );

        var d = ( oldq.x - newq.x );
        var e = ( oldq.y - newq.y );
        var f = ( oldq.z - newq.z );
        var g = ( oldq.w - newq.w );
        //console.log( `a is ${a*a+b*b+c*c}  b is ${d*d+e*e+f*f+g*g}`)
        if( ( a*a+b*b+c*c > 0.001 )
            ||( d*d+e*e+f*f+g*g > 0.001 ) )
        {
            var pos_msg = {qx:newq.x,qy:newq.y,qz:newq.z,qw:newq.w
                            ,ox:m.origin.x,oy:m.origin.y,oz:m.origin.z}
            //console.log( "put", pos_msg )
            //db.player.local.path( "position").put( pos_msg )
            db.player.global.path( "position").put( pos_msg )
            oldq.copy( newq );
            oldo.copy( newo );
        }
    }
}


function storeSector( sector ) {
    if( !db.world.cluster )
      db.world.cluster = sector.cluster;
    addListener( sector );
    //console.log( "put sector update " )
    var string;
      this.db.path(getPath(sector)).put( string = sector.stringify() );
      console.log( "put-ed sector update ", string )
}

function loadSector( sector ) {
      addListener( sector );
      //this.db.path(getPath(sector)).on( cb );
}

//gun.get( `org.d3x0r.voxelarium.universe.${universe}.player.${self}`)

},{"../node_modules/gun/gun.js":11}],68:[function(require,module,exports){

Voxelarium.Voxels = {
	types : [],
	add : function( type, properties,reaction ) {
        	//this.types.push(
						this[type] = {
						 ID : this.types.length
                		, name : type
                		, properties : properties
				, reaction : reaction
			 	, createVoxelExtension : null
				, deleteVoxelExtension : null
				, textureCoords : {}
				, image : null
				, texture : null
				, codeData : null
				, textureData : null
			}
		  //);
			if( typeof properties.DrawInfo === "undefined" )
				properties.DrawInfo = Voxelarium.ZVOXEL_DRAWINFO_DRAWFULLVOXELOPACITY;
			return this[type];
		}
/*
Is_PlayerCanPassThrough = false;
Draw_TransparentRendering = false;
Draw_FullVoxelOpacity = true;
DrawInfo = VoxelGlobalSettings.ZVOXEL_DRAWINFO_DRAWFULLVOXELOPACITY;
ExtensionType = 0;
Is_VoxelExtension = false;
Is_HasAllocatedMemoryExtension = false;
MiningHardness = 1000.0f;
MiningType = 2;
Is_NoType = false;
Is_UserTypeTransformable = true;
Is_Harming = false;
FrictionCoef = 0.001;
Grip_Horizontal = 0.9;
Grip_Vertical = 0.0;
Is_SpaceGripType = false;
Is_KeepControlOnJumping = true;
HarmingLifePointsPerSecond = 0.0;
Is_Active = false;
Is_CanBeReplacedBy_Water = false;
Is_CanBeReplacedBy_GreenAcid = false;
Is_CanBeReplacedBy_MustardGaz = false;
Is_CombinableWith_GreenAcid = true;
Is_CanTriggerBomb = false;
Is_Liquid = false;
Is_Gaz = false;
Is_Interface_StoreBlock = false;
Is_Interface_PushBlock = false;
Is_Interface_PullBlock = false;
Is_Interface_GetInfo = false;
Is_Interface_SetInfo = false;
Is_Pumpable_ByPump_T1 = false;
Is_Pumpable_ByPump_T2 = false;
Is_Loadable_ByLoader_L1 = true;
BvProp_MoveableByTreadmill = true;
BvProp_FastMoving = false;
Is_Rideable = false;
Is_HasHelpingMessage = false;
BvProp_CanBePickedUpByRobot = true;
BvProp_XrRobotPickMinLevel = 1;
BvProp_PrRobotReplaceMinLevel = 0;
BvProp_PrRobotPickMinLevel = 0;
BvProp_PrRobotMoveMinLevel = 0;
BvProp_AtomicFireResistant = false;
BvProp_EgmyT1Resistant = false;
LiquidDensity = 0.0;
BlastResistance = 1;
FabInfo = null;
Documentation_PageNum = 0;
*/

}

Voxelarium.Voxels.types.push(
Voxelarium.Voxels.add( "Void", {
      Is_PlayerCanPassThrough : true,
      Draw_TransparentRendering : false,
      Draw_FullVoxelOpacity : false,
      DrawInfo : Voxelarium.ZVOXEL_DRAWINFO_VOID,
      Is_Harming : false,
      FrictionCoef : 0.0001,
      Grip_Vertical : 0.0,
      Grip_Horizontal : 0.8,
      Is_SpaceGripType : false,
      Is_KeepControlOnJumping : true,
      Is_Active : false,
      Is_CanBeReplacedBy_Water : true,
      Is_CombinableWith_GreenAcid : false,
      Is_CanBeReplacedBy_GreenAcid : true,
      Is_CanBeReplacedBy_MustardGaz : true,
      BvProp_CanBePickedUpByRobot : false,
      BvProp_XrRobotPickMinLevel : 255,
      BvProp_PrRobotReplaceMinLevel : 0,
      BvProp_PrRobotPickMinLevel : 255,
      BvProp_PrRobotMoveMinLevel : 0,
      BvProp_AtomicFireResistant : true,
      Is_Liquid : false,
      Is_Gaz : true,
      Is_Loadable_ByLoader_L1 : false,
      BvProp_MoveableByTreadmill : false,
      BvProp_EgmyT1Resistant : false,
      LiquidDensity : 0.0,
} ) );

Voxelarium.Voxels.getIndex = function( type ) {
	var types = Voxelarium.Voxels.types;
	return types.findIndex( (v)=>v === type );
}

var xhrObj;
Voxelarium.Voxels.load = function( cb ) {
	var n = 1
	xhrObj = new XMLHttpRequest();
	//var xhrObj2 = new XMLHttpRequest();
	loadAVoxel( n, cb );
}

function loadAVoxel( n, cb ) {
	{
		try {
			xhrObj.open('GET', `./src/voxels/voxel_${n}.js`);
			//xhrObj.responseType = "text";
			//xhrObj.response = "";
			xhrObj.send(null);
			xhrObj.onerror = (err)=>{
				  //console.log( "require ", n );
		      //console.log( err );
					cb();
					return;
			};
			xhrObj.onload = ()=>{
				if( !xhrObj.status || xhrObj.status === 200 ) {
					//console.log( "load ", n)
					Voxelarium.Voxels.types.push( eval(xhrObj.responseText) );
					var t = Voxelarium.Voxels.types[n];

					t.codeData = xhrObj.responseText;
					xhrObj.open('GET', `./src/voxels/images/voxel_${n}.png`);
					xhrObj.onerror = (err)=>{
						 console.log( "error:", err);
				     loadAVoxel( n+1, cb );
				  }
					xhrObj.send(null);
					xhrObj.onload = ()=>{
						if( xhrObj.responseText.length > 0 ) {
							( t.image = new Image() ).src = xhrObj.responseText;
							t.textureData = xhrObj.response;
							t.image.onerror = (err)=>{ console.log( "image load error?", err)}
							//console.log( t );
							if( true || !t.image.width )
							{
								t.image.onload = ()=> {
									 //console.log( "Waited until load to setup coords", t)
								   t.textureCoords = Voxelarium.TextureAtlas.add( t.image )
							  }
							} else {
								//console.log( "don't have to delay load?")
							  //t.textureCoords = Voxelarium.TextureAtlas.add( t.image )
						  }
						}
						loadAVoxel( n+1, cb );
					}
				}
				else {
					console.log( "All completed... out of loadables...")
					cb();
				}
			}
			//require( `./voxels/voxel_${n}.js` )
		}
		catch( err ) {
			console.log( "require ", n );
	        	console.log( err );
				cb();
		}
	}

}

//Voxelarium.Voxels.types[0] = Voxelarium.Voxels.types.Void;
//Voxelarium.Voxels.types[1] = Voxelarium.Voxels.types["BlackRock Blue"];

},{}],69:[function(require,module,exports){

require( "./cluster.js")
var fonts = require( "./voxel.fonts.js" );

Voxelarium.World = function() {
    return {
        clusters : [],

        createCluster : function( mesher, voxelUnitSize ) {
            var cluster = Voxelarium.Cluster(32,32,32);
            cluster.mesher = mesher;
            cluster.voxelUnitSize = voxelUnitSize || 20;
            cluster.getGeometryBuffer = Voxelarium.Settings.use_basic_material
                ? Voxelarium.GeometryBasicBuffer
                : Voxelarium.GeometryBuffer;
            this.clusters.push( cluster );
            return cluster;
        },

        createTextCluster : function( text, v, mesher, font, voxelUnitSize ) {
            var cluster = Voxelarium.Cluster(256*8,8,1);
            cluster.mesher = mesher;
            cluster.voxelUnitSize = voxelUnitSize || 20;
            cluster.getGeometryBuffer = Voxelarium.GeometryBufferMono;
            this.clusters.push( cluster );
            //var sector = cluster.createSector( 0, 0, 0 );
            var pos = { x:0, y:0};

            for( var n = 0; n < text.length; n++ ) {
                var ch = text.codePointAt(n);

                var w = fonts.drawCharacter( cluster, pos, v, ch, font )
                pos.x += w;
            }


            return cluster;
        }
    }
}

},{"./cluster.js":38,"./voxel.fonts.js":64}],70:[function(require,module,exports){
/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError ) {

	var scope = this;

	var vrDisplay, vrDisplays;

	var standingMatrix = new THREE.Matrix4();

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'VR input not available.' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays );

	}

  this.roomOrigin = new THREE.Vector3();

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	// If true will use "standing space" coordinate system where y=0 is the
	// floor and x=0, z=0 is the center of the room.
	this.standing = false;

	// Distance from the users eyes to the floor in meters. Used when
	// standing=true but the VRDisplay doesn't provide stageParameters.
	this.userHeight = 1.6;

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.setVRDisplay = function ( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function () {

		console.warn( 'THREE.VRControls: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

	this.getStandingMatrix = function () {

		return standingMatrix;

	};

	this.update = function () {

		if ( vrDisplay ) {

			var pose;

			if ( vrDisplay.getFrameData ) {

				vrDisplay.getFrameData( frameData );
				pose = frameData.pose;

			} else if ( vrDisplay.getPose ) {

				pose = vrDisplay.getPose();

			}

			if ( pose.orientation !== null ) {

				object.quaternion.fromArray( pose.orientation );

			}

			if ( pose.position !== null ) {

				object.position.fromArray( pose.position );
				object.position.add( this.roomOrigin );

			} else {

				object.position.set( 0, 0, 0 );

			}

			if ( this.standing ) {

				if ( vrDisplay.stageParameters ) {

					object.updateMatrix();

					standingMatrix.fromArray( vrDisplay.stageParameters.sittingToStandingTransform );
					object.applyMatrix( standingMatrix );

				} else {

					object.position.setY( object.position.y + this.userHeight );

				}

			}

			object.position.multiplyScalar( scope.scale );

		}

	};

	this.resetPose = function () {

		if ( vrDisplay ) {

			vrDisplay.resetPose();

		}

	};

	this.resetSensor = function () {

		console.warn( 'THREE.VRControls: .resetSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.zeroSensor = function () {

		console.warn( 'THREE.VRControls: .zeroSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.dispose = function () {

		vrDisplay = null;

	};

};

},{}],71:[function(require,module,exports){
/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://webvr.info/get-chrome
 *
 */

THREE.VREffect = function ( renderer, onError ) {

	var vrDisplay, vrDisplays;
	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;

	var frameData = null;

	if ( 'VRFrameData' in window ) {

		frameData = new VRFrameData();

	}

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		if ( displays.length > 0 ) {

			vrDisplay = displays[ 0 ];

		} else {

			if ( onError ) onError( 'HMD not available' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays );

	}

	//

	this.isPresenting = false;
	this.scale = 1;

	var scope = this;

	var rendererSize = renderer.getSize();
	var rendererUpdateStyle = false;
	var rendererPixelRatio = renderer.getPixelRatio();

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.setVRDisplay = function ( value ) {

		vrDisplay = value;

	};

	this.getVRDisplays = function () {

		console.warn( 'THREE.VREffect: getVRDisplays() is being deprecated.' );
		return vrDisplays;

	};

  this.getSize = function() {
		return renderer.getSize();
	}
	this.setSize = function ( width, height, updateStyle ) {

		rendererSize = { width: width, height: height };
		rendererUpdateStyle = updateStyle;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			renderer.setPixelRatio( 1 );
			renderer.setSize( eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false );

		} else {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( width, height, updateStyle );

		}

	};

	// fullscreen

	var canvas = renderer.domElement;
	var requestFullscreen;
	var exitFullscreen;
	var fullscreenElement;
	var defaultLeftBounds = [ 0.0, 0.0, 0.5, 1.0 ];
	var defaultRightBounds = [ 0.5, 0.0, 0.5, 1.0 ];

	function onVRDisplayPresentChange() {

		var wasPresenting = scope.isPresenting;
		scope.isPresenting = vrDisplay !== undefined && vrDisplay.isPresenting;

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeWidth = eyeParamsL.renderWidth;
			var eyeHeight = eyeParamsL.renderHeight;

			if ( !wasPresenting ) {

				rendererPixelRatio = renderer.getPixelRatio();
				rendererSize = renderer.getSize();

				renderer.setPixelRatio( 1 );
				renderer.setSize( eyeWidth * 2, eyeHeight, false );

			}

		} else if ( wasPresenting ) {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( rendererSize.width, rendererSize.height, rendererUpdateStyle );

		}

	}

	window.addEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	this.setFullScreen = function ( boolean ) {

		return new Promise( function ( resolve, reject ) {

			if ( vrDisplay === undefined ) {

				reject( new Error( 'No VR hardware found.' ) );
				return;

			}

			if ( scope.isPresenting === boolean ) {

				resolve();
				return;

			}

			if ( boolean ) {

				resolve( vrDisplay.requestPresent( [ { source: canvas } ] ) );

			} else {

				resolve( vrDisplay.exitPresent() );

			}

		} );

	};

	this.requestPresent = function () {

		return this.setFullScreen( true );

	};

	this.exitPresent = function () {

		return this.setFullScreen( false );

	};

	this.requestAnimationFrame = function ( f ) {

		if ( vrDisplay !== undefined ) {

			return vrDisplay.requestAnimationFrame( f );

		} else {

			return window.requestAnimationFrame( f );

		}

	};

	this.cancelAnimationFrame = function ( h ) {

		if ( vrDisplay !== undefined ) {

			vrDisplay.cancelAnimationFrame( h );

		} else {

			window.cancelAnimationFrame( h );

		}

	};

	this.submitFrame = function () {

		if ( vrDisplay !== undefined && scope.isPresenting ) {

			vrDisplay.submitFrame();

		}

	};

	this.autoSubmitFrame = true;

	// render

	var cameraL = new THREE.PerspectiveCamera();
	cameraL.layers.enable( 1 );

	var cameraR = new THREE.PerspectiveCamera();
	cameraR.layers.enable( 2 );

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( vrDisplay && scope.isPresenting ) {

			var autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {

				scene.updateMatrixWorld();
				scene.autoUpdate = false;

			}

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeParamsR = vrDisplay.getEyeParameters( 'right' );

			eyeTranslationL.fromArray( eyeParamsL.offset );
			eyeTranslationR.fromArray( eyeParamsR.offset );

			if ( Array.isArray( scene ) ) {

				console.warn( 'THREE.VREffect.render() no longer supports arrays. Use object.layers instead.' );
				scene = scene[ 0 ];

			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			var layers = vrDisplay.getLayers();
			var leftBounds;
			var rightBounds;

			if ( layers.length ) {

				var layer = layers[ 0 ];

				leftBounds = layer.leftBounds !== null && layer.leftBounds.length === 4 ? layer.leftBounds : defaultLeftBounds;
				rightBounds = layer.rightBounds !== null && layer.rightBounds.length === 4 ? layer.rightBounds : defaultRightBounds;

			} else {

				leftBounds = defaultLeftBounds;
				rightBounds = defaultRightBounds;

			}

			renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height: Math.round(size.height * leftBounds[ 3 ] )
			};
			renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height: Math.round(size.height * rightBounds[ 3 ] )
			};

			if ( renderTarget ) {

				renderer.setRenderTarget( renderTarget );
				renderTarget.scissorTest = true;

			} else {

				renderer.setRenderTarget( null );
				renderer.setScissorTest( true );

			}

			if ( renderer.autoClear || forceClear ) renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
			camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );

			var scale = this.scale;
			cameraL.translateOnAxis( eyeTranslationL, scale );
			cameraR.translateOnAxis( eyeTranslationR, scale );

			if ( vrDisplay.getFrameData ) {

				vrDisplay.depthNear = camera.near;
				vrDisplay.depthFar = camera.far;

				vrDisplay.getFrameData( frameData );

				cameraL.projectionMatrix.elements = frameData.leftProjectionMatrix;
				cameraR.projectionMatrix.elements = frameData.rightProjectionMatrix;

			} else {

				cameraL.projectionMatrix = fovToProjection( eyeParamsL.fieldOfView, true, camera.near, camera.far );
				cameraR.projectionMatrix = fovToProjection( eyeParamsR.fieldOfView, true, camera.near, camera.far );

			}

			// render left eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderTarget.scissor.set( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			} else {

				renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			}
			renderer.render( scene, cameraL, renderTarget, forceClear );

			// render right eye
			if ( renderTarget ) {

				renderTarget.viewport.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderTarget.scissor.set( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			} else {

				renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			}
			renderer.render( scene, cameraR, renderTarget, forceClear );

			if ( renderTarget ) {

				renderTarget.viewport.set( 0, 0, size.width, size.height );
				renderTarget.scissor.set( 0, 0, size.width, size.height );
				renderTarget.scissorTest = false;
				renderer.setRenderTarget( null );

			} else {

				renderer.setViewport( 0, 0, size.width, size.height );
				renderer.setScissorTest( false );

			}

			if ( autoUpdate ) {

				scene.autoUpdate = true;

			}

			if ( scope.autoSubmitFrame ) {

				scope.submitFrame();

			}

			return;

		}

		// Regular render mode if not HMD

		renderer.render( scene, camera, renderTarget, forceClear );

	};

	this.dispose = function () {

		window.removeEventListener( 'vrdisplaypresentchange', onVRDisplayPresentChange, false );

	};

	//

	function fovToNDCScaleOffset( fov ) {

		var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
		var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
		var pyscale = 2.0 / ( fov.upTan + fov.downTan );
		var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
		return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

	}

	function fovPortToProjection( fov, rightHanded, zNear, zFar ) {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? - 1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = fovToNDCScaleOffset( fov );

		// X result, map clip edges to [-w,+w]
		m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
		m[ 0 * 4 + 1 ] = 0.0;
		m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
		m[ 0 * 4 + 3 ] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[ 1 * 4 + 0 ] = 0.0;
		m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
		m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
		m[ 1 * 4 + 3 ] = 0.0;

		// Z result (up to the app)
		m[ 2 * 4 + 0 ] = 0.0;
		m[ 2 * 4 + 1 ] = 0.0;
		m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
		m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

		// W result (= Z in)
		m[ 3 * 4 + 0 ] = 0.0;
		m[ 3 * 4 + 1 ] = 0.0;
		m[ 3 * 4 + 2 ] = handednessScale;
		m[ 3 * 4 + 3 ] = 0.0;

		mobj.transpose();

		return mobj;

	}

	function fovToProjection( fov, rightHanded, zNear, zFar ) {

		var DEG2RAD = Math.PI / 180.0;

		var fovPort = {
			upTan: Math.tan( fov.upDegrees * DEG2RAD ),
			downTan: Math.tan( fov.downDegrees * DEG2RAD ),
			leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
			rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
		};

		return fovPortToProjection( fovPort, rightHanded, zNear, zFar );

	}

};

},{}],72:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.materials = null;

	this.regexp = {
		// v float float float
		vertex_pattern           : /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vn float float float
		normal_pattern           : /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vt float float
		uv_pattern               : /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// f vertex vertex vertex
		face_vertex              : /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
		// f vertex/uv vertex/uv vertex/uv
		face_vertex_uv           : /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
		face_vertex_uv_normal    : /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
		// f vertex//normal vertex//normal vertex//normal
		face_vertex_normal       : /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
		// o object_name | g group_name
		object_pattern           : /^[og]\s*(.+)?/,
		// s boolean
		smoothing_pattern        : /^s\s+(\d+|on|off)/,
		// mtllib file_reference
		material_library_pattern : /^mtllib /,
		// usemtl material_name
		material_use_pattern     : /^usemtl /
	};

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setPath: function ( value ) {

		this.path = value;

	},

	setMaterials: function ( materials ) {

		this.materials = materials;

	},

	_createParserState : function () {

		var state = {
			objects  : [],
			object   : {},

			vertices : [],
			normals  : [],
			uvs      : [],

			materialLibraries : [],

			startObject: function ( name, fromDeclaration ) {

				// If the current object (initial from reset) is not from a g/o declaration in the parsed
				// file. We need to use it for the first parsed g/o to keep things in sync.
				if ( this.object && this.object.fromDeclaration === false ) {

					this.object.name = name;
					this.object.fromDeclaration = ( fromDeclaration !== false );
					return;

				}

				var previousMaterial = ( this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined );

				if ( this.object && typeof this.object._finalize === 'function' ) {

					this.object._finalize( true );

				}

				this.object = {
					name : name || '',
					fromDeclaration : ( fromDeclaration !== false ),

					geometry : {
						vertices : [],
						normals  : [],
						uvs      : []
					},
					materials : [],
					smooth : true,

					startMaterial : function( name, libraries ) {

						var previous = this._finalize( false );

						// New usemtl declaration overwrites an inherited material, except if faces were declared
						// after the material, then it must be preserved for proper MultiMaterial continuation.
						if ( previous && ( previous.inherited || previous.groupCount <= 0 ) ) {

							this.materials.splice( previous.index, 1 );

						}

						var material = {
							index      : this.materials.length,
							name       : name || '',
							mtllib     : ( Array.isArray( libraries ) && libraries.length > 0 ? libraries[ libraries.length - 1 ] : '' ),
							smooth     : ( previous !== undefined ? previous.smooth : this.smooth ),
							groupStart : ( previous !== undefined ? previous.groupEnd : 0 ),
							groupEnd   : -1,
							groupCount : -1,
							inherited  : false,

							clone : function( index ) {
								var cloned = {
									index      : ( typeof index === 'number' ? index : this.index ),
									name       : this.name,
									mtllib     : this.mtllib,
									smooth     : this.smooth,
									groupStart : 0,
									groupEnd   : -1,
									groupCount : -1,
									inherited  : false
								};
								cloned.clone = this.clone.bind(cloned);
								return cloned;
							}
						};

						this.materials.push( material );

						return material;

					},

					currentMaterial : function() {

						if ( this.materials.length > 0 ) {
							return this.materials[ this.materials.length - 1 ];
						}

						return undefined;

					},

					_finalize : function( end ) {

						var lastMultiMaterial = this.currentMaterial();
						if ( lastMultiMaterial && lastMultiMaterial.groupEnd === -1 ) {

							lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
							lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
							lastMultiMaterial.inherited = false;

						}

						// Ignore objects tail materials if no face declarations followed them before a new o/g started.
						if ( end && this.materials.length > 1 ) {

							for ( var mi = this.materials.length - 1; mi >= 0; mi-- ) {
								if ( this.materials[mi].groupCount <= 0 ) {
									this.materials.splice( mi, 1 );
								}
							}

						}

						// Guarantee at least one empty material, this makes the creation later more straight forward.
						if ( end && this.materials.length === 0 ) {

							this.materials.push({
								name   : '',
								smooth : this.smooth
							});

						}

						return lastMultiMaterial;

					}
				};

				// Inherit previous objects material.
				// Spec tells us that a declared material must be set to all objects until a new material is declared.
				// If a usemtl declaration is encountered while this new object is being parsed, it will
				// overwrite the inherited material. Exception being that there was already face declarations
				// to the inherited material, then it will be preserved for proper MultiMaterial continuation.

				if ( previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function" ) {

					var declared = previousMaterial.clone( 0 );
					declared.inherited = true;
					this.object.materials.push( declared );

				}

				this.objects.push( this.object );

			},

			finalize : function() {

				if ( this.object && typeof this.object._finalize === 'function' ) {

					this.object._finalize( true );

				}

			},

			parseVertexIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

			},

			parseNormalIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

			},

			parseUVIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

			},

			addVertex: function ( a, b, c ) {

				var src = this.vertices;
				var dst = this.object.geometry.vertices;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ b + 2 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );
				dst.push( src[ c + 2 ] );

			},

			addVertexLine: function ( a ) {

				var src = this.vertices;
				var dst = this.object.geometry.vertices;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );

			},

			addNormal : function ( a, b, c ) {

				var src = this.normals;
				var dst = this.object.geometry.normals;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ b + 2 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );
				dst.push( src[ c + 2 ] );

			},

			addUV: function ( a, b, c ) {

				var src = this.uvs;
				var dst = this.object.geometry.uvs;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );

			},

			addUVLine: function ( a ) {

				var src = this.uvs;
				var dst = this.object.geometry.uvs;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );

			},

			addFace: function ( a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd ) {

				var vLen = this.vertices.length;

				var ia = this.parseVertexIndex( a, vLen );
				var ib = this.parseVertexIndex( b, vLen );
				var ic = this.parseVertexIndex( c, vLen );
				var id;

				if ( d === undefined ) {

					this.addVertex( ia, ib, ic );

				} else {

					id = this.parseVertexIndex( d, vLen );

					this.addVertex( ia, ib, id );
					this.addVertex( ib, ic, id );

				}

				if ( ua !== undefined ) {

					var uvLen = this.uvs.length;

					ia = this.parseUVIndex( ua, uvLen );
					ib = this.parseUVIndex( ub, uvLen );
					ic = this.parseUVIndex( uc, uvLen );

					if ( d === undefined ) {

						this.addUV( ia, ib, ic );

					} else {

						id = this.parseUVIndex( ud, uvLen );

						this.addUV( ia, ib, id );
						this.addUV( ib, ic, id );

					}

				}

				if ( na !== undefined ) {

					// Normals are many times the same. If so, skip function call and parseInt.
					var nLen = this.normals.length;
					ia = this.parseNormalIndex( na, nLen );

					ib = na === nb ? ia : this.parseNormalIndex( nb, nLen );
					ic = na === nc ? ia : this.parseNormalIndex( nc, nLen );

					if ( d === undefined ) {

						this.addNormal( ia, ib, ic );

					} else {

						id = this.parseNormalIndex( nd, nLen );

						this.addNormal( ia, ib, id );
						this.addNormal( ib, ic, id );

					}

				}

			},

			addLineGeometry: function ( vertices, uvs ) {

				this.object.geometry.type = 'Line';

				var vLen = this.vertices.length;
				var uvLen = this.uvs.length;

				for ( var vi = 0, l = vertices.length; vi < l; vi ++ ) {

					this.addVertexLine( this.parseVertexIndex( vertices[ vi ], vLen ) );

				}

				for ( var uvi = 0, l = uvs.length; uvi < l; uvi ++ ) {

					this.addUVLine( this.parseUVIndex( uvs[ uvi ], uvLen ) );

				}

			}

		};

		state.startObject( '', false );

		return state;

	},

	parse: function ( text ) {

		console.time( 'OBJLoader' );

		var state = this._createParserState();

		if ( text.indexOf( '\r\n' ) !== - 1 ) {

			// This is faster than String.split with regex that splits on both
			text = text.replace( /\r\n/g, '\n' );

		}

		if ( text.indexOf( '\\\n' ) !== - 1) {

			// join lines separated by a line continuation character (\)
			text = text.replace( /\\\n/g, '' );

		}

		var lines = text.split( '\n' );
		var line = '', lineFirstChar = '', lineSecondChar = '';
		var lineLength = 0;
		var result = [];

		// Faster to just trim left side of the line. Use if available.
		var trimLeft = ( typeof ''.trimLeft === 'function' );

		for ( var i = 0, l = lines.length; i < l; i ++ ) {

			line = lines[ i ];

			line = trimLeft ? line.trimLeft() : line.trim();

			lineLength = line.length;

			if ( lineLength === 0 ) continue;

			lineFirstChar = line.charAt( 0 );

			// @todo invoke passed in handler if any
			if ( lineFirstChar === '#' ) continue;

			if ( lineFirstChar === 'v' ) {

				lineSecondChar = line.charAt( 1 );

				if ( lineSecondChar === ' ' && ( result = this.regexp.vertex_pattern.exec( line ) ) !== null ) {

					// 0                  1      2      3
					// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.vertices.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( lineSecondChar === 'n' && ( result = this.regexp.normal_pattern.exec( line ) ) !== null ) {

					// 0                   1      2      3
					// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.normals.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( lineSecondChar === 't' && ( result = this.regexp.uv_pattern.exec( line ) ) !== null ) {

					// 0               1      2
					// ["vt 0.1 0.2", "0.1", "0.2"]

					state.uvs.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] )
					);

				} else {

					throw new Error( "Unexpected vertex/normal/uv line: '" + line  + "'" );

				}

			} else if ( lineFirstChar === "f" ) {

				if ( ( result = this.regexp.face_vertex_uv_normal.exec( line ) ) !== null ) {

					// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
					// 0                        1    2    3    4    5    6    7    8    9   10         11         12
					// ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 4 ], result[ 7 ], result[ 10 ],
						result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
						result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
					);

				} else if ( ( result = this.regexp.face_vertex_uv.exec( line ) ) !== null ) {

					// f vertex/uv vertex/uv vertex/uv
					// 0                  1    2    3    4    5    6   7          8
					// ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);

				} else if ( ( result = this.regexp.face_vertex_normal.exec( line ) ) !== null ) {

					// f vertex//normal vertex//normal vertex//normal
					// 0                     1    2    3    4    5    6   7          8
					// ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						undefined, undefined, undefined, undefined,
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);

				} else if ( ( result = this.regexp.face_vertex.exec( line ) ) !== null ) {

					// f vertex vertex vertex
					// 0            1    2    3   4
					// ["f 1 2 3", "1", "2", "3", undefined]

					state.addFace(
						result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
					);

				} else {

					throw new Error( "Unexpected face line: '" + line  + "'" );

				}

			} else if ( lineFirstChar === "l" ) {

				var lineParts = line.substring( 1 ).trim().split( " " );
				var lineVertices = [], lineUVs = [];

				if ( line.indexOf( "/" ) === - 1 ) {

					lineVertices = lineParts;

				} else {

					for ( var li = 0, llen = lineParts.length; li < llen; li ++ ) {

						var parts = lineParts[ li ].split( "/" );

						if ( parts[ 0 ] !== "" ) lineVertices.push( parts[ 0 ] );
						if ( parts[ 1 ] !== "" ) lineUVs.push( parts[ 1 ] );

					}

				}
				state.addLineGeometry( lineVertices, lineUVs );

			} else if ( ( result = this.regexp.object_pattern.exec( line ) ) !== null ) {

				// o object_name
				// or
				// g group_name

				// WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
				// var name = result[ 0 ].substr( 1 ).trim();
				var name = ( " " + result[ 0 ].substr( 1 ).trim() ).substr( 1 );

				state.startObject( name );

			} else if ( this.regexp.material_use_pattern.test( line ) ) {

				// material

				state.object.startMaterial( line.substring( 7 ).trim(), state.materialLibraries );

			} else if ( this.regexp.material_library_pattern.test( line ) ) {

				// mtl file

				state.materialLibraries.push( line.substring( 7 ).trim() );

			} else if ( ( result = this.regexp.smoothing_pattern.exec( line ) ) !== null ) {

				// smooth shading

				// @todo Handle files that have varying smooth values for a set of faces inside one geometry,
				// but does not define a usemtl for each face set.
				// This should be detected and a dummy material created (later MultiMaterial and geometry groups).
				// This requires some care to not create extra material on each smooth value for "normal" obj files.
				// where explicit usemtl defines geometry groups.
				// Example asset: examples/models/obj/cerberus/Cerberus.obj

				var value = result[ 1 ].trim().toLowerCase();
				state.object.smooth = ( value === '1' || value === 'on' );

				var material = state.object.currentMaterial();
				if ( material ) {

					material.smooth = state.object.smooth;

				}

			} else {

				// Handle null terminated files without exception
				if ( line === '\0' ) continue;

				throw new Error( "Unexpected line: '" + line  + "'" );

			}

		}

		state.finalize();

		var container = new THREE.Group();
		container.materialLibraries = [].concat( state.materialLibraries );

		for ( var i = 0, l = state.objects.length; i < l; i ++ ) {

			var object = state.objects[ i ];
			var geometry = object.geometry;
			var materials = object.materials;
			var isLine = ( geometry.type === 'Line' );

			// Skip o/g line declarations that did not follow with any faces
			if ( geometry.vertices.length === 0 ) continue;

			var buffergeometry = new THREE.BufferGeometry();

			buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

			if ( geometry.normals.length > 0 ) {

				buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );

			} else {

				buffergeometry.computeVertexNormals();

			}

			if ( geometry.uvs.length > 0 ) {

				buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );

			}

			// Create materials

			var createdMaterials = [];

			for ( var mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {

				var sourceMaterial = materials[mi];
				var material = undefined;

				if ( this.materials !== null ) {

					material = this.materials.create( sourceMaterial.name );

					// mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
					if ( isLine && material && ! ( material instanceof THREE.LineBasicMaterial ) ) {

						var materialLine = new THREE.LineBasicMaterial();
						materialLine.copy( material );
						material = materialLine;

					}

				}

				if ( ! material ) {

					material = ( ! isLine ? new THREE.MeshPhongMaterial() : new THREE.LineBasicMaterial() );
					material.name = sourceMaterial.name;

				}

				material.shading = sourceMaterial.smooth ? THREE.SmoothShading : THREE.FlatShading;

				createdMaterials.push(material);

			}

			// Create mesh

			var mesh;

			if ( createdMaterials.length > 1 ) {

				for ( var mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {

					var sourceMaterial = materials[mi];
					buffergeometry.addGroup( sourceMaterial.groupStart, sourceMaterial.groupCount, mi );

				}

				var multiMaterial = new THREE.MultiMaterial( createdMaterials );
				mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, multiMaterial ) : new THREE.LineSegments( buffergeometry, multiMaterial ) );

			} else {

				mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, createdMaterials[ 0 ] ) : new THREE.LineSegments( buffergeometry, createdMaterials[ 0 ] ) );
			}

			mesh.name = object.name;

			container.add( mesh );

		}

		console.timeEnd( 'OBJLoader' );

		return container;

	}

};

},{}],73:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);

},{}],74:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com
 */

THREE.PaintViveController = function ( id ) {

	THREE.ViveController.call( this, id );

	var PI2 = Math.PI * 2;

	var MODES = { COLOR: 0, SIZE: 1 };
	var mode = MODES.COLOR;

	var color = new THREE.Color( 1, 1, 1 );
	var size = 1.0;

	//

	function generateHueTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var imageData = context.getImageData( 0, 0, 256, 256 );
		var data = imageData.data;

		for ( var i = 0, j = 0; i < data.length; i += 4, j ++ ) {

			var x = ( ( j % 256 ) / 256 ) - 0.5;
			var y = ( Math.floor( j / 256 ) / 256 ) - 0.5;

			color.setHSL( Math.atan2( y, x ) / PI2, 1,( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );

			data[ i + 0 ] = color.r * 256;
			data[ i + 1 ] = color.g * 256;
			data[ i + 2 ] = color.b * 256;
			data[ i + 3 ] = 256;

		}

		context.putImageData( imageData, 0, 0 );

		return new THREE.CanvasTexture( canvas );

	}

	var geometry = new THREE.CircleGeometry( 1, 32 );
	var material = new THREE.MeshBasicMaterial( { map: generateHueTexture() } );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0, 0.005, 0.0495 );
	mesh.rotation.x = - 1.45;
	mesh.scale.setScalar( 0.02 );
	this.add( mesh )

	var geometry = new THREE.IcosahedronGeometry( 0.1, 2 );
	var material = new THREE.MeshBasicMaterial();
	material.color = color;
	var ball = new THREE.Mesh( geometry, material );
	mesh.add( ball );

	function onAxisChanged( event ) {

		if ( this.getButtonState( 'thumbpad' ) === false ) return;

		var x = event.axes[ 0 ] / 2.0;
		var y = - event.axes[ 1 ] / 2.0;

		if ( mode === MODES.COLOR ) {
			color.setHSL( Math.atan2( y, x ) / PI2, 1, ( 0.5 - Math.sqrt( x * x + y * y ) ) * 2.0 );
			ball.position.x = event.axes[ 0 ];
			ball.position.y = event.axes[ 1 ];
		}

		if ( mode === MODES.SIZE ) {
			size = y + 1;
		}

	}

	function onGripsDown( event ) {

		if ( mode === MODES.COLOR ) {
			mode = MODES.SIZE;
			mesh.visible = false;
			return;
		}

		if ( mode === MODES.SIZE ) {
			mode = MODES.COLOR;
			mesh.visible = true;
			return;
		}

	}

	this.getColor = function () { return color; };
	this.getSize = function () { return size; };

	this.addEventListener( 'axischanged', onAxisChanged );
	this.addEventListener( 'gripsdown', onGripsDown );

};

THREE.PaintViveController.prototype = Object.create( THREE.ViveController.prototype );
THREE.PaintViveController.prototype.constructor = THREE.PaintViveController;

},{}],75:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com
 * @author stewdio / http://stewd.io
 */

THREE.ViveController = function ( id ) {

	THREE.Object3D.call( this );

	var scope = this;
	var gamepad;

	var axes = [ 0, 0 ];
	var thumbpadIsPressed = false;
	var triggerIsPressed = false;
	var gripsArePressed = false;
	var menuIsPressed = false;

	function findGamepad( id ) {

		// Iterate across gamepads as Vive Controllers may not be
		// in position 0 and 1.

		var gamepads = navigator.getGamepads();

		for ( var i = 0, j = 0; i < 4; i ++ ) {

			var gamepad = gamepads[ i ];

			if ( gamepad && gamepad.id === 'OpenVR Gamepad' ) {

				if ( j === id ) return gamepad;

				j ++;

			}

		}

	}

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	this.getGamepad = function () {

		return gamepad;

	};

	this.getButtonState = function ( button ) {

		if ( button === 'thumbpad' ) return thumbpadIsPressed;
		if ( button === 'trigger' ) return triggerIsPressed;
		if ( button === 'grips' ) return gripsArePressed;
		if ( button === 'menu' ) return menuIsPressed;

	};

	this.update = function () {

		gamepad = findGamepad( id );

		if ( gamepad !== undefined && gamepad.pose !== undefined ) {

			if ( gamepad.pose === null ) return; // No user action yet

			//  Position and orientation.

			var pose = gamepad.pose;

			if ( pose.position !== null ) scope.position.fromArray( pose.position );
			if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
			scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix );
			scope.matrixWorldNeedsUpdate = true;
			scope.visible = true;

			//  Thumbpad and Buttons.

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			if ( thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {

				thumbpadIsPressed = gamepad.buttons[ 0 ].pressed;
				scope.dispatchEvent( { type: thumbpadIsPressed ? 'thumbpaddown' : 'thumbpadup' } );

			}

			if ( triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {

				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );

			}

			if ( gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {

				gripsArePressed = gamepad.buttons[ 2 ].pressed;
				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );

			}

			if ( menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {

				menuIsPressed = gamepad.buttons[ 3 ].pressed;
				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );

			}

		} else {

			scope.visible = false;

		}

	};

};

THREE.ViveController.prototype = Object.create( THREE.Object3D.prototype );
THREE.ViveController.prototype.constructor = THREE.ViveController;

},{}],76:[function(require,module,exports){
/**
 * @author mrdoob / http://mrdoob.com
 * Based on @tojiro's vr-samples-utils.js
 */

this.WEBVR = {

	isLatestAvailable: function () {

		console.warn( 'WEBVR: isLatestAvailable() is being deprecated. Use .isAvailable() instead.' );
		return this.isAvailable();

	},

	isAvailable: function () {

		return navigator.getVRDisplays !== undefined;

	},

	getMessage: function () {

		var message;

		if ( navigator.getVRDisplays ) {

			navigator.getVRDisplays().then( function ( displays ) {

				if ( displays.length === 0 ) message = 'WebVR supported, but no VRDisplays found.';

			} );

		} else {

			message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

		}

		if ( message !== undefined ) {

			var container = document.createElement( 'div' );
			container.style.position = 'absolute';
			container.style.left = '0';
			container.style.top = '0';
			container.style.right = '0';
			container.style.zIndex = '999';
			container.align = 'center';

			var error = document.createElement( 'div' );
			error.style.fontFamily = 'sans-serif';
			error.style.fontSize = '16px';
			error.style.fontStyle = 'normal';
			error.style.lineHeight = '26px';
			error.style.backgroundColor = '#fff';
			error.style.color = '#000';
			error.style.padding = '10px 20px';
			error.style.margin = '50px';
			error.style.display = 'inline-block';
			error.innerHTML = message;
			container.appendChild( error );

			return container;

		}

	},

	getButton: function ( effect ) {

		var button = document.createElement( 'button' );
		button.style.position = 'absolute';
		button.style.left = 'calc(50% - 50px)';
		button.style.bottom = '20px';
		button.style.width = '100px';
		button.style.border = '0';
		button.style.padding = '8px';
		button.style.cursor = 'pointer';
		button.style.backgroundColor = '#000';
		button.style.color = '#fff';
		button.style.fontFamily = 'sans-serif';
		button.style.fontSize = '13px';
		button.style.fontStyle = 'normal';
		button.style.textAlign = 'center';
		button.style.zIndex = '999';
		button.textContent = 'ENTER VR';
		button.onclick = function() {

			effect.isPresenting ? effect.exitPresent() : effect.requestPresent();

		};

		window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

			button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';

		}, false );

		return button;

	}

};

},{}],77:[function(require,module,exports){

if( !THREE.REVISION.includes( "d3x0r" ) ) {

if( Number(THREE.REVISION) === 74 ) {
}

var vector3Pool = [];
THREE.Vector3Pool = {
	new : function(x,y,z) {
		var r = vector3Pool.pop();
		if( r ) {
			r.x = x;
			r.y = y;
			r.z = z;
		}
		else{
			r = new THREE.Vector3(x,y,z);
		}
		return r;
	}
}

THREE.Vector3.prototype.delete = function() {
    vector3Pool.push( this );
    return this;
}

var vector4Pool = [];
THREE.Vector4Pool = {
	new : function(x,y,z,w) {
		var r = vector4Pool.pop();
		if( r ) {
			r.x = x;
			r.y = y;
			r.z = z;
			r.w = w;
		}
		else{
			r = new THREE.Vector4(x,y,z,w);
		}
		return r;
	}
}

THREE.Vector4.prototype.delete = function() {
    vector4Pool.push( this );
    return this;
}


/*
	INLINEFUNC( void, Rotate, ( RCOORD dAngle, P_POINT vaxis1, P_POINT vaxis2 ) )
	{
	   _POINT v1, v2;
	   _POINT vsave;
	   RCOORD dsin = (RCOORD)SIN( dAngle )
	   	  , dcos = (RCOORD)COS( dAngle );
	   MemCpy( vsave, vaxis1, sizeof( _POINT ) );
	   DOFUNC(scale)( v1, vaxis1, dcos );
	   DOFUNC(scale)( v2, vaxis2, dsin );
	   DOFUNC(sub)( vaxis1, v1, v2 );
	   DOFUNC(scale)( v2, vsave, dsin );
	   DOFUNC(scale)( v1, vaxis2, dcos );
	   DOFUNC(add)( vaxis2, v2, v1 );
	}
*/

THREE.Vector3Unit = new      THREE.Vector3(  1,  1,  1 );
THREE.Vector3Zero = new      THREE.Vector3(  0,  0,  0 );
THREE.Vector3Right = new     THREE.Vector3( -1,  0,  0 );
THREE.Vector3Backward = new  THREE.Vector3(  0,  0,  1 );
THREE.Vector3Up = new        THREE.Vector3(  0,  1,  0 );
THREE.Vector3Left = new      THREE.Vector3(  1,  0,  0 );
THREE.Vector3Forward = new   THREE.Vector3(  0,  0, -1 );
THREE.Vector3Down = new      THREE.Vector3(  0, -1,  0 );


["Vector3Unit"
,"Vector3Zero"
,"Vector3Right"
,"Vector3Backward"
,"Vector3Up"
,"Vector3Left"
,"Vector3Forward"
,"Vector3Down"].forEach( function(key){
	Object.freeze(THREE[key])
	Object.defineProperty(THREE[key], "x", { writable: false })
	Object.defineProperty(THREE[key], "y", { writable: false })
	Object.defineProperty(THREE[key], "z", { writable: false })
})

var oldProto = THREE.Matrix4.prototype;
var oldMatrixContructor = THREE.Matrix4.prototype.constructor;
THREE.Matrix4x = function() {
	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	Object.defineProperty(this, "elements", { writable:false } );


}

THREE.Matrix4.prototype.__defineGetter__( "motion", function(){
	if( !this._motion ){
        this._motion = {
        	tick : 0,
        	speed : new THREE.Vector3(),
                acceleration : new THREE.Vector3(),
                rotation : new THREE.Vector3(),
                torque : new THREE.Vector3(),
                mass : 1.0,
                move : function( m, delta ) {
					this.speed.addScaledVector( this.acceleration, delta );
					var del = this.speed.clone().multiplyScalar( delta );

					m.origin.addScaledVector( m.forward, del.z );
					m.origin.addScaledVector( m.up, del.y );
					m.origin.addScaledVector( m.left, del.x );

					this.rotation.addScaledVector( this.torque, delta );
					var this_move = this.rotation.clone().multiplyScalar( delta )
					m.rotateRelative( this_move.x, this_move.y, this_move.z );
					this_move.delete();
					del.delete();
				},
				rotate : function( m, delta ) {
					var iterations = 1;

					var max = Math.abs( this.rotation.x );
					var tmp = Math.abs( this.rotation.y );
					if( tmp > max ) {
						max = tmp;
						tmp = Math.abs( this.rotation.z );
						if( tmp > max ) {
							max = tmp;
							while( ( ( max * delta ) / iterations ) > 0.1 )
								iterations++;
						} else {
							while( ( ( max * delta ) / iterations ) > 0.1 )
								iterations++;
						}
					} else {
						tmp = Math.abs( this.rotation.z );
						if( tmp > max ) {
							max = tmp;
							while( ( ( max * delta ) / iterations ) > 0.1 )
								iterations++;
						} else {
							while( ( ( max * delta ) / iterations ) > 0.1 )
								iterations++;
						}
					}
					var delx = ( this.rotation.x * delta ) / iterations;
					var dely = ( this.rotation.y * delta ) / iterations;
					var delz = ( this.rotation.z * delta ) / iterations;
					for( var n = 0; n < iterations; n++ ) {
						m.rotateRelative( delx, dely, delz );
					}
					// delta = delta / 1000;
					/*
					   ** this is becoming a physics engine frame...
					   ** might as well just add that.
                	var delta_accel = this.acceleration.clone().multiplyScalar(delta);
					if( ( this.rotation.x > ( Math.PI / 4 ) )
					   ||( this.rotation.x < -( Math.PI / 4 ) )
					   ||( this.rotation.y > ( Math.PI / 4 ) )
					   ||( this.rotation.y < -( Math.PI / 4 ) )
					   ||( this.rotation.z > ( Math.PI / 4 ) )
					   ||( this.rotation.z < -( Math.PI / 4 ) )
					   ){
						   var max = this.rotation.x;
						   if( max < this.rotation.y )
						   	 max = this.rotation.y;
						   if( max < this.rotation.z )
						     max = this.rotation.z;
						 var min = this.rotation.x;
  						   if( min > this.rotation.y )
  						   	 max = this.rotation.y;
  						   if( min > this.rotation.z )
  						     max = this.rotation.z;
							if( min < 0 )
								if( max < -min )
									max = -min;
							var t;
							for( t = 1; t < 100; t++ )
								if( ( max / t ) < ( Math.PI / 4 ))
									break;

							delta_accel.scale( 1 / t );
					   }
					  */
				  },


			rotate : function( m, delta ) {
				var iterations = 1;

				var max = Math.abs( this.rotation.x );
				var tmp = Math.abs( this.rotation.y );
				if( tmp > max ) {
					max = tmp;
					tmp = Math.abs( this.rotation.z );
					if( tmp > max ) {
						max = tmp;
						while( ( ( max * delta ) / iterations ) > 0.1 )
							iterations++;
					} else {
						while( ( ( max * delta ) / iterations ) > 0.1 )
							iterations++;
					}
				} else {
					tmp = Math.abs( this.rotation.z );
					if( tmp > max ) {
						max = tmp;
						while( ( ( max * delta ) / iterations ) > 0.1 )
							iterations++;
					} else {
						while( ( ( max * delta ) / iterations ) > 0.1 )
							iterations++;
					}
				}
				var delx = ( this.rotation.x * delta ) / iterations;
				var dely = ( this.rotation.y * delta ) / iterations;
				var delz = ( this.rotation.z * delta ) / iterations;
				for( var n = 0; n < iterations; n++ ) {
					m.rotateRelative( delx, dely, delz );
				}
				// delta = delta / 1000;
				/*
					 ** this is becoming a physics engine frame...
					 ** might as well just add that.
								var delta_accel = this.acceleration.clone().multiplyScalar(delta);
				if( ( this.rotation.x > ( Math.PI / 4 ) )
					 ||( this.rotation.x < -( Math.PI / 4 ) )
					 ||( this.rotation.y > ( Math.PI / 4 ) )
					 ||( this.rotation.y < -( Math.PI / 4 ) )
					 ||( this.rotation.z > ( Math.PI / 4 ) )
					 ||( this.rotation.z < -( Math.PI / 4 ) )
					 ){
						 var max = this.rotation.x;
						 if( max < this.rotation.y )
							 max = this.rotation.y;
						 if( max < this.rotation.z )
							 max = this.rotation.z;
					 var min = this.rotation.x;
							 if( min > this.rotation.y )
								 max = this.rotation.y;
							 if( min > this.rotation.z )
								 max = this.rotation.z;
						if( min < 0 )
							if( max < -min )
								max = -min;
						var t;
						for( t = 1; t < 100; t++ )
							if( ( max / t ) < ( Math.PI / 4 ))
								break;

						delta_accel.scale( 1 / t );
					 }
					*/
				}

	        };
	}
	return this._motion;
} );

THREE.Matrix4.prototype.__defineGetter__( "origin", function(){
	if( !this._origin ){
		var self = this;
		this._origin = new THREE.Vector3();
		Object.defineProperty(this, "_origin", { writable:false } );
		Object.defineProperty( this._origin, "x", {
			get : function(){
				return self.elements[12];
			},
			set : function(v){
				self.elements[12] = v;
			}
		})
		Object.defineProperty( this._origin, "y", {
			get : ()=>{
				return self.elements[13];
			},
			set : (v)=>{
				self.elements[13] = v;
			}
		})
		Object.defineProperty( this._origin, "z", {
			get : ()=>{
				return self.elements[14];
			},
			set : (v)=>{
				self.elements[14] = v;
			}
		})
	}
	return this._origin;
} );




THREE.Matrix4.prototype.rotateOrtho = function( angle, axis1, axis2 ) {
		if( !angle ) return;
		// 0 = x;  0
		// 1 = y;  4
		// 2 = z;  8
		var te = this.elements;
		var sa = Math.sin( angle );
		var ca = Math.cos( angle );
        switch( axis1 )	{
			case 0: switch( axis2 ){
				case 0:
					throw new Error( "Invalid axis combination, cannot rotate axis toward itself")
				break;
				case 1:
					var save1x = te[0], save1y = te[1], save1z = te[2];
					var tmp1x = te[0] * ca, tmp1y = te[1] * ca, tmp1z = te[2] * ca;
					var tmp2x = te[4] * sa, tmp2y = te[5] * sa, tmp2z = te[6] * sa;
					te[0] = tmp1x - tmp2x; te[1] = tmp1y - tmp2y; te[2] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[4] * ca; tmp1y = te[5] * ca; tmp1z = te[6] * ca;
					te[4] = tmp1x + tmp2x; te[5] = tmp1y + tmp2y; te[6] = tmp1z + tmp2z;
					break;
				case 2:
					var save1x = te[0], save1y = te[1], save1z = te[2];
					var tmp1x = te[0] * ca, tmp1y = te[1] * ca, tmp1z = te[2] * ca;
					var tmp2x = te[8] * sa, tmp2y = te[9] * sa, tmp2z = te[10] * sa;
					te[0] = tmp1x - tmp2x; te[1] = tmp1y - tmp2y; te[2] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[8] * ca; tmp1y = te[9] * ca; tmp1z = te[10] * ca;
					te[8] = tmp1x + tmp2x; te[9] = tmp1y + tmp2y; te[10] = tmp1z + tmp2z;
					break;
			}
			break;
			case 1: switch( axis2 ){
				case 0:
					var save1x = te[4], save1y = te[5], save1z = te[6];
					var tmp1x = te[4] * ca, tmp1y = te[5] * ca, tmp1z = te[6] * ca;
					var tmp2x = te[0] * sa, tmp2y = te[1] * sa, tmp2z = te[2] * sa;
					te[4] = tmp1x - tmp2x; te[5] = tmp1y - tmp2y; te[6] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[0] * ca; tmp1y = te[1] * ca; tmp1z = te[2] * ca;
					te[0] = tmp1x + tmp2x; te[1] = tmp1y + tmp2y; te[2] = tmp1z + tmp2z;
					break;
				case 1:
					throw new Error( "Invalid axis combination, cannot rotate axis toward itself")
				break;
				case 2:
					var save1x = te[4], save1y = te[5], save1z = te[6];
					var tmp1x = te[4] * ca, tmp1y = te[5] * ca, tmp1z = te[6] * ca;
					var tmp2x = te[8] * sa, tmp2y = te[9] * sa, tmp2z = te[10] * sa;
					te[4] = tmp1x - tmp2x; te[5] = tmp1y - tmp2y; te[6] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[8] * ca; tmp1y = te[9] * ca; tmp1z = te[10] * ca;
					te[8] = tmp1x + tmp2x; te[9] = tmp1y + tmp2y; te[10] = tmp1z + tmp2z;
				break;
			}
			break;
			case 2: switch( axis2 ){
				case 0:
					var save1x = te[8], save1y = te[9], save1z = te[10];
					var tmp1x = te[8] * ca, tmp1y = te[9] * ca, tmp1z = te[10] * ca;
					var tmp2x = te[0] * sa, tmp2y = te[1] * sa, tmp2z = te[2] * sa;
					te[8] = tmp1x - tmp2x; te[9] = tmp1y - tmp2y; te[10] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[0] * ca; tmp1y = te[1] * ca; tmp1z = te[2] * ca;
					te[0] = tmp1x + tmp2x; te[1] = tmp1y + tmp2y; te[2] = tmp1z + tmp2z;
				break;
				case 1:
					var save1x = te[8], save1y = te[9], save1z = te[10];
					var tmp1x = te[8] * ca, tmp1y = te[9] * ca, tmp1z = te[10] * ca;
					var tmp2x = te[4] * sa, tmp2y = te[5] * sa, tmp2z = te[6] * sa;
					te[8] = tmp1x - tmp2x; te[9] = tmp1y - tmp2y; te[10] = tmp1z - tmp2z;
					tmp2x = save1x * sa; tmp2y = save1y * sa; tmp2z = save1z * sa;
					tmp1x = te[4] * ca; tmp1y = te[5] * ca; tmp1z = te[6] * ca;
					te[4] = tmp1x + tmp2x; te[5] = tmp1y + tmp2y; te[6] = tmp1z + tmp2z;
				break;
				case 2:
					throw new Error( "Invalid axis combination, cannot rotate axis toward itself")
				break;
			}
			break;
		}
    };
	THREE.Matrix4.prototype.Translate = function(x,y,z) {
			this.origin.x = x;
			this.origin.y = y;
			this.origin.z = z;
	};
	THREE.Matrix4.prototype.rotateRelative = function( x, y, z ){
		//console.trace( "rotate starts as ", this )
		if( typeof this.tick === "undefined" ) this.tick = 0;
		switch( this.tick++ ) {
			case 0:
				this.rotateOrtho( x, 1, 2 );
				this.rotateOrtho( y, 0, 2 );
				this.rotateOrtho( z, 0, 1 );
				break;
			case 1:
				this.rotateOrtho( y, 0, 2 );
				this.rotateOrtho( x, 1, 2 );
				this.rotateOrtho( z, 0, 1 );
				break;
			case 2:
				this.rotateOrtho( z, 0, 1 );
				this.rotateOrtho( x, 1, 2 );
				this.rotateOrtho( y, 0, 2 );
				break;
			case 3:
				this.rotateOrtho( x, 1, 2 );
				this.rotateOrtho( z, 0, 1 );
				this.rotateOrtho( y, 0, 2 );
				break;
			case 4:
				this.rotateOrtho( y, 0, 2 );
				this.rotateOrtho( z, 0, 1 );
				this.rotateOrtho( x, 1, 2 );
				break;
			case 5:
				this.rotateOrtho( z, 0, 1 );
				this.rotateOrtho( y, 0, 2 );
				this.rotateOrtho( x, 1, 2 );
				this.tick = 0;
				break;
		}
	};
	THREE.Matrix4.prototype.__defineGetter__( "left", function(){
        	return THREE.Vector3Pool.new( this.elements[0], this.elements[1], this.elements[2] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "right", function(){
		return THREE.Vector3Pool.new( -this.elements[0], -this.elements[1], -this.elements[2] );
	} );
	THREE.Matrix4.prototype.__defineGetter__( "up", function(){
        	return THREE.Vector3Pool.new( this.elements[4], this.elements[5], this.elements[6] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "down", function(){
		return THREE.Vector3Pool.new( -this.elements[4], -this.elements[5], -this.elements[6] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "forward", function(){
        	return THREE.Vector3Pool.new( -this.elements[8], -this.elements[9], -this.elements[10] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "backward", function(){
		return THREE.Vector3Pool.new( this.elements[8], this.elements[9], this.elements[10] );
        } );
	THREE.Matrix4.prototype.move = function (tick) {
        	if( this.motion )
				this.motion.move( this, tick );
        	//this.origin.addScaledVector( this.forward, z ).addScaledVector( this.up, y ).addScaledVector( this.left, x )
		};
	THREE.Matrix4.prototype.moveNow = function ( x,y,z ) { this.origin.addScaledVector( this.forward, z ).addScaledVector( this.up, y ).addScaledVector( this.left, x ) };
	THREE.Matrix4.prototype.moveForward = function ( n ) { this.origin.addScaledVector( this.forward, n ); };
	THREE.Matrix4.prototype.moveUp = function ( n ) { this.origin.addScaledVector( this.up, n ); };
	THREE.Matrix4.prototype.moveLeft = function ( n ) { this.origin.addScaledVector( this.left, n ); };
	THREE.Matrix4.prototype.moveBackward = function ( n ) { this.origin.addScaledVector( this.backward, n ); };
	THREE.Matrix4.prototype.moveDown = function ( n ) { this.origin.addScaledVector( this.down, n ); };
	THREE.Matrix4.prototype.moveRight = function ( n ) { this.origin.addScaledVector( this.right, n ); };

	THREE.Matrix4.prototype.__defineGetter__( "inv_left", function(){
        	return Vector3Pool.new( this.elements[0], this.elements[4], this.elements[8] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "inv_up", function(){
        	return Vector3Pool.new( this.elements[1], this.elements[5], this.elements[9] );
        } );
	THREE.Matrix4.prototype.__defineGetter__( "inv_forward", function(){
        	return Vector3Pool.new( this.elements[2], this.elements[6], this.elements[10] );
        } );

	THREE.Matrix4.prototype.getRoll = function( relativeUp ) {
		//if( !relativeUp ) relativeUp = THREE.Vector3Up;
		return Math.asin( this.right.dot( relativeUp ) );
	};
	THREE.Matrix4.prototype.getPitch = function( relativeForward ) {
		//if( !relativeForward ) relativeForward = THREE.Vector3Forward;
		return Math.asin( this.up.dot( relativeForward ) );
	};
	THREE.Matrix4.prototype.getYaw = function( relativeRight ) {
		//if( !relativeRight ) relativeRight = THREE.Vector3Right;
		return Math.asin( this.forward.dot( relativeRight ) );
	};
	THREE.Matrix4.prototype.__defineGetter__( "roll", function(){
		return this.getRoll( THREE.Vector3Up );
	} );
	THREE.Matrix4.prototype.__defineGetter__( "pitch", function(){
		return this.getPitch( THREE.Vector3Forward );
	} );
	THREE.Matrix4.prototype.__defineGetter__( "yaw", function(){
		return this.getYaw( THREE.Vector3Right );
	} );
}

},{}],78:[function(require,module,exports){

if( typeof Voxelarium === "undefined" ){
    this.Voxelarium = {};
//	var Voxelarium;
}

Voxelarium = { VERSION : "0.0.1",
  Settings : {
     VR : true,
     AltSpace : true,
      use_basic_material : true,
      use_vive : true,
  }
};

if( typeof updateVoxelariumSettings === 'function' ){
  updateVoxelariumSettings();
}

Object.freeze( Voxelarium.Settings );

if(  THREE === null ) {
//	THREE = require( "./three.js.74/build/three.js")
}
	require( "./three.js/personalFill.js")

//if( Voxelarium.Settings.AltSpace )
//   var altspace = require( "./AltSpaceVR/dist/altspace.js" );

Voxelarium.Stats = (!Voxelarium.Settings.VR)?require( './three.js/js/stats.min.js' ):function(){};
if( !Voxelarium.Settings.AltSpace && Voxelarium.Settings.VR ) {
  require( './three.js/js/controls/VRControls.js' );
  require( './three.js/js/effects/VREffect.js' );

  require( './three.js/js/vr/ViveController.js' );
  require( './three.js/js/vr/PaintViveController.js' );
  require( './three.js/js/vr/WebVR.js' );
  require( './three.js/js/loaders/OBJLoader.js' );
}

Voxelarium.clock = new THREE.Clock()


if( !Voxelarium.Settings.VR ) {
  require( "./orbit_controls.js" )
  require( "./NaturalCamera.js" )
  require( "./gameMouse.js" )
}

if( !Voxelarium.Settings.use_basic_material )
	require( "./glow.renderer.js" );

require( "./src/three.js.example/Projector.js" )
require( "./src/three.js.post/shaders/CopyShader.js")
require( "./src/three.js.post/shaders/HorizontalBlurShader.js")
require( "./src/three.js.post/shaders/VerticalBlurShader.js")
//require( "./src/three.js.post/shaders/ConvolutionShader.js")
//require( "./src/three.js.post/shaders/DotScreenShader.js")
//require( "./src/three.js.post/shaders/FilmShader.js")
require( "./src/three.js.post/EffectComposer.js")
require( "./src/three.js.post/BloomPass.js")


//require( "./src/three.js.post/AdaptiveToneMappingPass.js")
//require( "./src/three.js.post/BokehPass.js")
require( "./src/three.js.post/ClearPass.js")
//require( "./src/three.js.post/DotScreenPass.js")
//require( "./src/three.js.post/FilmPass.js")
//require( "./src/three.js.post/GlitchPass.js")
//require( "./src/three.js.post/ManualMSAARenderPass.js")
require( "./src/three.js.post/MaskPass.js")
require( "./src/three.js.post/RenderPass.js")
//require( "./src/three.js.post/SavePass.js")
require( "./src/three.js.post/ShaderPass.js")
//require( "./src/three.js.post/SMAAPass.js")
//require( "./src/three.js.post/TAARenderPass.js")
require( "./src/three.js.post/TexturePass.js")

Voxelarium.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.001, 10000 );
//console.log( Voxelarium.camera.projectionMatrix.toArray() )
require( "./src/voxelarium.gun.db.js" )

//--- fonts ---
Voxelarium.Fonts = {};
require( "./src/fonts/TI99.js")
//require( "./src/fonts/msyh1.js")

require( "./src/constants.js")
require( "./src/bitstream.js")  // read and write bits

require( "./src/sector.js")
require( "./src/cluster.js")
require( "./src/world.js")

require( "./src/geometrybasicbuffer.js")
require( "./src/geometrybuffer.js")
require( "./src/geometrymaterial.js")
require( "./src/geometrybuffer.mono.js")
require( "./src/geometrymaterial.mono.js")
require( "./src/textureAtlas.canvas.js")

require( "./src/voxelSelector.js")

require( "./src/sorting.tree.js")
require( "./src/mesher.basic.js")

require( "./src/voxels.js" )  // must be after atlas


require( "./src/voxel_inventory.js")  // must be after voxels
//Object.freeze( Voxelarium );
//Voxelarium.freeze();

},{"./NaturalCamera.js":1,"./gameMouse.js":2,"./glow.renderer.js":3,"./orbit_controls.js":36,"./src/bitstream.js":37,"./src/cluster.js":38,"./src/constants.js":39,"./src/fonts/TI99.js":40,"./src/geometrybasicbuffer.js":41,"./src/geometrybuffer.js":42,"./src/geometrybuffer.mono.js":43,"./src/geometrymaterial.js":44,"./src/geometrymaterial.mono.js":45,"./src/mesher.basic.js":46,"./src/sector.js":50,"./src/sorting.tree.js":51,"./src/textureAtlas.canvas.js":52,"./src/three.js.example/Projector.js":53,"./src/three.js.post/BloomPass.js":54,"./src/three.js.post/ClearPass.js":55,"./src/three.js.post/EffectComposer.js":56,"./src/three.js.post/MaskPass.js":57,"./src/three.js.post/RenderPass.js":58,"./src/three.js.post/ShaderPass.js":59,"./src/three.js.post/TexturePass.js":60,"./src/three.js.post/shaders/CopyShader.js":61,"./src/three.js.post/shaders/HorizontalBlurShader.js":62,"./src/three.js.post/shaders/VerticalBlurShader.js":63,"./src/voxelSelector.js":65,"./src/voxel_inventory.js":66,"./src/voxelarium.gun.db.js":67,"./src/voxels.js":68,"./src/world.js":69,"./three.js/js/controls/VRControls.js":70,"./three.js/js/effects/VREffect.js":71,"./three.js/js/loaders/OBJLoader.js":72,"./three.js/js/stats.min.js":73,"./three.js/js/vr/PaintViveController.js":74,"./three.js/js/vr/ViveController.js":75,"./three.js/js/vr/WebVR.js":76,"./three.js/personalFill.js":77}]},{},[78]);
