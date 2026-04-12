import React from 'react';
import styles from '../Profile.module.scss';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const VoucherTab = ({ voucherTab, setVoucherTab }) => {
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Ví Voucher</h2>
            </div>
            <div className={styles.subTabs}>
                <button
                    className={`${styles.subTab} ${voucherTab === 'vouchers' ? styles.active : ''}`}
                    onClick={() => setVoucherTab('vouchers')}
                >
                    Voucher của tôi
                </button>
                <button
                    className={`${styles.subTab} ${voucherTab === 'promotions' ? styles.active : ''}`}
                    onClick={() => setVoucherTab('promotions')}
                >
                    Chương trình khuyến mãi
                </button>
            </div>
            <div className={styles.subTabContent}>
                {voucherTab === 'vouchers' ? (
                    <div className={styles.emptyState}>
                        <ConfirmationNumberIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                        <p>Bạn chưa có voucher nào</p>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <LocalOfferIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                        <p>Hiện không có chương trình khuyến mãi nào</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherTab;
