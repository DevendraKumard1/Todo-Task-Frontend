import React, { useState, useEffect, useCallback } from "react";
import CreateToDo from "./CreateToDo";
import ToDoService from "../services/ToDoService";
import AssigneeService from "../services/AssigneeService";

function TodoList() {
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10); // Keep limit as constant if no need to change
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignee, setAssignee] = useState([]);

  const [filter, setFilter] = useState({
    titleFilter: "",
    assigneeFilter: "",
    statusFilter: "",
    priorityFilter: "",
    startDateFilter: "",
    endDateFilter: ""
  });

  // Fetch assignee list once on mount
  useEffect(() => {
    // eslint-disable-next-line
    getAssignee();
  }, []);

  // Fetch todos whenever offset, limit, or filter change
  const getTodos = useCallback(async () => {
    try {
      // Prepare query data with correct date format
      const queryData = {
        ...filter,
        offset: offset,
        limit: limit,
        start_date: filter.startDateFilter,
        end_date: filter.endDateFilter
      };
      // Remove empty filters (optional, for cleaner request)
      Object.keys(queryData).forEach(
        key => queryData[key] === "" && delete queryData[key]
      );

      const params = new URLSearchParams(queryData);
      const queryString = params.toString();

      const res = await ToDoService.getTodos(queryString);
      console.log(res);
      if (res.data.status === 200) {
        setTodos(res.data.result ?? []);
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
  }, [offset, limit, filter]);

  const getAssignee = async () => {
    let res = await AssigneeService.getAssignee();
    if (res.data.status === 200) {
      setAssignee(res.data?.result ?? []);
    }
  };

  // Fetch todos on initial load and when dependencies change
  useEffect(() => {
    // eslint-disable-next-line
    getTodos();
  }, [getTodos]);

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
      titleFilter: "",
      assigneeFilter: "",
      statusFilter: "",
      priorityFilter: "",
      startDateFilter: "",
      endDateFilter: ""
    });
    setOffset(0);
    setCurrentPage(1);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        {/* Header */}
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#a7cef6", color: "rgba(0,0,0,1)" }}
        >
          <p className="mb-0 font-weight-bold" style={{ fontSize: "1rem" }}>To-Do Task List</p>
          <button className="btn btn-light btn-sm" onClick={() => setShowModal(true)}>
            Add To-Do
          </button>
          <CreateToDo
            show={showModal}
            onClose={() => setShowModal(false)}
            onAdd={(newTodo) => setTodos([newTodo, ...todos])}
          />
        </div>

        {/* Filters */}
        <div className="row g-3 p-3">
          {/* Title Filter */}
          <div className="col-md-4">
            <label htmlFor="titleFilter" className="form-label">Title</label>
            <input
              type="text"
              id="titleFilter"
              className="form-control"
              value={filter.titleFilter}
              onChange={(e) => setFilter({ ...filter, titleFilter: e.target.value })}
            />
          </div>
          {/* Assignee Filter */}
          <div className="col-md-4">
            <label htmlFor="assigneeFilter" className="form-label">Assignee</label>
            <select
              className="form-control"
              id="assigneeFilter"
              value={filter.assigneeFilter}
              onChange={(e) => setFilter({ ...filter, assigneeFilter: e.target.value })}
            >
              <option value="">--Select Assignee--</option>
              {assignee.map((a, index) => (
                <option key={index} value={a.id}>{a.username}</option>
              ))}
            </select>
          </div>
          {/* Status Filter */}
          <div className="col-md-4">
            <label htmlFor="statusFilter" className="form-label">Status</label>
            <select
              id="statusFilter"
              className="form-control"
              value={filter.statusFilter}
              onChange={(e) => setFilter({ ...filter, statusFilter: e.target.value })}
            >
              <option value="">--Select--</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="hold">Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          {/* Priority Filter */}
          <div className="col-md-4">
            <label htmlFor="priorityFilter" className="form-label">Priority</label>
            <select
              id="priorityFilter"
              className="form-control"
              value={filter.priorityFilter}
              onChange={(e) => setFilter({ ...filter, priorityFilter: e.target.value })}
            >
              <option value="">--Select--</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          {/* Start Date */}
          <div className="col-md-4">
            <label htmlFor="startDateFilter" className="form-label">Start Date</label>
            <input
              type="date"
              id="startDateFilter"
              className="form-control"
              value={filter.startDateFilter}
              onChange={(e) => setFilter({ ...filter, startDateFilter: e.target.value })}
            />
          </div>
          {/* End Date */}
          <div className="col-md-4">
            <label htmlFor="endDateFilter" className="form-label">End Date</label>
            <input
              type="date"
              id="endDateFilter"
              className="form-control"
              value={filter.endDateFilter}
              onChange={(e) => setFilter({ ...filter, endDateFilter: e.target.value })}
            />
          </div>
          {/* Buttons */}
          <div className="col-md-4 d-flex flex-row align-items-end gap-3">
            <button
              className="btn btn-primary"
              onClick={() => getTodos()}
            >
              Apply
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0" style={{ fontSize: "0.85rem" }}>
              <thead className="thead-light">
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Scheduled Date</th>
                  <th>Priority</th>
                  <th>Completed?</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {todos.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No records found</td>
                  </tr>
                ) : (
                  todos.map((todo, index) => (
                    <tr key={todo.uuid || index}>
                      <th scope="row">{offset + index + 1}</th>
                      <td>{todo.title}</td>
                      <td>{todo.user.username}</td>
                      <td>{todo.formatted_date}</td>
                      <td>{todo.formatted_priority}</td>
                      <td>{todo.formatted_status}</td>
                      <td>{todo.description}</td>
                      <td>
                        <button className="btn btn-sm btn-primary mr-2" title="Edit">
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" title="Revoke">
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
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
          <span className="ml-3">
            Page {currentPage} of {totalPages || 1}
          </span>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={handlePrevious} disabled={currentPage === 1}>
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              {Array.from({ length: totalPages || 1 }, (_, i) => (
                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={handleNext} disabled={currentPage === totalPages}>
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
