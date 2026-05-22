import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory dataset of Movies & Series
const initialMovies = [
  {
    id: "interstellar",
    title: "Interstellar",
    type: "Sci-Fi",
    contentType: "movie",
    year: 2014,
    runtime: "2h 49m",
    rating: 8.7,
    img: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "When Earth becomes uninhabitable, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.",
    interpreter: "NEW RELEASE",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"]
  },
  {
    id: "inception",
    title: "Inception",
    type: "Sci-Fi",
    contentType: "movie",
    year: 2010,
    runtime: "2h 28m",
    rating: 8.8,
    img: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    interpreter: "POPULAR",
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"]
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    type: "Action",
    contentType: "movie",
    year: 1999,
    runtime: "2h 16m",
    rating: 8.7,
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    interpreter: "CLASSIC",
    director: "Lana Wachowski, Lilly Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"]
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    type: "Sci-Fi",
    contentType: "movie",
    year: 2024,
    runtime: "2h 46m",
    rating: 8.9,
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.",
    interpreter: "NEW RELEASE",
    director: "Denis Villeneuve",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler", "Florence Pugh"]
  },
  {
    id: "the-dark-knight",
    title: "The Dark Knight",
    type: "Action",
    contentType: "movie",
    year: 2008,
    runtime: "2h 32m",
    rating: 9.0,
    img: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    interpreter: "TRENDING",
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Maggie Gyllenhaal"]
  },
  {
    id: "breaking-bad",
    title: "Breaking Bad",
    type: "Crime",
    contentType: "series",
    year: 2008,
    runtime: "5 Seasons",
    rating: 9.5,
    img: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    description: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family's future.",
    interpreter: "TRENDING",
    director: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul", "Anna Gunn", "Bob Odenkirk"]
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "Sci-Fi",
    contentType: "series",
    year: 2016,
    runtime: "4 Seasons",
    rating: 8.7,
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    interpreter: "POPULAR",
    director: "The Duffer Brothers",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"]
  },
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    type: "Action",
    contentType: "series",
    year: 2023,
    runtime: "1 Season",
    rating: 8.8,
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    description: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl who may be humanity's last hope.",
    interpreter: "NEW RELEASE",
    director: "Craig Mazin, Neil Druckmann",
    cast: ["Pedro Pascal", "Bella Ramsey", "Gabriel Luna", "Anna Torv"]
  },
  {
    id: "severance",
    title: "Severance",
    type: "Crime",
    contentType: "series",
    year: 2022,
    runtime: "1 Season",
    rating: 8.7,
    img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    description: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives. When a mysterious colleague appears outside of work, it begins a journey to discover the truth about their jobs.",
    interpreter: "POPULAR",
    director: "Ben Stiller",
    cast: ["Adam Scott", "Patricia Arquette", "John Turturro", "Christopher Walken"]
  },
  {
    id: "the-godfather",
    title: "The Godfather",
    type: "Crime",
    contentType: "movie",
    year: 1972,
    runtime: "2h 55m",
    rating: 9.2,
    img: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?q=80&w=800",
    backdropUrl: "https://images.unsplash.com/photo-1550133730-695473e51000?q=80&w=1600",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    interpreter: "CLASSIC",
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"]
  }
];

// Memory database with clean dynamic updates
let movies = [...initialMovies];
let comments = [
  {
    id: "c1",
    movieId: "interstellar",
    userName: "NolanFan99",
    text: "An absolute masterpiece. Hans Zimmer's pipe organ score sends shivers down my spine every single time.",
    rating: 5,
    timestamp: "2 hours ago"
  },
  {
    id: "c2",
    movieId: "interstellar",
    userName: "AstroGal",
    text: "The science, the emotion, the sheer scale of the film... outstanding depiction of gravity and relativity.",
    rating: 5,
    timestamp: "1 day ago"
  },
  {
    id: "c3",
    movieId: "breaking-bad",
    userName: "Heisenberg",
    text: "Best television writing in history. Walter's character arc is a masterclass.",
    rating: 5,
    timestamp: "3 days ago"
  }
];

let watchlist = [
  { id: "w1", movieId: "inception", addedAt: new Date().toISOString() },
  { id: "w2", movieId: "dune-part-two", addedAt: new Date().toISOString() }
];

// Mock Admin & Members Database
let users = [
  { id: "u1", userName: "NolanFan99", email: "nolanfan@gmail.com", joinedDate: "2026-01-12", status: "Active", role: "Critic" },
  { id: "u2", userName: "AstroGal", email: "astrogal@nasa.gov", joinedDate: "2026-03-04", status: "Active", role: "Member" },
  { id: "u3", userName: "Heisenberg", email: "walterwhite@grey-matter.com", joinedDate: "2026-04-20", status: "Active", role: "Member" },
  { id: "u4", userName: "Admin User", email: "admin@fastmovie.com", joinedDate: "2025-12-01", status: "Active", role: "Super Admin" }
];

