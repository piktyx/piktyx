import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import {history} from '../../store/configureStore';

import { Navbar, NavItem, Dropdown } from 'react-materialize';

import { withTranslation } from 'react-i18next';

import * as actionCreators from '../../actions/auth';

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

@connect(mapStateToProps, mapDispatchToProps)
class Header extends Component {
    constructor(props) {
        super(props);

    }

    logout(e) {
        e.preventDefault();
        this.props.logoutAndRedirect('/home');
    }

    change_url(route){
        history.push(route);  
    }


    render() {
        const { t } = this.props;
        return (
            <header>
                
                    {
                        !this.props.isAuthenticated ?
                            <div>
                                <Navbar brand={<a />} className="blue darken-3" alignLinks="left">
                                    <a onClick={() => this.change_url('/home')} href="#" className="brand-logo center">Piktyx</a>
                                    <NavItem onClick={() => this.change_url('/home')}>
                                        {t("HEADER_HOME")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/register')}>
                                        {t("HEADER_REGISTER")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/login')}>
                                        {t("HEADER_LOGIN")}
                                    </NavItem>
                                </Navbar>

                            </div>
                            :
                            <div>
                                <Navbar brand={<a />} className="blue darken-3" alignLinks="left">
                                    <a onClick={() => this.change_url('/home')} href="#" className="brand-logo center">Piktyx</a>
                                    <NavItem onClick={() => this.change_url('/main')}>
                                        {t("HEADER_HOME")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/gallery')}>
                                        {t("HEADER_GALLERY")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/folders')}>
                                        {t("HEADER_FOLDER")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/account')}>
                                        {t("HEADER_ACCOUNT")}
                                    </NavItem>
                                    <NavItem onClick={() => this.change_url('/options')}>
                                        {t("HEADER_OPTIONS")}
                                    </NavItem>
                                    <NavItem onClick={(e) => this.logout(e)}>
                                        {t("HEADER_LOGOUT")}
                                    </NavItem>
                                </Navbar>
                                
                            </div>
                    }
          
            </header>

        );
    }
}

Header.propTypes = {
    logoutAndRedirect: PropTypes.func,
    isAuthenticated: PropTypes.bool,
};

export default withTranslation()(Header);