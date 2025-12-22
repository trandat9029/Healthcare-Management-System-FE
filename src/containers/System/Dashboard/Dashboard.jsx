import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "../../../components/Input/DatePicker";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Dashboard.scss";
import {
  getAllDoctorsService,
  getAllPatientsService,
  getTopDoctorHomeService,
} from "../../../services/doctorService";
import { getAllSpecialtyService } from "../../../services/specialtyService";
import { getAllClinicService } from "../../../services/clinicService";
import { handleGetAllHandbook } from "../../../services/handbookService";
import {
  handleGetStatisticalBooking,
  handleGetPatientByClinic,
} from "../../../services/patientService";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      totalDoctor: "",
      totalPatient: "",
      totalSpecialty: "",
      totalClinic: "",
      totalHandbook: "",

      bookingStatusData: [],

      clinicOptions: [],
      patientByClinicMonthly: [],
      currentMonthLabel: "",

      topDoctors: [],
      specialtyNameMap: new Map(),
    };
  }

  async componentDidMount() {
    await this.fecthTotalData();
    await this.loadSpecialtyMap();
    this.fecthStatisticalBookingData();
    this.fecthPatientByClinic();
    this.fecthTopDoctors();
  }

  handleOnchangeDatePicker = (date) => {
    this.setState({ selectedDate: date });
  };

  getCurrentMonthLabel = () => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = String(now.getFullYear());
    return `${mm}/${yyyy}`;
  };

  fecthTotalData = async () => {
    const resDoctor = await getAllDoctorsService();
    const resPatient = await getAllPatientsService();
    const resSpecialty = await getAllSpecialtyService();
    const resClinic = await getAllClinicService();
    const resHandbook = await handleGetAllHandbook();

    const clinicOptions = (resClinic?.data || resClinic?.clinics || []).map(
      (c) => ({
        id: c.id,
        name: c.name,
      })
    );

    this.setState({
      totalDoctor: resDoctor.total,
      totalPatient: resPatient.total,
      totalSpecialty: resSpecialty.total,
      totalClinic: resClinic.total,
      totalHandbook: resHandbook.total,
      clinicOptions,
    });
  };

  fecthStatisticalBookingData = async () => {
    const res = await handleGetStatisticalBooking();
    if (res && res.errCode === 0) {
      this.setState({
        bookingStatusData: res.data,
      });
    }
  };

  loadSpecialtyMap = async () => {
    const res = await getAllSpecialtyService({ limit: "ALL" });

    const list = res?.data || res?.specialties || res?.resSpecialty || [];
    const map = new Map((list || []).map((s) => [Number(s.id), s.name]));

    this.setState({ specialtyNameMap: map });
  };

  fecthTopDoctors = async () => {
    try {
      const res = await getTopDoctorHomeService(5);
      
      if (res && res.errCode === 0) {
        const { specialtyNameMap } = this.state;
        const { language } =this.props;
                     
        const topDoctors = (res.data || []).map((d) => {
          const position = language === LANGUAGES.VI ? d.positionData.valueVi : d.positionData.valueEn;
          const fullName = `${position} ${d.firstName || ""} ${d.lastName || ""}`.trim();

          const specialtyId = Number(d.doctorInfoData?.specialtyId || 0);
          const specialtyName =
            specialtyNameMap.get(specialtyId) || "Chuyên khoa";

          return {
            id: d.id,
            name: fullName || `Bác sĩ ${d.id}`,
            specialty: specialtyName,
            count: Number(d.monthCompleteCount || 0),
            image: d.image || null,
          };
        });

        this.setState({ topDoctors });
      }
    } catch (e) {
      console.log(e);
    }
  };

  fecthPatientByClinic = async () => {
    const res = await handleGetPatientByClinic(); // lấy tất cả phòng khám

    if (res && res.errCode === 0) {
      const clinicNameMap = new Map(
        this.state.clinicOptions.map((c) => [Number(c.id), c.name])
      );

      const formatted = (res.data || []).map((item) => {
        const clinicId = Number(item.clinicId);
        return {
          clinicId,
          name: clinicNameMap.get(clinicId) || `Phòng khám ${clinicId}`,
          month: item.month,
          countComplete: Number(item.countComplete || 0),
        };
      });

      // sắp xếp giảm dần theo số ca đã khám
      formatted.sort((a, b) => b.countComplete - a.countComplete);

      this.setState({
        patientByClinicMonthly: formatted,
        currentMonthLabel: formatted?.[0]?.month || this.getCurrentMonthLabel(),
      });
    }
  };

  render() {
    const {
      selectedDate,
      totalDoctor,
      totalPatient,
      totalSpecialty,
      totalClinic,
      totalHandbook,
      bookingStatusData,
      patientByClinicMonthly,
      currentMonthLabel,
      topDoctors,
    } = this.state;

    const { language } = this.props

    const formattedDate = selectedDate
      ? new Date(selectedDate).toLocaleDateString("vi-VN")
      : "";

    const renderBookingTooltip = (props) => {
      const { active, payload, label } = props;
      if (!active || !payload || !payload.length) return null;

      return (
        <div className="bh-tooltip">
          <div className="bh-tooltip-title"><FormattedMessage id="admin.dashboard.dashboard-month" /> {label}</div>
          {payload.map((item) => (
            <div key={item.dataKey} className="bh-tooltip-row">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: item.color,
                  display: "inline-block",
                }}
              />
              <span>
                {item.name}: {item.value} <FormattedMessage id="admin.dashboard.dashboard-calendar" /> 
              </span>
            </div>
          ))}
        </div>
      );
    };

    const renderClinicTooltip = (props) => {
      const { active, payload, label } = props;
      if (!active || !payload || !payload.length) return null;

      const complete = payload[0]?.value || 0;

      return (
        <div className="bh-tooltip">
          <div className="bh-tooltip-title">{label}</div>
          <div><FormattedMessage id="admin.dashboard.dashboard-booked" />: {complete} <FormattedMessage id="admin.dashboard.dashboard-calendar" /></div>
        </div>
      );
    };

    return (
      <div className="dashboard-page">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title"><FormattedMessage id="admin.dashboard.dashboard-title" /></div>
            <div className="dashboard-subtitle">
              <FormattedMessage id="admin.dashboard.dashboard-subtitle" /> 
            </div>
          </div>

          <div className="dashboard-header-right">
            <div className="filter-item">
              <label className="filter-label"><FormattedMessage id="admin.dashboard.dashboard-date" /> </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnchangeDatePicker}
                value={selectedDate}
              />
            </div>

            <button type="button" className="btn-dashboard-tag">
              <FormattedMessage id="admin.dashboard.dashboard-tag" />
            </button>
          </div>
        </div>

        <div className="dashboard-metrics-row">
          <div className="metric-card">
            <div className="metric-icon doctors">
              <i className="fa-solid fa-user-doctor" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.dashboard.dashboard-total-doctor" /></div>
            <div className="metric-value">{totalDoctor}</div>
            <div className="metric-desc"><FormattedMessage id="admin.dashboard.dashboard-total-doctor-desc" /></div>
          </div>

          <div className="metric-card">
            <div className="metric-icon patients">
              <i className="fa-solid fa-users" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.dashboard.dashboard-total-patient" /></div>
            <div className="metric-value">{totalPatient}</div>
            <div className="metric-desc"><FormattedMessage id="admin.dashboard.dashboard-total-patient-desc" /></div>
          </div>

          <div className="metric-card">
            <div className="metric-icon specialties">
              <i className="fa-solid fa-stethoscope" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.dashboard.dashboard-total-specialty" /></div>
            <div className="metric-value">{totalSpecialty}</div>
            <div className="metric-desc"><FormattedMessage id="admin.dashboard.dashboard-total-specialty-desc" /></div>
          </div>

          <div className="metric-card">
            <div className="metric-icon clinics">
              <i className="fa-solid fa-hospital" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.dashboard.dashboard-total-clinic" /></div>
            <div className="metric-value">{totalClinic}</div>
            <div className="metric-desc">
              <FormattedMessage id="admin.dashboard.dashboard-total-clinic-desc" />
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon posts">
              <i className="fa-regular fa-newspaper" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.dashboard.dashboard-total-handbook" /></div>
            <div className="metric-value">{totalHandbook}</div>
            <div className="metric-desc"><FormattedMessage id="admin.dashboard.dashboard-total-handbook-desc" /></div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-section wide">
            <div className="section-header">
              <div>
                <h3><FormattedMessage id="admin.dashboard.dashboard-header-h3" /></h3>
                <p><FormattedMessage id="admin.dashboard.dashboard-header-p" /></p>
              </div>
              <button type="button" className="btn-small-secondary">
                <FormattedMessage id="admin.dashboard.dashboard-header-button" />
              </button>
            </div>

            <div className="section-body chart-body-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bookingStatusData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorConfirmed"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#86efac" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                    <linearGradient
                      id="colorFinished"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={renderBookingTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />

                  <Bar
                    dataKey="confirmed"
                    name="Đã xác nhận"
                    stackId="status"
                    fill="url(#colorConfirmed)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="finished"
                    name="Đã khám xong"
                    stackId="status"
                    fill="url(#colorFinished)"
                  />
                  <Bar
                    dataKey="pending"
                    name="Chờ xác nhận"
                    stackId="status"
                    fill="#fbbf24"
                  />
                  <Bar
                    dataKey="cancelled"
                    name="Hủy"
                    stackId="status"
                    fill="#fb923c"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-lower">
            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h3><FormattedMessage id="admin.dashboard.dashboard-lower-h3" /></h3>
                  <p>
                    <FormattedMessage id="admin.dashboard.dashboard-lower-p" />{" "}
                    {currentMonthLabel}
                  </p>
                </div>
              </div>

              <div className="section-body chart-body-md">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={patientByClinicMonthly}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#e5e7eb" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      width={140}
                    />
                    <Tooltip content={renderClinicTooltip} />
                    <Legend
                      verticalAlign="bottom"
                      height={28}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar
                      dataKey="countComplete"
                      name="Đã khám xong"
                      fill="#22c55e"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <div>
                  <h3><FormattedMessage id="admin.dashboard.dashboard-doctor-outStanding-header" /></h3>
                  <p><FormattedMessage id="admin.dashboard.dashboard-doctor-outStanding-header" /></p>
                </div>
              </div>

              <div className="section-body doctor-section-body">
                <ul className="doctor-ranking">
                  {(topDoctors || []).map((doctor, index) => (
                    <li key={doctor.id}>
                      <div className="rank-badge">{index + 1}</div>

                      <div className="doctor-info">
                        <div className="name">{language === LANGUAGES.VI ? doctor.positionData?.valueVi : doctor.positionData?.valueEn} {doctor.name}</div>
                        <div className="meta">{doctor.specialty}</div>
                      </div>

                      <div className="count-tag">{doctor.count} <FormattedMessage id="admin.dashboard.dashboard-count" /></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ language: state.app.language });
export default connect(mapStateToProps)(Dashboard);