// Helper to lazy-init Gemini safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// REST API Endpoints

// 1. Get all movies and series
app.get("/api/movies", (req, res) => {
  res.json({ success: true, movies });
});

// 2. Get specific movie
app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find(m => m.id === req.params.id);
  if (movie) {
    res.json({ success: true, movie });
  } else {
    res.status(404).json({ success: false, message: "Movie not found" });
  }
});

// Admin stats calculation
app.get("/api/admin/stats", (req, res) => {
  const totalMovies = movies.filter(m => m.contentType === 'movie').length;
  const totalSeries = movies.filter(m => m.contentType === 'series').length;
  
  // count unique usernames from comments
  const uniqueUsers = new Set(comments.map(c => c.userName));
  const activeCommenters = uniqueUsers.size || 3;

  // sum total views or simulated count
  const totalComments = comments.length;
  const avgRating = movies.length > 0
    ? parseFloat((movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1))
    : 8.8;

  res.json({
    success: true,
    stats: {
      totalMovies,
      totalSeries,
      totalUsers: users.length,
      activeCommenters,
      totalComments,
      avgRating
    }
  });
});

// Admin login authentication verification
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.json({
      success: true,
      token: "fastmovie_secure_admin_jwt_token_2026",
      user: {
        userName: "Admin User",
        email: "admin@fastmovie.com",
        role: "Super Admin"
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid admin username or credentials password. Use 'admin' as standard!"
    });
  }
});

// Admin Users Catalog
app.get("/api/admin/users", (req, res) => {
  res.json({ success: true, users });
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter(u => u.id !== id);
  res.json({ success: true, message: "User deleted successfully." });
});

app.put("/api/admin/users/:id/status", (req, res) => {
  const { id } = req.params;
  const user = users.find(u => u.id === id);
  if (user) {
    user.status = user.status === "Active" ? "Suspended" : "Active";
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Admin Add Movie/Series
app.post("/api/movies", (req, res) => {
  const { title, type, contentType, year, runtime, img, backdropUrl, videoUrl, description, interpreter, director, cast } = req.body;
  if (!title || !type || !contentType || !description) {
    return res.status(400).json({ success: false, message: "Required movie details missing." });
  }

  const generatedId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `movie_${Date.now()}`;
  
  const newMovie = {
    id: generatedId,
    title,
    type,
    contentType: contentType === 'series' ? 'series' as const : 'movie' as const,
    year: Number(year) || 2026,
    runtime: runtime || "2h 10m",
    rating: 7.5, // Default start rating
    img: img || "https://images.unsplash.com/photo-1542204172-e7052809a936?q=80&w=800",
    backdropUrl: backdropUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600",
    videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description,
    interpreter: interpreter || "NEW RELEASE",
    director: director || "Unknown Director",
    cast: Array.isArray(cast) ? cast : typeof cast === 'string' ? cast.split(',').map((cValue: string) => cValue.trim()) : ["FastMovie Cast"]
  };

  movies.unshift(newMovie);
  res.status(201).json({ success: true, movie: newMovie });
});

// Admin Update Movie/Series Details
app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const index = movies.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Media title not found." });
  }

  const { title, type, contentType, year, runtime, img, backdropUrl, videoUrl, description, interpreter, director, cast } = req.body;
  
  movies[index] = {
    ...movies[index],
    title: title || movies[index].title,
    type: type || movies[index].type,
    contentType: contentType || movies[index].contentType,
    year: Number(year) || movies[index].year,
    runtime: runtime || movies[index].runtime,
    img: img || movies[index].img,
    backdropUrl: backdropUrl || movies[index].backdropUrl,
    videoUrl: videoUrl || movies[index].videoUrl,
    description: description || movies[index].description,
    interpreter: interpreter || movies[index].interpreter,
    director: director || movies[index].director,
    cast: Array.isArray(cast) ? cast : typeof cast === 'string' ? cast.split(',').map((cValue: string) => cValue.trim()) : movies[index].cast
  };

  res.json({ success: true, movie: movies[index] });
});

// Admin Delete Movie/Series
app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  movies = movies.filter(m => m.id !== id);
  res.json({ success: true, message: "Media entry successfully deleted from catalog." });
});

// Admin Get all system comments for full review moderation
app.get("/api/admin/comments", (req, res) => {
  res.json({ success: true, comments });
});

// Admin Delete comment (comment moderator moderation purging)
app.delete("/api/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter(c => c.id !== id);
  res.json({ success: true, message: "Comment review successfully deleted" });
});

// 3. Comments handler
app.get("/api/comments/:movieId", (req, res) => {
  const filtered = comments.filter(c => c.movieId === req.params.movieId);
  res.json({ success: true, comments: filtered });
});

