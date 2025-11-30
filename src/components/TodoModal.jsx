import React, { useState, useEffect } from "react";
import {
  listAssignee,
  createTodo,
  updateTodo,
} from "../services/ToDoService";
import { toast } from "react-toastify";

function TodoModal({ show, onClose, onSuccess, initialData, isEdit }) {
  const [assignee, setAssignee] = useState([]);
  const [isSubmit, setSubmit] = useState(false);

  const defaultForm = {
    title: "",
    scheduled_date: "",
    priority: "",
    status: "",
    assignee: "",
    description: "",
  };

  const [formData, setFormData] = useState(defaultForm);

  // ----------------------------------------------------
  // Load dropdown + populate form when modal opens
  // ----------------------------------------------------
  useEffect(() => {
    if (show) {
      loadAssignees();

      if (initialData && isEdit) {
        setFormData({
          title: initialData.title ?? "",
          scheduled_date: initialData.scheduled_date ?? "",
          priority: initialData.priority ?? "",
          status: initialData.status ?? "",
          assignee: initialData.user_id ?? "",
          description: initialData.description ?? "",
        });
      } else {
        setFormData(defaultForm);
      }
    }
  }, [show, initialData, isEdit]);

  // ----------------------------------------------------
  // Load assignee dropdown
  // ----------------------------------------------------
  const loadAssignees = async () => {
    try {
      const res = await listAssignee();
      if (res?.data?.status === 200) {
        setAssignee(res.data.result);
      } else {
        toast.error("Failed to load assignees");
      }
    } catch (err) {
      toast.error("Failed to load assignees");
    }
  };

  // ----------------------------------------------------
  // Create or Update Todo
  // ----------------------------------------------------
  const saveOrUpdateTodo = async (e) => {
    e.preventDefault();
    setSubmit(true);

    const { title, scheduled_date, priority, status, assignee, description } =
      formData;

    // Validation
    if (!title || !scheduled_date || !priority || !status || !assignee) {
      toast.error("All required fields must be filled");
      setSubmit(false);
      return;
    }

    try {
      if (isEdit && initialData?.id) {
        // ----------------------------------------------------
        // UPDATE TODO
        // ----------------------------------------------------
        const res = await updateTodo(initialData.id, {
          title,
          scheduled_date,
          priority,
          status,
          user_id: assignee,
          description,
        });

        if (res?.status === 200) {
          toast.success("Todo updated successfully");
          setFormData(defaultForm);
          onSuccess();
          onClose();
        } else {
          toast.error(res?.message || "Update failed");
        }
      } else {
        // ----------------------------------------------------
        // CREATE TODO
        // ----------------------------------------------------
        const res = await createTodo({
          title,
          scheduled_date,
          priority,
          status,
          user_id: assignee,
          description,
        });

        if (res?.status === 200) {
          toast.success("Todo created successfully");
          setFormData(defaultForm);
          onSuccess();
          onClose();
        } else {
          toast.error(res?.message || "Create failed");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setSubmit(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">
                {isEdit ? "Edit To Do" : "Create To Do"}
              </h5>
              <button
                className="close"
                onClick={() => {
                  setFormData(defaultForm);
                  onClose();
                }}
              >
                <span>&times;</span>
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              <form onSubmit={saveOrUpdateTodo}>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Title<span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label>Scheduled Date<span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.scheduled_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          scheduled_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Priority<span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="">--Select--</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  {initialData && isEdit && (
                    <div className="form-group col-md-6">
                      <label>Status<span className="text-danger">*</span></label>
                      <select
                        className="form-control"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
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
                  )}

                  <div className="form-group col-md-6">
                    <label>Assignee<span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.assignee}
                      onChange={(e) =>
                        setFormData({ ...formData, assignee: e.target.value })
                      }
                    >
                      <option value="">--Select Assignee--</option>
                      {assignee.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-12">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* FOOTER */}
                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmit}
                  >
                    {isSubmit ? "Saving..." : isEdit ? "Update" : "Save"}
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default TodoModal;
