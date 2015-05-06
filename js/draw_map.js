/**
 * Created by vizlab on 15/03/26.
 */


//地図は完全固定サイズ. カメラ位置を変えることで見える部分を変える
var camera_position = {x:0,y:0};

var map_renderer = new THREE.WebGLRenderer({antialias: true});
map_renderer.shadowMapEnabled = false;

var map_camera = new THREE.OrthographicCamera(0, 1000, 1000, 0, 0.01, 100);
var map_scene = new THREE.Scene();
//new webglrenderer()するとコンソールログが出る


var MapGrid = {width:834, height:502};

var gmap;

google.maps.event.addDomListener(window, 'load', function() {
    var mapDom = document.getElementById("gmap");
    var options = {
        zoom: 4,
        center: new google.maps.LatLng(40, 150),
        mapTypeId: google.maps.MapTypeId.TERRAIN,  //SATELLITE
        mapTypeControl:false,
        streetViewControl:false,
        panControl:false
    };
    var points = [
        new google.maps.LatLng(40,150),
        new google.maps.LatLng(43,150),
        new google.maps.LatLng(46,160)
    ];

    var polygonOpt = {
        geodesic: false,
        path:points,
        strokeOpacity:0.0,
        fillColor:"#000000",
        fillOpacity:1.0,
        clickable:false
    };

    var polygon = new google.maps.Polygon(polygonOpt);

    gmap = new google.maps.Map(mapDom, options);
    polygon.setMap(gmap);
});


function draw_map(Data)
{
    //draw_polygon(Data);
    if(document.getElementById("LineOnOff").checked){
        //draw_line(Data);
    }



    var points = [
        new google.maps.LatLng(40,150),
        new google.maps.LatLng(43,150),
        new google.maps.LatLng(46,160)
    ];

    var polygonOpt = {
        path:points,
        strokeOpacity:0.0,
        fillColor:"#ff0000",
        fillOpacity:1.0,
        clickable:false
    };

    var heatdata = new Array();

    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            pos = new google.maps.LatLng(26+i,150+j);
            heatdata.push({
                location:pos,
                weight:i*10+j
            });
        }
    }

    var heatmap = new google.maps.visualization.HeatmapLayer({
        radius:15, //ヒートマップの各ポイントの大きさ
        opacity:1.0
    });

    heatmap.setData(heatdata);
    heatmap.setMap(gmap);

    var polygon = new google.maps.Polygon(polygonOpt);
console.log(gmap);
    polygon.setMap(gmap);

    //マウスイベント
    var mousedown = false;
    var mouselocation ={x:0,y:0};
    map_renderer.domElement.addEventListener('mousedown',function(e){
        mousedown = true;
        mouselocation = {x: e.pageX, y: e.pageY};
    },false);
    map_renderer.domElement.addEventListener('mousemove', function(e){
        if(!mousedown) return;
        moveDistance = {x: mouselocation.x - e.pageX, y: mouselocation.y - e.pageY};
        camera_position.x += moveDistance.x/map_scale;
        camera_position.y -= moveDistance.y/map_scale;
        map_camera.position.set(camera_position.x,camera_position.y,100);
        mouselocation = {x: e.pageX, y: e.pageY};
    }, false);

    map_renderer.domElement.addEventListener('mouseup', function(e){
        mousedown = false;
    }, false);


    //縮尺変更中はマウスホイールのスクロールを無効にしている

    var map_scale = 1.0;

    map_renderer.domElement.addEventListener('mousewheel', function(e){
        mousedown = false;
        var wheel_delta = e.detail ? e.detail / -3 : e.wheelDelta / 120;
        if(e.preventDefault()){
            e.preventDefault();
        }
        e.returnValue = false;
        if(wheel_delta > 0){
            map_scale += 0.2;
        }else{
            if(map_scale > 1.0) {
                map_scale -= 0.2;
            }
        }
        console.log(wheel_delta);
        var scaled_width = MapGrid.width/map_scale;
        var scaled_height = MapGrid.height/map_scale;
        var center_Grid = {x:(Longitude.max*10.0+Longitude.min*10.0)/2.0, y:(Latitude.max*10.0+Latitude.min*10.0)/2.0};
        map_camera = new THREE.OrthographicCamera(center_Grid.x-scaled_width/2.0,center_Grid.x+scaled_width/2.0,center_Grid.y+scaled_height/2.0,center_Grid.y-scaled_height/2.0, 0.01, 3000);
        map_camera.position.set(0, 0, 1);
        map_camera.lookAt({x: 0, y: 0, z: 0});
        map_camera.position.set(camera_position.x, camera_position.y, 100);
    }, false);
}

