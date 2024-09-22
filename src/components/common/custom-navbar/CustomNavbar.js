"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import styles from './CustomNavbar.module.css';

const CustomNavbar = () => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        let token = localStorage.getItem('token');
        if(token){
            setIsAuth(true)
        }
    }, []);

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarHeaderContainer}>
                <Link href="/">
                    <p className={styles.navBarHeader}>Home</p>
                </Link>
                <div className={styles.navBarHeaderSubContainer}>
                    <Link href="/submit">
                        <p className={styles.navBarAction}>Submit</p>
                    </Link>
                    {isAuth && <Link href="/moderate">
                        <p className={styles.navBarAction}>Moderate</p>
                    </Link>}
                </div>
            </div>
            <div className={styles.navBarActionContainer}>
                <Link href="/login">
                    <p className={styles.navBarAction}>Login</p>
                </Link>
            </div>
        </div>
    );
};

export default CustomNavbar;
