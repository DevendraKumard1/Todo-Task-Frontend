import "../assets/app.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userLogin } from "../services/UserService";

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    try {
      const { email, password } = formData;
      const response = await userLogin({ username: email, password });

      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.result));

        navigate('/todo/list');
      } else {
        if (response.data && response.data.detail) {
          const newErrors = {};
          response.data.detail.forEach((item) => {
            const field = item.loc[1];
            const msg   = item.msg;
            if (field === "username") {
              newErrors.email = msg;
            } else if (field === "password") {
              newErrors.password = msg;
            }
          });
          setErrors(prev => ({ ...prev, ...newErrors }));
        } else {
          setErrors(prev => ({ ...prev, general: response.data.message || "Login failed" }));
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrors('Login failed. Please check credentials.');
    }
  };

  return (
    <section
      className="h-100 gradient-form"
      style={{ backgroundColor: "#eee" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <span><i className="bi bi-check2-square icon-xxl"></i></span>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <p>Please login to your account</p>
                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="form-control"
                          placeholder="Email address"
                        />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          className="form-control"
                          placeholder="Password"
                        />
                        {errors.password && <p className="text-danger">{errors.password}</p>}
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="submit"
                        >
                          Log in
                        </button>
                        <a className="text-muted" href="#!">
                          Forgot password?
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <h4 className="mb-4">Your tasks. Your day. Let’s get started.</h4>
                    <p className="small mb-0">
                      Welcome back! Log in and take charge of your day. 
                      Your tasks are waiting — let’s organize, prioritize and conquer them together. 
                      Ready when you are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
