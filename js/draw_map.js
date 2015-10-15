/**
 * Created by vizlab on 15/03/26.
 */

//地図は経度1度が10pxになるようにしているから地球一周は3600px
//google mapは全体が正方形になっている（そのために緯度の最大値は85.05112878らしい）
//経度方向は83.5度の幅があるので835px
//緯度方向は14.85から65.08までの幅がある
//log(tand(k/2+45))にそれぞれ入れると0.1138と0.6557になる
//緯度85.051128度まで入れると正方形になるので
//3600px = 2 * (log(tand(85.051128/2+45)) * x
//xは係数　1319.28
//log(tand(Latitude.max)) = 0.6557
//log(tand(Latitude.min)) = 0.1138
//1319.28 * (0.6557-0.1138)が緯度方向の幅 714.92px

//topojsonの地図データをthree jsで使いたい→path.makeGeometryでできた→これだとz座標を指定できない（多分z=0）→faceでつくる→faceは三角形しか作れない→海とか漁獲点のzを変える

var ocean_z = -1.0;
var land_z = 0.0;
var point_z = -0.5;
var line_z = -0.7;

var SpecialColorValue = -1;

function SpecialColorFunction(color,value){
    if(value == SpecialColorValue){
        color.h = 0.1;
        color.s = 0.0;
        color.l = 0.5;
    }
    return color;
}


var MAP_COE = 1800/ ( Math.LOG10E*Math.log(Math.tan(Math.PI/180.0*(85.051128/2.0+45.0))));
//地図は完全固定サイズ. カメラ位置を変えることで見える部分を変える
var camera_position = {x:0,y:0};

var map_renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
map_renderer.shadowMapEnabled = false;

var map_camera = new THREE.OrthographicCamera(-500, -500, 500, -500, 0.01, 100);
//var map_camera = new THREE.OrthographicCamera(0, 1000, 1000, 0, 0.01, 100);
console.log("mapcamera");
var map_scene = new THREE.Scene();

var variable_mesh;

//new webglrenderer()するとコンソールログが出る

var variable_data;

var MapGrid = {width:835, height:715};

//tmp map before calculating the drawing data
( function()
{
    var width = MapGrid.width;
    var height = MapGrid.height;
    map_scene = new THREE.Scene();
    map_renderer.setSize(width, height);
    map_renderer.setClearColor(0xaaaaaa, 1);
    map_renderer.shadowMapEnabled = false;

    document.getElementById("mapArea").appendChild(map_renderer.domElement);

    //map_camera = new THREE.OrthographicCamera(0, 1000, 1000, 0, 0.01, 100);
    map_camera.position.set(0, 0, 50);
    map_camera.lookAt({x: 0, y: 0, z: 0});
    render();
}
)();

function render()
{
    requestAnimationFrame(render);
    map_renderer.render(map_scene, map_camera);
}

