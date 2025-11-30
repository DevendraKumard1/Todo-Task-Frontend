import React, { useState, useEffect } from "react";
import ToDoService from "../services/ToDoService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TodoModal({ show, onClose, onSuccess, initialData, isEdit }) {
  const [assignee, setAssignee] = useState([]);
  const [isSubmit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    scheduled_date: "",
    priority: "",
    assignee: "",
    description: ""
  });

  useEffect(() => {
    const getAssignee = async () => {
      try {
        const res = await ToDoService.listAssignee();
        if (res?.data?.status === 200) {
          setAssignee(res.data.result ?? []);
        }
      } catch (err) {
        toast.error("Error in assignee List:", err)
      }
    };
    getAssignee();

    // Populate form data if editing, else reset for create
    if (initialData && isEdit) {
      setFormData({
        title: initialData.title ?? "",
        scheduled_date: initialData.scheduled_date ?? "",
        priority: initialData.priority ?? "",
        assignee: initialData.user_id ?? "",
        description: initialData.description ?? ""
      });
    } else {
      setFormData({
        title: "",
        scheduled_date: "",
        priority: "",
        assignee: "",
        description: ""
      });
    }
  }, [initialData, isEdit]);

  const saveOrUpdateTodo = async (e) => {
    e.preventDefault();
    setSubmit(true);
    const { title, scheduled_date, priority, assignee, description } = formData;

    if (!title || !scheduled_date || !priority || !assignee) {
      alert("Please fill all required fields.");
      setSubmit(false);
      return;
    }

    try {
      if (isEdit && initialData?.id) {
        console.log(initialData)
        const res = await ToDoService.updateTodo(initialData.id, {
          title,
          scheduled_date,
          priority,
          assignee: assignee,
          description
        });
        if (res?.status === 200) {
          toast.success("Todo updated successfully");
          onSuccess(); // refresh list
        } else {
          toast.error("Failed to update todo");
        }
      } else {
        const res = await ToDoService.createTodo({
          title,
          scheduled_date,
          priority,
          user_id: assignee,
          description
        });
        if (res?.status === 200) {
          toast.success("Todo created successfully");
          onSuccess(); // refresh list
        } else {
          toast.error("Failed to create todo");
        }
      }
      onClose();
    } catch (err) {
      console.error("Error saving todo:", err);
      toast.error("An error occurred");
    }
    setSubmit(false);
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className={`modal fade show d-block`} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Edit To Do" : "Create To Do"}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={saveOrUpdateTodo}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Title<span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Scheduled Date<span className="text-danger">*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.scheduled_date}
                      onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label>Priority<span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="">--Select--</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label>Assignee<span className="text-danger">*</span></label>
                    <select
                      className="form-control"
                      value={formData.assignee}
                      onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    >
                      <option value="">--Select Assignee--</option>
                      {assignee.map((a) => (
                        <option key={a.id} value={a.id}>{a.username}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="d-flex justify-content-end mt-3">
                  <button type="submit" className="btn btn-primary" disabled={isSubmit}>
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