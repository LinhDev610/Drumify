import React, { useState, useEffect, useRef } from 'react';
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
    setDefaultAddress
} from '../../services/userService';
import { uploadToCloudinary } from '../../services/imageService';
import { CLOUDINARY_FOLDERS } from '../../configurations/configuration';
import SetAvatarDialog from '../../component/Profile/SetAvatarDialog';
import CloudinaryImage from '../../component/Common/CloudinaryImage';

const Profile = () => {
    const { tokenParsed } = useKeycloakAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Avatar states
    const [showAvatarDialog, setShowAvatarDialog] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

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

                // Fetch Profile and Provinces independently
                await Promise.allSettled([
                    getMyProfile().then(res => {
                        if (res.data?.result) {
                            const dbData = res.data.result;
                            setProfileData(prev => ({
                                ...prev,
                                ...dbData,
                                sex: dbData.sex ?? prev.sex
                            }));
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

        setAddressForm(prev => ({
            ...prev,
            provinceID: provinceId,
            provinceName: provinceName,
            districtID: '',
            districtName: '',
            wardCode: '',
            wardName: ''
        }));

        if (provinceId) {
            try {
                const response = await getDistricts(provinceId);
                setDistricts(response.data.result || []);
                setWards([]);
            } catch (error) {
                console.error("Error fetching districts:", error);
            }
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = e.target.value;
        const districtName = districts.find(d => String(d.DistrictID) === String(districtId))?.DistrictName || '';

        setAddressForm(prev => ({
            ...prev,
            districtID: districtId,
            districtName: districtName,
            wardCode: '',
            wardName: ''
        }));

        if (districtId) {
            try {
                const response = await getWards(districtId);
                setWards(response.data.result || []);
            } catch (error) {
                console.error("Error fetching wards:", error);
            }
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = wards.find(w => w.WardCode === wardCode)?.WardName || '';

        setAddressForm(prev => ({
            ...prev,
            wardCode: wardCode,
            wardName: wardName
        }));
    };

    const handleSaveAddress = async () => {
        try {
            setSaving(true);
            let response;
            if (editingAddressId) {
                response = await updateAddress(editingAddressId, addressForm);
            } else {
                response = await addAddress(addressForm);
            }

            if (response.data?.result) {
                const updatedAddress = response.data.result;
                if (editingAddressId) {
                    setAddresses(prev => prev.map(a => a.id === editingAddressId ? updatedAddress : (updatedAddress.defaultAddress ? { ...a, defaultAddress: false } : a)));
                } else {
                    setAddresses(prev => {
                        let newList = [...prev];
                        if (updatedAddress.defaultAddress) {
                            newList = newList.map(a => ({ ...a, defaultAddress: false }));
                        }
                        return [...newList, updatedAddress];
                    });
                }
                setShowAddressForm(false);
                resetAddressForm();
            }
        } catch (error) {
            alert("Lỗi khi lưu địa chỉ: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    const resetAddressForm = () => {
        setAddressForm({
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
        setEditingAddressId(null);
        setDistricts([]);
        setWards([]);
    };

    const handleEditAddress = async (addr) => {
        setEditingAddressId(addr.id);
        setAddressForm({
            recipientName: addr.recipientName,
            recipientPhoneNumber: addr.recipientPhoneNumber,
            provinceID: addr.provinceID,
            provinceName: addr.provinceName,
            districtID: addr.districtID,
            districtName: addr.districtName,
            wardCode: addr.wardCode,
            wardName: addr.wardName,
            address: addr.address,
            defaultAddress: addr.defaultAddress
        });

        try {
            // Pre-fetch districts and wards for editing
            const [distRes, wardRes] = await Promise.all([
                getDistricts(addr.provinceID),
                getWards(addr.districtID)
            ]);
            setDistricts(distRes.data.result || []);
            setWards(wardRes.data.result || []);
            setShowAddressForm(true);
        } catch (error) {
            console.error("Error fetching location data for edit:", error);
            setShowAddressForm(true);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
        try {
            await deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            alert("Lỗi khi xóa: " + error.message);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await setDefaultAddress(id);
            if (response.data?.result) {
                setAddresses(prev => prev.map(a => ({
                    ...a,
                    defaultAddress: a.id === id
                })));
            }
        } catch (error) {
            alert("Lỗi: " + error.message);
        }
    };

    const handleAvatarClick = () => {
        if (!isEditing) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setSelectedFile(file);
        setShowAvatarDialog(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleConfirmAvatar = async () => {
        setUploadingAvatar(true);
        try {
            const secureUrl = await uploadToCloudinary(selectedFile, CLOUDINARY_FOLDERS.AVATARS);
            if (secureUrl) {
                setProfileData(prev => ({ ...prev, avatarUrl: secureUrl }));
                setShowAvatarDialog(false);
            }
        } catch (error) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleCancelAvatar = () => {
        setShowAvatarDialog(false);
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(null);
        }
        setSelectedFile(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateMyProfile(profileData);
            setIsEditing(false);
            alert("Hồ sơ đã được cập nhật!");
        } catch (error) {
            alert("Lỗi khi lưu: " + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loading}>Initializing Profile...</div>;

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                {/* 1. Header Card - Visual Identity */}
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
                                    width={140}
                                    height={140}
                                    className={styles.avatarImg}
                                />
                            ) : (
                                <div className={styles.placeholderAvatar}>
                                    {profileData.fullName?.charAt(0) || profileData.username?.charAt(0)}
                                </div>
                            )}
                            {isEditing && <div className={styles.editOverlay}>Update</div>}
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
                                Edit Profile
                            </button>
                        ) : (
                            <div className={styles.btnGroup}>
                                <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Form Grid - Organized Data */}
                <div className={styles.mainGrid}>
                    {/* Account Stats / Basic Info */}
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Account Identity</h2>
                        <div className={styles.fieldGroup}>
                            <div className={styles.inputBox}>
                                <label>Username</label>
                                <input value={profileData.username} disabled className={styles.disabledInput} />
                            </div>
                            <div className={styles.inputBox}>
                                <label>Registered Email</label>
                                <input value={profileData.email} disabled className={styles.disabledInput} />
                            </div>
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Personal Details</h2>
                        <div className={styles.fieldGroup}>
                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>First Name</label>
                                    <input name="firstName" value={profileData.firstName || ''} onChange={handleChange} disabled={!isEditing} placeholder="First Name" />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Last Name</label>
                                    <input name="lastName" value={profileData.lastName || ''} onChange={handleChange} disabled={!isEditing} placeholder="Last Name" />
                                </div>
                            </div>
                            <div className={styles.inputBox}>
                                <label>Full Name</label>
                                <input name="fullName" value={profileData.fullName || ''} onChange={handleChange} disabled={!isEditing} placeholder="Your Full Name" />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.inputBox}>
                                    <label>Date of Birth</label>
                                    <input type="date" name="dob" value={profileData.dob || ''} onChange={handleChange} disabled={!isEditing} />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Gender</label>
                                    <select name="sex" value={profileData.sex ?? true} onChange={e => handleChange({ target: { name: 'sex', value: e.target.value === 'true' } })} disabled={!isEditing}>
                                        <option value="true">Male</option>
                                        <option value="false">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.infoCard} ${styles.fullRow}`}>
                        <div className={styles.cardHeaderWithAction}>
                            <h2 className={styles.cardTitle}>Address Management</h2>
                            <button
                                className={styles.addAddressBtn}
                                onClick={() => {
                                    resetAddressForm();
                                    setShowAddressForm(true);
                                }}
                            >
                                + Add New Address
                            </button>
                        </div>

                        {showAddressForm && (
                            <div className={styles.addressFormOverlay}>
                                <div className={styles.addressFormCard}>
                                    <h3>{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
                                    <div className={styles.addressGrid}>
                                        <div className={styles.inputBox}>
                                            <label>Recipient Name</label>
                                            <input
                                                name="recipientName"
                                                value={addressForm.recipientName}
                                                onChange={handleAddressInputChange}
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className={styles.inputBox}>
                                            <label>Phone Number</label>
                                            <input
                                                name="recipientPhoneNumber"
                                                value={addressForm.recipientPhoneNumber}
                                                onChange={handleAddressInputChange}
                                                placeholder="e.g. 0912345678"
                                            />
                                        </div>

                                        <div className={styles.selectRow}>
                                            <div className={styles.inputBox}>
                                                <label>Province/City</label>
                                                <select value={addressForm.provinceID} onChange={handleProvinceChange}>
                                                    <option value="">Select Province</option>
                                                    {provinces.map(p => (
                                                        <option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={styles.inputBox}>
                                                <label>District</label>
                                                <select value={addressForm.districtID} onChange={handleDistrictChange} disabled={!addressForm.provinceID}>
                                                    <option value="">Select District</option>
                                                    {districts.map(d => (
                                                        <option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className={styles.inputBox}>
                                                <label>Ward</label>
                                                <select value={addressForm.wardCode} onChange={handleWardChange} disabled={!addressForm.districtID}>
                                                    <option value="">Select Ward</option>
                                                    {wards.map(w => (
                                                        <option key={w.WardCode} value={w.WardCode}>{w.WardName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className={styles.inputBox}>
                                            <label>Detailed Address</label>
                                            <textarea
                                                name="address"
                                                value={addressForm.address}
                                                onChange={handleAddressInputChange}
                                                placeholder="House number, Street name..."
                                                rows={2}
                                            />
                                        </div>

                                        <div className={styles.checkboxBox}>
                                            <input
                                                type="checkbox"
                                                id="isDefault"
                                                name="defaultAddress"
                                                checked={addressForm.defaultAddress}
                                                onChange={e => setAddressForm(prev => ({ ...prev, defaultAddress: e.target.checked }))}
                                            />
                                            <label htmlFor="isDefault">Set as default address</label>
                                        </div>
                                    </div>
                                    <div className={styles.formActions}>
                                        <button className={styles.cancelLink} onClick={() => setShowAddressForm(false)}>Cancel</button>
                                        <button className={styles.saveAddressBtn} onClick={handleSaveAddress} disabled={saving}>
                                            {saving ? 'Saving...' : 'Save Address'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={styles.addressList}>
                            {addresses.length === 0 ? (
                                <p className={styles.noAddress}>No addresses saved yet.</p>
                            ) : (
                                addresses.map(addr => (
                                    <div key={addr.id} className={`${styles.addressCard} ${addr.defaultAddress ? styles.default : ''}`}>
                                        <div className={styles.addressInfo}>
                                            <div className={styles.recipientHeader}>
                                                <span className={styles.rName}>{addr.recipientName}</span>
                                                <span className={styles.rPhone}>{addr.recipientPhoneNumber}</span>
                                                {addr.defaultAddress && <span className={styles.defaultBadge}>Default</span>}
                                            </div>
                                            <p className={styles.fullAddressText}>
                                                {addr.address}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                                            </p>
                                        </div>
                                        <div className={styles.addrActions}>
                                            <button onClick={() => handleEditAddress(addr)}>Edit</button>
                                            <button onClick={() => handleDeleteAddress(addr.id)}>Delete</button>
                                            {!addr.defaultAddress && (
                                                <button onClick={() => handleSetDefault(addr.id)}>Set Default</button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SetAvatarDialog
                open={showAvatarDialog}
                previewUrl={avatarPreview}
                loading={uploadingAvatar}
                onConfirm={handleConfirmAvatar}
                onCancel={handleCancelAvatar}
            />
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        </div>
    );
};

export default Profile;
