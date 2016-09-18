
var Gun = require( "gun" );

var db = {};

Voxelarium.db = db;

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
            sector.decode( val )
        }
      }

}

function addListener( sector ) {
  var where = `sector.${sector.pos.x>>2}.${sector.pos.y>>2}.${sector.pos.z>>2}`
  if( db.world.listeners.findIndex( (val)=>where===val ) < 0 ) {
    db.world.listeners.push( where );
    db.world.db.path( where ).on( (data)=>{ sectorUpdated(sector,data) }, { delta: true } )
    return false;
  }
}
function getPath( sector ) {
  return `sector.${sector.pos.x>>2}.${sector.pos.y>>2}.${sector.pos.z>>2}.${sector.pos.x&3}${sector.pos.y&3}${sector.pos.z&3}`
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
            Voxelarium.camera.matrix.origin.copy( o );
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

function loadVoxels(val) {
    console.log( "realod code and texture from database...")
    //val.map( "voxelTypes")
}
function loadVoxels2(val) {
    console.log( "realod code and texture from database...")
    //val.map( "voxelTypes")
}

function initialVoxelTypeLoad(cb) {
    Voxelarium.Voxels.load( ()=>{
        var branch = db.world.voxelInfo;
        var code = branch.path( "code" );
        var texture = branch.path( "texture" );
        Voxelarium.Voxels.types.forEach( (type)=>{
            code.path( type.ID ).put( type.codeData );
            texture.path( type.ID ).put( type.textureData );
        });
        cb();
    });
}

function loadWorld( cb ) {
    ( db.world.voxelInfo = db.world.db.path( "voxelInfo" ) ).not( ()=>{initialVoxelTypeLoad(cb) }).val( loadVoxels );

}

function doDefaultInit() {
    db.player.id = new Date().getTime();
    db.player.world_id = 0;
    db.player.local.path("id").put( db.player.id )
    db.player.local.path("world_id").put( db.player.world_id )
    // the val() in init will fire here; so global gets initialized in normal path...
}

var defaultTimeout;
db.init = function( cb ) {
     defaultTimeout = setTimeout( doDefaultInit, 250 );
    db.player.local.path("id").not( doDefaultInit ).val( (data)=>{
        clearTimeout( defaultTimeout );
        db.player.id = data;
        db.player.global = db.globalDb.path( "player" ).path( data );
        db.player.local.path("world_id").val( (data)=> {
          db.player.world_id = data;
          db.world.db = db.globalDb.path( "world" ).path( db.player.world_id );
          setupEvents(cb);
          //if( cb ) cb();
        } );
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
      this.db.path(getPath(sector)).put( sector.stringify() );
      //console.log( "put-ed sector update " )
}

function loadSector( sector ) {
      addListener( sector );
      //this.db.path(getPath(sector)).on( cb );
}

//gun.get( `org.d3x0r.voxelarium.universe.${universe}.player.${self}`)