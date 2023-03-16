//STORAGE 
    //SESSION storage -> quando chiudo la sessione, la session storage si svuota
    //LOCAL storage -> anche se chiudo tutto, non si svuota
                // oggetto presente a lv di browser
                export {} //CANCELLARE QUESTO PER FARLO FUNZIONARE! (Appariranno 9 errori (ts2393) (ts24**))
interface Piatto {
    nome: string;
    portato: boolean;       //per dire che lo abbiamo preso o no 
}

const aggiungiPiatti = document.querySelector('.aggiungi-piatto') as HTMLFormElement;
const listaOrdini: Piatto[] = JSON.parse(localStorage.getItem('ordini')!) || [];
const piatti = document.querySelector('.piatti') as HTMLElement;    //dico a Ts che tipo di elemento, perchè ognuno ha delle diverse proprietà
//const listaOrdini: Piatto[] = [];           //possiamo assegnare Array , perchè punta Heap 

aggiungiPiatti.addEventListener('submit', aggiungiPiatto);      //fz soggetto a hoisting


//HOISTING -> dichiarazione delle fz vengono portate tutte automaticamente in alto
function aggiungiPiatto(this: any, event: Event) {
    // quando inviamo il form, la pagina viene ricaricata -> prevniamo con prevenDefault();
    event.preventDefault();
    const nome = (this.querySelector('[name="piatto"]'))!.value;    //.value -> da l'elemento che getto, gli dico cosa voglio esattamente (value)
    // ! -> dico a ts che son consapevole che può dare errore
    const piatto = {
        nome, 
        portato : false
    }
    listaOrdini.push(piatto);
    popolaLista();
    localStorage.setItem('ordini', JSON.stringify(listaOrdini));    //stringyfy -> trasforma un ogeetto in stringa | parse -> stringa in oggetto
    //Storage -> oggetto presente a lv di browser (lo trovo nella sezione "Application"(dove si trova anche "console"))
    this.reset();
}
function popolaLista() {
    //map -> Metodo degli array, con del codice che desideriamo noi
        //3 parametri: singolo elemento iterbaile, indice di quell'eleemnto e array iterabile
    piatti.innerHTML = listaOrdini.map((ordine, index) => {
        return `
        <li>
        <input type= "checkbox" data-index="${index}" id="item${index}"  ${ordine.portato ? 'checked' : ''} />
        <label for="item${index}"> ${ordine.nome} </label>         
        </li>`  //id & for -> devono essere uguali per poterli far funzionare
        //OP TERNARIO -> condizione ? vero : falso
    }).join('') //trasformi l'array in una string, con nessun separatore in mezzo, perchè hai messo ''
}


piatti.addEventListener('click', togglePortato);
function togglePortato(event: MouseEvent) {
    //qui ci posizionamo su ul -> per avere eventlistener su 'li', e loro vengono generati dinamicamente, ma essendo in ascolto su lu, grazie alla propagation, becco l'evento anche se quel <li> 'non esiste' nel codice
    const el = event.target! as HTMLLIElement

    if (el.matches('input')) {
        const index = Number(el.dataset.index);             //la passiamo come parametro all'oggetto Number che ci restituisce un numero.
        listaOrdini[index].portato = !listaOrdini[index].portato;
        localStorage.setItem('ordini', JSON.stringify(listaOrdini));
        popolaLista();  //aggiorniamo la nsotra lista
    }
}



const list = document.getElementById("piatti") as HTMLElement;
let swiping = false;
let startX: number, currentX: number;

list.addEventListener("mousedown", handleSwipeStart);
list.addEventListener("touchstart", handleSwipeStart);

list.addEventListener("mousemove", handleSwipeMove);
list.addEventListener("touchmove", handleSwipeMove);

list.addEventListener("mouseup", handleSwipeEnd);
list.addEventListener("touchend", handleSwipeEnd);

function handleSwipeStart(event: MouseEvent | TouchEvent) {
  const touch = event.type === "touchstart" ? (event as TouchEvent).touches[0] : (event as MouseEvent);
  startX = touch.clientX;
  swiping = true;
}

function handleSwipeMove(event: MouseEvent | TouchEvent) {
  if (!swiping) return;
  const touch = event.type === "touchmove" ? (event as TouchEvent).touches[0] : (event as MouseEvent);
  currentX = touch.clientX;
  const diff = currentX - startX;
  (event.target as HTMLElement).classList.add("swiping");
  (event.target as HTMLElement).style.transform = `translateX(${diff}px)`;
}

function handleSwipeEnd(event: MouseEvent | TouchEvent) {
  const touch = event.type === "touchend" ? (event as TouchEvent).changedTouches[0] : (event as MouseEvent);
  currentX = touch.clientX;
  const diff = currentX - startX;
  const threshold = (event.target as HTMLElement).offsetWidth * 0.4;
  if (diff < -threshold) {
    (event.target as HTMLElement).style.transform = `translateX(-100%)`;
    setTimeout(() => (event.target as HTMLElement).remove(), 200);
  } else {
    (event.target as HTMLElement).style.transform = `translateX(0)`;
  }
  (event.target as HTMLElement).classList.remove("swiping");
  swiping = false;
}





popolaLista();



//COMPITO X CASA: un pulsante per killare tutta la lista
// ESE CSS: https://flukeout.github.io/ 
