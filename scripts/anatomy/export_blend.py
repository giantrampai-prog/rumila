import bpy,bmesh,json,os,math,struct
from mathutils import Matrix,Vector
ROOT='/Users/macbook/RUMILA/rumila-app'
plan=json.load(open(ROOT+'/sources/anatomy/export-plan.json'))
# Third-party kidney with non-commercial terms in Z-Anatomy is deliberately excluded.
for suf,fma,ureter in [('r','FMA7204','FMA15571'),('l','FMA7205','FMA15572')]:
 side='kanan' if suf=='r' else 'kiri'
 for id,name,src,definition,fn in [('kidney_'+suf,'Ginjal '+side,fma,'Organ yang menyaring darah dan membentuk urine.','Mengatur air dan elektrolit serta membuang zat sisa.'),('ureter_'+suf,'Ureter '+side,ureter,'Saluran dari ginjal menuju kandung kemih.','Mengalirkan urine melalui kontraksi otot dindingnya.')]:
  p=dict(plan[0]);p.update(id=id,nameId=name,anatomicalName='Kidney' if id.startswith('kidney') else 'Ureter',sourceNames=[src],layer='organ',systemIds=['urinary'],regionId='abdomen',definitionSimple=definition,definitionDetailed=definition+' '+fn,functions=[fn],locationText='Di bagian belakang perut, sisi '+side+'.',assetId='urinary',laterality='right' if suf=='r' else 'left',aliases=['ren'] if id.startswith('kidney') else [],sourceProvider='BodyParts3D')
  if id.startswith('ureter'):
   p['sourceNames']=['Ureter.'+suf];p['sourceProvider']='Z-Anatomy'
  plan.append(p)
for p in plan:
 if p['id'] in ['valve_mitral','valve_tricuspid']:
  p['sourceNames']=['FMA7235' if p['id']=='valve_mitral' else 'FMA7234'];p['sourceProvider']='BodyParts3D'
# Capture evaluated meshes before clearing the source scene. No source text scripts run.
deps=bpy.context.evaluated_depsgraph_get()
scene=bpy.data.scenes.new('Rumila export')
def rgba(h):
 c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c)+(1,)
colors={k:rgba(v) for k,v in {'skin':'D9A67D','bone':'E8DCC0','muscle':'AD3C4B','organ':'D57760','vessel':'C93245','nerve':'E5B538'}.items()}
natural=json.load(open(ROOT+'/src/lib/anatomy/material-palette.json'))
colors={k:rgba(v) for k,v in natural['layers'].items()}
def tissue_color(p):
 id=p['id']
 if id.startswith('valve_'):key='valve'
 elif id.startswith('atrium_'):key='atrium'
 elif id.startswith('coronary_') and id!='coronary_sinus':key='coronary'
 elif id.startswith(('cardiac_vein','vena_','pulmonary_vein')) or id=='coronary_sinus':key='vein'
 elif id=='aorta' or id.startswith('pulmonary_artery') or id=='pulmonary_trunk':key='artery'
 elif p['assetId']=='heart':key='heart'
 elif id.startswith('lung_'):key='lung'
 elif id.startswith('brain'):key='brain'
 elif id.startswith('kidney'):key='kidney'
 elif id in ['liver','stomach','pancreas']:key=id
 elif any(x in id for x in ['jejunum','ileum','duodenum','colon','intestin']):key='intestine'
 elif id.startswith(('eye_','cornea_','lens_','vitreous_')):key='eye'
 elif id.startswith('iris_'):key='iris'
 elif id.startswith('retina_'):key='retina'
 elif id.startswith('hair_'):key='hair'
 elif id.startswith('auricle_'):return natural['layers']['skin']
 else:return natural['layers'][p['layer']]
 return natural[key]
materials={}
for layer,c in colors.items():
 m=bpy.data.materials.new('Rumila '+layer);m.diffuse_color=c;m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=c;bs.inputs['Roughness'].default_value=.65
 materials[layer]=m

