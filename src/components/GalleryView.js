import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as actionCreatorsData from '../actions/data';
import * as actionCreatorsPic from '../actions/pictures';
import * as actionCreatorsFolders from '../actions/folders';

import { withTranslation } from 'react-i18next';

import bcrypt from 'bcryptjs';

import { API_URL } from '../constants/index';

import { Button, Modal, TextInput, Select } from 'react-materialize';
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
          tag: "",
          load: true,
          view: "*",
          images: [],
          selectAllChecked: false
        }
    }

    componentDidMount() {
        this.fetchData();
        this.fetchPictures();
    }



    loadPictures(view) {
            console.log(view)
            var pictures = []

            if(this.props.pictures_loaded){
                        
                var { data, t } = this.props;
                var protected_folder = [];
                var folder_password = [];
                var protected_pictures = [];

                var ask_password = false;
                var current_password = "";

                this.getFolder(this.props.folders).map((folder, key) => {
                    if(folder.password !== "None"){
                        protected_folder.push(folder.id);
                        folder_password.push(folder.password);
                    }
                });

                this.props.files.map((value) => {
                    if(value.folder.includes(view) || view == "*"){
                        
                        for(var i =0; i<protected_folder.length; i++){
                            if(value.folder.includes(protected_folder[i]) && view != "*"){
                                ask_password = true
                                current_password =  folder_password[i]
                            }
                            
                            if(value.folder.includes(protected_folder[i]) && view == "*"){
                                
                                protected_pictures.push(value.id)
                            }
                        }
                        

                        if(!protected_pictures.includes(value.id)){
                            let tags = [];
                            value.tags.split(",").map((tag) => {
                                tags.push({value: tag, title: tag});
                            })

                            let picture = {
                                        src: `${data.data.location == 1 ? API_URL : ""}/files/piktyx/${data.data.id}/${value.filename}`,
                                        thumbnail: `${data.data.location == 1 ? API_URL : ""}/files/piktyx/${data.data.id}/${value.filename}`,
                                        id: value.id,
                                        thumbnailWidth: value.width,
                                        thumbnailHeight: value.height,
                                        customOverlay : <Overlay picture={value} folders={this.props.folders} deletePictureTag={this.deletePictureTag} addPictureTag={this.addPictureTag} deletePicture={this.deletePicture} getFolder={this.getFolder} addPictureFolder={this.addPictureFolder}/>,
                                        tags: tags
                            };

                            pictures.push(picture)

                        }
                        
                    }
                });

                if(ask_password){
                    var password = prompt(t("PASSWORD"));
                    if(password == current_password){
                        this.setState({images: pictures});
                    }else{
                        alert(t("WRONG_PASSWORD"));
                        this.setState({images: []});
                    }
                }else{
                    this.setState({images: pictures});
                }

                
            }
    }


    fetchData() {
        const token = this.props.token;
        this.props.actions.dataActions.fetchProtectedData(token);
    }

    fetchPictures(){
        if(this.props.data.data){
            this.props.actions.folderActions.fetchFolders(this.props.token);
            this.props.actions.picActions.fetchPictures(this.props.token, this.props.data.data.location).then(() => {
                this.loadPictures(this.state.view);
            });
            
        }
        
    }


    deletePicture = (e, pic) => {
        e.preventDefault();

        this.props.actions.picActions.deletePicture(this.props.token, pic, this.props.data.data.location).then(() => {
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

    addPictureSelectedFolder = () => {
        var e = document.getElementById("folder_select_selected");
        var folders_array = this.getSelectValues(e);

        var pics = this.getSelectedImages().join(",");

        if (folders_array.length == 1){
            var folders = folders_array[0];
        }else{
            var folders = folders_array.join()
        }
        
       
        this.props.actions.folderActions.addPictureSelectedFolder(pics, folders, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    addPictureSelectedTag = (tag) => {
        var pics = this.getSelectedImages().join(",");
        this.props.actions.picActions.addPictureSelectedTag(pics, tag, this.props.token).then(() => {
            this.setState({tags: ""})
            this.fetchPictures();
        });
    }

    addPictureFolder = (pic) => {

        var e = document.getElementById("folder_select_" + pic);
        var folders_array = this.getSelectValues(e);

        if (folders_array.length == 1){
            var folders = folders_array[0];
        }else{
            var folders = folders_array.join()
        }
       
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
        this.props.actions.picActions.deletePictureTag(pic, tag, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    deletePictureFolder = (folder, pic) => {
        this.props.actions.folderActions.deletePictureFolder(pic, folder, this.props.token).then(() => {
            this.fetchPictures();
        });
    }

    setCurrentView = (e) => {
        this.setState({view: e.target.value, protected: false});   
        this.loadPictures(e.target.value); 
    }

    allImagesSelected = (images) => {
        var f = images.filter(
            function (img) {
                return img.isSelected == true;
            }
        );
        return f.length == images.length;
    }

    onSelectImage = (index, image) => {
        var images = this.state.images.slice();
        var img = images[index];
        if(img.hasOwnProperty("isSelected"))
            img.isSelected = !img.isSelected;
        else
            img.isSelected = true;

        this.setState({
            images: images
        });

        if(this.allImagesSelected(images)){
            this.setState({
                selectAllChecked: true
            });
        }
        else {
            this.setState({
                selectAllChecked: false
            });
        }
    }

    getSelectedImages = () => {
        var selected = [];
        for(var i = 0; i < this.state.images.length; i++)
            if(this.state.images[i].isSelected == true)
                selected.push(this.state.images[i].id);
        return selected;
    }

    onClickSelectAll = () => {
        var selectAllChecked = !this.state.selectAllChecked;
        this.setState({
            selectAllChecked: selectAllChecked
        });

        var images = this.state.images.slice();
        if(selectAllChecked){
            for(var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = true;
        }
        else {
            for(var i = 0; i < this.state.images.length; i++)
                images[i].isSelected = false;

        }
        this.setState({
            images: images
        });
    }

    changeTag = (e) => {
        this.setState({tag: e.target.value});
    }


    render() {
        const { t } = this.props;

      
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

                            <Select id={`view_select`} onChange={(e) => this.setCurrentView(e)}>
                                <option value="*" >
                                    {t('ALL')}
                                </option>
                                {
                                    this.getFolder(this.props.folders).map((folder, key) => {
                                            return (
                                                !this.state.view.includes(folder.id) ?
                                                    <option key={key} value={folder.id}>
                                                        {folder.name} 
                                                    </option>
                                                :
                                                    <option key={key} value={folder.id} selected>
                                                        {folder.name} 
                                                    </option>
                                            )
                                    })
                                }
                            </Select>
                            
                        <hr />
                        <Button onClick={this.onClickSelectAll}>{t("PICTURES_SELECT_ALL")}</Button>
                        <Modal header={t("PICTURES_MANAGE_TITLE")} actions={<div><Button waves="green" modal="close" flat onClick={() => history.push('/folders')}>{t("PICTURES_FOLDER_ADD")}</Button><Button waves="green" modal="close" flat>{t("CLOSE")}</Button></div> } trigger={<Button>{t("PICTURES_SELECT_MANAGE")}</Button>}>
                            {t("PICTURES_FOLDER")}
                            <Select multiple id={`folder_select_selected`}>
                                <option value="" disabled>
                                    {t('PICTURES_FOLDER_CHOOSE')}
                                </option>
                                {
                                    this.getFolder(this.props.folders).map((folder, key) => {
                                            return (
                                                <option key={key} value={folder.id}>
                                                    {folder.name} 
                                                </option>
                                            )
                                    })
                                }
                            </Select>
                            <br />
                            <Button className="blue darken-4"  onClick={() => this.addPictureSelectedFolder()}>{t("ADD")}</Button>
                            <br />
                            <hr />
                            {t("PICTURES_TAG")}
                            <TextInput
                                        label={t("TAG_ADD")}
                                        type="text"
                                        value={this.state.tag}
                                        onChange={(e) => this.changeTag(e)}
                                />
                            <Button className="blue darken-4"  onClick={() => this.addPictureSelectedTag(this.state.tag)}>{t("ADD")}</Button>
                        </Modal>

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
                                this.state.images.length === 0
                                ?
                                    <h2>{t("NO_PICTURES")}</h2>
                                :
                                    <Gallery 
                                        images={this.state.images}
                                        onSelectImage={this.onSelectImage}
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