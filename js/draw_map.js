/**
 * Created by vizlab on 15/03/26.
 */

var map_renderer = new THREE.WebGLRenderer();

//tmp map before loading geometry data
( function()
{
    var width = 500;
    var height = 500;

    (function()
    {
        d3.select("body").append("svg")
            .attr("width", width / 2)
            .attr("height", height / 2);
    })();

    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(1, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 1, 0));

    var color = new THREE.Color(0xff0000);
    var color3 = new THREE.Color(0x0000ff);
    var color2 = new THREE.Color(0xff0000);
    color2.setRGB(0, 255, 0);

    var coord_index = 0;

    var face = new THREE.Face3(coord_index, coord_index + 1, coord_index + 2);
    face.vertexColors[0] = color;
    face.vertexColors[1] = color2;
    face.vertexColors[2] = color3;

    geometry.faces.push(face);

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        opacity: 0.5,
        transparent: true
    });

    var mesh_triangle = new THREE.Mesh(geometry, material_triangle, mesh_triangle);

    var scene = new THREE.Scene();
    scene.add(mesh_triangle);

    mesh_triangle.position.set(0, 0, 0);

    geometry.dispose();
    material_triangle.dispose();

    map_renderer.setSize(width, height);
    map_renderer.setClearColor(0xaaaaaa, 1);
    map_renderer.shadowMapEnabled = true;
    document.getElementById("mapArea").appendChild(map_renderer.domElement);

    var camera = new THREE.PerspectiveCamera(75, 1, 0.01, 100);
    camera.position.set(0, 0, 50);
    camera.lookAt({x: 0, y: 0, z: 0});

    map_renderer.render(scene, camera);
}
)();

function draw_map()
{
    var width = 500;
    var height = 500;

    (function()
    {
        land_map = d3.select("svg")
            .attr("width", width / 2)
            .attr("height", height / 2);
    })();

    geometry = new THREE.Geometry();

    geometry = CreateGeometry();

    var material_triangle = new THREE.MeshBasicMaterial({//////////////////////////////// for 3d
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide,
        opacity: 0,
        transparent: false
    });
    var mesh_triangle = new THREE.Mesh(geometry, material_triangle, mesh_triangle);

    var scene = new THREE.Scene();
    scene.add(mesh_triangle);

    mesh_triangle.position.set(0, 0, 0);

    geometry.dispose();
    material_triangle.dispose();

    map_renderer.clear();

    map_renderer.setSize(width, height);
    map_renderer.setClearColor(0xaaaaaa, 1);
    map_renderer.shadowMapEnabled = true;
    document.getElementById("mapArea").appendChild(map_renderer.domElement);

    var camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    camera.position.set(0, 0, 1);
    camera.lookAt({x: 0, y: 0, z: 0});
    camera.position.set(SecondInvariant[0].length/2, SecondInvariant.length/2, 500);


    map_renderer.render(scene, camera);
}

function CreateGeometry()
{
    var geometry = new THREE.Geometry();

    for(var y=0;y<SecondInvariant.length-1;y++){
        for(var x=0;x<SecondInvariant[0].length-1;x++){
            geometry.vertices.push(new THREE.Vector3(x, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+1, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+1, y+1, 0));
            geometry.vertices.push(new THREE.Vector3(x, y+1, 0));

            var tmp_color0 = SecondInvariantToRGB(SecondInvariant[y][x]);
            var tmp_color1 = SecondInvariantToRGB(SecondInvariant[y][x+1]);
            var tmp_color2 = SecondInvariantToRGB(SecondInvariant[y+1][x+1]);
            var tmp_color3 = SecondInvariantToRGB(SecondInvariant[y+1][x]);

            var color0 = new THREE.Color();
            var color1 = new THREE.Color();
            var color2 = new THREE.Color();
            var color3 = new THREE.Color();

            color0.setRGB(tmp_color0.red,tmp_color0.green,tmp_color0.blue);
            color1.setRGB(tmp_color1.red,tmp_color1.green,tmp_color1.blue);
            color2.setRGB(tmp_color2.red,tmp_color2.green,tmp_color2.blue);
            color3.setRGB(tmp_color3.red,tmp_color3.green,tmp_color3.blue);
/*
            console.log(SecondInvariant[0].length);
            console.log(geometry.vertices.length);
            */
            var coord_index = y*(SecondInvariant[0].length-1)*4 + x*4;
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
    }
    console.log(geometry);
    return geometry;
}

function SecondInvariantToRGB(value)
{
    var rgb;
    var min = 0;
    var max = 20;
    var range = max - min;
    var step = range/511.0;
    if(value < min){
        rgb = {
            red:0,
            green:0,
            blue:255
        };
        return rgb;
    }
    if(value > max){
        rgb = {
            red:0,
            green:0,
            blue:255
        };
        return rgb;
    }
    if(Math.round((value-min)/step) < 256){
        rgb = {
            red:0,
            green:Math.round((value-min)/step),
            blue:255-Math.round((value-min)/step)
        };
        return rgb;
    }
    if(Math.round((value-min)/step) >= 256 && Math.round((value-min)/step) < 512){
        rgb = {
            red:Math.round((value-min)/step),
            green:255-Math.round((value-min)/step),
            blue:0
        };
        return rgb;
    }
    rgb = {
        red:0,
        green:0,
        blue:0
    };
    return rgb;
}


//draw japan from local geometry data
/*
d3.json("./japan_geometry/japan.json", function(json){
    var japan = topojson.object(json, json.objects.japan).geometries;
    console.log(japan);
    var projection = d3.geo.mercator()
        .center([137,36.9])
        .scale(1000)
        .translate([width/4,height/4]);
    var path = d3.geo.path()
        .projection(projection);


    land_map.selectAll("path")
        .data(japan)
        .enter()
        .append("path")
        .attr("d", path);


    land_map.append("rect")
        .attr("x",100)
        .attr("y",100)
        .attr("width",100)
        .attr("height",100)
        .attr("fill","green");


});


map = land_map;
    */