function draw_map(Data)
{
    variable_data = Data;

    updateSecondInvariantMinMax();
    InitMap();
    map_scene.remove(variable_mesh);

    draw_polygon(Data);
    if(document.getElementById("LineOnOff").checked){
        draw_line(Data);
    }
    if(CPUE_Position!=null){
        console.log("draw points");
        draw_points();
    }
    setMapMouseEvent();
    console.log("draw_ocean");
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

function draw_points()
{
    if(document.getElementById("EveryPoints").checked) {
        var min = 100;
        var max = -100;
        for (var i = 0; i < CPUE_Value.length; i++) {
            if (CPUE_Value[i] < min) {
                min = CPUE_Value[i];
            }
            if (CPUE_Value[i] > max) {
                max = CPUE_Value[i];
            }
        }
        var material = new THREE.PointCloudMaterial({size: 10, transparent: false, vertexColors: THREE.VertexColors});
        //var material = new THREE.PointCloudMaterial({size:10,color:0xffffff});
        var pointsgeometry = new THREE.Geometry();
        for (var i = 0; i < CPUE_Value.length; i++) {
            pointsgeometry.vertices.push(new THREE.Vector3(CPUE_Position[i].x * 10, FromLatToMapGrid(CPUE_Position[i].y), point_z));
            var color = new THREE.Color();
            var v = (CPUE_Value[i] - min) / (max - min);
            color.setHSL(240 * v / 360, 1.0, 0.5);
            pointsgeometry.colors.push(color);
        }
        var points = new THREE.PointCloud(pointsgeometry, material);
        map_scene.add(points);
    }else{
        var min = 100;
        var max = -100;
        for (var i = 0; i < CPUE_Value.length; i++) {
            //console.log(CPUE_Date.year[i] + "-" + ("0"+CPUE_Date.month[i]).slice(-2) + "-" + ("0"+CPUE_Date.day[i]).slice(-2));
            if(DateToArrayNum(document.getElementById("SecondInvariantDate_input").value) == DateToArrayNum(CPUE_Date.year[i] + "-" + ("0"+CPUE_Date.month[i]).slice(-2) + "-" + ("0"+CPUE_Date.day[i]).slice(-2))) {
                if (CPUE_Value[i] < min) {
                    min = CPUE_Value[i];
                }
                if (CPUE_Value[i] > max) {
                    max = CPUE_Value[i];
                }
            }
        }
        var material = new THREE.PointCloudMaterial({size: 10, transparent: false, vertexColors: THREE.VertexColors});
        //var material = new THREE.PointCloudMaterial({size:10,color:0xffffff});
        var pointsgeometry = new THREE.Geometry();
        for (var i = 0; i < CPUE_Value.length; i++) {
            if(DateToArrayNum(document.getElementById("SecondInvariantDate_input").value) == DateToArrayNum(CPUE_Date.year[i] + "-" + ("0"+CPUE_Date.month[i]).slice(-2) + "-" + ("0"+CPUE_Date.day[i]).slice(-2))) {
                pointsgeometry.vertices.push(new THREE.Vector3(CPUE_Position[i].x * 10, FromLatToMapGrid(CPUE_Position[i].y), point_z));
                var color = new THREE.Color();
                var v = (CPUE_Value[i] - min) / (max - min);
                color.setHSL(240 * v / 360, 1.0, 0.5);
                pointsgeometry.colors.push(color);
            }
        }
        console.log(document.getElementById("SecondInvariantDate_input").value);
        var points = new THREE.PointCloud(pointsgeometry, material);
        map_scene.add(points);
    }
}


function draw_polygon(SecondInvariant)
{
    geometry = new THREE.Geometry();

    geometry = CreateGeometry(SecondInvariant);

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.FrontSide,
        opacity: 1.0,
        transparent: true
    });
    //var mesh_triangle = new THREE.Mesh(geometry, material_triangle, mesh_triangle);
    variable_mesh = new THREE.Mesh(geometry, material_triangle);

    //var light = new THREE.DirectionalLight("#AAAAAA");
    //light.position.set(0,0,100);
    map_scene = new THREE.Scene();
    map_scene.add(variable_mesh);
    //map_scene.add(light);

    variable_mesh.position.set(0, 0, 0);
}


