import React from 'react';
import styles from '../Profile.module.scss';

const FormInput = ({ label, error, ...props }) => {
    return (
        <div className={styles.inputBox}>
            <label>{label}</label>
            <input {...props} />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};

export default FormInput;
