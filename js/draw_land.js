/**
 * Created by vizlab on 15/03/25.
 */

    //地形描画の関数はデータが全て東経かつ北緯前提なので西経や南緯だとおかしくなる→add2DPolygonで特殊処理している（北緯0度以下は描画しない、西経120度は東経240度として扱う）

var GROUND_COLOR={h:0.3,s:0.5,l:0.0};
var land_mesh;


function AbsEastLongitude(lon)
{
    if(lon < 0){
        return(360+lon);
    }
    return lon;
}

function add2DPolygon(coordinate,group,material)
{
    for(var i=0;i<coordinate.length;i++){
        if(coordinate[i][1] < 0){
            return;
        }
    }
    for(var i=0;i<coordinate.length;i++){  //西経と東経の境目でおかしくなるからその部分は描画しない
        if(Math.abs(coordinate[i][0])<10){
            return;
        }
    }
    var path = new THREE.Shape();
    var coord_lon = AbsEastLongitude(coordinate[0][0]) * 10.0;
    var coord_lat = FromLatToMapGrid(coordinate[0][1]);
    path.moveTo(coord_lon,coord_lat);
    for(var i=1;i<coordinate.length;i++){
        coord_lon = AbsEastLongitude(coordinate[i][0]) * 10.0;
        coord_lat = FromLatToMapGrid(coordinate[i][1]);
        path.lineTo(coord_lon,coord_lat);
    }
    //console.log(path);
    group.add(new THREE.Mesh(path.makeGeometry(),material));
    //console.log(coordinate);
    return;
}

function draw_land()
{
    map_scene.remove(land_mesh);

    d3.json("./geometry/world.json",function(error,world){
        //console.log(world);
        //console.log(world.objects.countries);
        var feature = world.features;
        var group = new THREE.Object3D();
        var material = new THREE.MeshBasicMaterial({
            color:0x000000,
            side:THREE.DoubleSide
        });
        for(var i=0;i<feature.length;i++){
            if(feature[i].geometry.type=='MultiPolygon'){
                for(var j=0;j<feature[i].geometry.coordinates.length;j++){
                    add2DPolygon(feature[i].geometry.coordinates[j][0],group,material);
                }
            }
        }
        map_scene.add(group);
        /*
        geo = topojson.feature(world,world.objects.countries);
        //geo = topojson.feature(world,world.objects);
        //console.log(geo.features);
        feature = geo.features;
        geo = world.objects.countries.geometries;
        var group = new THREE.Object3D();
        var material = new THREE.MeshBasicMaterial({
            color:0x000000,
            side:THREE.DoubleSide
        });
        for(var i=0;i<feature.length;i++){
            if(geo[i].type == 'Polygon'){
                //console.log(feature[i].geometry.coordinates);
                add2DPolygon(feature[i].geometry.coordinates[0],group,material);
            }
            if(geo[i].type == 'MultiPolygon'){
                for(var j=0;j<feature[i].geometry.coordinates.length;j++){
                    //console.log(feature[i].geometry.coordinates[j])
                    add2DPolygon(feature[i].geometry.coordinates[j][0],group,material);
                }
                //console.log(geo[i]);
            }
        }
        map_scene.add(group);
        */
    });
    console.log("draw land");
    return;


    var dfds = [];
    dfds.push(loadMOVEdata(0, 0, 0, 441, 0, 672, "U"));


    return jQuery.when.apply(
        $,dfds
    ).then(function () {
            var ground = arguments[0];

            var x_grid_org = Longitude.min * 10.0;
            var x_grid = x_grid_org;
            var y_grid = Latitude.min * 10.0;
            var geometry = new THREE.Geometry();
            for (var y = 0; y < ground.data.length - 1; y++) {
                for (var x = 0; x < ground.data[0].length - 1; x++) {
                    //var x_grid_step = MapGrid.width * (LatLon.Longitude.data[x+1]-LatLon.Longitude.data[x]) /(Longitude.max - Longitude.min);
                    //var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y]) /(Latitude.max - Latitude.min);

                    //メルカトルだと緯度が高いときyがのびる

                    var x_grid_step = (LatLon.Longitude.data[x + 1] - LatLon.Longitude.data[x]) * 10.0;
                    //var y_grid_step = (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y])*10.0;
                    var y_grid_step = FromLatToMapGrid(LatLon.Latitude.data[y + 1]) - FromLatToMapGrid(LatLon.Latitude.data[y]);

                    geometry.vertices.push(new THREE.Vector3(x_grid, y_grid, 1));
                    geometry.vertices.push(new THREE.Vector3(x_grid + x_grid_step, y_grid, 1));
                    geometry.vertices.push(new THREE.Vector3(x_grid + x_grid_step, y_grid + y_grid_step, 1));
                    geometry.vertices.push(new THREE.Vector3(x_grid, y_grid + y_grid_step, 1));
                    x_grid += x_grid_step;

                    var color0 = new THREE.Color();
                    var color1 = new THREE.Color();
                    var color2 = new THREE.Color();
                    var color3 = new THREE.Color();

                    var tmp_color0 = ground_color(ground.data[y][x]);
                    var tmp_color1 = ground_color(ground.data[y][x + 1]);
                    var tmp_color2 = ground_color(ground.data[y + 1][x + 1]);
                    var tmp_color3 = ground_color(ground.data[y + 1][x]);
                    color0.setHSL(tmp_color0.h, tmp_color0.s, tmp_color0.l);
                    color1.setHSL(tmp_color1.h, tmp_color1.s, tmp_color1.l);
                    color2.setHSL(tmp_color2.h, tmp_color2.s, tmp_color2.l);
                    color3.setHSL(tmp_color3.h, tmp_color3.s, tmp_color3.l);

                    var coord_index = y * (ground.data[0].length - 1) * 4 + x * 4;
                    var face1 = new THREE.Face3(coord_index, coord_index + 1, coord_index + 3);
                    face1.vertexColors[0] = color0;
                    face1.vertexColors[1] = color1;
                    face1.vertexColors[2] = color3;

                    var face2 = new THREE.Face3(coord_index + 1, coord_index + 2, coord_index + 3);
                    face2.vertexColors[0] = color1;
                    face2.vertexColors[1] = color2;
                    face2.vertexColors[2] = color3;

                    if(tmp_color0 == GROUND_COLOR && tmp_color1 == GROUND_COLOR && tmp_color3 == GROUND_COLOR) {
                        geometry.faces.push(face1);
                    }
                    if(tmp_color2 == GROUND_COLOR && tmp_color1 == GROUND_COLOR && tmp_color3 == GROUND_COLOR) {
                        geometry.faces.push(face2);
                    }
                }
                var y_grid_step = FromLatToMapGrid(LatLon.Latitude.data[y + 1]) - FromLatToMapGrid(LatLon.Latitude.data[y]);
                x_grid = x_grid_org;
                y_grid += y_grid_step;
            }
            var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
                vertexColors: THREE.VertexColors,
                side: THREE.FrontSide,
                opacity: 1.0,
                transparent: true
            });
            land_mesh = new THREE.Mesh(geometry, material_triangle);
            geometry.dispose();
            material_triangle.dispose();
            //var light = new THREE.DirectionalLight("#AAAAAA");
            //light.position.set(0,0,100);
            map_scene.add(land_mesh);
        });
}

function ground_color(value)
{
    if(value < -9.989999710577421e+20){
        return(GROUND_COLOR);
    }else{
        var color = {
            h:0.1,
            s:0,
            l:0
        };
        return(color);
    }
}