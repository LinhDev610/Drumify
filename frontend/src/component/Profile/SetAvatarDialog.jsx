import React from 'react';
import { createPortal } from 'react-dom';
import styles from './SetAvatarDialog.module.scss';

/**
 * LilaShop-style Avatar Change Confirmation Dialog
 */
const SetAvatarDialog = ({
    open,
    previewUrl,
    title = 'Thay đổi ảnh đại diện',
    message = 'Bạn có chắc chắn muốn sử dụng ảnh này làm ảnh đại diện không?',
    confirmText = 'Cập nhật',
    cancelText = 'Hủy bỏ',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null;

    return createPortal(
        <div className={styles.overlay} onClick={loading ? undefined : onCancel}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button
                        className={styles.closeBtn}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>
                
                <div className={styles.body}>
                    {previewUrl && (
                        <div className={styles.previewContainer}>
                            <div className={styles.previewWrapper}>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className={styles.previewImage}
                                />
                            </div>
                        </div>
                    )}
                    <p className={styles.message}>{message}</p>
                </div>
                
                <div className={styles.footer}>
                    <button
                        className={`${styles.btn} ${styles.cancel}`}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.btn} ${styles.confirm}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className={styles.loader}>Đang tải...</span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SetAvatarDialog;
