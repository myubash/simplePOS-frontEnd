import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import url from "../support/url";
import dummy from "../assets/dummy.png";
import { changeUserAvatar } from "../actions/index";

export class UpdateProfile extends Component {
  state = {
    name: "",
    email: "",
    birthPlace: "",
    birthDate: "",
    address: "",
    password: "",
    avatar: "",
    employeeId: 0,
    userId: 0,
    toggleAvatar: false,
    photoName: "",
    file: null,
    old: false,
    new: false,
    confirm: false
  };

  async componentDidMount() {
    try {
      let user = await axios.get(url + "/users/" + this.props.userName);
      // console.log(user.data.userDetail);
      if(user.data.error) return alert(user.data.error)
      let userData = user.data.userDetail;

      this.setState({
        name: userData.name,
        email: userData.email,
        birthPlace: userData.birthPlace,
        birthDate: userData.birthDate,
        address: userData.address,
        password: userData.password
      });
    } catch (error) {
      console.log(error);
    }
  }

  onSubmit = async e => {
    e.persist();

    let formData = new FormData();

    let _name = this.name.value;
    let _email = this.email.value;
    let _address = this.address.value;
    let _birthDate = this.birthDate.value;
    let _birthPlace = this.birthPlace.value;
    let _passwordOld = this.passwordOld.value;
    let _passwordNew = this.passwordNew.value;
    let _passwordConfirm = this.passwordConfirm.value;
    let _avatar = null;
    if (this.avatar) _avatar = this.avatar.files[0];

    if (!_name || !_email) return alert("Name and email field cannot be empty");
    if (!_email.includes("@")) {
      return alert("Email is incorrect");
    }
    if (_passwordOld) {
      if (!_passwordNew || !_passwordConfirm)
        return alert("Password field cannot be empty");
      if (_passwordNew !== _passwordConfirm)
        return alert("Confirm password incorrect");
      if (_passwordNew || _passwordConfirm) {
        if (!_passwordOld) return alert("Please fill in the old password");
      }
      formData.append("oldPassword", _passwordOld);
      formData.append("newPassword", _passwordNew);
    }

    if (_avatar) formData.append("avatar", _avatar);
    formData.append("name", _name);
    formData.append("email", _email);
    formData.append("address", _address);
    formData.append("birthDate", _birthDate);
    formData.append("birthPlace", _birthPlace);

    for(var pair of formData.entries()) {
      console.log(pair[0]+ ', '+ pair[1]); 
   }

    try {
      let user = await axios.patch(
        url + "/users/" + this.props.userName,
        formData
      );
      console.log(user);
      if (user.data.error) return alert(user.data.error);
      if (user.data.avatar) {
        this.props.changeUserAvatar(
          this.props.userName,
          this.props.userType,
          user.data.avatar
        );
      }
      this.passwordOld.value = "";
      this.passwordNew.value = "";
      this.passwordConfirm.value = "";
      this.cancelChangeAvatar(e);
      this.setState({ toggleAvatar: false,old: false, new: false, confirm: false });
      Swal.fire({
        type: "success",
        title: user.data.message
      });
    } catch (error) {
      console.log(error);
    }
  };

