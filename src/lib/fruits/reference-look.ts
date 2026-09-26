import type { Fruit } from './catalog';

/** The selected varieties and colors in Rumila's GPT Image catalog, also used by 3D. */
const PALETTE:Record<string,[string,string]>={
 pisang:['#eac344','#8f6636'],mangga:['#90a34c','#efa63c'],jeruk:['#f28c12','#d6ac3c'],apel:['#bd352d','#e5ad56'],
 semangka:['#294f2c','#8eab49'],melon:['#83956b','#d7c99a'],pepaya:['#eda136','#8d9c43'],nanas:['#c39434','#756e38'],
 anggur:['#583147','#ae91a6'],stroberi:['#c92323','#e7b871'],alpukat:['#3e642a','#81944d'],kelapa:['#765033','#b38d5d'],
 durian:['#858644','#baad67'],rambutan:['#b32920','#abb043'],manggis:['#422334','#6f4a54'],salak:['#734326','#ad7d43'],
 duku:['#ccb073','#9c793e'],lengkeng:['#aa885d','#cbb18b'],'jambu-biji':['#a9b96b','#d8cc84'],'jambu-air':['#c93743','#ef8891'],
 belimbing:['#dfc23a','#88a140'],sawo:['#a9815e','#d3b68d'],sirsak:['#4f7b39','#9fa860'],nangka:['#85944a','#bba553'],
 'buah-naga':['#d52e68','#91a540'],markisa:['#624057','#9a6f75'],srikaya:['#96a76c','#c4c793'],kedondong:['#a5b34b','#d2bb64'],
 'jeruk-bali':['#adbb57','#d7d485'],'jeruk-nipis':['#589333','#a0bd4b'],lemon:['#e6c532','#f2df80'],pir:['#d7c36a','#b9a663'],
 kiwi:['#886641','#bba176'],kurma:['#994d2b','#bb8351'],delima:['#ac352f','#d28665'],kesemek:['#e38b29','#d5af58'],
 leci:['#b84d4b','#e29485'],plum:['#493148','#8c7594'],persik:['#e6a85e','#cd6261'],cempedak:['#ba8c38','#d4a348'],
 langsat:['#d1ba86','#a58a54'],matoa:['#8c4e3d','#b08f5e'],blewah:['#e6ad53','#82914c'],'terong-belanda':['#b2432f','#dd8151'],
 ceri:['#971c2c','#ca4541'],cermai:['#ddd16f','#eee3a1'],jamblang:['#302135','#695170'],'jambu-bol':['#a3293e','#d06170'],
};
export function fruitReferenceLook(fruit:Fruit):Fruit {
 const colors=PALETTE[fruit.id];
 return colors?{...fruit,color:colors[0],accent:colors[1]}:fruit;
}
