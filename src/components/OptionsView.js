import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import os from 'os';

import { withTranslation } from 'react-i18next';

import { Select, Switch } from 'react-materialize';

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

    constructor(props){
        super(props);
        this.state={
            folder: "",
            location: ""
        }
    }


    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
        this.setState({location: this.props.data.data.location})
    }

    changeLanguage = (e) => {
        localStorage.setItem('lang', e.target.value);
        this.props.i18n.changeLanguage(e.target.value);
        this.props.changeLang(this.props.token, e.target.value);
    }

    changeLocation = (e) => {
        var val = e.target.value === "0" ? 1 : 0;
        this.setState({location: val.toString()})
        this.props.changeLocation(this.props.token, val)
        
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
                        <br/>
                        {
                            this.props.data.data.admin == 1 &&
                            <div>
                                <h3>{t('OPTIONS_PICTURES_LOCATION')} :</h3>
                                <Switch checked={this.state.location === "0" ? false : true} value={this.state.location} offLabel={t('OPTIONS_LOCATION_CLIENT')} onLabel={t('OPTIONS_LOCATION_SERVER')} onChange={(e) => this.changeLocation(e)} />
                            </div>
                        }
                        


                        
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