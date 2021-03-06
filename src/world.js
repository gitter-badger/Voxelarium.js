
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