function draw_line(Data)
{
    if(Data.line == undefined){
        console.log("there is no line data");
        return 0;
    }
    var line = new Array(Data.line.length);
    var geo = new Array(Data.line.length);

    for(var i=0;i<Data.line.length;i++){
        geo[i] = new THREE.Geometry();
        for(var j=0;j<Data.line[i].vertices.length;j++) {
            geo[i].vertices.push(Data.line[i].vertices[j]);
        }
        line[i] = new THREE.Line(geo[i], new THREE.LineBasicMaterial({color:0xff00ff,linewidth:5}));
        map_scene.add(line[i]);
    }
}

function draw_polygon(SecondInvariant)
{
    updateSecondInvariantMinMax();

    var width = MapGrid.width;
    var height = MapGrid.height;
    geometry = new THREE.Geometry();

    geometry = CreateGeometry(SecondInvariant);

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.FrontSide,
        opacity: 0,
        transparent: false
    });
    //var mesh_triangle = new THREE.Mesh(geometry, material_triangle, mesh_triangle);
    var mesh_triangle = new THREE.Mesh(geometry, material_triangle);

    //var light = new THREE.DirectionalLight("#AAAAAA");
    //light.position.set(0,0,100);
    map_scene = new THREE.Scene();
    map_scene.add(mesh_triangle);
    //map_scene.add(light);

    mesh_triangle.position.set(0, 0, 0);

    geometry.dispose();
    material_triangle.dispose();

    map_renderer.clear();

    map_renderer.setSize(width, height);
    map_renderer.setClearColor(0xaaaaaa, 1);
    map_renderer.shadowMapEnabled = false;
    document.getElementById("mapArea").appendChild(map_renderer.domElement);
    document.getElementById("mapArea").setAttribute("width",width);
    document.getElementById("mapArea").setAttribute("height",height);

    var lon = MapGrid.width * (Longitude.max - Longitude.min)/(LatLon.Longitude.data[LatLon.Longitude.data.length-1] - LatLon.Longitude.data[0]);
    var lat = MapGrid.height * (Latitude.max - Latitude.min)/(LatLon.Latitude.data[LatLon.Latitude.data.length-1] - LatLon.Latitude.data[0]);

    map_camera = new THREE.OrthographicCamera(Longitude.min*10.0,Longitude.max*10.0,Latitude.max*10.0,Latitude.min*10.0, 0.01, 3000);
    map_camera.position.set(0, 0, 1);
    map_camera.lookAt({x: 0, y: 0, z: 0});
    map_camera.position.set(camera_position.x, camera_position.y, 100);
}