def load_stl(name):
 data=open(ROOT+'/sources/anatomy/'+name+'.stl','rb').read();count=struct.unpack_from('<I',data,80)[0];vs=[];faces=[]
 for i in range(count):
  v=struct.unpack_from('<12f',data,84+i*50)
  start=len(vs);vs.extend([(v[j]/1000,v[j+1]/1000,v[j+2]/1000) for j in (3,6,9)]);faces.append((start,start+1,start+2))
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vs,[],faces);return mesh

report=[]
for p in plan:
 if p.get('kind')=='assembly':continue
 bm=bmesh.new()
 for name in p['sourceNames']:
  if p.get('sourceProvider')=='BodyParts3D':mesh=load_stl(name)
  else:
   obj=bpy.data.objects.get(name)
   if not obj:raise RuntimeError('Missing '+name)
   ev=obj.evaluated_get(deps);mesh=bpy.data.meshes.new_from_object(ev);mesh.transform(obj.matrix_world)
  if p['id']=='heart':
   for face in mesh.polygons:face.material_index=1 if 'atrium' in name.lower() else 0
  # Accumulate in one structure while preserving a distinct ID for every educational part.
  bm.from_mesh(mesh);bpy.data.meshes.remove(mesh)
 # Direct BP3D components use another coordinate origin. Register position only
 # against named anatomical landmarks in the target atlas; preserve source shape.
 # Kidney geometry itself is never read/copied from the non-commercial source.
 if p.get('sourceProvider')=='BodyParts3D':
  references={'FMA7204':['Kidney.r'],'FMA7205':['Kidney.l'],'FMA7234':['Inferior leaflet of right atrioventricular valve','Septal leaflet of right atrioventricular valve'],'FMA7235':['Posterior leaflet of left atrioventricular valve']}
  points=[bpy.data.objects[n].matrix_world @ Vector(v) for n in references[p['sourceNames'][0]] for v in bpy.data.objects[n].bound_box]
  center=Vector([(min(v[i] for v in points)+max(v[i] for v in points))/2 for i in range(3)])
  original=Vector([(min(v.co[i] for v in bm.verts)+max(v.co[i] for v in bm.verts))/2 for i in range(3)])
  offset=center-original
  bmesh.ops.translate(bm,verts=list(bm.verts),vec=offset)
  p['registration']={'translationMeters':list(offset),'method':'Bounding landmark center alignment; human review pending'}
 bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.000001)
 # The same source walls split into a removable anterior cover and the remaining tissue.
 # Chamber entries show tissue walls, never filled solid proxy volumes.
 if p.get('special') in ['heart-shell','chamber-wall']:
  bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),dist=.000001,plane_co=(0,-.051,0),plane_no=(0,1,0),clear_outer=p.get('special')=='heart-shell',clear_inner=p.get('special')=='chamber-wall')
 bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces))
 mesh=bpy.data.meshes.new(p['id']);bm.to_mesh(mesh);bm.free()
 obj=bpy.data.objects.new(p['id'],mesh);scene.collection.objects.link(obj)
 obj.data.materials.append(materials[p['layer']])
 for poly in mesh.polygons:poly.use_smooth=True
 # Naturalistic tissue palette is shared with the viewer and separate from UI tokens.
 obj.data.materials.clear();m=materials[p['layer']].copy();m.diffuse_color=rgba(tissue_color(p));m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=m.diffuse_color;obj.data.materials.append(m)
 if p['id']=='heart':
  m=materials['organ'].copy();m.diffuse_color=rgba(natural['atrium']);m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=m.diffuse_color;obj.data.materials.append(m)
 # Bounded simplification, preserving source shape and unique mesh names.
 target=18000 if p['id'].startswith('brain') else 7000 if p['assetId']=='heart' else 4500 if p['layer']=='organ' else 3000
 if len(mesh.polygons)>target:
  mod=obj.modifiers.new('Mobile LOD','DECIMATE');mod.ratio=target/len(mesh.polygons)
 p['meshNodeNames']=[p['id']];p['pickNodeNames']=[]
 vs=[v.co for v in mesh.vertices]; mn=[min(v[i] for v in vs) for i in range(3)];mx=[max(v[i] for v in vs) for i in range(3)]
 # glTF exporter rotates Z up to Y up: x,y,z -> x,z,-y.
 p['bounds']={'min':[mn[0],mn[2],-mx[1]],'max':[mx[0],mx[2],-mn[1]]}
 p['labelAnchor']=[(mn[0]+mx[0])/2,(mn[2]+mx[2])/2,-mn[1]]
 p['restTransform']={'position':[0,0,0],'rotation':[0,0,0],'scale':[1,1,1]}
 side=-1 if p['laterality']=='right' else 1
 p['explodePath']=[side*(.11 if p['assetId']!='heart' else .045),0,.08 if p['assetId']!='heart' else .035]
 if p['id']=='heart':p['explodePath']=[.13,0,.09]
 if p['assetId']=='head':p['explodePath']=[side*.018,0,.025]
 if p['id'].startswith('eye_'):p['explodePath']=[side*.045,0,0]
 if p['layer']=='skin':p['explodePath']=[side*.24,0,.10]
 p['childIds']=[c['id'] for c in plan if c['parentId']==p['id']]
 p['capabilities']={'disassemble':True,'interior':p['id']=='heart' or p['id'].startswith('eye_'),'section':p['id']=='heart','animation':p['id']=='heart','microInset':False}
 report.append({'id':p['id'],'sources':p['sourceNames'],'originalFaces':len(mesh.polygons),'bounds':p['bounds'],'reviewStatus':'pending'})
