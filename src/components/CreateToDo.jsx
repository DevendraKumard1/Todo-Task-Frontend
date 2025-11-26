import { useState, useEffect } from "react";
import React from "react";
import AssigneeService from "../services/AssigneeService";
import ToDoService from "../services/ToDoService";

function CreateToDo({ show, onClose, onAdd }) {
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
        getAssignee();
    }, []);

    const getAssignee = async () => {
        let res = await AssigneeService.getAssignee();

        if (res.data.status === 200) {
            let assigneeList = res.data?.result ?? [];
            setAssignee(assigneeList);
        }
    };

    const saveOrUpdateTodo = async (e) => {
        e.preventDefault();
        setSubmit(true);

        const { title, scheduled_date, priority, assignee, description } = formData;

        // Validation
        if (!title || !scheduled_date || !priority || !assignee) {
            alert("Please fill all required fields.");
            setSubmit(false);
            return;
        }

        const inputData = {
            title,
            scheduled_date,
            priority,
            user_id: assignee,
            description
        };
        try {
            let res = await ToDoService.createTodo(inputData);

            if(res.data.status === 200) {
                const newTodo = res.data;
                if (onAdd) onAdd(newTodo);
                onClose();
            }
        } catch (error) {
            console.error("Error creating todo:", error);
        }
            // Reset form
            setFormData({
                title: "",
                scheduled_date: "",
                priority: "",
                assignee: "",
                description: ""
            });

        setSubmit(false);
    };

    return (
        <>
        {show && <div className="modal-backdrop fade show"></div>}
        <div className={`modal fade ${show ? "show d-block" : ""}`} id="staticBackdrop">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create To Do Task</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <label>Title<span className="text-danger">*</span></label>
                                <input type="text" 
                                    className="form-control" 
                                    placeholder="Title" 
                                    name="title" 
                                    id="title" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <label>Scheduled Date<span className="text-danger">*</span></label>
                                <input type="date" 
                                    className="form-control"
                                    name="scheduled_date" 
                                    id="scheduled_date" 
                                    value={formData.scheduled_date}
                                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <label>Priority<span className="text-danger">*</span></label>
                                <select className="form-control" 
                                    name="priority" 
                                    id="priority"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="">--Select--</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label>Assignee<span className="text-danger">*</span></label>
                                <select className="form-control"
                                    name="assignee" 
                                    id="assignee"
                                    value={formData.assignee}
                                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                                >
                                    <option value="">--Select Assignee--</option>

                                    {assignee.map((assignee, index) => (
                                    <option key={index} value={assignee.id}>
                                        {assignee.username}
                                    </option>
                                    ))}

                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="description">Description</label>
                                <textarea 
                                    name="description" 
                                    id="description"
                                    className="form-control"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                            </div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-end bothBtn swiperBtns mt-2">
                            <button className="btn btn-primary" type="button"
                                disabled={isSubmit ? true : false}
                                onClick={saveOrUpdateTodo}
                            >
                                {isSubmit ? global.loader : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default CreateToDo;
