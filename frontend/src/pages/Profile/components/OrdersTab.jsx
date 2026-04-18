import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../Profile.module.scss';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { getMyOrders } from '../../../services/orderService';
import { CircularProgress, Chip, Divider } from '@mui/material';

const OrdersTab = ({ orderTab, setOrderTab }) => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const TABS = [
        { id: 'all', label: t('profile.orders.tab_all') },
        { id: 'pending', label: t('profile.orders.tab_pending'), statuses: ['CREATED'] },
        { id: 'confirmed', label: t('profile.orders.tab_confirmed'), statuses: ['CONFIRMED', 'PAID'] },
        { id: 'shipping', label: t('profile.orders.tab_shipping'), statuses: ['SHIPPED'] },
        { id: 'delivered', label: t('profile.orders.tab_delivered'), statuses: ['DELIVERED'] },
        { id: 'cancelled', label: t('profile.orders.tab_cancelled'), statuses: ['CANCELLED'] },
    ];

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyOrders();
            setOrders(data || []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError(t('profile.orders.fetch_error') || "Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = orders.filter(order => {
        if (orderTab === 'all') return true;
        const currentTab = TABS.find(tab => tab.id === orderTab);
        return currentTab?.statuses?.includes(order.statusCode);
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'success';
            case 'CANCELLED': return 'error';
            case 'SHIPPED': return 'primary';
            case 'PAID':
            case 'CONFIRMED': return 'info';
            case 'CREATED': return 'warning';
            default: return 'default';
        }
    };

    return (
        <div className={styles.tabContent}>
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>{t('profile.orders.title')}</h2>
                <button className={styles.refreshBtn} onClick={fetchOrders} disabled={loading}>
                    {loading ? <CircularProgress size={16} color="inherit" /> : t('profile.general.refresh')}
                </button>
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
                {loading && orders.length === 0 ? (
                    <div className={styles.loadingState}>
                        <CircularProgress />
                        <p>{t('profile.general.loading')}</p>
                    </div>
                ) : error ? (
                    <div className={styles.errorState}>
                        <p>{error}</p>
                        <button onClick={fetchOrders}>{t('profile.general.retry')}</button>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className={styles.emptyState}>
                        <ShoppingBagIcon sx={{ fontSize: 60, opacity: 0.2 }} />
                        <p>{t('profile.orders.empty')}</p>
                    </div>
                ) : (
                    <div className={styles.orderList}>
                        {filteredOrders.map(order => (
                            <div key={order.id} className={styles.orderCard}>
                                <div className={styles.orderCardHeader}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderCode}>#{order.code}</span>
                                        <span className={styles.orderDate}>
                                            {new Date(order.orderAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Chip 
                                        label={order.status?.displayName || order.status || order.statusCode} 
                                        color={getStatusColor(order.statusCode)}
                                        size="small"
                                    />
                                </div>
                                <Divider sx={{ my: 1.5, opacity: 0.1 }} />
                                <div className={styles.orderItems}>
                                    {order.items?.map((item, idx) => (
                                        <div key={item.orderItemId || idx} className={styles.orderItem}>
                                            <div className={styles.itemMain}>
                                                <p className={styles.itemName}>{item.productName}</p>
                                                <p className={styles.itemVariant}>{item.variantName}</p>
                                            </div>
                                            <span className={styles.itemQty}>x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <Divider sx={{ my: 1.5, opacity: 0.1 }} />
                                <div className={styles.orderCardFooter}>
                                    <div className={styles.paymentMethod}>
                                        {t('profile.orders.payment')}: {order.paymentMethod}
                                    </div>
                                    {order.shipmentCreated && (
                                        <div className={styles.ghnCode}>
                                            GHN: {order.ghnOrderCode}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersTab;
