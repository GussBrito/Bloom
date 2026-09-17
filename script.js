/* ==========================================
   BLOOM
   PLAYER DE MÚSICA LOCAL
========================================== */


/* ==========================================
   ELEMENTOS
========================================== */

const audio =
    document.getElementById("audio");

const inputMusicas =
    document.getElementById("inputMusicas");

const btnAdicionar =
    document.getElementById("btnAdicionar");

const btnPlay =
    document.getElementById("btnPlay");

const btnPause =
    document.getElementById("btnPause");

const btnAnterior =
    document.getElementById("btnAnterior");

const btnProxima =
    document.getElementById("btnProxima");

const btnVoltar =
    document.getElementById("btnVoltar");

const btnShuffle =
    document.getElementById("btnShuffle");

const btnRepeat =
    document.getElementById("btnRepeat");

const btnFavorito =
    document.getElementById("btnFavorito");

const btnTema =
    document.getElementById("btnTema");

const volume =
    document.getElementById("volume");

const barraProgresso =
    document.getElementById("barraProgresso");

const progressoPreenchido =
    document.getElementById("progressoPreenchido");

const tempoAtual =
    document.getElementById("tempoAtual");

const duracao =
    document.getElementById("duracao");

const tituloMusica =
    document.getElementById("tituloMusica");

const nomeArquivo =
    document.getElementById("nomeArquivo");

const listaMusicas =
    document.getElementById("listaMusicas");

const playlistVazia =
    document.getElementById("playlistVazia");

/* BOTOES DE FAVICONS (CANTOS) */
const faviconTopLeft = document.querySelector('.favicon-btn.top-left');
const faviconTopRight = document.querySelector('.favicon-btn.top-right');
const faviconBottomLeft = document.querySelector('.favicon-btn.bottom-left');
const faviconBottomRight = document.querySelector('.favicon-btn.bottom-right');


/* ==========================================
   ESTADO
========================================== */

let musicas = [];

let indiceAtual = -1;

let shuffleAtivo = false;

let repeatAtivo = false;

let favoritos = new Set();


/* ==========================================
   TEMAS
========================================== */

const temas = [

    {
        nome: "lavanda",

        fundo: "#eee8e2",

        principal: "#73547e",

        secundario: "#a98bb2",

        destaque: "#e7b7c8",

        painel: "#fffdf8",

        painelMusica: "#faf4f6"
    },


    {
        nome: "rose",

        fundo: "#f1e6e4",

        principal: "#895c70",

        secundario: "#c98fa8",

        destaque: "#e8b8c8",

        painel: "#fffaf8",

        painelMusica: "#fdf0f3"
    },


    {
        nome: "sage",

        fundo: "#e9e9df",

        principal: "#687b67",

        secundario: "#91a58d",

        destaque: "#c7d4b9",

        painel: "#fffdf7",

        painelMusica: "#f3f5ec"
    }

];


let temaAtual = 0;


/* ==========================================
   APLICAR TEMA
========================================== */

function aplicarTema() {

    const tema =
        temas[temaAtual];


    document.documentElement.style.setProperty(
        "--bloom-fundo",
        tema.fundo
    );


    document.documentElement.style.setProperty(
        "--bloom-principal",
        tema.principal
    );


    document.documentElement.style.setProperty(
        "--bloom-secundario",
        tema.secundario
    );


    document.documentElement.style.setProperty(
        "--bloom-destaque",
        tema.destaque
    );


    document.documentElement.style.setProperty(
        "--bloom-painel",
        tema.painel
    );


    document.documentElement.style.setProperty(
        "--bloom-painel-musica",
        tema.painelMusica
    );

}


btnTema.addEventListener(
    "click",
    () => {

        temaAtual++;

        if (
            temaAtual >= temas.length
        ) {

            temaAtual = 0;

        }


        aplicarTema();

    }
);


/* ==========================================
   VOLUME INICIAL
========================================== */

audio.volume = 0.75;


/* ==========================================
   ABRIR SELEÇÃO DE ARQUIVOS
========================================== */

btnAdicionar.addEventListener(
    "click",
    () => {

        inputMusicas.click();

    }
);


/* ==========================================
   RECEBER ARQUIVOS
========================================== */

inputMusicas.addEventListener(
    "change",
    (evento) => {

        const arquivos =
            Array.from(
                evento.target.files
            );


        adicionarMusicas(
            arquivos
        );


        inputMusicas.value = "";

    }
);


/* ==========================================
   ADICIONAR MÚSICAS
========================================== */

function adicionarMusicas(
    arquivos
) {

    const novosArquivos =
        arquivos.filter(
            arquivo =>
                arquivo.type.startsWith(
                    "audio/"
                )
        );


    novosArquivos.forEach(
        arquivo => {

            musicas.push({

                arquivo: arquivo,

                nome:
                    removerExtensao(
                        arquivo.name
                    ),

                url:
                    URL.createObjectURL(
                        arquivo
                    )

            });

        }
    );


    renderizarPlaylist();


    if (
        indiceAtual === -1 &&
        musicas.length > 0
    ) {

        carregarMusica(0);

    }

}


