import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/auth';

import { withTranslation } from 'react-i18next';

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
class NotFound extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const { t } = this.props;
        return (
            <div className="col-md-8">
                <h1>{t("NOT_FOUND")}</h1>
            </div>
        );
    }
}

export default withTranslation()(NotFound);
