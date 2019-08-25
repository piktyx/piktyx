import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {history} from '../store/configureStore';
import * as actionCreators from '../actions/auth';
import { API_URL } from '../constants/index';
import { css } from '@emotion/core';
import { GridLoader } from 'react-spinners';

import Header from './Header/index';

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        userName: state.auth.userName,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

const override = css`
    position: fixed; 
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-color: blue;
`;


export function requireNoAuthentication(Component) {

    class notAuthenticatedComponent extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                loaded: false,
            };
        }

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth(nextProps);
        }

        checkAuth(props = this.props) {

            if (props.isAuthenticated) {

                history.push('/main');

            } else {

                const token = localStorage.getItem('token');
                if (token) {
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
                                this.props.loginUserSuccess(token);
                                history.push('/main');

                            } else {
                                this.setState({
                                    loaded: true,
                                });
                            }
                        });
                } else {
                    this.setState({
                        loaded: true,
                    });
                }
            }
        }

        render() {
            return (
                <div>
                    {!this.props.isAuthenticated && this.state.loaded
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

    notAuthenticatedComponent.propTypes = {
        loginUserSuccess: PropTypes.func,
        isAuthenticated: PropTypes.bool,
    };

    return connect(mapStateToProps, mapDispatchToProps)(notAuthenticatedComponent);

}
