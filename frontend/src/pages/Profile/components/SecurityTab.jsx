import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Profile.module.scss';

const SecurityTab = ({ 
    passwordForm, 
    handlePasswordInputChange, 
    submitPasswordChange, 
    passwordError, 
    changingPassword,
    username
}) => {
    const { t } = useTranslation();
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>{t('profile.security.title')}</h2>
                <p className={styles.tabSubtitle}>{t('profile.security.subtitle')}</p>
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
                    <label>{t('profile.security.current_password')}</label>
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
                    <label>{t('profile.security.new_password')}</label>
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
                    <label>{t('profile.security.confirm_new_password')}</label>
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
                    {changingPassword ? t('profile.security.confirming') : t('profile.general.confirm')}
                </button>
            </form>
        </div>
    );
};

export default SecurityTab;
