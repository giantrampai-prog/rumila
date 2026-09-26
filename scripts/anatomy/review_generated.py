"""Inspect a generated mesh and render four views without changing its anatomy.

blender --background --factory-startup --disable-autoexec --python this.py -- INPUT OUTPUT_DIR
The resulting source and renders remain unreviewed production candidates.
"""
import bpy, bmesh, json, math, sys
from pathlib import Path
from mathutils import Vector

args = sys.argv[sys.argv.index('--')+1:]
source, out = Path(args[0]), Path(args[1])
out.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
if source.suffix.lower() == '.glb':
    bpy.ops.import_scene.gltf(filepath=str(source))
elif source.suffix.lower() == '.obj':
    bpy.ops.wm.obj_import(filepath=str(source))
else:
    raise ValueError('Expected a GLB or OBJ')

objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
source_triangles=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
if source_triangles>300000:
    for o in objects:
        bpy.context.view_layer.objects.active=o
        mod=o.modifiers.new('Review LOD','DECIMATE');mod.ratio=300000/source_triangles
        bpy.ops.object.modifier_apply(modifier=mod.name)
points = [o.matrix_world @ v.co for o in objects for v in o.data.vertices]
low = Vector([min(p[i] for p in points) for i in range(3)])
high = Vector([max(p[i] for p in points) for i in range(3)])
center, span = (low+high)/2, max(high-low)
report = {'source': str(source), 'sourceTriangles':source_triangles, 'reviewStatus': 'pending', 'bounds': [list(low), list(high)], 'objects': []}
for o in objects:
    bm = bmesh.new(); bm.from_mesh(o.data)
    o.data.calc_loop_triangles()
    report['objects'].append(dict(name=o.name, vertices=len(o.data.vertices),
        triangles=len(o.data.loop_triangles), uvLayers=len(o.data.uv_layers),
        boundaryEdges=sum(e.is_boundary for e in bm.edges),
        nonManifoldEdges=sum(not e.is_manifold for e in bm.edges),
        materials=[m.name for m in o.data.materials if m]))
    bm.free()
    for face in o.data.polygons: face.use_smooth = True
    if not o.data.materials:
        mat=bpy.data.materials.new('Neutral geometry inspection')
        mat.diffuse_color=(.5,.42,.37,1); mat.use_nodes=True
        mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.5,.42,.37,1)
        mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.65
        o.data.materials.append(mat)

bpy.ops.export_scene.gltf(filepath=str(out/'heart-shape-candidate.glb'),export_format='GLB',export_animations=False)
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=12
scene.render.resolution_x=800;scene.render.resolution_y=800;scene.render.resolution_percentage=100
scene.world.color=(.65,.65,.65)
scene.view_settings.view_transform='AgX'
for name,delta,power,size in [('Key',(-2,-3,4),700,3),('Fill',(3,-1,1),350,3),('Rim',(0,3,3),500,2)]:
    data=bpy.data.lights.new(name,'AREA');data.energy=power*span*span;data.shape='DISK';data.size=size*span
    light=bpy.data.objects.new(name,data);scene.collection.objects.link(light)
    light.location=center+Vector(delta)*span;light.rotation_euler=(center-light.location).to_track_quat('-Z','Y').to_euler()
data=bpy.data.cameras.new('Review camera');camera=bpy.data.objects.new('Review camera',data);scene.collection.objects.link(camera)
scene.camera=camera;data.type='ORTHO';data.ortho_scale=span*1.2
for name,direction in [('front',(0,-1,.02)),('back',(0,1,.02)),('left',(-1,0,.02)),('right',(1,0,.02))]:
    camera.location=center+Vector(direction).normalized()*span*3
    camera.rotation_euler=(center-camera.location).to_track_quat('-Z','Y').to_euler()
    scene.render.filepath=str(out/(name+'.png'));bpy.ops.render.render(write_still=True)
(out/'geometry-report.json').write_text(json.dumps(report,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(out/'review-master.blend'),compress=True)
print(json.dumps(report))
