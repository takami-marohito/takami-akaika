/**
 * Created by vizlab on 15/03/26.
 */

var width = window.innerWidth;
var height = window.innerHeight;

var land_map = d3.select("body").append("svg")
    .attr("width",width/2)
    .attr("height",height/2)

var map;

var geometry = new THREE.Geometry();

geometry.vertices.push(new THREE.Vector3(0,0,0));
geometry.vertices.push(new THREE.Vector3(1,0,0));
geometry.vertices.push(new THREE.Vector3(0,1,0));

var color = new THREE.Color(0xff0000);
var color3 = new THREE.Color(0x0000ff);
var color2 = new THREE.Color(0xff0000);
color2.setRGB(0,255,0);

var coord_index=0;

var face = new THREE.Face3(coord_index, coord_index+1, coord_index+2);
face.vertexColors[0] = color;
face.vertexColors[1] = color2;
face.vertexColors[2] = color;

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

mesh_triangle.position.set(0,0,0);

geometry.dispose();
material_triangle.dispose();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(300,300);
renderer.setClearColor(0xaaaaaa,1);
renderer.shadowMapEnabled = true;
document.getElementById("mapArea").appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75,1,0.01,100);
camera.position.set(0,0,3);
camera.lookAt({x:0,y:0,z:0});

renderer.render(scene, camera);

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