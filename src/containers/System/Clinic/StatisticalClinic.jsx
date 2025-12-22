// src/containers/System/Statistical/StatisticalClinic.jsx
import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./StatisticalClinic.scss";

import { handleGetStatisticalBookingByDate } from "../../../services/patientService";
import { getAllClinicService } from "../../../services/clinicService";
import { FormattedMessage } from "react-intl";

class StatisticalClinic extends Component {
  constructor(props) {
    super(props);
    const today = new Date();

    this.state = {
      clinics: [],
      clinicMap: {},

      totalClinic: 0,
      totalBookingToday: 0,
      totalCancelToday: 0,

      selectedDate: this.formatDateInput(today),
      todayByClinic: [],

      isLoadingClinics: false,
      isLoadingToday: false,
      error: "",
    };
  }

  async componentDidMount() {
    await this.fetchClinics();
    await this.fetchTodayByClinic();
  }

  safePayload = (res) => {
    if (!res) return null;
    if (res.data && (res.data.errCode !== undefined || res.data.data !== undefined)) return res.data;
    if (res.errCode !== undefined || res.data !== undefined) return res;
    return res;
  };

  pad2 = (n) => String(n).padStart(2, "0");

  formatDateInput = (d) => {
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = this.pad2(date.getMonth() + 1);
    const dd = this.pad2(date.getDate());
    return `${yyyy}-${mm}-${dd}`;
  };

  parseDateInputToMsStartOfDay = (value) => {
    const [yyyy, mm, dd] = value.split("-").map((x) => Number(x));
    const d = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    return d.getTime();
  };

  fetchClinics = async () => {
    this.setState({ isLoadingClinics: true, error: "" });
    try {
      const res = await getAllClinicService();
      const payload = this.safePayload(res);

      if (payload && payload.errCode === 0) {
        const clinics = payload.data || [];
        const clinicMap = clinics.reduce((acc, c) => {
          acc[Number(c.id)] = c.name || `Phòng khám ${c.id}`;
          return acc;
        }, {});

        this.setState({
          clinics,
          clinicMap,
          totalClinic: clinics.length,
        });
      } else {
        this.setState({ clinics: [], clinicMap: {}, totalClinic: 0 });
      }
    } catch (e) {
      console.log(e);
      this.setState({ error: "Failed to load clinics" });
    } finally {
      this.setState({ isLoadingClinics: false });
    }
  };