/* ==========================================
   REMOVER EXTENSÃO
========================================== */

function removerExtensao(nome) {

    return nome.replace(
        /\.[^/.]+$/,
        ""
    );

}


/* ==========================================
   CARREGAR MÚSICA
========================================== */

function carregarMusica(
    indice
) {

    if (
        musicas.length === 0
    ) {

        return;

    }


    if (indice < 0) {

        indice =
            musicas.length - 1;

    }


    if (
        indice >= musicas.length
    ) {

        indice = 0;

    }


    indiceAtual = indice;


    const musica =
        musicas[indice];


    audio.src =
        musica.url;


    tituloMusica.textContent =
        musica.nome;


    nomeArquivo.textContent =
        musica.arquivo.name;


    audio.load();


    atualizarFavorito();


    renderizarPlaylist();

}


/* ==========================================
   PLAY
========================================== */

btnPlay.addEventListener(
    "click",
    reproduzir
);


function reproduzir() {

    if (
        musicas.length === 0
    ) {

        inputMusicas.click();

        return;

    }


    if (
        indiceAtual === -1
    ) {

        carregarMusica(0);

    }


    audio
        .play()
        .catch(
            erro => {

                console.log(
                    "Não foi possível reproduzir:",
                    erro
                );

            }
        );

}


/* ==========================================
   PAUSE
========================================== */

btnPause.addEventListener(
    "click",
    pausar
);


function pausar() {

    audio.pause();

}


/* ==========================================
   ANTERIOR
========================================== */

btnAnterior.addEventListener(
    "click",
    musicaAnterior
);


function musicaAnterior() {

    if (
        musicas.length === 0
    ) {

        return;

    }


    if (
        shuffleAtivo
    ) {

        carregarMusica(
            indiceAleatorio()
        );


        reproduzir();

        return;

    }


    carregarMusica(
        indiceAtual - 1
    );


    reproduzir();

}


/* ==========================================
   PRÓXIMA
========================================== */

btnProxima.addEventListener(
    "click",
    musicaProxima
);


function musicaProxima() {

    if (
        musicas.length === 0
    ) {

        return;

    }


    if (
        shuffleAtivo
    ) {

        carregarMusica(
            indiceAleatorio()
        );

    } else {

        carregarMusica(
            indiceAtual + 1
        );

    }


    reproduzir();

}


/* ==========================================
   VOLTAR 10 SEGUNDOS
========================================== */

btnVoltar.addEventListener(
    "click",
    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        audio.currentTime =
            Math.max(
                0,
                audio.currentTime - 10
            );

    }
);


/* ==========================================
   SHUFFLE
========================================== */

btnShuffle.addEventListener(
    "click",
    () => {

        shuffleAtivo =
            !shuffleAtivo;


        btnShuffle.classList.toggle(
            "ativo",
            shuffleAtivo
        );

    }
);


function indiceAleatorio() {

    if (
        musicas.length <= 1
    ) {

        return indiceAtual;

    }


    let novoIndice;


    do {

        novoIndice =
            Math.floor(
                Math.random() *
                musicas.length
            );

    } while (
        novoIndice === indiceAtual
    );


    return novoIndice;

}


/* ==========================================
   REPETIR
========================================== */

btnRepeat.addEventListener(
    "click",
    () => {

        repeatAtivo =
            !repeatAtivo;


        btnRepeat.classList.toggle(
            "ativo",
            repeatAtivo
        );

    }
);


/* ==========================================
   FAVORITO
========================================== */

btnFavorito.addEventListener(
    "click",
    () => {

        if (
            indiceAtual === -1
        ) {

            return;

        }


        if (
            favoritos.has(
                indiceAtual
            )
        ) {

            favoritos.delete(
                indiceAtual
            );

        } else {

            favoritos.add(
                indiceAtual
            );

        }


        atualizarFavorito();

        renderizarPlaylist();

    }
);


function atualizarFavorito() {

    if (
        favoritos.has(
            indiceAtual
        )
    ) {

        btnFavorito.textContent =
            "♥";

        btnFavorito.classList.add(
            "ativo"
        );

    } else {

        btnFavorito.textContent =
            "♡";

        btnFavorito.classList.remove(
            "ativo"
        );

    }

}


/* ==========================================
   VOLUME
========================================== */

volume.addEventListener(
    "input",
    () => {

        audio.volume =
            Number(
                volume.value
            );

    }
);


/* ==========================================
   PROGRESSO
========================================== */

audio.addEventListener(
    "timeupdate",
    atualizarProgresso
);


