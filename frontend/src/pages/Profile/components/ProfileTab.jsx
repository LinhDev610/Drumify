import React from 'react';
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
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Hồ sơ của tôi</h2>
                <p className={styles.tabSubtitle}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
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
                            {isEditing && <div className={styles.editOverlay}>Cập nhật</div>}
                        </div>
                        <div className={styles.nameSection}>
                            <h1 className={styles.fullName}>{profileData.fullName || 'Drumify User'}</h1>
                            <p className={styles.emailText}>{profileData.email}</p>
                            <span className={styles.badge}>Member Since 2026</span>
                        </div>
                    </div>
                    <div className={styles.headerActions}>
                        {!isEditing ? (
                            <button className={styles.mainActionBtn} onClick={() => setIsEditing(true)}>
                                Sửa hồ sơ
                            </button>
                        ) : (
                            <div className={styles.btnGroup}>
                                <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Hủy</button>
                                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Tài khoản</h2>
                        <div className={styles.fieldGroup}>
                            <div className={styles.inputBox}>
                                <label>Tên đăng nhập</label>
                                <input value={profileData.username} disabled className={styles.disabledInput} />
                            </div>
                            <div className={styles.inputBox}>
                                <label>Email</label>
                                <input value={profileData.email} disabled className={styles.disabledInput} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Thông tin cá nhân</h2>
                        <div className={styles.fieldGroup}>
                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Họ</label>
                                    <input name="firstName" value={profileData.firstName || ''} onChange={handleChange} disabled={!isEditing} maxLength={50} />
                                    {isEditing && profileErrors.firstName && <span className={styles.error}>{profileErrors.firstName}</span>}
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Tên</label>
                                    <input name="lastName" value={profileData.lastName || ''} onChange={handleChange} disabled={!isEditing} maxLength={50} />
                                    {isEditing && profileErrors.lastName && <span className={styles.error}>{profileErrors.lastName}</span>}
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Số điện thoại</label>
                                    <input name="phoneNumber" value={profileData.phoneNumber || ''} onChange={handleChange} disabled={!isEditing} maxLength={11} />
                                    {isEditing && profileErrors.phoneNumber && <span className={styles.error}>{profileErrors.phoneNumber}</span>}
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Ngày sinh</label>
                                    <input type="date" name="dob" value={profileData.dob || ''} onChange={handleChange} disabled={!isEditing} />
                                    {isEditing && profileErrors.dob && <span className={styles.error}>{profileErrors.dob}</span>}
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Giới tính</label>
                                    <select name="sex" value={profileData.sex ?? true} onChange={e => handleChange({ target: { name: 'sex', value: e.target.value === 'true' } })} disabled={!isEditing}>
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>
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
