/**
 * Created by vizlab on 15/03/26.
 */

var map_renderer = new THREE.WebGLRenderer();

var map_scale = 1.0;

//tmp map before loading geometry data
( function()
{
    var width = 672*map_scale;
    var height = 441*map_scale;

    var scene = new THREE.Scene();
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
    var width = 672*map_scale;
    var height = 441*map_scale;
/*
    (function()
    {
        land_map = d3.select("svg")
            .attr("width", width / 2)
            .attr("height", height / 2);
    })();
*/
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

    var light = new THREE.DirectionalLight("#AAAAAA");
    light.position.set(0,0,100);
    var scene = new THREE.Scene();
    scene.add(mesh_triangle);
    scene.add(light);

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

    //var camera = new THREE.PerspectiveCamera(75, 1, 0.01, 1000);
    var camera = new THREE.OrthographicCamera(-SecondInvariant.data[0].length/2, SecondInvariant.data[0].length/2, SecondInvariant.data.length/2, -SecondInvariant.data.length/2, 0.01, 1000);
    camera.position.set(0, 0, 1);
    camera.lookAt({x: 0, y: 0, z: 0});
    camera.position.set(SecondInvariant.data[0].length/2, SecondInvariant.data.length/2, 30);

    map_renderer.render(scene, camera);

    document.addEventListener('click',function(e){
        var rect = document.getElementById("mapArea").getBoundingClientRect();
        var mouseX = Math.round((e.clientX - rect.left)/map_scale);
        var mouseY = Math.round((e.clientY - rect.top)/map_scale);
        if(0<mouseX && mouseX<document.getElementById("mapArea").getAttribute("width") && 0<mouseY && mouseY<document.getElementById("mapArea").getAttribute("height")) {
            target = document.getElementById("output2");
            target.innerHTML = "SecondInvariant is " + SecondInvariant.data[441 - mouseY][mouseX] + "  mouse position is " + mouseX + " " + mouseY;
        }
    },false);

}



function CreateGeometry(SecondInvariant)
{
    var geometry = new THREE.Geometry();
    for(var y=0;y<SecondInvariant.data.length-1;y++){
        for(var x=0;x<SecondInvariant.data[0].length-1;x++){
            geometry.vertices.push(new THREE.Vector3(x, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+map_scale, y, 0));
            geometry.vertices.push(new THREE.Vector3(x+map_scale, y+map_scale, 0));
            geometry.vertices.push(new THREE.Vector3(x, y+map_scale, 0));

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

var min = -60;
var max = 60;
var rgb = d3.scale.linear().domain([min,(min+max)/2.0,max]).range(["blue","green","red"]).clamp(true);

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

    value_rgb_string = rgb(value);

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

