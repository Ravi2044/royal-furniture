const tiles = [
  ['/assets/royal-furniture-hero.png', 'A calm living room layered in cream, olive and walnut', 'md:col-span-2 md:row-span-2'],
  ['/assets/products/bed-oak.svg', 'Oak bed with woven cane headboard', ''],
  ['/assets/products/dining-walnut.svg', 'Walnut dining table', ''],
  ['/assets/products/chair-boucle.svg', 'Ivory bouclé lounge chair', ''],
  ['/assets/products/sideboard-green.svg', 'Forest-green fluted sideboard', 'md:col-span-2'],
]

export function GalleryPage() {
  return <div className="page-shell py-20 sm:py-28"><div className="max-w-3xl"><p className="eyebrow">Room inspiration</p><h1 className="display-title mt-5">A palette for living well.</h1><p className="mt-6 text-lg leading-8 text-royal-ink/65">An editorial sample gallery using project-local artwork. Replace it with the owner’s verified showroom and project photography.</p></div><div className="mt-12 grid auto-rows-[260px] gap-5 md:grid-cols-3">{tiles.map(([src, alt, classes]) => <figure key={src} className={`group relative overflow-hidden rounded-[2rem] bg-[#e8ddcc] ${classes}`}><img src={src} alt={alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-royal-green/90 px-4 py-3 text-sm font-medium text-white backdrop-blur">{alt}</figcaption></figure>)}</div></div>
}