function CreateGeometry(SecondInvariant)
{
    var x_grid_org = Longitude.min*10.0;
    var x_grid = x_grid_org;
    var y_grid = Latitude.min*10.0;
    var geometry = new THREE.Geometry();
    for(var y=0;y<SecondInvariant.data.length-1;y++){
        for(var x=0;x<SecondInvariant.data[0].length-1;x++){
            //var x_grid_step = MapGrid.width * (LatLon.Longitude.data[x+1]-LatLon.Longitude.data[x]) /(Longitude.max - Longitude.min);
            //var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y]) /(Latitude.max - Latitude.min);
            var x_grid_step = MapGrid.width * (LatLon.Longitude.data[x+1]-LatLon.Longitude.data[x]) /(LatLon.Longitude.data[LatLon.Longitude.data.length-1]-LatLon.Longitude.data[0]);
            var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y])/(LatLon.Latitude.data[LatLon.Latitude.data.length-1]-LatLon.Latitude.data[0]);

            geometry.vertices.push(new THREE.Vector3(x_grid, y_grid, 0));
            geometry.vertices.push(new THREE.Vector3(x_grid+x_grid_step, y_grid, 0));
            geometry.vertices.push(new THREE.Vector3(x_grid+x_grid_step, y_grid+y_grid_step, 0));
            geometry.vertices.push(new THREE.Vector3(x_grid, y_grid+y_grid_step, 0));
            x_grid += x_grid_step;

            var color0 = new THREE.Color();
            var color1 = new THREE.Color();
            var color2 = new THREE.Color();
            var color3 = new THREE.Color();
            /*
             var tmp_color0 = SecondInvariantToRGB(SecondInvariant.data[y][x]);
             var tmp_color1 = SecondInvariantToRGB(SecondInvariant.data[y][x+1]);
             var tmp_color2 = SecondInvariantToRGB(SecondInvariant.data[y+1][x+1]);
             var tmp_color3 = SecondInvariantToRGB(SecondInvariant.data[y+1][x]);
             color0.setRGB(tmp_color0.red,tmp_color0.green,tmp_color0.blue);
             color1.setRGB(tmp_color1.red,tmp_color1.green,tmp_color1.blue);
             color2.setRGB(tmp_color2.red,tmp_color2.green,tmp_color2.blue);
             color3.setRGB(tmp_color3.red,tmp_color3.green,tmp_color3.blue);
             */

            var tmp_color0 = SecondInvariantToHSL_white(SecondInvariant.data[y][x]);
            var tmp_color1 = SecondInvariantToHSL_white(SecondInvariant.data[y][x+1]);
            var tmp_color2 = SecondInvariantToHSL_white(SecondInvariant.data[y+1][x+1]);
            var tmp_color3 = SecondInvariantToHSL_white(SecondInvariant.data[y+1][x]);
            color0.setHSL(tmp_color0.h,tmp_color0.s,tmp_color0.l);
            color1.setHSL(tmp_color1.h,tmp_color1.s,tmp_color1.l);
            color2.setHSL(tmp_color2.h,tmp_color2.s,tmp_color2.l);
            color3.setHSL(tmp_color3.h,tmp_color3.s,tmp_color3.l);

            /*
             var tmp_color0 = VortexTypeToHSL_white(SecondInvariant.vortex_type[y][x]);
             var tmp_color1 = VortexTypeToHSL_white(SecondInvariant.vortex_type[y][x+1]);
             var tmp_color2 = VortexTypeToHSL_white(SecondInvariant.vortex_type[y+1][x+1]);
             var tmp_color3 = VortexTypeToHSL_white(SecondInvariant.vortex_type[y+1][x]);
             color0.setHSL(tmp_color0.h,tmp_color0.s,tmp_color0.l);
             color1.setHSL(tmp_color1.h,tmp_color1.s,tmp_color1.l);
             color2.setHSL(tmp_color2.h,tmp_color2.s,tmp_color2.l);
             color3.setHSL(tmp_color3.h,tmp_color3.s,tmp_color3.l);
             */
            var coord_index = y*(SecondInvariant.data[0].length-1)*4 + x*4;
            var face1 = new THREE.Face3(coord_index, coord_index + 1, coord_index + 3);
            face1.vertexColors[0] = color0;
            face1.vertexColors[1] = color1;
            face1.vertexColors[2] = color3;

            var face2 = new THREE.Face3(coord_index+1, coord_index + 2, coord_index + 3);
            face2.vertexColors[0] = color1;
            face2.vertexColors[1] = color2;
            face2.vertexColors[2] = color3;

            geometry.faces.push(face1);
            geometry.faces.push(face2);
        }
        var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y])/(LatLon.Latitude.data[LatLon.Latitude.data.length-1]-LatLon.Latitude.data[0]);
        //var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y]) /(Latitude.max - Latitude.min);
        x_grid = x_grid_org;
        y_grid += y_grid_step;
    }
    return geometry;
}

var colorlegend_min = -60;
var colorlegend_max = 60;
var legend_renderer = new THREE.WebGLRenderer();

