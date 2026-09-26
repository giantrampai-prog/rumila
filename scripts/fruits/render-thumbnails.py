import bpy, math, os, glob
from mathutils import Vector
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out=os.path.join(ROOT,'public/fruits/thumbs');os.makedirs(out,exist_ok=True)
for file in sorted(glob.glob(os.path.join(ROOT,'output/fruits/models/*.glb'))):
    name=os.path.basename(file).replace('.glb','')
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=file)
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=12;scene.cycles.use_denoising=True
    scene.render.resolution_x=256;scene.render.resolution_y=256;scene.render.resolution_percentage=100
    scene.render.film_transparent=True;scene.render.image_settings.file_format='PNG'
    scene.world=bpy.data.worlds.new('World');scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(0.75,0.78,0.85,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.7
    scene.view_settings.view_transform='AgX';scene.view_settings.look='AgX - Medium High Contrast'
    for label,loc,power,size in [('Key',(-3,-4,5),420,4),('Fill',(3,-2,2),180,3),('Rim',(1,3,4),350,3)]:
        data=bpy.data.lights.new(label,'AREA');data.energy=power;data.shape='DISK';data.size=size;obj=bpy.data.objects.new(label,data);scene.collection.objects.link(obj);obj.location=loc;obj.rotation_euler=(Vector((0,0,0))-obj.location).to_track_quat('-Z','Y').to_euler()
    data=bpy.data.cameras.new('Camera');camera=bpy.data.objects.new('Camera',data);scene.collection.objects.link(camera);camera.location=(.4,-6,1.7);camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=3.25;scene.camera=camera
    scene.render.filepath=os.path.join(out,name+'.png');bpy.ops.render.render(write_still=True)
    print('FRUIT_RENDERED '+name,flush=True)
