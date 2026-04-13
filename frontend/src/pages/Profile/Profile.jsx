import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Profile.module.scss';
import { useKeycloakAuth } from '../../context/KeycloakAuthContext';
import {
    getMyProfile,
    updateMyProfile,
    getProvinces,
    getDistricts,
    getWards,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    changePassword
} from '../../services/userService';
import { useProfile } from '../../context/ProfileContext';
import { uploadToCloudinary } from '../../services/imageService';
import SetAvatarDialog from '../../component/Profile/SetAvatarDialog';
import CloudinaryImage from '../../component/Common/CloudinaryImage';
import { useSearchParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LockIcon from '@mui/icons-material/Lock';

import ProfileTab from './components/ProfileTab';
import AddressManager from './components/AddressManager';
import OrdersTab from './components/OrdersTab';
import VoucherTab from './components/VoucherTab';
import SecurityTab from './components/SecurityTab';

const Profile = () => {
    const { t } = useTranslation();
    const { tokenParsed } = useKeycloakAuth();
    const { refreshProfile } = useProfile();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';
    const [voucherTab, setVoucherTab] = useState('vouchers');
    const [orderTab, setOrderTab] = useState('all');

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Avatar states
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    // Password states
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        fullName: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        avatarUrl: '',
        dob: '',
        sex: true,
        addresses: []
    });

    // Address & Location states
    const [addresses, setAddresses] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [addressForm, setAddressForm] = useState({
        recipientName: '',
        recipientPhoneNumber: '',
        provinceID: '',
        provinceName: '',
        districtID: '',
        districtName: '',
        wardCode: '',
        wardName: '',
        address: '',
        defaultAddress: false
    });

    const [profileErrors, setProfileErrors] = useState({});
    const [addressErrors, setAddressErrors] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                let baseData = {};
                if (tokenParsed) {
                    baseData = {
                        username: tokenParsed.preferred_username || '',
                        email: tokenParsed.email || '',
                        firstName: tokenParsed.given_name || '',
                        lastName: tokenParsed.family_name || '',
                        fullName: tokenParsed.name || `${tokenParsed.given_name || ''} ${tokenParsed.family_name || ''}`.trim()
                    };
                    setProfileData(prev => ({ ...prev, ...baseData }));
                }

                await Promise.allSettled([
                    getMyProfile().then(res => {
                        if (res.data?.result) {
                            const dbData = res.data.result;
                            setProfileData(prev => {
                                const merged = { ...prev, ...dbData, sex: dbData.sex ?? prev.sex };
                                if (!merged.fullName && (merged.firstName || merged.lastName)) {
                                    merged.fullName = `${merged.firstName || ''} ${merged.lastName || ''}`.trim();
                                }
                                return merged;
                            });
                            if (dbData.addresses) setAddresses(dbData.addresses);
                        }
                    }).catch(err => console.error("Error fetching profile:", err)),

                    getProvinces().then(res => {
                        if (res.data?.result) {
                            setProvinces(res.data.result);
                        }
                    }).catch(err => console.error("Error fetching provinces:", err))
                ]);

            } catch (error) {
                console.error("Error in fetchInitialData:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [tokenParsed]);

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        const provinceName = provinces.find(p => String(p.ProvinceID) === String(provinceId))?.ProvinceName || '';

        setAddressForm(prev => ({ ...prev, provinceID: provinceId, provinceName, districtID: '', districtName: '', wardCode: '', wardName: '' }));

        if (provinceId) {
            try {
                const response = await getDistricts(provinceId);
                setDistricts(response.data.result || []);
                setWards([]);
            } catch (error) { console.error("Error fetching districts:", error); }
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        const districtName = districts.find(d => String(d.DistrictID) === String(districtId))?.DistrictName || '';

        setAddressForm(prev => ({ ...prev, districtID: districtId, districtName, wardCode: '', wardName: '' }));

        if (districtId) {
            try {
                const response = await getWards(districtId);
                setWards(response.data.result || []);
            } catch (error) { console.error("Error fetching wards:", error); }
        } else { setWards([]); }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = wards.find(w => w.WardCode === wardCode)?.WardName || '';
        setAddressForm(prev => ({ ...prev, wardCode, wardName }));
    };

    const validateAddress = () => {
        const errors = {};
        if (!addressForm.recipientName.trim()) errors.recipientName = t('profile.address.recipient_error');
        if (!addressForm.recipientPhoneNumber.trim()) errors.recipientPhoneNumber = t('profile.address.phone_error');
        else if (!/^[0-9]{10,11}$/.test(addressForm.recipientPhoneNumber)) errors.recipientPhoneNumber = t('profile.general.error_sdt');
        if (!addressForm.provinceID) errors.provinceID = t('profile.address.province_error');
        if (!addressForm.districtID) errors.districtID = t('profile.address.district_error');
        if (!addressForm.wardCode) errors.wardCode = t('profile.address.ward_error');
        if (!addressForm.address.trim()) errors.address = t('profile.address.specific_error');
        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveAddress = async () => {
        if (!validateAddress()) return;
        try {
            setSaving(true);
            let response = editingAddressId ? await updateAddress(editingAddressId, addressForm) : await addAddress(addressForm);
            if (response.data?.result) {
                const updated = response.data.result;
                setAddresses(prev => {
                    const filtered = updated.defaultAddress ? prev.map(a => ({ ...a, defaultAddress: false })) : prev;
                    return editingAddressId ? filtered.map(a => a.id === editingAddressId ? updated : a) : [...filtered, updated];
                });
                setShowAddressForm(false);
                resetAddressForm();
                setAddressErrors({});
            }
        } catch (error) { alert(t('profile.general.failed') + (error.response?.data?.message || error.message)); }
        finally { setSaving(false); }
    };

    const resetAddressForm = () => {
        setAddressForm({ recipientName: '', recipientPhoneNumber: '', provinceID: '', provinceName: '', districtID: '', districtName: '', wardCode: '', wardName: '', address: '', defaultAddress: false });
        setEditingAddressId(null); setDistricts([]); setWards([]);
    };

    const handleEditAddress = async (addr) => {
        setEditingAddressId(addr.id);
        setAddressForm({ ...addr });
        try {
            const [distRes, wardRes] = await Promise.all([getDistricts(addr.provinceID), getWards(addr.districtID)]);
            setDistricts(distRes.data.result || []); setWards(wardRes.data.result || []);
            setShowAddressForm(true);
        } catch (error) { setShowAddressForm(true); }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm(t('profile.address.confirm_delete'))) return;
        try { await deleteAddress(id); setAddresses(prev => prev.filter(a => a.id !== id)); }
        catch (error) { alert(t('profile.general.failed') + error.message); }
    };

    const handleSetDefault = async (id) => {
        try {
            const res = await setDefaultAddress(id);
            if (res.data?.result) setAddresses(prev => prev.map(a => ({ ...a, defaultAddress: a.id === id })));
        } catch (error) { alert(t('profile.general.failed') + error.message); }
    };

    const handleAvatarClick = () => { if (isEditing) fileInputRef.current?.click(); };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setSelectedFile(file); setShowAvatarDialog(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleConfirmAvatar = async () => {
        setUploadingAvatar(true);
        try {
            const secureUrl = await uploadToCloudinary(selectedFile);
            if (secureUrl) {
                const updated = { ...profileData, avatarUrl: secureUrl };
                await updateMyProfile(updated); setProfileData(updated);
                await refreshProfile(); setShowAvatarDialog(false);
                alert(t('profile.general.success_update'));
            }
        } catch (error) { alert(t('profile.general.failed') + error.message); }
        finally { setUploadingAvatar(false); }
    };

    const handleCancelAvatar = () => {
        setShowAvatarDialog(false);
        if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null); setSelectedFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'firstName' || name === 'lastName') newData.fullName = `${newData.firstName || ''} ${newData.lastName || ''}`.trim();
            return newData;
        });
    };

    const validateProfile = () => {
        const errs = {};
        if (profileData.phoneNumber && !/^[0-9]{10,11}$/.test(profileData.phoneNumber)) errs.phoneNumber = t('profile.general.error_sdt');
        setProfileErrors(errs); return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validateProfile()) return;
        try {
            setSaving(true); await updateMyProfile(profileData);
            setIsEditing(false); await refreshProfile(); setProfileErrors({});
            alert(t('profile.general.success_update'));
        } catch (error) { alert(t('profile.general.failed') + (error.response?.data?.message || error.message)); }
        finally { setSaving(false); }
    };

    const handleTabChange = (tabId) => setSearchParams({ tab: tabId });

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        if (passwordError) setPasswordError('');
    };

    const submitPasswordChange = async () => {
        setPasswordError('');
        if (!passwordForm.oldPassword) return setPasswordError(t('profile.security.err_old'));
        if (passwordForm.newPassword.length < 6) return setPasswordError(t('profile.security.err_min'));
        if (passwordForm.newPassword !== passwordForm.confirmPassword) return setPasswordError(t('profile.security.err_match'));

        try {
            setChangingPassword(true); await changePassword(passwordForm);
            alert(t('profile.general.success_password'));
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) { setPasswordError(error.response?.data?.message || t('profile.general.failed') + 'password'); }
        finally { setChangingPassword(false); }
    };

    const TABS = [
        { id: 'profile', label: t('profile.tabs.profile'), icon: <PersonIcon fontSize="small" /> },
        { id: 'orders', label: t('profile.tabs.orders'), icon: <ShoppingBagIcon fontSize="small" /> },
        { id: 'vouchers', label: t('profile.tabs.vouchers'), icon: <ConfirmationNumberIcon fontSize="small" /> },
        { id: 'security', label: t('profile.tabs.security'), icon: <LockIcon fontSize="small" /> },
    ];

    if (loading) return <div className={styles.loading}>{t('profile.general.loading') || 'Initializing Profile...'}</div>;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <>
                        <ProfileTab 
                            profileData={profileData} isEditing={isEditing} setIsEditing={setIsEditing}
                            handleSave={handleSave} saving={saving} handleChange={handleChange}
                            profileErrors={profileErrors} handleAvatarClick={handleAvatarClick}
                        />
                        <AddressManager 
                            addresses={addresses} showAddressForm={showAddressForm} setShowAddressForm={setShowAddressForm}
                            resetAddressForm={resetAddressForm} editingAddressId={editingAddressId} addressForm={addressForm}
                            handleAddressInputChange={handleAddressInputChange} handleProvinceChange={handleProvinceChange}
                            handleDistrictChange={handleDistrictChange} handleWardChange={handleWardChange}
                            setAddressForm={setAddressForm} handleSaveAddress={handleSaveAddress}
                            handleEditAddress={handleEditAddress} handleDeleteAddress={handleDeleteAddress}
                            handleSetDefault={handleSetDefault} saving={saving} addressErrors={addressErrors}
                            provinces={provinces} districts={districts} wards={wards}
                        />
                    </>
                );
            case 'orders': return <OrdersTab orderTab={orderTab} setOrderTab={setOrderTab} />;
            case 'vouchers': return <VoucherTab voucherTab={voucherTab} setVoucherTab={setVoucherTab} />;
            case 'security': 
                return (
                    <SecurityTab 
                        passwordForm={passwordForm} handlePasswordInputChange={handlePasswordInputChange}
                        submitPasswordChange={submitPasswordChange} passwordError={passwordError}
                        changingPassword={changingPassword} username={profileData.username}
                    />
                );
            default: return null;
        }
    };

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                <div className={styles.layout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarHeader}>
                            <div className={styles.userBrief}>
                                <div className={styles.briefAvatar}>
                                    {profileData.avatarUrl ? (
                                        <CloudinaryImage publicId={profileData.avatarUrl} type="avatar" width={50} height={50} />
                                    ) : (
                                        <div className={styles.initialsAvatar}>{(profileData.fullName || 'U').charAt(0)}</div>
                                    )}
                                </div>
                                <div className={styles.briefInfo}>
                                    <p className={styles.briefUsername}>{profileData.fullName || 'User'}</p>
                                    <p className={styles.briefEdit} onClick={() => handleTabChange('profile')}>{t('profile.general.edit')}</p>
                                </div>
                            </div>
                        </div>
                        <nav className={styles.sidebarNav}>
                            {TABS.map(tab => (
                                <div key={tab.id} className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`} onClick={() => handleTabChange(tab.id)}>
                                    <span className={styles.navIcon}>{tab.icon}</span>
                                    <span className={styles.navLabel}>{tab.label}</span>
                                </div>
                            ))}
                        </nav>
                    </aside>
                    <main className={styles.content}>{renderTabContent()}</main>
                </div>
            </div>
            <SetAvatarDialog 
                open={showAvatarDialog} previewUrl={avatarPreview} loading={uploadingAvatar}
                onConfirm={handleConfirmAvatar} onCancel={handleCancelAvatar}
            />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
    );
};

export default Profile;