function addColorLegend_Vertical()
{
    var width = 30;
    var height = 400;
    var legend_geometry = new THREE.Geometry();

    if(height < 3){
        console.log("color legend's height wrong");
    }

    for(var i=0;i<height-1;i++){
        legend_geometry.vertices.push(new THREE.Vector3(0, i, 0));
        legend_geometry.vertices.push(new THREE.Vector3(0+width, i, 0));
        legend_geometry.vertices.push(new THREE.Vector3(0+width, i+1, 0));
        legend_geometry.vertices.push(new THREE.Vector3(0, i+1, 0));

        //var legend_step = 1.0 / (height-1.0) * (colorlegend_max-colorlegend_min);
        var legend_step = (colorlegend_max-colorlegend_min) / (height-1.0) ;

        var tmp_color0 = SecondInvariantToHSL_white(i*legend_step+colorlegend_min);
        var tmp_color1 = SecondInvariantToHSL_white(i*legend_step+colorlegend_min);
        var tmp_color2 = SecondInvariantToHSL_white((i+1.0)*legend_step+colorlegend_min);
        var tmp_color3 = SecondInvariantToHSL_white((i+1.0)*legend_step+colorlegend_min);

        var color0 = new THREE.Color();
        var color1 = new THREE.Color();
        var color2 = new THREE.Color();
        var color3 = new THREE.Color();

        color0.setHSL(tmp_color0.h,tmp_color0.s,tmp_color0.l);
        color1.setHSL(tmp_color1.h,tmp_color1.s,tmp_color1.l);
        color2.setHSL(tmp_color2.h,tmp_color2.s,tmp_color2.l);
        color3.setHSL(tmp_color3.h,tmp_color3.s,tmp_color3.l);

        var coord_index = i*4;
        var face1 = new THREE.Face3(coord_index, coord_index + 1, coord_index + 3);
        face1.vertexColors[0] = color0;
        face1.vertexColors[1] = color1;
        face1.vertexColors[2] = color3;

        var face2 = new THREE.Face3(coord_index+1, coord_index + 2, coord_index + 3);
        face2.vertexColors[0] = color1;
        face2.vertexColors[1] = color2;
        face2.vertexColors[2] = color3;

        legend_geometry.faces.push(face1);
        legend_geometry.faces.push(face2);
    }

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.FrontSide,
        opacity: 0,
        transparent: false
    });

    var mesh_triangle = new THREE.Mesh(legend_geometry, material_triangle);

    //var light = new THREE.DirectionalLight("#AAAAAA");
    //light.position.set(0,0,100);
    var legend_scene = new THREE.Scene();
    legend_scene.add(mesh_triangle);
    //legend_scene.add(light);

    mesh_triangle.position.set(0, 0, 0);

    legend_geometry.dispose();
    material_triangle.dispose();

    legend_renderer = new THREE.WebGLRenderer();
    legend_renderer.setSize(width+100, height);
    legend_renderer.setClearColor(0xffffff, 1);
    legend_renderer.shadowMapEnabled = false;
    document.getElementById("ColorLegend").appendChild(legend_renderer.domElement);
    document.getElementById("ColorLegend").setAttribute("width",width);
    document.getElementById("ColorLegend").setAttribute("height",height);

    //legend_camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    var legend_camera = new THREE.OrthographicCamera(-width/2-50, width/2+50, height/2, -height/2, 0.01, 1000);
    legend_camera.position.set(0, 0, 1);
    legend_camera.lookAt({x: 0, y: 0, z: 0});
    legend_camera.position.set(width/2+50, height/2, 30);
    legend_renderer.render(map_scene, legend_camera);
}

function addColorLegend_Horizontal()
{
    var width = 400;
    var height = 30;
    var legend_geometry = new THREE.Geometry();

    if(height < 3){
        console.log("color legend's height wrong");
    }

    for(var i=0;i<width-1;i++){
        legend_geometry.vertices.push(new THREE.Vector3(i, 0, 0));
        legend_geometry.vertices.push(new THREE.Vector3(i+1, 0, 0));
        legend_geometry.vertices.push(new THREE.Vector3(i+1, 0+height, 0));
        legend_geometry.vertices.push(new THREE.Vector3(i, 0+height, 0));

        //var legend_step = 1.0 / (height-1.0) * (colorlegend_max-colorlegend_min);
        var legend_step = (colorlegend_max-colorlegend_min) / (width-1.0) ;

        var tmp_color0 = SecondInvariantToHSL_white(i*legend_step+colorlegend_min);
        var tmp_color3 = SecondInvariantToHSL_white(i*legend_step+colorlegend_min);
        var tmp_color1 = SecondInvariantToHSL_white((i+1.0)*legend_step+colorlegend_min);
        var tmp_color2 = SecondInvariantToHSL_white((i+1.0)*legend_step+colorlegend_min);

        var color0 = new THREE.Color();
        var color1 = new THREE.Color();
        var color2 = new THREE.Color();
        var color3 = new THREE.Color();

        color0.setHSL(tmp_color0.h,tmp_color0.s,tmp_color0.l);
        color3.setHSL(tmp_color1.h,tmp_color1.s,tmp_color1.l);
        color1.setHSL(tmp_color2.h,tmp_color2.s,tmp_color2.l);
        color2.setHSL(tmp_color3.h,tmp_color3.s,tmp_color3.l);

        var coord_index = i*4;
        var face1 = new THREE.Face3(coord_index, coord_index + 1, coord_index + 3);
        face1.vertexColors[0] = color0;
        face1.vertexColors[1] = color1;
        face1.vertexColors[2] = color3;

        var face2 = new THREE.Face3(coord_index+1, coord_index + 2, coord_index + 3);
        face2.vertexColors[0] = color1;
        face2.vertexColors[1] = color2;
        face2.vertexColors[2] = color3;

        legend_geometry.faces.push(face1);
        legend_geometry.faces.push(face2);
    }

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.FrontSide,
        opacity: 0,
        transparent: false
    });

    var mesh_triangle = new THREE.Mesh(legend_geometry, material_triangle);

    //var light = new THREE.DirectionalLight("#AAAAAA");
    //light.position.set(0,0,100);
    var legend_scene = new THREE.Scene();
    legend_scene.add(mesh_triangle);
    //legend_scene.add(light);

    var textGeoMin = new THREE.TextGeometry(colorlegend_min,{
        size: 13,
        height: 20
    }) ;
    var textMaterialMin = new THREE.MeshBasicMaterial({color:0x000000});
    var textMin = new THREE.Mesh(textGeoMin, textMaterialMin);
    textMin.position.set(0,-15,100);
    textMin.doubleSided=true;
    legend_scene.add( textMin );

    var textGeoMax = new THREE.TextGeometry(colorlegend_max,{
        size: 13,
        height: 20
    }) ;
    var textMaterialMax = new THREE.MeshBasicMaterial({color:0x000000});
    var textMax = new THREE.Mesh(textGeoMax, textMaterialMax);
    textMax.position.set(370,-15,100);
    textMax.doubleSided=true;
    legend_scene.add( textMax );

    mesh_triangle.position.set(0, 0, 0);

    legend_geometry.dispose();
    material_triangle.dispose();

    legend_renderer.setSize(width, height+40);
    legend_renderer.setClearColor(0xffffff, 1);
    legend_renderer.shadowMapEnabled = false;
    document.getElementById("ColorLegend").appendChild(legend_renderer.domElement);
    document.getElementById("ColorLegend").setAttribute("width",width);
    document.getElementById("ColorLegend").setAttribute("height",height);

    //legend_camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    var legend_camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2-40, 0.01, 1000);
    legend_camera.position.set(0, 0, 1);
    legend_camera.lookAt({x: 0, y: 0, z: 0});
    legend_camera.position.set(width/2, height/2, 300);
    legend_renderer.render(legend_scene, legend_camera);
}

