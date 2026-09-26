async (page) => {
 console.log(await page.evaluate(()=>({metrics:JSON.parse(document.querySelector('[data-testid="anatomy-canvas"]').dataset.metrics),overflow:document.documentElement.scrollWidth>innerWidth,canvases:document.querySelectorAll('canvas').length,selected:document.querySelector('.anatomy-detail h2')?.textContent,body:document.querySelector('.anatomy-stage').getBoundingClientRect().toJSON()})));
}
