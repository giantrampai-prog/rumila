import bpy,bmesh,struct,json
from mathutils import Vector
from pathlib import Path
ROOT=Path('/Users/macbook/RUMILA/rumila-app')
s=(ROOT/'sources/anatomy/nih-cochlea.stl').read_bytes();n=struct.unpack_from('<I',s,80)[0];vs=[];faces=[]
for i in range(n):
 v=struct.unpack_from('<12f',s,84+i*50);j=len(vs);vs.extend([v[k:k+3] for k in (3,6,9)]);faces.append((j,j+1,j+2))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
mn=Vector([min(p[i] for p in vs) for i in range(3)]);mx=Vector([max(p[i] for p in vs) for i in range(3)]);center=(mn+mx)/2
# Display normalization only. Source units and laterality were not documented;
# this model is explicitly a separate enlarged study, never positioned in a skull.
scale=.12/max(mx-mn);vs=[tuple((Vector(p)-center)*scale+Vector((0,0,.08))) for p in vs]
mesh=bpy.data.meshes.new('cochlea_study');mesh.from_pydata(vs,[],faces)
bm=bmesh.new();bm.from_mesh(mesh);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.0000001);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(mesh);bm.free()
o=bpy.data.objects.new('cochlea_study',mesh);bpy.context.collection.objects.link(o)
mat=bpy.data.materials.new('Natural bone tissue');mat.diffuse_color=(.66,.59,.45,1);o.data.materials.append(mat)
for f in mesh.polygons:f.use_smooth=True
bpy.ops.export_scene.gltf(filepath=str(ROOT/'sources/anatomy/uncompressed/ear-study.glb'),export_format='GLB',export_yup=True,export_animations=False)
coords=[v.co for v in mesh.vertices];lo=[min(v[i] for v in coords) for i in range(3)];hi=[max(v[i] for v in coords) for i in range(3)]
part={'id':'cochlea_study','parentId':None,'kind':'inset','regionId':'head','systemIds':['nervous'],'laterality':'none','layer':'bone','nameId':'Telinga dalam — model koklea','anatomicalName':'Cochlea (NIH 3DPX-001794, version 2)','aliases':['telinga dalam','koklea','cochlea','labirin','keseimbangan'],'definitionSimple':'Model bentuk telinga dalam, dengan koklea dan saluran melengkung di sekitarnya.','definitionDetailed':'Koklea mengubah getaran menjadi sinyal saraf untuk pendengaran. Bagian vestibular telinga dalam berperan dalam keseimbangan. Model sumber diberi judul Cochlea. Ini model pembelajaran terpisah yang diperbesar, bukan penempatan berskala anatomis di dalam kepala; bagian mikroskopis tidak dimodelkan.','functions':['Koklea berperan dalam pendengaran; struktur vestibular di telinga dalam membantu keseimbangan.'],'locationText':'Telinga dalam berada di dalam bagian petrosa tulang pelipis. Model ini ditampilkan terpisah; sisi kanan/kiri sumber tidak dinyatakan.','relatedIds':['ear_l','ear_r'],'sources':[{'title':'NIH 3D — Cochlea, chris@printhuman.org, version 2','url':'https://3d.nih.gov/entries/1794?version=2'},{'title':'NIDCD — How Do We Hear?','url':'https://www.nidcd.nih.gov/health/how-do-we-hear'}],'reviewStatus':'pending','reviewedAt':None,'assetId':'ear-study','meshNodeNames':['cochlea_study'],'pickNodeNames':[],'labelAnchor':[(lo[0]+hi[0])/2,(lo[2]+hi[2])/2,-lo[1]],'bounds':{'min':[lo[0],lo[2],-hi[1]],'max':[hi[0],hi[2],-lo[1]]},'restTransform':{'position':[0,0,0],'rotation':[0,0,0],'scale':[1,1,1]},'explodePath':[0,0,0],'childIds':[],'capabilities':{'disassemble':False,'interior':False,'section':False,'animation':False,'microInset':False}}
(ROOT/'sources/anatomy/nih-ear-part.json').write_text(json.dumps(part,ensure_ascii=False,indent=2))
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'sources/anatomy/nih-ear-study.blend'),compress=True)
