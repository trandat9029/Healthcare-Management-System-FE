// src/containers/System/Profile/ChangePasswordModal.js
import React, { useState } from 'react';
import './ChangePassword.scss';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({
        currentPassword,
        newPassword,
        confirmPassword,
      });
    }
  };

  return (
    <div className="cpw-overlay" onClick={onClose}>
      <div
        className="cpw-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cpw-header">
          <span className="cpw-title">Đổi mật khẩu</span>
          <button className="cpw-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="cpw-body">
          {/* Hàng 1 */}
          <div className="cpw-field">
            <label>Mật khẩu hiện tại</label>
            <div className="cpw-input-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className={`cpw-eye ${showCurrent ? 'active' : ''}`}
                onClick={() => setShowCurrent((v) => !v)}
              >
                <i className={showCurrent ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>

          {/* Hàng 2 */}
          <div className="cpw-field">
            <label>Mật khẩu mới</label>
            <div className="cpw-input-wrap">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={`cpw-eye ${showNew ? 'active' : ''}`}
                onClick={() => setShowNew((v) => !v)}
              >
                <i className={showNew ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>

          {/* Hàng 3 */}
          <div className="cpw-field">
            <label>Nhập lại mật khẩu mới</label>
            <div className="cpw-input-wrap">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className={`cpw-eye ${showConfirm ? 'active' : ''}`}
                onClick={() => setShowConfirm((v) => !v)}
              >
                <i className={showConfirm ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye'} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="cpw-footer">
          <button
            type="button"
            className="cpw-btn cpw-btn-primary"
            onClick={handleSubmit}
          >
            Lưu mật khẩu
          </button>
          <button
            type="button"
            className="cpw-btn cpw-btn-secondary"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