var interpolate_rgb = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range(["blue","green","red"]).clamp(true);
//関数内で定義したら時間がかかった->何度もこれを実行するから
function SecondInvariantToRGB(value)
{
    //陸地の処理
    if(value < -5000){
        var color_land = {
            red:0.1,
            green:0.1,
            blue:0.1
        };
        return(color_land);
    }

    value_rgb_string = interpolate_rgb(value);

    value_hex = {
        red:value_rgb_string.slice(1,3),
        green:value_rgb_string.slice(3,5),
        blue:value_rgb_string.slice(5,7)
    };
    //console.log(value_hex);
    var color = {
        red:parseInt(value_hex.red,16)/256.0,
        green:parseInt(value_hex.green,16)/256.0,
        blue:parseInt(value_hex.blue,16)/256.0
    };
    return(color);
}

var interpolate_hsl = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0.66,0.33,0]).clamp(true);  //hslでは0.66が青で0が赤
function SecondInvariantToHSL(value)
{
    //陸地の処理
    if(value < -5000){
        var color_land = {
            h:0.1,
            s:0,
            l:0
        };
        return(color_land);
    }

    var hofhsl = interpolate_hsl(value);
    //console.log(value_hex);
    var color = {
        h:hofhsl,
        s:1.0,
        l:0.5
    };
    return(color);
}

var interpolate_white = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0,0.5,1]).clamp(true);  //hslでは0.66が青で0が赤
function SecondInvariantToHSL_white(value)
{
    //陸地の処理
    if(value < -5000){
        var color_land = {
            h:0.1,
            s:0,
            l:0
        };
        return(color_land);
    }

    var location = interpolate_white(value);
    //console.log(value_hex);
    if(location >= 0.5){
        var color = {
            h:0,
            s:1.0,
            l:1.5 - location
        };
        return color;
    }else{
        var color = {
            h:0.66,
            s:1.0,
            l:location+0.5
        };
        return color;
    }
    return(color);
}

function VortexTypeToHSL_white(value)
{
    if(value == "stable"){
        var color = {
            h:0,
            s:1.0,
            l:0.6
        };
        return color;
    }
    if(value == "unstable"){
        var color = {
            h:0.66,
            s:1.0,
            l:0.6
        };
        return color;
    }
    var color = {
        h:0,
        s:0,
        l:0
    };
    return(color);
}

function updateSecondInvariantMinMax()
{
    colorlegend_min = eval(document.forms.SecondInvariant.SecondInvariantMin.value);
    colorlegend_max = eval(document.forms.SecondInvariant.SecondInvariantMax.value);
    interpolate_white = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0,0.5,1]).clamp(true);
    interpolate_hsl = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0.66,0.33,0]).clamp(true);
    interpolate_rgb = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range(["blue","green","red"]).clamp(true);
}
