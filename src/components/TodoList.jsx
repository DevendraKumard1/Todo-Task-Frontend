import React, { useState, useEffect, useCallback } from "react";
import TodoModal from "./TodoModal";

import {
  getTodos,
  listAssignee,
  revokeTodo
} from "../services/ToDoService";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {dateFormat, statusBadge} from "./Utils";

function TodoList() {
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignee, setAssignee] = useState([]);

  const [filter, setFilter] = useState({
    titleFilter: "",
    statusFilter: "",
    priorityFilter: "",
    assigneeFilter: "",
    scheduledDateFilter: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch Assignee
  useEffect(() => {
    loadAssignee();
  }, []);

  const loadAssignee = async () => {
    try {
      const res = await listAssignee();
      if (res?.data?.status === 200) {
        setAssignee(res.data.result ?? []);
      }
    } catch (err) {
      console.error("Error in assignee list:", err);
    }
  };

  // Fetch Todos (renamed to avoid conflict)
  const fetchTodos = useCallback(async () => {
    try {
      const queryData = { ...filter, offset, limit };

      const params = new URLSearchParams();
      Object.entries(queryData).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) {
          params.append(k, v);
        }
      });

      const queryString = params.toString();

      const res = await getTodos(queryString);

      if (res?.data?.status === 200) {
        const mapped = res.data.result?.map((t) => ({
          ...t,
          revoked: false
        })) ?? [];

        setTodos(mapped);
        setTotal(res.data.total ?? 0);
      } else {
        setTodos([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error fetching todos:", err);
      setTodos([]);
      setTotal(0);
    }
  }, [offset, filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleRefresh = () => fetchTodos();

  const totalPages = Math.ceil(total / limit);

  const goToPage = (page) => {
    setCurrentPage(page);
    setOffset((page - 1) * limit);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Reset Filters
  const handleReset = () => {
    setFilter({
      titleFilter: "",
      statusFilter: "",
      priorityFilter: "",
      assigneeFilter: "",
      scheduledDateFilter: "",
    });
    setOffset(0);
    setCurrentPage(1);
  };

  // Revoke
  const handleRevoke = async (todoId) => {
    try {
      await revokeTodo(todoId);
      toast.success("Todo revoked successfully!");
      fetchTodos();
    } catch (err) {
      toast.error("Failed to revoke todo");
    }
  };

  // Edit
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setEditMode(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTodo(null);
    setEditMode(false);
  };

  const handleAddOrUpdate = () => {
    fetchTodos();
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="card shadow-sm">

        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#a7cef6", color: "rgba(0,0,0,1)" }}>
          <p className="mb-0 font-weight-bold">To-Do Task List</p>

          <div className="d-flex">
            <button
              className="btn btn-light btn-sm"
              onClick={() => {
                setEditMode(false);
                setEditTodo(null);
                setShowModal(true);
              }}
            >
              Add To-Do
            </button>

            <button className="btn btn-light btn-sm ml-2">
              Logout
            </button>
          </div>
        </div>
        <div className="p-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowFilters(prev => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {showFilters && (
          <div className="row g-3 p-3">
            <div className="col-md-4">
              <label>Title</label>
              <input
                type="text"
                className="form-control"
                value={filter.titleFilter}
                onChange={(e) =>
                  setFilter({ ...filter, titleFilter: e.target.value })
                }
              />
            </div>
            <div className="col-md-4">
              <label>Assignee</label>
              <select
                className="form-control"
                value={filter.assigneeFilter}
                onChange={(e) =>
                  setFilter({ ...filter, assigneeFilter: e.target.value })
                }
              >
                <option value="">--Select--</option>
                {assignee.map((a) => (
                  <option key={a.id} value={a.id}>{a.username}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label>Status</label>
              <select
                className="form-control"
                value={filter.statusFilter}
                onChange={(e) =>
                  setFilter({ ...filter, statusFilter: e.target.value })
                }
              >
                <option value="">--Select--</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="hold">Hold</option>
                <option value="completed">Completed</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Priority</label>
              <select
                className="form-control"
                value={filter.priorityFilter}
                onChange={(e) =>
                  setFilter({ ...filter, priorityFilter: e.target.value })
                }
              >
                <option value="">--Select--</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-md-4">
              <label>Scheduled Date</label>
              <input
                type="date"
                className="form-control"
                value={filter.scheduledDateFilter}
                onChange={(e) =>
                  setFilter({ ...filter, scheduledDateFilter: e.target.value })
                }
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-secondary w-100" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        )}
        {/* Table */}
        <div className="table-responsive p-3">
          <table className="table table-bordered table-hover">
            <thead className="thead-light">
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Assignee</th>
                <th>Scheduled Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No records found</td>
                </tr>
              ) : (
                todos.map((todo, index) => (
                  <tr
                    key={todo.id}
                    style={{
                      textDecoration:
                        todo.revoked || todo.status === "revoked"
                          ? "line-through"
                          : "none",
                      opacity:
                        todo.revoked || todo.status === "revoked"
                          ? 0.5
                          : 1
                    }}
                  >
                    <td>{offset + index + 1}</td>
                    <td>{todo.title}</td>
                    <td>{todo.user?.username ?? "N/A"}</td>
                    <td>{dateFormat(todo.scheduled_date)}</td>
                    <td>{statusBadge(todo.priority)}</td>
                    <td>{statusBadge(todo.status)}</td>
                    <td>{todo.description}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => handleEdit(todo)}
                        disabled={todo.revoked}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRevoke(todo.id)}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between">
          <span>Page {currentPage} of {totalPages || 1}</span>

          <div>
            <button
              className="btn btn-secondary btn-sm mr-2"
              disabled={currentPage === 1}
              onClick={handlePrevious}
            >
              Prev
            </button>

            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TodoModal
        show={showModal}
        onClose={handleCloseModal}
        onSuccess={handleAddOrUpdate}
        initialData={editTodo}
        isEdit={editMode}
      />
    </div>
  );
}

export default TodoList;
