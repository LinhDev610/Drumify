import React from 'react';
import styles from '../Profile.module.scss';

const AddressManager = ({
    addresses,
    showAddressForm,
    setShowAddressForm,
    resetAddressForm,
    editingAddressId,
    addressForm,
    handleAddressInputChange,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    setAddressForm,
    handleSaveAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefault,
    saving,
    addressErrors,
    provinces,
    districts,
    wards
}) => {
    return (
        <div className={`${styles.infoCard} ${styles.fullRow}`}>
            <div className={styles.cardHeaderWithAction}>
                <h2 className={styles.cardTitle}>Quản lý địa chỉ</h2>
                <button
                    className={styles.addAddressBtn}
                    onClick={() => {
                        resetAddressForm();
                        setShowAddressForm(true);
                    }}
                >
                    + Thêm địa chỉ mới
                </button>
            </div>

            {showAddressForm && (
                <div className={styles.addressFormOverlay}>
                    <div className={styles.addressFormCard}>
                        <h3>{editingAddressId ? 'Sửa địa chỉ' : 'Địa chỉ mới'}</h3>
                        <div className={styles.addressGrid}>
                            <div className={styles.inputBox}>
                                <label>Tên người nhận</label>
                                <input
                                    name="recipientName"
                                    value={addressForm.recipientName}
                                    onChange={handleAddressInputChange}
                                    maxLength={50}
                                />
                                {addressErrors.recipientName && <span className={styles.error}>{addressErrors.recipientName}</span>}
                            </div>
                            <div className={styles.inputBox}>
                                <label>Số điện thoại</label>
                                <input
                                    name="recipientPhoneNumber"
                                    value={addressForm.recipientPhoneNumber}
                                    onChange={handleAddressInputChange}
                                    maxLength={11}
                                />
                                {addressErrors.recipientPhoneNumber && <span className={styles.error}>{addressErrors.recipientPhoneNumber}</span>}
                            </div>

                            <div className={styles.selectRow}>
                                <div className={styles.inputBox}>
                                    <label>Tỉnh/Thành</label>
                                    <select value={addressForm.provinceID} onChange={handleProvinceChange}>
                                        <option value="">Chọn Tỉnh/Thành</option>
                                        {provinces.map(p => (
                                            <option key={p.ProvinceID} value={p.ProvinceID}>{p.ProvinceName}</option>
                                        ))}
                                    </select>
                                    {addressErrors.provinceID && <span className={styles.error}>{addressErrors.provinceID}</span>}
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Quận/Huyện</label>
                                    <select value={addressForm.districtID} onChange={handleDistrictChange} disabled={!addressForm.provinceID}>
                                        <option value="">Chọn Quận/Huyện</option>
                                        {districts.map(d => (
                                            <option key={d.DistrictID} value={d.DistrictID}>{d.DistrictName}</option>
                                        ))}
                                    </select>
                                    {addressErrors.districtID && <span className={styles.error}>{addressErrors.districtID}</span>}
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Phường/Xã</label>
                                    <select value={addressForm.wardCode} onChange={handleWardChange} disabled={!addressForm.districtID}>
                                        <option value="">Chọn Phường/Xã</option>
                                        {wards.map(w => (
                                            <option key={w.WardCode} value={w.WardCode}>{w.WardName}</option>
                                        ))}
                                    </select>
                                    {addressErrors.wardCode && <span className={styles.error}>{addressErrors.wardCode}</span>}
                                </div>
                            </div>

                            <div className={styles.inputBox}>
                                <label>Địa chỉ cụ thể</label>
                                <textarea
                                    name="address"
                                    value={addressForm.address}
                                    onChange={handleAddressInputChange}
                                    rows={2}
                                    maxLength={255}
                                />
                                {addressErrors.address && <span className={styles.error}>{addressErrors.address}</span>}
                            </div>

                            <div className={styles.checkboxBox}>
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="defaultAddress"
                                    checked={addressForm.defaultAddress}
                                    onChange={e => setAddressForm(prev => ({ ...prev, defaultAddress: e.target.checked }))}
                                />
                                <label htmlFor="isDefault">Đặt làm địa chỉ mặc định</label>
                            </div>
                        </div>
                        <div className={styles.formActions}>
                            <button className={styles.cancelLink} onClick={() => setShowAddressForm(false)}>Hủy</button>
                            <button className={styles.saveAddressBtn} onClick={handleSaveAddress} disabled={saving}>
                                {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.addressList}>
                {addresses.length === 0 ? (
                    <p className={styles.noAddress}>Chưa có địa chỉ nào được lưu.</p>
                ) : (
                    addresses.map(addr => (
                        <div key={addr.id} className={`${styles.addressCard} ${addr.defaultAddress ? styles.default : ''}`}>
                            <div className={styles.addressInfo}>
                                <div className={styles.recipientHeader}>
                                    <span className={styles.rName}>{addr.recipientName}</span>
                                    <span className={styles.rPhone}>{addr.recipientPhoneNumber}</span>
                                    {addr.defaultAddress && <span className={styles.defaultBadge}>Mặc định</span>}
                                </div>
                                <p className={styles.fullAddressText}>
                                    {addr.address}, {addr.wardName}, {addr.districtName}, {addr.provinceName}
                                </p>
                            </div>
                            <div className={styles.addrActions}>
                                <button onClick={() => handleEditAddress(addr)}>Sửa</button>
                                <button onClick={() => handleDeleteAddress(addr.id)}>Xóa</button>
                                {!addr.defaultAddress && (
                                    <button onClick={() => handleSetDefault(addr.id)}>Đặt làm mặc định</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AddressManager;
