import bpy
bpy.data.orphans_purge(do_local_ids=True,do_linked_ids=True,do_recursive=True)
bpy.ops.wm.save_as_mainfile(filepath='/Users/macbook/RUMILA/rumila-app/sources/anatomy/rumila-anatomy.blend',compress=True)