  renderProfile = () => {
    return (
      <form  className="form-group mb-0">
        <div className="card-title">
          <h3>Name : </h3>
          <input
            className="form-control"
            type="text"
            defaultValue={this.state.name}
            ref={input => {
              this.name = input;
            }}
          />
        </div>
        <div className="card-title">
          <h3>E-mail : </h3>
          <input
            className="form-control"
            type="email"
            defaultValue={this.state.email}
            ref={input => {
              this.email = input;
            }}
          />
        </div>
        <div className="card-title">
          <h3>Birth place : </h3>
          <input
            className="form-control"
            type="text"
            defaultValue={this.state.birthPlace}
            ref={input => {
              this.birthPlace = input;
            }}
          />
        </div>
        <div className="card-title">
          <h3>Date of birth : </h3>
          <h5>(format: YYYY-MM-DD)</h5>
          <input
            className="form-control"
            type="text"
            defaultValue={this.state.birthDate}
            ref={input => {
              this.birthDate = input;
            }}
          />
        </div>
        <div className="card-title">
          <h3>Address : </h3>
          <input
            className="form-control"
            type="text"
            defaultValue={this.state.address}
            ref={input => {
              this.address = input;
            }}
          />
        </div>
        <div className="card-title">
          <h3 className="border-bottom border-dark">Password : </h3>
          <h6>Old password</h6>
          <input
          style={{width:'89%'}}
            className="form-inline d-inline"
            type={this.state.old ? "text" : "password"}
            ref={input => {
              this.passwordOld = input;
            }}
          />
          <button onClick={e => this.showOld(e)} className='btn btn-warning d-inline ml-3'>
            {this.state.old ? 'Hide' : 'Show'}
          </button>
          <h6>New password</h6>
          <input
            style={{width:'89%'}}
            className="form-inline d-inline"
            type={this.state.new ? "text" : "password"}
            ref={input => {
              this.passwordNew = input;
            }}
          />
          <button onClick={e => this.showNew(e)} className='btn btn-warning d-inline ml-3'>
            {this.state.new ? 'Hide' : 'Show'}
          </button>
          <h6>Confirm password</h6>
          <input
            style={{width:'89%'}}
            className="form-inline d-inline"
            type={this.state.confirm ? "text" : "password"}
            ref={input => {
              this.passwordConfirm = input;
            }}
          />
          <button onClick={e => this.showConfirm(e)} className='btn btn-warning d-inline ml-3'>
            {this.state.confirm ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          className="m-0 p-0"
          style={{ opacity: 0 }}
          onClick={this.onSubmit}
        ></button>
      </form>
    );
  };

  toggleAvatar = () => {
    this.setState({ toggleAvatar: !this.state.toggleAvatar });
  };

  changeAvatar = e => {
    e.persist();
    let avatar = this.avatar.files[0];
    this.setState({
      photoName: avatar.name,
      file: URL.createObjectURL(avatar)
    });
  };

  cancelChangeAvatar = e => {
    e.persist();
    this.avatar = null;
    this.setState({
      photoName: "",
      file: null
    });
    this.toggleAvatar();
  };

  showOld = e => {
    e.preventDefault();
    this.setState({old: !this.state.old})
  }

  showNew = e => {
    e.preventDefault();
    this.setState({new: !this.state.new})
  }

  showConfirm = e => {
    e.preventDefault();
    this.setState({confirm: !this.state.confirm})
  }

  

  render() {
    if (this.props.userName && this.props.userType !== "admin") {
      return (
        <div className="row">
          <div className="col-2 mx-auto  mt-5">
            {this.state.file ? (
              <img
                onClick={this.toggleAvatar}
                className="img-thumbnail"
                src={this.state.file}
                alt="asu"
              ></img>
            ) : (
              <img
                onClick={this.toggleAvatar}
                className="img-thumbnail"
                src={this.props.avatar}
                alt="asu"
              ></img>
            )}
            {this.state.toggleAvatar ? (
              <div className="custom-file mt-2">
                <input
                  onChange={this.changeAvatar}
                  ref={input => (this.avatar = input)}
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {this.state.photoName ? this.state.photoName : "Choose file"}
                </label>
                <button
                  onClick={this.cancelChangeAvatar}
                  className="btn btn-danger mt-2 btn-block"
                >
                  Cancel
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card col-7 mr-auto mt-5">
            <div className="card-body">
              <div className="card-title border-bottom border-dark">
                <h1>Update Profile</h1>
              </div>
              {this.renderProfile()}
              <button
                type="submit"
                className="btn btn-block btn-info"
                onClick={this.onSubmit}
              >
                SUBMIT
              </button>
            </div>
          </div>
          <div style={{ height: 300 }} className="container"></div>
        </div>
      );
    } else if (this.props.userType === "admin") {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/" />;
    }
  }
}
const mapStateToProps = state => {
  return {
    userName: state.auth.userName,
    userType: state.auth.userType,
    avatar: state.auth.avatar
  };
};

export default connect(mapStateToProps, { changeUserAvatar })(UpdateProfile);