function atualizarProgresso() {

    if (
        !audio.duration
    ) {

        progressoPreenchido.style.width =
            "0%";

        tempoAtual.textContent =
            "0:00";

        return;

    }


    const porcentagem =
        (
            audio.currentTime /
            audio.duration
        ) * 100;


    progressoPreenchido.style.width =
        `${porcentagem}%`;


    tempoAtual.textContent =
        formatarTempo(
            audio.currentTime
        );

}


audio.addEventListener(
    "loadedmetadata",
    () => {

        duracao.textContent =
            formatarTempo(
                audio.duration
            );

    }
);


/* ==========================================
   CLICAR NA BARRA DE PROGRESSO
========================================== */

barraProgresso.addEventListener(
    "click",
    (evento) => {

        if (
            !audio.duration
        ) {

            return;

        }


        const retangulo =
            barraProgresso
                .getBoundingClientRect();


        const posicao =
            evento.clientX -
            retangulo.left;


        const porcentagem =
            posicao /
            retangulo.width;


        audio.currentTime =
            porcentagem *
            audio.duration;

    }
);


/* ==========================================
   FORMATA TEMPO
========================================== */

function formatarTempo(
    segundos
) {

    if (
        !Number.isFinite(
            segundos
        )
    ) {

        return "0:00";

    }


    const minutos =
        Math.floor(
            segundos / 60
        );


    const segundosRestantes =
        Math.floor(
            segundos % 60
        );


    return `${minutos}:${String(
        segundosRestantes
    ).padStart(2, "0")}`;

}


/* ==========================================
   QUANDO A MÚSICA TERMINA
========================================== */

audio.addEventListener(
    "ended",
    () => {

        if (
            repeatAtivo
        ) {

            audio.currentTime = 0;

            reproduzir();

            return;

        }


        musicaProxima();

    }
);


/* ==========================================
   PLAYLIST
========================================== */

function renderizarPlaylist() {

    listaMusicas.innerHTML = "";


    if (
        musicas.length === 0
    ) {

        listaMusicas.appendChild(
            playlistVazia
        );

        return;

    }


    musicas.forEach(
        (musica, indice) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "musica-item";


            if (
                indice === indiceAtual
            ) {

                item.classList.add(
                    "tocando"
                );

            }


            const capa =
                document.createElement(
                    "div"
                );


            capa.className =
                "musica-mini-capa";


            // usar imagem ilustrada como mini-capa (placeholder: favicons/playlist.png)
            capa.innerHTML = '<img src="favicons/playlist.png" alt="Capa" class="mini-capa-img">';


            const informacoes =
                document.createElement(
                    "div"
                );


            informacoes.className =
                "musica-nome";


            const nome =
                document.createElement(
                    "strong"
                );


            nome.textContent =
                musica.nome;


            const tipo =
                document.createElement(
                    "small"
                );


            tipo.textContent =
                musica.arquivo.type ||
                "arquivo de áudio";


            informacoes.appendChild(
                nome
            );


            informacoes.appendChild(
                tipo
            );


            const favorito =
                document.createElement(
                    "button"
                );


            favorito.className =
                "musica-favorito";


            favorito.textContent =
                favoritos.has(indice)
                    ? "♥"
                    : "♡";


            favorito.addEventListener(
                "click",
                (evento) => {

                    evento.stopPropagation();


                    if (
                        favoritos.has(
                            indice
                        )
                    ) {

                        favoritos.delete(
                            indice
                        );

                    } else {

                        favoritos.add(
                            indice
                        );

                    }


                    atualizarFavorito();

                    renderizarPlaylist();

                }
            );


            item.appendChild(
                capa
            );


            item.appendChild(
                informacoes
            );


            item.appendChild(
                favorito
            );


            item.addEventListener(
                "click",
                () => {

                    carregarMusica(
                        indice
                    );

                    reproduzir();

                }
            );


            listaMusicas.appendChild(
                item
            );

        }
    );

}


/* ==========================================
   TECLADO
========================================== */

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.code === "Space"
        ) {

            evento.preventDefault();


            if (
                audio.paused
            ) {

                reproduzir();

            } else {

                pausar();

            }

        }


        if (
            evento.code === "ArrowRight"
        ) {

            musicaProxima();

        }


        if (
            evento.code === "ArrowLeft"
        ) {

            musicaAnterior();

        }

    }
);


/* ==========================================
   INICIALIZAÇÃO
========================================== */

aplicarTema();

renderizarPlaylist();

/* Conectar botões dos cantos às ações do player */
if (faviconTopLeft) faviconTopLeft.addEventListener('click', musicaAnterior);
if (faviconTopRight) faviconTopRight.addEventListener('click', musicaProxima);
if (faviconBottomLeft) faviconBottomLeft.addEventListener('click', () => { btnShuffle.click(); });
if (faviconBottomRight) faviconBottomRight.addEventListener('click', () => { btnRepeat.click(); });