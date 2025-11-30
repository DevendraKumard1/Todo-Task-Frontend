import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList";
import Login from "./components/Login";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/todo/list"
          element={<TodoList />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
