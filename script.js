// Alguns navegadors poden fallar per problemes de compatibilitat amb 
// propietats del CSS3.
// És Preferible utilitzar Firefox o Chrome per gaudir de l'exercici.

// Recursos interessants:
// http://www.adequatelygood.com/Minimum-Timer-Intervals-in-JavaScript.html
// http://www.schillmania.com/content/projects/javascript-animation-1/


// Variables
var inX = document.getElementById('inX'),
	inY = document.getElementById('inY'),
	fiX = document.getElementById('fiX'),
	fiY = document.getElementById('fiY'),
	vel = document.getElementById('vel'),
	ample = document.getElementById('map').offsetWidth,
	alt = document.getElementById('map').offsetHeight,
	obj = document.getElementById('boat'),
	obj1 = document.getElementById('x1'),
	obj2 = document.getElementById('x2'),
	obj3 = document.getElementById('trajecte'),
	obj4 = document.getElementById('tr'),
	obj5 = document.getElementById('percent'),
	obj6 = document.getElementById('temp');

	inX.value = Math.floor(Math.random() * ample);
	inY.value = Math.floor(Math.random() * alt);
	fiX.value = Math.floor(Math.random() * ample);
	fiY.value = Math.floor(Math.random() * alt);
	vel.value = Math.floor(Math.random() * 500 + 100);

// Posició inicial de obj.
	obj.style.left = inX.value + 'px';
	obj.style.top = inY.value + 'px';

// Funció que dispara l'animació
document.getElementById('inicia').onclick = function(){
	valida() ? start() : console.log('Valida es false');
}

// Validem els inputs i torna 'true' si tots compleixen els requisits
function valida(){
	var inputs = document.getElementsByTagName('input');
	var cnt = 0;
	if( parseInt(inX.value) >= 0 && parseInt(inX.value) <= ample){
		cnt += 1;
		inX.classList.remove('invalid');
	} else { inX.classList.add('invalid') }
	if( parseInt(fiX.value) >= 0 && parseInt(fiX.value) <= ample){
		cnt += 1;
		fiX.classList.remove('invalid');
	} else { fiX.classList.add('invalid') }
	if( parseInt(inY.value) >= 0 && parseInt(inY.value) <= alt){
		cnt += 1;
		inY.classList.remove('invalid');
	} else { inY.classList.add('invalid') }
	if( parseInt(fiY.value) >= 0 && parseInt(fiY.value) <= alt){
		cnt += 1;
		fiY.classList.remove('invalid');
	} else { fiY.classList.add('invalid') }
	if( parseInt(vel.value) >= 0 && parseInt(vel.value) <= 1000){
		cnt += 1;
		vel.classList.remove('invalid');
	} else { vel.classList.add('invalid') }
	return cnt == inputs.length;
	
}

function start(){
	// Botó 'disabled' per evitar la manipulació fins que no acabe l'animació
	document.getElementById('inicia').disabled = true;
	temps = new Date;

	// Posició inicial de obj.
	obj.style.left = inX.value + 'px';
	obj.style.top = inY.value + 'px';

	// Posició i estils inicials de X1
	obj1.style.left = inX.value + 'px';
	obj1.style.top = inY.value + 'px';
	obj1.style.opacity = '1';

	// Posició i estils inicials de X2
	obj2.style.left = fiX.value + 'px';
	obj2.style.top = fiY.value + 'px';
	obj2.style.opacity = '0';

	// Estils del trajecte
	obj4.style.width = '0px';

	// Calculem la distància entre punt inicial i final
	distX = Math.round(fiX.value - inX.value);
	distY = Math.round(fiY.value - inY.value);
	dist = Math.sqrt((Math.pow((inX.value - fiX.value), 2)) + (Math.pow((inY.value - fiY.value), 2)));

	// duració segons distancia y velocitat, en ms
	dura = dist / vel.value * 1000;

	// Angle http://stackoverflow.com/questions/17996979/incorrect-angle-wrong-side-calculated
	// Si X positiu i Y negatiu, o X negatiu i Y negatiu, segon i tercer quadrants.. 
	angle = ( (distX >= 0 && distY < 0) || (distX < 0 && distY < 0) ) ? 360 - (Math.acos(distX/dist)) * 180 / Math.PI : (Math.acos(distX/dist)) * 180 / Math.PI;
	
	// Posició de #trajecte
	obj3.style.transform = 'rotate('+angle+'deg)';
	obj3.style.width = dist + 'px';
	obj3.style.left = inX.value + 'px';
	obj3.style.top = inY.value + 'px';

	// Iniciem l'animació a 60FPS
	inter = setInterval('animacio()', 1000/60);
}

