import React from 'react';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ id, isError, errorMessage, title, value, onChangeHandle, options = [],
                          isLabelAvailable = true, isSmall = false }) => {
    return (
        <div className={`${styles.customSelectContainer} ${isSmall && styles.customSmallSelectContainer}`}>
            {isLabelAvailable && <label className={styles.customSelectLabel}>
                {title}
            </label>}
            <select id={id} value={value} onChange={onChangeHandle} className={styles.customSelect}>
                <option value="" hidden>{title}</option>
                {options.map((option, index) => (
                    <option value={option} key={index}>
                        {option}
                    </option>
                ))}
            </select>
            {isError && <p className={styles.customSelectError}>{errorMessage}</p>}
        </div>
    );
};

export default CustomSelect;