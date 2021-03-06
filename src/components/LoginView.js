/* eslint camelcase: 0, no-underscore-dangle: 0 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextInput, Button } from 'react-materialize';
import PropTypes from 'prop-types';
import * as actionCreators from '../actions/auth';
import { validateEmail } from '../utils/misc';

import { withTranslation } from 'react-i18next';


function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

@connect(mapStateToProps, mapDispatchToProps)
class LoginView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.props.loginUser(this.state.email, this.state.password, this.state.redirectTo)
    }

    render() {
        const { t } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                    <form role="form">
                        <div className="text-center">
                            <h2>{t("AUTH_LOGIN_TITLE")}</h2>
                            {
                                this.props.statusText &&
                                    <div className="alert alert-info">
                                        {this.props.statusText}
                                    </div>
                            }

                            <div className="col-md-12">
                                <TextInput
                                  label={t("AUTH_EMAIL")}
                                  type="email"
                                  error={this.state.email_error_text}
                                  onChange={(e) => this.changeValue(e, 'email')}
                                />
                            </div>
                            <div className="col-md-12">
                                <TextInput
                                  label={t("AUTH_PASSWORD")}
                                  type="password"
                                  error={this.state.password_error_text}
                                  onChange={(e) => this.changeValue(e, 'password')}
                                />
                            </div>

                            <Button
                              disabled={this.state.disabled}
                              style={{ marginTop: 50 }}
                              onClick={(e) => this.login(e)}
                            >{t("SUBMIT")}</Button>

                        </div>
                    </form>
            
            </div>
        );

    }
}

LoginView.propTypes = {
    loginUser: PropTypes.func,
    statusText: PropTypes.string,
};

export default withTranslation()(LoginView);