function animacio(){
	// Com d'avançats estem a la interpolació, de 0 a 1
	var prog = ( Date.now() - temps ) / dura;

	// Marcadors de progrès
	obj5.innerHTML = Math.floor( prog * 100 ) + '%';
	obj6.innerHTML = (Date.now() - temps)  + 'ms';

	// El vaixell es mou amb CSS3, li anem sumant la distància total recorreguda en cada interval
	angle >= 90 && angle <= 270 ? obj.style.transform = 'translate(' + distX * prog + 'px, ' + distY * prog + 'px) scale(-1,1)' : obj.style.transform = 'translate(' + distX * prog + 'px, ' + distY * prog + 'px)';

    // Dibuixem el recorregut
	obj4.style.width = dist * prog +'px';

	// L'animació finalitza quan arribem al 100%
	if (prog > 1) {
        clearInterval(inter);

        angle >= 90 && angle <= 270 ? obj.style.transform = 'translate(0px,0px) scale(-1,1)' : obj.style.transform = 'translate(0px,0px)';

		obj.style.left = fiX.value + 'px';
		obj.style.top = fiY.value + 'px';

		// Declarem nous valors per als inputs
		inX.value = fiX.value;
		inY.value = fiY.value;
		fiX.value = Math.floor(Math.random(fiX.value) * ample);
		fiY.value = Math.floor(Math.random(fiY.value) * alt);
		vel.value = Math.floor(Math.random() * 500 + 100);

		// Apareix X2
		obj2.style.opacity = '1';

		// Aquí fem trampa, a vegades passem del 100% (molt poques :P)
		obj5.innerHTML = '100%';

		// Activem el botó
		document.getElementById('inicia').disabled = false;
    };
}

// Primera opció que funciona, però la velocitat no és exacta per el retràs provocat
// pel navegador entre iteracions. El valor de setInterval mai és cada x milisegons.

/*
function start(){
	temps = new Date;
	obj = document.getElementById('boat');
	obj1 = document.getElementById('x1');
	obj2 = document.getElementById('x2');
	obj3 = document.getElementById('trajecte');
	obj4 = document.getElementById('tr');

	// Posició inicial de obj.
	obj.style.left = inX.value + 'px';
	obj.style.top = inY.value + 'px';

	// Posició i estils inicials de X1
	obj1.style.left = inX.value + 'px';
	obj1.style.top = inY.value + 'px';
	obj1.style.opacity = '1';

	// Posició i estils inicials de X2
	obj2.style.left = fiX.value + 'px';
	obj2.style.top = fiY.value + 'px';
	obj2.style.opacity = '0';

	// Declarem la posició de obj en el pas inicial
	valX = inX.value;
	valY = inY.value;

	// Calculem la distància entre punt inicial i final
	distX = Math.round(fiX.value - inX.value);
	distY = Math.round(fiY.value - inY.value);
	dist = Math.sqrt((Math.pow((inX.value - fiX.value), 2)) + (Math.pow((inY.value - fiY.value), 2)));

	// Angle http://stackoverflow.com/questions/17996979/incorrect-angle-wrong-side-calculated
	angle = ( (distX >= 0 && distY < 0) || (distX < 0 && distY < 0) ) ? 360 - (Math.acos(distX/dist)) * 180 / Math.PI : (Math.acos(distX/dist)) * 180 / Math.PI;
	
	// Calculem la distància a recorrer en cada pas
	pasX = ((fiX.value - valX) / dist);
	pasY = ((fiY.value - valY) / dist);
	// Posicionem la #trajecte
	obj3.style.transform = 'rotate('+angle+'deg)';
	obj3.style.width = dist + 'px';
	obj3.style.left = inX.value + 'px';
	obj3.style.top = inY.value + 'px';

	// Iniciem l'animació
	interval = setInterval('animacio()', 900/vel.value);
}

function animacio(){
	// Declarem la distancia total en cada pas i la arrodonim
	console.log((new Date - temps) / 1000 + 's');
	movX += pasX;
	movY += pasY;
	movX = Math.round(movX * 10000) / 10000;
	movY = Math.round(movY * 10000) / 10000;

	// Condicional que permet continuar setInterval o el para
	if(Math.abs(movX) <= Math.abs(distX) && Math.abs(movY) <= Math.abs(distY)){
		// El vaixell es mou amb CSS3, li anem sumant la distància total
		obj.style.transform = 'translate('+movX+'px,'+movY+'px)';
		// Dibuixem el recorregut
		obj4.style.width = Math.sqrt((Math.pow(movX, 2)) + (Math.pow(movY, 2)))+'px';
	} else {
		// Si no es cumpleix la condició, parem setInterval
		clearInterval(interval);
		// Reiniciem la posició del baixell
		obj.style.transform = 'translate(0px,0px)';
		obj.style.left = fiX.value + 'px';
		obj.style.top = fiY.value + 'px';
		// Reiniciem la distacia total per pas
		movX = 0;
		movY = 0;
		// Declarem nous valors per als inputs
		inX.value = fiX.value;
		inY.value = fiY.value;
		fiX.value = Math.floor(Math.random(fiX.value) * ample);
		fiY.value = Math.floor(Math.random(fiY.value) * alt);
		vel.value = Math.floor(Math.random() * 500);
		// Apareix X2
		obj2.style.opacity = '1';
	}
}
*/
