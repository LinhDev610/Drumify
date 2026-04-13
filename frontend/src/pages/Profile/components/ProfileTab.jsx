import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Profile.module.scss';
import CloudinaryImage from '../../../component/Common/CloudinaryImage';
import defaultAvatar from '../../../assets/images/default-avatar.png';

const ProfileTab = ({
    profileData,
    isEditing,
    setIsEditing,
    handleSave,
    saving,
    handleChange,
    profileErrors,
    handleAvatarClick
}) => {
    const { t } = useTranslation();
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>{t('profile.info.title')}</h2>
                <p className={styles.tabSubtitle}>{t('profile.info.subtitle')}</p>
            </div>
            <div className={styles.profileContent}>
                <div className={styles.headerCard}>
                    <div className={styles.headerContent}>
                        <div
                            className={`${styles.avatarWrapper} ${isEditing ? styles.editable : ''}`}
                            onClick={handleAvatarClick}
                        >
                            {profileData.avatarUrl ? (
                                <CloudinaryImage
                                    publicId={profileData.avatarUrl}
                                    type="avatar"
                                    width={120}
                                    height={120}
                                    className={styles.avatarImg}
                                />
                            ) : (
                                <img
                                    src={defaultAvatar}
                                    alt="Default Avatar"
                                    className={styles.avatarImg}
                                />
                            )}
                            {isEditing && <div className={styles.editOverlay}>{t('profile.general.update')}</div>}
                        </div>
                        <div className={styles.nameSection}>
                            <h1 className={styles.fullName}>{profileData.fullName || 'Drumify User'}</h1>
                            <p className={styles.emailText}>{profileData.email}</p>
                            <span className={styles.badge}>{t('profile.general.member_since')} 2026</span>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        {!isEditing ? (
                            <button className={styles.mainActionBtn} onClick={() => setIsEditing(true)}>
                                {t('profile.general.edit')}
                            </button>
                        ) : (
                            <div className={styles.btnGroup}>
                                <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>{t('profile.general.cancel')}</button>
                                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                    {saving ? t('profile.general.saving') : t('profile.general.save')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>{t('profile.info.account_title')}</h2>
                        <div className={styles.fieldGroup}>
                            <div className={styles.inputBox}>
                                <label>{t('profile.info.username')}</label>
                                <input value={profileData.username} disabled className={styles.disabledInput} />
                            </div>
                            <div className={styles.inputBox}>
                                <label>{t('profile.info.email')}</label>
                                <input value={profileData.email} disabled className={styles.disabledInput} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>{t('profile.info.personal_title')}</h2>
                        <div className={styles.fieldGroup}>
                             <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>{t('profile.info.firstName')}</label>
                                    <input name="firstName" value={profileData.firstName || ''} onChange={handleChange} disabled={!isEditing} maxLength={50} />
                                    {isEditing && profileErrors.firstName && <span className={styles.error}>{profileErrors.firstName}</span>}
                                </div>
                                 <div className={styles.inputBox}>
                                    <label>{t('profile.info.lastName')}</label>
                                    <input name="lastName" value={profileData.lastName || ''} onChange={handleChange} disabled={!isEditing} maxLength={50} />
                                    {isEditing && profileErrors.lastName && <span className={styles.error}>{profileErrors.lastName}</span>}
                                </div>
                            </div>
                             <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>{t('profile.info.phone')}</label>
                                    <input name="phoneNumber" value={profileData.phoneNumber || ''} onChange={handleChange} disabled={!isEditing} maxLength={11} />
                                    {isEditing && profileErrors.phoneNumber && <span className={styles.error}>{profileErrors.phoneNumber}</span>}
                                </div>
                                 <div className={styles.inputBox}>
                                    <label>{t('profile.info.dob')}</label>
                                    <input type="date" name="dob" value={profileData.dob || ''} onChange={handleChange} disabled={!isEditing} />
                                    {isEditing && profileErrors.dob && <span className={styles.error}>{profileErrors.dob}</span>}
                                </div>
                                 <div className={styles.inputBox}>
                                    <label>{t('profile.info.gender')}</label>
                                    <select name="sex" value={profileData.sex ?? true} onChange={e => handleChange({ target: { name: 'sex', value: e.target.value === 'true' } })} disabled={!isEditing}>
                                        <option value="true">{t('profile.info.male')}</option>
                                        <option value="false">{t('profile.info.female')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
