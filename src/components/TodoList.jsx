import React, { useState, useEffect, useCallback } from "react";
import CreateToDo from "./CreateToDo";
import ToDoService from "../services/ToDoService";
import AssigneeService from "../services/AssigneeService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TodoList() {
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignee, setAssignee] = useState([]);
  const [filter, setFilter] = useState({
    search: "",
    status: "",
    priority: "",
    user_id: "",
    start_date: "",
    end_date: ""
  });
  const [editTodo, setEditTodo] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Fetch Assignee list on mount
  useEffect(() => {
    getAssignee();
  }, []);

  const getAssignee = async () => {
    try {
      const res = await AssigneeService.getAssignee();
      if (res?.data?.status === 200) {
        setAssignee(res.data.result ?? []);
      }
    } catch (err) {
      console.error("Error in getAssignee:", err);
    }
  };

  const getTodos = useCallback(async () => {
    try {
      const queryData = {
        ...filter,
        offset,
        limit
      };
      const params = new URLSearchParams();
      Object.entries(queryData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });
      const queryString = params.toString();

      const res = await ToDoService.getTodos(queryString);
      if (res?.data?.status === 200) {
        const todosWithRevokedFlag = res.data.result?.map((todo) => ({
          ...todo,
          revoked: false
        })) ?? [];
        setTodos(todosWithRevokedFlag);
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
    getTodos();
  }, [getTodos]);

  const handleRefresh = () => {
    getTodos(); // refetch latest list
  };

  const totalPages = Math.ceil(total / limit);

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      goToPage(nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      goToPage(prevPage);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    setOffset((page - 1) * limit);
  };

  const handleReset = () => {
    setFilter({
      search: "",
      status: "",
      priority: "",
      user_id: "",
      start_date: "",
      end_date: ""
    });
    setOffset(0);
    setCurrentPage(1);
  };

  // Revoke Function
  const handleRevoke = async (todoId, index) => {
    try {
      await ToDoService.revokeTodo(todoId);
      toast.success("Todo revoked successfully!");
      getTodos(); // refresh list after revoke
    } catch (err) {
      console.error("Failed to revoke todo:", err);
      toast.error("Failed to revoke todo");
    }
  };

  // Edit Function
  const handleEdit = (todo) => {
    setEditTodo(todo);
    setEditMode(true);
    setShowModal(true);
  };

  // Modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditTodo(null);
    setEditMode(false);
  };

  // Handle add or update
  const handleAddOrUpdate = (todo) => {
    // Refresh list after add/update
    getTodos();
    toast.success(`Todo ${editMode ? "updated" : "added"} successfully!`);
    handleCloseModal();
  };

  return (
    <div className="container mt-5">
      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Main Card */}
      <div className="card shadow-sm">
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center" style={{ backgroundColor: "#a7cef6", color: "rgba(0,0,0,1)" }}>
          <p className="mb-0 font-weight-bold" style={{ fontSize: "1rem" }}>To-Do Task List</p>
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
        </div>

                {/* Filters */}
        <div className="row g-3 p-3">
          {/* Search */}
          <div className="col-md-4">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              id="search"
              className="form-control"
              placeholder="Search..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          {/* Assignee */}
          <div className="col-md-4">
            <label htmlFor="assignee" className="form-label">Assignee</label>
            <select
              className="form-control"
              id="assignee"
              value={filter.user_id}
              onChange={(e) => setFilter({ ...filter, user_id: e.target.value })}
            >
              <option value="">--Select Assignee--</option>
              {assignee.map((a) => (
                <option key={a.id} value={a.id}>{a.username}</option>
              ))}
            </select>
          </div>
          {/* Status */}
          <div className="col-md-4">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              className="form-control"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">--Select--</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="hold">Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* Priority */}
          <div className="col-md-4">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              className="form-control"
              value={filter.priority}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            >
              <option value="">--Select--</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {/* Start Date */}
          <div className="col-md-4">
            <label htmlFor="start_date" className="form-label">Start Date</label>
            <input
              type="date"
              id="start_date"
              className="form-control"
              value={filter.start_date}
              onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
            />
          </div>
          {/* End Date */}
          <div className="col-md-4">
            <label htmlFor="end_date" className="form-label">End Date</label>
            <input
              type="date"
              id="end_date"
              className="form-control"
              value={filter.end_date}
              onChange={(e) => setFilter({ ...filter, end_date: e.target.value })}
            />
          </div>
          {/* Buttons */}
          <div className="col-md-4 d-flex align-items-end gap-2">
            <button className="btn btn-primary my-2 mr-2" onClick={() => getTodos()}>
              Apply
            </button>
            <button className="btn btn-secondary my-2" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0" style={{ fontSize: "0.85rem" }}>
              <thead className="thead-light">
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Scheduled Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
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
                        textDecoration: todo.revoked || todo.status === "revoked" ? "line-through" : "none",
                        opacity: todo.revoked || todo.status === "revoked" ? 0.5 : 1
                      }}
                    >
                      {/* data cells */}
                      <td>{offset + index + 1}</td>
                      <td>{todo.title}</td>
                      <td>{todo.user?.username ?? "N/A"}</td>
                      <td>{todo.scheduled_date}</td>
                      <td>{todo.priority}</td>
                      <td>{todo.status}</td>
                      <td>{todo.description}</td>
                      <td>
                        {/* Edit */}
                        <button className="btn btn-sm btn-primary mr-2" onClick={() => handleEdit(todo)} disabled={todo.revoked} title="Edit">✏️</button>
                        {/* Revoke */}
                        <button className="btn btn-sm btn-danger" onClick={() => handleRevoke(todo.id, index)} title="Revoke">❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="btn-group">
            <button className="btn btn-secondary btn-sm" onClick={handlePrevious} disabled={currentPage === 1}>
              Prev
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Modal for create/edit */}
      <CreateToDo
        show={showModal}
        onClose={handleCloseModal}
        onAdd={handleAddOrUpdate}
        onSuccess={handleRefresh} // <-- pass refresh callback
        initialData={editTodo}
        isEdit={editMode}
      />
    </div>
  );
}

export default TodoList;
