import "./styles.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";

const initialPosts = [
  {
    id: 1,
    text: "The reverse() method of StringBuilder is used to reverse the characters in the StringBuilder. The method helps to this character sequence to be replaced by the reverse of the sequence. Syntax: public java.lang.AbstractStringBuilder reverse()",
    source:
      "https://www.geeksforgeeks.org/stringbuilder-class-in-java-with-examples/",
    category: "java",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "The original name for Java was said to be Oak, named by the Java legend",
    source:
      "https://www.besanttechnologies.com/15-unbelievable-facts-java#:~:text=The%20original%20name%20for%20Java,company%20with%20registered%20name%20Oak.",
    category: "java",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Go is an open-source, statically-typed compiled, and explicit programming language",
    source:
      "https://www.geeksforgeeks.org/interesting-facts-about-golang/#:~:text=Go%20is%20an%20open%2Dsource,paradigm%20and%20object%2Doriented%20language.",
    category: "go",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getPosts() {
        let query = supabase.from("Posts").select("*");
        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }
        const { data: Posts, error } = await query
          .order("voteslike", { ascending: true })
          .limit(1000);

        if (!error) setPosts(Posts);
        else alert("There was a problem getting data");
      }
      getPosts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />

      {/* state variable */}
      {showForm ? (
        <NewPostForm setPosts={setPosts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        <PostList posts={posts} setPosts={setPosts} />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img
          src="letter-u-svgrepo-com.svg"
          alt="logo"
          width="68px"
          height="68px"
        />
        <h1>Query</h1>
        <p className="quote">"An Answer for 'U' and 'U'r Queries"</p>
      </div>
      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share Wisdom"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "java", color: "#ff6961" },
  { name: "python", color: "#ffb480" },
  { name: "javascript", color: "#f8f38d" },
  { name: "c++", color: "#42d6a4" },
  { name: "sql", color: "#08cad1" },
  { name: "c#", color: "#59adf6" },
  { name: "html/css", color: "#9d94ff" },
  { name: "go", color: "#c780e8" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
console.log("http://example.com: " + isValidHttpUrl("https://example.com"));
console.log("example.com: " + isValidHttpUrl("example.com"));

function NewPostForm({ setPosts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsuploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    //1. Stop reload
    e.preventDefault();
    console.log(text, source, category);
    //2.valid data? then create post
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      //ignore!
      //create fact obj
      // const newPost = {
      //   id: Math.round(Math.random() * 10000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //uploading to database and receive new
      setIsuploading(true);
      const { data: newPost, error } = await supabase
        .from("Posts")
        .insert([{ text, source, category }])
        .select();
      setIsuploading(false);

      //console.log(newPost);
      //add it to state
      if (!error) setPosts((posts) => [newPost[0], ...posts]);
      //finally set empty fields
      setText("");
      setSource("");
      setCategory("");
      //and close form
      setShowForm(false);
    }
  }
  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share your programming knowledge..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function PostList({ posts, setPosts }) {
  if (posts.length === 0)
    return (
      <p className="quick">
        No posts for this categroy yet! Create the first one. ✌️
      </p>
    );

  return (
    <section>
      <ul className="posts-list">
        {posts.map((post) => (
          <Post key={post.id} post={post} setPosts={setPosts} />
        ))}
      </ul>
      <p>There are {posts.length} posts in the homepage. Add your own!</p>
    </section>
  );
}

function Post({ post, setPosts }) {
  async function handleVote() {
    const { data: updatedPost, error } = await supabase
      .from("Posts")
      .update({ votesLike: post.votesInteresting + 1 })
      .eq("id", post.id);
    if (!error)
      setPosts((Posts) =>
        Posts.map((f) => (f.id === post.id ? updatedPost[0] : f))
      );
  }

  return (
    <li className="post-content">
      <p>
        {post.text}
        <a
          className="source"
          href={post.source}
          target="_blank"
          rel="noreferrer"
        >
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === post.category)
            ?.color,
        }}
      >
        {post.category}
      </span>
      <div className="post-buttons">
        <button onClick={handleVote}>👍 {post.votesInteresting}</button>
        <button>🤯 {post.votesMindblowing}</button>
        <button>⛔️ {post.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
