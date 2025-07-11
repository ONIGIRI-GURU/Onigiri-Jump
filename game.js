const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseBtn = document.getElementById('pauseBtn');
const overlay = document.getElementById('pauseOverlay');
const resumeBtn = document.getElementById('resumeBtn');

let isPaused = false, gameOver = false, score = 0;
const onigiri = { x: 50, y:200, w:50, h:50, vy:0, gravity:0.8, jumpPower:-12 };
const obstacles = [];
const images = ['img/naruto_mask.png','img/pikachu_tail.png','img/sailor_moon_bow.png'].map(src => {
  const img = new Image(); img.src = src; return img;
});

function jump(){ if(onigiri.y>=200){ onigiri.vy = onigiri.jumpPower; }}

function createObstacle(){
  obstacles.push({ x:800, y:220, w:40, h:40, speed:6, img: images[Math.floor(Math.random()*images.length)] });
}
setInterval(createObstacle, 1400);

function drawOnigiri(){
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.arc(onigiri.x+25,onigiri.y+25,25,0,2*Math.PI); ctx.fill(); ctx.stroke();
}
function drawObs(o){ ctx.drawImage(o.img, o.x, o.y, o.w, o.h); }

function update(){
  onigiri.y += onigiri.vy;
  onigiri.vy += onigiri.gravity;
  if(onigiri.y > 200){ onigiri.y = 200; onigiri.vy=0; }
  obstacles.forEach((o,i)=> {
    o.x -= o.speed;
    if(o.x< -o.w){ obstacles.splice(i,1); score++; }
    if(collision(onigiri,o)) gameOver = true;
  });
}

function collision(a,b){
  return a.x<a.x+b.w && a.x+ a.w>b.x && a.y<b.y+b.h && a.y+a.h>b.y;
}

function loop(){
  if(isPaused||gameOver){
    if(gameOver){
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle='white';
      ctx.font='30px sans-serif';
      ctx.fillText('GAME OVER',300,150);
      ctx.fillText('Счёт: '+score,330,200);
    }
    return;
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawOnigiri(); update(); obstacles.forEach(drawObs);
  ctx.fillStyle='white'; ctx.fillText('Счёт: '+score,20,30);
  requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => { if(e.code==='Space') jump(); });
canvas.addEventListener('click', jump);

pauseBtn.onclick = () => { isPaused = true; overlay.classList.remove('hidden'); };
resumeBtn.onclick = () => { isPaused = false; overlay.classList.add('hidden'); loop(); };

loop();