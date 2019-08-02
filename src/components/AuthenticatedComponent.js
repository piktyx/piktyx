import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actionCreatorsAuth from '../actions/auth';
import * as actionCreatorsData from '../actions/data';
import {history} from '../store/configureStore';

import { withTranslation } from 'react-i18next';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        userName: state.auth.userName,
        loaded: state.data.loaded,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            dataActions : bindActionCreators(actionCreatorsData, dispatch),
            authActions : bindActionCreators(actionCreatorsAuth, dispatch)
        }
    };
}


export function requireAuthentication(Component) {
    class AuthenticatedComponent extends React.Component {
        componentWillMount() {
            this.checkAuth();
            this.setState({
                loaded_if_needed: false,
            });
        }

        componentWillReceiveProps(nextProps) {
            if(nextProps.data.data){
                if(typeof nextProps.data.data.lang !== undefined){
                    let lang = localStorage.getItem('lang');                  
                    if(lang !== nextProps.data.data.lang){
                        localStorage.setItem('lang', nextProps.data.data.lang);
                    }
                    if(!lang){
                        localStorage.setItem('lang', nextProps.data.data.lang);
                    }
                    
                }
                
            }
            
            
            this.checkAuth(nextProps);
        }

        checkAuth(props = this.props) {

            if (!props.isAuthenticated) {
                const token = localStorage.getItem('token');
                if (!token) {

                    history.push('/home');
                } else {

                    fetch('/api/is_token_valid', {
                        method: 'post',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json', // eslint-disable-line quote-props
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token }),
                    })
                        .then(res => {
                          
                            if (res.status === 200) {
                                this.props.actions.authActions.loginUserSuccess(token);

                                this.setState({
                                    loaded_if_needed: true,
                                });
                                

                            } else {
                                history.push('/home');

                            }
                        });

                }
            } else {
                this.setState({
                    loaded_if_needed: true,
                });
            }
        }

        render() {

            return (
                <div>
                    {this.props.isAuthenticated 
                        ? <Component {...this.props} />
                        : null
                    }
                </div>
            );

        }
    }

    AuthenticatedComponent.propTypes = {
        loginUserSuccess: PropTypes.func,
        isAuthenticated: PropTypes.bool,
    };

    return withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent));
}
