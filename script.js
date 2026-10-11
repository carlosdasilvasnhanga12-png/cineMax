
const filmes = [
  {
    id: 1,
    titulo: "Big Buck Bunny",
    ano: 2008,
    genero: "Animação",
    descricao: "Curta-metragem de animação da Blender Foundation.",
    cartaz: "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    video: "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    creditos: "Confirma os termos da licença antes de redistribuir o vídeo."
  },
  {
    id: 2,
    titulo: "Aventura no Espaço",
    ano: 2025,
    genero: "Ficção científica",
    descricao: "Título de demonstração sobre uma missão espacial.",
    cartaz: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 3,
    titulo: "O Mundo Natural",
    ano: 2025,
    genero: "Documentário",
    descricao: "Um título de demonstração dedicado à natureza.",
    cartaz: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 4,
    titulo: "A Grande Expedição",
    ano: 2024,
    genero: "Aventura",
    descricao: "Uma aventura de demonstração em paisagens naturais.",
    cartaz: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 5,
    titulo: "Planeta Azul",
    ano: 2023,
    genero: "Documentário",
    descricao: "Título de exemplo sobre os oceanos e a vida marinha.",
    cartaz: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 6,
    titulo: "O Reino da Floresta",
    ano: 2024,
    genero: "Fantasia",
    descricao: "Título de demonstração num mundo de fantasia.",
    cartaz: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 7,
    titulo: "Missão Impossível",
    ano: 2022,
    genero: "Ação",
    descricao: "Título fictício de demonstração para a categoria Ação.",
    cartaz: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 8,
    titulo: "Dias de Comédia",
    ano: 2023,
    genero: "Comédia",
    descricao: "Título fictício de demonstração para a categoria Comédia.",
    cartaz: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 9,
    titulo: "O Caminho de Casa",
    ano: 2021,
    genero: "Drama",
    descricao: "Título fictício de demonstração para a categoria Drama.",
    cartaz: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 10,
    titulo: "Heróis do Amanhã",
    ano: 2025,
    genero: "Aventura",
    descricao: "Título fictício de demonstração sobre uma equipa de aventureiros.",
    cartaz: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    video: "",
    creditos: ""
  }
];

const pesquisa = document.getElementById("pesquisa");
const genero = document.getElementById("genero");
const listaFilmes = document.getElementById("lista-filmes");
const listaFavoritos = document.getElementById("lista-favoritos");
const semResultados = document.getElementById("sem-resultados");
const semFavoritos = document.getElementById("sem-favoritos");
const contadorFilmes = document.getElementById("contador-filmes");

const leitor = document.getElementById("leitor");
const video = document.getElementById("video");
const tituloVideo = document.getElementById("titulo-video");
const descricaoVideo = document.getElementById("descricao-video");
const avisoVideo = document.getElementById("aviso-video");

let favoritos = [];
let categoriaAtiva = "Todos";

try {
  favoritos = JSON.parse(localStorage.getItem("cinemax-favoritos") || "[]");
  if (!Array.isArray(favoritos)) favoritos = [];
} catch {
  favoritos = [];
}

function criarCartao(filme) {
  const artigo = document.createElement("article");
  artigo.className = "filme";

  const imagem = document.createElement("img");
  imagem.className = "cartaz";
  imagem.src = filme.cartaz;
  imagem.alt = "Cartaz de " + filme.titulo;
  imagem.loading = "lazy";

  imagem.onerror = () => {
    imagem.removeAttribute("src");
    imagem.alt = "Imagem indisponível para " + filme.titulo;
  };

  const info = document.createElement("div");
  info.className = "filme-info";

  const titulo = document.createElement("h3");
  titulo.textContent = filme.titulo;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${filme.ano} · ${filme.genero}`;

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const botaoVer = document.createElement("button");
  botaoVer.className = "ver";
  botaoVer.textContent = filme.video ? "▶ Assistir" : "Detalhes";
  botaoVer.addEventListener("click", () => abrirFilme(filme));

  const botaoFav = document.createElement("button");
  const eFavorito = favoritos.includes(filme.id);
  botaoFav.className = "fav" + (eFavorito ? " ativo" : "");
  botaoFav.textContent = eFavorito ? "♥" : "♡";
  botaoFav.setAttribute("aria-label", "Alternar favorito de " + filme.titulo);
  botaoFav.setAttribute("aria-pressed", String(eFavorito));
  botaoFav.addEventListener("click", () => alternarFavorito(filme.id));

  acoes.append(botaoVer, botaoFav);
  info.append(titulo, meta, acoes);
  artigo.append(imagem, info);

  return artigo;
}

function mostrarFilmes() {
  const termo = pesquisa.value.trim().toLocaleLowerCase("pt");
  const categoria = categoriaAtiva;

  const resultados = filmes.filter(filme => {
    const texto = `${filme.titulo} ${filme.genero} ${filme.descricao}`
      .toLocaleLowerCase("pt");

    return texto.includes(termo) &&
      (categoria === "Todos" || filme.genero === categoria);
  });

  listaFilmes.replaceChildren(...resultados.map(criarCartao));
  semResultados.hidden = resultados.length > 0;
  contadorFilmes.textContent = `${resultados.length} filme(s)`;
  mostrarFavoritos();
}

function mostrarFavoritos() {
  const selecionados = filmes.filter(filme => favoritos.includes(filme.id));

  listaFavoritos.replaceChildren(...selecionados.map(criarCartao));
  semFavoritos.hidden = selecionados.length > 0;
}

function alternarFavorito(id) {
  favoritos = favoritos.includes(id)
    ? favoritos.filter(favoritoId => favoritoId !== id)
    : [...favoritos, id];

  try {
    localStorage.setItem("cinemax-favoritos", JSON.stringify(favoritos));
  } catch {
    console.warn("Não foi possível guardar os favoritos neste navegador.");
  }

  mostrarFilmes();
}

function abrirFilme(filme) {
  tituloVideo.textContent = filme.titulo;
  descricaoVideo.textContent = filme.descricao;
  avisoVideo.textContent = "";

  video.pause();
  video.removeAttribute("src");
  video.load();

  if (filme.video) {
    video.src = filme.video;
    avisoVideo.textContent = filme.creditos || "";
    video.load();
  } else {
    avisoVideo.textContent =
      "Vídeo não disponível: este é um título de demonstração. Só adiciona vídeos que tens autorização para publicar.";
  }

  leitor.showModal();
}

function fecharLeitor() {
  video.pause();
  video.removeAttribute("src");
  video.load();
  if (leitor.open) leitor.close();
}

pesquisa.addEventListener("input", mostrarFilmes);

genero.addEventListener("change", () => {
  categoriaAtiva = genero.value;
  atualizarBotoesCategoria();
  mostrarFilmes();
});

function atualizarBotoesCategoria() {
  document.querySelectorAll(".categoria").forEach(botao => {
    const ativa = botao.dataset.genero === categoriaAtiva;
    botao.classList.toggle("ativa", ativa);
    botao.setAttribute("aria-pressed", String(ativa));
  });
}

document.querySelectorAll(".categoria").forEach(botao => {
  botao.addEventListener("click", () => {
    categoriaAtiva = botao.dataset.genero;
    genero.value = categoriaAtiva;
    atualizarBotoesCategoria();
    mostrarFilmes();
  });
});

document.getElementById("fechar").addEventListener("click", fecharLeitor);

leitor.addEventListener("click", evento => {
  if (evento.target === leitor) fecharLeitor();
});

leitor.addEventListener("close", () => {
  video.pause();
  video.removeAttribute("src");
  video.load();
});

atualizarBotoesCategoria();
mostrarFilmes();
