import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageHandbook.scss'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import CommonUtils from '../../../utils/CommonUtils';
import { toast } from 'react-toastify';
import DatePicker from '../../../components/Input/DatePicker';
import { handleCreateHandbook } from '../../../services/handbookService';

const mdParser = new MarkdownIt();

class ManageHandbook extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            name: '',
            author: '',
            datePublish: new Date(),
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount(){
     
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
            
        }
    }

    handleOnChangeInput = (event, id) =>{
        let stateCopy = { ...this.state};
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        }) 
    }

    handleEditorChange = ({html, text}) =>{
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html,
        });
    }

    handleOnChangeImage = async (event) =>{
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })     
        }
    }
    handleOnchangeDatePicker = (date) =>{
        this.setState({
            datePublish: new Date(),
        })
    }

    handleSaveNewSpecialty = async () =>{
        console.log('check state: ', this.state);
        
        let res = await handleCreateHandbook(this.state);
        if(res && res.errCode === 0){
            toast.success('Add new specialty succeed!');
            this.setState({
                name: '',
                author: '',
                datePublish: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        }else{
            toast.error(res.errMessage) ;
            console.log('chech state specialty: ', this.state);
        } 
    }

    render() {
        let { language } = this.props;
        

        return (
            <>
                <div className='manage-handbook-container'>
                    <div className='ms-title'>Quản lý cẩm nang</div>
                    
                    <div className='add-new-handbook row'>
                        <div className='col-6 form-group mb-3'>
                            <label className='mb-2' htmlFor="">Tên cẩm nang</label>
                            <input 
                                className='form-control' 
                                type='text'
                                value={this.state.name}
                                onChange={(event)=> this.handleOnChangeInput(event, 'name')}
                            />
                        </div>
                        <div className='img-upload col-6 form-group mb-3'>
                            <label htmlFor="" className='mb-2'>Ảnh cẩm nang</label>
                            <input 
                                className='form-control-file' 
                                type='file' 
                                onChange={(event) => this.handleOnChangeImage(event)}
                            />
                        </div>
                        <div className='col-6 form-group mb-3'>
                            <label className='mb-2' htmlFor="">Tên tác giả</label>
                            <input 
                                className='form-control' 
                                type='text'
                                value={this.state.author}
                                onChange={(event)=> this.handleOnChangeInput(event, 'author')}
                            />
                        </div>
                        <div className='col-6 form-group mb-3'>
                            <label className='mb-2' htmlFor="">Ngày đăng tải</label>
                                <DatePicker
                                    className="form-control"
                                    onChange={this.handleOnchangeDatePicker}
                                    value={new Date()}
                                    
                                />
                                {/* <input 
                                    className='form-control' 
                                    type='text'
                                    value={this.state.datePublish}
                                    onChange={(event)=> this.handleOnChangeInput(event, 'datePublish')}
                                /> */}
                        </div>
                        <div className='col-12 form-group'>
                            <MdEditor 
                                style={{ height: '400px' }} 
                                renderHTML={text => mdParser.render(text)} 
                                onChange={this.handleEditorChange}
                                value={this.state.descriptionMarkdown}
                            />
                        </div>
                        <div className='col-12'>
                            <button 
                                className='btn-save-handbook'
                                onClick={() => this.handleSaveNewSpecialty()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </> 
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageHandbook);
