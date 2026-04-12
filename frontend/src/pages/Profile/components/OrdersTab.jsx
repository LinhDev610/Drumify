import React from 'react';
import styles from '../Profile.module.scss';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const OrdersTab = ({ orderTab, setOrderTab }) => {
    const TABS = [
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ xác nhận' },
        { id: 'confirmed', label: 'Chờ lấy hàng' },
        { id: 'shipping', label: 'Đang giao' },
        { id: 'delivered', label: 'Đã giao' },
        { id: 'cancelled', label: 'Đã hủy' },
    ];

    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Đơn hàng của tôi</h2>
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
                    <p>Chưa có đơn hàng nào trong mục này</p>
                </div>
            </div>
        </div>
    );
};

export default OrdersTab;
