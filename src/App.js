import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={<TodoList />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
