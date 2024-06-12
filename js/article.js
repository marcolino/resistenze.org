// load a "nuove resistenti" article
const loadArticle = (url) => {
  const articleTitle = document.getElementsByClassName("title")[0].innerText;
  const articlePath = encodeTextToUrlPath(articleTitle);
  //alert(articlePath);
  /**
   * TODO: bisogna decidere se rendere article.html dinamico, in modo che carichi da "sito/"
   *       gli articoli "vecchio stile" in questa funzione, oppure se modificare la generazione
   *       di tutti gli articoli nel "nuovo stile", per cui questa funzione sarebbe inutile...
   */
}

// encodes some text (usually an article title) to the path of the url
const encodeTextToUrlPath = (text) => {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\u00C0-\u017F\s-]|_/g, "");
}

document.addEventListener("DOMContentLoaded", () => loadArticle(), false);
