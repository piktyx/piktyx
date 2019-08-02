import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';

import { withTranslation } from 'react-i18next';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class AccountView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }
    
    render() {
        const { t } = this.props;
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>{t("AUTH_ACCOUNT_TITLE")}</h1>
                        <hr />
                        <h3>{t("AUTH_EMAIL")} : {this.props.data.data.email}</h3>
                        <h3>{t("AUTH_USERNAME")} : {this.props.data.data.username}</h3>
                    </div>
                }
                

            </div>
        );
    }
}

AccountView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withTranslation()(AccountView);