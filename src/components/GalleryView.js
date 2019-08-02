import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreatorsData from '../actions/data';
import * as actionCreatorsPic from '../actions/pictures';
import * as actionCreatorsFolders from '../actions/folders';

import { withTranslation } from 'react-i18next';

import { API_URL } from '../constants/index';


import { Button } from 'react-materialize';
import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';
import Overlay from './Pictures/Overlay';

import Gallery from 'react-grid-gallery';


const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;


function mapStateToProps(state) {
    return {
        data: state.data,
        files: state.pictures.files,
        pictures_loaded: state.pictures.pictures_loaded,
        folders: state.folders.folders,
        folders_loaded: state.folders.folders_loaded,
        token: state.auth.token,
        loaded: state.data.loaded,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: {
            picActions: bindActionCreators(actionCreatorsPic, dispatch),
            dataActions: bindActionCreators(actionCreatorsData, dispatch),
            folderActions: bindActionCreators(actionCreatorsFolders, dispatch)
        }
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class GalleryView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          view: "*"
        }
    }

    componentDidMount() {
        this.fetchData();
        this.fetchPictures();
    }


    fetchData() {
        const token = this.props.token;
        this.props.actions.dataActions.fetchProtectedData(token);
    }

    fetchPictures(){
        this.props.actions.picActions.fetchPictures(this.props.token);
        this.props.actions.folderActions.fetchFolders(this.props.token);
    }


    deletePicture = (e, pic) => {
        e.preventDefault();

        let href = pic.substring(pic.lastIndexOf('/') + 1)
        this.props.actions.picActions.deletePicture(this.props.token, href).then(() => {
            this.fetchPictures();
        });
    }

    getFolder = (folders_list) => {
        let folders = []
        
        for(var key in folders_list){
            folders.push(folders_list[key])
        }
        
        return folders
    }

    setFolder = (e) => {
        e.preventDefault();
        console.log(e.target.value)
        this.setState({folder: e.target.value});
    }

    getSelectValues = (select) => {
        var result = [];
        var options = select && select.options;
        var opt;
      
        for (var i=0, iLen=options.length; i<iLen; i++) {
          opt = options[i];
      
          if (opt.selected) {
            result.push(opt.value || opt.text);
          }
        }
        return result;
      }

    addPictureFolder = (pic) => {
        var e = document.getElementById("folder_select_" + pic);
        var folders_array = this.getSelectValues(e);

        if (folders_array.length == 1){
            var folders = folders_array[0];
        }else{
            var folders = folders_array.join()
        }
        console.log(folders)
       
        this.props.actions.folderActions.addPictureFolder(pic, folders, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    addPictureTag = (pic, tag) => {
       
        this.props.actions.picActions.addPictureTag(pic, tag, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    deletePictureTag = (pic, tag) => {
        console.log('test')
        this.props.actions.picActions.deletePictureTag(pic, tag, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    deletePictureFolder = (folder, pic) => {
        
        this.props.actions.folderActions.deletePictureFolder(pic, folder, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    setCurrentView = (view) => {
        this.setState({view: view});
    }


    render() {
        const { t } = this.props;
        let pictures = [];

        if(this.props.pictures_loaded){
            this.props.files.map((value) => {
                if(value.folder.includes(this.state.view) || this.state.view == "*"){
                    let tags = []
                    value.tags.split(",").map((tag) => {
                        tags.push({value: tag, title: tag});
                    })


                    let picture = {
                        src: `${API_URL}/${value.path}`,
                        thumbnail: `${API_URL}/${value.path}`,
                        thumbnailWidth: value.width,
                        thumbnailHeight: value.height,
                        customOverlay : <Overlay picture={value} folders={this.props.folders} deletePictureTag={this.deletePictureTag} addPictureTag={this.addPictureTag} deletePicture={this.deletePicture} getFolder={this.getFolder} addPictureFolder={this.addPictureFolder}/>,
                        tags: tags
                    };
                    pictures.push(picture)
                }
            });
        }
        return (
            <div>
                {!this.props.loaded
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
                        <h1>{t("PICTURES_TITLE")}</h1>
                        <hr />
                            <br />
                            <ul className="tabs tabs-fixed-width tab-demo z-depth-1">
                                <li className="tab"><a className="active" onClick={() => this.setCurrentView("*")} href="#">All</a></li>
                                {
                                     this.getFolder(this.props.folders).map((folder, key) => {
                                        return (
                                            <li className="tab"><a onClick={() => this.setCurrentView(folder.id)} href="#">{folder.name}</a></li>
                                        )
                                    })
                                }
                            </ul>
                            
                        <hr />
                        {!this.props.pictures_loaded
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
                                <Gallery 
                                    images={pictures}
                                    />

                        }
                        
                       
                    </div>
                }
            </div>
        );
    }
}

GalleryView.propTypes = {
    fetchProtectedData: PropTypes.func,
    loaded: PropTypes.bool,
    userName: PropTypes.string,
    data: PropTypes.any,
    token: PropTypes.string,
};

export default withTranslation()(GalleryView);