  fetchTodayByClinic = async () => {
    this.setState({ isLoadingToday: true, error: "" });
    try {
      const { selectedDate, clinicMap } = this.state;
      const dateMs = this.parseDateInputToMsStartOfDay(selectedDate);

      const res = await handleGetStatisticalBookingByDate({ date: dateMs });
      const payload = this.safePayload(res);

      if (payload && payload.errCode === 0) {
        const rows = payload.data || [];

        const base = Object.keys(clinicMap).map((id) => ({
          clinicId: Number(id),
          clinicName: clinicMap[id] || `Phòng khám ${id}`,
          complete: 0,
          cancel: 0,
          total: 0,
        }));

        const map = new Map(base.map((x) => [x.clinicId, x]));

        rows.forEach((r) => {
          const clinicId = Number(r.clinicId);
          const complete = Number(r.countComplete || 0);
          const cancel = Number(r.countCancel || 0);

          const item = map.get(clinicId) || {
            clinicId,
            clinicName: clinicMap[clinicId] || `Phòng khám ${clinicId}`,
            complete: 0,
            cancel: 0,
            total: 0,
          };

          item.complete = complete;
          item.cancel = cancel;
          item.total = complete + cancel;

          map.set(clinicId, item);
        });

        const todayByClinic = Array.from(map.values()).sort((a, b) => a.clinicId - b.clinicId);

        const totalBookingToday = todayByClinic.reduce((sum, x) => sum + x.complete, 0);
        const totalCancelToday = todayByClinic.reduce((sum, x) => sum + x.cancel, 0);

        this.setState({
          todayByClinic,
          totalBookingToday,
          totalCancelToday,
        });
      } else {
        this.setState({
          todayByClinic: [],
          totalBookingToday: 0,
          totalCancelToday: 0,
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        error: "Failed to load daily stats",
        todayByClinic: [],
        totalBookingToday: 0,
        totalCancelToday: 0,
      });
    } finally {
      this.setState({ isLoadingToday: false });
    }
  };

  onChangeSelectedDate = (e) => {
    this.setState({ selectedDate: e.target.value }, () => {
      this.fetchTodayByClinic();
    });
  };

  onClickRefresh = () => {
    this.fetchTodayByClinic();
  };

  renderCustomTooltip = (props) => {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const complete = payload.find((p) => p.dataKey === "complete")?.value || 0;
    const cancel = payload.find((p) => p.dataKey === "cancel")?.value || 0;

    return (
      <div className="bh-tooltip">
        <div className="bh-tooltip-title">{label}</div>
        <div><FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-completed"/>: {complete} <FormattedMessage id="admin.manage-clinic.clinic-statistical.calendar"/></div>
        <div><FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-canceled"/>: {cancel} <FormattedMessage id="admin.manage-clinic.clinic-statistical.calendar"/></div>
      </div>
    );
  };

  render() {
    const {
      totalClinic,
      totalBookingToday,
      totalCancelToday,
      selectedDate,
      todayByClinic,
      isLoadingToday,
      error,
    } = this.state;

    const displayDate = selectedDate.split("-").reverse().join("/");

    return (
      <div className="stat-clinic-dashboard">
        <div className="dashboard-header">
          <div>
            <div className="dashboard-title"><FormattedMessage id="admin.manage-clinic.clinic-statistical.title"/></div>
            <div className="dashboard-subtitle">
              <FormattedMessage id="admin.manage-clinic.clinic-statistical.subtitle"/>
            </div>
          </div>

          <div className="dashboard-header-right">
            <div className="filter-item">
              <label className="filter-label"><FormattedMessage id="admin.manage-clinic.clinic-statistical.filter"/></label>
              <input
                className="bh-date-input"
                type="date"
                value={selectedDate}
                onChange={this.onChangeSelectedDate}
              />
            </div>

            <button type="button" className="btn-dashboard-tag" onClick={this.onClickRefresh}>
              <FormattedMessage id="admin.manage-clinic.clinic-statistical.refresh"/>
            </button>
          </div>
        </div>

        {error && <div className="stat-clinic-error">{error}</div>}

        <div className="dashboard-metrics-row metrics-3">
          <div className="metric-card">
            <div className="metric-icon clinics">
              <i className="fa-solid fa-hospital" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.manage-clinic.clinic-statistical.total-clinic"/></div>
            <div className="metric-value">{totalClinic}</div>
            <div className="metric-desc"><FormattedMessage id="admin.manage-clinic.clinic-statistical.total-clinic-desc"/></div>
          </div>

          <div className="metric-card">
            <div className="metric-icon finished">
              <i className="fa-regular fa-circle-check" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.manage-clinic.clinic-statistical.total-booking-completed"/></div>
            <div className="metric-value">{totalBookingToday}</div>
            <div className="metric-desc"><FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-date"/> {displayDate}</div>
          </div>

          <div className="metric-card">
            <div className="metric-icon cancelled">
              <i className="fa-regular fa-circle-xmark" />
            </div>
            <div className="metric-label"><FormattedMessage id="admin.manage-clinic.clinic-statistical.total-booking-canceled"/></div>
            <div className="metric-value">{totalCancelToday}</div>
            <div className="metric-desc"><FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-date"/> {displayDate}</div>
          </div>
        </div>

        <div className="dashboard-main">
          <div className="dashboard-section wide">
            <div className="section-header">
              <div>
                <h3><FormattedMessage id="admin.manage-clinic.clinic-statistical.header-h3"/></h3>
                <p><FormattedMessage id="admin.manage-clinic.clinic-statistical.header-p"/> {displayDate}.</p>
              </div>
            </div>

            <div className="section-body chart-body-lg">
              {isLoadingToday ? (
                <div className="loading"><FormattedMessage id="admin.manage-clinic.clinic-statistical.loading"/></div>
              ) : todayByClinic.length === 0 ? (
                <div className="no-data"><FormattedMessage id="admin.manage-clinic.clinic-statistical.no-data"/></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={todayByClinic} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="clinicName"
                      interval={0}
                      height={90}
                      tick={{ fontSize: 12 }}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={this.renderCustomTooltip} />
                    <Legend
                      verticalAlign="bottom"
                      height={32}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Bar dataKey="complete" name={<FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-completed"/>} fill="#22c55e" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="cancel" name={<FormattedMessage id="admin.manage-clinic.clinic-statistical.booking-canceled"/>} fill="#fb923c" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatisticalClinic;
