import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreatorsData from '../actions/data';
import * as actionCreatorsPic from '../actions/pictures';

import { withTranslation } from 'react-i18next';

import { Button } from 'react-materialize';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;



function mapStateToProps(state) {
    return {
        data: state.data,
        files: state.pictures.files,
        token: state.auth.token,
        uploaded: state.pictures.uploaded,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
        statusText: state.auth.statusText,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: {
            picActions: bindActionCreators(actionCreatorsPic, dispatch),
            dataActions: bindActionCreators(actionCreatorsData, dispatch)
        }
    };
}


@connect(mapStateToProps, mapDispatchToProps)
class MainView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          uploading: false
        }
        
    }


    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.actions.dataActions.fetchProtectedData(token);
    }

    
    upload_picture = e => {
        const files = Array.from(e.target.files)
        
        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            formData.append(i, file)
        })

        
        this.props.actions.picActions.uploadPicture(formData, this.props.token);

    }

    reset = () => {
        this.setState({uploading: false});
    }

    render() {
        const { t } = this.props;
        return (
                <div>
                    {!this.props.loaded
                        ? <h1>Loading data...</h1>
                        :
                        <div>
                            <h1>{t('MAIN_WELCOME')}, {this.props.data.data.username} !</h1>
                                            <hr />
                                            <h3>{t('MAIN_UPLOAD_PICTURE')}</h3>
                                            {this.state.uploading ?
                                                    !this.props.uploaded
                                                    ? 
                                                        <div className='sweet-loading'>
                                                            <ClipLoader
                                                            css={override}
                                                            sizeUnit={"px"}
                                                            size={36}
                                                            color={'#123abc'}
                                                            loading={this.state.loading}
                                                            />
                                                        </div> 
                                                    :
                                                        <div>
                                                            <h5>{t('MAIN_UPLOAD_SUCCESS')}</h5>
                                                            <ul>
                                                                {this.props.files.map((value, index) => {
                                                                    return <li key={index}>{value}</li>
                                                                })}
                                                            </ul>
                                                            <Button onClick={() => this.reset()}>{t('MAIN_UPLOAD_NEW')}</Button>
                                                        </div>
                                                :
                                                <div className="dropzone">
                                                    <div className="fallback">
                                                        <input name="file" type="file" multiple onChange={(e) => this.upload_picture(e)}/>
                                                    </div>
                                                </div>
                                            }
                                            
                                
                                </div>
                            }
                    </div>
           
        );
    }
}

MainView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withTranslation()(MainView);