"""Export the licensed Mostafa 1001 source as compact, animated Rumila characters.

Blender 4.5 LTS, run with --background --disable-autoexec --python this_file --
  --source /path/to/hajj_man.blend --output /path/to/public/umroh/models
The source file is acquired separately from Fab under CC BY 4.0. See ASSETS.md.
"""
import argparse
import json
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

parser = argparse.ArgumentParser()
parser.add_argument('--source', required=True)
parser.add_argument('--output', required=True)
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:])
output = Path(args.output).resolve()
output.mkdir(parents=True, exist_ok=True)
report = {}


def pose_action(rig, name, frame=0):
    rig.animation_data.action = None
    action = bpy.data.actions.new(name)
    rig.animation_data.action = action
    for bone in rig.pose.bones:
        bone.rotation_mode = 'QUATERNION'
        for f in (frame, frame + 1):
            bone.keyframe_insert('location', frame=f, group=bone.name)
            bone.keyframe_insert('rotation_quaternion', frame=f, group=bone.name)
            bone.keyframe_insert('scale', frame=f, group=bone.name)
    return action


def seated_action(rig, idle, driving=False):
    rig.animation_data.action = idle
    bpy.context.scene.frame_set(0)
    bpy.context.view_layer.update()
    matrices = {b.name: b.matrix.copy() for b in rig.pose.bones}
    def align(bone, direction):
        if bone is None:
            raise RuntimeError('Expected Mixamo limb missing')
        # Align the bone's own long axis, retaining its roll. Arm bones point
        # sideways in the bind pose, so rotating about global X cannot lower them.
        rest = matrices[bone.name].to_3x3()
        turn = (rest @ Vector((0, 1, 0))).rotation_difference(Vector(direction).normalized())
        bone.matrix = Matrix.Translation(bone.matrix.translation) @ turn.to_matrix().to_4x4() @ rest.to_4x4()
        bpy.context.view_layer.update()
    # The creator's character faces -Y in Blender; the exported model faces +Z.
    for side in ('Left', 'Right'):
        thigh = rig.pose.bones.get('mixamorig:' + side + 'UpLeg') or rig.pose.bones.get('mixamorig' + side + 'UpLeg')
        calf = rig.pose.bones.get('mixamorig:' + side + 'Leg') or rig.pose.bones.get('mixamorig' + side + 'Leg')
        foot = rig.pose.bones.get('mixamorig:' + side + 'Foot') or rig.pose.bones.get('mixamorig' + side + 'Foot')
        upper = rig.pose.bones.get('mixamorig:' + side + 'Arm') or rig.pose.bones.get('mixamorig' + side + 'Arm')
        fore = rig.pose.bones.get('mixamorig:' + side + 'ForeArm') or rig.pose.bones.get('mixamorig' + side + 'ForeArm')
        hand = rig.pose.bones.get('mixamorig:' + side + 'Hand') or rig.pose.bones.get('mixamorig' + side + 'Hand')
        align(thigh, (0, -1, -.12))
        # Car cushions are lower relative to the raised footwell: extend the
        # driver's shins toward the pedals instead of vertically through it.
        align(calf, (0, -.94, -.34) if driving else (0, -.12, -1))
        # Feet retain their standing orientation while their ankle follows the knee.
        foot.matrix = Matrix.Translation(foot.matrix.translation) @ matrices[foot.name].to_3x3().to_4x4()
        bpy.context.view_layer.update()
        align(upper, (0, -.55, -.84) if driving else (0, -.18, -.98))
        align(fore, (0, -1, .12) if driving else (0, -1, -.12))
        align(hand, (0, -1, .12) if driving else (0, -1, -.12))
    return pose_action(rig, 'driving' if driving else 'seated')


