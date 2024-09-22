import React from 'react';
import styles from './CustomTextArea.module.css';

const CustomTextArea = ({ id, isError, errorMessage, title, value, onChangeHandle, placeholder,
                            rows = 5 }) => {
    return (
        <div className={styles.customTextAreaContainer}>
            <label className={styles.customTextAreaLabel}>
                {title}
            </label>
            <textarea id={id} value={value} onChange={onChangeHandle} placeholder={placeholder}
                className={styles.customTextArea} rows={rows}></textarea>
            {isError && <p className={styles.customTextAreaError}>{errorMessage}</p>}
        </div>
    );
};

export default CustomTextArea;
