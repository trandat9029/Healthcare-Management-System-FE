import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './Specialties.scss';
import { getAllSpecialtyService } from '../../../services/userService';
import { withRouter } from 'react-router';

class Specialties extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allSpecialties: [],
            keyword: ""
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialtyService({ limit: "ALL" }); // lấy toàn bộ
        if (res && res.errCode === 0) {
            this.setState({
                allSpecialties: res.specialties ? res.specialties : []
            });
        }
    }

    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    };

    render() {
        let { allSpecialties, keyword } = this.state;

        // Lọc theo từ khóa
        let filtered = allSpecialties.filter(item =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
        );

        return (
            <div className="specialties-page">
                
                {/* ==== Breadcrumb ==== */}
                <div className="breadcrumb">
                    <i className="fa-solid fa-house"></i> / Khám Chuyên khoa
                </div>

                {/* ==== Ô tìm kiếm ==== */}
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm tên chuyên khoa"
                        value={keyword}
                        onChange={(e) => this.setState({ keyword: e.target.value })}
                    />
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                {/* ==== Lưới chuyên khoa ==== */}
                <div className="specialty-grid">
                    {filtered.length > 0 &&
                        filtered.map((item, index) => (
                            <div
                                key={index}
                                className="specialty-item"
                                onClick={() => this.handleViewDetail(item)}
                            >
                                <div className="specialty-image"
                                    style={{ backgroundImage: `url(${item.image})` }}>
                                </div>
                                <div className="specialty-name">{item.name}</div>
                            </div>
                        ))}
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default withRouter(connect(mapStateToProps)(Specialties));
