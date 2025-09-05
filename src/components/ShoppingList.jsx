import React, { useState, useEffect, useRef } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import styles from "./ShoppingList.module.css";
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const SECTIONS = [
  "Bread",
  "Dairy",
  "Fresh Meat",
  "Fresh Vegetables",
  "Canned Foods",
  "Boxed Goods",
  "Frozen Food",
  "Snacks",
  "Beverages",
  "Household",
  "Personal Care",
  "Other",
];

const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const COMMON_ITEMS = [
  "Eggs",
  "Milk",
  "Bread",
  "Butter",
  "Cheese",
  "Chicken",
  "Beef",
  "Pork",
  "Rice",
  "Pasta",
  "Cereal",
  "Yogurt",
  "Apples",
  "Bananas",
  "Oranges",
  "Carrots",
  "Potatoes",
  "Tomatoes",
  "Lettuce",
  "Spinach",
  "Beans",
  "Corn",
  "Soup",
  "Ice Cream",
  "Crackers",
];

function getSectionForIngredient(name) {
  const lower = name.toLowerCase();
  if (
    lower.includes("egg") ||
    lower.includes("milk") ||
    lower.includes("cheese") ||
    lower.includes("yogurt") ||
    lower.includes("butter")
  )
    return "Dairy";
  if (
    lower.includes("bread") ||
    lower.includes("bun") ||
    lower.includes("roll")
  )
    return "Bread";
  if (
    lower.includes("chicken") ||
    lower.includes("beef") ||
    lower.includes("pork") ||
    lower.includes("meat") ||
    lower.includes("turkey")
  )
    return "Fresh Meat";
  if (
    lower.includes("lettuce") ||
    lower.includes("spinach") ||
    lower.includes("carrot") ||
    lower.includes("potato") ||
    lower.includes("tomato") ||
    lower.includes("onion") ||
    lower.includes("pepper") ||
    lower.includes("cucumber") ||
    lower.includes("broccoli") ||
    lower.includes("vegetable")
  )
    return "Fresh Vegetables";
  if (
    lower.includes("beans") ||
    lower.includes("corn") ||
    lower.includes("peas") ||
    lower.includes("soup")
  )
    return "Canned Foods";
  if (
    lower.includes("cereal") ||
    lower.includes("pasta") ||
    lower.includes("rice") ||
    lower.includes("crackers")
  )
    return "Boxed Goods";
  if (lower.includes("ice cream") || lower.includes("frozen"))
    return "Frozen Food";
  if (
    lower.includes("chips") ||
    lower.includes("cookie") ||
    lower.includes("snack") ||
    lower.includes("candy")
  )
    return "Snacks";
  if (
    lower.includes("juice") ||
    lower.includes("soda") ||
    lower.includes("water") ||
    lower.includes("coffee") ||
    lower.includes("tea") ||
    lower.includes("beverage")
  )
    return "Beverages";
  if (
    lower.includes("detergent") ||
    lower.includes("cleaner") ||
    lower.includes("paper towel") ||
    lower.includes("toilet paper") ||
    lower.includes("household")
  )
    return "Household";
  if (
    lower.includes("shampoo") ||
    lower.includes("soap") ||
    lower.includes("toothpaste") ||
    lower.includes("personal care")
  )
    return "Personal Care";
  return "Other";
}

function parseIngredient(ingredientStr) {
  const regex = /^([\d\/\.\s]+)?\s*([a-zA-Z]+)?\s*(.+)$/;
  const match = ingredientStr.match(regex);
  if (!match) return { name: ingredientStr.trim(), quantity: "", unit: "" };
  let [, quantity, unit, name] = match;
  return {
    name: name ? name.trim() : "",
    quantity: quantity ? quantity.trim() : "",
    unit: unit ? unit.trim() : "",
  };
}

