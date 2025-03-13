import axios from "axios";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=";

export const fetchBookRecommendations = async (category: string) => {
  try {
    const response = await axios.get(
      `${GOOGLE_BOOKS_API}subject:${encodeURIComponent(category)}&langRestrict=pt&maxResults=1`
    );

    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }

    const bookInfo = response.data.items[0].volumeInfo;

    return {
      bookId: response.data.items[0].id,
      title: bookInfo.title || "Título desconhecido",
      author: bookInfo.authors ? bookInfo.authors.join(", ") : "Autor desconhecido",
      coverUrl: bookInfo.imageLinks?.thumbnail || "",
      description: bookInfo.description || "Sem descrição disponível",
      link: bookInfo.infoLink || "",
    };
  } catch (error) {
    console.error("Erro ao buscar livro:", error);
    return null;
  }
};
