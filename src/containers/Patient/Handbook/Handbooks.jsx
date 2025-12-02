import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './Handbooks.scss'

class Handbooks extends Component {
    
    constructor(props){
        super(props);
        this.state = {

        }
    }

    async componentDidMount(){
     
    }

    async componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.language !== prevProps.language){
            
        }
    }

    render() {
        let { language } = this.props;

        return (
            <>
                <div className='container'>
                    Handbooks
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

export default connect(mapStateToProps, mapDispatchToProps)(Handbooks);
