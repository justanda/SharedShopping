import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
} from "../components/common/Card";
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

const sampleLists: ShoppingList[] = [
  {
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
  {
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
  {
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
];

const ShoppingListsPage = () => {
  const [lists] = useState<ShoppingList[]>(sampleLists);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const navigate = useNavigate();

  // New list creation state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleCreateList = () => {
    if (newListName.trim()) {
      // In a real app, this would call a service function to create the list
      const newId = (lists.length + 1).toString();
      const now = new Date();
      const newList: ShoppingList = {
        id: newId,
        name: newListName,
        date: now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        items: [],
        totalItems: 0,
        completedItems: 0,
      };

      // Log the new list (in a real app, we would save it to state or API)
      console.log('Created new shopping list:', newList);

      // For demo purposes, we're just navigating to the detail page
      // In a real app, you would add the list to state first
      navigate(`/shopping-lists/${newId}`);

      // Reset the form
      setNewListName("");
      setIsCreateModalOpen(false);
    }
  };

  const filteredLists = (() => {
    switch (activeFilter) {
      case "active":
        return lists.filter((list) => list.completedItems < list.totalItems);
      case "completed":
        return lists.filter((list) => list.completedItems === list.totalItems);
      default:
        return lists;
    }
  })();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Shopping Lists</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Create New List
        </Button>
      </div>

      <div className="mb-6 flex border-b border-neutral-200">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeFilter === "all"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-600"
          }`}
          onClick={() => setActiveFilter("all")}
        >
          All Lists
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeFilter === "active"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-600"
          }`}
          onClick={() => setActiveFilter("active")}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeFilter === "completed"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-neutral-600"
          }`}
          onClick={() => setActiveFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="space-y-4">
        {filteredLists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-neutral-500">No shopping lists found.</p>
          </div>
        ) : (
          filteredLists.map((list) => (
            <Card key={list.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>{list.name}</CardTitle>
                  <span className="text-sm text-neutral-500">{list.date}</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-neutral-600">
                      {list.completedItems} of {list.totalItems} items completed
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color:
                          list.completedItems === list.totalItems
                            ? "#10B981"
                            : "#0EA5E9",
                      }}
                    >
                      {list.completedItems === list.totalItems
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (list.completedItems / list.totalItems) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-neutral-600">
                  {list.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          item.completed ? "bg-green-500" : "bg-neutral-300"
                        }`}
                      ></div>
                      <span
                        className={
                          item.completed ? "line-through text-neutral-400" : ""
                        }
                      >
                        {item.name} ({item.quantity})
                      </span>
                    </div>
                  ))}
                  {list.items.length > 3 && (
                    <div className="text-primary-600 font-medium mt-1">
                      +{list.items.length - 3} more items
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 p-3">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm">
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/shopping-lists/${list.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Create List Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Shopping List</h2>
            <div className="mb-4">
              <label
                htmlFor="listName"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                List Name
              </label>
              <Input
                id="listName"
                type="text"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateList} disabled={!newListName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsPage;
