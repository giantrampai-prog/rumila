import bpy,json
from mathutils import Vector
out=[]
for o in bpy.data.objects:
 if o.type in ['MESH','CURVE']:
  vs=[o.matrix_world @ Vector(v) for v in o.bound_box]
  out.append({'name':o.name,'collections':[c.name for c in o.users_collection], 'type':o.type,'vertices':len(o.data.vertices) if o.type=='MESH' else 0,'faces':len(o.data.polygons) if o.type=='MESH' else -1,'min':[min(v[i] for v in vs) for i in range(3)],'max':[max(v[i] for v in vs) for i in range(3)],'materials':[m.name for m in o.data.materials if m]})
with open('/Users/macbook/RUMILA/rumila-app/sources/anatomy/z-inventory.json','w') as f:json.dump(out,f)
print('INVENTORY',len(out))
