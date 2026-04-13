import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Profile.module.scss';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const OrdersTab = ({ orderTab, setOrderTab }) => {
    const { t } = useTranslation();
    const TABS = [
        { id: 'all', label: t('profile.orders.tab_all') },
        { id: 'pending', label: t('profile.orders.tab_pending') },
        { id: 'confirmed', label: t('profile.orders.tab_confirmed') },
        { id: 'shipping', label: t('profile.orders.tab_shipping') },
        { id: 'delivered', label: t('profile.orders.tab_delivered') },
        { id: 'cancelled', label: t('profile.orders.tab_cancelled') },
    ];

    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>{t('profile.orders.title')}</h2>
            </div>
            <div className={styles.subTabs}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`${styles.subTab} ${orderTab === tab.id ? styles.active : ''}`}
                        onClick={() => setOrderTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={styles.subTabContent}>
                <div className={styles.emptyState}>
                    <ShoppingBagIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                    <p>{t('profile.orders.empty')}</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersTab;