app.post("/api/comments", (req, res) => {
  const { movieId, userName, text, rating } = req.body;
  if (!movieId || !userName || !text) {
    return res.status(400).json({ success: false, message: "Missing required comment fields." });
  }
  const newComment = {
    id: `c_${Date.now()}`,
    movieId,
    userName: userName.substring(0, 30),
    text: text.substring(0, 400),
    rating: Number(rating) || 5,
    timestamp: "Just now"
  };
  comments.unshift(newComment);
  res.status(201).json({ success: true, comment: newComment });
});

// 4. Watchlist handler
app.get("/api/watchlist", (req, res) => {
  const items = watchlist.map(w => {
    const movie = movies.find(m => m.id === w.movieId);
    return movie ? { ...w, movie } : null;
  }).filter(Boolean);
  res.json({ success: true, watchlist: items });
});

app.post("/api/watchlist", (req, res) => {
  const { movieId } = req.body;
  if (!movieId) {
    return res.status(400).json({ success: false, message: "Movie ID is required." });
  }
  if (!movies.some(m => m.id === movieId)) {
    return res.status(404).json({ success: false, message: "Movie not found inside catalog." });
  }
  const alreadyIn = watchlist.some(w => w.movieId === movieId);
  if (alreadyIn) {
    return res.json({ success: true, message: "Already in watchlist." });
  }
  const item = {
    id: `w_${Date.now()}`,
    movieId,
    addedAt: new Date().toISOString()
  };
  watchlist.push(item);
  res.status(201).json({ success: true, item });
});

// Remove item from watchlist
app.delete("/api/watchlist/:movieId", (req, res) => {
  const { movieId } = req.params;
  watchlist = watchlist.filter(w => w.movieId !== movieId);
  res.json({ success: true, message: "Removed from watchlist." });
});

// 5. Rate Movie
app.post("/api/movies/:id/rate", (req, res) => {
  const { rating } = req.body;
  const movie = movies.find(m => m.id === req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }
  // Calculate new average
  const parsedRating = Number(rating);
  if (parsedRating >= 1 && parsedRating <= 10) {
    movie.rating = Number(((movie.rating * 5 + parsedRating) / 6).toFixed(1));
    return res.json({ success: true, newRating: movie.rating });
  }
  res.status(400).json({ success: false, message: "Invalid rating value." });
});

// 6. Gemini-powered Movie AI assistant endpoint (server side)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: true,
        reply: "Hello! I am your FastMovie AI Hub assistant. However, I need the standard **GEMINI_API_KEY** environment variable to be configured in **Settings > Secrets** in order to provide true smart movie suggestions. Currently, you can explore the wonderful movies and series in our catalog, add comments, build your watchlist, and start watching in real time!",
        isConfigured: false
      });
    }

    // Build systemic context featuring our interactive movie/series database
    const movieCatalogContext = movies.map(m => `- [${m.contentType === 'series' ? 'Series' : 'Movie'}] "${m.title}" (ID: ${m.id}, Genre: ${m.type}, Year: ${m.year}, Rating: ${m.rating}/10, Synopsis: ${m.description}, Cust: ${m.cast.join(', ')}, Director: ${m.director})`).join("\n");

    const systemPrompt = `You are "FastMovie AI", an energetic, highly knowledgeable movie reviewer and expert recommendation assistant built for the FastMovie web streaming application. 
    You have a sleek, lime-green, and dark cinematic style. Your voice is movie-enthusiastic, witty, and helpful. Always refer directly to movies in our directory if they match, but feel free to recommend real classic/new movies too!

    Our App's Current Catalog:
    ${movieCatalogContext}

    Guidelines:
    1. Respond concisely (under 250 words) with high scannability and structure.
    2. Suggest specific movies from the FastMovie catalog wherever relevant, and provide links / direct mentions so the user climbs into them.
    3. Be cinematic! Use phrases like "Grab your popcorn", "Cinematic gold", "Roll cameras!", etc.
    4. Respond in markdown with nice bulleting. All fonts / vibes should feel awesome.`;

    const contents = [];
    if (Array.isArray(chatHistory)) {
      for (const turn of chatHistory) {
        contents.push({ role: turn.role, parts: [{ text: turn.text }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.75,
      },
    });

    res.json({
      success: true,
      reply: response.text || "I was unable to formulate a response. Please try asking again!",
      isConfigured: true
    });
  } catch (err: any) {
    console.error("AI chat error:", err);
    res.status(500).json({
      success: false,
      message: "An internal error occurred while communicating with the Movie AI assistent.",
      reply: "Oops, my projector bulb just popped! Let me handle that and get right back to you. Make sure the API key is active!"
    });
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with dynamic Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with compiled asset serving...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FastMovie server is successfully operating on port ${PORT}`);
  });
}

startServer();