function ShoppingList() {
  // Shopping list state
  const [items, setItems] = useState([]);
  // Form state
  const [input, setInput] = useState("");
  const [section, setSection] = useState(SECTIONS[0]);
  const [priority, setPriority] = useState("medium");
  // Recipe state
  const [recipes, setRecipes] = useState([]);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  // Barcode scanner state
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef();
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  // List name state
  const [listName, setListName] = useState("Default");
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  // Recipe import state
  const [importText, setImportText] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "lists", listName), (snapshot) => {
      if (snapshot.exists()) {
        setItems(snapshot.data().items || []);
      } else {
        setItems([]);
      }
    });
    return () => unsub();
  }, [listName]);

  useEffect(() => {
    setDoc(doc(db, "lists", listName), { items });
  }, [items, listName]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  // Update suggestions as user types
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    const allItems = Array.from(
      new Set([...COMMON_ITEMS, ...items.map((i) => i.name)])
    );
    const filtered = allItems.filter(
      (item) =>
        item.toLowerCase().includes(input.toLowerCase()) &&
        item.toLowerCase() !== input.toLowerCase()
    );
    setSuggestions(filtered.slice(0, 6));
  }, [input, items]);

  // Add new list
  const addNewList = () => {
    const newName = prompt("Enter new list name:");
    if (newName) setListName(newName);
  };

  // Delete current list
  const deleteCurrentList = async () => {
    setItems([]);
    await setDoc(doc(db, "lists", listName), { items: [] });
    setListName("Default");
  };

  // Clear all items and remove from localStorage
  const clearAllItems = () => {
    setItems([]);
    localStorage.removeItem("shopping-list");
  };

  // Add item(s)
  const addItem = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const names = input
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    const newItems = names.map((name) => ({
      id: Date.now() + Math.random(),
      name,
      section: getSectionForIngredient(name), // auto-assign section
      priority,
      bought: false,
    }));
    setItems((prev) => [...prev, ...newItems]);
    setInput("");
  };

  // Toggle bought
  const toggleBought = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  // Remove item
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add recipe
  const addRecipe = (e) => {
    e.preventDefault();
    if (!recipeName.trim() || !recipeIngredients.trim()) return;
    const parsedIngredients = recipeIngredients
      .split(",")
      .map((i) => parseIngredient(i.trim()))
      .filter((i) => i.name);
    setRecipes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: recipeName.trim(),
        ingredients: parsedIngredients,
      },
    ]);
    setRecipeName("");
    setRecipeIngredients("");
    setShowRecipeModal(false);
  };

  // Add recipe ingredients to list
  const addRecipeToList = (recipe) => {
    const newItems = recipe.ingredients.map((ing) => ({
      id: Date.now() + Math.random(),
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      section: getSectionForIngredient(ing.name),
      priority: "medium",
      bought: false,
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  // Barcode scan handler
  const handleBarcode = (err, result) => {
    if (result) {
      setInput(result.text);
      setShowScanner(false);
    }
  };

  // Simple parser: extract lines with numbers (quantities)
  function parseRecipeText(text) {
    return text
      .split(/\n|,/)
      .map((line) => line.trim())
      .filter((line) => line && /\d/.test(line))
      .map(parseIngredient)
      .filter((i) => i.name);
  }

  const importRecipe = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;
    const parsedIngredients = parseRecipeText(importText);
    if (parsedIngredients.length) {
      const newItems = parsedIngredients.map((ing) => ({
        id: Date.now() + Math.random(),
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
        section: getSectionForIngredient(ing.name),
        priority: "medium",
        bought: false,
      }));
      setItems((prev) => [...prev, ...newItems]);
    }
    setImportText("");
    setShowImportModal(false);
  };

  // Group items by section
  const grouped = SECTIONS.map((sec) => ({
    section: sec,
    items: items
      .filter((item) => item.section === sec)
      .sort((a, b) => {
        const pOrder = { high: 0, medium: 1, low: 2 };
        return pOrder[a.priority] - pOrder[b.priority];
      }),
  }));

  return (
    <div className={styles.container + (darkMode ? " " + styles.dark : "")}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2>Shopping List</h2>
        <div>
          <button
            className={styles.addBtn}
            style={{ marginRight: 8 }}
            onClick={() => setDarkMode((d) => !d)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <input
            className={styles.input}
            style={{ marginRight: 8, minWidth: 120 }}
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="List name (share to collaborate)"
          />
          <button
            className={styles.addBtn}
            onClick={addNewList}
            style={{ marginRight: 8 }}
          >
            New List
          </button>
          <button
            className={styles.removeBtn}
            onClick={deleteCurrentList}
            style={{ marginRight: 8 }}
          >
            Delete List
          </button>
          <button className={styles.removeBtn} onClick={clearAllItems}>
            Clear All
          </button>
        </div>
      </div>

      {/* Recipe Integration */}
      <div style={{ marginBottom: "1.5rem" }}>
        <button
          className={styles.addBtn}
          style={{ marginRight: "1rem" }}
          onClick={() => setShowRecipeModal(true)}
        >
          + Add Recipe
        </button>
        <button
          className={styles.addBtn}
          style={{ marginRight: "1rem" }}
          onClick={() => setShowImportModal(true)}
        >
          Import Recipe
        </button>
        {recipes.length > 0 && (
          <select
            className={styles.input}
            style={{ width: "auto", minWidth: 180, marginRight: 8 }}
            onChange={(e) => {
              const recipe = recipes.find(
                (r) => r.id === Number(e.target.value)
              );
              if (recipe) addRecipeToList(recipe);
              e.target.value = "";
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Add Recipe to List...
            </option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowRecipeModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={addRecipe}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              minWidth: 320,
              boxShadow: "0 8px 32px rgba(60,72,100,0.13)",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Add Recipe</h3>
            <input
              className={styles.input}
              placeholder="Recipe Name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              required
            />
            <textarea
              className={styles.input}
              placeholder="Ingredients (e.g. '2 cups flour, 1/2 tsp salt, 3 eggs')"
              value={recipeIngredients}
              onChange={(e) => setRecipeIngredients(e.target.value)}
              required
              rows={3}
              style={{ resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button className={styles.addBtn} type="submit">
                Save Recipe
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => setShowRecipeModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipe Import Modal */}
      {showImportModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowImportModal(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={importRecipe}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "2rem",
              minWidth: 320,
              boxShadow: "0 8px 32px rgba(60,72,100,0.13)",
              display: "flex",
              flexDirection: "column",
              gap: "1.2rem",
            }}
          >
            <h3 style={{ margin: 0 }}>Import Recipe</h3>
            <textarea
              className={styles.input}
              placeholder="Paste recipe text here (e.g. '2 cups flour, 1/2 tsp salt, 3 eggs')"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              required
              rows={5}
              style={{ resize: "vertical" }}
            />
            <div style={{ display: "flex", gap: 12 }}>
              <button className={styles.addBtn} type="submit">
                Import
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Barcode Scanner */}
      <form
        onSubmit={addItem}
        className={styles.form}
        style={{ position: "relative" }}
      >
        <input
          className={`${styles.input} ${styles.inputAlwaysWhite}`}
          placeholder="Add item(s)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          autoComplete="off"
        />
        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 10,
              background: darkMode ? "#23252b" : "#fff",
              color: darkMode ? "#f3f3f3" : "#222",
              border: "1px solid #ccc",
              borderRadius: 8,
              margin: 0,
              padding: "4px 0",
              width: "100%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {suggestions.map((s) => (
              <li
                key={s}
                style={{
                  padding: "6px 16px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  background: darkMode ? "#23252b" : "#fff",
                }}
                onMouseDown={() => setInput(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
        <select
          className={styles.input}
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          {SECTIONS.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>
          (Auto-section based on item name, but you can override)
        </span>
        <select
          className={styles.input}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <button className={styles.addBtn} type="submit">
          Add
        </button>
        <button
          type="button"
          className={styles.addBtn}
          style={{ background: "#b2f7ef", color: "#009688" }}
          onClick={() => setShowScanner((s) => !s)}
        >
          {showScanner ? "Close Scanner" : "Scan Barcode"}
        </button>
      </form>

      {showScanner && (
        <div style={{ margin: "1rem 0", borderRadius: 12, overflow: "hidden" }}>
          <BarcodeScannerComponent
            width={350}
            height={250}
            onUpdate={handleBarcode}
            ref={scannerRef}
          />
          <div style={{ textAlign: "center", marginTop: 8, color: "#888" }}>
            Point camera at a barcode to add item
          </div>
        </div>
      )}

      {/* Shopping List */}
      {grouped.map(
        (group) =>
          group.items.length > 0 && (
            <div key={group.section}>
              <div className={styles.sectionHeader}>{group.section}</div>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className={item.bought ? styles.bought : ""}
                    onClick={() => toggleBought(item.id)}
                  >
                    <span>
                      {item.quantity && <strong>{item.quantity}</strong>}{" "}
                      {item.unit && <em>{item.unit}</em>} {item.name}
                      <span
                        className={`${styles.priority} ${
                          styles["priority-" + item.priority]
                        }`}
                      >
                        {item.priority.charAt(0).toUpperCase() +
                          item.priority.slice(1)}
                      </span>
                    </span>
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      aria-label="Remove"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  );
}

export default ShoppingList;
