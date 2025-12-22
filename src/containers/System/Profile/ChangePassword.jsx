import React, { useEffect, useState } from 'react';
import './ChangePassword.scss';
import { handleChangePassword } from '../../../services/userService';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

const ChangePassword = ({ isOpen, onClose, doctorId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');

    if (!doctorId) {
      setError('Không xác định được tài khoản');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);

      const res = await handleChangePassword({
        id: doctorId,
        currentPassword,
        newPassword,
      });

      if (res && res.errCode === 0) {
        toast.success('Đổi mật khẩu thành công');
        onClose();
      } else {
        toast.error('Đổi mật khẩu thất bại');
      }
    } catch (e) {
      toast.error('Đổi mật khẩu thất bại');
      console.log('change password error', e);
      setError('Lỗi từ server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpw-overlay" onClick={onClose}>
      <div className="cpw-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cpw-header">
          <span className="cpw-title"><FormattedMessage id="admin.doctor.manage-profile.profile-password.title" /></span>
          <button className="cpw-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cpw-body">
          {error ? <div className="cpw-error">{error}</div> : null}

          <div className="cpw-field">
            <label><FormattedMessage id="admin.doctor.manage-profile.profile-password.current-password" /></label>
            <div className="cpw-input-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={`cpw-eye ${showCurrent ? 'active' : ''}`}
                onClick={() => setShowCurrent((v) => !v)}
                disabled={loading}
              >
                <i className={showCurrent ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>

          <div className="cpw-field">
            <label><FormattedMessage id="admin.doctor.manage-profile.profile-password.new-password" /></label>
            <div className="cpw-input-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={`cpw-eye ${showNew ? 'active' : ''}`}
                onClick={() => setShowNew((v) => !v)}
                disabled={loading}
              >
                <i className={showNew ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>

          <div className="cpw-field">
            <label><FormattedMessage id="admin.doctor.manage-profile.profile-password.confirm-password" /></label>
            <div className="cpw-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className={`cpw-eye ${showConfirm ? 'active' : ''}`}
                onClick={() => setShowConfirm((v) => !v)}
                disabled={loading}
              >
                <i className={showConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>
        </div>

        <div className="cpw-footer">
          <button
            type="button"
            className="cpw-btn cpw-btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <FormattedMessage id="admin.doctor.manage-profile.profile-password.saving" /> : <FormattedMessage id="admin.doctor.manage-profile.profile-password.save-password" />}
          </button>
          <button
            type="button"
            className="cpw-btn cpw-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            <FormattedMessage id="admin.doctor.manage-profile.profile-password.cancel" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
