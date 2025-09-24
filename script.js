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
  // Intro overlay logic
  const intro = document.getElementById('intro');
  const introBtn = document.getElementById('introStart');
  const introStars = document.querySelector('.intro-stars');
  const introCanvas = document.getElementById('introCanvas');
  if (intro && introBtn && introStars) {
    // generate intro stars
    const totalIntro = 260; // mais estrelas
    for (let i = 0; i < totalIntro; i++) {
      const s = document.createElement('div');
      // 20% estrelas brancas
      const isWhite = Math.random() < 0.2;
      const isTwinkle = Math.random() < 0.35; // 35% piscam
      s.className = 'star' + (isWhite ? ' white' : '') + (isTwinkle ? ' twinkle' : '');
      const left = (Math.random() * 100);
      const top = (Math.random() * 100);
      const size = (Math.random() < 0.2) ? (2 + Math.random()*2) : (1 + Math.random()*1.5);
      const op = 0.7 + Math.random()*0.3;
      const g1 = 14 + Math.random()*14; // glow interno
      const g2 = 26 + Math.random()*24; // glow externo
      const ga = 0.85 + Math.random()*0.13;
      const gb = 0.70 + Math.random()*0.20;
      const sat = 1.1 + Math.random()*0.3;
      const b = 1.1 + Math.random()*0.3;
      s.style.left = left + '%';
      s.style.top = top + '%';
      s.style.setProperty('--size', size + 'px');
      s.style.setProperty('--op', op);
      s.style.setProperty('--g1', g1 + 'px');
      s.style.setProperty('--g2', g2 + 'px');
      s.style.setProperty('--ga', ga.toString());
      s.style.setProperty('--gb', gb.toString());
      s.style.setProperty('--sat', sat.toString());
      s.style.setProperty('--b', b.toString());
      // micro drift sempre ativo para parecer vivo
      const ox = ((Math.random() * 8) - 4).toFixed(1) + 'px';
      const oy = ((Math.random() * 8) - 4).toFixed(1) + 'px';
      const driftDur = (10 + Math.random()*10).toFixed(1) + 's';
      const driftDelay = (Math.random()*3).toFixed(1) + 's';
      s.style.setProperty('--ox', ox);
      s.style.setProperty('--oy', oy);
      s.style.setProperty('--driftDur', driftDur);
      s.style.setProperty('--driftDelay', driftDelay);

      const dur = (2.6 + Math.random()*3.2).toFixed(2) + 's';
      const delay = (Math.random()*2.5).toFixed(2) + 's';
      s.style.setProperty('--twDur', dur);
      s.style.setProperty('--twDelay', delay);
      introStars.appendChild(s);
    }
    introBtn.addEventListener('click', () => {
      // fade button
      introBtn.classList.add('fading');
      // motion-trail orbit animation with canvas
      if (introCanvas && introCanvas.getContext) {
        const ctx = introCanvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const canvasRect = introCanvas.getBoundingClientRect();
        introCanvas.width = Math.floor(canvasRect.width * dpr);
        introCanvas.height = Math.floor(canvasRect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Como o canvas é maior que a viewport (inset negativo no CSS), usamos o centro visual
        const cx = canvasRect.width / 2;
        const cy = canvasRect.height / 2;
        const start = performance.now();
        const dur = 2000; // 2s
        // Use the stars already on screen (DOM) as initial positions
        const domStars = Array.from(introStars.querySelectorAll('.star'));
        const baseAngularSpeed = 4.5; // rad/s, mais devagar e suave
        const stars = domStars.map(el => {
          const r = el.getBoundingClientRect();
          const x = (r.left - canvasRect.left) + r.width/2;
          const y = (r.top - canvasRect.top) + r.height/2;
          const dx = x - cx;
          const dy = y - cy;
          // Quantizar em anéis para sensação mais circular/organizada
          const rawRadius = Math.hypot(dx, dy);
          const ring = 16; // espaçamento do anel em px
          const radius = Math.max(8, Math.round(rawRadius / ring) * ring) + (Math.random()*2 - 1);
          const angle = Math.atan2(dy, dx);
          // Pequena variação por anel para paralaxe sutil, mas mesmo sentido
          const ringIndex = Math.max(0, Math.round(rawRadius / ring));
          const speed = baseAngularSpeed * (0.9 + Math.min(0.12, ringIndex*0.01));
          const isWhite = el.classList.contains('white');
          return { radius, angle, speed, px: x, py: y, white: isWhite };
        });
        // hide DOM points to let canvas render brighter trails only
        introStars.style.visibility = 'hidden';
        // fill black background once
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0,0,canvasRect.width,canvasRect.height);
        let last = start;
        function frame(now){
          const dt = (now - last) / 1000;
          last = now;
          const t = Math.min(1, (now - start) / dur);
          // easing suave ao longo do tempo (começa devagar, acelera, desacelera)
          const ease = 0.2 + 0.8 * (0.5 - 0.5 * Math.cos(Math.PI * t));
          // fade to keep trail and glow
          ctx.globalCompositeOperation = 'source-over';
          // Fade dinâmico: aumenta ao longo do tempo para sumir o rastro
          const fadeAlpha = 0.85 + 0.12 * t; // 0.85 → 0.97 (fundo bem mais perto do preto)
          ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
          ctx.fillRect(0,0,canvasRect.width,canvasRect.height);
          ctx.globalCompositeOperation = 'source-over';
          for (const s of stars){
            const prevX = s.px, prevY = s.py;
            s.angle += s.speed * dt * ease;
            const x = cx + Math.cos(s.angle) * s.radius;
            const y = cy + Math.sin(s.angle) * s.radius;
            const grad = ctx.createLinearGradient(prevX, prevY, x, y);
            if (s.white) {
              grad.addColorStop(0, 'rgba(255,255,255,0.00)');
              grad.addColorStop(1, 'rgba(255,255,255,0.44)');
            } else {
              grad.addColorStop(0, 'rgba(147,197,253,0.00)');
              grad.addColorStop(1, 'rgba(147,197,253,0.42)');
            }
            ctx.strokeStyle = grad;
            // Alpha global decresce para rastro se dissipar
            ctx.globalAlpha = 0.42 - 0.20 * t; // mais brilho inicial, ainda dissipando
            ctx.lineWidth = 0.85;
            ctx.shadowColor = 'rgba(147,197,253,0.38)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.stroke();
            const g2 = ctx.createRadialGradient(x, y, 0, x, y, 2.6);
            if (s.white) {
              g2.addColorStop(0, 'rgba(255,255,255,1)');
              g2.addColorStop(1, 'rgba(255,255,255,0.48)');
            } else {
              g2.addColorStop(0, 'rgba(219,234,254,1)');
              g2.addColorStop(1, 'rgba(147,197,253,0.38)');
            }
            ctx.fillStyle = g2;
            ctx.globalAlpha = 0.75 - 0.35 * t; // ponto mais brilhante no início
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI*2);
            ctx.fill();
            s.px = x; s.py = y;
          }
          if (t < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      } else {
        // fallback simple spin
        introStars.classList.add('spin');
      }
      // after animation, hide overlay
      setTimeout(()=>{ 
        intro.classList.add('hidden'); 
        // Após a animação, vamos para a página de conteúdo
        window.location.href = 'conteudo.html';
      }, 2000);
    });
  }

  // Clique em Finalizar: se houver overlay (#thanks), mostra; senão, redireciona para a página final
  let finalTriggered = false;
  const finalizarBtn = document.getElementById('finalizarBtn');
  const thanks = document.getElementById('thanks');
  const pageTransition = document.getElementById('pageTransition');
  function navigateWithFade(url){
    if (!pageTransition){ window.location.href = url; return; }
    pageTransition.classList.add('show');
    setTimeout(()=>{ window.location.href = url; }, 650);
  }
  // Fade-in ao chegar na página
  if (pageTransition){
    // começa oculto; se vier de navegação, remove após pequeno atraso
    requestAnimationFrame(()=>{
      pageTransition.classList.remove('show');
    });
  }
  if (finalizarBtn) {
    finalizarBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (finalTriggered) return;
      finalTriggered = true;
      if (thanks) {
        // Mostrar overlay local e depois escurecer página inteira para ir para finalizar.html
        thanks.classList.remove('hidden');
        thanks.classList.add('show');
        setTimeout(()=>{ navigateWithFade('finalizar.html'); }, 1400);
      } else {
        // Ir para a página final com transição
        navigateWithFade('finalizar.html');
      }
    });
  }
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
  
  // Campo de bolinhas subindo no fundo da página
  const starfield = document.querySelector('.starfield');
  if (starfield) {
    // Criar canvas para bolinhas animadas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.8'; // Mais visível
    starfield.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let bubbles = [];
    let animationId;
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    function createBubble() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        size: 1 + Math.random() * 3,
        speed: 50 + Math.random() * 80, // Mais rápidas (era 20-60, agora 50-130)
        opacity: 0.4 + Math.random() * 0.6, // Mais brilhante
        color: 'orange' // Sempre laranja
      };
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Adicionar novas bolinhas ocasionalmente (ainda menos frequente)
      if (Math.random() < 0.03) { // Era 0.05, agora 0.03 (ainda menos)
        bubbles.push(createBubble());
      }
      
      // Atualizar e desenhar bolinhas
      bubbles = bubbles.filter(bubble => {
        bubble.y -= bubble.speed * 0.016; // ~60fps
        
        if (bubble.y < -bubble.size) {
          return false; // Remover se saiu da tela
        }
        
        // Desenhar bolinha
        ctx.globalAlpha = bubble.opacity;
        ctx.beginPath();
        
        // Gradiente laranja mais brilhante
        const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.size);
        gradient.addColorStop(0, 'rgba(251,146,60,1)'); // Laranja brilhante no centro
        gradient.addColorStop(0.5, 'rgba(245,158,11,0.8)'); // Laranja dourado
        gradient.addColorStop(1, 'rgba(251,146,60,0.2)'); // Laranja suave na borda
        ctx.fillStyle = gradient;
        
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fill();
        
        return true; // Manter bolinha
      });
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Inicializar
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Começar animação quando a página principal aparecer
    setTimeout(() => {
      animate();
    }, 2500); // Aguardar a animação de introdução terminar
  }
});
