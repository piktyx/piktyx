import React from 'react';
import PropTypes from 'prop-types';

import { Route, Switch, Redirect } from 'react-router';

/* application components */
import Header from '../../components/Header';
import { HomeContainer } from '../../containers/HomeContainer';
import LoginView from '../../components/LoginView';
import RegisterView from '../../components/RegisterView';
import MainView from '../../components/MainView';
import FolderView from '../../components/FolderView';
import GalleryView from '../../components/GalleryView';
import AccountView from '../../components/AccountView';
import OptionsView from '../../components/OptionsView';
import NotFound from '../../components/NotFound';

import { DetermineAuth } from '../../components/DetermineAuth';
import { requireAuthentication } from '../../components/AuthenticatedComponent';
import { requireNoAuthentication } from '../../components/notAuthenticatedComponent';

import '../../i18n';


class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

    render() {
        return (
            <div>
                    <Header />
                    <div
                        id="main"
                        className="container"
                        style={{ marginTop: 10, paddingBottom: 250 }}
                    >
                            <Switch>
                                <Route path="/main" component={requireAuthentication(MainView)} />
                                <Route path="/options" component={requireAuthentication(OptionsView)} />
                                <Route path="/folders" component={requireAuthentication(FolderView)} />
                                <Route path="/account" component={requireAuthentication(AccountView)} />
                                <Route path="/gallery" component={requireAuthentication(GalleryView)} />
                                <Route path="/login" component={requireNoAuthentication(LoginView)} />
                                <Route path="/register" component={requireNoAuthentication(RegisterView)} />
                                <Route path="/" component={requireNoAuthentication(HomeContainer)} />
                                <Route path="*" component={DetermineAuth(NotFound)} />
                            </Switch>
                    </div>
            </div>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
};

export { App };
