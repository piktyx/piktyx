import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';

import { withTranslation } from 'react-i18next';

import { Select, Modal } from 'react-materialize';

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
class OptionsView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    changeLanguage = (e) => {
        localStorage.setItem('lang', e.target.value);
        this.props.i18n.changeLanguage(e.target.value);
        this.props.changeLang(this.props.token, e.target.value);
    }
    
    render() {
        const { t } = this.props;
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>{t('OPTIONS_TITLE')}</h1>
                        <hr />
                        <h3>{t('OPTIONS_LANGUAGE')} :</h3>
                        
                        <Select value="" onChange={(e) => this.changeLanguage(e)}>
                            <option value="" disabled>
                            {t('OPTIONS_LANGUAGE_CHOOSE')}
                            </option>
                            <option value="fr">
                                {t('OPTIONS_LANGUAGE_FRENCH')}
                            </option>
                            <option value="en">
                                {t('OPTIONS_LANGUAGE_ENGLISH')}
                            </option>
                        </Select>
                    </div>
                }
                

            </div>
        );
    }
}

OptionsView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withTranslation()(OptionsView);