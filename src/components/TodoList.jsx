import React, { useState, useEffect } from "react";
import CreateToDo from "./CreateToDo";
import ToDoService from "../services/ToDoService";
import AssigneeService from "../services/AssigneeService";

function TodoList() {
  const [showModal, setShowModal] = useState(false);
  const [todos, setTodos] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [assignee, setAssignee] = useState([]);
  const [formData, setFormData] = useState({ assignee: "" });
  const [filter, setFilter] = useState({ 
    titleFilter: "",
    assigneeFilter: "",
    statusFilter: "",
    priorityFilter: "",
    scheduledDateFilter: "",
  });

  // Fetch todos whenever offset or limit changes
  useEffect(() => {
    getTodos(offset, limit);
    getAssignee()
  }, [offset, limit]);

  const getAssignee = async () => {
      let res = await AssigneeService.getAssignee();

      if (res.data.status === 200) {
          let assigneeList = res.data?.result ?? [];
          setAssignee(assigneeList);
      }
  };

  const getTodos = async (currentOffset = offset, currentLimit = limit) => {
    try {
      const queryData = {
        ...filter,
        offset: currentOffset,
        limit: currentLimit
      };
      const params = new URLSearchParams(queryData); 

      const queryString = params.toString();
      const res = await ToDoService.getTodos(queryString);

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
      titleFilter: "",
      assigneeFilter: "",
      statusFilter: "",
      priorityFilter: "",
      scheduledDateFilter: "",
    });

    setOffset(0);
    setCurrentPage(1);

    getTodos(0, limit);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#a7cef6", color: "rgba(0,0,0,1)" }}
        >
          <p className="mb-0 font-weight-bold" style={{ fontSize: "1rem" }}>
            To-Do Task List
          </p>
          <button className="btn btn-light btn-sm" onClick={() => setShowModal(true)}>
            Add To-Do
          </button>
          <CreateToDo
            show={showModal}
            onClose={() => setShowModal(false)}
            onAdd={(newTodo) => setTodos([newTodo, ...todos])}
          />
        </div>
        <div className="row g-3 p-3">
          <div className="col-md-4">
            <label htmlFor="titleFilter" className="form-label">Title</label>
            <input 
                type="text" 
                name="titleFilter" 
                id="titleFilter" 
                className="form-control" 
                value={filter.titleFilter}
                onChange={(e) => setFilter({ ...filter, titleFilter: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="assigneeFilter" className="form-label">Assignee</label>
            <select className="form-control"
                name="assigneeFilter" 
                id="assigneeFilter"
                value={filter.assigneeFilter}
                onChange={(e) => setFilter({ ...filter, assigneeFilter: e.target.value })}
            >
                <option value="">--Select Assignee--</option>

                {assignee.map((assignee, index) => (
                <option key={index} value={assignee.id}>
                    {assignee.username}
                </option>
                ))}

            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="statusFilter" className="form-label">Status</label>
            <select 
              name="statusFilter" 
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

          <div className="col-md-4">
            <label htmlFor="priorityFilter" className="form-label">Priority</label>
            <select 
              name="priorityFilter" 
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

          <div className="col-md-4">
            <label htmlFor="scheduledDateFilter" className="form-label">Scheduled Date</label>
            <input 
              type="date" 
              name="scheduledDateFilter" 
              id="scheduledDateFilter" 
              className="form-control" 
              value={formData.scheduled_date}
              onChange={(e) => setFilter({ ...filter, scheduledDateFilter: e.target.value })}
            />
          </div>
          <div className="col-md-4 d-flex flex-row align-items-end gap-3">
            <button type="button" className="btn btn-primary" onClick={getTodos}>
              Apply
            </button>
            <button type="button" className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>
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
                    <td colSpan="8" className="text-center">
                      No records found
                    </td>
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
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="ml-3">
            Page {currentPage} of {totalPages || 1}
          </span>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </button>
              </li>

              {Array.from({ length: totalPages || 1 }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => goToPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
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
