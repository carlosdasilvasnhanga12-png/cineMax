
const filmes = [
  {
    id: 1,
    titulo: "Big Buck Bunny",
    ano: 2008,
    genero: "Animação",
    descricao:
      "Uma curta-metragem de animação sobre um coelho e os animais que encontra. Vídeo de demonstração.",
    cartaz:
      "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg",
    video:
      "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
    creditos:
      "Big Buck Bunny — Blender Foundation. Confirma os termos da licença antes de redistribuir ou publicar este vídeo."
  },
  {
    id: 2,
    titulo: "Aventura no Espaço",
    ano: 2025,
    genero: "Aventura",
    descricao:
      "Título de exemplo para demonstração do catálogo. Adiciona um vídeo autorizado para o disponibilizar.",
    cartaz:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=500&q=80",
    video: "",
    creditos: ""
  },
  {
    id: 3,
    titulo: "O Mundo Natural",
    ano: 2025,
    genero: "Documentário",
    descricao:
      "Título de exemplo para um documentário. Adiciona um vídeo com autorização de publicação.",
    cartaz:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=500&q=80",
    video: "videos/meu-filme.mp4",
    creditos: ""
  },
  {
    id: 4,
    titulo: "A Grande Expedição",
    ano: 2024,
    genero: "Aventura",
    descricao:
      "Título de exemplo para futuras aventuras no teu catálogo.",
    cartaz:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=500&q=80",
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

const leitor = document.getElementById("leitor");
const video = document.getElementById("video");
const tituloVideo = document.getElementById("titulo-video");
const descricaoVideo = document.getElementById("descricao-video");
const avisoVideo = document.getElementById("aviso-video");

let favoritos = [];

try {
  favoritos = JSON.parse(
    localStorage.getItem("cinemax-favoritos") || "[]"
  );

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
    imagem.alt = "Imagem indisponível";
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
  botaoFav.className =
    "fav" + (favoritos.includes(filme.id) ? " ativo" : "");
  botaoFav.textContent = favoritos.includes(filme.id) ? "♥" : "♡";
  botaoFav.setAttribute("aria-label", "Alternar favorito");

  botaoFav.addEventListener("click", () => {
    alternarFavorito(filme.id);
  });

  acoes.append(botaoVer, botaoFav);
  info.append(titulo, meta, acoes);
  artigo.append(imagem, info);

  return artigo;
}

function mostrarFilmes() {
  const termo = pesquisa.value.trim().toLocaleLowerCase("pt");
  const categoria = genero.value;

  const resultados = filmes.filter(filme => {
    const nomeCorresponde =
      filme.titulo.toLocaleLowerCase("pt").includes(termo);

    const generoCorresponde =
      categoria === "Todos" || filme.genero === categoria;

    return nomeCorresponde && generoCorresponde;
  });

  listaFilmes.replaceChildren(...resultados.map(criarCartao));
  semResultados.hidden = resultados.length > 0;

  mostrarFavoritos();
}

function mostrarFavoritos() {
  const selecionados = filmes.filter(filme =>
    favoritos.includes(filme.id)
  );

  listaFavoritos.replaceChildren(
    ...selecionados.map(criarCartao)
  );

  semFavoritos.hidden = selecionados.length > 0;
}

function alternarFavorito(id) {
  if (favoritos.includes(id)) {
    favoritos = favoritos.filter(favoritoId => favoritoId !== id);
  } else {
    favoritos.push(id);
  }

  try {
    localStorage.setItem(
      "cinemax-favoritos",
      JSON.stringify(favoritos)
    );
  } catch {
    console.warn("Não foi possível guardar os favoritos.");
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
    avisoVideo.textContent = filme.creditos;
    video.load();
  } else {
    avisoVideo.textContent =
      "Este é um título de demonstração. Ainda não foi associado um vídeo autorizado.";
  }

  leitor.showModal();
}

function fecharLeitor() {
  video.pause();
  video.removeAttribute("src");
  video.load();
  leitor.close();
}

pesquisa.addEventListener("input", mostrarFilmes);
genero.addEventListener("change", mostrarFilmes);

document.getElementById("fechar").addEventListener("click", fecharLeitor);

leitor.addEventListener("click", evento => {
  if (evento.target === leitor) fecharLeitor();
});

leitor.addEventListener("close", () => {
  video.pause();
  video.removeAttribute("src");
  video.load();
});

mostrarFilmes();
