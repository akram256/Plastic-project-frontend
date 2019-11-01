import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import M from 'materialize-css/dist/js/materialize.js';
// import { userSignupRequest } from '../../actions/signup/signupActions';
// import SignUpModal from '../../components/signup/SignupModal';
import '../../styles/registerModal.scss';

export class ModuleOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name:'',
      last_name: '',
      phone:'',
      email: '',
      address:'',
      nationality:'',
      password: '',
      password2: '',
    };
  }


  inputHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submitHandler = e => {
    e.preventDefault();
    this.setState({isLoading:true})
    if (this.state.password == this.state.password2) {
      const data = {
        user: {
          first_name: this.state.first_name,
          last_name:this.state.last_name,
          phone:this.state.phone,
          email: this.state.email,
          address:this.state.address,
          nationality:this.state.nationality,
          password: this.state.password,
        },
      };
    //   this.props.ModuleRequest(data);
    // } else {      add actions here
    //   M.toast({html: 'Passwords donot match', classes: 'red' });

    }
  };


  render() {
    // const { ModuleRequest,
    //         open,
    //         close } = this.props;

    return (
        <div>
      
      </div>
    );
  }
}

SignupPage.propTypes = {
  ModuleRequest: PropTypes.func.isRequired,
};

// export const mapStateToProps = (state) => {
//   return { loading: state.registrationReducer.loading }
// }


export default connect(
  mapStateToProps,
  { ModuleRequest }
);