function CreateGeometry(SecondInvariant)
{
    var x_grid_org = Longitude.min*10.0;
    var x_grid = x_grid_org;
    var y_grid = FromLatToMapGrid(Latitude.min);

    var geometry = new THREE.Geometry();

    for(var y=0;y<SecondInvariant.data.length-1;y++){
        for(var x=0;x<SecondInvariant.data[0].length-1;x++){
            //var x_grid_step = MapGrid.width * (LatLon.Longitude.data[x+1]-LatLon.Longitude.data[x]) /(Longitude.max - Longitude.min);
            //var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y]) /(Latitude.max - Latitude.min);

            //メルカトルだと緯度が高いときyがのびる

            var x_grid_step = (LatLon.Longitude.data[x+1]-LatLon.Longitude.data[x])*10.0 ;
            //var y_grid_step = (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y])*10.0;
            var y_grid_step = FromLatToMapGrid(LatLon.Latitude.data[y+1]) - FromLatToMapGrid(LatLon.Latitude.data[y]);

            geometry.vertices.push(new THREE.Vector3(x_grid, y_grid, ocean_z));
            geometry.vertices.push(new THREE.Vector3(x_grid+x_grid_step, y_grid, ocean_z));
            geometry.vertices.push(new THREE.Vector3(x_grid+x_grid_step, y_grid+y_grid_step, ocean_z));
            geometry.vertices.push(new THREE.Vector3(x_grid, y_grid+y_grid_step, ocean_z));
            x_grid += x_grid_step;

            var color0 = new THREE.Color();
            var color1 = new THREE.Color();
            var color2 = new THREE.Color();
            var color3 = new THREE.Color();

            var tmp_color0 = SecondInvariantToHSL(SecondInvariant.data[y][x]);
            var tmp_color1 = SecondInvariantToHSL(SecondInvariant.data[y][x+1]);
            var tmp_color2 = SecondInvariantToHSL(SecondInvariant.data[y+1][x+1]);
            var tmp_color3 = SecondInvariantToHSL(SecondInvariant.data[y+1][x]);

            tmp_color0 = SpecialColorFunction(tmp_color0,SecondInvariant.data[y][x]);
            tmp_color1 = SpecialColorFunction(tmp_color1,SecondInvariant.data[y][x+1]);
            tmp_color2 = SpecialColorFunction(tmp_color2,SecondInvariant.data[y+1][x+1]);
            tmp_color3 = SpecialColorFunction(tmp_color3,SecondInvariant.data[y+1][x]);

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
        //var y_grid_step = (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y])*10.0;
        var y_grid_step = FromLatToMapGrid(LatLon.Latitude.data[y+1]) - FromLatToMapGrid(LatLon.Latitude.data[y]);
        //var y_grid_step = MapGrid.height * (LatLon.Latitude.data[y+1]-LatLon.Latitude.data[y]) /(Latitude.max - Latitude.min);
        x_grid = x_grid_org;
        y_grid += y_grid_step;
    }
    return geometry;
}

function FromLatToMapGrid(lat)
{
    if(lat>0) {
        return (MAP_COE * Math.LOG10E * Math.log((Math.tan(Math.PI / 180.0 * (lat / 2.0 + 45.0)))));
    }
    return(lat);
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
    //へんな値の処理（陸地や計算ミスなど）
    if(value < -5000 || value == undefined){
        var color_land = {
            h:0,
            s:0,
            l:0.2
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
    colorlegend_min = eval(document.forms.ColorLegendRange.Min.value);
    colorlegend_max = eval(document.forms.ColorLegendRange.Max.value);
    interpolate_white = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0,0.5,1]).clamp(true);
    interpolate_hsl = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0.66,0.33,0]).clamp(true);
    interpolate_rgb = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range(["blue","green","red"]).clamp(true);
}

function InitMap()
{
    setMapdomElement();
    setMapRenderer();
    setMapCamera();
}

function setMapdomElement()
{
    document.getElementById("mapArea").appendChild(map_renderer.domElement);
    document.getElementById("mapArea").setAttribute("width",MapGrid.width);
    document.getElementById("mapArea").setAttribute("height",MapGrid.height);
}

function setMapRenderer()
{
    map_renderer.clear();
    map_renderer.setSize(MapGrid.width, MapGrid.height);
    map_renderer.setClearColor(0xffffff,1);//aaaaaa, 1);
    map_renderer.shadowMapEnabled = false;
}

function setMapCamera()
{
    map_camera = new THREE.OrthographicCamera(Longitude.min*10.0,Longitude.max*10.0,FromLatToMapGrid(Latitude.max),FromLatToMapGrid(Latitude.min), 0.01, 3000);
    //map_camera = new THREE.OrthographicCamera(-500,500,500,-500, 0.01, 3000);
    console.log("change setMapCameraFunction");
    map_camera.position.set(0, 0, 1);
    map_camera.lookAt({x: 0, y: 0, z: 0});
    map_camera.position.set(camera_position.x, camera_position.y, 100);
}

function setMapMouseEvent()
{
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
        var scaled_width = MapGrid.width/map_scale;
        var scaled_height = MapGrid.height/map_scale;
        var center_Grid = {x:(Longitude.max*10.0+Longitude.min*10.0)/2.0, y:(FromLatToMapGrid(Latitude.max)+FromLatToMapGrid(Latitude.min))/2.0};
        map_camera = new THREE.OrthographicCamera(center_Grid.x-scaled_width/2.0,center_Grid.x+scaled_width/2.0,center_Grid.y+scaled_height/2.0,center_Grid.y-scaled_height/2.0, 0.01, 3000);
        //console.log(map_camera.top - map_camera.bottom);
        //console.log(map_camera.right-map_camera.left);
        //zoommap();
        map_camera.position.set(0, 0, 1);
        map_camera.lookAt({x: 0, y: 0, z: 0});
        map_camera.position.set(camera_position.x, camera_position.y, 100);
    }, false);
}

