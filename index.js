"use strict";
exports.__esModule = true;
var aggiungiPiatti = document.querySelector('.aggiungi-piatto');
var listaOrdini = JSON.parse(localStorage.getItem('ordini')) || [];
var piatti = document.querySelector('.piatti'); //dico a Ts che tipo di elemento, perchè ognuno ha delle diverse proprietà
//const listaOrdini: Piatto[] = [];           //possiamo assegnare Array , perchè punta Heap 
aggiungiPiatti.addEventListener('submit', aggiungiPiatto); //fz soggetto a hoisting
//HOISTING -> dichiarazione delle fz vengono portate tutte automaticamente in alto
function aggiungiPiatto(event) {
    // quando inviamo il form, la pagina viene ricaricata -> prevniamo con prevenDefault();
    event.preventDefault();
    var nome = (this.querySelector('[name="piatto"]')).value; //.value -> da l'elemento che getto, gli dico cosa voglio esattamente (value)
    // ! -> dico a ts che son consapevole che può dare errore
    var piatto = {
        nome: nome,
        portato: false
    };
    listaOrdini.push(piatto);
    popolaLista();
    localStorage.setItem('ordini', JSON.stringify(listaOrdini)); //stringyfy -> trasforma un ogeetto in stringa | parse -> stringa in oggetto
    //Storage -> oggetto presente a lv di browser (lo trovo nella sezione "Application"(dove si trova anche "console"))
    this.reset();
}
function popolaLista() {
    //map -> Metodo degli array, con del codice che desideriamo noi
    //3 parametri: singolo elemento iterbaile, indice di quell'eleemnto e array iterabile
    piatti.innerHTML = listaOrdini.map(function (ordine, index) {
        return "\n        <li>\n        <input type= \"checkbox\" data-index=\"".concat(index, "\" id=\"item").concat(index, "\"  ").concat(ordine.portato ? 'checked' : '', " />\n        <label for=\"item").concat(index, "\"> ").concat(ordine.nome, " </label>         \n        </li>"); //id & for -> devono essere uguali per poterli far funzionare
        //OP TERNARIO -> condizione ? vero : falso
    }).join(''); //trasformi l'array in una string, con nessun separatore in mezzo, perchè hai messo ''
}
piatti.addEventListener('click', togglePortato);
function togglePortato(event) {
    //qui ci posizionamo su ul -> per avere eventlistener su 'li', e loro vengono generati dinamicamente, ma essendo in ascolto su lu, grazie alla propagation, becco l'evento anche se quel <li> 'non esiste' nel codice
    var el = event.target;
    if (el.matches('input')) {
        var index = Number(el.dataset.index); //la passiamo come parametro all'oggetto Number che ci restituisce un numero.
        listaOrdini[index].portato = !listaOrdini[index].portato;
        localStorage.setItem('ordini', JSON.stringify(listaOrdini));
        popolaLista(); //aggiorniamo la nsotra lista
    }
}
var list = document.getElementById("piatti");
var swiping = false;
var startX, currentX;
list.addEventListener("mousedown", handleSwipeStart);
list.addEventListener("touchstart", handleSwipeStart);
list.addEventListener("mousemove", handleSwipeMove);
list.addEventListener("touchmove", handleSwipeMove);
list.addEventListener("mouseup", handleSwipeEnd);
list.addEventListener("touchend", handleSwipeEnd);
function handleSwipeStart(event) {
    var touch = event.type === "touchstart" ? event.touches[0] : event;
    startX = touch.clientX;
    swiping = true;
}
function handleSwipeMove(event) {
    if (!swiping)
        return;
    var touch = event.type === "touchmove" ? event.touches[0] : event;
    currentX = touch.clientX;
    var diff = currentX - startX;
    event.target.classList.add("swiping");
    event.target.style.transform = "translateX(".concat(diff, "px)");
}
function handleSwipeEnd(event) {
    var touch = event.type === "touchend" ? event.changedTouches[0] : event;
    currentX = touch.clientX;
    var diff = currentX - startX;
    var threshold = event.target.offsetWidth * 0.4;
    if (diff < -threshold) {
        event.target.style.transform = "translateX(-100%)";
        setTimeout(function () { return event.target.remove(); }, 200);
    }
    else {
        event.target.style.transform = "translateX(0)";
    }
    event.target.classList.remove("swiping");
    swiping = false;
}
popolaLista();
//COMPITO X CASA: un pulsante per killare tutta la lista
// ESE CSS: https://flukeout.github.io/ 
