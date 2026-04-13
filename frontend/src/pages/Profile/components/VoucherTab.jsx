import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Profile.module.scss';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const VoucherTab = ({ voucherTab, setVoucherTab }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>{t('profile.vouchers.title')}</h2>
            </div>
            <div className={styles.subTabs}>
                <button
                    className={`${styles.subTab} ${voucherTab === 'vouchers' ? styles.active : ''}`}
                    onClick={() => setVoucherTab('vouchers')}
                >
                    {t('profile.vouchers.tab_mine')}
                </button>
                <button
                    className={`${styles.subTab} ${voucherTab === 'promotions' ? styles.active : ''}`}
                    onClick={() => setVoucherTab('promotions')}
                >
                    {t('profile.vouchers.tab_promotions')}
                </button>
            </div>
            <div className={styles.subTabContent}>
                {voucherTab === 'vouchers' ? (
                    <div className={styles.emptyState}>
                        <ConfirmationNumberIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                        <p>{t('profile.vouchers.empty_mine')}</p>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <LocalOfferIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                        <p>{t('profile.vouchers.empty_promotions')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoucherTab;
