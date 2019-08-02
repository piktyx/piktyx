import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreatorsData from '../actions/data';
import * as actionCreatorsFolder from '../actions/folders';

import { withTranslation } from 'react-i18next';

import { Button, TextInput } from 'react-materialize';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
        folders: state.folders.folders,
        folders_loaded: state.folders.folders_loaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            dataActions: bindActionCreators(actionCreatorsData, dispatch),
            folderActions: bindActionCreators(actionCreatorsFolder, dispatch)
        }
    } 
}

@connect(mapStateToProps, mapDispatchToProps)
class FolderView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    constructor(props) {
        super(props);
        this.state = {
          folder: "",
          tags: ""
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.addFolder();
        }
    }

    fetchData() {
        const token = this.props.token;
        this.props.actions.dataActions.fetchProtectedData(token);
        this.props.actions.folderActions.fetchFolders(token);
    }

    addFolder = () => {
        this.props.actions.folderActions.addFolder(this.state.folder, this.state.tags, this.props.token).then(() => {
            this.props.actions.folderActions.fetchFolders(this.props.token);
        });
        this.setState({folder: "", tags: ""})
    }

    deleteFolder = (id) => {
        this.props.actions.folderActions.deleteFolder(this.props.token, id).then(() => {
            this.props.actions.folderActions.fetchFolders(this.props.token);
        });
    }

    changeFolder = (e) => {
        this.setState({folder: e.target.value});
    }

    changeTag = (e) => {
        this.setState({tags: e.target.value});
    }

    getFolder = (folders_list) => {
        let folders = []
        
        for(var key in folders_list){
            folders.push(folders_list[key])
        }
        
        return folders
    }
    
    render() {
        const { t } = this.props;

        return (
            <div onKeyPress={(e) => this._handleKeyPress(e)}>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <h1>{t('FOLDER_TITLE')}</h1>
                        <hr /><br />
                        <h3>{t('FOLDER_ALL')}</h3>
                        <ul>
                            {!this.props.folders_loaded
                                ? <h1>Loading data...</h1>
                                :
                                    this.getFolder(this.props.folders).map((value, key) => {
                                        return (
                                            <div key={key}>
                                                <li>{value.name} | <b>{t("TAGS")}</b> : {value.tags} | <Button className="blue darken-4 " onClick={() => this.deleteFolder(value.id)}>{t("DELETE")}</Button></li><br/>
                                                
                                            </div>
                                        )
                                    })
                                    
                            }
                        </ul>
                        <hr /><br />
                        <h3>{t('FOLDER_ADD')}</h3>
                        <TextInput
                                  label={t("FOLDER")}
                                  type="text"
                                  value={this.state.folder}
                                  onChange={(e) => this.changeFolder(e)}
                        />
                        <TextInput
                                  label={t("TAGS")}
                                  type="text"
                                  value={this.state.tags}
                                  onChange={(e) => this.changeTag(e)}
                        />
                        <Button className="blue darken-4 " onClick={() => this.addFolder()}>{t("ADD")}</Button>
                    </div>
                }
                

            </div>
        );
    }
}

FolderView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withTranslation()(FolderView);