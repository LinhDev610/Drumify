import React from 'react';
import styles from '../Profile.module.scss';

const SecurityTab = ({ 
    passwordForm, 
    handlePasswordInputChange, 
    submitPasswordChange, 
    passwordError, 
    changingPassword,
    username
}) => {
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Đổi mật khẩu</h2>
                <p className={styles.tabSubtitle}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
            </div>
            <form
                className={styles.securityForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    submitPasswordChange();
                }}
            >
                <input
                    type="text"
                    name="username"
                    value={username}
                    autoComplete="username"
                    style={{ display: 'none' }}
                    readOnly
                />

                <div className={styles.inputBox}>
                    <label>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="********"
                        autoComplete="current-password"
                    />
                </div>
                <div className={styles.inputBox}>
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="********"
                        autoComplete="new-password"
                    />
                </div>
                <div className={styles.inputBox}>
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="********"
                        autoComplete="new-password"
                    />
                </div>
                {passwordError && <p className={styles.error} style={{ marginTop: '10px' }}>{passwordError}</p>}
                <button
                    type="submit"
                    className={styles.saveBtn}
                    style={{ marginTop: '20px', width: 'fit-content' }}
                    disabled={changingPassword}
                >
                    {changingPassword ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
            </form>
        </div>
    );
};

export default SecurityTab;
