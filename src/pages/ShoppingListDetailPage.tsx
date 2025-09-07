import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  totalItems: number;
  completedItems: number;
}

// Sample data for demo
const sampleLists: Record<string, ShoppingList> = {
  "1": {
    id: "1",
    name: "Weekly Groceries",
    date: "Sep 7, 2025",
    items: [
      {
        id: "1-1",
        name: "Apples",
        quantity: "6",
        category: "Produce",
        completed: false,
      },
      {
        id: "1-2",
        name: "Milk",
        quantity: "1 gallon",
        category: "Dairy",
        completed: true,
      },
      {
        id: "1-3",
        name: "Bread",
        quantity: "1 loaf",
        category: "Bakery",
        completed: false,
      },
      {
        id: "1-4",
        name: "Chicken breast",
        quantity: "2 lbs",
        category: "Meat",
        completed: false,
      },
      {
        id: "1-5",
        name: "Spinach",
        quantity: "1 bag",
        category: "Produce",
        completed: true,
      },
    ],
    totalItems: 5,
    completedItems: 2,
  },
  "2": {
    id: "2",
    name: "Dinner Party",
    date: "Sep 10, 2025",
    items: [
      {
        id: "2-1",
        name: "Steak",
        quantity: "4 lbs",
        category: "Meat",
        completed: false,
      },
      {
        id: "2-2",
        name: "Potatoes",
        quantity: "8",
        category: "Produce",
        completed: false,
      },
      {
        id: "2-3",
        name: "Wine",
        quantity: "2 bottles",
        category: "Beverages",
        completed: false,
      },
      {
        id: "2-4",
        name: "Salad mix",
        quantity: "1 box",
        category: "Produce",
        completed: false,
      },
    ],
    totalItems: 4,
    completedItems: 0,
  },
  "3": {
    id: "3",
    name: "Snacks for Movie Night",
    date: "Sep 12, 2025",
    items: [
      {
        id: "3-1",
        name: "Popcorn",
        quantity: "2 bags",
        category: "Snacks",
        completed: true,
      },
      {
        id: "3-2",
        name: "Soda",
        quantity: "6 pack",
        category: "Beverages",
        completed: true,
      },
      {
        id: "3-3",
        name: "Chocolate",
        quantity: "3 bars",
        category: "Snacks",
        completed: true,
      },
    ],
    totalItems: 3,
    completedItems: 3,
  },
};

const ShoppingListDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");

  useEffect(() => {
    // In a real app, this would call a service function to fetch the list
    setIsLoading(true);
    setTimeout(() => {
      if (id && sampleLists[id]) {
        setList(sampleLists[id]);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleToggleItem = (itemId: string) => {
    if (!list) return;

    setList({
      ...list,
      items: list.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
      completedItems: list.items.reduce(
        (count, item) =>
          count +
          (item.id === itemId
            ? item.completed
              ? 0
              : 1
            : item.completed
            ? 1
            : 0),
        0
      ),
    });
  };

  const handleAddItem = () => {
    if (!list || !newItemName.trim() || !newItemQuantity.trim()) return;

    const newItem: ShoppingItem = {
      id: `${list.id}-${list.items.length + 1}`,
      name: newItemName,
      quantity: newItemQuantity,
      category: newItemCategory || "Other",
      completed: false,
    };

    setList({
      ...list,
      items: [...list.items, newItem],
      totalItems: list.totalItems + 1,
    });

    // Reset form
    setNewItemName("");
    setNewItemQuantity("");
    setNewItemCategory("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Shopping list not found. The list may have been deleted or
                doesn't exist.
              </p>
            </div>
          </div>
        </div>
        <Link to="/shopping-lists">
          <Button variant="outline">Back to Shopping Lists</Button>
        </Link>
      </div>
    );
  }

  // Categories for grouping items
  const categories = Array.from(
    new Set(list.items.map((item) => item.category))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{list.name}</h1>
        <div className="text-neutral-500">{list.date}</div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="text-neutral-600">
            {list.completedItems} of {list.totalItems} items completed
          </div>
          <div
            className="text-sm font-medium px-2 py-1 rounded-full"
            style={{
              backgroundColor:
                list.completedItems === list.totalItems ? "#DEF7EC" : "#E1F0FF",
              color:
                list.completedItems === list.totalItems ? "#057A55" : "#1E429F",
            }}
          >
            {list.completedItems === list.totalItems
              ? "Completed"
              : "In Progress"}
          </div>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
          <div
            className="bg-primary-500 h-2 rounded-full"
            style={{
              width: `${(list.completedItems / list.totalItems) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Add new item */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Item Name
            </label>
            <Input
              id="itemName"
              type="text"
              placeholder="Enter item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="itemQuantity"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Quantity
            </label>
            <Input
              id="itemQuantity"
              type="text"
              placeholder="Enter quantity"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label
              htmlFor="itemCategory"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Category
            </label>
            <Input
              id="itemCategory"
              type="text"
              placeholder="Enter category"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleAddItem}
            disabled={!newItemName.trim() || !newItemQuantity.trim()}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Shopping list items */}
      <div className="bg-white shadow-sm rounded-lg divide-y divide-neutral-200 mb-6">
        {categories.map((category) => {
          const categoryItems = list.items.filter(
            (item) => item.category === category
          );
          return (
            <div key={category} className="p-4">
              <h3 className="font-medium text-neutral-800 mb-3">{category}</h3>
              <ul className="space-y-2">
                {categoryItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleItem(item.id)}
                        className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center border ${
                          item.completed
                            ? "bg-primary-500 border-primary-500 text-white"
                            : "border-neutral-300"
                        }`}
                      >
                        {item.completed && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                      <span
                        className={`${
                          item.completed
                            ? "line-through text-neutral-400"
                            : "text-neutral-800"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span className="text-neutral-500">{item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mb-8">
        <Link to="/shopping-lists">
          <Button variant="outline">Back to Shopping Lists</Button>
        </Link>

        <div className="space-x-2">
          <Button variant="ghost" className="text-red-600 hover:text-red-700">
            Delete List
          </Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListDetailPage;