for variant, rig_name in [('ihram', 'Armature.003'), ('travel', 'Armature.002')]:
    bpy.ops.wm.open_mainfile(filepath=str(Path(args.source).resolve()), load_ui=False, use_scripts=False)
    scene = bpy.context.scene
    rig = bpy.data.objects[rig_name]
    keep = {rig, *rig.children_recursive}
    for obj in list(bpy.data.objects):
        if obj not in keep or (variant == 'ihram' and obj.type == 'MESH' and any('Kopiah' in m.name for m in obj.data.materials)):
            bpy.data.objects.remove(obj, do_unlink=True)
    rig.animation_data_create()
    for track in list(rig.animation_data.nla_tracks):
        rig.animation_data.nla_tracks.remove(track)
    idle = bpy.data.actions['idle'].copy()
    idle.name = 'idle-rumila'
    walk = bpy.data.actions['walking'].copy()
    walk.name = 'walk-rumila'
    for action in (idle, walk):
        for curve in list(action.fcurves):
            # Remove the authoring scene's armature transform keys (including large spins).
            if not curve.data_path.startswith('pose.bones['):
                action.fcurves.remove(curve)
    rig.animation_data.action = idle
    scene.frame_set(0)
    # Preserve the armature's original rest placement; normalize through one outer root.
    rig.rotation_euler.z = .0041993996
    bpy.context.view_layer.update()
    meshes = [o for o in rig.children_recursive if o.type == 'MESH']
    source_triangles = sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes)

    rig.data.pose_position = 'REST'
    for obj in meshes:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        if obj.data.shape_keys:
            obj.shape_key_clear()
        names = ' '.join(m.name for m in obj.data.materials)
        ratio = .035 if 'Ihram' in names else .05 if 'Regular' in names else .16 if 'Skin' in names else .6
        decimate = obj.modifiers.new('Rumila web LOD', 'DECIMATE')
        decimate.ratio = ratio
        decimate.use_collapse_triangulate = True
        while obj.modifiers.find(decimate.name) > 0:
            bpy.ops.object.modifier_move_up(modifier=decimate.name)
        bpy.ops.object.modifier_apply(modifier=decimate.name)
        for polygon in obj.data.polygons:
            polygon.use_smooth = True
        obj.select_set(False)
    rig.data.pose_position = 'POSE'

    # Keep original UV/albedo textures. Simplify exporter material graphs to PBR.
    used_materials = set(m for o in meshes for m in o.data.materials)
    for mat in used_materials:
        images = [n.image for n in mat.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image]
        color = next((i for i in images if any(s in i.name.lower() for s in ('diffuse', 'color', 'eye', 'teeth'))), images[0] if images else None)
        base_color = tuple(mat.diffuse_color)
        mat.use_nodes = True
        mat.use_backface_culling = 'Ihram' not in mat.name
        mat.node_tree.nodes.clear()
        shader = mat.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
        shader.inputs['Base Color'].default_value = base_color
        shader.inputs['Roughness'].default_value = .82 if any(s in mat.name for s in ('Ihram', 'Regular', 'Kopiah')) else .58
        shader.inputs['Specular IOR Level'].default_value = .25
        shader.inputs['Alpha'].default_value = 1
        if color:
            if max(color.size) > (2048 if 'Skin' in mat.name else 1024):
                max_size = 2048 if 'Skin' in mat.name else 1024
                color.scale(max_size, max_size)
            tex = mat.node_tree.nodes.new('ShaderNodeTexImage')
            tex.image = color
            mat.node_tree.links.new(tex.outputs['Color'], shader.inputs['Base Color'])
            if 'Ihram' in mat.name:
                # The packed cloth color contains white fringe on a black key.
                # Recover that mask instead of displaying black rectangles at
                # the hems. glTF exports the graph as RGBA + alphaMode MASK.
                channel = mat.node_tree.nodes.new('ShaderNodeSeparateColor')
                mat.node_tree.links.new(tex.outputs['Color'], channel.inputs['Color'])
                cutoff = mat.node_tree.nodes.new('ShaderNodeMath')
                cutoff.operation = 'GREATER_THAN'
                cutoff.inputs[1].default_value = .7
                mat.node_tree.links.new(channel.outputs['Red'], cutoff.inputs[0])
                mat.node_tree.links.new(cutoff.outputs[0], shader.inputs['Alpha'])
        if 'Tears' in mat.name:
            shader.inputs['Base Color'].default_value = (.26, .12, .10, 1)
        out = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
        mat.node_tree.links.new(shader.outputs['BSDF'], out.inputs['Surface'])

    rig.animation_data.action = idle
    scene.frame_set(0)
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    points = [o.evaluated_get(depsgraph).matrix_world @ Vector(p) for o in meshes for p in o.evaluated_get(depsgraph).bound_box]
    low = Vector(tuple(min(p[i] for p in points) for i in range(3)))
    high = Vector(tuple(max(p[i] for p in points) for i in range(3)))
    center = (low+high)/2
    size = 1.76 / (high.z-low.z)
    wrapper = bpy.data.objects.new('Rumila character', None)
    scene.collection.objects.link(wrapper)
    rig.parent = wrapper
    wrapper.scale = (size, size, size)
    wrapper.location = (-center.x*size, -center.y*size, -low.z*size)
    wrapper['source'] = 'Muslim and hajj man — Mostafa 1001 / Mostafa Ebrahim'
    wrapper['license'] = 'CC BY 4.0'
    wrapper['variant'] = variant
    wrapper['heightMeters'] = 1.76

    idle_export = pose_action(rig, 'idle')
    seated = seated_action(rig, idle, False) if variant == 'travel' else None
    driving = seated_action(rig, idle, True) if variant == 'travel' else None
    rig.animation_data.action = None
    actions = [('idle', idle_export), ('walk', walk)]
    if seated:
        actions.extend([('seated', seated), ('driving', driving)])
    for name, action in actions:
        track = rig.animation_data.nla_tracks.new()
        track.name = name
        strip = track.strips.new(name, 0, action)
        strip.action_frame_start = action.frame_range[0]
        strip.action_frame_end = max(action.frame_range[1], action.frame_range[0]+1)
        track.mute = True
    scene.frame_start = 0
    scene.frame_end = 32
    scene.render.fps = 30
    scene.frame_set(0)
    bpy.ops.object.select_all(action='DESELECT')
    for o in [wrapper, rig, *meshes]:
        o.select_set(True)
    dest = output / ('man-' + variant + '.glb')
    bpy.ops.export_scene.gltf(filepath=str(dest), export_format='GLB', use_selection=True,
        export_animations=True, export_animation_mode='NLA_TRACKS', export_skins=True,
        export_apply=False, export_morph=False, export_extras=True, export_yup=True,
        export_image_format='JPEG', export_jpeg_quality=88, export_force_sampling=True)
    report[variant] = {'file': dest.name, 'bytes': dest.stat().st_size, 'sourceTriangles': source_triangles,
        'triangles': sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in meshes),
        'meshes': len(meshes), 'materials': len(used_materials), 'heightMeters': 1.76,
        'clips': [name for name, _ in actions], 'removedCap': variant == 'ihram'}
    print('RUMILA_ASSET', json.dumps(report[variant]))
(output / 'manifest.json').write_text(json.dumps(report, indent=2)+'\n')
