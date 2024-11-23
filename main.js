var scroller=document.querySelector("#contCanvas")
var lienzo=document.querySelector("canvas")
var ctx=lienzo.getContext("2d")
var wceldas=10
var lienzoW=1400
var nceldas=lienzoW/wceldas
var intervalo
var mapa1=[]
var desplazandose='hidden'
var run=false
var moviendo
var clickeando=false
var borrando=false
var mapa2=[]
lienzo.width=lienzoW
lienzo.height=lienzoW


//crea el mapa en blanco
const limpiarMapa = () => {
  if (run) {
    play()
  }
  for (let i = 0; i < nceldas; i++) {
    mapa1[i] = []
    mapa2[i] = []
    for (let o = 0; o < nceldas; o++) {
      mapa1[i][o] = 0
      mapa2[i][o] = 0
    }
  }
  drawCeldas()
  
}


let rect=(i,o)=>{
  ctx.beginPath()
  if (mapa2[i][o]==0) {
    ctx.fillStyle='white'
  }else{
    ctx.fillStyle='black'
  }
  ctx.fillRect(o*wceldas,i*wceldas,wceldas,wceldas)
  ctx.fill()
  
}

//dibuja las celdas
const drawCeldas=()=>{
  for (let i = 0; i < nceldas; i++) {
  for (let o = 0; o < nceldas; o++) {
    rect(i,o)
  }
}
drawLine()
}


const drawLine = ()=>{
  //dibujar lineas horizontales
for (let i = 0; i < nceldas; i++) {
  ctx.beginPath()
  ctx.moveTo(i * wceldas, 0)
  ctx.lineTo(i * wceldas, lienzoW)
  ctx.stroke()
  ctx.fill()
}
//dibujar lineas verticales

for (let i = 0; i < nceldas; i++) {
  ctx.beginPath()
  ctx.moveTo(0,i*wceldas)
  ctx.lineTo(lienzoW,i * wceldas)
  ctx.stroke()
  ctx.fill()
}
}


//intercambia los valores dependiendo del valor al click
let vida=(xp,yp)=>{
  mapa2[yp][xp]==0?viva(yp,xp):muerta(yp,xp)
  rect(yp,xp)
}



//comienza el bucle
let play=()=>{
  if (run) {
    run=false
    clearInterval(intervalo)
  }else{
    run=true
  intervalo=setInterval(()=>{
    
  let mapaA=[]
  
  let valores = (y,x)=>{
    if (mapa2[y]!=undefined&&mapa2[y][x]!=undefined) {
      return mapa2[y][x]
    }else{
      return 0
    }
  }
  
  for (let i = 0; i < nceldas; i++) {
    mapaA[i]=[]
    for (let o = 0; o < nceldas; o++) {
      mapaA[i][o]=0
      let arrizq=valores(i - 1,o - 1 )
      let arr=valores( i - 1,o )
      let arrder=valores(i - 1,o + 1 )
      let izq = valores(i, o - 1)
      let der = valores(i, o + 1)
      let abaizq = valores(i + 1, o - 1)
      let aba = valores(i + 1, o)
      let abader = valores(i + 1, o + 1)
      let sum=arrizq+arr+arrder+izq+der+abaizq+aba+abader
      let valActual=mapa2[i][o]
      
      if (valActual==1) {
        if(sum<2|| sum>3){
          mapa1[i][o]=0
        }else{
          mapa1[i][o]=1
        }
      } else if(valActual==0){
        if (sum==3) {
          mapa1[i][o]=1
        } else {
          mapa1[i][o]=0
        }
      }
  }}
  mapa2=[...mapa1]
  mapa1=[...mapaA]
  
  drawCeldas()
},90)
}
}



//al dar click en el boton clear se activa 
//el borrador
let borrar=()=>{
  let btn=document.getElementById("clearBtn")
  borrando=borrando?false:true
  btn.innerText=borrando?"Draw":"Clear"
}




//vive o mata
let viva=(yp,xp)=>mapa2[yp][xp]=1
let muerta=(yp,xp)=>mapa2[yp][xp]=0



//para movil
// Obtener la posición del lienzo en la página
function getCanvasPosition(canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  };
}



let inicioToque=() => {
clickeando = true;
}



let moviendoToque=(e,type)=>{
  let x;
  let y;
    if (clickeando==true) {
      moviendo = true;
    if (type) {
       x = Math.floor(e.offsetX / wceldas);
       y = Math.floor(e.offsetY / wceldas);
    }else  if (desplazandose=='hidden') {
      let touch = e.changedTouches[0];
      const canvasPos = getCanvasPosition(lienzo);
      x = Math.floor((touch.clientX - canvasPos.left) / wceldas);
      y = Math.floor((touch.clientY - canvasPos.top) / wceldas);
    }
    if (x < nceldas && y < nceldas) {
      borrando ? muerta(y, x) : viva(y, x);
      
      if (run) {
        rect(y,x)
      }else{
        drawCeldas()
      }
    }
  }
}


let finToque=(e,type)=>{
  let x;
  let y;
  if(type){
   x = Math.floor(e.offsetX / wceldas);
   y = Math.floor(e.offsetY / wceldas);
  }else  if (!desplazandose){
    let touch = e.changedTouches[0];
    const canvasPos = getCanvasPosition(lienzo);
    x = Math.floor((touch.clientX - canvasPos.left) / wceldas);
    y = Math.floor((touch.clientY - canvasPos.top) / wceldas);
  }
  if(!moviendo){
    vida(x,y)
    if (run) {
      rect(y,x)
    }else{
      drawCeldas()
    }
  }
   clickeando=0
   moviendo=0
}






let desplazarte=()=>{
  desplazandose=scroller.style.overflow=scroller.style.overflow=='auto'?'hidden':'auto'
  
}

limpiarMapa()