import { db } from "./db.js";
import { books } from "@shared/schema.js";

const sampleBooks = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A tale of love, reputation, and the complexities of English society in the early 19th century. Follow Elizabeth Bennet as she navigates the treacherous waters of courtship, family expectations, and her own prejudices toward the mysterious Mr. Darcy.",
    price: 12.99,
    category: "Classic",
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    publishedYear: 1813,
    pages: 432,
    inStock: true,
  },
  {
    title: "The Count of Monte Cristo",
    author: "Alexandre Dumas",
    description: "An epic tale of betrayal, imprisonment, and revenge. Young sailor Edmond Dantès is falsely accused of treason and imprisoned in the Château d'If. After a daring escape, he discovers a hidden treasure and reinvents himself as the mysterious Count.",
    price: 18.99,
    category: "Adventure",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    publishedYear: 1844,
    pages: 1276,
    inStock: true,
  },
  {
    title: "Wuthering Heights",
    author: "Emily Brontë",
    description: "A haunting tale of passion and revenge on the Yorkshire moors. The turbulent relationship between Heathcliff and Catherine Earnshaw drives this gothic masterpiece through generations of love, loss, and longing.",
    price: 11.99,
    category: "Romance",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    publishedYear: 1847,
    pages: 416,
    inStock: true,
  },
  {
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    description: "A philosophical novel exploring beauty, morality, and the corruption of the soul. Young Dorian Gray remains eternally youthful while his portrait bears the marks of his sins and debauchery.",
    price: 10.99,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop",
    publishedYear: 1890,
    pages: 254,
    inStock: true,
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    description: "An orphaned governess falls for her brooding employer, only to discover dark secrets lurking within the walls of Thornfield Hall. A revolutionary tale of a woman's quest for independence and love.",
    price: 13.99,
    category: "Romance",
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
    publishedYear: 1847,
    pages: 500,
    inStock: true,
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    description: "The original science fiction masterpiece. Victor Frankenstein's ambition leads him to create life from death, but his creature's existence becomes a tragic tale of rejection and revenge.",
    price: 9.99,
    category: "Science Fiction",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
    publishedYear: 1818,
    pages: 280,
    inStock: true,
  },
  {
    title: "The Mysteries of Udolpho",
    author: "Ann Radcliffe",
    description: "A gothic romance filled with supernatural terrors and dark secrets. Young Emily St. Aubert is held captive in the sinister castle of Udolpho by the villainous Montoni.",
    price: 15.99,
    category: "Mystery",
    coverUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
    publishedYear: 1794,
    pages: 632,
    inStock: false,
  },
  {
    title: "Great Expectations",
    author: "Charles Dickens",
    description: "Orphan Pip's journey from humble beginnings to gentleman's estate, navigating love, loss, and the true meaning of worth in Victorian England.",
    price: 14.99,
    category: "Classic",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop",
    publishedYear: 1861,
    pages: 544,
    inStock: true,
  },
  {
    title: "The Scarlet Letter",
    author: "Nathaniel Hawthorne",
    description: "In Puritan Massachusetts, Hester Prynne is condemned to wear a scarlet 'A' for adultery. A powerful exploration of sin, guilt, and redemption in early America.",
    price: 8.99,
    category: "Fiction",
    coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    publishedYear: 1850,
    pages: 272,
    inStock: true,
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    description: "The immortal vampire Count Dracula travels to England seeking new blood, while a band of heroes led by Professor Van Helsing vows to stop his dark reign of terror.",
    price: 12.99,
    category: "Fantasy",
    coverUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=600&fit=crop",
    publishedYear: 1897,
    pages: 418,
    inStock: true,
  },
  {
    title: "Les Misérables",
    author: "Victor Hugo",
    description: "The epic tale of Jean Valjean's journey from prisoner to mayor, pursued by the relentless Inspector Javert through the turmoil of 19th-century France.",
    price: 24.99,
    category: "History",
    coverUrl: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=600&fit=crop",
    publishedYear: 1862,
    pages: 1488,
    inStock: true,
  },
  {
    title: "The Canterbury Tales",
    author: "Geoffrey Chaucer",
    description: "A collection of tales told by pilgrims on their journey to Canterbury, offering a vivid portrait of medieval English society across all classes.",
    price: 16.99,
    category: "Poetry",
    coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop",
    publishedYear: 1400,
    pages: 504,
    inStock: true,
  },
];

export async function seedBooks() {
  try {
    const existingBooks = await db.select().from(books);
    
    if (existingBooks.length === 0) {
      console.log("Seeding database with sample books...");
      await db.insert(books).values(sampleBooks);
      console.log(`Successfully seeded ${sampleBooks.length} books!`);
    } else {
      console.log(`Database already has ${existingBooks.length} books, skipping seed.`);
    }
  } catch (error) {
    console.error("Error seeding books:", error);
  }
}
