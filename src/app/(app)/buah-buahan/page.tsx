import type { Metadata } from 'next';
import FruitExplorer from '@/components/fruits/fruit-explorer';
export const metadata:Metadata={title:'Kebun Buah 3D · Rumila',description:'Kenali 48 buah melalui model 3D, cerita, warna, bentuk, dan rasa.'};
export default function FruitPage(){return <FruitExplorer/>;}
