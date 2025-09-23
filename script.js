// Revelar ao rolar
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ 
    if (e.isIntersecting) e.target.classList.add('show'); 
  }); 
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Conectar linha do primeiro ao último ponto em cada grupo .info
function updateConnectors(){
  document.querySelectorAll('.info').forEach(group=>{
    const items = Array.from(group.querySelectorAll('.info-item'));
    const connector = group.querySelector('.connector');
    if (!items.length || !connector) return;
    
    const firstDot = items[0].querySelector('.dot');
    const lastDot  = items[items.length-1].querySelector('.dot');
    const gRect = group.getBoundingClientRect();
    const fRect = firstDot.getBoundingClientRect();
    const lRect = lastDot.getBoundingClientRect();
    
    const top = (fRect.top + fRect.height/2) - gRect.top;
    const bottom = (lRect.top + lRect.height/2) - gRect.top;
    
    connector.style.top = `${top}px`;
    connector.style.height = `${Math.max(0, bottom - top)}px`;
  });
}

// Atualizar conectores quando a página carrega, redimensiona ou rola
window.addEventListener('load', updateConnectors);
window.addEventListener('resize', updateConnectors);
window.addEventListener('scroll', ()=>{ 
  clearTimeout(window._connT); 
  window._connT = setTimeout(updateConnectors, 50); 
});

// Adicionar efeitos de hover mais pronunciados para os cards
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar listeners para todos os cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.08)';
      this.style.boxShadow = '0 28px 70px rgba(34,211,238,.3)';
      this.style.filter = 'brightness(1.15)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = '0 12px 32px rgba(0,0,0,.25)';
      this.style.filter = 'brightness(1)';
    });
  });
  
  // Adicionar listeners para info-items
  document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 28px 60px rgba(34,211,238,.25)';
      this.style.filter = 'brightness(1.12)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 18px 38px rgba(0,0,0,.28)';
      this.style.filter = 'brightness(1)';
    });
  });
  
  // Campo de estrelas no fundo da página
  const starfield = document.querySelector('.starfield');
  if (starfield) {
    const total = 90; // ainda mais leve
    for (let i = 0; i < total; i++) {
      const s = document.createElement('div');
      s.className = 'star ' + (Math.random() > 0.6 ? 'small' : '');
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const tw = (3.5 + Math.random() * 4.5).toFixed(2) + 's';
      s.style.left = left + '%';
      s.style.top = top + '%';
      s.style.setProperty('--twinkle', tw);
      starfield.appendChild(s);
    }
  }
});
