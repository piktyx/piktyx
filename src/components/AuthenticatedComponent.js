import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actionCreatorsAuth from '../actions/auth';
import * as actionCreatorsData from '../actions/data';
import {history} from '../store/configureStore';
import { API_URL } from '../constants/index';

import { css } from '@emotion/core';
import { GridLoader } from 'react-spinners';
import Header from './Header/index';

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

const override = css`
    position: fixed; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-color: blue;
`;


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
                    fetch(API_URL + '/api/is_token_valid', {
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
                        ? 
                            <div>
                                <Header />
                                <div
                                    id="main"
                                    className="container"
                                    style={{ marginTop: 10, paddingBottom: 250 }}
                                >
                                    <Component {...this.props} />
                                </div>
                            </div>
                        : 
                            <div className='sweet-loading'>
                                <GridLoader
                                    css={override}
                                    sizeUnit={"px"}
                                    size={20}
                                    color={'#123abc'}
                                    loading={true}
                                />
                            </div> 
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
