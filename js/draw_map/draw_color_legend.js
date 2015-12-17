/**
 * Created by vizlab on 2015/10/15.
 */

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

        var tmp_color0 = SecondInvariantToHSL(i*legend_step+colorlegend_min);
        var tmp_color3 = SecondInvariantToHSL(i*legend_step+colorlegend_min);
        var tmp_color1 = SecondInvariantToHSL((i+1.0)*legend_step+colorlegend_min);
        var tmp_color2 = SecondInvariantToHSL((i+1.0)*legend_step+colorlegend_min);

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

    var textGeoCenter = new THREE.TextGeometry((colorlegend_max+colorlegend_min)/2.0,{
        size: 13,
        height: 20
    }) ;
    var textMaterialCenter = new THREE.MeshBasicMaterial({color:0x000000});
    var textCenter = new THREE.Mesh(textGeoCenter, textMaterialCenter);
    textCenter.position.set(185,-15,100);
    textCenter.doubleSided=true;
    legend_scene.add( textCenter );

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