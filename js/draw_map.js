/**
 * Created by vizlab on 15/03/26.
 */

var map_renderer = new THREE.WebGLRenderer();

//tmp map before loading geometry data
( function()
{
    var width = 672;
    var height = 441;

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

    var camera = new THREE.OrthographicCamera(-500, 500, 500, -500, 0.01, 100);
    camera.position.set(0, 0, 50);
    camera.lookAt({x: 0, y: 0, z: 0});

    map_renderer.render(scene, camera);
}
)();

function draw_map(SecondInvariant)
{
    var width = 672;
    var height = 441;

    (function()
    {
        land_map = d3.select("svg")
            .attr("width", width / 2)
            .attr("height", height / 2);
    })();

    geometry = new THREE.Geometry();

    geometry = CreateGeometry(SecondInvariant);

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

    //var camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    var camera = new THREE.OrthographicCamera(-SecondInvariant.data[0].length/2, SecondInvariant.data[0].length/2, SecondInvariant.data.length/2, -SecondInvariant.data.length/2, 0.01, 1000);
    camera.position.set(0, 0, 1);
    camera.lookAt({x: 0, y: 0, z: 0});
    camera.position.set(SecondInvariant.data[0].length/2, SecondInvariant.data.length/2, 30);


    map_renderer.render(scene, camera);
}

function CreateGeometry(SecondInvariant)
{
    var geometry = new THREE.Geometry();
    for(var y=0;y<SecondInvariant.data.length-1;y++){
        console.log(y);
        for(var x=0;x<SecondInvariant.data[0].length-1;x++){
            geometry.vertices.push(new THREE.Vector3(x, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+1, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+1, y+1, 0));
            geometry.vertices.push(new THREE.Vector3(x, y+1, 0));

            var tmp_color0 = SecondInvariantToRGB(SecondInvariant.data[y][x]);
            var tmp_color1 = SecondInvariantToRGB(SecondInvariant.data[y][x+1]);
            var tmp_color2 = SecondInvariantToRGB(SecondInvariant.data[y+1][x+1]);
            var tmp_color3 = SecondInvariantToRGB(SecondInvariant.data[y+1][x]);

            var color0 = new THREE.Color();
            var color1 = new THREE.Color();
            var color2 = new THREE.Color();
            var color3 = new THREE.Color();

            color0.setRGB(tmp_color0.red,tmp_color0.green,tmp_color0.blue);
            color1.setRGB(tmp_color1.red,tmp_color1.green,tmp_color1.blue);
            color2.setRGB(tmp_color2.red,tmp_color2.green,tmp_color2.blue);
            color3.setRGB(tmp_color3.red,tmp_color3.green,tmp_color3.blue);
/*
            console.log(SecondInvariant.data[0].length);
            console.log(geometry.vertices.length);
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
    }
    console.log(geometry);
    return geometry;
}

var min = 0.1;
var max = 5;
var rgb = d3.scale.linear().domain([min,(min+max)/2.0,max]).range(["blue","green","red"]).clamp(true);

function SecondInvariantToRGB(value)
{
    value_rgb_string = rgb(value);

    value_hex = {
        red:value_rgb_string.slice(1,3),
        green:value_rgb_string.slice(3,5),
        blue:value_rgb_string.slice(5,7)
    };
    //console.log(value_hex);
    var color = {
        red:parseInt(value_hex.red,16),
        green:parseInt(value_hex.green,16),
        blue:parseInt(value_hex.blue,16)
    };
    //console.log(color);
    return(color);
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