# Semantic assemblies are empty named nodes. All visible surfaces belong to the
# real anatomical child parts, so this introduces no duplicated proxy geometry.
for p in plan:
 if p.get('kind')!='assembly':continue
 members=[c for c in plan if c['parentId']==p['id']]
 mn=[min(c['bounds']['min'][i] for c in members) for i in range(3)];mx=[max(c['bounds']['max'][i] for c in members) for i in range(3)]
 obj=bpy.data.objects.new(p['id'],None);scene.collection.objects.link(obj)
 p.update(meshNodeNames=[p['id']],pickNodeNames=[],bounds={'min':mn,'max':mx},labelAnchor=[(mn[i]+mx[i])/2 for i in range(3)],restTransform={'position':[0,0,0],'rotation':[0,0,0],'scale':[1,1,1]},explodePath=[0,0,0],childIds=[c['id'] for c in members],capabilities={'disassemble':False,'interior':False,'section':False,'animation':False,'microInset':False})
 report.append({'id':p['id'],'kind':'assembly','childIds':p['childIds'],'reviewStatus':'pending'})
# Switch export scene (source remains intact in the editable master).
bpy.context.window.scene=scene
os.makedirs(ROOT+'/sources/anatomy/uncompressed',exist_ok=True)
for pack in sorted(set(p['assetId'] for p in plan)):
 for o in scene.objects:o.select_set(False)
 for p in plan:
  if p['assetId']==pack:scene.objects[p['id']].select_set(True)
 bpy.ops.export_scene.gltf(filepath=ROOT+'/sources/anatomy/uncompressed/'+pack+'.glb',export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True)
 print('EXPORTED',pack,flush=True)
 if pack in ['heart','organ','nerve','head','joints']:
  for o in scene.objects:
   if o.select_get():
    for mod in o.modifiers:
     if mod.type=='DECIMATE':mod.ratio=min(1,mod.ratio*5)
  bpy.ops.export_scene.gltf(filepath=ROOT+'/sources/anatomy/uncompressed/'+pack+'-detail.glb',export_format='GLB',use_selection=True,export_apply=True,export_yup=True,export_animations=False,export_extras=True)
  print('EXPORTED DETAIL',pack,flush=True)
# The subset is an editable native master; only selected runtime objects, no upstream code.
for s in list(bpy.data.scenes):
 if s!=scene:bpy.data.scenes.remove(s)
for t in list(bpy.data.texts):bpy.data.texts.remove(t)
bpy.data.orphans_purge(do_local_ids=True,do_linked_ids=True,do_recursive=True)
bpy.ops.wm.save_as_mainfile(filepath=ROOT+'/sources/anatomy/rumila-anatomy.blend',compress=True)
json.dump(plan,open(ROOT+'/sources/anatomy/compiled-parts.json','w'),ensure_ascii=False,indent=2)
json.dump(report,open(ROOT+'/docs/anatomy/geometry-report.json','w'),indent=2)
